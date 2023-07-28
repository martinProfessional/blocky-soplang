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
 * @fileoverview Main React component that includes the Blockly component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React from "react";
import "./App.css";
import logo from "./logo.svg";
import BlocklyComponent, { Block, Value, Field, Shadow } from "./Blockly";
import "./blocks/customblocks";
import "./generator/generator";

import * as Blockly from "blockly/core";
import { javascriptGenerator, generator } from "blockly/javascript";

var functionList = [
  { name: "f1", use_arg: 0, arguments: [] },
  { name: "f2", use_arg: 1, arguments: [{ name: "arg1" }] },
  {
    name: "f3",
    use_arg: 1,
    arguments: [{ name: "arg2-1" }, { name: "arg2-2" }],
  },
];

var tagList = [
  { name: "tag1", key: 1 },
  { name: "tag2", key: 2 },
  { name: "tag3", key: 3 },
];

const registerVariableBlock = () => {
  let variableBlock = {
    type: `my_variable`,
    message0: `var %1`,
    args0: [
      {
        type: "field_input",
        name: "VARIABLE",
        check: "String",
        text: "x",
      },
    ],
    inputsInline: !0,
    output: "String",
  };

  Blockly.Blocks["my_variable"] = {
    init: function () {
      this.jsonInit(variableBlock);
      this.setStyle("loop_blocks");
    },
  };

  javascriptGenerator["my_variable"] = function (block) {
    // var variableCode = javascriptGenerator.valueToCode(
    //   block,
    //   "VARIABLE",
    //   javascriptGenerator.ORDER_NONE
    // );

    // console.log("variableCode");
    // console.log(variableCode);

    return [block.getField("VARIABLE").getText(), null];
  };
};
const registerAssignBlock = () => {
  let assignBlock = {
    type: `assign`,
    message0: `%1 = %2`,
    args0: [
      {
        type: "input_value",
        name: "ASSIGNEE",
        check: "String",
      },
      {
        type: "input_value",
        name: "VAL",
        check: "String",
      },
    ],
    inputsInline: !0,
    output: "String",
  };

  Blockly.Blocks["assign"] = {
    init: function () {
      this.jsonInit(assignBlock);
      this.setStyle("loop_blocks");
    },
  };

  javascriptGenerator["assign"] = function (block) {
    var assigneeCode = javascriptGenerator.valueToCode(
      block,
      "ASSIGNEE",
      javascriptGenerator.ORDER_NONE
    );
    var valCode = javascriptGenerator.valueToCode(
      block,
      "VAL",
      javascriptGenerator.ORDER_NONE
    );

    return [assigneeCode + " = " + valCode, null];
  };
};

const registerTagBlocks = (tagList) => {
  for (const [key, value] of Object.entries(tagList)) {
    let tagBlock = {
      type: `${value.name}`,
      message0: `${value.name} %1`,
      args0: [
        {
          type: "input_value",
          name: "TAG",
          check: "String",
        },
      ],
      output: "String",
    };

    Blockly.Blocks[value.name] = {
      init: function () {
        this.jsonInit(tagBlock);
        this.setStyle("loop_blocks");
      },
    };

    javascriptGenerator[value.name] = function (block) {
      // var conditionCode = javascriptGenerator.valueToCode(block, value.name, javascriptGenerator.ORDER_NONE);
      //var tagCode = javascriptGenerator.valueToCode(block, 'TAG', javascriptGenerator.ORDER_ATOMIC);
      var conditionCode = javascriptGenerator.valueToCode(
        block,
        "TAG",
        javascriptGenerator.ORDER_NONE
      );

      return [" #" + value.name + conditionCode, null];
    };
  }

  return;
};

const renderArgumentsMessage = (args) => {
  var argMessage = "";
  var idx = 1;
  for (const [key, value] of Object.entries(args)) {
    if (args.length == idx) {
      argMessage += `%${idx}`;
    } else {
      argMessage += `%${idx}, `;
    }
    idx += 1;

    console.log("idx: ", idx);
    console.log("argMessage: ", argMessage);
  }

  return argMessage;
};

const renderArgumentsArgs0 = (args) => {
  var argList = [];

  var idx1 = 1;
  for (const [key, value] of Object.entries(args)) {
    argList.push({
      type: "input_value",
      //name: `ARG%${idx1}`,
      name: "HAP",
      check: "String",
    });
    idx1 += 1;
  }

  return argList;
};

const registerFunctionBlocks = (functionList) => {
  for (const [key, value] of Object.entries(functionList)) {
    let functionBlock = {
      type: `${value.name}`,
      message0: `${value.name} ( ${renderArgumentsMessage(value.arguments)} )`,
      args0: renderArgumentsArgs0(value.arguments),
      output: "String",
    };

    Blockly.Blocks[value.name] = {
      init: function () {
        this.jsonInit(functionBlock);
        this.setStyle("loop_blocks");
      },
    };

    //for (let i = 1; i <= argList.length; i++) {}

    javascriptGenerator[value.name] = function (block) {
      // var conditionCode = javascriptGenerator.valueToCode(block, value.name, javascriptGenerator.ORDER_NONE);
      //var tagCode = javascriptGenerator.valueToCode(block, 'TAG', javascriptGenerator.ORDER_ATOMIC);
      var conditionCode = javascriptGenerator.valueToCode(
        block,
        "HAP",
        javascriptGenerator.ORDER_NONE
      );

      return [value.name + "(" + conditionCode + ")", null];
    };
  }

  return;
};

const registerSoPBlocks = () => {
  registerTagBlocks(tagList);
  registerFunctionBlocks(functionList);

  // let compareBlock = {
  //   type: "logic_operation",
  //   message0: "%1 %2 %3",
  //   args0: [
  //     { type: "input_value", name: "A", check: "Boolean" },
  //     {
  //       type: "field_dropdown",
  //       name: "OP",
  //       options: [
  //         ["%{BKY_LOGIC_OPERATION_AND}", "AND"],
  //         ["%{BKY_LOGIC_OPERATION_OR}", "OR"],
  //       ],
  //     },
  //     { type: "input_value", name: "B", check: "Boolean" },
  //   ],
  //   inputsInline: !0,
  //   output: "Boolean",
  //   style: "logic_blocks",
  //   helpUrl: "%{BKY_LOGIC_OPERATION_HELPURL}",
  //   extensions: ["logic_op_tooltip"],
  // };

  //   if () {
  //     if(){
  //       return ['(#' + value.name +' '+ conditionCode + ').\n', null];
  //     } else {
  //       return ['#' + value.name, null];
  //     }
  //   } else {
  //     return ['(#' + value.name + ').'+ conditionCode +'\n', null];

  // };

  // if (block.ORDER_ATOMIC<0) {
  //   return ['#' + value.name, null];
  // } else {
  //   return ['(#' + value.name +' '+ conditionCode + ').\n', null];
  // }
};

const renderSoPBlocks = () => {
  var toRender = [];

  for (const [key, value] of Object.entries(tagList)) {
    // console.log(key, value);
    toRender.push(<Block type={value.name} />);
  }

  for (const [key, value] of Object.entries(functionList)) {
    // console.log(key, value);
    toRender.push(<Block type={value.name} />);
  }

  return toRender;
};

function App(props) {
  registerVariableBlock();
  registerAssignBlock();
  registerSoPBlocks();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <BlocklyComponent
          readOnly={false}
          trashcan={true}
          media={"media/"}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true,
          }}
          initialXml={`
<xml xmlns="http://www.w3.org/1999/xhtml">
</xml>
      `}
        >
          {/* <Block type="test_function_service_field"/>
            <Block type="test_value_service_field"/> */}

          {renderSoPBlocks()}

          <Block type="test_loop_field" />
          <Block type="test_wait_until_field" />
          <Block type="test_if_field" />
          <Block type="test_else_field" />

          {/* <Block type="test_tag_field"/> */}

          {/* <Block type="test_space_field"/>
            <Block type="test_rb_field"/>
            <Block type="test_lb_field"/> */}

          <Block type="test_tag_list_field" />

          <Block type="logic_boolean" />
          <Block type="logic_compare" />
          <Block type="logic_operation" />
          <Block type="assign" />
          <Block type="my_variable" />

          {/* <Block type="test_react_field" />
            <Block type="test_react_date_field" /> */}
          {/* <Block type="controls_ifelse" /> */}
          {/* <Block type="test_else_if_field"/> */}

          {/* <Block type="controls_repeat_ext">
              <Value name="TIMES">
                <Shadow type="math_number">
                  <Field name="NUM">10</Field>
                </Shadow>
              </Value>
            </Block> */}
          {/* <Block type="logic_operation" />
            <Block type="logic_negate" /> */}
          {/* <Block type="logic_null" disabled="true" />
            <Block type="logic_ternary" />
            <Block type="text_charAt">
              <Value name="VALUE">
                <Block type="variables_get">
                  <Field name="VAR">text</Field>
                </Block>
              </Value>
            </Block> */}
        </BlocklyComponent>
      </header>
    </div>
  );
}

export default App;
