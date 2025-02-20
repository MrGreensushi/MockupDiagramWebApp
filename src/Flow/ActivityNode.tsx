import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import React, { useContext, useMemo } from "react";
import { Col } from "react-bootstrap";
import Activity from "../Procedure/Activity.ts";
import "../CSS/Nodes.css";
import { Procedures } from "../Layout/ProcedureEditor.tsx";

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
  const procedures = useContext(Procedures);
  const isSubprocedureEmpty = procedures
    .find((x) => x.id === props.data.activity.subProcedureId)
    ?.isEmpty();
  const nodeClassName = `scene-node ${
    isSubprocedureEmpty ? "" : "hasSubProcedure"
  }`;
  return (
    <div className={nodeClassName} tabIndex={0}>
      <Col>{props.data.activity.name}</Col>
      <Handle
        id="Top"
        className="input-handle"
        type="target"
        position={Position.Top}
      />
      <Handle
        id="Left"
        className="input-handle"
        type="target"
        position={Position.Left}
      />
      <Handle
        id="Rigth"
        className="input-handle"
        type="target"
        position={Position.Right}
      />
      <Handle
        className="output-handle"
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}

export default ActivityNode;
export { ActivityNodeProps, ActivityNodeObject };
