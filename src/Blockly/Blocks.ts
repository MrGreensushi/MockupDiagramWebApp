import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

function initBlocks() {
    const SceneCharacterObject = {
        init: function () {
            commonInit(this);
            this.setColour("#BC6400");
        },

        getOutputText: commonGetOutputText
    };

    const SceneObjectObject = {
        init: function () {
            commonInit(this);
            this.setColour("#5B80A5");
        },

        getOutputText: commonGetOutputText
    };

    const SceneLocationObject = {
        init: function () {
            commonInit(this);
            this.setColour("#5CA699");
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
        SceneCharacterObject: SceneCharacterObject,
        SceneObjectObject: SceneObjectObject,
        SceneLocationObject: SceneLocationObject,
        TextInput: TextInput
    };

    Blockly.common.defineBlocks(blocks);

    // Register code generators for defined blocks
    for (const blockName in blocks) {
        javascriptGenerator.forBlock[blockName] = generateCommonBlockData;
    }    
}

type BlockData = {
    id: string,
    type: string,
    outputText: string
}

function generateCommonBlockData(block: any): string {
    const data: BlockData = {
        id: block.id,
        type: block.type,
        outputText: block.getOutputText(block) ?? ""
    };
    return JSON.stringify(data) + ",";
}

function commonInit(block: Blockly.Block) {
    block.appendDummyInput('')
          .appendField(new Blockly.FieldLabelSerializable(''), 'SceneObjectName')
    block.setPreviousStatement(true, null);
    block.setNextStatement(true, null);
}

function commonGetOutputText(block: Blockly.Block) {
    return `${block.getFieldValue("SceneObjectName")}`;
}

export {initBlocks, BlockData};