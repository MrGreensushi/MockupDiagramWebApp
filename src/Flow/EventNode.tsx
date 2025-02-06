import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import React from "react";
import { Col } from "react-bootstrap";
import NamedHandle from "../Layout/NamedHandle.tsx";
import "../CSS/Nodes.css";

type EventNodeProps = {
  name: string;
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
    <div className={`event-node`} tabIndex={0}>
      <Col>{props.data.name}</Col>
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
          right: "3%",
          bottom: "2px",
          fontSize: "10px",
          textAlign: "center",
        }}
        text="Triggers"
      />

      <Handle
        className="input-handle"
        type="target"
        id="await-handle"
        position={Position.Top}
      />
    </div>
  );
}

export default EventNode;
export { EventNodeProps, EventNodeObject };
