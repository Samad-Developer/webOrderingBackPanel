import { LoadingOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormSelect from "../../../components/general/FormSelect";
import { SET_POS_STATE } from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const ChangePaymentTypePopUp = (props) => {
  const { isModalVisible, handleCancel, userData, getOrderList } = props;

  const dispatch = useDispatch();
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const { selectedOrder } = posState;
  const { RiderId, WaiterId, TableId, riderName } = posState;
  const { OrderMasterId, BranchId } = selectedOrder;
  const [paymentType, setPaymentType] = useState(null);

  useEffect(() => {
    setPaymentType(selectedOrder.PaymentTypeId);
  }, [selectedOrder]);

  const toggleRiders = (riderId) => {
    if (posState.riderId === riderId) {
      setSelectedRiderId(null);
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "riderId",
          value: null,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "riderName",
          value: null,
        },
      });
    } else {
      setSelectedRiderId(riderId);
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "riderId",
          value: riderId,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "riderName",
          value: riders.filter((r) => r.RiderId === riderId)[0].RiderName,
        },
      });
    }
  };

  const handleSelectChange = (data) => {
    setPaymentType(data.value);
  };

  const updatePaymentType = () => {
    let amountWithGst;
    let GSTId = null;
    let GSTPercent;
    let GSTAmount;

    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "updateGetOrderList",
        value: true,
      },
    });

    if (paymentType !== null && paymentType !== "") {
      if (posState.gstList.length !== 0) {
        posState.gstList.filter((e) => {
          if (e.PaymentModeId === paymentType) {
            GSTId = e.GSTId;
            GSTPercent = e.GSTPercentage;
            amountWithGst =
              (e.GSTPercentage / 100) *
                posState.selectedOrder.TotalAmountWithoutGST +
              posState.selectedOrder.TotalAmountWithoutGST;
            GSTAmount =
              (e.GSTPercentage / 100) *
              posState.selectedOrder.TotalAmountWithoutGST;
          }
        });
      }
    }

    if (GSTId === null) {
      const maxGst =
        posState.gstList.length !== 0 &&
        posState.gstList.reduce(function (prev, current) {
          return prev.y > current.y ? prev : current;
        });
      GSTId = maxGst === false ? null : maxGst.GSTId;
      GSTPercent = maxGst === false ? 0 : maxGst.GSTPercentage;
      amountWithGst =
        (maxGst.GSTPercentage / 100) *
          posState.selectedOrder.TotalAmountWithoutGST +
        posState.selectedOrder.TotalAmountWithoutGST;
      GSTAmount =
        (maxGst.GSTPercentage / 100) *
        posState.selectedOrder.TotalAmountWithoutGST;
    }

    postRequest("/UpdateOrderWithGST", {
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "1.2.2.1",
      OrderMasterId: OrderMasterId,
      TotalAmountWithGST: amountWithGst,
      GSTId: GSTId,
      GSTPercent: GSTPercent,
      GSTAmount: GSTAmount,
      PaymentTypeId:
        paymentType !== null && paymentType !== "" ? paymentType : null,
    })
      .then((response) => {
        setLoading(!loading);

        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        message.success("Payment Updated successfully!");
      })
      .catch((error) => {});
    message.success("Payment Updated successfully!");
    handleCancel();
    getOrderList();
  };

  return (
    <ModalComponent
      title="Change Payment Type"
      isModalVisible={isModalVisible}
      footer={[
        <Button onClick={handleCancel}>Cancel</Button>,
        <Button onClick={updatePaymentType}>Save</Button>,
      ]}
    >
      <FormSelect
        colSpan={5}
        listItem={posState.paymentTypeList || []}
        idName="PaymentModeId"
        valueName="PaymentMode"
        size={INPUT_SIZE}
        name="PaymentModeId"
        label="Payment"
        value={paymentType || ""}
        onChange={handleSelectChange}
      />
    </ModalComponent>
  );
};

export default ChangePaymentTypePopUp;
