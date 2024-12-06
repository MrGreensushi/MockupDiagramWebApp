import React from "react";
import { Card, Col } from "react-bootstrap";
import * as Blockly from "blockly/core"
import { PromptElement, PromptElementType } from "./PromptElement.tsx";

function PromptElements(props: {elements: PromptElementType[], workspace?: Blockly.WorkspaceSvg | null}) {
    if (!props.workspace) {
        return;
    }

    if (!props.elements || props.elements.length === 0) return(
        <Card>
            <Card.Header>
                <h4>
                    Prompt Generato
                </h4>
            </Card.Header>
            <Card.Body style={{height: "100%"}}/>
        </Card>
    );

    const workspace = props.workspace!;
    const elements = props.elements;
    
    const processedList: PromptElementType[] = [];

    const checkType = (type: string) => 
        type === "SceneCharacterObject" ||
        type === "SceneObjectObject" ||
        type === "SceneLocationObject"
    
    const setText = (id: string, text: string) => {
        const block: any = workspace.getBlockById(id);
        if (block && block.setOutputText) {
            block.setOutputText(block, text);
            workspace.refreshTheme();
        }
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
            if (listElements.length === 1) {
                processedList.push(...listElements);
            } else {
                processedList.push({id: "List " + listElements[0].id, type: "ListElement", elements: listElements});
            }
        } else {
            processedList.push(elements[i]);
        }
    }

    return(
        <Card>
            <Card.Header>
                <h4>
                    Prompt Generato
                </h4>
            </Card.Header>
            <Card.Body>
                {processedList.map((e, idx) => 
                    <PromptElement
                        element = {e}
                        setText = {setText}
                        key = {idx} />
                )}
            </Card.Body>
        </Card>
    )
}

export default PromptElements;