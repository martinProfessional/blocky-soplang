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

import * as Blockly from "blockly/core";

// Since we're using json to initialize the field, we'll need to import it.
import "../fields/BlocklyReactField";
import "../fields/DateField";

var waitUntilField = {
  type: "wait_until_field",
  message0: "wait until %1",
  args0: [
    {
      type: "field_input",
      name: "TEXT",
      text: "",
    },
  ],
  previousStatement: null,
  nextStatement: null,
};

Blockly.Blocks["wait_until_field"] = {
  init: function () {
    this.jsonInit(waitUntilField);
    this.setStyle("");
  },
};

// Block for loop.
var loopField = {
  type: "loop_field",
  message0: "loop %1",
  args0: [
    {
      type: "input_value",
      name: "condition",
    },
  ],
  message1: "%1",
  args1: [
    {
      type: "input_statement",
      name: "loop",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  style: "loop_blocks",
  // extensions: ["controls_whileUntil_tooltip"],
};

Blockly.Blocks["loop_field"] = {
  init: function () {
    this.jsonInit(loopField);
    this.setStyle("");
  },
};

var tagField = {
  type: "tag_field",
  message0: "#%1",
  args0: [
    {
      type: "input_value",
      name: "tag_list",
    },
  ],
  style: "text_blocks",
  previousStatement: null,
  nextStatement: null,
};

Blockly.Blocks["tag_field"] = {
  init: function () {
    this.jsonInit(tagField);
    this.setStyle("list_blocks");
  },
};

var rangeField = {
  type: "range_field",
  message0: "%1",
  args0: [
    {
      type: "field_dropdown",
      name: "TEXT",
      options: [
        ["ALL", "ALL"],
        ["NONE", ""],
      ],
    },
  ],
  previousStatement: null,
  nextStatement: null,
  style: "text_blocks",
  helpUrl: "%{BKY_TEXT_TEXT_HELPURL}",
  tooltip: "%{BKY_TEXT_TEXT_TOOLTIP}",
  extensions: ["parent_tooltip_when_inline"],
};

Blockly.Blocks["range_field"] = {
  init: function () {
    this.jsonInit(rangeField);
    this.setStyle("text_blocks");
  },
};

var anyField = {
  type: "any_field",
  message0: "%1",
  args0: [
    {
      type: "field_input",
      name: "TEXT",
      text: "",
    },
  ],
  output: "String",
  style: "text_blocks",
  helpUrl: "%{BKY_TEXT_TEXT_HELPURL}",
  tooltip: "%{BKY_TEXT_TEXT_TOOLTIP}",
  extensions: ["parent_tooltip_when_inline"],
};

Blockly.Blocks["any_field"] = {
  init: function () {
    this.jsonInit(anyField);
    this.setStyle("loop_blocks");
  },
};

var tagList = {
  type: "tag_list",
  previousStatement: null,
  nextStatement: null,
};

Blockly.Blocks["tag_list"] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit(tagList);
    // this.setHelpUrl(Blockly.Msg["LISTS_CREATE_WITH_HELPURL"]);
    this.setStyle("list_blocks");
    this.itemCount_ = 1;
    this.updateShape_();
    this.setMutator(new Blockly.Mutator(["lists_create_with_item"]));
    this.setTooltip(Blockly.Msg["LISTS_CREATE_WITH_TOOLTIP"]);
  },
  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("items", this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute("items"), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this {Blockly.Block}
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("lists_create_with_container");
    containerBlock.initSvg();
    var connection = containerBlock.getInput("STACK").connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock("lists_create_with_item");
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  compose: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    // Count number of inputs.
    var connections = [];
    while (itemBlock && !itemBlock.isInsertionMarker()) {
      connections.push(itemBlock.valueConnection_);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput("ADD" + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, "ADD" + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  saveConnections: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    var i = 0;
    while (itemBlock) {
      var input = this.getInput("ADD" + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this {Blockly.Block}
   */
  updateShape_: function () {
    if (this.itemCount_ && this.getInput("EMPTY")) {
      this.removeInput("EMPTY");
    } else if (!this.itemCount_ && !this.getInput("EMPTY")) {
      this.appendDummyInput("EMPTY").appendField(
        Blockly.Msg["LISTS_CREATE_EMPTY_TITLE"]
      );
    }
    // Add new inputs.
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput("ADD" + i)) {
        var input = this.appendValueInput("ADD" + i).setAlign(
          Blockly.ALIGN_RIGHT
        );
        if (i == 0) {
          // input.appendField(Blockly.Msg["LISTS_CREATE_WITH_INPUT_WITH"]);
          input.appendField("#");
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput("ADD" + i)) {
      this.removeInput("ADD" + i);
      i++;
    }
  },
};

var valueTagList = {
  type: "value_tag_list",
  output: "String",
  nextStatement: null,
};

Blockly.Blocks["value_tag_list"] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit(valueTagList);
    // this.setHelpUrl(Blockly.Msg["LISTS_CREATE_WITH_HELPURL"]);
    this.setStyle("list_blocks");
    this.itemCount_ = 1;
    this.setInputsInline(true);
    this.updateShape_();
    this.setMutator(new Blockly.Mutator(["lists_create_with_item"]));
    this.setTooltip(Blockly.Msg["LISTS_CREATE_WITH_TOOLTIP"]);
  },
  /**
   * Create XML to represent list inputs.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("items", this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute("items"), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this {Blockly.Block}
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("lists_create_with_container");
    containerBlock.initSvg();
    var connection = containerBlock.getInput("STACK").connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock("lists_create_with_item");
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  compose: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    // Count number of inputs.
    var connections = [];
    while (itemBlock && !itemBlock.isInsertionMarker()) {
      connections.push(itemBlock.valueConnection_);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput("ADD" + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, "ADD" + i);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  saveConnections: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    var i = 0;
    while (itemBlock) {
      var input = this.getInput("ADD" + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this {Blockly.Block}
   */
  updateShape_: function () {
    if (this.itemCount_ && this.getInput("EMPTY")) {
      this.removeInput("EMPTY");
    } else if (!this.itemCount_ && !this.getInput("EMPTY")) {
      this.appendDummyInput("EMPTY").appendField(
        Blockly.Msg["LISTS_CREATE_EMPTY_TITLE"]
      );
    }
    // Add new inputs.
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput("ADD" + i)) {
        var input = this.appendValueInput("ADD" + i).setAlign(
          Blockly.ALIGN_RIGHT
        );
        if (i == 0) {
          // input.appendField(Blockly.Msg["LISTS_CREATE_WITH_INPUT_WITH"]);
          input.appendField("#");
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput("ADD" + i)) {
      this.removeInput("ADD" + i);
      i++;
    }
  },
};

var reactDateField = {
  type: "test_react_date_field",
  message0: "date field %1",
  args0: [
    {
      type: "field_react_date",
      name: "DATE",
      date: "01/01/2020",
    },
  ],
  previousStatement: null,
  nextStatement: null,
};

Blockly.Blocks["test_react_date_field"] = {
  init: function () {
    this.jsonInit(reactDateField);
    this.setStyle("loop_blocks");
  },
};

var functionField = {
  type: "sop_function_field",
  message0: "function field %1",
  args0: [
    {
      type: "field_react_component",
      name: "FIELD",
      text: "Click me",
    },
  ],
  previousStatement: null,
  nextStatement: null,
};

Blockly.Blocks["function_field"] = {
  init: function () {
    this.jsonInit(anyField);
    this.setStyle("loop_blocks");
  },
};

var reactDateField = {
  type: "test_react_date_field",
  message0: "date field %1",
  args0: [
    {
      type: "field_react_date",
      name: "DATE",
      date: "01/01/2020",
    },
  ],
  previousStatement: null,
  nextStatement: null,
};

Blockly.Blocks["test_react_date_field"] = {
  init: function () {
    this.jsonInit(reactDateField);
    this.setStyle("loop_blocks");
  },
};
