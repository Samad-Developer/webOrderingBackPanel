import { Button } from "antd";
import { bool, element, func, number, string } from "prop-types";
import React from "react";
import "./FormButton.css";

const FormTileButton = (props) => {
  const {
    size,
    icon,
    onClick,
    title,
    type,
    loading,
    disabled,
    htmlType,
    className,
    width,
    height,
    margin,
    color,
    font,
    innerHtml,
    codes,
  } = props;
  return (
    <Button
      type={type}
      htmlType={htmlType}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      size={size}
      className={`${className} ${color && color}`}
      style={{
        height: height || 130,
        width: width || 130,
        boxShadow: "0 0 5px #bfbfbf",
        margin: margin,
        fontSize: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: innerHtml }}></div>
      {icon}
      {title}
      <span
        style={{
          fontSize: 10,
          color: disabled ? "darkgray" : "#ffffffc2",
        }}
      >
        {codes}
      </span>
    </Button>
  );
};

FormTileButton.propTypes = {
  font: number,
  color: string,
  size: string,
  icon: element,
  onClick: func,
  title: string,
  type: string,
  loading: bool,
  disabled: bool,
  htmlType: string,
  width: string,
  margin: string,
  height: string,
};

export default FormTileButton;
