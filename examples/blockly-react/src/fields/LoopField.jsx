// import React from 'react';
// import ReactDOM from 'react-dom';

// import * as Blockly from 'blockly/core';

import React from 'react';
import * as Blockly from 'blockly/core';

import BlocklyReactField from './BlocklyReactField';

class LoopField extends BlocklyReactField {
  static fromJson(options) {
    // Create an instance of LoopField with the specified loop count
    return new this(options['count']);
  }

  setCount(count) {
    // Set the loop count and trigger a Blockly redraw
    this.setValue(count);
    Blockly.DropDownDiv.hideIfOwner(this, true);
  }

  getText_() {
    // Get the loop count as a string
    return String(this.value_);
  }

  fromXml(fieldElement) {
    // Parse the loop count from XML and set it as the field value
    this.setCount(parseInt(fieldElement.textContent, 10));
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setCount(this.value_ - 1)}>-</button>
        <span>{this.getText_()}</span>
        <button onClick={() => this.setCount(this.value_ + 1)}>+</button>
      </div>
    );
  }
}

Blockly.fieldRegistry.register('field_loop', LoopField);

export default LoopField;

