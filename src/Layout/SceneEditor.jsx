import { Col, Row } from "react-bootstrap";
import GlobalElements from "./GlobalElements";
import BlocklyCanvas from "./Blockly";
import { useState } from "react";
import PromptElements from "./PromptElements";

function SceneEditor() {
    const [promptElements, setPromptElements] = useState([]);

    return(
        <Col>
            <Row>
                <Col xs={3}>
                    {/*<GlobalElements />*/}
                </Col>
                <Col xs={9}>
                    <BlocklyCanvas 
                        elements={promptElements}
                        setElements={setPromptElements}
                    />
                </Col>
                <Col xs={3}>
                </Col>
            </Row>
            <Row>
                <PromptElements
                    elements={promptElements}
                />
            </Row>
        </Col>
    );
}

export default SceneEditor;