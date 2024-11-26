import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { CharacterElement, LocationElement, ObjectElement, StoryElementEnum, StoryElementType } from "../StoryElements/StoryElement.ts";
import React from "react";
import StoryElementInputForm from "./StoryElementInputForm.tsx";

function AddElementModal(props: {
    modal: boolean,
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
    type: StoryElementEnum
    onSubmit: (newElement: StoryElementType) => boolean
}) {
    
    let initElement: StoryElementType;
    let typeString: string;

    switch (props.type) {
        case StoryElementEnum.character:
            initElement = new CharacterElement(false, "Nuovo Personaggio");
            typeString = "personaggio";
        break;
        case StoryElementEnum.object:
            initElement = new ObjectElement(false, "Nuovo Oggetto");
            typeString = "oggetto";
        break;
        case StoryElementEnum.location:
            initElement = new LocationElement(false, "Nuovo Luogo");
            typeString = "luogo";
        break;
        default:
            throw new TypeError(props.type + " is not a valid type");
    }

    const title = "Aggiungi un nuovo " + typeString;

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
            if (props.onSubmit(element)) {
                handleModalClose();
            } else {
                setAlertText(`Un ${typeString} con questo nome esiste già.`);
                setAlert(true);
            }
        }
    }

    const checkElementInvalid = () => {
        if (!element) throw new Error("Element is undefined");
        if (!element.name || element.name === "") return "Il nome non può essere vuoto";
        return;
    }

    return (
        <Modal show={props.modal} onHide={handleModalClose}>
            <Form onSubmit={(e) => {e.preventDefault(); onConfirm()}}>
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
                    <Button variant="primary" type="submit" onClick={onConfirm}>
                        Aggiungi
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AddElementModal;