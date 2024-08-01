import { Button, message } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormButton from "../../../components/general/FormButton";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import { postRequest } from "../../../services/mainApp.service";

export default function Counter(props) {
  const {
    handleCancel,
    counterModal,
    DayShiftTerminalInitialFormValues,
    closeCounterModal,
  } = props;
  let terminalTable;
  try {
    terminalTable = JSON.parse(localStorage.getItem("terminalTable"));
  } catch (error) {}

  const userData = useSelector((state) => state.authReducer);

  const [terminalFormValues, setTerminalFormValues] = useState(
    DayShiftTerminalInitialFormValues
  );

  const handleChange = (event) => {
    setTerminalFormValues({
      ...terminalFormValues,
      [event.name]: parseInt(event.value, 0),
    });
  };

  const startCounterRequest = (terminalFormValues) => {
    if (terminalFormValues.TerminalOpeningAmount <= 0) {
      message.error("Starting ammount cant be zero");
      return;
    }

    postRequest("/BusinessDayShiftTerminal", {
      ...terminalFormValues,
      BusinessDayId: parseInt(localStorage.getItem("businessDayId"), 0),
      ShiftDetailId: parseInt(localStorage.getItem("shifDetailId"), 0),
      ShiftId: parseInt(localStorage.getItem("s_id"), 0),
      BranchId: parseInt(localStorage.getItem("selectedBranchId"), 0),
      OperationId: 6,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "12.1.1.2",
    })
      .then((response) => {
        if (response.error === true) {
          message.error("Counter Already Started");
          if (response.errorMessage === "Shift Not Started.") {
            localStorage.setItem(
              "terminalId",
              response.data.DataSet.Table3[0].TerminalId
            );
            const termDetailId =
              response.data.DataSet.Table1[0].TerminalDetailId;
            localStorage.setItem("terminalDetailId", termDetailId);
            closeCounterModal();
          }
          return;
        }

        localStorage.setItem(
          "terminalId",
          response.data.DataSet.Table3[0].TerminalId
        );
        const termDetailId = response.data.DataSet.Table1[0].TerminalDetailId;
        localStorage.setItem("terminalDetailId", termDetailId);
        if (termDetailId > 0) {
          closeCounterModal();
          message.success("Terminal  started");
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <ModalComponent
      title="Counter"
      isModalVisible={counterModal}
      handleCancel={handleCancel}
      footer={[<Button onClick={closeCounterModal}>Close</Button>]}
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
          placeholder="Starting Amount"
          style={{ width: "250px" }}
          label="Amount"
          required
          name="TerminalOpeningAmount"
          type="number"
          value={terminalFormValues.TerminalOpeningAmount}
          onChange={handleChange}
        />

        <FormSelect
          colSpan={4}
          listItem={terminalTable || []}
          idName="TerminalId"
          valueName="TerminalName"
          size={INPUT_SIZE}
          name="TerminalId"
          label="Select Terminal"
          value={terminalFormValues.TerminalId}
          onChange={handleChange}
          required
        />

        <FormButton
          title="Start Counter"
          type="primary"
          onClick={() => startCounterRequest(terminalFormValues)}
        />
      </div>
    </ModalComponent>
  );
}
