import React from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import TileButton from "../../Components/TileButton";

export const HoldOrder = () => {
  return (
    <div>
      <TileButton
        margin={"5px"}
        title="Hold Order"
        height="70px"
        width="75px"
        className="rightTabsWhiteButton"
        icon={<GiTakeMyMoney fontSize={26} />}
        //   type={posStore.IsAdvanceOrder === true ? 'primary' : ''}
        //   onClick={holdOrder}
        //   disabled={
        //     posStore.recallOrder === true
        //       ? true
        //       : posStore.productCart.length > 0 &&
        //         posStore.orderSourceId !== null
        //       ? false
        //       : true
        //   }
      />
    </div>
  );
};
