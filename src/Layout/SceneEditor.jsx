import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { baseToolboxCategories, BlocklyCanvas, populateCustomToolbox, workspaceConfiguration } from "../Blockly/BlocklyConfiguration";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBlocklyWorkspace } from "react-blockly";
import { javascriptGenerator } from 'blockly/javascript';
import initBlocks from "../Blockly/Blocks";
import PromptElements from "./PromptElements";
import AddElementsModal from "./AddElementsModal";
import SceneDetails from "./SceneDetails";
import SceneDescription from "../StoryElements/SceneDescription";
import saveToDisc from "../Misc/SaveToDisc";

function SceneEditor() {
    const [promptElements, setPromptElements] = useState([]);
    const [modal, setModal] = useState("");
    
    const blocklyRef = useRef(null);

    const handleWorkspaceChange = useCallback((workspace) => {
        let workspaceString = javascriptGenerator.workspaceToCode(workspace);
        if (workspaceString.endsWith(",")) {
            workspaceString = workspaceString.slice(0, -1);
        }
        const workspaceObject = JSON.parse("[" + workspaceString + "]");
        setPromptElements(workspaceObject);
    }, []);

    const {workspace} = useBlocklyWorkspace({
        ref: blocklyRef,
        toolboxConfiguration: baseToolboxCategories,
        workspaceConfiguration: workspaceConfiguration,
        onWorkspaceChange: handleWorkspaceChange
    });

    const sceneDescription = new SceneDescription(workspace);
    
    [sceneDescription.summary, sceneDescription.setSummary] = useState("");
    [sceneDescription.time, sceneDescription.setTime] = useState("");
    [sceneDescription.weather, sceneDescription.setWeather] = useState("");
    [sceneDescription.tone, sceneDescription.setTone] = useState("");
    [sceneDescription.value, sceneDescription.setValue] = useState("");
    
    const handleSave = () => {
        saveToDisc(sceneDescription.toJSON(), "Scene", "application/json");
    }

    const handleLoad = async (file) => {
        if (!file) return;
        sceneDescription.fromJSON(await file.text());
    }

    useEffect(() => initBlocks(), []);
    useEffect(() => {
        if (workspace) populateCustomToolbox(workspace, setModal);
    }, [workspace]);

    return(
        <Col>
            <Row>
                <AddElementsModal
                    workspace={workspace}
                    modal={modal} 
                    setModal={setModal} />
                <Col>
                    <BlocklyCanvas 
                        setElements={setPromptElements}
                        blocklyRef={blocklyRef}
                        />
                </Col>
                <Col>
                    <Card style={{height:"75%"}}>
                        <SceneDetails 
                            sceneDescription={sceneDescription} />
                    </Card>
                    <Card style={{height:"25%"}}>
                        <PromptElements
                            elements={promptElements}
                            workspace={workspace} />
                    </Card>
                </Col>
            </Row>
            <Row>
                <Button onClick={()=> handleSave()}>SALVA</Button>
                <Form.Control
                    type="file"
                    accept="application/json"
                    onChange={event => handleLoad(event.target.files[0])} />
            </Row>
        </Col>
    );
}

export default SceneEditor;