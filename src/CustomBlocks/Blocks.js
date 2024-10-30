import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

const SceneObject = {
    init: function () {
        this.appendDummyInput('')
            .appendField(new Blockly.FieldLabelSerializable('Faraone'), 'SceneObjectName');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('');
        this.setHelpUrl('');
        this.setColour("#BC6400");
    },

    generateOutputText: (block) => {
        return `${block.getFieldValue("SceneObjectName")}`;
    }
};

const TextInput = {
    init: function () {
        this.appendDummyInput('')
            .setAlign(Blockly.inputs.Align.CENTRE)
            .appendField(new Blockly.FieldTextInput('Testo Testo Testo'), 'TextContent');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('');
        this.setHelpUrl('');
        this.setColour("#CCCCCC");
    },

    generateOutputText: (block) => {
        return `${block.getFieldValue('TextContent')}`;
    }
};        

const blocks = {
    SceneObject: SceneObject,
    TextInput: TextInput
};

Blockly.common.defineBlocks(blocks);

for (const blockName in blocks) {
    javascriptGenerator.forBlock[blockName] = GenerateCommonBlockData;
}

function GenerateCommonBlockData(block) {
    const data = {
        id: block.id,
        type: block.type,
        outputText: block.generateOutputText(block) ?? ""
    };
    return JSON.stringify(data) + ",";
}