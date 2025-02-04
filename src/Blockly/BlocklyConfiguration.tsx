import { ToolboxDefinition, WorkspaceSvg } from "react-blockly";
import * as Blockly from "blockly/core";
import React, { ReactElement, Ref } from "react";
import { StoryElementEnum, StoryElementEnumString } from "../StoryElements/StoryElement.ts";
import Story from "../StoryElements/Story.ts";
import { storyBlocks } from "./Blocks.ts";

const baseToolboxCategories: ToolboxDefinition = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Testo",
      colour: "#CCCCCC",
      contents: [
        {
          kind: "block",
          type: "TextInput",
        }
      ],
    }
  ],
};

const customToolboxCategories: ToolboxDefinition = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Testo",
      colour: "#CCCCCC",
      contents: [
        {
          kind: "block",
          type: "TextInput",
        }
      ],
    },
    {
      kind: "category",
      name: "Personaggi",
      colour: storyBlocks[StoryElementEnum.character].colour,
      custom: storyBlocks[StoryElementEnum.character].customName,
    },
    {
      kind: "category",
      name: "Oggetti",
      colour: storyBlocks[StoryElementEnum.object].colour,
      custom: storyBlocks[StoryElementEnum.object].customName,
    },
    {
      kind: "category",
      name: "Luoghi",
      colour: storyBlocks[StoryElementEnum.location].colour,
      custom: storyBlocks[StoryElementEnum.location].customName,
    },
  ],
};

const workspaceConfiguration: Blockly.BlocklyOptions = {
  grid: {
    spacing: 20,
    length: 3,
    colour: "#ccc",
    snap: true,
  }
};

function flyoutCallback(story: Story, type: StoryElementEnum): Blockly.utils.toolbox.FlyoutDefinition {
  const blockList: Blockly.utils.toolbox.FlyoutItemInfoArray = [storyBlocks[type].button];

  [...story.getTypeIterator(type)]
    .sort((e1, e2) => e1.name.localeCompare(e2.name))
    .forEach(element => {
      blockList.push({
        kind:"block",
        type: storyBlocks[type].blockType,
        fields: {
          SceneObjectName: element.name,
        },
      });
    });
  return blockList;
}

function populateCustomToolbox(story: Story, workspace: WorkspaceSvg, buttonCallback: (type: StoryElementEnum) => void) {
  StoryElementEnumString.forEach((_, idx) => {
    workspace.registerToolboxCategoryCallback(storyBlocks[idx].customName, () => flyoutCallback(story, idx));
    workspace.registerButtonCallback(storyBlocks[idx].button.callbackKey, () => buttonCallback(idx));
  });
  workspace.updateToolbox(customToolboxCategories);
}

function BlocklyCanvas(props: { blocklyRef: Ref<HTMLDivElement>, onBlur?: () => void, className?: string}): ReactElement {
  return(
    <div ref={props.blocklyRef}
      className={"h-100 w-100 "+ props.className}
      onBlur={props.onBlur} />
  );
}

export {BlocklyCanvas, workspaceConfiguration, baseToolboxCategories, customToolboxCategories, populateCustomToolbox};