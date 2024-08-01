import React, { useEffect } from "react";
import { Col, Popconfirm, Row } from "antd";
import PopoverButton from "../../Components/PopoverButton";
import TileButton from "../../Components/TileButton";
import CustomerSearchModal from "./CustomerSearchModal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SP_SET_CUSTOMER_SUPPORTING_TABLE } from "../../redux/reduxConstantsSinglePagePOS";
// import { BUTTON_SIZE } from "../../../common/ThemeConstants";
// import FormButton from "../../../components/general/FormButton";

const CustomerSearch = () => {
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const [customerSearchModal, setCustomerSearchModal] = useState(false);

  const toggleCustomerSearchModal = () => {
    setCustomerSearchModal(!customerSearchModal);
  };
  return (
    <div>
      <PopoverButton
        buttonName="Customer Search"
        ifNull={!posState.customerDetail.CustomerName}
        isPopDisable={true}
        onClick={toggleCustomerSearchModal}
        height="80px"
        width="85px"
      />

      <CustomerSearchModal
        visible={customerSearchModal}
        toggleModal={toggleCustomerSearchModal}
      />

      <Row>
        <Col span={6}>
          <h3>Customer:</h3>
        </Col>
        <Col span={18}>
          <h3>{posState.customerDetail.CustomerName}</h3>
        </Col>
        {/* </Row>
      <Row> */}
        <Col span={10}>
          <h3>Complete Address:</h3>
        </Col>
        <Col span={14}>
          <h3>{posState.customerDetail.CompleteAddress}</h3>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerSearch;
