import { BlocklyWorkspace } from "react-blockly";
import "../CustomBlocks/Blocks"
import { useCallback } from "react";
import { javascriptGenerator } from 'blockly/javascript';

function BlocklyCanvas({elements, setElements}) {
    
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
    setElements(workspaceObject);
  }, [setElements]);

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
      </>
    );
}
export default BlocklyCanvas;