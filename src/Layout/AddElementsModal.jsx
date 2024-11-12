import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { addToCustomBlocks } from "../Blockly/BlocklyConfiguration.tsx";

function AddElementsModal({workspace, modal, setModal}) {
    const [blockName, setBlockName] = useState("");

    const handleModalClose = () => {
        setModal("");
        setBlockName("");
    }

    return (
        <Modal show={modal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add {modal}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label>Inserisci il nome</Form.Label>
                <Form.Control value={blockName} onChange={(e) => setBlockName(e.target.value)} autoFocus={true} />
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
    );
}

export default AddElementsModal;