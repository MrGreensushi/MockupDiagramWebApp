import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import React, { useCallback, useState, useMemo, useEffect, useRef } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { ReactFlow, Controls, Background, applyNodeChanges, Panel, ReactFlowInstance, Edge, NodeChange, Node, addEdge, Connection, EdgeChange, applyEdgeChanges, MarkerType } from "@xyflow/react";
import SideTab from "../Layout/SideTab.tsx";
import SceneEditor from "../Layout/SceneEditor.tsx";
import SceneNode, { createNewSceneNode, SceneNodeProps } from "./SceneNode.tsx";
import Story from "../StoryElements/Story.ts";
import Scene from "../StoryElements/Scene.ts";
import DynamicTextField from "../Layout/DynamicTextField.tsx";

function StoryFlowChartEditor (props: {
  story: Story,
  setStory: React.Dispatch<React.SetStateAction<Story>>,
  onClickEditNode: (id: string) => void,
}) {
  const story = props.story;
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [showSideTab, setShowSideTab] = useState(false);

  const flowRef = useRef(null);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nodes => applyNodeChanges(changes, nodes));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(edges => applyEdgeChanges(changes, edges));
  }, []);
  
  const onConnect = useCallback((connection: Connection) =>
    setEdges(eds => addEdge({ ...connection, markerEnd: {type: MarkerType.ArrowClosed, width: 15, height: 15} }, eds),
  ), []);

  const onNodeClick = useCallback((_, node: Node) => {
    setSelectedNodeId(node.id);  
  }, []);

  const onNodeContextMenu = useCallback((_, node: Node) => {
    setSelectedNodeId(node.id);  
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(undefined);
  }, []);

  const onClickEdit = useCallback((id: string) => {
    props.onClickEditNode(id);
  }, [props.onClickEditNode]);

  const onClickDelete = useCallback((nodeId: string) => {
    setNodes(nodes => nodes.filter(
      node => node.id !== nodeId
    ));
  }, []);
  
  const onSceneEdited = useCallback((newScene: Scene) => {
    if (selectedNodeId) {
      setNodes(nodes => nodes.map(
        node => {
          if (node.id === selectedNodeId) {
            return {...node, data: {...node.data, scene: newScene.copy()}};
          } else {
            return node;
          }
        }
      ));
    }
  }, [selectedNodeId]);

  const onSceneNameChanged = useCallback((id: string, newName: string) => {
    setNodes(nodes => nodes.map(
      node => {
        if (node.id === id) {
          return {...node, data: {...node.data, label: newName}};
        } else {
          return node;
        }
      }
    ))}, []);
  
  const onSceneTitleChanged = useCallback((id: string, newTitle: string) => {
    setNodes(nodes => nodes.map(
      node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              scene: {
                ...(node.data.scene as Scene),
                details: {
                  ...(node.data.scene as Scene).details,
                  title: newTitle
                }
              }
            }
          };
        } else {
          return node;
        }
      }
    )
  )}, []);

  const addNewNode = useCallback(() => {
    const id = uuidv4();
    const label = "Scena " + (nodes.length + 1);
    const position = 
      (rfInstance && flowRef.current) ? 
        rfInstance.screenToFlowPosition({
          x: (flowRef.current as Element).getBoundingClientRect().width/2,
          y: (flowRef.current as Element).getBoundingClientRect().height/2})
        :
        {x: 0, y: 0};
    const newNode = createNewSceneNode(
      id,
      {onClickEdit: () => onClickEdit(id),
      onClickDelete: () => onClickDelete(id),
      onSceneNameChanged: (name: string) => onSceneNameChanged(id, name),
      onSceneTitleChanged: (title: string) => onSceneTitleChanged(id, title)},
      label,
      position);
    setNodes(nodes => [...nodes, newNode]);
  }, [rfInstance, flowRef, nodes, setNodes, onClickEdit, onClickDelete, onSceneNameChanged, onSceneTitleChanged]);

  const addExistingNode = useCallback((node: Node) => {
    const newNode = createNewSceneNode(
      node.id,
      {onClickEdit: () => onClickEdit(node.id),
      onClickDelete: () => onClickDelete(node.id),
      onSceneNameChanged: (name: string) => onSceneNameChanged(node.id, name),
      onSceneTitleChanged: (title: string) => onSceneTitleChanged(node.id, title)},
      undefined,
      node.position,
      node.data as SceneNodeProps);
    setNodes(nodes => [...nodes, newNode]);
  }, [onClickEdit, onClickDelete, onSceneNameChanged, onSceneTitleChanged])

  const handleInit = useCallback((rfInstance: ReactFlowInstance) => {
    story.flow.nodes.forEach(node => addExistingNode(node));
    setEdges(story.flow.edges);
    rfInstance.fitView();
    setRfInstance(rfInstance);
  }, [story, addExistingNode]);

  useEffect(() => {
    if (rfInstance) 
      props.setStory(story.cloneAndAddFlow({nodes: nodes, edges: edges, viewport: rfInstance.getViewport()}))
  }, [nodes, edges, rfInstance])
  
  const nodeTypes = useMemo(() => ({sceneNode: SceneNode}), []);

  const OffcanvasTitle = useMemo(() => {
    const node = nodes.find(n => n.id === selectedNodeId!);
    const name = node ? node.data.label as string : "";
    const title = node ? (node.data.scene as Scene)?.details.title : "";
    return (
      <Row className="h-100">
        <Col className="w-50">
          <DynamicTextField 
            initialValue={name}
            onSubmit={(name: string) => onSceneNameChanged(selectedNodeId!, name)}
            baseProps={{
              size: "lg",
              className: "scene-node-name",
              placeholder: "ID Scena"}}/>
        </Col>
        <Col className="w-50">
          <DynamicTextField 
            initialValue={title}
            onSubmit={(title: string) => onSceneTitleChanged(selectedNodeId!, title)}
            baseProps={{
              size: "lg",
              className: "scene-node-title",
              placeholder: "Nessun Titolo"}}/>
        </Col>
      </Row>
    );
  }, [nodes, selectedNodeId, onSceneTitleChanged, onSceneNameChanged])

  return (
    <Row className="gx-0 h-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onInit={handleInit}
        deleteKeyCode={['Backspace', 'Delete']}
        style={{ border: "1px solid black" }}
        className="gx-0 h-100"
        ref={flowRef}
        minZoom={0.2}
        fitView >
        <Panel>
          <Button variant="primary" onClick={addNewNode} style={{ margin: "0px 5px" }}>
              {"Aggiungi Scena "}
              <i className="bi bi-plus-square"/>
          </Button>
        </Panel>
        <Controls />
        <Background />
      </ReactFlow>
      <SideTab 
        title={OffcanvasTitle}
        showSideTab={showSideTab}
        setShowSideTab={setShowSideTab} >
        {showSideTab &&
          <SceneEditor 
            story={story}
            setStory={props.setStory}
            scene={rfInstance?.getNode(selectedNodeId!)?.data.scene as Scene}
            setScene={onSceneEdited} />
        }
      </SideTab>
    </Row>
  );
};

export default StoryFlowChartEditor;
