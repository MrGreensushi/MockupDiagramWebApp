import { v4 as uuidv4 } from "uuid";
import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  ReactFlowInstance,
  Edge,
  NodeChange,
  Node,
  addEdge,
  Connection,
  EdgeChange,
  applyEdgeChanges,
  ReactFlowJsonObject,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ActivityNode, { ActivityNodeObject } from "./ActivityNode.tsx";
import DynamicTextField from "../Layout/DynamicTextField.tsx";
import Procedure from "../Procedure/Procedure.ts";
import Activity, {
  ActivityDescription,
  Phrase,
} from "../Procedure/Activity.ts";
import LoadNodes from "../Layout/LoadedNodes.tsx";
import EventNode, { EventNodeObject } from "./EventNode.tsx";
import CustomEdge from "./CustomEdge.tsx";
import { instantiateNodeFromJsonObj } from "../Misc/SaveToDisk.ts";
import DecisionNode, { DecisionNodeObject } from "./DecisionNode.tsx";
import TitleBar from "../Layout/TitleBar.tsx";
import OperationMenu from "../Layout/OperationMenu.tsx";
import NodeEditor from "./NodeEditor.tsx";

function ProcedureFlowDiagram(props: {
  activeProcedure: Procedure;
  setActiveProcedure: (procedureId: string) => void;
  handleActiveProcedureUpdate: (
    ReactFlowJsonObject: ReactFlowJsonObject
  ) => void;
  handleSubmitTitle: (title: string) => void;
  addProcedure: (newProcedure: Procedure) => void;
  getProcedure: (procedureId: string) => Procedure | undefined;
  updateProcedureById: (
    id: string,
    flow?: ReactFlowJsonObject,
    title?: string
  ) => void;
}) {
  const [nodes, setNodes] = useState<Node[]>(
    props.activeProcedure.flow.nodes ?? []
  );
  const [edges, setEdges] = useState<Edge[]>(
    props.activeProcedure.flow.edges ?? []
  );
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const [selectedNodeId, setSelectedNodeId] = useState<string>();

  const flowRef = useRef(null);

  const propsFlow = props.activeProcedure.flow;

  useEffect(() => {
    setNodes(propsFlow.nodes);
    setEdges(propsFlow.edges);
  }, [propsFlow]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nodes) => applyNodeChanges(changes, nodes));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((edges) => applyEdgeChanges(changes, edges));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    const type = getTypeNodeFromId(connection.source);

    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          markerEnd: { type: MarkerType.ArrowClosed },
          data: { sourceNodeType: type },
          type: "customEdge",
        },
        eds
      )
    );
  }, []);

  const onNodeClick = useCallback((_, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    setSelectedNodeId(undefined);
  }, []);

  const saveActiveProcedure = () => {
    props.handleActiveProcedureUpdate(rfInstance!.toObject());
  };

  const changeActiveProcedure = (procedureId: string) => {
    saveActiveProcedure();
    setSelectedNodeId(undefined);
    //open the new sub procedure
    props.setActiveProcedure(procedureId);
  };

  //#region ActivityNode

  const onSelectedActivityEdited = (
    newPhrases?: Phrase[],
    details?: string,
    newName?: string
  ) => {
    if (selectedNodeId)
      onActivityChanged(selectedNodeId, newPhrases, details, newName);
  };

  const onClickDelete = useCallback(
    (nodeId: string) => {
      rfInstance!.deleteElements({
        nodes: [{ id: nodeId }],
      });

      setSelectedNodeId(undefined);
    },
    [rfInstance]
  );

  const createNewProcedure = (title: string, parentProcedureId: string) => {
    //create new subProcedure and update the activity
    const id = uuidv4();
    const procedure = new Procedure(undefined, title, id, parentProcedureId);
    props.addProcedure(procedure);
    return procedure;
  };

  const onActivityChanged = useCallback(
    (id: string, newPhrases?: Phrase[], details?: string, newName?: string) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            var newActivity = node.data.activity as Activity;
            newActivity = newActivity.cloneAndSet(newPhrases, details, newName);

            //update the title of the subProcedure
            props.updateProcedureById(
              newActivity.subProcedureId,
              undefined,
              newName
            );

            return {
              ...node,
              data: {
                ...node.data,
                activity: newActivity,
                label: newActivity.name,
              },
            };
          } else {
            return node;
          }
        })
      );
    },
    []
  );

  const createNewActivityNode = useCallback(
    (activityDescription?: ActivityDescription) => {
      const id = uuidv4();
      const label =
        activityDescription?.name ?? "Procedure " + (nodes.length + 1);

      //create new Procedure to set as subProcedure of this node
      const subProcedure = createNewProcedure(label, props.activeProcedure.id);

      const position =
        rfInstance && flowRef.current
          ? rfInstance.screenToFlowPosition({
              x: (flowRef.current as Element).getBoundingClientRect().width / 2,
              y:
                (flowRef.current as Element).getBoundingClientRect().height / 2,
            })
          : { x: 0, y: 0 };
      const obj: ActivityNodeObject = {
        id: id,
        position: {
          x: position?.x ?? 0,
          y: position?.y ?? 0,
        },
        data: {
          label: label,
          activity: new Activity(
            label,
            subProcedure.id,
            activityDescription?.languages
          ),
          onDoubleClickActivity: changeActiveProcedure,
        },
        type: "activityNode",
      };
      return obj;
    },
    [rfInstance, nodes.length, changeActiveProcedure]
  );

  const addNode = useCallback(() => {
    const newNode = createNewActivityNode();
    setNodes((nodes) => [...nodes, newNode]);
  }, [createNewActivityNode]);

  const instantiateActivity = (activityDescription: ActivityDescription) => {
    const newNode = createNewActivityNode(activityDescription);
    setNodes((nodes) => [...nodes, newNode]);
  };

  //#endregion

  const nodeTypes = useMemo(
    () => ({
      activityNode: ActivityNode,
      eventNode: EventNode,
      decisionNode: DecisionNode,
    }),
    []
  );

  const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

  const getTypeNodeFromId = (id: string) => {
    var node = nodes[0];
    //setNodes has always the updated value
    setNodes((prevNodes) => {
      node = prevNodes.find((x) => x.id === id) ?? prevNodes[0];
      return prevNodes;
    });
    return node.type;
  };

  //#region EventNode & DecisionNode

  const onEventorDecisionNameChanged = useCallback(
    (id: string, newName: string) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newName,
              },
            };
          } else {
            return node;
          }
        })
      );
    },
    []
  );

  const createNewEventNode = useCallback(() => {
    const id = uuidv4();
    const label = "Event " + nodes.length;
    const position =
      rfInstance && flowRef.current
        ? rfInstance.screenToFlowPosition({
            x: (flowRef.current as Element).getBoundingClientRect().width / 2,
            y: (flowRef.current as Element).getBoundingClientRect().height / 2,
          })
        : { x: 0, y: 0 };
    const obj: EventNodeObject = {
      id: id,
      position: {
        x: position?.x ?? 0,
        y: position?.y ?? 0,
      },
      data: {
        label: label,
      },
      type: "eventNode",
    };
    return obj;
  }, [rfInstance, nodes.length, onClickDelete, onEventorDecisionNameChanged]);

  const addEventNode = () => {
    const newNode = createNewEventNode();
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const createNewDecisionNode = useCallback(() => {
    const id = uuidv4();
    const label = "Decision " + nodes.length;
    const position =
      rfInstance && flowRef.current
        ? rfInstance.screenToFlowPosition({
            x: (flowRef.current as Element).getBoundingClientRect().width / 2,
            y: (flowRef.current as Element).getBoundingClientRect().height / 2,
          })
        : { x: 0, y: 0 };
    const obj: DecisionNodeObject = {
      id: id,
      position: {
        x: position?.x ?? 0,
        y: position?.y ?? 0,
      },
      data: {
        label: label,
      },
      type: "decisionNode",
    };
    return obj;
  }, [rfInstance, nodes.length, onClickDelete, onEventorDecisionNameChanged]);

  const addDecisionNode = () => {
    const newNode = createNewDecisionNode();
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };
  //#endregion

  const restoreFlow = useCallback(
    (flow: ReactFlowJsonObject, title: string) => {
      // console.log("Restore Flow");
      // const activityCallbacks = {
      //   onClickSubProcedure: onDoubleClickActivity,
      // };
      // const newProcedure = props.activeProcedure.cloneAndSetTitle(title);
      // //try {
      // const newNodes = instantiateNodeFromJsonObj(
      //   flow,
      //   newProcedure,
      //   activityCallbacks
      // );
      // props.setProcedure((procedure) =>
      //   procedure.cloneAndAddFlow({
      //     nodes: newNodes,
      //     edges: flow.edges,
      //     viewport: flow.viewport,
      //   })
      // );
      /*} catch {
        console.error(flow);
        setNodes([]);
        setEdges([]);
      }*/
    },
    [rfInstance, setNodes, setEdges, changeActiveProcedure]
  );

  return (
    <Container fluid>
      <Row>
        <TitleBar
          activeProcedure={props.activeProcedure}
          changeActiveProcedure={changeActiveProcedure}
          handleSubmitTitle={props.handleSubmitTitle}
          getProcedure={props.getProcedure}
        />

        <OperationMenu
          addNode={addNode}
          addEventNode={addEventNode}
          addDecisionNode={addDecisionNode}
          restoreFlow={restoreFlow}
          rfInstance={rfInstance!}
          procedureTitle={
            props.activeProcedure.title ?? "Procedura senza titolo"
          }
          setProcedure={props.setProcedure}
        />
      </Row>
      <Row className="p-2">
        <Col xs={2}>
          <LoadNodes instantiateActvity={instantiateActivity} />
        </Col>
        <Col>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onInit={setRfInstance}
            onPaneClick={onPaneClick}
            deleteKeyCode={["Backspace", "Delete"]}
            style={{ border: "1px solid black" }}
            ref={flowRef}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </Col>

        <Col xs={2}>
          <NodeEditor
            procedure={props.activeProcedure}
            selectedNode={
              selectedNodeId ? rfInstance?.getNode(selectedNodeId) : undefined
            }
            setActivity={onSelectedActivityEdited}
            setEventOrDecisionName={onEventorDecisionNameChanged}
          />
        </Col>
      </Row>

      {/* SideTab: opzioni dinamiche */}
      {/* <SideTab
        title={OffcanvasTitle}
        showSideTab={showSideTab}
        setShowSideTab={setShowSideTab}
      >
        {showSideTab && (
          <ActivityEditor
            procedure={props.procedure}
            activity={
              rfInstance?.getNode(selectedNodeId!)?.data.activity as Activity
            }
            setActivity={onActivityEdited}
          />
        )}
      </SideTab> */}
    </Container>
  );
}

export default ProcedureFlowDiagram;
