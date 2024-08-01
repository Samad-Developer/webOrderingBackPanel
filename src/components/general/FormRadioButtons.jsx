import { Button, Col, Radio } from "antd";
import { array, bool, element, func, number, object, string } from "prop-types";
import React from "react";
import "./FormButton.css";

const FormRadioButtons = (props) => {
    const {
        colSpan,
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
        color,
        style,
        colStyle,
        form,
        list,
        onChange,
        value,
        name
    } = props;

    const handleChange = (e) => {
        onChange({ name: name, value: e.target.value });
    };

    return (
        <Col style={colStyle} span={colSpan}>
            <Radio.Group disabled={disabled} onChange={handleChange} value={value}>
                {list.map((item) => {
                    return <Radio value={item.value} >{item.name}</Radio>
                })}
            </Radio.Group>
        </Col>
    );
};

FormRadioButtons.propTypes = {
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
    onChange: func,
    list: array,
    value: string
};

export default FormRadioButtons;
