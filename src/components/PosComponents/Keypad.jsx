import { Button, Col, Row } from "antd";
import React from "react";
import FormTextField from "../general/FormTextField";
import { useRef } from "react";
import Title from "antd/lib/typography/Title";

export default function Keypad(props) {
  const {
    onOk,
    title,
    hideOk,
    hideCLear,
    result,
    setResult,
    onChange,
    disabled,
  } = props;

  const inputElement = useRef(null);

  const focusInput = () => {
    inputElement.current.focus();
  };

  const calcBtnTxt = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
    { id: 7, name: "7" },
    { id: 8, name: "8" },
    { id: 9, name: "9" },
    { id: 10, name: "Clear" },
    { id: 11, name: "0" },
    { id: 12, name: "OK" },
  ];
  const buttonStyle = {
    width: "85px",
    height: "45px",
    borderRadius: "3px",
    fontSize: "16px",
    backgroundColor: "#4561B9",
    color: "white",
  };

  const buttonClicked = (btnValue) => {
    if (btnValue === "Clear") setResult("");
    else if (btnValue === "OK") {
    } else {
      setResult(result + btnValue);
    }
  };

  const handleClick = (e) => {
    e.target.select();
  };

  return (
    <div
      style={{
        width: "267px",
        marginBottom: 10,
      }}
    >
      <Title level={3} style={{ color: "#336fc4e0" }}>
        {title}
      </Title>

      <FormTextField
        isNumber="true"
        placeholder={`Enter ${title}`}
        ref={inputElement}
        style={{
          height: "40px",
          width: "100%",
          marginBottom: "10px",
        }}
        value={result}
        onClick={handleClick}
        onChange={onChange}
        disabled={disabled}
      />

      <Row gutter={[6, 6]} style={{ marginTop: 8 }}>
        {calcBtnTxt.map((item, index) => (
          <Col key={index}>
            <Button
              style={buttonStyle}
              onClick={(e) => {
                buttonClicked(e.target.innerText);
                focusInput();
              }}
              disabled={
                (hideOk && item.id === 12) ||
                (hideCLear && item.id === 10) ||
                disabled
              }
            >
              {item.name}
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
}
