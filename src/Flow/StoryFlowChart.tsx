import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import React, { useCallback, useState, useMemo, useEffect, useRef } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { ReactFlow, Controls, Background, applyNodeChanges, Panel, ReactFlowInstance, Edge, NodeChange, Node, addEdge, Connection, EdgeChange, applyEdgeChanges } from "@xyflow/react";
import SideTab from "../Layout/SideTab.tsx";
import SceneEditor from "../Layout/SceneEditor.tsx";
import SceneNode, { createNewNode, SceneNodeProps } from "./SceneNode.tsx";
import Story from "../StoryElements/Story.ts";
import Scene from "../StoryElements/Scene.ts";
import DynamicTextField from "../Layout/DynamicTextField.tsx";

function StoryFlowChart (props: {
  story: Story,
  setStory: React.Dispatch<React.SetStateAction<Story>>,
  editMode: boolean,
}) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [showSideTab, setShowSideTab] = useState(false);

  const flowRef = useRef(null);

  useEffect(() => {
    if (rfInstance) 
      props.setStory(props.story.cloneAndAddFlow({nodes: nodes, edges: edges, viewport: rfInstance.getViewport()}))
  }, [nodes, edges])

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nodes => applyNodeChanges(changes, nodes));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(edges => applyEdgeChanges(changes, edges));
  }, []);
  
  const onConnect = useCallback((connection: Connection) =>
    setEdges(eds => addEdge({ ...connection }, eds),
  ), []);

  const onNodeClick = useCallback((_, node: Node) => {
    setSelectedNodeId(node.id);  
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(undefined);
  }, []);

  const onClickEdit = useCallback(() => {
    setShowSideTab(true);
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

  const onClickDelete = useCallback((nodeId: string) => {
    rfInstance!.deleteElements({
      nodes: [{ id: nodeId }],
    });
  }, [rfInstance]);

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
    ))}, []);

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
    const newNode = createNewNode(
      id,
      {onClickEdit: onClickEdit,
      onClickDelete: onClickDelete,
      onSceneNameChanged: onSceneNameChanged,
      onSceneTitleChanged: onSceneTitleChanged},
      label,
      position);
    setNodes(nodes => [...nodes, newNode]);
  }, [rfInstance, flowRef, nodes, setNodes, onClickEdit, onClickDelete, onSceneNameChanged, onSceneTitleChanged]);

  const addExistingNode = useCallback((node: Node) => {
    const newNode = createNewNode(
      node.id,
      {onClickEdit: onClickEdit,
      onClickDelete: onClickDelete,
      onSceneNameChanged: onSceneNameChanged,
      onSceneTitleChanged: onSceneTitleChanged},
      undefined,
      node.position,
      node.data as SceneNodeProps);
    setNodes(nodes => [...nodes, newNode]);
  }, [onClickEdit, onClickDelete, onSceneNameChanged, onSceneTitleChanged])

  const handleInit = (rfInstance: ReactFlowInstance) => {
    props.story.flow.nodes.forEach(node => addExistingNode(node));
    rfInstance.setEdges(props.story.flow.edges);
    rfInstance.setViewport(props.story.flow.viewport);
    rfInstance.fitView();
    setRfInstance(rfInstance);
  }
  
  const nodeTypes = useMemo(() => ({sceneNode: SceneNode}), []);

  const OffcanvasTitle = useMemo(() => {
    const node = nodes.find(n => n.id === selectedNodeId!);
    const name = node ? node.data.label as string : "";
    const title = node ? (node.data.scene as Scene)?.details.title : "";
    return (
      <Row style={{width:"100%"}}>
        <Col style={{width:"50%"}}>
          <DynamicTextField 
            initialValue={name}
            onSubmit={(name: string) => onSceneNameChanged(selectedNodeId!, name)}
            baseProps={{
              size: "lg",
              className: "scene-node-name",
              placeholder: "ID Scena"}}/>
        </Col>
        <Col style={{width:"50%"}}>
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
    <Row style={{ height: "100%" }} className="gx-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={handleInit}
        deleteKeyCode={['Backspace', 'Delete']}
        style={{ border: "1px solid black" }}
        className="gx-0"
        ref={flowRef}
        fitView
        nodesDraggable={props.editMode}
        nodesConnectable={props.editMode}
        elementsSelectable={props.editMode}
        panOnDrag={props.editMode}
        zoomOnScroll={props.editMode}
        zoomOnDoubleClick={props.editMode}
        >
        {props.editMode &&
          <Panel>
            <Button variant="primary" onClick={addNewNode} style={{ margin: "0px 5px" }}>
                {"Aggiungi Scena "}
                <i className="bi bi-plus-square"/>
            </Button>
          </Panel>
        }
        {props.editMode && 
          <Controls />
        }
        <Background />
      </ReactFlow>
      {props.editMode &&
        <SideTab 
          title={OffcanvasTitle}
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
      }
    </Row>
  );
};

export default StoryFlowChart;
