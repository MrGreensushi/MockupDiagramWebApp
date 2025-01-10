import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import DynamicTextField from "./DynamicTextField.tsx";
import SubProcedure from "../Procedure/SubProcedure.ts";
import Procedure from "../Procedure/Procedure.ts";
import ProcedureFlowDiagram from "../Flow/ProcedureFlowDiagram.tsx";
import { ReactFlowJsonObject } from "@xyflow/react";
import LoadNodes from "../Misc/LoadNodes.tsx";

function ProcedureEditor(props: { procedure: Procedure }) {
  const [procedure, setProcedure] = useState(props.procedure);
  const [subProcedure, setSubProcedure] = useState<SubProcedure | undefined>();

  const handleSubmit = (title: string) => {
    setProcedure((prevProcedure) => {
      const newProcedure = prevProcedure.cloneAndSetTitle(title);
      console.log(newProcedure);
      return newProcedure;
    });
  };

  const handleSubProcedure = (newSubProcedure: SubProcedure) => {
    //TODO: if subProcedure is empty add an output Node
    console.log("handleSubProcedure");
    setSubProcedure(newSubProcedure);
  };

  const handleProcedureUpdate = (reactFlowObject: ReactFlowJsonObject) => {
    setSubProcedure((prevSub) => {
      if (prevSub) {
        return prevSub.cloneAndAddFlow(reactFlowObject);
      }
      setProcedure((prevProcedure) =>
        prevProcedure.cloneAndAddFlow(reactFlowObject)
      );
      return prevSub;
    });
  };

  const handleBackSubActivity = () => {
    const toRet = subProcedure?.parent?.parent
      ? subProcedure.parent
      : undefined;

    setSubProcedure(toRet);
  };

  return (
    <Col>
      <DynamicTextField
        initialValue={
          procedure.title + (subProcedure ? " > " + subProcedure?.title : "")
        }
        onSubmit={handleSubmit}
        baseProps={{ size: "lg" }}
        disable={subProcedure ? true : false}
      />
      {/* <Row>
        {subProcedure && (
          <Button onClick={handleBackSubActivity}>
            <i className="bi bi-arrow-left-circle" />
          </Button>
        )}
      </Row> */}
      <Row style={{ width: "100%" }}>
        <Col>
          <ProcedureFlowDiagram
            procedure={
              subProcedure ?? new SubProcedure(procedure.flow, procedure.title)
            }
            setProcedure={setProcedure}
            handleSubProcedure={handleSubProcedure}
            handleProcedureUpdate={handleProcedureUpdate}
            handleBackButton={handleBackSubActivity}
            showBackButton={subProcedure ? true : false}
          />
        </Col>
      </Row>
    </Col>
  );
}

export default ProcedureEditor;
