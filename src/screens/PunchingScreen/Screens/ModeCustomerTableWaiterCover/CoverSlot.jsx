import React from "react";
import { Col, Popconfirm, Row } from "antd";
import PopoverButton from "../../Components/PopoverButton";
import KeypadSP from "../../Components/KeypadSP";
import { useDispatch, useSelector } from "react-redux";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";
import { useState } from "react";
// import { BUTTON_SIZE } from "../../common/ThemeConstants";
// import FormButton from "../../components/general/FormButton";

const CoverSlot = () => {
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const [coverId, setCoverId] = useState(null);

  const handleCoverChange = (e) => {
    if (e === "") e = 0;
    setCoverId(parseInt(e, 10));
  };

  const setCoverSlot = () => {
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "coverId",
        value: coverId,
      },
    });
  };
  return (
    <div>
      <PopoverButton
        buttonName="Cover Slot"
        ifNull={posState.coverId === 0}
        confirm={setCoverSlot}
        // cancel={}
        title={
          <KeypadSP
            title="Enter Cover"
            // disabled={disabled}
            result={coverId}
            setResult={handleCoverChange}
            hideOk={true}
            //   onChange={handleCoverChange}
          />
        }
      />

      <Row>
        <Col span={8}>
          <h3>Cover</h3>
        </Col>
        <Col span={16}>
          <h3>{/* {posState.customerDetail.CustomerName} */}</h3>
        </Col>
      </Row>
    </div>
  );
};

export default CoverSlot;
