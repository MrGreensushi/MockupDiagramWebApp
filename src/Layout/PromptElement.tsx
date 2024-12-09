import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import * as Blockly from "blockly/core"

type ScenePromptElement = {
    id: string,
    type: "SceneCharacterObject" | "SceneObjectObject" | "SceneLocationObject",
    outputText: string
};
type TextPromptElement = {
    id: string,
    type: "TextInput",
    outputText: string,
    setOutputText: (block: Blockly.Block, text: string) => void
};
type ListPromptElement = {
    id: string,
    type: "ListElement",
    outputText?: "",
    elements: PromptElementType[]
}

type PromptElementType = ScenePromptElement | TextPromptElement | ListPromptElement;

function PromptElement(props: {element: PromptElementType, setText?: (id: string, value: string) => void, noTrailingSpace?: boolean}) {
    const [focus, setFocus] = useState(false);
    
    const maybeSpace = props.noTrailingSpace ? "" : " "; 
    switch (props.element.type) {
        case "ListElement":
            if (props.element.elements.length === 2) {
                return(
                    <>
                        <PromptElement element = {props.element.elements[0]} />
                        {" e "}
                        <PromptElement element = {props.element.elements[1]} />
                        {maybeSpace}
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
                                            <PromptElement element = {e} noTrailingSpace={true} />
                                            {idx < array.length - 2 ? ", " : ""}
                                        </React.Fragment>
                                    );
                                }
                                return "";
                            }
                        )}
                        {" e "}
                        <PromptElement element = {props.element.elements.pop()!} />
                        {maybeSpace}
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
                    {maybeSpace}
                </>
            );
        
        case "TextInput":
            // Create a hidden <Form.Control> element,
            // populate it with text and measure width,
            // then apply to actual <Form.Control>
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
                    {focus ? 
                        <Form.Control
                            type="text"
                            defaultValue={props.element.outputText}
                            onBlur={() => setFocus(false)}
                            onChange={(e) => props.setText!(props.element.id, e.target.value)}
                            readOnly={false}
                            plaintext={false}
                            style={{display:"inline", width:computedWidth, minWidth:"2em", padding:"0"}}/>
                    :
                        <Form.Control
                            type="text"
                            value={props.element.outputText}
                            onClick={() => setFocus(true)}
                            readOnly={true}
                            plaintext={true}
                            style={{display:"inline", width:computedWidth, minWidth:"2em", padding:"0"}}/>
                    }
                    {maybeSpace}
                </Form>
            );
        default:
            return;
    }
}

export {PromptElement, PromptElementType};