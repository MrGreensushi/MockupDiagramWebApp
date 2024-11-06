import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import GlobalElements from "./GlobalElements";
import { addToCustomBlocks, addToLocations, baseToolboxCategories, BlocklyCanvas, customToolboxCategories, flyoutCallback, workspaceConfiguration } from "./Blockly";
import { useCallback, useEffect, useRef, useState } from "react";
import PromptElements from "./PromptElements";
import { useBlocklyWorkspace } from "react-blockly";
import { javascriptGenerator } from 'blockly/javascript';
import initBlocks from "../CustomBlocks/Blocks";

function SceneEditor() {
    const [promptElements, setPromptElements] = useState([]);
    const [blockName, setBlockName] = useState("");
    const [modal, setModal] = useState("");
    useEffect(() => initBlocks(), []);

    const handleWorkspaceChange = useCallback((workspace) => {
        let workspaceString = javascriptGenerator.workspaceToCode(workspace);
        if (workspaceString.endsWith(",")) {
            workspaceString = workspaceString.slice(0, -1);
        }
        const workspaceObject = JSON.parse("[" + workspaceString + "]");
        setPromptElements(workspaceObject);
    }, []);

    const handleModalClose = () => {
        setModal("");
        setBlockName("");
    }

    const blocklyRef = useRef(null);
    const {workspace} = useBlocklyWorkspace({
        ref: blocklyRef,
        toolboxConfiguration: baseToolboxCategories,
        workspaceConfiguration: workspaceConfiguration,
        onWorkspaceChange: handleWorkspaceChange
    });

    useEffect(() => {
        if (workspace) {
            workspace.registerToolboxCategoryCallback("Characters", () => flyoutCallback("characters"));
            workspace.registerToolboxCategoryCallback("Objects", () => flyoutCallback("objects"));
            workspace.registerToolboxCategoryCallback("Locations", () => flyoutCallback("locations"));
            workspace.registerButtonCallback('createCharacterInstance', () => setModal("characters"));
            workspace.registerButtonCallback('createObjectInstance', () => setModal("objects"));
            workspace.registerButtonCallback('createLocationInstance', () => setModal("locations"));
            workspace.updateToolbox(customToolboxCategories);
        }
    }, [workspace]);

    return(
        <Col>
            <Row>
                <Col>
                    <BlocklyCanvas 
                        setElements={setPromptElements}
                        blocklyRef={blocklyRef}
                    />
                    <Modal show={modal} onHide={handleModalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add {modal}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Label>Inserisci il nome</Form.Label>
                            <Form.Control value={blockName} onChange={(e) => setBlockName(e.target.value)}></Form.Control>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleModalClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => {
                                addToCustomBlocks(modal, blockName);
                                workspace.refreshToolboxSelection();
                                handleModalClose();
                            }}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
            <Row>
                <PromptElements
                    elements={promptElements}
                    workspace={workspace}
                />
            </Row>
        </Col>
    );
}

export default SceneEditor;