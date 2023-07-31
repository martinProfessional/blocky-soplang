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
 * @fileoverview Define generation methods for custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on generating code:
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code

import { javascriptGenerator, generator } from "blockly/javascript";

javascriptGenerator["test_react_field"] = function (block) {
  return "console.log('custom block');\n";
};

javascriptGenerator["test_react_date_field"] = function (block) {
  return "console.log(" + block.getField("DATE").getText() + ");\n";
};

javascriptGenerator["test_loop_field"] = function (block) {
  var substring = javascriptGenerator.statementToCode(block, "DO");
  return (
    "loop(" +
    block.getField("TIMES").getText() +
    " " +
    block.getField("FIELDNAME").getText() +
    ")" +
    " {\n" +
    substring +
    "}" +
    "\n"
  );
};

javascriptGenerator["test_wait_until_field"] = function (block) {
  var conditionCode = javascriptGenerator.valueToCode(
    block,
    "CONDITION",
    javascriptGenerator.ORDER_NONE
  );

  return "WAIT UNTIL(" + conditionCode + ");\n";
};

javascriptGenerator["test_if_field"] = function (block) {
  var conditionCode = javascriptGenerator.valueToCode(
    block,
    "CONDITION",
    javascriptGenerator.ORDER_NONE
  );
  var doCode = javascriptGenerator.statementToCode(block, "DO");

  return "if (" + conditionCode + ") {\n" + doCode + "}\n";
};

javascriptGenerator["test_else_field"] = function (block) {
  var doCode = javascriptGenerator.statementToCode(block, "DO");

  return "else {\n" + doCode + "}\n";
};

javascriptGenerator["test_else_if_field"] = function (block) {
  var conditionCode = javascriptGenerator.valueToCode(
    block,
    "CONDITION",
    javascriptGenerator.ORDER_NONE
  );
  var doCode = javascriptGenerator.statementToCode(block, "DO");

  return "ELSE IF (" + conditionCode + ") {\n" + doCode + "}\n";
};

// javascriptGenerator["test_tag_list_field"] = function (block) {
//   var conditionCode1 = javascriptGenerator
//     .valueToCode(block, "CONDITION1", javascriptGenerator.ORDER_NONE)
//     .trim();
//   var conditionCode2 = javascriptGenerator.valueToCode(
//     block,
//     "CONDITION2",
//     javascriptGenerator.ORDER_NONE
//   );
//   return ["(" + conditionCode1 + ")." + conditionCode2, null];
// };

// javascriptGenerator["test_tag_list_field"] = function (block) {
//   var conditionCode1 = javascriptGenerator
//     .valueToCode(block, "CONDITION1", javascriptGenerator.ORDER_NONE)
//     .trim();
//   var conditionCode2 = javascriptGenerator.valueToCode(
//     block,
//     "CONDITION2",
//     javascriptGenerator.ORDER_NONE
//   );
//   return ["(" + conditionCode1 + ")." + conditionCode2, null];
// };

// javascriptGenerator["test_tag_list_field"] = function (block) {
//   var conditionCode1 = javascriptGenerator
//     .valueToCode(block, "CONDITION1", javascriptGenerator.ORDER_NONE)
//     .trim();
//   var conditionCode2 = javascriptGenerator.valueToCode(
//     block,
//     "CONDITION2",
//     javascriptGenerator.ORDER_NONE
//   );

//   // Check if there is a next block
//   var nextBlock = block.getNextBlock();
//   if (nextBlock) {
//     // Generate code for the next block and append it
//     return [
//       "(" +
//         conditionCode1 +
//         ")." +
//         conditionCode2 +
//         javascriptGenerator.statementToCode(nextBlock),
//       null,
//     ];
//   } else {
//     // If there is no next block, just return the generated code for this block
//     return ["(" + conditionCode1 + ")." + conditionCode2, null];
//   }
// };
// Define a custom function to get code from the statement block.
function getStatementCode(block) {
  var statementCode = "";
  var doBlock = block.getInputTargetBlock("test_tag_list_field");
  while (doBlock) {
    var currentCode = javascriptGenerator.blockToCode(doBlock);
    if (currentCode) {
      statementCode += currentCode;
    }
    doBlock = doBlock.getNextBlock();
  }
  return statementCode;
}

// Modify the test_tag_list_field generator to handle if block "do" section.
javascriptGenerator["test_tag_list_field"] = function (block) {
  var conditionCode1 = javascriptGenerator
    .valueToCode(block, "CONDITION1", javascriptGenerator.ORDER_NONE)
    .trim();
  var conditionCode2 = javascriptGenerator.valueToCode(
    block,
    "CONDITION2",
    javascriptGenerator.ORDER_NONE
  );

  var code = "(" + conditionCode1 + ")." + conditionCode2;

  try {
    // Try getting the code as a tuple (value block).
    var tuple = [
      getStatementCode(block) + code,
      javascriptGenerator.ORDER_NONE,
    ];
    return tuple;
  } catch (e) {
    // If it's not a tuple, get the code from the statement block if it exists.
    var statementCode = getStatementCode(block);
    if (statementCode !== "") {
      return statementCode + code;
    } else {
      // If no code in the statement block, return an empty tuple.
      return ["", javascriptGenerator.ORDER_NONE];
    }
  }
};

javascriptGenerator["test_compare_field"] = function (block) {
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

  return [assigneeCode + block.getField("HOWCOMP").getText() + valCode, null];
};

// javascriptGenerator['test_tag_field'] = function (block) {
//   var conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE);

//   return 'tag(' + conditionCode + ');\n';
// };

// javascriptGenerator['test_space_field'] = function (block) {
//   var conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE);
//   var order = javascriptGenerator.ORDER_ATOMIC

//   return [' '+ conditionCode, null];
// };

// javascriptGenerator['test_rb_field'] = function (block) {
//   var conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE);
//   var order = javascriptGenerator.ORDER_ATOMIC

//   return ['('+ conditionCode, null];
// };

// javascriptGenerator['test_lb_field'] = function (block) {
//   var conditionCode1 = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE);
//   var conditionCode2 = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE);
//   var order = javascriptGenerator.ORDER_ATOMIC

//   return [")"+conditionCode1, null];
// };
