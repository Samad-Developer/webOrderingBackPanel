import React from "react";
import { Row } from "antd";
import { arrayOf, element, func, object, string } from "prop-types";

const FormContainer = (props) => {
  const { children, onSubmit, rowStyle, formStyle, className } = props;
  return (
    <form onSubmit={onSubmit} style={formStyle}>
      <Row gutter={[8, 8]} style={rowStyle} className={className}>
        {children}
      </Row>
    </form>
  );
};

FormContainer.propTypes = {
  onSubmit: func,
  formStyle: object,
  rowStyle: object,
  className: string
};

export default FormContainer;
