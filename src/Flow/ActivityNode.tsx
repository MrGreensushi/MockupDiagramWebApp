import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import React, { useMemo } from "react";
import { Col } from "react-bootstrap";
import Activity from "../Procedure/Activity.ts";

type ActivityNodeProps = {
  label: string;
  activity: Activity;
  onDoubleClickActivity: (subProcedureId: string) => void;
};

type ActivityNodeObject = {
  id: string;
  position: { x: number; y: number };
  data: ActivityNodeProps;
  type: "activityNode";
};

type ActivityNodeType = Node<ActivityNodeProps, "ActivityNode">;

function ActivityNode(props: NodeProps<ActivityNodeType>) {
  const isEmpty = useMemo(() => {
    return props.data.activity.isSubProcedureEmpty;
  }, [props.data.activity.isSubProcedureEmpty]);

  const handleDoubleClick = () => {
    props.data.onDoubleClickActivity(props.data.activity.subProcedureId);
  };

  return (
    <div
      className={`scene-node ${props.selected ? "selected" : ""} ${
        isEmpty ? "" : "hasSubProcedure"
      }`}
      onDoubleClick={handleDoubleClick}
    >
      <Col>{props.data.label}</Col>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default ActivityNode;
export { ActivityNodeProps, ActivityNodeObject };
