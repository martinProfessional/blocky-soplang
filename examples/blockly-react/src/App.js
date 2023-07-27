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

// var serviceList = [{'name': 'tag1', 'key': 1}, {'name': 'tag2','key': 2}, {'name': 'tag3','key': 3}]
var tagDB = [{'name': 'tag1'}, {'name': 'tag2'}, {'name': 'tag3'}];
var functionDB = [{'name': 'turn_off', 'return_type': "void", 'use_arg': 0},
                {'name': 'capture', 'return_type': "binary", 'use_arg': 0},
                {'name': 'capture_with_timeout', 'return_type':"binary", 'use_arg': 1, 
                'arguments':[{'type':"int", 'name': "TIME", 'bound':{"min_value":1,"max_value":100}}]}];



const registerSoPBlocks = () => {
  for (const [key, value] of Object.entries(tagDB)) {

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

      var conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE);
      var order = javascriptGenerator.ORDER_ATOMIC

      return [' #' + value.name+ conditionCode, null];

    };
  }

  // for (const [key, value] of Object.entries(functionDB)) {
  //   var argsList = ""
  //   var argsPara = ""
  //   // for i in length(arguments):
  //   //   argsString += " %" + str(i) 
  //   if(value.use_arg){
  //     for(let i=0; i<value.arguments.length; i++){
  //       argsList += " %" + (i+1);

  //       argsPara += "\"args"+i+"\": [\n"+value.arguments[i]+"\n]\n"
  //     }


  //   }
  //   //   let type_field_refer_map = {"int": "field_number"};

  // // var args =[]
  //   // for arg in arguments:
  //   //     var arg = {"type": type_field_refer_map[arg.type], "name": arg.name, }
  //   //     args.append(arg)
  //   // let sv2Block = {
  //   //   "type": `${value.name}`,
  //   //   //"message0": `${value.name} ${args}`,
  //   //   "message0": `${value.name} ${argsList}`,

  //   //   // "args0": [
        
  //   //   //   //${args}
  //   //   // ],
  //   //   //`${argsPara}`,
  //   //   "output": "String",
  //   //   "previousStatement": null,
  //   //   "nextStatement": null
  //   // };
    
  //   // Blockly.Blocks[value.name] = {
  //   //   init: function() {
  //   //     this.jsonInit(sv2Block);
  //   //     this.setStyle('loop_blocks');
  //   //   }
  //   // };

  //   javascriptGenerator[value.name] = function (block) {

  //     var conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE);
  //     var order = javascriptGenerator.ORDER_ATOMIC

  //     return [' #' + value.name+ conditionCode, null];

  //   };

  // }

  return;
};

const renderSoPBlocks = () => {
  var toRender = [];

  for (const [key, value] of Object.entries(tagDB)) {
    toRender.push(<Block type={value.name}/>);
  }

  for (const [key, value] of Object.entries(functionDB)) {
    toRender. push(<Block type={value.name}/>);
  }
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
            
            {/* <Block type="test_tag_field"/> */}

            {/* <Block type="test_space_field"/>
            <Block type="test_rb_field"/>
            <Block type="test_lb_field"/> */}

            
            <Block type="test_tag_list_field"/>

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