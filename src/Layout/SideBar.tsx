import React from "react";

function SideBar(props: { header: any; body: any; isLeft?: boolean }) {
  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        left: "0px",
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      <h2>{props.header}</h2>
      <div style={{ flex: "auto", overflowY: "auto" }}>{props.body}</div>
    </div>
  );
}

export default SideBar;
