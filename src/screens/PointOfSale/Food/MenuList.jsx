import { Col, Row, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuDetailDrawer from "./MenuDetailDrawer";
import burgerImg from "../../../assets/images/burger.png"; //"../../../.assets/images/burger.png";
import { SearchOutlined } from "@ant-design/icons";
import { ADD_TO_CART, SET_POS_STATE } from "../../../redux/reduxConstants";
import FormTextField from "../../../components/general/FormTextField";
import {
  getFloatValue,
  getRandomNumber,
  removeCharectersAndtoUpperCase,
} from "../../../functions/generalFunctions";

const MenuList = () => {
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const dispatch = useDispatch((state) => state.PointOfSaleReducer);
  const [searchProduct, setSearchProduct] = useState("");
  const [renderList, setRenderList] = useState([]);
  const { Meta } = Card;

  useEffect(() => {
    if (posState.selectedCategory > 0)
      setRenderList(
        posState.punchScreenData.Table2.filter(
          (x) =>
            posState.selectedCategory &&
            x.CategoryId === posState.selectedCategory &&
            removeCharectersAndtoUpperCase(x.ProductName).match(
              removeCharectersAndtoUpperCase(searchProduct)
            )
        )
      );
    else setRenderList(posState.punchScreenData.Table2);
  }, [posState.selectedCategory]);

  const openDrawerOrAddProductToCart = (menu) => {

    let productCart = [...posState.productCart];
    const productDetail = posState.punchScreenData.Table.filter(
      (e) => e.ProductId === menu.ProductId
    );
    let randomNumber = getRandomNumber(1, 10000);
    if (productDetail.length === 1 && productDetail[0].IsDeal === false) {
      const foundProduct = productCart.filter(
        (e) =>
          e.ProductDetailId === productDetail[0].ProductDetailId &&
          e?.IsTopping === false &&
          e?.HalfAndHalf === false &&
          e?.IsDeal === false &&
          e?.SpecialInstruction === "" &&
          e?.DealDescId === undefined &&
          (e?.OrderParentId === null || e?.OrderParentId === undefined)
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
        type: SET_POS_STATE,
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
          type: SET_POS_STATE,
          payload: {
            name: "OrderDetailAdd",
            value: [...posState.OrderDetailAdd, addList],
          },
        });
      }
    } else {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "selectedProductId",
          value: menu.ProductId,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "IsDealDirectPunch",
          value: productDetail[0].IsDealDirectPunch,
        },
      });
      if (menu.IsDeal === true) {
        dispatch({
          type: SET_POS_STATE,
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
            type: SET_POS_STATE,
            payload: {
              name: "productCart",
              value: productCart,
            },
          });
        }
      }
    }
  };

  // const openDrawerOrAddProductToCart = (menu) => {
  //   let productCart = [...posState.productCart];
  //   const productDetail = posState.punchScreenData.Table.filter(
  //     (e) => e.ProductId === menu.ProductId
  //   );
  //   let randomNumber = getRandomNumber(1, 10000);
  //   if (productDetail.length === 1 && productDetail[0].IsDeal === false) {
  //     const foundProduct = productCart.filter(
  //       (e) =>
  //         e.ProductDetailId === productDetail[0].ProductDetailId &&
  //         e?.IsTopping === false &&
  //         e?.HalfAndHalf === false &&
  //         e?.IsDeal === false &&
  //         e?.SpecialInstruction === ""
  //     );
  //     if (foundProduct.length > 0) {
  //       const index = productCart.findIndex(
  //         (e) =>
  //           e.ProductDetailId === foundProduct[0].ProductDetailId &&
  //           e.IsDeal === false
  //       );
  //       productCart[index] = {
  //         ...foundProduct[0],
  //         Quantity: foundProduct[0].Quantity + 1,
  //         totalAmount: getFloatValue(
  //           getFloatValue(parseFloat(productDetail[0].Price), 2) *
  //             (foundProduct[0].Quantity + 1)
  //         ),
  //       };
  //     } else {
  //       productCart.push({
  //         ...productDetail[0],
  //         OrderMasterId: null,
  //         PriceWithoutGST: getFloatValue(productDetail[0].Price),
  //         PriceWithGST: getFloatValue(parseFloat(productDetail[0].Price), 2),
  //         totalAmount: getFloatValue(
  //           getFloatValue(parseFloat(productDetail[0].Price), 2) * 1
  //         ),
  //         SpecialInstruction: "",
  //         OrderParentId: null,
  //         Quantity: parseInt(1, 0),
  //         DiscountPercent: 0,
  //         DiscountAmount: 0,
  //         RandomId: randomNumber,
  //         HalfAndHalf: false,
  //       });
  //     }
  //     dispatch({
  //       type: SET_POS_STATE,
  //       payload: {
  //         name: "productCart",
  //         value: productCart,
  //       },
  //     });
  //     if (posState.OrderMasterId !== null) {
  //       let addList = {
  //         OrderMasterId: posState.OrderMasterId,
  //         ProductDetailId: productDetail[0].ProductDetailId,
  //         Quantity: parseFloat(1),
  //         PriceWithoutGST: parseFloat(getFloatValue(productDetail[0].Price)),
  //         AmountWithGST: 0,
  //         ProductDetailName: productDetail[0].ProductDetailName,
  //         type: "Add",
  //       };
  //       dispatch({
  //         type: SET_POS_STATE,
  //         payload: {
  //           name: "OrderDetailAdd",
  //           value: [...posState.OrderDetailAdd, addList],
  //         },
  //       });
  //     }
  //   } else {
  //     dispatch({
  //       type: SET_POS_STATE,
  //       payload: {
  //         name: "selectedProductId",
  //         value: menu.ProductId,
  //       },
  //     });
  //     dispatch({
  //       type: SET_POS_STATE,
  //       payload: {
  //         name: "IsDealDirectPunch",
  //         value: productDetail[0].IsDealDirectPunch,
  //       },
  //     });
  //     if (menu.IsDeal === true) {
  //       dispatch({
  //         type: SET_POS_STATE,
  //         payload: { name: "dealSelection", value: true },
  //       });

  //       if (productDetail[0].IsDealDirectPunch) {
  //         posState.dealItemsList.forEach((item) => {
  //           item.ProductDetailId === productDetail[0].ProductDetailId &&
  //             productCart.push({
  //               OrderMasterId: null,
  //               OrderParentId: item.ProductDetailId,
  //               ProductDetailId: item.DealDescItemDetailId,
  //               ProductDetailName: item.DealDescItemName,
  //               PriceWithoutGST: item.Price,
  //               GSTId: null,
  //               GSTPercentage: 0,
  //               PriceWithGST: item.Price,
  //               Quantity: item.Quantity,
  //               SpecialInstruction: "",
  //               DiscountPercent: 0,
  //               DiscountAmount: 0,
  //               DealItemId: item.DealItemId,
  //               DealDescId: item.DealDescId,
  //               IsToppingAllowed: false,
  //               SizeId: item.SizeId,
  //               SortIndex: item.SortIndex,
  //               ProductPropertyPrice: 0,
  //               ProductPropertyName: null,
  //               ProductPropertyId: null,
  //               ProductPropertyCount: null,
  //               totalAmount: item.Price,
  //               RandomId: randomNumber,
  //               HalfAndHalf: false,
  //             });
  //         });
  //         productCart.unshift({
  //           ...productDetail[0],
  //           OrderMasterId: null,
  //           SpecialInstruction: "",
  //           OrderParentId: null,
  //           Quantity: 1,
  //           ProductCode: productDetail[0].ProductCode,
  //           PriceWithoutGST: parseFloat(productDetail[0].Price) * parseFloat(1),
  //           PriceWithGST: parseFloat(
  //             parseFloat(productDetail[0].Price) * parseFloat(1)
  //           ).toFixed(2),
  //           totalAmount: productDetail[0].Price * parseFloat(1),
  //           GSTId: productDetail[0].GSTId,
  //           DiscountPercent: 0,
  //           DiscountAmount: 0,
  //           RandomId: randomNumber,
  //           HalfAndHalf: false,
  //           IsDeal: true,
  //         });

  //         dispatch({
  //           type: SET_POS_STATE,
  //           payload: {
  //             name: "productCart",
  //             value: productCart,
  //           },
  //         });
  //       }
  //     }
  //   }
  // };

  return (
    <div style={{ height: "90vh", background: "rgb(250, 250, 250)" }}>
      <div
        style={{
          width: "100%",
          padding: "20px 10px 0px 10px",
          background: "#FAFAFA",
        }}
      >
        <FormTextField
          placeholder="Search Product"
          size="large"
          prefix={<SearchOutlined />}
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.value)}
          onPressEnter={(e) => {
            e.preventDefault();
            return;
          }}
        />
      </div>
      <Row
        gutter={[10, 10]}
        style={{
          padding: "10px",
          width: "100%",
          background: "#FAFAFA",
          overflow: "auto",
          margin: 0,
        }}
      >
        {renderList
          .filter((x) =>
            removeCharectersAndtoUpperCase(x.ProductName).match(
              removeCharectersAndtoUpperCase(searchProduct)
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
                      Rs. <b>{menu?.ProductPrice.toFixed(2)}</b>
                    </div>
                  </div>
                }
                onClick={() => {
                  openDrawerOrAddProductToCart(menu);
                }}
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
      <MenuDetailDrawer />
    </div>
  );
};

export default MenuList;
