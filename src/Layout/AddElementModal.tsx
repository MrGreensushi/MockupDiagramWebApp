import { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { CharacterElement, LocationElement, ObjectElement, StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import React from "react";
import StoryElementInputForm from "./StoryElementInputForm.tsx";

function AddElementModal(props: {
    modal: boolean,
    setModal: (modal: boolean) => void,
    type: StoryElementEnum
    onSubmit: (newElement: StoryElementType) => void
}) {
    const commonHeaderString = "Aggiungi un nuovo ";
    
    let initElement: StoryElementType;
    let title = commonHeaderString;

    switch (props.type) {
        case StoryElementEnum.character:
            initElement = new CharacterElement(false, "Nuovo Personaggio");
            title += "personaggio";
        break;
        case StoryElementEnum.object:
            initElement = new ObjectElement(false, "Nuovo Oggetto");
            title += "oggetto";
        break;
        case StoryElementEnum.location:
            initElement = new LocationElement(false, "Nuovo Luogo");
            title += "luogo";
        break;
        default:
            throw new TypeError(props.type + " is not a valid type");
    }

    const [element, setElement] = useState(initElement);
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState("");

    const handleModalClose = () => {
        props.setModal(false);
        setElement(initElement);
        setAlert(false);
        setAlertText("");
    }

    const onConfirm = () => {
        const errorMessage = checkElementInvalid();
        if (errorMessage) {
            setAlertText(errorMessage);
            setAlert(true);
        } else {
            props.onSubmit(element);
            handleModalClose();
        }
    }

    const checkElementInvalid = () => {
        if (!element) throw new Error("Element is undefined");
        if (!element.name || element.name === "") return "Il nome non può essere vuoto";
        return;
    }

    return (
        <Modal show={props.modal} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <StoryElementInputForm
                    type={props.type}
                    element={element}
                    setElement={setElement} />
                    {alert && (
                    <Alert
                        variant={"danger"}
                        dismissible
                        onClose={() => setAlert(false)} >
                        {alertText}
                    </Alert>
                    )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    Annulla
                </Button>
                <Button variant="primary" onClick={() => {
                    //addToCustomBlocks(props.type.toString(), blockName);
                    //props.workspace?.refreshToolboxSelection();
                    onConfirm();
                }}>
                    Aggiungi
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddElementModal;