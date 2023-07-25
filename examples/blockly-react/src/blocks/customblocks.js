/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks


import * as Blockly from 'blockly/core';

// Since we're using json to initialize the field, we'll need to import it.
import '../fields/BlocklyReactField';
import '../fields/DateField';
import '../fields/LoopField'

import '@blockly/field-date';

let reactDateField = {
        "type": "test_react_date_field",
        "message0": "date field: %1",
        "args0": [
            {
                "type": "field_date",
                "name": "DATE",
                "date": "2023-07-12"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
    };

Blockly.Blocks['test_react_date_field'] = {
  init: function() {
    this.jsonInit(reactDateField);
    this.setStyle('loop_blocks');
  }
}

var testReactField = {
  "type": "test_react_field",
  "message0": "custom field %1",
  "args0": [
    {
      "type": "field_react_component",
      "name": "FIELD",
      "text": "Click me"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
};

Blockly.Blocks['test_react_field'] = {
  init: function() {
    this.jsonInit(testReactField);
    this.setStyle('loop_blocks');
  }
};

let loopBlock = {
  "type": "test_loop_field",
  "message0": "LOOP: %1 %2",
  "args0": [
      {
      "type": "field_number",
      "name": "TIMES",
      "value": 1,
      "min": 0,
      "precision": 0.1
      },
      {
      "type": "field_dropdown",
      "name": "FIELDNAME",
      "options": [
        ["MSEC", "ITEM1" ],
        ["SEC", "ITEM2" ],
        ["MIN", "ITEM3"],
        ["HOUR", "ITEM4" ],
        ["DAY", "ITEM5" ]
      ],
      // 'DO0': {'shadow': {'type': 'controls_if'}, 'block': undefined}
      }
  ],
  "message1": "do %1",
  "args1": [
    {"type": "input_statement", "name": "DO"}
  ],
  
  "previousStatement": null,
  "nextStatement": null,
};

Blockly.Blocks['test_loop_field'] = {
  init: function() {
    this.jsonInit(loopBlock);
    this.setStyle('loop_blocks');
  }
};

let waitUntilBlock = {
  "type": "test_wait_until_field",
  "message0": "WAIT UNTIL: %1",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION",
      //"check": "Boolean"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
};

Blockly.Blocks['test_wait_until_field'] = {
  init: function() {
    this.jsonInit(waitUntilBlock);
    this.setStyle('loop_blocks');
  }
};

let ifBlock = {
  "type": "test_if_field",
  "message0": "IF %1",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION",
      "check": "Boolean"
    }
  ],
  "message1": "DO %1",
  "args1": [
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "previousStatement": null,
  "nextStatement": null
};

Blockly.Blocks['test_if_field'] = {
  init: function() {
    this.jsonInit(ifBlock);
    this.setStyle('loop_blocks');
  }
};

let elseBlock = {
  "type": "test_else_field",
  "message0": "ELSE DO %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  
  "previousStatement": null,
  "nextStatement": null
};

Blockly.Blocks['test_else_field'] = {
  init: function() {
    this.jsonInit(elseBlock);
    this.setStyle('loop_blocks');
  }
};

let elseIfBlock = {
  "type": "test_else_if_field",
  "message0": "ELSE IF %1",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION",
      "check": "Boolean"
    }
  ],
  "message1": "DO %1",
  "args1": [
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "previousStatement": null,
  "nextStatement": null
};

Blockly.Blocks['test_else_if_field'] = {
  init: function() {
    this.jsonInit(elseIfBlock);
    this.setStyle('loop_blocks');
  }
};




let tagBlock = {
  "type": "test_tag_field",
  "message0": "tag %1",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION",
      "check": "Boolean"
    }
  ],
  "previousStatement": null,
  "nextStatement": null
};

Blockly.Blocks['test_tag_field'] = {
  init: function() {
    this.jsonInit(tagBlock);
    this.setStyle('loop_blocks');
  }
};


// for f in functions {
// 	let newFunctionServiceBlock = generateFunctionServiceBlock(f)
// 	Blockly.Blocks['function_name']  = 	newFunctionServiceBlock
// }