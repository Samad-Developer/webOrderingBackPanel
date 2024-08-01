import { Card, Col, Row, Spin } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import burgerImg from "../../../../assets/images/burger.png";
import { list } from "../../data";
import {
  getFloatValue,
  getRandomNumber,
  removeCharectersAndtoUpperCase,
} from "../../functionsSP/generalFunctionsSP";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";
import MenuDetailDrawer from "./MenuDetailDrawer";
import { OpenDrawerOrAddProductToCart } from "./OpenDrawerOrAddProductToCart";

const ProductList = (props) => {
  const { Meta } = Card;
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const dispatch = useDispatch();
  const productList = list.ProductDetailList;

  const [renderList, setRenderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const {
    ProductDetailList,
    CategoryList,
    ProductList,
    DealOptionList,
    DealItemList,
    ProductSizeList,
    FlavourList,
    OrderSource,
    PaymentMode,
    DiscountTypeList,
    DiscountProductMappingList,
  } = list;

  useEffect(() => {
    if (posState.selectedCategory > 0) {
      setLoading(true);
      setRenderList(
        renderList?.filter(
          (x) =>
            posState.selectedCategory &&
            x.CategoryId === posState.selectedCategory &&
            removeCharectersAndtoUpperCase(x.ProductName).match(
              removeCharectersAndtoUpperCase(props.searchProduct)
            )
        )
      );
    } else {
      setRenderList(
        productList.filter((x) => posState.orderSourceId === x.orderSourceId)
      );
    }
    setSelectedProduct([]);
  }, [posState.selectedCategory]);

  useEffect(() => {
    setLoading(false);
  }, [renderList]);

  useEffect(() => {
    setLoading(true);
    setRenderList(
      productList.filter((x) => posState.orderSourceId === x.orderSourceId)
    );
    setSelectedProduct([]);
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "punchScreenData",
        value: {
          Table: ProductDetailList,
          Table1: CategoryList,
          Table2: ProductList,
          Table3: DealOptionList,
          Table4: DealItemList,
          Table5: ProductSizeList,
          Table6: FlavourList,
          Table7: null,
          Table8: OrderSource,
          Table9: null,
          Table10: null,
          Table11: PaymentMode,
          Table12: null,
          Table13: DiscountTypeList,
          Table14: DiscountProductMappingList,
        },
      },
    });
  }, [posState.orderSourceId]);

  const openDrawerOrAddProductToCart = (menu) => {
    let productCart = [...posState.productCart];
    const productDetail = posState.punchScreenData.Table.filter(
      (e) =>
        e.ProductId === menu[0].ProductId &&
        e.orderSourceId === posState.orderSourceId
    );
    let randomNumber = getRandomNumber(1, 10000);
    if (productDetail.length === 1 && productDetail[0].IsDeal === false) {
      const foundProduct = productCart.filter(
        (e) =>
          e.ProductDetailId === productDetail[0].ProductDetailId &&
          e?.IsTopping === false &&
          e?.HalfAndHalf === false &&
          e?.IsDeal === false &&
          e?.SpecialInstruction === ""
      );
      if (foundProduct.length > 0) {
        const index = productCart.findIndex(
          (e) =>
            e.ProductDetailId === foundProduct[0].ProductDetailId &&
            e.IsDeal === false
        );
        productCart[index] = {
          ...foundProduct[0],
          Quantity: foundProduct[0].Quantity + 1,
          totalAmount: getFloatValue(
            getFloatValue(parseFloat(productDetail[0].Price), 2) *
              (foundProduct[0].Quantity + 1)
          ),
        };
      } else {
        productCart.push({
          ...productDetail[0],
          OrderMasterId: null,
          PriceWithoutGST: getFloatValue(productDetail[0].Price),
          PriceWithGST: getFloatValue(parseFloat(productDetail[0].Price), 2),
          totalAmount: getFloatValue(
            getFloatValue(parseFloat(productDetail[0].Price), 2) * 1
          ),
          SpecialInstruction: "",
          OrderParentId: null,
          Quantity: parseInt(1, 0),
          DiscountPercent: 0,
          DiscountAmount: 0,
          RandomId: randomNumber,
          HalfAndHalf: false,
        });
      }
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "productCart",
          value: productCart,
        },
      });
      if (posState.OrderMasterId !== null) {
        let addList = {
          OrderMasterId: posState.OrderMasterId,
          ProductDetailId: productDetail[0].ProductDetailId,
          Quantity: parseFloat(1),
          PriceWithoutGST: parseFloat(getFloatValue(productDetail[0].Price)),
          AmountWithGST: 0,
          ProductDetailName: productDetail[0].ProductDetailName,
          type: "Add",
        };
        dispatch({
          type: SP_SET_POS_STATE,
          payload: {
            name: "OrderDetailAdd",
            value: [...posState.OrderDetailAdd, addList],
          },
        });
      }
    } else {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "selectedProductId",
          value: menu[0].ProductId,
        },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "IsDealDirectPunch",
          value: productDetail[0].IsDealDirectPunch,
        },
      });
      if (menu[0].IsDeal === true) {
        dispatch({
          type: SP_SET_POS_STATE,
          payload: { name: "dealSelection", value: true },
        });

        if (productDetail[0].IsDealDirectPunch) {
          posState.dealItemsList.forEach((item) => {
            item.ProductDetailId === productDetail[0].ProductDetailId &&
              productCart.push({
                OrderMasterId: null,
                OrderParentId: item.ProductDetailId,
                ProductDetailId: item.DealDescItemDetailId,
                ProductDetailName: item.DealDescItemName,
                PriceWithoutGST: item.Price,
                GSTId: null,
                GSTPercentage: 0,
                PriceWithGST: item.Price,
                Quantity: item.Quantity,
                SpecialInstruction: "",
                DiscountPercent: 0,
                DiscountAmount: 0,
                DealItemId: item.DealItemId,
                DealDescId: item.DealDescId,
                IsToppingAllowed: false,
                SizeId: item.SizeId,
                SortIndex: item.SortIndex,
                ProductPropertyPrice: 0,
                ProductPropertyName: null,
                ProductPropertyId: null,
                ProductPropertyCount: null,
                totalAmount: item.Price,
                RandomId: randomNumber,
                HalfAndHalf: false,
              });
          });
          productCart.unshift({
            ...productDetail[0],
            OrderMasterId: null,
            SpecialInstruction: "",
            OrderParentId: null,
            Quantity: 1,
            ProductCode: productDetail[0].ProductCode,
            PriceWithoutGST: parseFloat(productDetail[0].Price) * parseFloat(1),
            PriceWithGST: parseFloat(
              parseFloat(productDetail[0].Price) * parseFloat(1)
            ).toFixed(2),
            totalAmount: productDetail[0].Price * parseFloat(1),
            GSTId: productDetail[0].GSTId,
            DiscountPercent: 0,
            DiscountAmount: 0,
            RandomId: randomNumber,
            HalfAndHalf: false,
            IsDeal: true,
          });

          dispatch({
            type: SP_SET_POS_STATE,
            payload: {
              name: "productCart",
              value: productCart,
            },
          });
        }
      }
    }
  };

  // const toggleOpenDrawerOrAddProductToCart = (menu) => {
  //   let data = OpenDrawerOrAddProductToCart(menu, posState);
  //   console.log("data", data);
  // };

  return (
    <div style={{ overflow: "auto" }}>
      <Spin spinning={loading}>
        <Row
          gutter={[10, 10]}
          style={{
            padding: "10px",
            width: "100%",
            background: "#FAFAFA",
          }}
        >
          {renderList
            .filter((x) =>
              removeCharectersAndtoUpperCase(x.ProductName).match(
                removeCharectersAndtoUpperCase(props.searchProduct)
              )
            )
            .map((menu, index) => (
              <Col key={index}>
                <Card
                  className=""
                  hoverable
                  style={{
                    width: "153px",
                    height: "220px",
                    background: "#FFFFFF",
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
                          menu.ProductImage != null
                            ? //   ? process.env.REACT_APP_BASEURL + menu.ProductImage
                              burgerImg
                            : null
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
                      <div
                        style={{
                          position: "absolute",
                          bottom: 1,
                          right: 1,
                          background: "#ffffffdf",
                          fontSize: 17,
                          padding: "0px 5px",
                          borderTopLeftRadius: 5,
                        }}
                      >
                        Rs. <b>{menu?.Price.toFixed(2)}</b>
                      </div>
                    </div>
                  }
                  onClick={() => openDrawerOrAddProductToCart([menu])}
                >
                  <Meta
                    title={menu.ProductName}
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
            ))}
        </Row>
      </Spin>
      <MenuDetailDrawer />
    </div>
  );
};

export default ProductList;
