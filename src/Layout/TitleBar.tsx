import React, { useMemo, useState } from "react";
import DynamicTextField from "./DynamicTextField";
import { Breadcrumb } from "react-bootstrap";
import SubProcedure from "../Procedure/SubProcedure";

function TitleBar(props: {
  subProcedure: SubProcedure;
  handleBackSubActivity: (subProcedure: SubProcedure) => void;
}) {
  const handleClickSubProcedure = (subProcedure: SubProcedure) => {
    props.handleBackSubActivity(subProcedure);
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
    <Breadcrumb className="breadcrumb-align">
      {instantiateBreadcrums()}
    </Breadcrumb>
  );
}

export default TitleBar;
