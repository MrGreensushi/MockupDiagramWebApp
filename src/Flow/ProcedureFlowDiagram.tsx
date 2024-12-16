import { v4 as uuidv4 } from "uuid";
import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Button, Container, Row } from "react-bootstrap";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SaveLoadManager from "./SaveLoad.tsx";
import SideTab from "../Layout/SideTab.tsx";
import ActivityEditor from "../Layout/ActivityEditor.tsx";
import ActivityNode, { ActivityNodeObject } from "./ActivityNode.tsx";
import DynamicTextField from "../Layout/DynamicTextField.tsx";
import Procedure from "../Procedure/Procedure.ts";
import Activity from "../Procedure/Activity.ts";

function ProcedureFlowDiagram(props: {
  procedure: Procedure;
  setProcedure: React.Dispatch<React.SetStateAction<Procedure>>;
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

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection }, eds)),
    []
  );

  const onNodeClick = useCallback((_, node: Node) => {
    console.log("Flow:OnNodeClick");
    setSelectedNodeId(node.id);
  }, []);

  const onBlur = useCallback(() => {
    console.log("Flow:OnBlur");
    setSelectedNodeId(undefined);
  }, []);

  const onClickEdit = () => {
    setShowSideTab(true);
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
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label: newName } };
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
            data: { ...node.data, activity: newActivity.copy() },
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
        activity: new Activity(label),
        onClickEdit: onClickEdit,
        onClickDelete: onClickDelete,
        onActivityNameChanged: onActivityNameChanged,
      },
      type: "activityNode",
    };
    return obj;
  }, [rfInstance, nodes.length, onClickDelete, onActivityNameChanged]);

  const restoreFlow = useCallback(
    (flow: ReactFlowJsonObject) => {
      //try {
      const newNodes = [...flow.nodes].map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            activity: Activity.fromJSONObject(node.data.activity),
            onClickEdit: onClickEdit,
            onClickDelete: onClickDelete,
            onActivityNameChanged: onActivityNameChanged,
          },
        };
      });
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
    [rfInstance, setNodes, setEdges, onClickDelete, onActivityNameChanged]
  );

  const addNode = useCallback(() => {
    const newNode = createNewNode();
    setNodes((nodes) => [...nodes, newNode]);
  }, [createNewNode]);

  const nodeTypes = useMemo(() => ({ activityNode: ActivityNode }), []);

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

  return (
    <Container fluid style={{ height: "90vh", padding: "1%" }}>
      <Row style={{ height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          //onBlur={onBlur}
          onInit={setRfInstance}
          deleteKeyCode={["Backspace", "Delete"]}
          style={{ border: "1px solid black" }}
          ref={flowRef}
          fitView
        >
          <Panel>
            <Button
              variant="primary"
              onClick={addNode}
              style={{ marginBottom: "10px" }}
            >
              Aggiungi Scena
            </Button>
          </Panel>
          {rfInstance && (
            <SaveLoadManager
              rfInstance={rfInstance}
              procedure={props.procedure}
              setProcedure={props.setProcedure}
              nodes={nodes}
              edges={edges}
              restoreFlow={restoreFlow}
            />
          )}
          <Controls />
          <Background />
        </ReactFlow>
        <SideTab
          title={OffcanvasTitle}
          showSideTab={showSideTab}
          setShowSideTab={setShowSideTab}
        >
          {showSideTab && (
            <ActivityEditor
              procedure={props.procedure}
              setProcedure={props.setProcedure}
              activity={
                rfInstance?.getNode(selectedNodeId!)?.data.activity as Activity
              }
              setActivity={onActivityEdited}
            />
          )}
        </SideTab>
      </Row>
    </Container>
  );
}

export default ProcedureFlowDiagram;
