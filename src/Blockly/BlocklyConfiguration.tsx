import { ToolboxDefinition, WorkspaceSvg } from "react-blockly";
import * as Blockly from "blockly/core";
import React, { ReactElement } from "react";
import { StoryElementEnum } from "../StoryElements/StoryElement.ts";
import NarrativeDataManager from "../StoryElements/NarrativeDataManager.ts";

const customBlockData = {
  characters: {
    objectName: "SceneCharacterObject",
    button: {
      kind: "BUTTON",
      text: "Add Character",
      callbackKey: "createCharacterInstance"
    }
  },
  objects: {
    objectName: "SceneObjectObject",
    button: {
      kind: "BUTTON",
      text: "Add Object",
      callbackKey: "createObjectInstance"
    }
  },
  locations: {
    objectName: "SceneLocationObject",
    button: {
      kind: "BUTTON",
      text: "Add Location",
      callbackKey: "createLocationInstance"
    }
  }
};

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
      colour: "#BC6400",
      custom: "Characters",
    },
    {
      kind: "category",
      name: "Oggetti",
      colour: "#5B80A5",
      custom: "Objects",
    },
    {
      kind: "category",
      name: "Luoghi",
      colour: "#5CA699",
      custom: "Locations",
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

function convertFromEnumToCustomKey(type: StoryElementEnum): string {
  switch (type) {
    case StoryElementEnum.character:
      return "characters";
    case StoryElementEnum.object:
      return "objects";
    case StoryElementEnum.location:
      return "locations";
    default:
      throw new Error(`Enum ${type} was not found among the Custom Keys (${Object.keys(customBlockData)})`);
  }
}

function flyoutCallback(type: StoryElementEnum): Blockly.utils.toolbox.FlyoutDefinition {
  const typeKey = convertFromEnumToCustomKey(type);

  const blockList: Blockly.utils.toolbox.FlyoutItemInfoArray = [customBlockData[typeKey].button];

  NarrativeDataManager.getInstance().getAll(type).forEach((element) => {
    blockList.push({
      kind:"block",
      type: customBlockData[typeKey].objectName,
      fields: {
        SceneObjectName: element.name,
      },
    });
  });
  return blockList;
}

function populateCustomToolbox(workspace: WorkspaceSvg, buttonCallback: (type: StoryElementEnum) => void) {
  workspace.registerToolboxCategoryCallback("Characters", () => flyoutCallback(StoryElementEnum.character));
  workspace.registerToolboxCategoryCallback("Objects", () => flyoutCallback(StoryElementEnum.object));
  workspace.registerToolboxCategoryCallback("Locations", () => flyoutCallback(StoryElementEnum.location));
  workspace.registerButtonCallback('createCharacterInstance', () => buttonCallback(StoryElementEnum.character));
  workspace.registerButtonCallback('createObjectInstance', () => buttonCallback(StoryElementEnum.object));
  workspace.registerButtonCallback('createLocationInstance', () => buttonCallback(StoryElementEnum.location));
  workspace.updateToolbox(customToolboxCategories);
}

function BlocklyCanvas({ blocklyRef }): ReactElement {
  return(
    <div ref={blocklyRef} className="fill-height"></div>
  );
}

export {BlocklyCanvas, workspaceConfiguration, baseToolboxCategories, customToolboxCategories, populateCustomToolbox};