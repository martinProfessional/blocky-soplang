import React from 'react';
import * as Blockly from 'blockly/core';

import BlocklyReactField from './BlocklyReactField';

class WaitUntilField extends BlocklyReactField {
  static fromJson(options) {
    return new this(options['condition']);
  }

  setCondition(condition) {
    this.setValue(condition);
    Blockly.DropDownDiv.hideIfOwner(this, true);
  }

  getText_() {
    return this.value_;
  }

  fromXml(fieldElement) {
    this.setCondition(fieldElement.textContent);
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.getText_()}
          onChange={(event) => this.setCondition(event.target.value)}
        />
      </div>
    );
  }
}

Blockly.fieldRegistry.register('field_wait_until', WaitUntilField);

Blockly.Blocks['wait_until_block'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Wait until')
      .appendField(new Blockly.FieldWaitUntil('true'), 'CONDITION');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.JavaScript['wait_until_block'] = function (block) {
  var condition = block.getFieldValue('CONDITION');

  var code = '';
  code += 'while (!(' + condition + ')) {\n';
  code += '  yield;\n';
  code += '}\n';

  return code;
};

export default WaitUntilField;

