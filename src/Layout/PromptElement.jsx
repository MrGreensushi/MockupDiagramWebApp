import { useState } from "react";
import { Card, Form } from "react-bootstrap";

function PromptElement({element, pendingSpace, setPendingSpace, setText}) {
    const maybeSpace = pendingSpace ? " " : "";

    const [focus, setFocus] = useState(false);

    switch (element.type) {
        case "List":
            setPendingSpace(true);
            if (element.elements.length == 2) {
                return(
                    <>
                        {maybeSpace}
                        <PromptElement
                            element = {element.elements[0]}
                            pendingSpace = {pendingSpace}
                            setPendingSpace = {setPendingSpace} />
                        {" e "}
                        <PromptElement
                            element = {element.elements[1]}
                            pendingSpace = {pendingSpace}
                            setPendingSpace = {setPendingSpace} />
                    </>
                )
            } else {
                return(
                    <>
                        {maybeSpace}
                        {element.elements.map(
                            (e, idx, array) => {
                                if (idx < array.length - 1) {
                                    return (
                                        <>
                                            <PromptElement
                                                element = {e}
                                                pendingSpace = {pendingSpace}
                                                setPendingSpace = {setPendingSpace}
                                                key = {e.id + idx} />
                                            {", "}
                                        </>
                                    );
                                }
                            }
                        )}
                        {" e "}
                        <PromptElement
                            element = {element.elements.pop()}
                            pendingSpace = {pendingSpace}
                            setPendingSpace = {setPendingSpace} />
                    </>
                )
            }
        case "SceneObject":
            setPendingSpace(true);
            return(
                <>
                    <span>{maybeSpace}</span>
                    <Card style={{display:"inline"}} >
                        {element.outputText}
                    </Card>
                </>
            );
        
        case "TextInput":
            setPendingSpace(false);
            if (focus) {
                return(
                    <>
                        {maybeSpace}
                        <Form.Control type="text"
                            defaultValue={element.outputText}
                            onChange={(event) => setText(element.id, event.target.value)}
                            onBlur={() => setFocus(false)}
                            autoFocus={true}
                            style={{display:"inline-block", width:`${element.outputText.length/2}em`, padding:"0"}}/>
                        {" "}
                    </>
                );
            } else {
                return(
                    <>
                        <span key={element.id} style={{display:"inline"}} onClick={() => setFocus(true)}>
                            {maybeSpace + element.outputText + " "}
                        </span>
                    </>
                );
            }
        default:
            return;
    }
}

export default PromptElement;