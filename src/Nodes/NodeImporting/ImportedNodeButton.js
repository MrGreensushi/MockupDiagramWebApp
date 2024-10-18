const ImportedNodeButton=({addExistingNode,importedNode})=>{
    return (
        <>
          {importedNode && (
            <button
              onClick={() => addExistingNode(importedNode)}
              style={{ marginBottom: "10px" }}
            >
              {importedNode.label}
            </button>
          )}
        </>
      );
};

export default ImportedNodeButton;