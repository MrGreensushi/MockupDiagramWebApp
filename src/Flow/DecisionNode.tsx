import { Handle, Node, NodeProps, NodeToolbar, Position } from "@xyflow/react";
import React, { useState } from "react";
import { Button, ButtonGroup, Col } from "react-bootstrap";
import DynamicTextField from "../Layout/DynamicTextField.tsx";
import NamedHandle from "../Layout/NamedHandle.tsx";

type DecisionNodeProps = {
  label: string;
};

type DecisionNodeObject = {
  id: string;
  position: { x: number; y: number };
  data: DecisionNodeProps;
  type: "decisionNode";
};

type DecisionNodeType = Node<DecisionNodeProps, "DecisionNode">;

function DecisionNode(props: NodeProps<DecisionNodeType>) {

  return (
    <div className={`decision-node ${props.selected ? "selected" : ""}`}>
      <Col className="decision-node-content">
      {props.data.label}
      </Col>

      <Handle type="target" position={Position.Top} style={{ left: "0%" }} />

      <NamedHandle
        id="yes-handle"
        className="yes-handle"
        handlePosition={Position.Left}
        positionText={{
          bottom: "5%",
          left: "5%",
          rotate: "-45deg",
        }}
        handleStyle={{
          top: "100%",
        }}
        text="YES"
        type="source"
      />
      <NamedHandle
        id="no-handle"
        className="no-handle"
        handlePosition={Position.Right}
        positionText={{
          top: "5%",
          right: "5%",
          rotate: "-45deg",
        }}
        handleStyle={{
          bottom: "100%",
          top: "0%",
        }}
        text="NO"
        type="source"
      />

      
    </div>
  );
}

export default DecisionNode;
export { DecisionNodeProps, DecisionNodeObject };
