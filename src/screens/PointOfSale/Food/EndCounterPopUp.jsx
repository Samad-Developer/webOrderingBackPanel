import { Button, message } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormButton from "../../../components/general/FormButton";
import FormTextField from "../../../components/general/FormTextField";
import { postRequest } from "../../../services/mainApp.service";

export default function EndCounterPopUp(props) {
  const userData = useSelector((state) => state.authReducer);
  const {
    endCounterModal,
    handleCancel,
    DayShiftTerminalInitialFormValues,
    closeEndCounterPopUp,
  } = props;
  const [terminalFormValues, setTerminalFormValues] = useState(
    DayShiftTerminalInitialFormValues
  );

  const startEndCounterRequest = (terminalFormValues) => {
    if (terminalFormValues.TerminalClosingAmount <= 0) {
      message.error("Closing amount cant be zero!");
      return;
    }

    postRequest("/BusinessDayShiftTerminal", {
      ...terminalFormValues,
      BusinessDayId: parseInt(localStorage.getItem("businessDayId"), 0),
      ShiftDetailId: parseInt(localStorage.getItem("shifDetailId"), 0),
      ShiftId: parseInt(localStorage.getItem("s_id"), 0),
      BranchId: parseInt(localStorage.getItem("selectedBranchId"), 0),
      TerminalId: parseInt(localStorage.getItem("terminalId"), 0),
      TerminalDetailId: parseInt(localStorage.getItem("terminalDetailId"), 0),
      OperationId: 7,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "12.1.1.2",
    })
      .then((response) => {
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }

        localStorage.setItem("terminalId", 0);
        localStorage.setItem("terminalDetailId", 0);
        message.success("Terminal Closed Successfully!");
        closeEndCounterPopUp();
      })
      .catch((error) => console.error(error));
  };
  return (
    <ModalComponent
      title="End Counter"
      isModalVisible={endCounterModal}
      handleCancel={handleCancel}
      footer={[
        <Button type="primary" onClick={handleCancel}>
          Close
        </Button>,
      ]}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <FormTextField
          placeholder="Closing  Amount"
          style={{ width: "250px" }}
          label="Closing Amount"
          required
          name="TerminalClosingAmount"
          type="number"
          value={terminalFormValues.TerminalClosingAmount}
          onChange={(e) =>
            setTerminalFormValues({
              ...terminalFormValues,
              TerminalClosingAmount: parseInt(e.value, 0),
            })
          }
        />

        <FormButton
          title="End Counter"
          type="primary"
          onClick={() => startEndCounterRequest(terminalFormValues)}
        />
      </div>
    </ModalComponent>
  );
}
