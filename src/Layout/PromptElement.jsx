import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";

function PromptElement({element, setText}) {
    const [focus, setFocus] = useState(false);

    switch (element.type) {
        case "List":
            if (element.elements.length === 2) {
                return(
                    <>
                        <PromptElement element = {element.elements[0]} />
                        {" e "}
                        <PromptElement element = {element.elements[1]} />
                        {" "}
                    </>
                )
            } else {
                return(
                    <>
                        {element.elements.map(
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
                        <PromptElement element = {element.elements.pop()} />
                        {" "}
                    </>
                )
            }
        case "SceneCharacterObject":
        case "SceneObjectObject":
        case "SceneLocationObject":
            return(
                <>
                    <Card style={{display:"inline"}} >
                        {element.outputText}
                    </Card>
                    {" "}
                </>
            );
        
        case "TextInput":
            if (focus) {
                return(
                    <>
                        <Form onSubmit={(e) => {e.preventDefault(); setFocus(false)}}>
                            <Form.Control
                                type="text"
                                defaultValue={element.outputText}
                                onChange={(event) => setText(element.id, event.target.value)}
                                onBlur={() => setFocus(false)}
                                onSubmit={() => {console.log("Enter");}}
                                autoFocus={true}
                                style={{display:"inline-block", width:`${element.outputText.length/2}em`, padding:"0"}}/>
                        </Form>
                        {" "}
                    </>
                );
            } else {
                return(
                    <span key={element.id} style={{display:"inline"}} onClick={() => setFocus(true)}>
                        {element.outputText + " "}
                    </span>
                );
            }
        default:
            return;
    }
}

export default PromptElement;