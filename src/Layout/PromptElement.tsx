import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import * as Blockly from "blockly/core"

type SceneElement = {
    id: string,
    type: "SceneCharacterObject" | "SceneObjectObject" | "SceneLocationObject",
    outputText: string
};
type TextElement = {
    id: string,
    type: "TextInput",
    outputText: string,
    setOutputText: (block: Blockly.Block, text: string) => void
};
type ListElement = {
    id: string,
    type: "ListElement",
    elements: PromptElementType[]
}

type PromptElementType = SceneElement | TextElement | ListElement;

function PromptElement(props: {element: PromptElementType, setText?: (id: string, value: string) => void}) {
    const [focus, setFocus] = useState(false);

    switch (props.element.type) {
        case "ListElement":
            if (props.element.elements.length === 2) {
                return(
                    <>
                        <PromptElement element = {props.element.elements[0]} />
                        {" e "}
                        <PromptElement element = {props.element.elements[1]} />
                        {" "}
                    </>
                )
            } else {
                return(
                    <>
                        {props.element.elements.map(
                            (e, idx, array) => {
                                if (idx < array.length - 1) {
                                    return (
                                        <React.Fragment key = {idx}>
                                            <PromptElement element = {e} />
                                            {idx < array.length - 2 ? ", " : ""}
                                        </React.Fragment>
                                    );
                                }
                                return "";
                            }
                        )}
                        {" e "}
                        <PromptElement element = {props.element.elements.pop()!} />
                        {" "}
                    </>
                )
            }
        case "SceneCharacterObject":
        case "SceneObjectObject":
        case "SceneLocationObject":
            return(
                <>
                    <Card style={{display:"inline-block"}} >
                        {props.element.outputText}
                    </Card>
                    {" "}
                </>
            );
        
        case "TextInput":
            // Create a hidden <Form.Control> element, populate it with text and measure width, then apply to actual <Form.Control>
            const utility = document.createElement("Form.Control");
            utility.style.visibility = 'hidden';
            utility.textContent = props.element.outputText;
            document.body.appendChild(utility);
            const computedWidth = utility.offsetWidth;
            document.body.removeChild(utility);
            
            return(
                <Form
                    style={{display:"inline"}}
                    onSubmit={(e) => {e.preventDefault(); setFocus(false);}} >
                    <Form.Control
                        type="text"
                        value={props.element.outputText}
                        onClick={() => setFocus(true)}
                        onChange={(event) => props.setText!(props.element.id, event.target.value)}
                        onBlur={() => setFocus(false)}
                        readOnly={!focus}
                        plaintext={!focus}
                        style={{display:"inline", width:computedWidth, minWidth:"2em", padding:"0"}}/>
                    {" "}
                </Form>
            );
        default:
            return;
    }
}

export {PromptElement, PromptElementType};