import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { StoryElementType } from '../StoryElements/StoryElement.ts';

type BlockData = {
    id: string,
    type: "CharacterBlock" | "ObjectBlock" | "LocationBlock" | "TextInput",
    outputText: string
}

const storyBlocks = [
    //StoryElementType.character
    {
      blockType: "CharacterBlock",
      customName: "Characters",
      colour: "#BC6400",
      button: {
        kind: "BUTTON",
        text: "Nuovo Personaggio",
        callbackKey: "createCharacterInstance"
      }
    },
    //StoryElementType.object
    {
      blockType: "ObjectBlock",
      customName: "Objects",
      colour: "#5B80A5",
      button: {
        kind: "BUTTON",
        text: "Nuovo Oggetto",
        callbackKey: "createObjectInstance"
      }
    },
    //StoryElementType.location
    {
      blockType: "LocationBlock",
      customName: "Locations",
      colour: "#5CA699",
      button: {
        kind: "BUTTON",
        text: "Nuovo Luogo",
        callbackKey: "createLocationInstance"
      },
    }
];

function initBlocks() {
    const CharacterBlock = {
        init: function () {
            commonInit(this, StoryElementType.character);
        },
        getOutputText: commonGetOutputText
    };

    const ObjectBlock = {
        init: function () {
            commonInit(this, StoryElementType.object);
        },
        getOutputText: commonGetOutputText
    };

    const LocationBlock = {
        init: function () {
            commonInit(this, StoryElementType.location);
        },
        getOutputText: commonGetOutputText
    };

    const TextInput = {
        init: function () {
            this.appendDummyInput('')
                .setAlign(Blockly.inputs.Align.CENTRE)
                .appendField(new Blockly.FieldTextInput('Testo'), 'TextContent');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour("#CCCCCC");
        },
        getOutputText: (block: Blockly.Block) => {
            return `${block.getFieldValue('TextContent')}`;
        },
        setOutputText: (block: Blockly.Block, text: string) => {
            block.setFieldValue(text, 'TextContent');
        }
    };        

    const blocks = {
        CharacterBlock: CharacterBlock,
        ObjectBlock: ObjectBlock,
        LocationBlock: LocationBlock,
        TextInput: TextInput
    };

    Blockly.common.defineBlocks(blocks);

    // Register code generators for defined blocks
    for (const blockName in blocks) {
        javascriptGenerator.forBlock[blockName] = generateCommonBlockData;
    }    
}

function generateCommonBlockData(block: any): string {
    const data: BlockData = {
        id: block.id,
        type: block.type,
        outputText: block.getOutputText(block) ?? ""
    };
    return JSON.stringify(data) + ",";
}

function commonInit(block: Blockly.Block, type: StoryElementType) {
    block.appendDummyInput('')
          .appendField(new Blockly.FieldLabelSerializable(''), 'SceneObjectName')
    block.setPreviousStatement(true, null);
    block.setNextStatement(true, null);
    block.setColour(storyBlocks[type].colour);
}

function commonGetOutputText(block: Blockly.Block) {
    return `${block.getFieldValue("SceneObjectName")}`;
}
  
export function convertFromEnumToObjectType(type: StoryElementType | null): string {
    if (type !== null) return storyBlocks[type].blockType;
    return "TextInput";
  }
  
export function convertFromObjectTypeToEnum(type: string ): StoryElementType | null {
    const index = storyBlocks.findIndex(block => block.blockType === type);
    if (index === -1) return null;
    return index as StoryElementType;
}

export {initBlocks, BlockData, storyBlocks};