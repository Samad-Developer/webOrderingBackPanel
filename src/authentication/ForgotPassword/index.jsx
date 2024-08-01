import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormButton from "../../components/general/FormButton";
import FormTextField from "../../components/general/FormTextField";
import { ForgotPasswordAction } from "../../redux/actions/authAction";
import { Typography, Row } from "antd";
import {
  ArrowLeftOutlined,
  LoginOutlined,
  MailFilled,
} from "@ant-design/icons";
import "./styles.css";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";

const initialValues = {
  Email: "",
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState(initialValues);
  const dispatch = useDispatch();

  const handleFormFields = (data) => {
    setFormFields({ ...formFields, [data.name]: data.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(ForgotPasswordAction(formFields, navigate));
  };

  return (
    <div className="authParent">
      <div className="insideAuth">
        <form onSubmit={handleSubmit}>
          <div className="authLogo">
            <img src={logo} alt="" className="logo" />
          </div>
          <Row className={"authChild"}>
            <FormTextField
              colSpan={24}
              name="Email"
              label="Email"
              value={formFields.Email}
              onChange={handleFormFields}
              required={true}
              size={INPUT_SIZE}
              className="textInput"
              prefix={<MailFilled />}
            />

            <div className="formAction">
              <FormButton
                colSpan={24}
                title="Submit"
                htmlType="submit"
                type="primary"
                size={BUTTON_SIZE}
                className="actionButton"
                icon={<LoginOutlined />}
              />
            </div>
            <Link to="/login" className="goBackToLogin">
              <Typography.Text
                style={{
                  fontFamily: "Calibri",
                  fontSize: "13px",
                  fontStyle: "normal",
                  color: "#4561b9",
                }}
              >
                <ArrowLeftOutlined />
                &nbsp;Go back to login
              </Typography.Text>
            </Link>
          </Row>
        </form>
        <Typography.Text className="copyRightTxt">
          Copyright © {new Date().getFullYear()}
        </Typography.Text>
      </div>
    </div>
  );
};

export default ForgotPassword;
