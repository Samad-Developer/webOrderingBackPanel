import React from "react";
import { CartAmountDetails } from "./CartAmountDetails";
import { CartItemList } from "./CartItemList";
import { CartSpecialInstructions } from "./CartSpecialInstructions";
import { CheckoutButtons } from "./CheckoutButtons";

export const Cart = () => {
  return (
    <div style={{ height: "200px" }}>
      <CartItemList />
      <CartSpecialInstructions />
      <CartAmountDetails />
      <CheckoutButtons />
    </div>
  );
};
