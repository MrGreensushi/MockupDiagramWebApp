import { useCallback } from "react";
import { Edge, Node, Panel, ReactFlowInstance, ReactFlowJsonObject } from "@xyflow/react";
import saveToDisk from "../Misc/SaveToDisk.ts";
import React from "react";
import Story from "../StoryElements/Story.ts";

function SaveLoadManager (props: {
  story: Story,
  setStory: React.Dispatch<React.SetStateAction<Story>>,
  nodes: Node[],
  edges: Edge[],
  rfInstance: ReactFlowInstance,
  restoreFlow: (flow: ReactFlowJsonObject) => void
}) {
  const rfInstance = props.rfInstance;
  const story = props.story;
  const setStory = props.setStory;
  const nodes = props.nodes;
  const edges = props.edges;
  const restoreFlow = props.restoreFlow;

  const onSave = useCallback(async () => {
    const serializedStory = story.serialize();
    const newStory = new Story(
      serializedStory.characters,
      serializedStory.objects,
      serializedStory.locations,
      {nodes: nodes, edges: edges, viewport: rfInstance.getViewport()},
      serializedStory.title
    );
    const jsonString = newStory.toJSON();
    saveToDisk(jsonString, `${newStory.title}.story`, "application/json");
  }, [rfInstance, story, edges, nodes]);

  const onLoad = useCallback(async (file?: File) => {
    if (!file) return;

    try {
      const newStory = Story.fromJSON(await file.text());
      setStory(newStory);
      restoreFlow(newStory.flow);
    } catch(err) {
      console.error(err);
    }
  }, [restoreFlow, setStory]);

  return (
    <Panel position="top-right">
      <button onClick={onSave}>Salva Storia</button>
      <input
        type="file"
        accept=".story"
        onChange={(e) => onLoad((e.target as HTMLInputElement).files![0])}
      />
    </Panel>
  );
};

export default SaveLoadManager;
