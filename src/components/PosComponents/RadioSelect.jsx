import React, { useEffect, useState } from "react";
import { array, bool, func, object, string } from "prop-types";
import { Button, Col, Row } from "antd";
import { useSelector } from "react-redux";
import Title from "antd/lib/typography/Title";

const RadioSelect = (props) => {
  const {
    title,
    styles,
    list,
    listId,
    listName,
    onClick,
    disabled,
    selected,
    isButtonWithPicture = false,
  } = props;

  const selectedStyle = isButtonWithPicture
    ? {
        height: "90px",
        color: "#fff",
        borderColor: "#4561B9",
        gap: "3px",
        backgroundColor: "#4561B9",
        boxShadow: "0 0 3px #4561b966",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        whiteSpace: "break-spaces",
        textAlign: "center",
        width: "100px",
        alignItems: "center",
        padding: "5px 5px",
        justifyContent: "center",
      }
    : {
        height: "40px",
        color: "#fff",
        borderColor: "#4561B9",
        gap: "3px",
        backgroundColor: "#4561B9",
        boxShadow: "0 0 3px #4561b966",
      };

  const normalStyle = isButtonWithPicture
    ? {
        height: "90px",
        color: "#4561B9",
        borderColor: "#4561B9",
        gap: "3px",
        backgroundColor: "#f4f9ff",
        boxShadow: "0 0 3px #4561b966",
        width: "100px",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        whiteSpace: "break-spaces",
        alignItems: "center",
        padding: "5px 5px",
        justifyContent: "center",
      }
    : {
        height: "40px",
        color: "#4561B9",
        borderColor: "#4561B9",
        gap: "3px",
        backgroundColor: "#f4f9ff",
        boxShadow: "0 0 3px #4561b966",
      };
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
        {list &&
          list.map((item, index) => (
            <Col key={index}>
              {isButtonWithPicture ? (
                <Button
                  style={
                    selectedItem === item[listId] ? selectedStyle : normalStyle
                  }
                  onClick={() => toggleItem(item)}
                  disabled={item.IsOpen === true || disabled}
                >
                  <img
                    alt="Product"
                    src={
                      item.CategoryImage != null
                        ? process.env.REACT_APP_BASEURL + item.CategoryImage
                        : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                    }
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #bbb",
                      height: "35px",
                      width: "40px",
                    }}
                  />

                  {/* <div style={{ marginLeft: "10px", wordWrap: "break-word", fontSize: '10px' }}> */}
                  {item[listName]}
                  {/* </div> */}
                </Button>
              ) : (
                <Button
                  style={
                    selectedItem === item[listId] ? selectedStyle : normalStyle
                  }
                  onClick={() => toggleItem(item)}
                  disabled={item.IsOpen === true || disabled}
                >
                  {item[listName]}
                </Button>
              )}
            </Col>
          ))}
      </Row>
    </div>
  );
};

RadioSelect.propTypes = {
  styles: object,
  list: array,
  listId: string,
  listName: string,
  onClick: func,
  title: string,
  disabled: bool,
  selected: string,
};

export default RadioSelect;
