import { v4 as uuidv4 } from "uuid";
import { Handle, Node, NodeProps, NodeToolbar, Position, XYPosition } from "@xyflow/react";
import Scene from "../StoryElements/Scene.ts";
import React, { useState } from "react";
import { Button, ButtonGroup, Col, InputGroup } from "react-bootstrap";
import DynamicTextField from "../Layout/DynamicTextField.tsx";

type FunctionProps = {
  onClickEdit: (scene: Scene | undefined, setScene: React.Dispatch<React.SetStateAction<Scene | undefined>>) => void;
  onClickDelete: () => void;
  onSceneNameChanged: (name: string) => void
  onSceneTitleChanged: (title: string) => void
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

function createNewSceneNode(id: string, callbacks: FunctionProps, label?: string, position?: XYPosition, data?: SceneNodeProps): SceneNodeObject {
  return {
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
}

function SceneNode(props: NodeProps<SceneNodeType>) {
  const [scene, setScene] = useState<Scene | undefined>(undefined);

  const handleDelete = () => {
    setScene(undefined);
    props.data.onClickDelete();
  }

  const handleSubmitSceneName = (name: string) => {
    props.data.onSceneNameChanged(name);
  }

  const handleSubmitSceneTitle = (title: string) => {
    props.data.onSceneTitleChanged(title);
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
      <NodeToolbar isVisible={props.selected}>
          <InputGroup>
          {props.data.scene?.details.summary && 
            <InputGroup.Text style={{maxWidth: "10em", textWrap:"pretty", textAlign:"start", overflowY: "auto", fontSize:"0.9em"}}>
              {props.data.scene?.details.summary ?? "Nessun Riassunto"}
            </InputGroup.Text>
          }
          <ButtonGroup vertical={!!props.data.scene?.details.summary}>
            <Button variant="secondary" onClick={() => props.data.onClickEdit(scene, setScene)}>
              <i className="bi bi-pencil" aria-label="edit" />
            </Button>
            <Button variant="secondary" onClick={handleDelete}>
              <i className="bi bi-trash3" aria-label="delete" />
            </Button>
          </ButtonGroup>
        </InputGroup>
      </NodeToolbar>
    </div>
  );
}

export default SceneNode;
export {SceneNodeProps, SceneNodeObject, createNewSceneNode};
