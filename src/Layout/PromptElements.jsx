import { Card, CloseButton, Row } from "react-bootstrap";

function PromptElements({elements}) {
    if (!elements || elements.length === 0) return;
    
    let pendingSpace = false;
    const setPendingSpace = (state) => pendingSpace = state;
    
    let processedList = [];
    
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].type === "SceneObject") {
            const listElements = [elements[i]];
            for (let j=i+1; j < elements.length; j++) {
                i = j;
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
    console.log(processedList);

    return(
        <div>
            {processedList.map(e => ManagePromptElement(e, pendingSpace, setPendingSpace))}
        </div>
    )
}

function ManagePromptElement(element, pendingSpace, setPendingSpace) {
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
            return(
                <span key={element.id} style={{display:"inline"}}>
                    {maybeSpace + element.outputText + " "}
                </span>
            );
        default:
            return;
    }
}

export default PromptElements;