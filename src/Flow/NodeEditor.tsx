import React, { useMemo } from "react";
import SideBar from "../Layout/SideBar.tsx";
import { Node } from "@xyflow/react";
import ActivityEditor from "../Layout/ActivityEditor.tsx";
import Activity from "../Procedure/Activity.ts";
import Procedure from "../Procedure/Procedure.ts";

function NodeEditor(props: {
  selectedNode: Node | undefined;
  procedure: Procedure;
  setActivity: (newActivity: Activity) => void;
}) {
  const editor = useMemo(() => {
    if (!props.selectedNode) return <h3>Select a Node</h3>;

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

  return (
    <SideBar header={<h2>{props.selectedNode?.data.label}</h2>} isLeft={false}>
      {editor}
    </SideBar>
  );
}

export default NodeEditor;
