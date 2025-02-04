import React, { ReactNode, useMemo } from "react";
import { Card, CardHeader, Col, Row } from "react-bootstrap";

function SideBar(props: {
  header: string | ReactNode;
  children: ReactNode;
  isLeft?: boolean;
}) {
  const style = () => {
    var baseStyle: React.CSSProperties = {
      height: "80vh",
      width: "100%",
      position: "relative",
      border: "2px",
    };

    if (props.isLeft) {
      baseStyle = { ...baseStyle, left: "0px" };
    } else baseStyle = { ...baseStyle, right: "0px" };

    return baseStyle;
  };

  return (
    <Col style={style()}>
      <Card style={{ height: "100%" }}>
        <Card.Header className="mx-0 mb-1">{props.header}</Card.Header>

        <Card.Body
          style={{
            maxHeight: "100%",
            overflowY: "auto",
            maxWidth: "100%",
            margin: "0",
          }}
        >
          {props.children}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default SideBar;
