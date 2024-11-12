import { Col } from "react-bootstrap";
import PromptElement from "./PromptElement";

function PromptElements({elements, workspace}) {
    if (!elements || elements.length === 0) return(
        <Col>
            <h3>
                Prompt Generato
            </h3>
        </Col>
    );
    
    let processedList = [];
    
    const checkType = (type) => 
        type === "SceneCharacterObject" ||
        type === "SceneObjectObject" ||
        type === "SceneLocationObject"
    
    const setText = (id, text) => {
        const block = workspace.getBlockById(id);
        block.setOutputText(block, text);
    }
    
    for (let i = 0; i < elements.length; i++) {
        if (checkType(elements[i].type)) {
            const listElements = [elements[i]];
            for (let j=i+1; j < elements.length; j++, i++) {
                if (checkType(elements[j].type)) {
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
        <Col>
            <h3>
                Prompt Generato
            </h3>
            {processedList.map((e, idx) => <PromptElement
                element = {e}
                setText = {setText}
                key = {idx} />
            )}
        </Col>
    )
}

export default PromptElements;