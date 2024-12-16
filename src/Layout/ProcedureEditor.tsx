import React, {useState } from "react";
import { Col, Row } from "react-bootstrap";
import DynamicTextField from "./DynamicTextField.tsx";
import Procedure from "../Procedure/Procedure.ts";
import ProcedureFlowDiagram from "../Flow/ProcedureFlowDiagram.tsx";

function ProcedureEditor() {
    const [procedure, setProcedure] = useState(new Procedure());
    const handleSubmit = (title: string) => {
        setProcedure(story => story.cloneAndSetTitle(title));
    }

    return (
        <Col>
            <DynamicTextField
                initialValue={procedure.title}
                onSubmit={handleSubmit}
                baseProps={{size:"lg"}} />
            <Row style={{width: "100%"}}>
                <Col>
                <ProcedureFlowDiagram
                    procedure={procedure}
                    setProcedure={setProcedure}/>
                </Col>
            </Row>
        </Col>
    );
}

export default ProcedureEditor;