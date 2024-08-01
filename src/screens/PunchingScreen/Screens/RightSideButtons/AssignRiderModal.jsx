import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, message, Radio, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalComponent from "../../Components/ModalComponent";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";
import { list } from "../../data";
import { PRIMARY_COLOR } from "../../common/ThemeConstantsSP";
// const antIcon = (
//   <LoadingOutlined
//     style={{
//       fontSize: 24,
//     }}
//     spin
//   />
// );

export default function AssignRiderModal(props) {
  const { RiderList } = list;
  const { isModalVisible, handleCancel, userData, popupIntialFormValues } =
    props;
  const dispatch = useDispatch();
  const [selectedRiderId, setSelectedRiderId] = useState(null);

  const toggleRiders = (riderId) => {
    setSelectedRiderId(riderId);
  };

  const saveRider = () => {
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "riderId",
        value: selectedRiderId,
      },
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "riderName",
        value: RiderList.filter((r) => r.RiderId === selectedRiderId)[0]
          .RiderName,
      },
    });
    message.success("Rider Updated successfully!");
    handleCancel();
  };

  return (
    <ModalComponent
      title="Apply/Assign Rider"
      isModalVisible={isModalVisible}
      footer={[
        <Button onClick={handleCancel}>Cancel</Button>,
        <Button onClick={saveRider}>Save</Button>,
      ]}
    >
      <Radio.Group
        optionType="button"
        buttonStyle="solid"
        // value={posState.riderId}
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        <Space direction="vertical">
          {RiderList.map((item, index) => (
            <div
              style={{
                display: "block",
                padding: 10,
                margin: 5,
                background:
                  selectedRiderId === item.WaiterId ? PRIMARY_COLOR : "none",
                border: `0.5px solid ${PRIMARY_COLOR}`,
                borderRadius: 3,
                boxShadow: "0 0 1px",
              }}
            >
              <Radio
                key={index}
                onChange={() => {
                  toggleRiders(item.RiderId);
                }}
                value={item.RiderId}
              >
                {item.RiderName}
              </Radio>
            </div>
          ))}
        </Space>
      </Radio.Group>
    </ModalComponent>
  );
}
