import { Handle, Node, NodeProps, NodeToolbar, Position } from "@xyflow/react";
import React, { useState } from "react";
import { Button, ButtonGroup, Col } from "react-bootstrap";
import DynamicTextField from "../Layout/DynamicTextField.tsx";
import Activity from "../Procedure/Activity.ts";
import SubProcedure from "../Procedure/SubProcedure.ts";

type EventNodeProps = {
  label: string;
  onClickDelete: (id: string) => void;
  onEventNameChanged: (id: string, name: string) => void;
};

type EventNodeObject = {
  id: string;
  position: { x: number; y: number };
  data: EventNodeProps;
  type: "eventNode";
};

type EventNodeType = Node<EventNodeProps, "EventNode">;

function EventNode(props: NodeProps<EventNodeType>) {
  const handleDelete = () => {
    props.data.onClickDelete(props.id);
  };

  const handleSubmitActivityName = (name: string) => {
    props.data.onEventNameChanged(props.id, name);
  };

  return (
    <div className={`event-node ${props.selected ? "selected" : ""}`}>
      <Col>
        <DynamicTextField
          initialValue={props.data.label}
          focusOnDoubleClick={true}
          onSubmit={handleSubmitActivityName}
          isInvalid={(label) => label === ""}
          baseProps={{
            htmlSize: 15,
            size: "sm",
          }}
        />
      </Col>
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          position: "absolute",
          left: "3%",
          bottom: "2px",
          color: "red",
          fontSize: "10px",
          textAlign: "center",
        }}
      >
        Interrupts
      </div>
      <Handle
        type="source"
        id="interrupt-handle"
        position={Position.Bottom}
        style={{ left: "15%", background: "red" }}
      />
      <div
        style={{
          position: "absolute",
          left: "73%",
          bottom: "2px",
          color: "blue",
          fontSize: "10px",
          textAlign: "center",
        }}
      >
        Triggers
      </div>
      <Handle
        type="source"
        id="trigger-handle"
        position={Position.Bottom}
        style={{ left: "85%", background: "blue" }}
      />

      <NodeToolbar>
        <ButtonGroup>
          <Button variant="secondary" onClick={handleDelete}>
            <i className="bi bi-trash3" aria-label="delete" />
          </Button>
        </ButtonGroup>
      </NodeToolbar>
    </div>
  );
}

export default EventNode;
export { EventNodeProps, EventNodeObject };
