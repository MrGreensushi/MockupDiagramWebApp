import { useCallback } from "react";
import { Edge, Node, Panel, ReactFlowInstance, ReactFlowJsonObject } from "@xyflow/react";
import saveToDisk from "../Misc/SaveToDisk.ts";
import React from "react";
import Procedure from "../Procedure/Procedure.ts";

function SaveLoadManager (props: {
  rfInstance: ReactFlowInstance,
  procedure: Procedure,
  setProcedure: React.Dispatch<React.SetStateAction<Procedure>>,
  nodes: Node[],
  edges: Edge[],
  restoreFlow: (flow: ReactFlowJsonObject) => void
}) {
  const rfInstance = props.rfInstance;
  const story = props.procedure;
  const setProcedure = props.setProcedure;
  const nodes = props.nodes;
  const edges = props.edges;
  const restoreFlow = props.restoreFlow;

  const onSave = useCallback(async () => {
    const newStory = new Procedure(
      {nodes: nodes, edges: edges, viewport: rfInstance.getViewport()},
      story.title
    );
    const jsonString = newStory.toJSON();
    saveToDisk(jsonString, `${newStory.title}.procedure`, "application/json");
  }, [rfInstance, story, edges, nodes]);

  const onLoad = useCallback(async (file?: File) => {
    if (!file) return;

    try {
      const newStory = Procedure.fromJSON(await file.text());
      console.log(newStory);
      setProcedure(newStory);
      restoreFlow(newStory.flow);
    } catch(err) {
      console.error(err);
    }
  }, [restoreFlow, setProcedure]);

  return (
    <Panel position="top-right">
      <button onClick={onSave}>Salva Procedura</button>
      <input
        type="file"
        accept=".story"
        onChange={(e) => onLoad((e.target as HTMLInputElement).files![0])}
      />
    </Panel>
  );
};

export default SaveLoadManager;
