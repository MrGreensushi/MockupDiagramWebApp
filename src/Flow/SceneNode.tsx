import { v4 as uuidv4 } from "uuid";
import { Handle, Node, NodeProps, NodeToolbar, Position, XYPosition } from "@xyflow/react";
import Scene from "../StoryElements/Scene.ts";
import React, { useState } from "react";
import { Button, ButtonGroup, Col } from "react-bootstrap";
import DynamicTextField from "../Layout/DynamicTextField.tsx";

type FunctionProps = {
  onClickEdit: (scene: Scene | undefined, setScene: React.Dispatch<React.SetStateAction<Scene | undefined>>) => void;
  onClickDelete: (id: string) => void;
  onSceneNameChanged: (id: string, name: string) => void
  onSceneTitleChanged: (id: string, title: string) => void
}

type SceneNodeProps = {
  label: string;
  scene?: Scene;
} & FunctionProps;

type SceneNodeObject = {
  id: string;
  position: XYPosition
  data: SceneNodeProps;
  type: "sceneNode"
}

type SceneNodeType = Node<
  SceneNodeProps,
  "SceneNode"
>;

function createNewNode(id: string, callbacks: FunctionProps, label?: string, position?: XYPosition, data?: SceneNodeProps) {
  const node: SceneNodeObject = {
    id: id ?? uuidv4(),
    position: position ?? {x: 0, y: 0},
    data: {
      label: label ?? data?.label ?? "Scena senza nome",
      scene: data?.scene ?? new Scene(undefined),
      onClickEdit: callbacks.onClickEdit,
      onClickDelete: callbacks.onClickDelete,
      onSceneNameChanged: callbacks.onSceneNameChanged,
      onSceneTitleChanged: callbacks.onSceneTitleChanged
    }, 
    type: "sceneNode"
  };
  return node
}

function SceneNode(props: NodeProps<SceneNodeType>) {
  const [scene, setScene] = useState<Scene | undefined>(undefined);

  const handleDelete = () => {
    setScene(undefined);
    props.data.onClickDelete(props.id);
  }

  const handleSubmitSceneName = (name: string) => {
    props.data.onSceneNameChanged(props.id, name);
  }

  const handleSubmitSceneTitle = (title: string) => {
    props.data.onSceneTitleChanged(props.id, title);
  }

  return (
    <div className={`scene-node ${props.selected ? "selected" : ""}`}>
      <Col>
        <DynamicTextField 
          initialValue={props.data.label}
          focusOnDoubleClick={true}
          onSubmit={handleSubmitSceneName}
          isInvalid={label => label === ""}
          baseProps={{
            className: "scene-node-name",
            htmlSize: 15,
            size: "sm",
            style: {userSelect:"none"}
          }}/>
        <DynamicTextField
          initialValue={props.data.scene?.details.title}
          focusOnDoubleClick={true}
          onSubmit={handleSubmitSceneTitle}
          baseProps={{
            className: "scene-node-title",
            htmlSize: 15,
            size: "sm",
            placeholder: "Nessun Titolo" }}/>
      </Col>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <NodeToolbar>
        <ButtonGroup>
          <Button variant="secondary" onClick={() => props.data.onClickEdit(scene, setScene)}>
            <i className="bi bi-pencil" aria-label="edit" />
          </Button>
          <Button variant="secondary" onClick={handleDelete}>
            <i className="bi bi-trash3" aria-label="delete" />
          </Button>
        </ButtonGroup>
      </NodeToolbar>
    </div>
  );
}

export default SceneNode;
export {SceneNodeProps, SceneNodeObject, createNewNode};
