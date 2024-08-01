import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormButton from "../../components/general/FormButton";
import FormTextField from "../../components/general/FormTextField";
import { LoginAction } from "../../redux/actions/authAction";
import { Typography, Row } from "antd";
import { LockFilled, LoginOutlined, MailFilled } from "@ant-design/icons";
import "./styles.css";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";

const initialValues = {
  Username: "",
  Password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState(initialValues);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.authReducer);

  const handleFormFields = (data) => {
    setFormFields({ ...formFields, [data.name]: data.value });
  };

  const timeoutFunction = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginAction(formFields, navigate, timeoutFunction));
  };

  return (
    <div className="authParent">
      <div className="insideAuth">
        <form onSubmit={handleSubmit}>
          <div className="authLogo">
            <img src={null} alt="" className="logo" />
          </div>
          <Row className="authChild">
            <FormTextField
              colSpan={24}
              name="Username"
              value={formFields.Username}
              onChange={handleFormFields}
              required={true}
              size={INPUT_SIZE}
              className="textInput"
              label="Username"
              prefix={<MailFilled />}
            />
            <FormTextField
              colSpan={24}
              name="Password"
              type="password"
              value={formFields.Password}
              onChange={handleFormFields}
              required={true}
              size={INPUT_SIZE}
              className="textInput"
              label="Password"
              prefix={<LockFilled />}
            />
            <div className="forgotPasswordDiv">
              <Typography.Text className="forgotPassword">
                <Link to="/forgotPassword">Forgot Password?</Link>
              </Typography.Text>
            </div>
            <div className="formAction">
              <FormButton
                colSpan={24}
                title="Login"
                htmlType="submit"
                type="primary"
                size={BUTTON_SIZE}
                className="actionButton"
                loading={userInfo.authLoading}
                icon={<LoginOutlined />}
              />
            </div>
            <Typography.Text className="signUpTxt">
              Don't have an account?
              <Link to="/signup">
                <b> Sign Up</b>
              </Link>
            </Typography.Text>
          </Row>
        </form>
        <Typography.Text className="copyRightTxt">
          Copyright © {new Date().getFullYear()}
        </Typography.Text>
      </div>
    </div>
  );
};

export default Login;
