import { message, Radio, Space, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../../../common/ThemeConstants";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import RadioSelect from "../../../components/PosComponentsFood/RadioSelect";
import { SET_POS_STATE } from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";

export default function TableTransferPopUp(props) {
  const {
    isModalVisible,
    handleCancel,
    userData,
    popupIntialFormValues,
    closeModalOnOk,
  } = props;
  const dispatch = useDispatch();
  const [spin, setSpin] = useState(false);
  const {
    selectedOrder: { waiterId, riderId, TableId, OrderMasterId, BranchId },
  } = useSelector((state) => state.PointOfSaleReducer);
  const { selectedOrder } = useSelector((state) => state.PointOfSaleReducer);

  const [tables, setTables] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [tableRefId, setTableRefId] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
    return () => setSelectedTableId(null);
  }, []);

  const toggleTables = (Id) => {
    // if (posState.tableId === tableId) {
    //   setSelectedTableId(null);
    //   dispatch({
    //     type: SET_POS_STATE,
    //     payload: {
    //       name: "tableId",
    //       value: null,
    //     },
    //   });
    // } else {
    setSelectedTableId(Id);
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "tableId",
        value: Id,
      },
    });
    // }
  };

  const saveTable = () => {
    postRequest("/UpdateCoverWaiterRider", {
      ...popupIntialFormValues,
      OperationId: 2,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "1.2.2.1",
      BranchId: BranchId,
      OrderMasterId: OrderMasterId,
      RiderId: riderId,
      WaiterId: waiterId,
      TableId: selectedTableId,
    })
      .then((response) => {
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        closeModalOnOk("table");
      })
      .catch((error) => {});
  };

  useEffect(() => {
    setTableRefId(TableId);
  }, []);

  useEffect(() => {
    setSpin(true);
    postRequest("/UpdateCoverWaiterRider", {
      ...popupIntialFormValues,
      OperationId: 1,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "1.2.2.1",
      BranchId: BranchId,
      OrderMasterId: OrderMasterId,
      WaiterId: waiterId,
      RiderId: riderId,
      TableId: TableId,
    })
      .then((response) => {
        setSpin(false);
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        setTables(response.data.DataSet.Table2);
      })
      .catch((error) => {});
  }, []);

  return (
    <ModalComponent
      isModalVisible={isModalVisible}
      handleCancel={() => handleCancel(tableRefId, "tableId")}
      handleOk={saveTable}
      destroyOnClose={true}
      width={"50vw"}
    >
      <Title level={3} style={{ color: PRIMARY_COLOR }}>
        Tables
      </Title>
      <div>
        <Spin spinning={spin} />
        <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
          <Space direction="horizontal">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={selectedOrder.TableId}
              style={{ display: "flex", flexWrap: "wrap" }}
              ref={ref}
            >
              {tables?.map((item, index) => (
                <div
                  style={{
                    display: "block",
                    padding: 10,
                    margin: 5,
                    background:
                      selectedTableId === item.TableId ? PRIMARY_COLOR : "none",
                    border: `0.5px solid ${PRIMARY_COLOR}`,
                    borderRadius: 3,
                    boxShadow: "0 0 1px",
                  }}
                >
                  <Radio
                    key={index}
                    onChange={() => {
                      toggleTables(item.TableId);
                    }}
                    value={item.TableId}
                    style={{
                      color:
                        selectedTableId === item.TableId
                          ? "white"
                          : PRIMARY_COLOR,
                    }}
                  >
                    {item.TableName}
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
