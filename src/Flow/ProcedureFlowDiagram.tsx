import { v4 as uuidv4 } from "uuid";
import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  Panel,
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
import SaveLoadManager from "./SaveLoad.tsx";
import SideTab from "../Layout/SideTab.tsx";
import ActivityEditor from "../Layout/ActivityEditor.tsx";
import ActivityNode, { ActivityNodeObject } from "./ActivityNode.tsx";
import DynamicTextField from "../Layout/DynamicTextField.tsx";
import Procedure from "../Procedure/Procedure.ts";
import SubProcedure from "../Procedure/SubProcedure.ts";
import Activity, { ActivityDescription } from "../Procedure/Activity.ts";
import LoadNodes from "../Misc/LoadNodes.tsx";
import EventNode, { EventNodeObject } from "./EventNode.tsx";
import CustomEdge from "./CustomEdge.tsx";
import { instantiateNodeFromJsonObj } from "../Misc/SaveToDisk.ts";
import DecisionNode, { DecisionNodeObject } from "./DecisionNode.tsx";
import TitleBar from "../Layout/TitleBar.tsx";
import OperationMenu from "../Layout/OperationMenu.tsx";

function ProcedureFlowDiagram(props: {
  procedure: SubProcedure;
  setProcedure: React.Dispatch<React.SetStateAction<Procedure>>;
  handleSubProcedure: (newSubProcedure: SubProcedure) => void;
  handleProcedureUpdate: (ReactFlowJsonObject: ReactFlowJsonObject) => void;
  handleBackSubActivity: (subProcedure: SubProcedure) => void;
  handleSubmitTitle: (title: string) => void;
}) {
  const [nodes, setNodes] = useState<Node[]>(props.procedure.flow.nodes ?? []);
  const [edges, setEdges] = useState<Edge[]>(props.procedure.flow.edges ?? []);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [showSideTab, setShowSideTab] = useState(false);

  const flowRef = useRef(null);

  const propsFlow = props.procedure.flow;

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
    console.log("Flow:OnNodeClick");
    setSelectedNodeId(node.id);
  }, []);

  const onBlur = useCallback(() => {
    console.log("Flow:OnBlur");
    setSelectedNodeId(undefined);
  }, []);

  const saveProcedure = () => {
    props.handleProcedureUpdate(rfInstance!.toObject());
  };

  const handleBackSubActivity = (subProcedure: SubProcedure) => {
    saveProcedure();
    props.handleBackSubActivity(subProcedure);
  };

  //#region ActivityNode

  const onClickEdit = () => {
    setShowSideTab(true);

    if (!selectedNodeId) {
      console.log("SelectedNodeId undefined:" + selectedNodeId);
      return;
    }
  };

  const onClickSubProcedure = (subProcedure: SubProcedure) => {
    saveProcedure();

    //open the new sub procedure
    props.handleSubProcedure(subProcedure);
  };

  const onActivityEdited = (newActivity: Activity) => {
    if (selectedNodeId) onActivityChanged(selectedNodeId, newActivity);
  };

  const onClickDelete = useCallback(
    (nodeId: string) => {
      rfInstance!.deleteElements({
        nodes: [{ id: nodeId }],
      });
    },
    [rfInstance]
  );

  const onActivityNameChanged = useCallback((id: string, newName: string) => {
    //update label, activity name and subProcess name
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          node.data.activity.name = newName;
          node.data.activity.subProcedure.title = newName;
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
  }, []);

  const onActivityChanged = useCallback((id: string, newActivity: Activity) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, activity: newActivity },
          };
        } else {
          return node;
        }
      })
    );
  }, []);

  const createNewNode = useCallback(() => {
    const id = uuidv4();
    const label = "Procedura " + (nodes.length + 1);
    const position =
      rfInstance && flowRef.current
        ? rfInstance.screenToFlowPosition({
            x: (flowRef.current as Element).getBoundingClientRect().width / 2,
            y: (flowRef.current as Element).getBoundingClientRect().height / 2,
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
          new SubProcedure(undefined, label, props.procedure),
          undefined
        ),
        onClickEdit: onClickEdit,
        onClickDelete: onClickDelete,
        onActivityNameChanged: onActivityNameChanged,
        onClickSubProcedure: onClickSubProcedure,
      },
      type: "activityNode",
    };
    return obj;
  }, [rfInstance, nodes.length, onClickDelete, onActivityNameChanged]);

  const addNode = useCallback(() => {
    const newNode = createNewNode();
    setNodes((nodes) => [...nodes, newNode]);
  }, [createNewNode]);

  const instantiateActivity = (activityDescription: ActivityDescription) => {
    const newNode = createExistingNode(activityDescription);
    setNodes((nodes) => [...nodes, newNode]);
  };

  const createExistingNode = useCallback(
    (activityDescription: ActivityDescription) => {
      const id = uuidv4();
      const label = activityDescription.name;
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
            new SubProcedure(undefined, label, props.procedure),
            activityDescription.languages
          ),
          onClickEdit: onClickEdit,
          onClickDelete: onClickDelete,
          onActivityNameChanged: onActivityNameChanged,
          onClickSubProcedure: onClickSubProcedure,
        },
        type: "activityNode",
      };
      return obj;
    },
    [rfInstance, nodes.length, onClickDelete, onActivityNameChanged]
  );

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

  const OffcanvasTitle = useMemo(() => {
    const node = rfInstance?.getNode(selectedNodeId!);
    const name = node ? (node.data.label as string) : "";

    return (
      <Row>
        <div style={{ width: "100%" }}>
          <DynamicTextField
            initialValue={name}
            onSubmit={(name: string) =>
              onActivityNameChanged(selectedNodeId!, name)
            }
            baseProps={{ size: "lg", placeholder: "Activity" }}
          />
        </div>
      </Row>
    );
  }, [
    rfInstance,
    selectedNodeId,
    props.procedure,
    onActivityNameChanged,
    nodes,
  ]);

  const getTypeNodeFromId = (id: string) => {
    var node = nodes[0];
    //setNodes has always the updated value
    setNodes((prevNodes) => {
      node = prevNodes.find((x) => x.id === id) ?? prevNodes[0];
      return prevNodes;
    });
    return node.type;
  };

  //#region EventNode

  const onEventNameChanged = useCallback((id: string, newName: string) => {
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
  }, []);

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
        onClickDelete: onClickDelete,
        onEventNameChanged: onEventNameChanged,
      },
      type: "eventNode",
    };
    return obj;
  }, [rfInstance, nodes.length, onClickDelete, onEventNameChanged]);

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
        onClickDelete: onClickDelete,
        onEventNameChanged: onEventNameChanged,
      },
      type: "decisionNode",
    };
    return obj;
  }, [rfInstance, nodes.length, onClickDelete, onEventNameChanged]);

  const addDecisionNode = () => {
    const newNode = createNewDecisionNode();
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };
  //#endregion

  const restoreFlow = useCallback(
    (flow: ReactFlowJsonObject, title: string) => {
      console.log("Restore Flow");

      const activityCallbacks = {
        onClickEdit: onClickEdit,
        onClickDelete: onClickDelete,
        onActivityNameChanged: onActivityNameChanged,
        onClickSubProcedure: onClickSubProcedure,
      };
      const eventCallbacks = {
        onClickDelete: onClickDelete,
        onEventNameChanged: onEventNameChanged,
      };

      const newProcedure = props.procedure.cloneAndSetTitle(title);
      //try {
      const newNodes = instantiateNodeFromJsonObj(
        flow,
        newProcedure,
        activityCallbacks,
        eventCallbacks
      );

      props.setProcedure((procedure) =>
        procedure.cloneAndAddFlow({
          nodes: newNodes,
          edges: flow.edges,
          viewport: flow.viewport,
        })
      );
      /*} catch {
        console.error(flow);
        setNodes([]);
        setEdges([]);
      }*/
    },
    [
      rfInstance,
      setNodes,
      setEdges,
      onClickDelete,
      onActivityNameChanged,
      onClickSubProcedure,
      onEventNameChanged,
    ]
  );

  return (
    <Container fluid>
      <Row>
        <TitleBar
          subProcedure={props.procedure}
          handleBackSubActivity={handleBackSubActivity}
          handleSubmitTitle={props.handleSubmitTitle}
        />

        <OperationMenu
          addNode={addNode}
          addEventNode={addEventNode}
          addDecisionNode={addDecisionNode}
          restoreFlow={restoreFlow}
          rfInstance={rfInstance!}
          procedureTitle={""}
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
            deleteKeyCode={["Backspace", "Delete"]}
            style={{ border: "1px solid black" }}
            ref={flowRef}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </Col>
      </Row>

      {/* SideTab: opzioni dinamiche */}
      <SideTab
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
      </SideTab>
    </Container>
  );
}

export default ProcedureFlowDiagram;
