import { Handle, Node, NodeProps, NodeToolbar, Position } from "@xyflow/react";
import Scene from "../StoryElements/Scene";
import React, { useState } from "react";
import { Button, ButtonGroup, Form, InputGroup } from "react-bootstrap";

type SceneNodeProps = {
  label: string;
  scene?: Scene;
  onClickEdit: (scene: Scene | undefined, setScene: React.Dispatch<React.SetStateAction<Scene | undefined>>) => void;
  onClickDelete: (id: string) => void;
  onLabelChanged: (id: string, name: string) => void
}

type SceneNodeObject = {
  id: string;
  position: {x: number, y: number}
  data: SceneNodeProps;
  type: "sceneNode"
}

type SceneNodeType = Node<
  SceneNodeProps,
  "SceneNode"
>;

function SceneNode(props: NodeProps<SceneNodeType>) {
  const [scene, setScene] = useState<Scene | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [localLabel, setLocalLabel] = useState(props.data.label);

  const handleDelete = () => {
    setScene(undefined);
    props.data.onClickDelete(props.id);
  }

  const handleSubmit = () => {
    if (localLabel !== "") {
      props.data.onLabelChanged(props.id, localLabel);
      setEditing(false);
    }
  }

  const labelField = (
    editing?(
      <Form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
        <InputGroup>
          <Form.Control
            value={localLabel}
            onChange={e => setLocalLabel(e.target.value)}
            onBlur={handleSubmit}
            isInvalid={localLabel === ""}
            autoFocus={true} />
          <Button
            onClick={() => setEditing(true)}
            hidden={editing} >
            <i className="bi bi-pencil" aria-label="edit" />
          </Button>
        </InputGroup>
      </Form>)
    :
      <InputGroup>
        <InputGroup.Text>
          {localLabel}
        </InputGroup.Text>
        <Button
          onClick={() => setEditing(true)}
          variant="primary">
          <i className="bi bi-pencil" aria-label="edit" />
        </Button>
      </InputGroup>
  );

  return (
    <div className={`scene-node ${props.selected ? "selected" : ""}`}>
      {labelField}
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
export {SceneNodeProps, SceneNodeObject};
