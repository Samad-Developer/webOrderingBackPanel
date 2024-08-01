import React from "react";
import { Checkbox, Col } from "antd";
import { bool, func, number, string } from "prop-types";
import "./FormCheckbox.css";

const FormCheckboxSP = (props) => {
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
      <Checkbox
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        indeterminate={indeterminate}
      >
        {label}
      </Checkbox>
    </Col>
  );
};

FormCheckboxSP.propTypes = {
  name: string,
  checked: bool,
  disabled: bool,
  onChange: func,
  label: string,
  indeterminate: bool,
  colSpan: number,
};

export default FormCheckboxSP;
