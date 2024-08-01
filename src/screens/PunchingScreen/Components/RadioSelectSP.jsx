import React, { useEffect, useState } from "react";
import { array, bool, func, object, string } from "prop-types";
import { Button, Col, Row } from "antd";
import { useSelector } from "react-redux";
import Title from "antd/lib/typography/Title";

const RadioSelectSP = (props) => {
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

  const {
    title,
    styles,
    list,
    listId,
    listName,
    onClick,
    disabled,
    selected,
    noRecordsMsg,
    disVar = null,
    cond,
  } = props;
  const [selectedItem, setSelectedItem] = useState(null);
  const posState = useSelector((state) => state.PointOfSaleReducer);

  useEffect(() => {
    if (posState.selectedOrder[selected] !== null)
      setSelectedItem(posState.selectedOrder[selected]);
  }, [posState.selectedOrder[props.selected]]);

  const toggleItem = (item) => {
    if (selectedItem === item[listId]) setSelectedItem(null);
    else setSelectedItem(item[listId]);
    onClick(item[listId], item[listName]);
  };

  return (
    <div style={styles}>
      <Title level={4}>{title}</Title>

      <Row gutter={[10, 8]}>
        {!list[0] && noRecordsMsg && (
          <Col>
            <span>{noRecordsMsg}</span>
          </Col>
        )}
        {list &&
          list.map((item, index) => {
            return (
              <Col key={index}>
                <Button
                  style={
                    selectedItem === item[listId] ? selectedStyle : normalStyle
                  }
                  onClick={() => toggleItem(item)}
                  disabled={
                    disVar !== null ? item[disVar] === cond : false || disabled
                  }
                >
                  {item[listName]}
                </Button>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

RadioSelectSP.propTypes = {
  styles: object,
  list: array,
  listId: string,
  listName: string,
  onClick: func,
  title: string,
  disabled: bool,
  selected: string,
};

export default RadioSelectSP;
