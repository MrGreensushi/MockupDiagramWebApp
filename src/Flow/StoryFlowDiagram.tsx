import { v4 as uuidv4 } from "uuid";
import React, { useCallback, useState, useMemo, useEffect, useRef } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { ReactFlow, Controls, Background, applyNodeChanges, Panel, ReactFlowInstance, Edge, NodeChange, Node, addEdge, Connection, EdgeChange, applyEdgeChanges, ReactFlowJsonObject } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SaveLoadManager from "./SaveLoad.tsx";
import SideTab from "../Layout/SideTab.tsx";
import SceneEditor from "../Layout/SceneEditor.tsx";
import SceneNode, { SceneNodeObject } from "./SceneNode.tsx";
import Story from "../StoryElements/Story.ts";
import Scene from "../StoryElements/Scene.ts";

function StoryFlowDiagram (props: {story: Story, setStory: React.Dispatch<React.SetStateAction<Story>>}) {
  const [nodes, setNodes] = useState<Node[]>(props.story.flow.nodes ?? []);
  const [edges, setEdges] = useState<Edge[]>(props.story.flow.edges ?? []);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [showSideTab, setShowSideTab] = useState(false);

  const flowRef = useRef(null);

  const propsFlow = props.story.flow;

  useEffect(() => {
    setNodes(propsFlow.nodes);
    setEdges(propsFlow.edges)
  }, [propsFlow]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nodes => applyNodeChanges(changes, nodes));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(edges => applyEdgeChanges(changes, edges));
  }, []);
  
  const onConnect = useCallback((connection: Connection) =>
      setEdges((eds) =>
        addEdge({ ...connection }, eds),
      ),
    [],
  );

  const onNodeClick = useCallback((_, node: Node) => {
    setSelectedNodeId(node.id);  
  }, []);

  const onBlur = useCallback(() => {
    setSelectedNodeId(undefined);
  }, []);

  const onClickEdit = () => {
    setShowSideTab(true);
  };

  const onSceneEdited = (newScene: Scene) => {
    if (selectedNodeId) onSceneChanged(selectedNodeId, newScene)
  }

  const onClickDelete = useCallback((nodeId: string) => {
    rfInstance!.deleteElements({
      nodes: [{ id: nodeId }],
    });
  }, [rfInstance]);

  const onLabelChanged = useCallback((id: string, newName: string) => {
    setNodes(nodes => nodes.map(
      node => {
        if (node.id === id) {
          return {...node, data: {...node.data, label: newName}}
        } else {
          return node
        }
      }
    ))}, []);

  const onSceneChanged = useCallback((id: string, newScene: Scene) => {
    setNodes(nodes => nodes.map(
      node => {
        if (node.id === id) {
          return {...node, data: {...node.data, scene: newScene.copy()}}
        } else {
          return node
        }
      }
    ))}, []);

  const createNewNode = useCallback(() => {
    const id = uuidv4();
    const label = "Scena " + (nodes.length + 1);
    const position = 
      (rfInstance && flowRef.current) ? 
        rfInstance.screenToFlowPosition({
          x: (flowRef.current as Element).getBoundingClientRect().width/2,
          y: (flowRef.current as Element).getBoundingClientRect().height/2})
      :
        {x: 0, y: 0};
    const obj: SceneNodeObject = {
      id: id,
      position: {
        x: position?.x ?? 0,
        y: position?.y ?? 0
      },
      data: {
        label: label,
        scene: new Scene(undefined),
        onClickEdit: onClickEdit,
        onClickDelete: onClickDelete,
        onLabelChanged: onLabelChanged
      }, 
      type: "sceneNode"
    };
    return obj;
  }, [nodes.length, onClickDelete, onLabelChanged, rfInstance]);

  const restoreFlow = useCallback(
    (flow: ReactFlowJsonObject) => {
      try {
        const newNodes = [...flow.nodes].map(
          node => {
            return {...node, data: {
              ...node.data,
              scene: Scene.fromJSON(node.data.scene as string),
              onClickEdit: onClickEdit,
              onClickDelete: onClickDelete,
              onLabelChanged: onLabelChanged
            }}
          }
        );
        props.setStory(
          story => story.cloneAndAddFlow({
            nodes: newNodes,
            edges: flow.edges,
            viewport: flow.viewport
          })
        );
      } catch {
        console.error(flow);
        setNodes([]);
        setEdges([]);
      }
    },
    [rfInstance, setNodes, setEdges, onClickDelete, onLabelChanged]
  );

  const addNode = useCallback(() => {
    const newNode = createNewNode();
    setNodes(nodes => [...nodes, newNode]);
  }, [createNewNode]);
  
  const nodeTypes = useMemo(() => ({sceneNode: SceneNode}), []);

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
          deleteKeyCode={['Backspace', 'Delete']}
          style={{ border: "1px solid black" }}
          ref={flowRef}
          fitView >
          <Panel>
            <Button variant="primary" onClick={addNode} style={{ marginBottom: "10px" } }>
              Aggiungi Scena
            </Button>
          </Panel>
          {rfInstance && 
            <SaveLoadManager
              rfInstance={rfInstance}
              story={props.story}
              setStory={props.setStory}
              nodes={nodes}
              edges={edges}
              restoreFlow={restoreFlow}
            />
          }
          <Controls />
          <Background />
        </ReactFlow>
        <SideTab 
          title={rfInstance?.getNode(selectedNodeId!)?.data.label as string}
          showSideTab={showSideTab}
          setShowSideTab={setShowSideTab} >
          {showSideTab &&
            <SceneEditor 
              story={props.story}
              setStory={props.setStory}
              scene={rfInstance?.getNode(selectedNodeId!)?.data.scene as Scene}
              setScene={onSceneEdited} />
          }
        </SideTab>
      </Row>
    </Container>
  );
};

export default StoryFlowDiagram;
