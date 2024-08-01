import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import { SET_POS_STATE } from "../../../redux/reduxConstants";
import FormSelect from "../../../components/general/FormSelect";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import {
  BRANCH_ADMIN,
  CASHIER,
  ODMS_ORDER_SOURCE,
  POS_ORDER_SOURCE,
} from "../../../common/SetupMasterEnum";

const OrderModal = (props) => {
  const { IsPos, RoleId } = useSelector((state) => state.authReducer);

  const { visible, toggleModal, defaultOrderSource } = props;
  const dispatch = useDispatch();
  const { punchScreenData, orderSourceId, selectedOrder } = useSelector(
    (state) => state.PointOfSaleReducer
  );

  const handleChange = (e) => {
    if (e.value !== null) {
      let name = punchScreenData.Table8.filter(
        (x) => x.OrderSourceId === e.value
      )[0];

      dispatch({
        type: SET_POS_STATE,
        payload: { name: "orderSourceId", value: e.value },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "orderSourceName", value: name.OrderSource },
      });
    } else {
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "orderSourceId", value: null },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: { name: "orderSourceName", value: "" },
      });
    }
  };

  const orderSourceSubmit = () => {
    toggleModal();
  };

  return (
    <ModalComponent
      title="Order Source"
      isModalVisible={visible}
      handleOk={orderSourceSubmit}
      handleCancel={toggleModal}
    >
      {IsPos === true ? (
        <FormSelect
          colSpan={8}
          idName="OrderSourceId"
          valueName="OrderSource"
          listItem={punchScreenData.Table8 || []}
          size={INPUT_SIZE}
          name="OrderSourceId"
          label="Order Source"
          value={
            punchScreenData?.Table8?.filter((source) => source.IsPos === 1)[0]
              ?.OrderSourceId
          }
          disabled={true}
        />
      ) : (
        <FormSelect
          colSpan={8}
          idName="OrderSourceId"
          valueName="OrderSource"
          listItem={punchScreenData.Table8 || []}
          size={INPUT_SIZE}
          name="OrderSourceId"
          label="Order Source"
          value={
            selectedOrder.orderSourceId
              ? selectedOrder.orderSourceId
              : punchScreenData.Table8.length === 1
              ? punchScreenData.Table8[0].OrderSourceId
              : orderSourceId
          }
          onChange={handleChange}
          disabled={false}
        />
      )}
    </ModalComponent>
  );
};

export default OrderModal;
