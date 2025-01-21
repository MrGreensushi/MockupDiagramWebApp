import React, { useMemo, useState } from "react";
import DynamicTextField from "./DynamicTextField.tsx";
import { Breadcrumb, Row, Button, Navbar } from "react-bootstrap";
import SubProcedure from "../Procedure/SubProcedure";
import OperationMenu from "./OperationMenu.tsx";
import { ReactFlowInstance, ReactFlowJsonObject } from "@xyflow/react";
import Procedure from "../Procedure/Procedure.ts";

function TitleBar(props: {
  subProcedure: SubProcedure;
  handleBackSubActivity: (subProcedure: SubProcedure) => void;
  handleSubmitTitle: (title: string) => void;
}) {
  const handleClickSubProcedure = (subProcedure: SubProcedure) => {
    props.handleBackSubActivity(subProcedure);
  };

  const handleChangeProcedureName = (name: string) => {
    props.handleSubmitTitle(name);
  };

  const instantiateBreadcrums = () => {
    const procedures = [props.subProcedure];
    var subProc = props.subProcedure;
    while (subProc.parent) {
      procedures.push(subProc.parent);
      subProc = subProc.parent;
    }
    procedures.reverse();
    return procedures.map((element, index) =>
      BreadrcrumTitle(element, index, index == procedures.length - 1)
    );
  };

  const BreadrcrumTitle = (
    sub: SubProcedure,
    index: number,
    isActive: boolean
  ) => {
    return (
      <Breadcrumb.Item
        key={"Breadcrub " + index}
        onClick={() => handleClickSubProcedure(sub)}
        active={isActive}
      >
        {sub.title}
      </Breadcrumb.Item>
    );
  };

  return (
    <Navbar>
      <Navbar.Brand>
        <Breadcrumb className="breadcrumb-align">
          {instantiateBreadcrums()}
        </Breadcrumb>
      </Navbar.Brand>
    </Navbar>
  );
}

export default TitleBar;
