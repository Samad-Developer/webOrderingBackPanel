import { Button, Popconfirm } from "antd";
import React from "react";
import RequiredPop from "./RequiredPop";
import { Radio } from "antd";

export default function PopoverButton(props, { children }) {
  const {
    title,
    buttonName,
    content,
    confirm,
    cancel,
    okText = "Done",
    cancelText = "Cancel",
    ifNull,
    height = 80,
    width = 80,
    isPopDisable,
    onClick,
  } = props;
  return (
    <div>
      <Popconfirm
        title={title}
        description={content}
        onConfirm={confirm}
        onCancel={cancel}
        icon={null}
        okText={okText}
        cancelText={cancelText}
        disabled={isPopDisable}
      >
        <Button
          onClick={onClick}
          style={{
            height: height || 130,
            width: width || 130,
            background: "white",
            // borderColor: "darkblue",
            boxShadow: "0 0 5px #bfbfbf",
            color: "grey",
            fontWeight: 600,
            fontSize: "12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          // disabled={isDisable}
        >
          {buttonName}
          {ifNull && <RequiredPop />}
        </Button>

        {/* {children} */}
      </Popconfirm>
    </div>
  );
}
