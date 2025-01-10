import { Handle, Node, NodeProps, NodeToolbar, Position } from "@xyflow/react";
import React, { useState } from "react";
import { Button, ButtonGroup, Col } from "react-bootstrap";
import DynamicTextField from "../Layout/DynamicTextField.tsx";
import Activity from "../Procedure/Activity.ts";
import SubProcedure from "../Procedure/SubProcedure.ts";

type ActivityNodeProps = {
  label: string;
  activity: Activity;
  onClickEdit: (
    activity: Activity | undefined,
    setActivity: React.Dispatch<React.SetStateAction<Activity | undefined>>
  ) => void;
  onClickDelete: (id: string) => void;
  onActivityNameChanged: (id: string, name: string) => void;
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

  const handleDelete = () => {
    setActivity(undefined);
    props.data.onClickDelete(props.id);
  };

  const handleSubmitActivityName = (name: string) => {
    console.log("HandleSubmitActivityName");
    props.data.onActivityNameChanged(props.id, name);
  };

  const handleSubProcedure = () => {
    const subProcedure = props.data.activity.subProcedure as SubProcedure;
    props.data.onClickSubProcedure(subProcedure);
  };

  return (
    <div className={`scene-node ${props.selected ? "selected" : ""}`}>
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
      <Handle type="source" position={Position.Bottom} />
      <NodeToolbar position={Position.Right}>
        <ButtonGroup>
          <Button variant="secondary" onClick={handleSubProcedure}>
            <i className="bi bi-plus-circle-dotted" aria-label="subProcedure" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => props.data.onClickEdit(activity, setActivity)}
          >
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

export default ActivityNode;
export { ActivityNodeProps, ActivityNodeObject };
