import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import Keypad from "../../../components/PosComponents/Keypad";
import RadioSelect from "../../../components/PosComponents/RadioSelect";
import { SET_POS_STATE } from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";

export default function ChangeCoverPopUp(props) {
  const { isModalVisible, handleCancel, userData, popupIntialFormValues } =
    props;
  const dispatch = useDispatch();
  const [spin, setSpin] = useState(false);
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const { selectedOrder } = posState;
  const [covers, setCovers] = useState([]);
  const [selectedCover, setSelectedCover] = useState(null);

  const { OrderMasterId, BranchId } = selectedOrder;
  const { riderId, waiterId, tableId, coverId } = posState;
  const [result, setResult] = useState("");

  const toggleCover = (coverId) => {
    // let val = selectedTables.includes(tableId);
    // if (val === true) {
    //   let index = selectedTables.findIndex((x) => x === tableId);
    //   selectedTables.splice(index, 1);
    // } else selectedTables.push(tableId);
    // setSelectedTables([...selectedTables]);

    if (posState.coverId === coverId) {
      setSelectedCover(null);
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "coverId",
          value: null,
        },
      });
    } else {
      setSelectedCover(coverId);
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "coverId",
          value: coverId,
        },
      });
    }
  };

  const saveCover = () => {
    postRequest("/UpdateCoverWaiterRider", {
      ...popupIntialFormValues,
      OperationId: 5,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "1.2.2.1",
      BranchId: BranchId,
      OrderMasterId: OrderMasterId,
      RiderId: riderId,
      WaiterId: waiterId,
      TableId: tableId,
      Cover: parseInt(result, 0),
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
        setCovers(response.data.DataSet.Table4);
        handleCancel();
      })
      .catch((error) => { });
  };
  useEffect(() => {
    postRequest("UpdateCoverWaiterRider", {
      ...popupIntialFormValues,
      OperationId: 1,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: "1.2.2.1",
      BranchId: BranchId,
      OrderMasterId: OrderMasterId,
      RiderId: riderId,
      WaiterId: waiterId,
      TableId: tableId,
      Cover: coverId,
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
        setCovers(response.data.DataSet.Table3);
        setSpin(false);
      })
      .catch((error) => { });
  }, []);

  return (
    <ModalComponent
      isModalVisible={isModalVisible}
      handleCancel={handleCancel}
      handleOk={saveCover}
    >
      <div>
        {/* {spin && <Spin />} */}

        <RadioSelect
          list={covers}
          styles={{ marginBottom: 10 }}
          listId="Cover"
          listName="Cover"
          title="Select Covers"
          onClick={toggleCover}
          selected="coverId"
        />
        <Keypad
          hideOk={true}
          disabled={false}
          onChange={handleCoverChange}
          setResult={setResult}
          result={result}
          title="Change Cover"
        />
      </div>
    </ModalComponent>
  );
}
