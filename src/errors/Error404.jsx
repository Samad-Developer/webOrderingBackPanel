import { ArrowLeftOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import error_image from "../assets/images/error-404.png";

const Error404 = () => {
  return (
    <div className="errorParent">
      <div className="insideError">
        <div className="firstDiv">
          <img src={error_image} alt="kk" />
        </div>
        <div className="secondDiv">
          <h1>404</h1>
          <h2>Page Not Found</h2>
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

export default Error404;
