import { ArrowLeftOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import error_image from "../assets/images/somethingWentWrong.png";

const SomethingWentWrong = () => {
  const navigate = useNavigate();
  return (
    <div className="errorParent">
      <div className="insideError">
        <div className="firstDiv">
          <img src={error_image} alt="" />
        </div>
        <div className="secondDiv">
          <h1>Oops!</h1>
          <h2>Something Went Wrong</h2>
          <a className="goBackToLogin" onClick={() => navigate("/")}>
            <Typography.Text
              style={{
                fontSize: "13px",
                fontStyle: "normal",
                color: "#4561b9",
              }}
            >
              <ArrowLeftOutlined />
              &nbsp;Back To Home
            </Typography.Text>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SomethingWentWrong;
