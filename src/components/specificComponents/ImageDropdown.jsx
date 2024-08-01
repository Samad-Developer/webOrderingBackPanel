import { Button, Dropdown } from "antd";
import React from "react";
import { DownOutlined } from "@ant-design/icons";

const ImageDropdown = (props) => {
  const { title, menu, image, DisplayText } = props;

  return (
    <Dropdown overlay={menu} style={{ margin: "0 5px" }} trigger={"click"}>
      <Button
        style={{
          height: 46,
          justifyContent: "center",
          alignItems: "center",
          padding: "4px 10px",
          display: "flex"
        }}
      >
        {DisplayText && (
          <div
            style={{
              background: "#017971",
              padding: 1,
              borderRadius: "50%",
              height: 35,
              width: 35,
              marginRight: 5
            }}
          >
            <h2>{DisplayText}</h2>
          </div>
        )}
        {/* {image && <img src={image} alt="" className="userImage" />} */}
        <div className="userTitle">{title}</div>
        <div className="userIcon">
          <DownOutlined />
        </div>
      </Button>
    </Dropdown>
  );
};

export default ImageDropdown;
