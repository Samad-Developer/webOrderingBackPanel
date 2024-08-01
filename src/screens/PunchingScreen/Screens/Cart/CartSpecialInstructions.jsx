import { Input } from "antd";
import React from "react";

export const CartSpecialInstructions = () => {
  return (
    <div>
      <Input
        size="middle"
        placeholder="Special Instruction"
        // value={posState.Remarks}
        // onChange={(e) =>
        //   dispatch({
        //     type: SET_POS_STATE,
        //     payload: { name: "Remarks", value: e.target.value },
        //   })
        // }
      />
    </div>
  );
};
