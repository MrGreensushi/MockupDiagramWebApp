import React, { useMemo } from "react";
import SideBar from "../Layout/SideBar.tsx";
import { Node } from "@xyflow/react";
import ActivityEditor from "../Layout/ActivityEditor.tsx";
import Activity, { Phrase } from "../Procedure/Activity.ts";
import Procedure from "../Procedure/Procedure.ts";
import DynamicTextField from "../Layout/DynamicTextField.tsx";
import EventDecisionEditor from "../Layout/EventDecisionEditor.tsx";
import "../CSS/NodeEditor.css";

function NodeEditor(props: {
  selectedNode: Node | undefined;
  procedure: Procedure;
  updateActivity: (
    id: string,
    newPhrases?: Phrase[],
    details?: string,
    newName?: string,
    notes?: string
  ) => void;
  updateEventOrDecision: (name?: string, details?: string) => void;
}) {
  const editor = useMemo(() => {
    if (!props.selectedNode) return <>No node selected.</>;

    const data = props.selectedNode.data;
    //check if activityNode
    const activity = data.activity ?? undefined;

    if (activity)
      return (
        <ActivityEditor
          key={"ActivityEditor: " + props.selectedNode.id}
          procedure={props.procedure}
          activityId={props.selectedNode.id}
          activity={activity as Activity}
          setActivity={props.updateActivity}
        />
      );

    return (
      <EventDecisionEditor
        key={"EventDecisionEditor: " + props.selectedNode.id}
        notes={(data.details as string) ?? ""}
        updateEventDecision={props.updateEventOrDecision}
      />
    );
  }, [props.selectedNode]);

  const title = useMemo(() => {
    if (!props.selectedNode) return undefined;
    //check if activityNode
    const activity =
      (props.selectedNode.data.activity as Activity) ?? undefined;

    if (!activity) return props.selectedNode.data.name as string;

    return activity.name;
  }, [props.selectedNode]);

  const handleNameChange = (value: string) => {
    if (!props.selectedNode) return;

    //check if activityNode
    const activity =
      (props.selectedNode?.data.activity as Activity) ?? undefined;

    if (!activity) props.updateEventOrDecision(value);
    else
      props.updateActivity(props.selectedNode.id, undefined, undefined, value);
  };

  return (
    <SideBar
      header={
        <EditableTitle title={title} handleNameChange={handleNameChange} />
      }
      isLeft={false}
    >
      <div className="card-container">{editor}</div>
    </SideBar>
  );
}

function EditableTitle(props: {
  title?: string;
  handleNameChange: (values: string) => void;
}) {
  const defaultTitle = "Select a Node";

  return (
    <DynamicTextField
      initialValue={props.title ?? defaultTitle}
      isInvalid={(value: string) => value === ""}
      onSubmit={props.handleNameChange}
      baseProps={{ style: { fontSize: "2em" } }}
      disable={props.title ? false : true}
    ></DynamicTextField>
  );
}

export default NodeEditor;
