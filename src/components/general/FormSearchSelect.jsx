import React, { useEffect } from "react";
import { Col, Select } from "antd";
import { any, array, bool, func, number, string } from "prop-types";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import "./FormSelect.css";
import { deleteArrayOnject } from "../../functions/generalFunctions";
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
const FormSearchSelect = (props) => {
  const {
    value,
    allowClear = true,
    required,
    disabled,
    colSpan,
    listItem,
    idName = "",
    valueName = "",
    size = INPUT_SIZE,
    label,
    name,
    placeholder,
    onChange,
    tabIndex,
    defaultValue,
    width = "100%",
    style
  } = props;

  const selectItem = (value) => {
    onChange({ name, value });
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

      <Select
        style={{ width: width, borderColor: "#8d8d8d", ...style }}
        showSearch
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={selectItem}
        // onSearch={onSearch}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={[
          { value: value, label: "None" },
          ...listItem.map((item, key) => ({
            value: item[idName],
            label: item[valueName]
          }))
        ]}
        size={size}
        disabled={disabled}
        allowClear={allowClear}
        // value={value}
      />
    </Col>
  );
};

FormSearchSelect.propTypes = {
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
  width: string
};

export default FormSearchSelect;
