import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import * as Blockly from 'blockly/core';
import { useBlocklyWorkspace } from "react-blockly";
import { javascriptGenerator } from 'blockly/javascript';
import { baseToolboxCategories, BlocklyCanvas, populateCustomToolbox, workspaceConfiguration } from "../Blockly/BlocklyConfiguration.tsx";
import { initBlocks } from "../Blockly/Blocks.ts";
import PromptElements from "./PromptElements.tsx";
import SceneDetails from "./SceneDetails.tsx";
import SceneDescription from "../StoryElements/SceneDescription.ts";
import saveToDisk from "../Misc/SaveToDisk.ts";
import AddElementModal from "./AddElementModal.tsx";
import { StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import NarrativeDataManager from "../StoryElements/NarrativeDataManager.ts";
import { PromptElementType } from "./PromptElement.tsx";

function SceneEditor() {
    const [promptElements, setPromptElements] = useState<PromptElementType[]>([]);
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState(StoryElementEnum.character);
    
    const blocklyRef = useRef(null);

    const handleWorkspaceChange = useCallback((workspace: Blockly.Workspace) => {
        let workspaceString = javascriptGenerator.workspaceToCode(workspace);
        if (workspaceString.endsWith(",")) {
            workspaceString = workspaceString.slice(0, -1);
        }
        const workspaceObject: PromptElementType[] = JSON.parse("[" + workspaceString + "]");
        setPromptElements(workspaceObject);
    }, []);

    const {workspace} = useBlocklyWorkspace({
        ref: blocklyRef,
        toolboxConfiguration: baseToolboxCategories,
        workspaceConfiguration: workspaceConfiguration,
        onWorkspaceChange: handleWorkspaceChange
    });

    const sceneDescription = new SceneDescription(workspace!);
    
    [sceneDescription.summary, sceneDescription.setSummary] = useState("");
    [sceneDescription.time, sceneDescription.setTime] = useState("");
    [sceneDescription.weather, sceneDescription.setWeather] = useState("");
    [sceneDescription.tone, sceneDescription.setTone] = useState("");
    [sceneDescription.value, sceneDescription.setValue] = useState("");
    
    const handleSave = () => {
        saveToDisk(sceneDescription.toJSON(), "Scene", "application/json");
    }

    const handleLoad = async (file?: File) => {
        if (!file) return;
        sceneDescription.fromJSON(await file.text());
    }

    const onClickAdd = (type: StoryElementEnum) => {
        setModalType(type);
        setModal(true);
    }

    const onSubmitNewElement = (newElement: StoryElementType) => {
        NarrativeDataManager.getInstance().add(newElement);
        workspace?.refreshToolboxSelection();
    }

    useEffect(() => initBlocks(), []);
    useEffect(() => {
        if (workspace) populateCustomToolbox(workspace, onClickAdd);
    }, [workspace]);

    return(
        <Col>
            {modal &&
                <AddElementModal 
                    modal={modal}
                    setModal={setModal}
                    type={modalType}
                    onSubmit={onSubmitNewElement}
                    />
            }
            <Row>
                <Col>
                    <BlocklyCanvas 
                        blocklyRef={blocklyRef} />
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
                <Button onClick={() => handleSave()}>SALVA</Button>
                <Form.Control
                    type="file"
                    accept="application/json"
                    onChange={e => handleLoad((e.target as HTMLInputElement).files![0])} />
            </Row>
        </Col>
    );
}

export default SceneEditor;