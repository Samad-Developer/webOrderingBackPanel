import { Card, Col, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../../common/ThemeConstantsSP";
import ModalComponent from "../../Components/ModalComponent";

export default function DealHalfNHalfModalSP(props) {
  const [selectedList, setSelectedList] = useState([]);
  const [selectedCount, setSelectedCount] = useState(2);
  const posState = useSelector((state) => state.PointOfSaleReducer);

  const handleOk = () => {
    if (selectedList.length > 0) {
      let index = props.dealItemList.findIndex(
        (item) => item.ProductDetailId === props.hNHItem.ProductDetailId
      );
      let obj = props.dealItemList;

      obj.splice(index, 1);

      let arr = selectedList.map((menu) => ({
        OrderMasterId: null,
        ProductDetailId: menu.ProductDetailId,
        ProductDetailName: menu.ProductDetailName,
        PriceWithoutGST: 0,
        GSTId: null,
        GSTPercentage: 0,
        PriceWithGST: 0,
        OrderParentId: posState.punchScreenData.Table.filter(
          (x) => x.ProductId === posState.selectedProductId
        )[0].ProductDetailId,
        // Quantity: 1 / props.hNHItem.ProductPropertyCount,
        Quantity: 1 / selectedCount,
        SpecialInstruction: null,
        DiscountPercent: 0,
        DiscountAmount: 0,
        DealItemId: props.hNHItem.DealItemId,
        DealDescId: menu.DealDescId,
        IsToppingAllowed: menu.IsToppingAllowed,
        SizeId: menu.SizeId,
        ProductPropertyPrice: menu.ProductPropertyPrice,
        ProductPropertyName: menu.ProductPropertyName,
        ProductPropertyId: menu.ProductPropertyId,
        ProductPropertyCount: menu.ProductPropertyCount,
      }));

      props.setDealItemList([
        ...obj,
        { ...props.hNHItem, Quantity: 1 / selectedCount },
        // { ...props.hNHItem, Quantity: 1 / props.hNHItem.ProductPropertyCount },
        ...arr,
      ]);
      props.handleOk(false);
      setSelectedList([]);
    }
  };

  const handleCancel = () => {
    setSelectedList([]);
    props.handleOk(false);
  };

  const addProductToSelection = (menu) => {
    // if (selectedList.length + 1 > props.hNHItem.ProductPropertyCount - 1)
    if (selectedList.length + 1 > selectedCount - 1) selectedList.splice(0, 1);

    const _selectedList = [...selectedList]
      .concat(menu)
      .filter((item) => item !== "");

    setSelectedList(_selectedList);
  };

  return (
    <ModalComponent
      isModalVisible={props.isModalVisible}
      handleOk={handleOk}
      handleCancel={handleCancel}
      title={
        <Title level={5}>
          {props.title} (For: {props.hNHItem.ProductPropertyCount})
        </Title>
        //  + <b> + ' (For: )' + +
      }
      okText={props.okText}
      cancelText={props.cancelText}
      width="70vw"
      closable={props.closable}
      destroyOnClose={props.destroyOnClose}
    >
      <Row>
        <label>Select Pizza Count: </label>
        <select
          value={selectedCount}
          onChange={(e) => {
            setSelectedCount(e.target.value);
            setSelectedList([]);
          }}
        >
          <option value={2}>2</option>
          <option value={4}>4</option>
        </select>
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
        {props.filteredList?.length > 0 ? (
          props.filteredList
            .filter((x) => x.ProductDetailPropertyCount == selectedCount)
            .map((menu, index) => {
              const count = selectedList.filter(
                (i) => i.ProductDetailId === menu.ProductDetailId
              )?.length;
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
                              ? process.env.REACT_APP_BASEURL +
                                menu.ProductImage
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
            })
        ) : (
          <div>
            <h1>No product found!</h1>
          </div>
        )}
      </Row>
    </ModalComponent>
  );
}
