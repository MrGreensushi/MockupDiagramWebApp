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

        getOutputText: (block) => {
            return `${block.getFieldValue('TextContent')}`;
        },

        setOutputText: (block, text) => {
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

    for (const blockName in blocks) {
        javascriptGenerator.forBlock[blockName] = generateCommonBlockData;
    }    
}

function generateCommonBlockData(block) {
    const data = {
        id: block.id,
        type: block.type,
        outputText: block.getOutputText(block) ?? ""
    };
    return JSON.stringify(data) + ",";
}

function commonInit(object) {
    object.appendDummyInput('')
            .appendField(new Blockly.FieldLabelSerializable(''), 'SceneObjectName')
    object.setPreviousStatement(true, null);
    object.setNextStatement(true, null);
}

function commonGetOutputText(block) {
    return `${block.getFieldValue("SceneObjectName")}`;
}

export default initBlocks;