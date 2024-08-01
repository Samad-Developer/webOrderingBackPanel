import { Col, Input } from "antd";
import Text from "antd/lib/typography/Text";
import { any, bool, func, number, string } from "prop-types";
import React from "react";

/**
 * Input Component for Application Forms
 * @param {{}} props
 *  name,
    type,
    prefix,
    placeholder,
    label,
    defaultValue,
    value,
    onChange,
    suffix,
    bordered,
    disabled,
    hide,
    className,
    required,
    colSpan,
    onBlur,
    maxLength,
    isNumber,
    size
 * @returns {Element}
 */
const TextFieldSP = React.forwardRef((props, ref) => {
  const {
    name,
    type,
    prefix,
    placeholder,
    label,
    defaultValue,
    value,
    onChange,
    onBlur,
    suffix,
    bordered,
    disabled,
    hide,
    className,
    required,
    colSpan,
    maxLength,
    size,
    isNumber,
    borderColor,
    minLength,
    min,
    textColor,
    letterSpacing,
    autoComplete = "off",
    max,
    pattern,
    tabIndex,
    form,
    style,
    containerStyle,
    onSubmit,
    id,
    onPressEnter,
  } = props;

  const handleChange = (e) => {
    if (e.target.getAttribute("isnumber") === "true") {
      // e.target.value = e.target.value.replace(/^\d+(\.\d+)?$/, "");
      e.target.value = e.target.value.replace(/\D/g, "");
    }
    onChange({ name: e.target.name, value: e.target.value });
  };

  const onBlurInput = (e) => {
    onChange({ name: e.target.name, value: e.target.value.trim() });
    onBlur && onBlur();
  };

  const onSubmitInput = (e) => {
    onChange({ name: e.target.name, value: e.target.value.trim() });
    onSubmit && onSubmit();
  };

  return (
    !hide && (
      <Col
        span={colSpan}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          ...containerStyle,
        }}
      >
        <Text>
          {label}
          {required && (
            <span style={{ color: "red", fontSize: 18, lineHeight: "14px" }}>
              *
            </span>
          )}
        </Text>
        <Input
          tabIndex={tabIndex}
          name={name}
          type={type}
          className={className}
          title={label}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onBlur={onBlurInput}
          suffix={suffix}
          prefix={prefix}
          bordered={bordered}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          isnumber={isNumber}
          size={size}
          max={max}
          id={id}
          style={{
            borderColor: borderColor,
            color: textColor,
            letterSpacing: letterSpacing,
            width: "100%",
            ...style,
          }}
          min={min}
          autoComplete={autoComplete}
          pattern={pattern}
          form={form}
          ref={ref}
          onSubmit={onSubmitInput}
          onPressEnter={onPressEnter}
          // {...props}
        />
      </Col>
    )
  );
});

TextFieldSP.propTypes = {
  type: string,
  prefix: any,
  placeholder: string,
  label: string,
  defaultValue: any,
  value: any,
  onChange: func.isRequired,
  suffix: any,
  bordered: bool,
  disabled: bool,
  hide: bool,
  required: bool,
  className: string,
  colSpan: number,
  onBlur: func,
  form: string,
  name: string,
  maxLength: number,
  isNumber: string,
  size: string,
  borderColor: string,
  minLength: number,
  min: number,
  textColor: string,
  letterSpacing: number,
  max: number,
  pattern: string,
  tabIndex: number,
  id: string,
};

export default TextFieldSP;
