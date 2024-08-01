import React from "react";
import { useState } from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import { useSelector } from "react-redux";
import TileButton from "../../Components/TileButton";
import { DiscountModal } from "./DiscountModal";

export const Discount = () => {
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const [discountModal, setDiscountModal] = useState(false);
  const toggleDiscountModal = () => {

    setDiscountModal(!discountModal);
  };
  return (
    <div>
      <TileButton
        margin={"5px"}
        title="Discount"
        height="70px"
        width="75px"
        className="rightTabsWhiteButton"
        icon={<GiTakeMyMoney fontSize={26} />}
        type={posState.selectedDiscount?.length > 0 ? "primary" : ""}
        onClick={toggleDiscountModal}
        disabled={
          posState.productCart.length > 0 && posState.orderSourceId !== null
            ? false
            : true
        }
      />
      <DiscountModal
        isModalVisible={discountModal}
        handleCancel={toggleDiscountModal}
      />
    </div>
  );
};
