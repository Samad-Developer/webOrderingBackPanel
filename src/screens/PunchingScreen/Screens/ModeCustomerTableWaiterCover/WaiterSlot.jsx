import React, { useState, useEffect } from "react";
import { Col, Popconfirm, Radio, Row } from "antd";
import PopoverButton from "../../Components/PopoverButton";
import { list } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";
import { Fragment } from "react";
import RadioSelectSP from "../../Components/RadioSelectSP";

const WaiterSlot = () => {
  const { WaiterList } = list;
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.SinglePagePOSReducers);

  const toggleWaiterChange = (waiterId, waiterName) => {
    if (waiterId === posState.waiterId) {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "waiterId",
          value: null,
        },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "waiterName",
          value: "",
        },
      });
    } else {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "waiterId",
          value: waiterId,
        },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "waiterName",
          value: waiterName,
        },
      });
    }
  };

  return (
    <Fragment>
      <div style={{ width: "150px" }}>
        <PopoverButton
          buttonName="Waiter Slot"
          // confirm={setWaiter}
          // cancel={resetSelectedWaiter}
          title={
            <div>
              <h3>Select Waiter</h3>
              <Row gutter={[10, 8]}>
                <RadioSelectSP
                  list={WaiterList}
                  listId="WaiterId"
                  listName="WaiterName"
                  onClick={toggleWaiterChange}
                  disVar={"IsOpen"}
                  cond={true}
                />
              </Row>
            </div>
          }
          ifNull={!posState.waiterId}
          // isDisable={OrderModeName !== "Dine-In"}
        />

        <Row>
          <Col span={8}>
            <h3>Waiter:</h3>
          </Col>
          <Col span={10}>
            <h3> {posState?.waiterName} </h3>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default WaiterSlot;
