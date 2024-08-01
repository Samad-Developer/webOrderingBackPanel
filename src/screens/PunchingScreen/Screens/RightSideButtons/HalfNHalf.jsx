import React, { useState } from "react";
import { GiFullPizza } from "react-icons/gi";
import TileButton from "../../Components/TileButton";
import HalfNHalfModal from "./HalfNHalfModal";

export const HalfNHalf = () => {
  const [halfNHalfModal, setHalfNHalfModal] = useState(false);

  const toggleHalfNHalfModal = () => {
    setHalfNHalfModal(!halfNHalfModal);
  };
  return (
    <div>
      <TileButton
        margin={"5px"}
        title="Half N Half"
        height="70px"
        width="75px"
        type={""}
        className="rightTabsWhiteButton"
        icon={<GiFullPizza fontSize={26} />}
        onClick={toggleHalfNHalfModal}
      />
      <HalfNHalfModal show={halfNHalfModal} setShow={setHalfNHalfModal} />
    </div>
  );
};
