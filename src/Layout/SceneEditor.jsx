import { Col, Row } from "react-bootstrap";
import GlobalElements from "./GlobalElements";
import BlocklyCanvas from "./Blockly";

function SceneEditor() {
    return(
        <Row>
            <Col xs={3}>
                <GlobalElements />
            </Col>
            <Col xs={9}>
                <BlocklyCanvas />
            </Col>
            <Col xs={3}>
            </Col>
        </Row>
    );
}

export default SceneEditor;