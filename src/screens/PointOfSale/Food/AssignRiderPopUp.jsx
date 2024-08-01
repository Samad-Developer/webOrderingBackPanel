import { LoadingOutlined } from '@ant-design/icons';
import { Button, Col, message, Radio, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DELIVERY } from '../../../common/SetupMasterEnum';
import { PRIMARY_COLOR } from '../../../common/ThemeConstants';
import ModalComponent from '../../../components/formComponent/ModalComponent';
// import RadioSelect from "../../components/PosComponentsFood/RadioSelect";
// import RiderRadioSelect from "../../components/PosComponentsFood/RiderRadioSelect";
import { SET_POS_STATE } from '../../../redux/reduxConstants';
import { postRequest } from '../../../services/mainApp.service';
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

export default function AssignRiderPopUp(props) {
  const { isModalVisible, handleCancel, userData, popupIntialFormValues } =
    props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const { selectedOrder } = posState;
  const { RiderId, WaiterId, TableId, riderName } = posState;
  const { OrderMasterId, BranchId } = selectedOrder;
  const [riders, setRiders] = useState([]);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  
  const toggleRiders = (riderId) => {
    setSelectedRiderId(riderId);
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: 'riderId',
        value: riderId,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: 'riderName',
        value: riders.filter((r) => r.RiderId === riderId)[0].RiderName,
      },
    });
  };

  const saveRider = () => {
    postRequest('/UpdateCoverWaiterRider', {
      ...popupIntialFormValues,
      OperationId: 4,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: '1.2.2.1',
      BranchId: BranchId,
      OrderMasterId: OrderMasterId,
      RiderId: selectedRiderId,
      WaiterId: WaiterId,
      TableId: TableId,
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
        message.success('Rider Updated successfully!');
        handleCancel();
      })
      .catch((error) => {});
  };
  // posState.ridersList
  useEffect(() => {
    if (posState.customerDetail.OrderMode === DELIVERY) {
      setRiders(posState.ridersList);
    } else {
      setLoading(!loading);
      postRequest('/UpdateCoverWaiterRider', {
        ...popupIntialFormValues,
        OperationId: 1,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: '1.2.2.1',
        BranchId: BranchId,
        OrderMasterId: OrderMasterId,
        RiderId: RiderId,
        WaiterId: WaiterId,
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
          setRiders(response.data.DataSet.Table1);
        })
        .catch((error) => {});
    }
  }, []);

  return (
    <ModalComponent
      title='Apply/Assign Rider'
      isModalVisible={isModalVisible}
      footer={[
        <Button onClick={handleCancel}>Cancel</Button>,
        <Button onClick={saveRider}>Save</Button>,
      ]}>
      {/* <Col
        style={{
          display: "flex",
          flexDirection: "Row",
          alignItems: "center",
          flexWrap: "wrap",
          alignSelf: "flex-start",
          padding: "10px 0px",
        }}
      >
        {riders.length > 0 ? (
          <RiderRadioSelect
            list={riders}
            listId="RiderId"
            listName="RiderName"
            onClick={toggleRiders}
            selected="riderId"
            title={"Select Rider"}
          />
        ) : (
          <div></div>
        )}
      </Col> */}
      <Radio.Group
        optionType='button'
        buttonStyle='solid'
        value={posState.riderId}
        style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Space direction='vertical'>
          {riders.map((item, index) => (
            <div
              style={{
                display: 'block',
                padding: 10,
                margin: 5,
                background:
                  selectedRiderId === item.WaiterId ? PRIMARY_COLOR : 'none',
                border: `0.5px solid ${PRIMARY_COLOR}`,
                borderRadius: 3,
                boxShadow: '0 0 1px',
              }}>
              <Radio
                key={index}
                onChange={() => {
                  toggleRiders(item.RiderId);
                }}
                value={item.RiderId}>
                {item.RiderName}
              </Radio>
            </div>
          ))}
        </Space>
      </Radio.Group>
    </ModalComponent>
  );
}
