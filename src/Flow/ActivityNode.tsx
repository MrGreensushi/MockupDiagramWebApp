import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import React, { useMemo } from "react";
import { Col } from "react-bootstrap";
import Activity from "../Procedure/Activity.ts";

type ActivityNodeProps = {
  activity: Activity;
};

type ActivityNodeObject = {
  id: string;
  position: { x: number; y: number };
  data: ActivityNodeProps;
  type: "activityNode";
};

type ActivityNodeType = Node<ActivityNodeProps, "ActivityNode">;

function ActivityNode(props: NodeProps<ActivityNodeType>) {
  return (
    <div
      className={`scene-node ${props.selected ? "selected" : ""} ${
        props.data.activity.isSubProcedureEmpty ? "" : "hasSubProcedure"
      }`}
    >
      <Col>{props.data.activity.name}</Col>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default ActivityNode;
export { ActivityNodeProps, ActivityNodeObject };
