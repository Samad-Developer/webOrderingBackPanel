import React from "react";
import CoverSlot from "./CoverSlot";
import CustomerSearch from "./CustomerSearch";
import OrderModes from "./OrderModes";
import TableSlot from "./TableSlot";
import WaiterSlot from "./WaiterSlot";

export default function ModeCustomerTableWaiterCover() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <OrderModes />
      <CustomerSearch />
      <TableSlot />
      <WaiterSlot />
      <CoverSlot />
    </div>
  );
}
