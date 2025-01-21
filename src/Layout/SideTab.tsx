import React, { ReactNode } from "react";
import { Offcanvas } from "react-bootstrap";

function SideTab(props: {
  title: string | ReactNode;
  showSideTab: boolean;
  setShowSideTab: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}) {
  const handleClose = () => {
    props.setShowSideTab(false);
  };

  return (
    <Offcanvas
      show={props.showSideTab}
      onHide={handleClose}
      placement="end"
      scroll={true}
      className="w-35"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ width: "100%" }}>
          {props.title}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>{props.children}</Offcanvas.Body>
    </Offcanvas>
  );
}

export default SideTab;
