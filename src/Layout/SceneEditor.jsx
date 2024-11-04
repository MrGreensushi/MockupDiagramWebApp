import { Col, Row } from "react-bootstrap";
import GlobalElements from "./GlobalElements";
import BlocklyCanvas from "./Blockly";
import { useCallback, useRef, useState } from "react";
import PromptElements from "./PromptElements";
import { useBlocklyWorkspace } from "react-blockly";
import { javascriptGenerator } from 'blockly/javascript';

function SceneEditor() {
    const [promptElements, setPromptElements] = useState([]);

    const toolboxCategories = {
        kind: "categoryToolbox",
        contents: [
          {
            kind: "category",
            name: "Text",
            colour: "#CCCCCC",
            contents: [
              {
                kind: "block",
                type: "TextInput",
              }
            ],
          },
          {
            kind: "category",
            name: "Characters",
            colour: "#BC6400",
            contents: [
              {
                kind: "block",
                type: "SceneObject",
              }
            ],
          },
          {
            kind: "category",
            name: "Objects",
            colour: "#5B80A5",
            contents: [
              {
                kind: "block",
                type: "SceneObject",
              }
            ],
          },
          {
            kind: "category",
            name: "Locations",
            colour: "#5CA699",
            contents: [
              {
                kind: "block",
                type: "SceneObject",
              }
            ],
          },
        ],
      };

    const handleWorkspaceChange = useCallback((workspace) => {
        let workspaceString = javascriptGenerator.workspaceToCode(workspace);
        if (workspaceString.endsWith(",")) {
            workspaceString = workspaceString.slice(0, -1);
        }

        const workspaceObject = JSON.parse("[" + workspaceString + "]");
        setPromptElements(workspaceObject);
    }, []);

    const blocklyRef = useRef(null);
    const { workspace } = useBlocklyWorkspace({
        ref: blocklyRef,
        toolboxConfiguration: toolboxCategories,
        workspaceConfiguration: {
            grid: {
              spacing: 20,
              length: 3,
              colour: "#ccc",
              snap: true,
            },
          },
        onWorkspaceChange: handleWorkspaceChange
    });

    return(
        <Col>
            <Row>
                <Col>
                    <BlocklyCanvas 
                        setElements={setPromptElements}
                        blocklyRef={blocklyRef}
                    />
                </Col>
            </Row>
            <Row>
                <PromptElements
                    elements={promptElements}
                    workspace={workspace}
                />
            </Row>
        </Col>
    );
}

export default SceneEditor;