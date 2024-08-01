import { ArrowLeftOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import error_image from "../assets/images/error-500.png";

const Error500 = () => {
  return (
    <div className="errorParent">
      <div className="insideError">
        <div className="firstDiv">
          <img src={error_image} alt="error 500" />
        </div>
        <div className="secondDiv">
          <h1>500</h1>
          <h2>Internal Server Error</h2>
          <Link to="/" className="goBackToLogin">
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error500;
