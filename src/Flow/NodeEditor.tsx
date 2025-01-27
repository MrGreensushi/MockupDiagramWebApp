import React, { useMemo } from "react";
import SideBar from "../Layout/SideBar.tsx";
import { Node } from "@xyflow/react";
import ActivityEditor from "../Layout/ActivityEditor.tsx";
import Activity, { Phrase } from "../Procedure/Activity.ts";
import Procedure from "../Procedure/Procedure.ts";
import DynamicTextField from "../Layout/DynamicTextField.tsx";

function NodeEditor(props: {
  selectedNode: Node | undefined;
  procedure: Procedure;
  setActivity: (
    newPhrases?: Phrase[],
    details?: string,
    newName?: string
  ) => void;
  setEventOrDecisionName: (id: string, value: string) => void;
}) {
  const editor = useMemo(() => {
    if (!props.selectedNode) return <></>;

    //check if activityNode
    const activity = props.selectedNode.data.activity ?? undefined;

    if (activity)
      return (
        <ActivityEditor
          procedure={props.procedure}
          activity={activity as Activity}
          setActivity={props.setActivity}
        />
      );
    else return <>Not an Activity Node</>;
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

    if (!activity) {
      props.setEventOrDecisionName(props.selectedNode!.id, value);
      return;
    }
    props.setActivity(undefined, undefined, value);
  };

  return (
    <SideBar
      header={
        <EditableTitle title={title} handleNameChange={handleNameChange} />
      }
      isLeft={false}
    >
      {editor}
    </SideBar>
  );
}

function EditableTitle(props: {
  title?: string;
  handleNameChange: (values: string) => void;
}) {
  return (
    <DynamicTextField
      initialValue={props.title ?? "Selected a Node"}
      focusOnDoubleClick={true}
      isInvalid={(value: string) => value === ""}
      onSubmit={props.handleNameChange}
      baseProps={{ style: { fontSize: "2em" } }}
    ></DynamicTextField>
  );
}

export default NodeEditor;
