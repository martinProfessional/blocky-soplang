import React, { useRef, useEffect, useState } from "react";
import { useSoPIoTState, useSoPIoTDispatch } from "../contexts/sopiot_context";
import { colors } from "../theme/sopiot_theme";
import { IPayload } from "../contexts/sopiot_context";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import BlocklyComponent, {
  Block,
  Value,
  Field,
  Shadow,
} from "./blockly/Blockly";
import BlocklyJS from "blockly/javascript";
import * as Blockly from "blockly/core";
import "./blockly/blocks/customblocks";
import "./blockly/generator/generator";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { TextField, Typography } from "@material-ui/core";
import TextArea from "antd/lib/input/TextArea";

const useStyles = makeStyles((theme) =>
  createStyles({
    appbar: {
      top: "auto",
      bottom: 0,
      backgroundColor: "white",
    },
    container: {
      width: "100%",
      margin: `${theme.spacing(1)} auto`,
    },
    textarea: {
      width: "100%",
      flexGrow: 1,
    },
    fabButton: {
      position: "absolute",
      zIndex: 1,
      top: 5,
      right: 40,
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      color: colors.bg,
    },
    card: {
      width: "100%",
      marginTop: theme.spacing(10),
    },
    root: {
      maxWidth: "100%",
      backgroundColor: theme.palette.background.paper,
      overflow: "auto",
      maxHeight: 300,
    },
    listSection: {
      backgroundColor: "inherit",
    },
    ul: {
      backgroundColor: "inherit",
      padding: 0,
    },
    resultTF: {
      margin: theme.spacing(1),
    },
  })
);

var newFunctionFieldFormat = {
  type: "insert_name",
  message0: "%1",
  args0: [
    {
      type: "field_react_component",
      name: "FIELD",
      text: "function name",
    },
  ],
  message1: "(%1)",
  args1: [
    {
      type: "field_input",
      name: "TEXT",
      text: "",
    },
  ],
  previousStatement: null,
};

var newValueFieldFormat = {
  type: "tbd",
  message0: "%1",
  args0: [
    {
      type: "field_input",
      name: "TEXT",
      text: "",
    },
  ],
  previousStatement: null,
  style: "text_blocks",
  helpUrl: "%{BKY_TEXT_TEXT_HELPURL}",
  tooltip: "%{BKY_TEXT_TEXT_TOOLTIP}",
  extensions: ["parent_tooltip_when_inline"],
};

function BlocklyScripter(props) {
  const sopiotState = useSoPIoTState();
  const dispatch = useSoPIoTDispatch();
  const classes = useStyles();
  // const simpleWorkspace = useRef < BlocklyComponent > null;
  const simpleWorkspace = React.createRef();

  const [isInit, setIsInit] = useState(false);
  const [convertedText, setConvertedText] = useState("");

  useEffect(() => {
    initSoPServices();

    return () => {
      setIsInit(true);
    };
  }, []);

  useEffect(() => {
    initSoPServices();
    setIsInit(true);
  });

  const setNewScenarioText = (_newScenarioText) => {
    dispatch({
      type: "SET_NEW_SCENARIO_TEXT",
      newScenarioText: _newScenarioText,
    });
  };

  const setPayloads = (_payloads) =>
    dispatch({ type: "SET_PAYLOADS", payloads: _payloads });

  const initSoPServices = () => {
    if (sopiotState.valueMap.size === 0 && sopiotState.functionMap.size === 0)
      return;

    sopiotState.functionMap.forEach((f, key, mapObject) => {
      var newFunctionField = JSON.parse(JSON.stringify(newFunctionFieldFormat));

      newFunctionField["type"] = f.name;
      newFunctionField["message0"] = `%1`;
      newFunctionField["args0"] = [
        {
          type: "field_react_component",
          name: "FIELD",
          text: f.name,
        },
      ];

      Blockly.Blocks[f.name] = {
        init: function () {
          this.jsonInit(newFunctionField);
          this.setStyle("colour_blocks");
          this.setTooltip(
            `${f.description} | 
            (${renderArguments(f.arguments)})`
          );
        },
      };

      Blockly.JavaScript[f.name] = function (block) {
        return `${f.name} (${block.getField("TEXT").getText()});\n`;
      };
    });

    sopiotState.valueMap.forEach((v, key, mapObject) => {
      var newValueField = JSON.parse(JSON.stringify(newValueFieldFormat));

      newValueField["type"] = v.name;
      newValueField["args0"] = [
        {
          type: "field_input",
          name: "TEXT",
          text: `${v.name}`,
        },
      ];
      Blockly.Blocks[v.name] = {
        init: function () {
          this.jsonInit(newValueField);
          this.setStyle("variable_blocks");
        },
      };

      Blockly.JavaScript[v.name] = function (block) {
        // Text value.
        // var code = Blockly.JavaScript.quote_(block.getFieldValue("TEXT"));
        var code = `${v.name}`;
        return code;
      };
    });
  };

  const renderArguments = (argumentList) => {
    if (argumentList === undefined) return "";

    var toRender = [];
    argumentList.map((a, i) => {
      if (i > 0) toRender.push(" ");
      toRender.push(`${a.name} [${a.min}, ${a.max}]`);
    });

    return toRender;
  };

  const renderSoPBlocks = () => {
    var toRender = [];
    sopiotState.functionMap.forEach((f, key, mapObject) => {
      toRender.push(<Block type={f.name}></Block>);
    });

    sopiotState.valueMap.forEach((v, key, mapObject) => {
      toRender.push(<Block type={v.name}></Block>);
    });

    return toRender;
  };

  const generateCode = () => {
    var code = BlocklyJS.workspaceToCode(simpleWorkspace.current?.workspace);
    console.log(code);
    setConvertedText(code);
  };

  const renderBlockly = () => {
    return (
      <div
        className="container"
        // style={{
        //   width: "100%",
        //   minHeight: "50vh",
        //   fontSize: "10px",
        //   color: "white",
        //   // backgroundColor: "#282c34",
        //   // display: "flex",
        //   flexDirection: "column",
        //   alignItems: "center",
        //   justifyContent: "center",
        // }}
      >
        <button
          onClick={() => {
            generateCode();
          }}
        >
          Convert
        </button>
        <button
          onClick={() => {
            setNewScenarioText(convertedText);
            props.moveToTab(2);
          }}
        >
          Write
        </button>
        <TextField
          fullWidth={true}
          multiline={true}
          className={classes.resultTF}
          value={convertedText}
        ></TextField>
        <BlocklyComponent
          ref={simpleWorkspace}
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
<block type="loop_field" x="0" y="0"></block>
</xml>
            `}
        >
          {renderSoPBlocks()}
          {/* <Block type="controls_whileUntil"></Block> */}
          <Block type="loop_field" />
          {/* <Block type="test_react_field" /> */}
          {/* <Block type="test_react_date_field" /> */}
          <Block type="controls_if" />
          {/* <Block type="controls_ifelse" /> */}
          <Block type="wait_until_field" />
          <Block type="logic_compare" />
          <Block type="logic_operation" />
          {/* <Block type="tag_field" /> */}
          <Block type="tag_list" />
          <Block type="value_tag_list" />

          {/* <Value name="TIMES">
              <Shadow type="math_number">
                <Field name="NUM">10</Field>
              </Shadow>
            </Value> */}

          <Block type="range_field" />
          <Block type="any_field" />
          <Block type="logic_negate" />
          {/* <Block type="logic_boolean" />
          <Block type="logic_null" disabled="true" /> */}
          {/* <Block type="text_charAt">
              <Value name="VALUE">
                <Block type="variables_get">
                  <Field name="VAR">text</Field>
                </Block>
              </Value>
            </Block> */}
        </BlocklyComponent>
      </div>
    );
  };

  return (
    <Card className={classes.card}>
      <CardContent>{isInit && renderBlockly()}</CardContent>
    </Card>
  );
}

export default BlocklyScripter;
