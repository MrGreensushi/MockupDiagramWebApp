import { useCallback, useState } from "react";
import { Builder, Parser } from "xml2js";
import { Panel } from "@xyflow/react";
import saveToDisk from "../Misc/SaveToDisk.ts";

const SaveLoadManager = ({ rfInstance, setNodes, setEdges }) => {
  
  const fixSingleElementArrays = (obj) => {
    const nodes = obj["nodes"];
    const edges = obj["edges"];

    if (!Array.isArray(nodes)) {
      obj["nodes"] = [nodes];
    }
    if (!Array.isArray(edges)) {
      obj["edges"] = [edges];
    }
    return obj;
  };

  const onSave = useCallback(async () => {
    if (!rfInstance) return;

    const builder = new Builder();
    const xmlString = builder.buildObject(rfInstance.toObject());
    saveToDisk(xmlString, "Flow", "application/xml");
  }, [rfInstance]);

  const onLoad = useCallback(async (file) => {
    if (!file) return;

    const parser = new Parser({ explicitRoot: false, explicitArray: false });
    parser
      .parseStringPromise(await file.text())
      .then(unfixedFlow => {const f = fixSingleElementArrays(unfixedFlow); console.log(f); restoreFlow(f);})
      .catch(err => console.log(err));
  }, [rfInstance]);

  const restoreFlow = useCallback(
    (flow) => {
      if (!flow) return;

      setNodes([...flow.nodes] ?? []);
      setEdges([...flow.edges] ?? []);
      rfInstance.setViewport(flow.viewport);
    },
    [rfInstance]
  );

  return (
    <Panel position="top-right">
      <button onClick={onSave}>Save</button>
      <input
        type="file"
        accept="application/xml"
        onChange={(event) => onLoad(event.target.files[0])}
      />
    </Panel>
  );
};

export default SaveLoadManager;
