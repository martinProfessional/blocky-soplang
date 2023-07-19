// import React from 'react';
// import * as Blockly from 'blockly/core';

// import BlocklyReactField from './BlocklyReactField';

// class IfField extends BlocklyReactField {
//   static fromJson(options) {
//     return new this(options['condition']);
//   }

//   setCondition(condition) {
//     this.setValue(condition);
//     Blockly.DropDownDiv.hideIfOwner(this, true);
//   }

//   getText_() {
//     return this.value_;
//   }

//   fromXml(fieldElement) {
//     this.setCondition(fieldElement.textContent);
//   }

//   render() {
//     return (
//       <div>
//         <input
//           type="text"
//           value={this.getText_()}
//           onChange={(event) => this.setCondition(event.target.value)}
//         />
//       </div>
//     );
//   }
// }

// Blockly.fieldRegistry.register('field_if', IfField);

// Blockly.Blocks['if_block'] = {
//   init: function () {
//     this.appendDummyInput()
//       .appendField('If')
//       .appendField(new Blockly.FieldIf('true'), 'CONDITION');
//     this.appendStatementInput('DO')
//       .setCheck(null)
//       .appendField('do');
//     this.setColour(230);
//     this.setTooltip('');
//     this.setHelpUrl('');
//   },
// };

// Blockly.JavaScript['if_block'] = function (block) {
//   var condition = block.getFieldValue('CONDITION');
//   var doCode = Blockly.JavaScript.statementToCode(block, 'DO');

//   var code = '';
//   code += 'if (' + condition + ') {\n';
//   code += doCode;
//   code += '}\n';

//   return code;
// };

// export default IfField;