import React from "react";
import { useState } from "react";
import { FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import TileButton from "../../Components/TileButton";
import AdvanceOrderModal from "./AdvanceOrderModal";

export const AdavnceOrder = () => {
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const [advanceOrderModel, setAdvanceOrderModel] = useState(false);

  const toggleAdvanceModal = () => {
    setAdvanceOrderModel(!advanceOrderModel);
  };
  return (
    <div>
      <TileButton
        margin={"5px"}
        title="Advance Order"
        height="70px"
        width="75px"
        icon={<FiClock fontSize={26} />}
        type={posState.IsAdvanceOrder === true ? "primary" : ""}
        className="rightTabsWhiteButton"
        onClick={toggleAdvanceModal}
      />
      <AdvanceOrderModal
        visible={advanceOrderModel}
        toggleModal={toggleAdvanceModal}
      />
    </div>
  );
};
