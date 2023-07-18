import React from 'react';
import * as Blockly from 'blockly/core';

import BlocklyReactField from './BlocklyReactField';

class ElseField extends BlocklyReactField {
  static fromJson(options) {
    return new this();
  }

  getText_() {
    return 'else';
  }

  render() {
    return (
      <div>
        <span>else</span>
      </div>
    );
  }
}

Blockly.fieldRegistry.register('field_else', ElseField);

Blockly.Blocks['else_block'] = {
  init: function () {
    this.appendDummyInput().appendField(new Blockly.FieldElse(), 'ELSE');
    this.appendStatementInput('DO').setCheck(null).appendField('do');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['else_block'] = function (block) {
  var doCode = Blockly.JavaScript.statementToCode(block, 'DO');

  var code = 'else {\n' + doCode + '}\n';

  return code;
};

export default ElseField;