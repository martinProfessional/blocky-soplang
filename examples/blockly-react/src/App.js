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

import React from 'react';
import './App.css';
import logo from './logo.svg';
import BlocklyComponent, { Block, Value, Field, Shadow } from './Blockly';
import './blocks/customblocks';
import './generator/generator';


import * as Blockly from "blockly/core";
import {javascriptGenerator, generator} from 'blockly/javascript';

var serviceList = [{'name': 'tag1', 'key': 1}, {'name': 'tag2','key': 2}, {'name': 'tag3','key': 3}]

const registerSoPBlocks = () => {
  for (const [key, value] of Object.entries(serviceList)) {

    // console.log("registerSoPBlocks: ",value);

    let sv1Block = {
      "type": `${value.name}`,
      "message0": `${value.name} %1`,
      "args0": [
        {
          "type": "input_value",
          "name": "CONDITION",
          "check": "String"
        }
      ],
      "output": "String",
      "previousStatement": null,
      "nextStatement": null
    };
    
    Blockly.Blocks[value.name] = {
      init: function() {
        this.jsonInit(sv1Block);
        this.setStyle('loop_blocks');
      }
    };

    javascriptGenerator[value.name] = function (block) {

      // var conditionCode = javascriptGenerator.valueToCode(block, value.name, javascriptGenerator.ORDER_NONE);
      //var tagCode = javascriptGenerator.valueToCode(block, 'TAG', javascriptGenerator.ORDER_ATOMIC);
      var conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE);
      var order = javascriptGenerator.ORDER_ATOMIC

      if (block.previousStatement) {
        return ['#' + value.name, null];
      } else {
        return ['(#' + value.name +' '+ conditionCode + ').\n', null];
      }

    };
  }

  return;
};


const renderSoPBlocks = () => {
  var toRender = [];
  // serviceList.forEach((k, ) => {
  //   toRender.push(<Block type={f.name}></Block>);
  // });

  for (const [key, value] of Object.entries(serviceList)) {
    // console.log(key, value);
    toRender.push(<Block type={value.name}/>);
  }
  // console.log("test_tag_field");
  // toRender.push(<Block type="sv1"/>)

  // console.log(`render: ${toRender}`)

  return toRender;
};



function App(props) {
  
    registerSoPBlocks();

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <BlocklyComponent readOnly={false}
          trashcan={true} media={'media/'}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true
          }}
          initialXml={`
<xml xmlns="http://www.w3.org/1999/xhtml">
</xml>
      `}>

            {/* <Block type="test_function_service_field"/>
            <Block type="test_value_service_field"/> */}
            
            {renderSoPBlocks()}

            <Block type="test_loop_field"/>
            <Block type="test_wait_until_field"/>
            <Block type="test_if_field"/>
            <Block type="test_else_field"/>
            
            <Block type="test_tag_field"/>
            

            <Block type="logic_boolean" />
            <Block type="logic_compare" />
            <Block type="logic_operation" />

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