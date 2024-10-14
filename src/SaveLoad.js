import { useCallback, useState } from 'react';
import { Builder, Parser } from "xml2js"
import { Panel } from "@xyflow/react";

const SaveLoadManager = ({
    rfInstance}) => {
    const [loadedFile, setLoadedFile] = useState(null);
    
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
    }

    const onSave = useCallback(async () => {
        if (!rfInstance) return;
        
        const builder = new Builder();
        const xmlString = builder.buildObject(rfInstance.toObject());
        const blob = new Blob([xmlString], {type: "application/xml"});

        const flowURL = window.URL.createObjectURL(blob);

        let link = document.createElement("a");
        link.href = flowURL;
        link.download = "Download";
        link.click();
        link.remove()
    }, [rfInstance]);

    const onLoad = useCallback(async () => {
        if (!loadedFile) return;

        const parser = new Parser({explicitRoot: false, explicitArray: false});
        parser.parseStringPromise(await loadedFile.text())
            .then(unfixedFlow => restoreFlow(fixSingleElementArrays(unfixedFlow)))
            .catch(err => console.log(err));
    }, [loadedFile]);
    
    const restoreFlow = useCallback((flow) => {
        if (!flow) return;

        rfInstance.setNodes([...flow.nodes] ?? []);
        rfInstance.setEdges([...flow.edges] ?? []);
        rfInstance.setViewport(flow.viewport);
    }, [rfInstance]);
    
    return (
        <Panel position="top-right">
            <button onClick={onSave}>Save</button>
            <input type="file" accept="application/xml" onChange={event => setLoadedFile(event.target.files[0])}/>
            <button onClick={onLoad}>Load</button>
        </Panel>
    );
};

export default SaveLoadManager;