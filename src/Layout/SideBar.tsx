import React, { ReactNode, useMemo } from "react";
import { Col, Row } from "react-bootstrap";

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
    };

    if (props.isLeft) {
      baseStyle = { ...baseStyle, left: "0px" };
    } else baseStyle = { ...baseStyle, right: "0px" };

    return baseStyle;
  };

  return (
    <Col style={style()}>
      <Row style={{ backgroundColor: "#EBEBEB" }}>{props.header}</Row>

      <Row
        style={{
          maxHeight: "100%",
          overflowY: "auto",
          maxWidth: "100%",
          margin: "0",
        }}
      >
        {props.children}
      </Row>
    </Col>
  );
}

export default SideBar;
