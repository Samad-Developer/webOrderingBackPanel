import React, { useEffect } from "react";
import { Col } from "antd";
import { any, array, bool, func, number, string } from "prop-types";
import "./FormSelect.css";
import Text from "antd/lib/typography/Text";

/**
 * 
 * @param {{}} props 
 *  defaultValue,
    value,
    allowClear,
    required,
    disabled,
    loading,
    colSpan,
    idName,
    valueName,
    size,
 * @returns 
 */
const FormSelectSP = (props) => {
  const {
    value,
    allowClear = true,
    required,
    disabled,
    colSpan,
    listItem,
    idName = "",
    valueName = "",
    label,
    name,
    placeholder,
    onChange,
    tabIndex,
    defaultValue,
    width = "100%",
  } = props;

  const selectItem = (event) => {
    if (event.target.value) {
      const item = listItem.find(
        (x) => parseInt(x[idName]) === parseInt(event.target.value)
      );
      onChange({ name, value: parseInt(item[idName], 0) });
    } else if (event.target.value === "None") {
      onChange({ name, value: null });
    } else if (event.target.value === "") {
      onChange({ name, value: null });
    } else if (event.target.value === null) {
      onChange({ name, value: null });
    }
  };

  return (
    <Col span={colSpan} className="selectInput">
      <Text>
        {label}
        {required && (
          <span style={{ color: "red", fontSize: 18, lineHeight: "14px" }}>
            *
          </span>
        )}
      </Text>

      <select
        defaultValue={defaultValue}
        tabIndex={tabIndex}
        required={required}
        className="form-select"
        onChange={selectItem}
        value={value === null ? "" : value}
        disabled={disabled}
        placeholder={placeholder}
        style={{ width: width }}
      >
        <option key={"99-80"} value="">
          None
        </option>
        {listItem &&
          listItem.map((item, key) => {
            return (
              <option key={key} value={item[idName]}>
                {item[valueName]}
              </option>
            );
          })}
      </select>
    </Col>
  );
};

FormSelectSP.propTypes = {
  defaultValue: any,
  value: any,
  allowClear: bool,
  required: bool,
  disabled: bool,
  loading: bool,
  colSpan: number,
  idName: string.isRequired,
  valueName: string.isRequired,
  listItem: array.isRequired,
  size: string,
  label: string,
  onChange: func,
  name: string,
  status: string,
  placeholder: string,
  tabIndex: number,
  width: string,
};

export default FormSelectSP;
