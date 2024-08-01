import { Button, Col } from "antd";
import { bool, element, func, number, object, string } from "prop-types";
import React from "react";
import "./FormButton.css";

const FormButtonSP = (props) => {
  const {
    colSpan,
    size,
    icon,
    onClick = () => {},
    title,
    type,
    loading = false,
    disabled,
    htmlType,
    className,
    width,
    color,
    style,
    colStyle,
    form,
  } = props;

  const clickHandler = (e) => {
    if (loading === false) onClick(e);
    else return null;
  };

  return (
    <Col style={colStyle} span={colSpan}>
      <Button
        type={type}
        htmlType={htmlType}
        icon={!loading && icon}
        onClick={clickHandler}
        loading={loading}
        disabled={disabled}
        size={size}
        form={form}
        className={`${className} ${color && color === "green" ? "green" : null}
        ${color && color === "red" ? "red" : null} ${
          color && color === "gray" ? "gray" : null
        }`}
        style={style || { borderRadius: 2, width: width }}
      >
        {title}
      </Button>
    </Col>
  );
};

FormButtonSP.propTypes = {
  colSpan: number,
  size: string,
  icon: element,
  onClick: func,
  title: string,
  type: string,
  loading: bool,
  disabled: bool,
  htmlType: string,
  width: string,
  colStyle: object,
  form: string,
};

export default FormButtonSP;
