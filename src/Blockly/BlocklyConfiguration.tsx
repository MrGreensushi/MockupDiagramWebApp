import { ToolboxDefinition, WorkspaceSvg } from "react-blockly";
import * as Blockly from "blockly/core";
import React, { ReactElement } from "react";
import { StoryElementEnum } from "../StoryElements/StoryElement.ts";
import Story from "../StoryElements/Story.ts";

const customBlockData = {
  characters: {
    objectName: "SceneCharacterObject",
    button: {
      kind: "BUTTON",
      text: "Nuovo Personaggio",
      callbackKey: "createCharacterInstance"
    }
  },
  objects: {
    objectName: "SceneObjectObject",
    button: {
      kind: "BUTTON",
      text: "Nuovo Oggetto",
      callbackKey: "createObjectInstance"
    }
  },
  locations: {
    objectName: "SceneLocationObject",
    button: {
      kind: "BUTTON",
      text: "Nuovo Luogo",
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

function convertFromEnumToKey(type: StoryElementEnum): string {
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

function convertFromEnumToObjectType(type: StoryElementEnum | null): string {
  switch (type) {
    case StoryElementEnum.character:
      return customBlockData.characters.objectName;
    case StoryElementEnum.object:
      return customBlockData.objects.objectName;
    case StoryElementEnum.location:
      return customBlockData.locations.objectName;
    default:
      return "TextInput";
  }
}

function flyoutCallback(story: Story, type: StoryElementEnum): Blockly.utils.toolbox.FlyoutDefinition {
  const typeKey = convertFromEnumToKey(type);

  const blockList: Blockly.utils.toolbox.FlyoutItemInfoArray = [customBlockData[typeKey].button];

  [...story.getTypeIterator(type)]
    .sort((e1, e2) => e1.name.localeCompare(e2.name))
    .forEach((element) => {
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

function populateCustomToolbox(story: Story, workspace: WorkspaceSvg, buttonCallback: (type: StoryElementEnum) => void) {
  workspace.registerToolboxCategoryCallback("Characters", () => flyoutCallback(story, StoryElementEnum.character));
  workspace.registerToolboxCategoryCallback("Objects", () => flyoutCallback(story, StoryElementEnum.object));
  workspace.registerToolboxCategoryCallback("Locations", () => flyoutCallback(story, StoryElementEnum.location));
  workspace.registerButtonCallback('createCharacterInstance', () => buttonCallback(StoryElementEnum.character));
  workspace.registerButtonCallback('createObjectInstance', () => buttonCallback(StoryElementEnum.object));
  workspace.registerButtonCallback('createLocationInstance', () => buttonCallback(StoryElementEnum.location));
  workspace.updateToolbox(customToolboxCategories);
}

function BlocklyCanvas({ blocklyRef, onBlur }): ReactElement {
  return(
    <div ref={blocklyRef}
      className="fill-height"
      onBlur={onBlur}></div>
  );
}

export {BlocklyCanvas, workspaceConfiguration, baseToolboxCategories, customToolboxCategories, populateCustomToolbox, convertFromEnumToObjectType};