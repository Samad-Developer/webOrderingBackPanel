import React, { useState } from "react";
import { GiFullPizza } from "react-icons/gi";
import TileButton from "../../Components/TileButton";
import AssignRiderModal from "../RightSideButtons/AssignRiderModal";
import { list } from "../../data";

export const AssignRider = () => {
  const { RiderList } = list;
  const [isRiderOpen, setIsRiderOpen] = useState(false);
  const toggleRiderPopUp = () => {
    setIsRiderOpen(!isRiderOpen);
  };
  return (
    <div>
      <TileButton
        margin={"5px"}
        title="Change/Assign Rider"
        height="70px"
        width="75px"
        type={""}
        className="rightTabsWhiteButton"
        icon={<GiFullPizza fontSize={26} />}
        onClick={toggleRiderPopUp}
      />
      <AssignRiderModal
        isModalVisible={isRiderOpen}
        handleCancel={toggleRiderPopUp}
        // userData={userData}
        // popupIntialFormValues={popupIntialFormValues}
      />
    </div>
  );
};
