import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import moment from "moment";
import { SET_POS_STATE } from "../../../redux/reduxConstants";
import FormTextField from "../../../components/general/FormTextField";
import FormContainer from "../../../components/general/FormContainer";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import { postRequest } from "../../../services/mainApp.service";

const LoginModal = (props) => {
  const { performActionAfterAuth, visible, setVisible } = props;
  const userData = useSelector((state) => state.authReducer);
  const controller = new window.AbortController();
  const [loginData, setLoginData] = useState({
    Username: "",
    Password: "",
    BranchId: userData.BranchId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      Username: loginData.Username,
      Password: loginData.Password,
      BranchId: userData.branchId,
    };
    postRequest("/UserLoginAuth", data, controller).then((response) => {
      if (response.data.DataSet) {
        performActionAfterAuth();
        setVisible(false);
      } else {
        message.error("Unauthorized User!");
      }
    });
  };

  const loginChange = (event) => {
    setLoginData({ ...loginData, [event.name]: event.value });
  };

  return (
    <ModalComponent
      title="Authenticate"
      isModalVisible={visible}
      footer={null}
      vh
      width="40vw"
    >
      <FormContainer onSubmit={handleSubmit}>
        <FormTextField
          value={loginData.Username}
          colSpan={12}
          label="Username"
          size={INPUT_SIZE}
          name="Username"
          onChange={loginChange}
          required={true}
        />
        <FormTextField
          value={loginData.Password}
          colSpan={12}
          label="Password"
          size={INPUT_SIZE}
          name="Password"
          onChange={loginChange}
          type="password"
          required={true}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #eee",
            paddingTop: "15px",
            marginTop: "24px",
            gap: "10px",
          }}
        >
          <Button
            onClick={() => {
              setVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </div>
      </FormContainer>
    </ModalComponent>
  );
};

export default LoginModal;
