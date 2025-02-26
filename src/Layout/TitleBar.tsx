import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Navbar,
  Modal,
  Form,
  FormControlProps,
} from "react-bootstrap";
import Procedure from "../Procedure/Procedure";

function TitleBar(props: {
  activeProcedure: Procedure;
  changeActiveProcedure: (procedureId: string) => void;
  handleSubmitTitle: (title: string) => void;
  getProcedure: (procedureId: string) => Procedure | undefined;
}) {
  const handleClickSubProcedure = (procedure: Procedure) => {
    props.changeActiveProcedure(procedure.id);
  };

  const handleChangeProcedureName = (name: string) => {
    props.handleSubmitTitle(name);
  };

  /**
   * Generates an array of breadcrumb titles for the active procedure and its parent procedures.
   *
   * This function creates an array of procedures starting from the active procedure and traversing
   * up through its parent procedures until there are no more parents. The array is then reversed
   * to ensure the breadcrumb order is from the root procedure to the active procedure.
   *
   * @returns {JSX.Element[]} An array of breadcrumb titles as JSX elements.
   */
  const instantiateBreadcrums = () => {
    //create an array with all the parentId
    const procedures = [props.activeProcedure];
    var procedure = props.activeProcedure;
    while (procedure.parentId) {
      procedure = props.getProcedure(procedure.parentId)!;
      procedures.push(procedure);
    }
    procedures.reverse();
    return procedures.map((element, index) =>
      BreadrcrumTitle(element, index, index == procedures.length - 1)
    );
  };

  /**
   * Renders a breadcrumb title component.
   *
   * @param {Procedure} sub - The procedure object containing the title.
   * @param {number} index - The index of the breadcrumb item.
   * @param {boolean} isActive - Indicates if the breadcrumb item is active.
   * @returns {JSX.Element} The breadcrumb item or a modifiable title component.
   */
  const BreadrcrumTitle = (
    sub: Procedure,
    index: number,
    isActive: boolean
  ) => {
    if (index === 0 && isActive)
      return (
        <ModifiableTitle
          key={"Modifiable Title"}
          title={props.activeProcedure.title}
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
  const handleCloseNoSave = () => {
    const invalid = isInvalid(title);
    if (invalid) return;
    setTitle(props.title);
    setShow(false);
  };

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

      <Modal show={show} onHide={handleCloseNoSave}>
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
          <Button variant="secondary" onClick={handleCloseNoSave}>
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
