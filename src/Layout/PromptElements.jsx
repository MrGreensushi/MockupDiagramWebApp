import { useState } from "react";
import { Card, CloseButton, Form, Row } from "react-bootstrap";

function PromptElements({elements, workspace}) {
    const [clicked, setClicked] = useState(false);
    if (!elements || elements.length === 0) return;
    
    let pendingSpace = false;
    const setPendingSpace = (state) => pendingSpace = state;
    
    let processedList = [];
    
    const setText = (id, text) => {
        const b = workspace.getBlockById(id);
        b.setOutputText(b, text);
    }
    
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].type === "SceneObject") {
            const listElements = [elements[i]];
            for (let j=i+1; j < elements.length; j++, i++) {
                if (elements[j].type === "SceneObject") {
                    listElements.push(elements[j]);
                } else {
                    break;
                }
            }
            if (listElements.length == 1) {
                processedList.push(...listElements);
            } else {
                processedList.push({id: "List " + listElements[0].id, type: "List", elements: listElements});
            }
        } else {
            processedList.push(elements[i]);
        }
    }

    return(
        <div>
            {processedList.map(e => ManagePromptElement(e, pendingSpace, setPendingSpace, clicked, setClicked, setText))}
        </div>
    )
}

function ManagePromptElement(element, pendingSpace, setPendingSpace, clicked, setClicked, setText) {
    const maybeSpace = pendingSpace ? " " : "";

    switch (element.type) {
        case "List":
            setPendingSpace(true);
            if (element.elements.length == 2) {
                return(
                    <>
                        <span>{maybeSpace}</span>
                        {ManagePromptElement(element.elements[0], pendingSpace, setPendingSpace)}
                        <span> e </span>
                        {ManagePromptElement(element.elements[1], pendingSpace, setPendingSpace)}
                    </>
                )
            } else {
                return(
                    <>
                        <span>{maybeSpace}</span>
                        {element.elements.map(
                            (e, idx, array) => {
                                if (idx < array.length - 1) {
                                    return (
                                        <>
                                            {ManagePromptElement(e, pendingSpace, setPendingSpace)}
                                            <span>, </span>
                                        </>
                                    );
                                }
                            }
                        )}
                        <span> e </span>
                        {ManagePromptElement(element.elements.pop(), pendingSpace, setPendingSpace)}
                    </>
                )
            }
        case "SceneObject":
            setPendingSpace(true);
            return(
                <>
                    <span>{maybeSpace}</span>
                    <Card key={element.id} style={{display:"inline"}}>
                        {element.outputText}
                    </Card>
                </>
            );
        
        case "TextInput":
            setPendingSpace(false);
            if (clicked) {
                return(
                    <>
                        <span>{maybeSpace}</span>
                        <Form.Control type="text"
                            defaultValue={element.outputText}
                            onChange={(event) => setText(element.id, event.target.value)}
                            onBlur={() => setClicked(false)}
                            style={{display:"inline-block", width:`${element.outputText.length/2}em`, padding:"0"}}/>
                        <span> </span>
                    </>
                );
            } else {
                return(
                    <>
                        <span key={element.id} style={{display:"inline"}} onClick={() => setClicked(true)}>
                            {maybeSpace + element.outputText + " "}
                        </span>
                    </>
                );
            }
        default:
            return;
    }
}

export default PromptElements;