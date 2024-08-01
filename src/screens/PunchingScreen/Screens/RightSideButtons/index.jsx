import React from "react";
import { useSelector } from "react-redux";
import { DELIVERY } from "../../common/SetupMstrEnum";
import { AdavnceOrder } from "./AdavnceOrder";
import { AssignRider } from "./AssignRider";
import { AutoDiscount } from "./AutoDiscount";
import { Discount } from "./Discount";
import { HalfNHalf } from "./HalfNHalf";
import { HoldOrder } from "./HoldOrder";

export const RightSideButtons = () => {
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  return (
    <div>
      <AdavnceOrder />
      <Discount />
      <AutoDiscount />
      <HoldOrder />
      <HalfNHalf />
      {posState.OrderModeId === DELIVERY && <AssignRider />}
    </div>
  );
};
