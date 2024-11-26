import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import * as Blockly from 'blockly/core';
import { useBlocklyWorkspace } from "react-blockly";
import { javascriptGenerator } from 'blockly/javascript';
import { baseToolboxCategories, BlocklyCanvas, populateCustomToolbox, workspaceConfiguration } from "../Blockly/BlocklyConfiguration.tsx";
import PromptElements from "./PromptElements.tsx";
import SceneDetails from "./SceneDetails.tsx";
import AddElementModal from "./AddElementModal.tsx";
import { StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import { PromptElementType } from "./PromptElement.tsx";
import Scene from "../StoryElements/Scene.ts";
import Story from "../StoryElements/Story.ts";

function SceneEditor(props: {story: Story, setStory: React.Dispatch<React.SetStateAction<Story>>, scene: Scene, setScene: (newScene: Scene) => void}) {
    const [promptElements, setPromptElements] = useState<PromptElementType[]>([]);
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState(StoryElementEnum.character);
    
    const blocklyRef = useRef(null);
    
    const [summary, setSummary] = useState(props.scene.details.summary ?? "");
    const [time, setTime] = useState(props.scene.details.time ?? "");
    const [weather, setWeather] = useState(props.scene.details.weather ?? "");
    const [tone, setTone] = useState(props.scene.details.tone ?? "");
    const [value, setValue] = useState(props.scene.details.value ?? "");
    
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
        onWorkspaceChange: handleWorkspaceChange,
        initialJson: props.scene ? props.scene.workspace : undefined
    });

    const handleSave = () => {
        const newScene = new Scene(workspace!, summary, time, weather, tone, value);
        props.setScene(newScene);
        return newScene;
    }

    const onClickAdd = (type: StoryElementEnum) => {
        setModalType(type);
        setModal(true);
    }

    const onSubmitNewElement = (newElement: StoryElementType): boolean => {
        if (!props.story.canAddElement(newElement)) return false;
        props.setStory(oldStory => oldStory.cloneAndAddElement(newElement))
        workspace?.refreshToolboxSelection();
        return true;
    }

    const handleBlur = () => {
        handleSave();
    }

    useEffect(() => {
        if (workspace) populateCustomToolbox(props.story, workspace, onClickAdd);
    }, [props.story, workspace]);

    return(
        <Col>
            {modal &&
                <AddElementModal 
                    modal={modal}
                    setModal={setModal}
                    type={modalType}
                    onSubmit={onSubmitNewElement} />
            }
            <Row>
                <Col>
                    <BlocklyCanvas 
                        blocklyRef={blocklyRef}
                        onBlur={handleBlur} />
                </Col>
                <Col>
                <Card>
                    <Card.Body style={{height:"80vh"}}>
                        <Card style={{height:"66%"}}>
                            <SceneDetails 
                                summary={summary}
                                setSummary={setSummary}
                                time={time}
                                setTime={setTime}
                                weather={weather}
                                setWeather={setWeather}
                                tone={tone}
                                setTone={setTone}
                                value={value}
                                setValue={setValue}
                                onBlur={handleBlur} />
                        </Card>
                        <Card style={{height:"33%"}}>
                            <PromptElements
                                elements={promptElements}
                                workspace={workspace} />
                        </Card>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
        </Col>
    );
}

export default SceneEditor;