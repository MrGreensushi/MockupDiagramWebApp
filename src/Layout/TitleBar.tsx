import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Navbar, Modal, Form } from "react-bootstrap";
import SubProcedure from "../Procedure/SubProcedure";

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
    if (index === 0 && isActive)
      return (
        <ModifiableTitle
          title={props.subProcedure.title}
          handleChangeProcedureName={handleChangeProcedureName}
        />
      );

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
      <Navbar.Brand key={"navBar brand"}>
        <Breadcrumb className="breadcrumb-align">
          {instantiateBreadcrums()}
        </Breadcrumb>
      </Navbar.Brand>
    </Navbar>
  );
}

function ModifiableTitle(props: {
  title: string;
  handleChangeProcedureName: (value: string) => void;
}) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(props.title);

  useEffect(() => {
    setTitle(props.title);
  }, [props.title]);

  const handleClose = () => setShow(isInvalid(title));
  const handleShow = () => setShow(true);

  const handleSave = () => {
    props.handleChangeProcedureName(title);
    handleClose();
  };

  const isInvalid = (value: string) => {
    return value === "";
  };
  return (
    <>
      <Breadcrumb.Item key={"Breadcrub-title"} onClick={handleShow} active>
        {title}
      </Breadcrumb.Item>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isInvalid={isInvalid(title)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TitleBar;
