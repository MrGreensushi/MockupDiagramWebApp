import { BlocklyWorkspace } from "react-blockly";
import "../CustomBlocks/Blocks"
import { useCallback, useState } from "react";
import { javascriptGenerator } from 'blockly/javascript';

function BlocklyCanvas() {
  const [code, setCode] = useState("");
    
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
    const newCode = javascriptGenerator.workspaceToCode(workspace);
    setCode(newCode.trim());
  }, []);

    return (
      <>
        <BlocklyWorkspace
            toolboxConfiguration={toolboxCategories}
            className="fill-height"
            onWorkspaceChange={handleWorkspaceChange}
            workspaceConfiguration={{
              grid: {
                spacing: 20,
                length: 3,
                colour: "#ccc",
                snap: true,
              },
            }}
            />
        <pre>{code}</pre> {/* Mostra il codice generato */}
      </>
    );
}
export default BlocklyCanvas;