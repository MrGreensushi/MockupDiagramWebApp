import { BlocklyWorkspace, useBlocklyWorkspace } from "react-blockly";
import "../CustomBlocks/Blocks"
import { useCallback, useRef } from "react";
import { javascriptGenerator } from 'blockly/javascript';

function BlocklyCanvas({setElements, blocklyRef}) {
    
  

  

  
  return (
    <div ref={blocklyRef} className="fill-height"></div>
  )
/*
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
  );*/
}
export default BlocklyCanvas;