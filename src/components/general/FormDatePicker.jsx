import React from "react";
import { Checkbox, Col, DatePicker } from "antd";
import { bool, func, number, string } from "prop-types";

const FormDatePicker = (props) => {
  const { name, checked, disabled, onChange, label, indeterminate, colSpan } =
    props;

  const handleChange = (e) => {
    onChange({ name: e.target.name, value: e.target.checked });
  };
  return (
    <Col
      span={colSpan}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <DatePicker
        name={name}
        value={checked}
        disabled={disabled}
        onChange={handleChange}
      >
        {label}
      </DatePicker>
    </Col>
  );
};

FormCheckbox.propTypes = {
  name: string,
  checked: bool,
  disabled: bool,
  onChange: func,
  label: string,
  indeterminate: bool,
  colSpan: number,
};

export default FormDatePicker;
