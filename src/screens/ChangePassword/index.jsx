import { LockFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import FormButton from "../../components/general/FormButton";
import FormContainer from "../../components/general/FormContainer";
import FormTextField from "../../components/general/FormTextField";
import { resetState, setInitialState, submitForm } from "../../redux/actions/basicFormAction";

const initialValues = {
  UserId: null,
  OldPassword: "",
  NewPassword: "",
  ConfirmPassword: "",
  UserName: ""
};
const ChangePassword = () => {
  const [formFields, setFormFields] = useState(initialValues);
  const [passwordMatched, setPasswordMatched] = useState(false);
  const userData = useSelector((state) => state.authReducer);
  const controller = new window.AbortController();
  const dispatch = useDispatch();




  useEffect(() => {
    if (
      formFields.NewPassword !== "" &&
      formFields.NewPassword === formFields.ConfirmPassword
    ) {
      setPasswordMatched(true);
    } else {
      setPasswordMatched(false);
    }
  }, [formFields]);

  const handleFormFieldsChange = (data) => {
    setFormFields({ ...formFields, [data.name]: data.value });
  };

  const formSubmit = (e) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/ChangePassword",
        { ...formFields, UserName: userData.UserName },
        initialValues,
        controller,
        userData,
        3
      )
    );
  };

  return (
    <div style={{ margin: 5 }}>
      <h1 style={{ color: "#4561B9", fontSize: 28 }}>
        <b>Change Password</b>
      </h1>
      <div
        style={{
          background: "white",
          padding: 15,
          boxShadow: "0 0 5px lightgray",
          borderRadius: 2,
        }}
      >
        <FormContainer
          rowStyle={{ alignItems: "flex-end" }}
          onSubmit={formSubmit}
        >
          <FormTextField
            colSpan={4}
            placeholder="Old Password"
            name="OldPassword"
            value={formFields.OldPassword}
            onChange={handleFormFieldsChange}
            required={true}
            className="textInput"
            prefix={<LockFilled />}
            size={INPUT_SIZE}
            type="password"
            label="Old Password"
          />
          <FormTextField
            colSpan={4}
            placeholder="New Password"
            name="NewPassword"
            value={formFields.NewPassword}
            onChange={handleFormFieldsChange}
            required={true}
            className="textInput"
            type="password"
            size={INPUT_SIZE}
            prefix={<LockFilled />}
            label="New Password"
            maxLength={25}
            borderColor={
              formFields.NewPassword !== "" && formFields.ConfirmPassword !== ""
                ? passwordMatched
                  ? "green"
                  : "red"
                : null
            }
          />
          <FormTextField
            colSpan={4}
            placeholder="Confirm Password"
            name="ConfirmPassword"
            value={formFields.ConfirmPassword}
            onChange={handleFormFieldsChange}
            required={true}
            type="password"
            className="textInput"
            prefix={<LockFilled />}
            size={INPUT_SIZE}
            label="Confirm Password"
            maxLength={25}
            borderColor={
              formFields.NewPassword !== "" && formFields.ConfirmPassword !== ""
                ? passwordMatched
                  ? "green"
                  : "red"
                : null
            }
          />
          <FormButton
            title="Change Password"
            type="primary"
            size={BUTTON_SIZE}
            colSpan={4}
            htmlType="submit"
            disabled={!passwordMatched}
          />
        </FormContainer>
      </div>
    </div>
  );
};

export default ChangePassword;
