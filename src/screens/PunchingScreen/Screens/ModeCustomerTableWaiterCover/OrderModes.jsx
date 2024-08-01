import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import PopoverButton from "../../Components/PopoverButton";
import { list } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import {
  SP_SET_ORDER_SOURCE,
  SP_SET_ORDER_MODE,
  SP_SET_POS_STATE,
  SP_RESET_DEFAULT_POS_STATE,
} from "../../redux/reduxConstantsSinglePagePOS";
import {
  DINE_IN,
  DELIVERY,
  TAKE_AWAY,
  FINISHED_WASTE,
} from "../../common/SetupMstrEnum";
import { useCallback } from "react";
import RadioSelectSP from "../../Components/RadioSelectSP";

const OrderModes = () => {
  const dispatch = useDispatch();
  const { OrderSourceList } = list;
  const [orderSourceListing, setOrderSourceListing] = useState([]);

  const {
    OrderModeId,
    OrderModeName,
    orderSourceName,
    orderSourceId,
    customerDetail,
    orderSourceList,
  } = useSelector((state) => state.SinglePagePOSReducers);

  const OrderModeList = [
    {
      OrderModeId: DINE_IN,
      OrderModeName: "DineIn",
    },
    {
      OrderModeId: DELIVERY,
      OrderModeName: "Delivery",
    },
    {
      OrderModeId: TAKE_AWAY,
      OrderModeName: "Take Away",
    },
    {
      OrderModeId: FINISHED_WASTE,
      OrderModeName: "Finished Waste",
    },
  ];

  const OrderModeChange = (modeId, modeName) => {
    dispatch({
      type: SP_RESET_DEFAULT_POS_STATE,
      payload: {},
    });
    dispatch({
      type: SP_SET_ORDER_SOURCE,
      payload: {
        id: null,
        name: "",
      },
    });
    dispatch({
      type: SP_SET_ORDER_MODE,
      payload: { id: modeId, name: modeName },
    });
    filterOrderSource();
  };

  const OrderSourceChange = (orderSourceId, orderSourceName) => {
    dispatch({
      type: SP_SET_ORDER_SOURCE,
      payload: {
        id: orderSourceId,
        name: orderSourceName,
      },
    });
  };

  const filterOrderSource = useCallback(() => {
    setOrderSourceListing(
      OrderSourceList.filter((x) => x.OrderModeId === OrderModeId)
    );
  }, [OrderModeId]);

  useEffect(() => {
    filterOrderSource();
  }, [filterOrderSource]);

  return (
    <div>
      <PopoverButton
        buttonName="Order Mode"
        ifNull={!orderSourceName && !OrderModeName}
        title={
          <div
            style={{ display: "flex", flexDirection: "column", width: "400px" }}
          >
            <div>
              <h3>Order Mode:</h3>
              <RadioSelectSP
                list={OrderModeList}
                listId="OrderModeId"
                listName="OrderModeName"
                onClick={OrderModeChange}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <h3>Order Source:</h3>
              <RadioSelectSP
                list={orderSourceListing}
                listId="OrderSourceId"
                listName="OrderSource"
                onClick={OrderSourceChange}
              />
            </div>
          </div>
        }
      />

      <Row>
        <Col span={8}>
          <h3>Mode:</h3>
        </Col>
        <Col span={16}>
          <h3>{OrderModeName}</h3>
        </Col>
        <Col span={8}>
          <h3>Source:</h3>
        </Col>
        <Col span={16}>
          <h3>{orderSourceName}</h3>
        </Col>
      </Row>
    </div>
  );
};

export default OrderModes;
