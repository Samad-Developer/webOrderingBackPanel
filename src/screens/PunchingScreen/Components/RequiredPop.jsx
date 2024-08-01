import React from "react";

export default function RequiredPop({ children }) {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "red",
        position: "absolute",
        top: -3,
        right: -3,
      }}
    >
      {children}
    </div>
  );
}
