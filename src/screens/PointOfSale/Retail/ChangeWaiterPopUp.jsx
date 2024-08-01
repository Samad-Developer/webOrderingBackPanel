import { LoadingOutlined } from "@ant-design/icons";
import { message, Radio, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../../../common/ThemeConstants";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import RadioSelect from "../../../components/PosComponents/RadioSelect";
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

export default function ChangeWaiterPopUp(props) {
  const {
    isModalVisible,
    handleCancel,
    userData,
    popupIntialFormValues,
    closeModalOnOk,
  } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const { selectedOrder } = posState;
  const { OrderMasterId, BranchId } = selectedOrder;
  const [waiters, setWaiters] = useState([]);
  const [waiterRefId, setWaiterRefId] = useState(null);
  const [selectedWaiterId, setSelectedWaiterId] = useState(null);
  // const [selectedTableId, setSelectedWaiterId] = useState(null);

  const toggleWaiters = (waiterId) => {
    // if (posState.selectedOrder.WaiterId === waiterId) {
    //   setSelectedWaiterId(null);
    //   dispatch({
    //     type: SET_POS_STATE,
    //     payload: {
    //       name: "waiterId",
    //       value: null,
    //     },
    //   });
    // } else {
    setSelectedWaiterId(waiterId);
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "waiterId",
        value: waiterId,
      },
    });
    // }
  };

  const saveWaiter = () => {
    postRequest("/UpdateCoverWaiterRider", {
      ...popupIntialFormValues,
      OperationId: 3,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "1.2.2.1",
      BranchId: BranchId,
      OrderMasterId: OrderMasterId,
      RiderId: selectedOrder.RiderId,
      WaiterId: selectedWaiterId,
      TableId: selectedOrder.TableId,
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
        closeModalOnOk("waiter");
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "selectedOrder",
            value: { ...selectedOrder, WaiterId: selectedWaiterId },
          },
        });
      })
      .catch((error) => {});
  };

  useEffect(() => {
    setLoading(!loading);
    postRequest("/UpdateCoverWaiterRider", {
      ...popupIntialFormValues,
      OperationId: 3,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "1.2.2.1",
      BranchId: BranchId,
      OrderMasterId: OrderMasterId,
      RiderId: selectedOrder.RiderId,
      WaiterId: selectedOrder.WaiterId,
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
        setWaiters(response.data.DataSet.Table1);
      })
      .catch((error) => {});
    setWaiterRefId(selectedOrder.WaiterId);
  }, []);

  return (
    <ModalComponent
      isModalVisible={isModalVisible}
      handleCancel={() => handleCancel(waiterRefId, "waiterId")}
      handleOk={saveWaiter}
    >
      <div>
        {/* <Spin spinning={loading} /> */}
        {/* <RadioSelect
          list={waiters}
          styles={{ marginBottom: 10 }}
          listId="WaiterId"
          listName="WaiterName"
          title="Select Waiters"
          onClick={toggleWaiters}
          selected="WaiterId"
        /> */}
        <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
          <Space direction="horizontal">
            <Radio.Group
              optionType="button"
              buttonStyle="outline"
              value={posState.waiterId}
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              {waiters.map((item, index) => (
                <div
                  style={{
                    display: "block",
                    padding: 10,
                    margin: 5,
                    background:
                      selectedWaiterId === item.WaiterId
                        ? PRIMARY_COLOR
                        : "none",
                    border: `0.5px solid ${PRIMARY_COLOR}`,
                    borderRadius: 3,
                    boxShadow: "0 0 1px",
                  }}
                >
                  <Radio
                    key={index}
                    onChange={() => {
                      toggleWaiters(item.WaiterId);
                    }}
                    value={item.WaiterId}
                  >
                    {item.WaiterName}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </Space>
        </div>
      </div>
    </ModalComponent>
  );
}
