import * as Blockly from 'blockly/core';
import {javascriptGenerator, Order} from 'blockly/javascript';

const TextInput = {
    init: function() {
      this.appendDummyInput('NAME')
        .appendField(new Blockly.FieldTextInput('insert text'), 'text');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('');
      this.setHelpUrl('');
      this.setColour(225);
    }
  };
  Blockly.common.defineBlocks({TextInput: TextInput});

  // Definizione del generatore per il blocco "TextInput"
javascriptGenerator.forBlock['TextInput'] = function(block) {
    // Ottieni il valore del campo di testo 'text' dal blocco corrente
    const textValue = block.getFieldValue('text');
    
    // Restituisci il valore come stringa
    const code = `${textValue} `; // Aggiungi `\n` per la nuova riga
    return code;
  };

const Faraone = {
    init: function() {
      this.appendDummyInput('NAME')
        .appendField('Faraone');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('');
      this.setHelpUrl('');
      this.setColour(75);
    }
  };
  Blockly.common.defineBlocks({Faraone: Faraone});

  javascriptGenerator.forBlock['Faraone'] = function(block) {
    // Ottieni il valore di 'NAME' dal blocco corrente
    const nameValue = block.getFieldValue('NAME');
    
    // Restituisci il valore come stringa (o altro formato di output desiderato)
    const code = `${nameValue} `; // Aggiungi `;\n` se vuoi un output simile a una linea di codice
    return code;
  }


  const PromptGenerator = {
    init: function() {
      this.appendDummyInput('Label')
        .appendField('Prompt Generator');
      this.appendStatementInput('PromptContent');
      this.setTooltip('');
      this.setHelpUrl('');
      this.setColour(315);
    }
  };
  Blockly.common.defineBlocks({PromptGenerator: PromptGenerator});
                      
  javascriptGenerator.forBlock['PromptGenerator'] = function(block) {
    const statement_promptcontent = javascriptGenerator.statementToCode(block, 'PromptContent');
  
    // TODO: Assemble javascript into the code variable.
    const code = `${statement_promptcontent}`;
    return code;
  }
                      