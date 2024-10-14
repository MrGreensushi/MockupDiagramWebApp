import { useState, useEffect } from "react";
import ImportedNodeButton from "./ImportedNodeButton";

const NodeImporter = ({ addExistingNode,importedNodes }) => {
  

  

  return (
    <>
      {importedNodes.length > 0 &&
        importedNodes.map((node) => (
          <ImportedNodeButton
            key = {node.Name}
            addExistingNode={addExistingNode}
            importedNode={node}
          />
        ))}
    </>
  );
};

export default NodeImporter;
