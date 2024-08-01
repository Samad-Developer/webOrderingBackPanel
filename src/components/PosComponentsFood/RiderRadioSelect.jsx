import React, { useEffect, useState } from "react";
import { array, bool, func, object, string } from "prop-types";
import { Button, Col, Row } from "antd";
import { useSelector } from "react-redux";

const RiderRadioSelect = (props) => {
    const selectedStyle = {
        height: "40px",
        color: "#fff",
        borderColor: "#4561B9",
        gap: "3px",
        backgroundColor: "#4561B9",
        boxShadow: "0 0 3px #4561b966",
    };

    const normalStyle = {
        height: "40px",
        color: "#4561B9",
        borderColor: "#4561B9",
        gap: "3px",
        backgroundColor: "#f4f9ff",
        boxShadow: "0 0 3px #4561b966",
    };

    const { title, styles, list, listId, listName, onClick, disabled, selected } =
        props;
    const [selectedItem, setSelectedItem] = useState(null);
    const posState = useSelector((state) => state.PointOfSaleReducer);

    useEffect(() => {
        if (posState[selected] !== null) setSelectedItem(posState[selected]);
    }, [posState[props.selected]]);

    const toggleItem = (id) => {
        if (selectedItem === id) setSelectedItem(null);
        else setSelectedItem(id);
        onClick(id);
    };

    return (
        <div style={styles}>
            <h2>{title}</h2>

            <Row gutter={[10, 8]}>
                {list &&
                    list.map((item, index) => (
                        <Col key={index}>
                            <Button
                                style={
                                    selectedItem === item[listId] ? selectedStyle : normalStyle
                                }
                                onClick={() => toggleItem(item[listId])}
                                disabled={item.IsOpen === true || disabled}
                            >
                                {item[listName]}
                            </Button>
                        </Col>
                    ))}
            </Row>
        </div>
    );
};

RiderRadioSelect.propTypes = {
    styles: object,
    list: array,
    listId: string,
    listName: string,
    onClick: func,
    title: string,
    disabled: bool,
    selected: string,
};

export default RiderRadioSelect;
