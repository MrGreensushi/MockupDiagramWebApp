import { useState, useEffect } from "react";
import ImportedNodeButton from "./ImportedNodeButton";

const NodeImporter = ({ addExistingNode }) => {
  const [importedNodes, setImportedNodes] = useState([]);

  useEffect(() => {
    fetch("/nodes")
      .then((res) => {
        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Parse the JSON response
      })
      .then((data) => {
        setImportedNodes(data);
        console.log(data); // Set the nodes with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
