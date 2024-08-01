import { message, Radio, Space, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../../common/ThemeConstants";
import ModalComponent from "../formComponent/ModalComponent";
import { SET_POS_STATE } from "../../redux/reduxConstants";
import { postRequest } from "../../services/mainApp.service";

export default function RadioButtonGroupModal(props) {
  const {
    isModalVisible,
    handleCancel,
    userData,
    popupIntialFormValues,
    closeModalOnOk,
    title,
    url,
    reduxName,
    OnOkName,
    datasetTable,
    value,
    valueName,
    radioValue,
  } = props;
  const dispatch = useDispatch();
  const [spin, setSpin] = useState(false);
  const {
    selectedOrder: { waiterId, riderId, tableId, OrderMasterId, BranchId },
  } = useSelector((state) => state.PointOfSaleReducer);

  const [tables, setTables] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [tableRefId, setTableRefId] = useState(null);
  const ref = useRef(null);

  const toggleTables = (Id) => {
    setSelectedTableId(Id);
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: reduxName,
        value: Id,
      },
    });
  };

  const saveTable = () => {
    let data = {
      ...popupIntialFormValues,
      OperationId: 2,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "1.2.2.1",
      BranchId: BranchId,
      OrderMasterId: OrderMasterId,
      RiderId: riderId || null,
      WaiterId: waiterId || null,
      TableId: tableId || null,
    };
    let finalData = {
      ...data,
      [radioValue]: selectedTableId,
    };
    postRequest(url, finalData)
      .then((response) => {
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        setSelectedTableId(value);
        closeModalOnOk(OnOkName);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    setTableRefId(tableId);
  }, []);

  useEffect(() => {
    setSpin(true);
    postRequest(url, {
      ...popupIntialFormValues,
      OperationId: 1,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "1.2.2.1",
      BranchId: BranchId,
      OrderMasterId: OrderMasterId,
      WaiterId: waiterId,
      RiderId: riderId,
      TableId: tableId,
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
        setSelectedTableId(value);
        setTables(response.data.DataSet[datasetTable]);
      })
      .catch((error) => {});

    ref.current.focus();
    return () => setSelectedTableId(null);
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
        {title}
      </Title>
      <div>
        <Spin spinning={spin} />
        <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
          <Space direction="horizontal">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={selectedTableId}
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
                      selectedTableId === item[radioValue]
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
                      toggleTables(item[radioValue]);
                    }}
                    value={item[radioValue]}
                    style={{
                      color:
                        selectedTableId === item[radioValue]
                          ? "white"
                          : PRIMARY_COLOR,
                    }}
                  >
                    {item[valueName]}
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
