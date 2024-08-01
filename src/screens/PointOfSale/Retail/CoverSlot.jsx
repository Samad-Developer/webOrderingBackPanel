import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Keypad from "../../../components/PosComponents/Keypad";
import { SET_POS_STATE } from "../../../redux/reduxConstants";

const CoverSlot = (props) => {
  //  const [cover, setCover] = useState("");
  // let result = 0;
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.PointOfSaleReducer);

  const handleCoverChange = (e) => {
    if (e === "") e = 0;
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "coverId",
        value: parseInt(e, 0),
      },
    });
  };

  return (
    <Keypad
      title="Enter Cover"
      disabled={props.disabled}
      result={posState.coverId}
      setResult={handleCoverChange}
      hideOk={false}
      //   onChange={handleCoverChange}
    />
  );
};

export default CoverSlot;
