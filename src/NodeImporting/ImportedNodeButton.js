const ImportedNodeButton=({addExistingNode,importedNode})=>{
    return (
        <>
          {importedNode && (
            <button
              onClick={() => addExistingNode(importedNode)}
              style={{ marginBottom: "10px" }}
            >
              {importedNode.Name}
            </button>
          )}
        </>
      );
};

export default ImportedNodeButton;