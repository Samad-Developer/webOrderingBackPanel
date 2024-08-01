import { Checkbox, DatePicker, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalComponent from "../../Components/ModalComponent";
import moment from "moment";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";

const AdvanceOrderModal = (props) => {
  const { visible, toggleModal } = props;
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const [advanceOrder, setAdvanceOrder] = useState({
    AdvanceOrderDate: "",
    IsAdvanceOrder: false,
  });

  useEffect(() => {
    setAdvanceOrder({
      AdvanceOrderDate: posState.AdvanceOrderDate,
      IsAdvanceOrder: posState.IsAdvanceOrder,
    });
  }, []);

  const advanceOrderSubmit = () => {
    if (
      advanceOrder.AdvanceOrderDate == null &&
      advanceOrder.IsAdvanceOrder === true
    ) {
      message.error("Please Fillout all the Fields");
      return;
    } else if (
      advanceOrder.AdvanceOrderDate != null &&
      advanceOrder.IsAdvanceOrder === false
    ) {
      message.error("Please Clear all the Fields");
    }
    dispatch({
      type: SP_SET_POS_STATE,
      payload: { name: "IsAdvanceOrder", value: advanceOrder.IsAdvanceOrder },
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "AdvanceOrderDate",
        value:
          advanceOrder.IsAdvanceOrder === true
            ? advanceOrder.AdvanceOrderDate
            : null,
      },
    });
    toggleModal();
  };

  return (
    <ModalComponent
      title="Advance Order"
      isModalVisible={visible}
      handleOk={advanceOrderSubmit}
      handleCancel={toggleModal}
    >
      <div className="advOrder">
        <Checkbox
          checked={advanceOrder.IsAdvanceOrder}
          onChange={(e) =>
            setAdvanceOrder({
              ...advanceOrder,
              IsAdvanceOrder: e.target.checked,
            })
          }
        >
          Is Advance Order
        </Checkbox>
        <DatePicker
          style={{ width: "50%" }}
          placeholder="Advance Order Date"
          format="YYYY-MM-DD HH:mm:ss"
          defaultValue={moment(Date.now(), "YYYY-MM-DD")}
          value={
            advanceOrder.AdvanceOrderDate &&
            advanceOrder.IsAdvanceOrder === true
              ? moment(advanceOrder.AdvanceOrderDate)
              : ""
          }
          showTime={{
            defaultValue: moment("00:00:00", "HH:mm:ss"),
          }}
          allowClear={true}
          onChange={(time, timeString) => {
            setAdvanceOrder({ ...advanceOrder, AdvanceOrderDate: timeString });
          }}
          disabled={!advanceOrder.IsAdvanceOrder}
        />
      </div>
    </ModalComponent>
  );
};

export default AdvanceOrderModal;
