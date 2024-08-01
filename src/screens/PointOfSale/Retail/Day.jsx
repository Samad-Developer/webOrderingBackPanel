import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormButton from "../../../components/general/FormButton";
import FormSelect from "../../../components/general/FormSelect";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import { useSelector } from "react-redux";
import { postRequest } from "../../../services/mainApp.service";

export default function Day(props) {
  const {
    dayModal,
    modalLoading,
    // startDayRequest,
    branchesList,
    DayShiftTerminalInitialFormValues,
    openShiftModal,
  } = props;
  const userData = useSelector((state) => state.authReducer);
  const [dayFormValues, setDayFormValues] = useState(
    DayShiftTerminalInitialFormValues
  );

  const startDayRequest = (dayFormValues) => {
    //  setIsModalLoading(true);
    localStorage.setItem("selectedBranchId", dayFormValues.BranchId);
    postRequest("/BusinessDayShiftTerminal", {
      ...dayFormValues,
      OperationId: 2,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "12.1.1.2",
    })
      .then((response) => {
        //   setIsModalLoading(false);
        if (response.error === true) {
          // if (
          //   response.data.DataSet.Table3.length === 0 ||
          //   response.data.DataSet.Table3 === null
          // ) {
          //   message.error("No terminal exist against the branch.");
          //   return;
          // }
          message.error(response.errorMessage);
          if (response.errorMessage === "Business Day Already Started.") {
            localStorage.setItem(
              "businessDayId",
              response.data.DataSet.Table1[0].BusinessDayId
            );

            localStorage.setItem(
              "terminalTable",
              JSON.stringify(response.data.DataSet.Table3)
            );

            openShiftModal();
          }
          return;
        }

        const Table = response.data.DataSet.Table1;
        let businessDayId = Table[0].BusinessDayId;
        localStorage.setItem("businessDayId", businessDayId);
        // if (
        //   response.data.DataSet.Table3.length === 0 ||
        //   response.data.DataSet.Table3 === null
        // ) {
        //   message.error("No terminal exist against the branch.");
        //   return;
        // }
        localStorage.setItem(
          "terminalTable",
          JSON.stringify(response.data.DataSet.Table3)
        );
        openShiftModal();
      })
      .catch((error) => console.error(error));
  };

  return (
    <ModalComponent
      title="Start Your Day"
      isModalVisible={dayModal}
      footer={null}
    >
      <div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {modalLoading && <Spin />}
          <p>
            {moment().format("dddd") + " - " + moment().format("MMM Do YY")}
          </p>
          <FormSelect
            colSpan={4}
            listItem={branchesList || []}
            idName="BranchId"
            valueName="BranchName"
            size={INPUT_SIZE}
            name="BranchId"
            label="Branch"
            value={dayFormValues.BranchId || ""}
            onChange={(e) => {
              setDayFormValues({ ...dayFormValues, BranchId: e.value });
            }}
          />

          <FormButton
            onClick={() => startDayRequest(dayFormValues)}
            type="primary"
            title="Start Day"
          />
        </div>
      </div>
    </ModalComponent>
  );
}
