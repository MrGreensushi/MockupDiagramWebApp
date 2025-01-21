import { Handle, Node, NodeProps, NodeToolbar, Position } from "@xyflow/react";
import React, { useState } from "react";
import { Button, ButtonGroup, Col } from "react-bootstrap";
import DynamicTextField from "../Layout/DynamicTextField.tsx";
import Activity from "../Procedure/Activity.ts";
import SubProcedure from "../Procedure/SubProcedure.ts";
import NamedHandle from "../Layout/NamedHandle.tsx";

type EventNodeProps = {
  label: string;
};

type EventNodeObject = {
  id: string;
  position: { x: number; y: number };
  data: EventNodeProps;
  type: "eventNode";
};

type EventNodeType = Node<EventNodeProps, "EventNode">;

function EventNode(props: NodeProps<EventNodeType>) {

  return (
    <div className={`event-node ${props.selected ? "selected" : ""}`}>
      <Col>
      {props.data.label}
      </Col>
      <NamedHandle
        id="interrupt-handle"
        className="interrupt-handle"
        handlePosition={Position.Bottom}
        type="source"
        handleStyle={{ left: "15%" }}
        positionText={{
          position: "absolute",
          left: "3%",
          bottom: "2px",
          fontSize: "10px",
          textAlign: "center",
        }}
        text="Interrupts"
      />
      <NamedHandle
        id="trigger-handle"
        className="trigger-handle"
        handlePosition={Position.Bottom}
        type="source"
        handleStyle={{ left: "85%" }}
        positionText={{
          position: "absolute",
          left: "73%",
          bottom: "2px",
          fontSize: "10px",
          textAlign: "center",
        }}
        text="Triggers"
      />

      <Handle type="target" id="await-handle" position={Position.Top} />
    </div>
  );
}

export default EventNode;
export { EventNodeProps, EventNodeObject };
