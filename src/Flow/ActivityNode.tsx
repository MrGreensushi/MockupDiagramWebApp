import { Handle, Node, NodeProps, NodeToolbar, Position } from "@xyflow/react";
import React, { useState } from "react";
import { Button, ButtonGroup, Col } from "react-bootstrap";
import DynamicTextField from "../Layout/DynamicTextField.tsx";
import Activity from "../Procedure/Activity.ts";
import SubProcedure from "../Procedure/SubProcedure.ts";

type ActivityNodeProps = {
  label: string;
  activity: Activity;
  onClickSubProcedure: (subProcedure: SubProcedure) => void;
};

type ActivityNodeObject = {
  id: string;
  position: { x: number; y: number };
  data: ActivityNodeProps;
  type: "activityNode";
};

type ActivityNodeType = Node<ActivityNodeProps, "ActivityNode">;

function ActivityNode(props: NodeProps<ActivityNodeType>) {
  const [activity, setActivity] = useState<Activity | undefined>(undefined);

  const handleSubProcedure = () => {
    const subProcedure = props.data.activity.subProcedure as SubProcedure;
    props.data.onClickSubProcedure(subProcedure);
  };

  return (
    <div
      className={`scene-node ${props.selected ? "selected" : ""} ${
        props.data.activity.subProcedure.isEmpty() ? "" : "hasSubProcedure"
      }`}
      onDoubleClick={handleSubProcedure}
    >
      <Col>
      {props.data.label}
        
      </Col>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
    </div>
  );
}

export default ActivityNode;
export { ActivityNodeProps, ActivityNodeObject };
