import React from "react";
import { Divider } from "antd";

const gradientColors = ["#4b6cb7", "#182848"]; // replace with your desired gradient colors

const dividerStyle = {
  background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
  width: "100%",
  height: "4px",
  margin: "32px 0",
  position: "relative",
};

const titleStyle = {
  background: "#fff",
  fontWeight: "bold",
  left: "16px",
  padding: "0 16px",
  position: "absolute",
  top: "-10px",
  borderRadius: "5px",
};

function DividerComp(props) {
  return (
    <Divider style={dividerStyle}>
      <span style={titleStyle}>{props.title}</span>
    </Divider>
  );
}

export default DividerComp;
