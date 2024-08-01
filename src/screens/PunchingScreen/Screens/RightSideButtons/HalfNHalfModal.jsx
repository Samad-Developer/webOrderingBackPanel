import { SearchOutlined } from "@ant-design/icons";
import { Col, Row, Card, Button } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../../common/ThemeConstantsSP";
import TextFieldSP from "../../Components/general/TextFeildSP";
import ModalComponent from "../../Components/ModalComponent";

const { Meta } = Card;

const HalfNHalfModal = ({ show = false, setShow }) => {
  const dispatch = useDispatch();
  const {
    punchScreenData: { Table9 },
    productCart,
  } = useSelector((state) => state.SinglePagePOSReducers);

  const [searchProduct, setSearchProduct] = useState("");
  const [selectedList, setSelectedList] = useState([]);
  const [maxAllowed, setMaxAllowed] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedCount, setSelectedCount] = useState(2);
  const [displayList, setDisplayList] = useState([]);

  useEffect(() => {
    if (Table9 !== null) {
      setDisplayList(
        Table9?.filter((x) => x.ProductDetailPropertyCount == selectedCount)
      );
    }
  }, [selectedCount]);

  const addProductToSelection = (menu) => {
    if (selectedList.length === 0) {
      setMaxAllowed(parseInt(selectedCount));
      const _selectedList = [...selectedList]
        .concat(menu)
        .filter((item) => item !== "");
      setSelectedList(_selectedList);
    }
    if (selectedList.length < maxAllowed) {
      const _selectedList = [...selectedList]
        .concat(menu)
        .filter((item) => item !== "");
      setSelectedList(_selectedList);
    }
  };

  const onAddToCart = () => {
    let _productCart = [...productCart];
    if (maxAllowed != selectedList.length) {
      message.error(`Please select ${maxAllowed} items`);
      return;
    }
    if (quantity < 1) {
      message.error("Please enter valid quantity");
      return;
    }
    // if
    for (let index = 0; index < quantity; index++) {
      let randomNumber = getRandomNumber(1, 10000);
      selectedList.forEach((item, i) => {
        _productCart.push({
          ...item,
          OrderMasterId: null,
          PriceWithoutGST: getFloatValue(item.ProductDetailPropertyPrice),
          PriceWithGST: getFloatValue(
            parseFloat(item.ProductDetailPropertyPrice),
            2
          ),
          totalAmount: getFloatValue(
            getFloatValue(parseFloat(item.ProductDetailPropertyPrice), 2) * 1
          ),
          SpecialInstruction: "",
          OrderParentId: null,
          Quantity: 1 / maxAllowed,
          DiscountPercent: 0,
          DiscountAmount: 0,
          RandomId: randomNumber,
          HalfAndHalf: true,
        });
      });
    }

    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "productCart",
        value: _productCart,
      },
    });
    setMaxAllowed(0);
    setQuantity(1);
    setSelectedList([]);
    setShow(false);
  };

  const onCancel = () => {
    setShow(false);
    setMaxAllowed(0);
    setQuantity(1);
    setSelectedList([]);
  };

  return (
    <ModalComponent
      width={"75vw"}
      title={"Half And Half Modal"}
      isModalVisible={show}
      handleOk={() => onAddToCart()}
      handleCancel={() => onCancel()}
    >
      <Row
        style={{ marginBottom: 10, display: "flex", alignItems: "center" }}
        gutter={10}
      >
        <Col span={6}>
          <Row style={{ display: "flex", alignItems: "center" }}>
            <Col span={6}>
              <label>Quantity:</label>
            </Col>
            <Col span={18}>
              <TextFieldSP
                min={1}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.value)}
                isNumber="true"
              />
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row>
            <Col span={8}>
              <label>H&H Count: </label>
            </Col>
            <Col span={16}>
              <select
                className="ant-input"
                value={selectedCount}
                onChange={(e) => {
                  setSelectedCount(e.target.value);
                }}
              >
                <option value={2}>Half n Half (2 Flavours)</option>
                <option value={4}>Half n Half (4 Flavours)</option>
              </select>
            </Col>
          </Row>
        </Col>
        {/* <Col span={6}>
          <div>
            Max Allowed: <span style={{ marginLeft: 5 }}>{maxAllowed}</span>
          </div>
        </Col> */}
        <Col span={6}>
          <div>
            Total Selected:{" "}
            <span style={{ marginLeft: 5 }}>{selectedList.length}</span>
          </div>
        </Col>
        <Col span={6} style={{ textAlignLast: "end" }}>
          <Button
            type="primary"
            onClick={() => {
              setMaxAllowed(0);
              setSelectedList([]);
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
      <Row>
        <div
          style={{
            width: "100%",
            padding: "20px 10px 0px 10px",
            background: "#FAFAFA",
          }}
        >
          <TextFieldSP
            placeholder="Search Product"
            size="large"
            prefix={<SearchOutlined />}
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.value)}
          />
        </div>
      </Row>
      <Row
        gutter={[10, 10]}
        style={{
          padding: "10px",
          width: "100%",
          background: "#FAFAFA",
          overflow: "auto",
          margin: 0,
          justifyContent: "center",
        }}
      >
        {displayList
          ?.filter((x) => {
            if (selectedList.length > 0) {
              return (
                removeCharectersAndtoUpperCase(x.ProductDetailName).match(
                  removeCharectersAndtoUpperCase(searchProduct)
                ) && x.SizeId == selectedList[0].SizeId
              );
            } else {
              return removeCharectersAndtoUpperCase(x.ProductDetailName).match(
                removeCharectersAndtoUpperCase(searchProduct)
              );
            }
          })
          .map((menu, index) => {
            const count = selectedList.filter(
              (i) => i.ProductDetailId === menu.ProductDetailId
            ).length;
            return (
              <Col key={index}>
                <Card
                  className=""
                  hoverable
                  style={{
                    width: "153px",
                    height: "220px",
                    background: selectedList.find((i) => i == menu)
                      ? PRIMARY_COLOR
                      : "#FFFFFF",
                    borderRadius: "5px",
                    border: "1px solid rgb(0 0 0 / 20%)",
                  }}
                  cover={
                    <div
                      className="posProductImage"
                      style={{ position: "relative" }}
                    >
                      <img
                        alt="Product"
                        src={
                          menu.ProductImage != ""
                            ? process.env.REACT_APP_BASEURL + menu.ProductImage
                            : burgerImg
                        }
                        style={{
                          borderRadius: "5px 5px 0 0",
                          border: "1px solid #bbb",
                          borderRadius: "5px 5px 0 0",
                          maxWidth: "100%",
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                        }}
                      />
                      {count ? (
                        <div
                          align="center"
                          style={{
                            position: "absolute",
                            top: -6,
                            color: "white",
                            width: "20px",
                            height: "20px",
                            background: "red",
                            right: -6,
                            borderRadius: 25,
                            fontWeight: 600,
                          }}
                        >
                          {count}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  }
                  onClick={() => {
                    addProductToSelection(menu);
                  }}
                >
                  <Meta
                    title={menu.ProductDetailName}
                    style={{
                      fontWeight: 400,
                      fontSize: 8,
                      overflow: "auto",
                      textAlign: "center",
                      whiteSpace: "normal",
                    }}
                  />
                </Card>
              </Col>
            );
          })}
      </Row>
    </ModalComponent>
  );
};

export default HalfNHalfModal;
