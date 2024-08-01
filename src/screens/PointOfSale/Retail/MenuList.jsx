// External Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Ant Design Components
import { SearchOutlined } from "@ant-design/icons";
import { Card, Col, Row, message } from "antd";

// Custom Components
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormTextField from "../../../components/general/FormTextField";
import MenuDetailDrawer from "./MenuDetailDrawer";

// Utility Functions and Constants
import {
  getFloatValue,
  getRandomNumber,
  removeCharectersAndtoUpperCase,
} from "../../../functions/generalFunctions";
import { SET_POS_STATE } from "../../../redux/reduxConstants";

// Services
import { postRequest } from "../../../services/mainApp.service";

const MenuList = (props) => {
  // Constant IDs
  const OPEN_ITEM_ID = 13867;

  // Redux
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch((state) => state.PointOfSaleReducer);

  // Controller
  const controller = new window.AbortController();

  // State Variables for Searching
  const [searchProduct, setSearchProduct] = useState("");
  const [searchBarcode, setSearchBarcode] = useState("");
  const [renderList, setRenderList] = useState([]);

  // State Variables for Open Item Amount
  const [openItemAmount, setOpenItemAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { Meta } = Card;

  const searcWithBarcode = (menu) => {
    if (menu.includes("ORD") || menu.toUpperCase()[0] === "T") {
      const data = {
        OrderNumber: menu,
        OperationId: 3,
        CompanyId: authState.CompanyId,
        BranchId: authState.branchId,
      };

      postRequest(`CrudTempOrder`, data, controller)
        .then((res) => {
          const products = res.data.DataSet.Table;

          products.forEach((product) => {
            const foundProduct = posState?.punchScreenData?.Table?.find(
              (item) => item.ProductDetailId === product.ProductDetailId
            );
            let randomNumber = getRandomNumber(1, 10000);

            posState.productCart.push({
              ...foundProduct,
              OrderMasterId: null,
              PriceWithoutGST: getFloatValue(foundProduct.Price),
              PriceWithGST: getFloatValue(parseFloat(foundProduct.Price), 2),
              totalAmount: getFloatValue(
                getFloatValue(parseFloat(foundProduct.Price), 2) * 1
              ),
              SpecialInstruction: "",
              OrderParentId: null,
              Quantity: parseInt(1, 0),
              DiscountPercent: 0,
              DiscountAmount: 0,
              RandomId: randomNumber,
            });
          });

          dispatch({
            type: SET_POS_STATE,
            payload: {
              name: "productCart",
              value: posState.productCart,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (!menu) {
        return;
      }
      let randomNumber = getRandomNumber(1, 10000);
      const productDetail = posState?.punchScreenData?.Table12?.filter(
        (e) => e.ProductCode === menu
      )[0];
      if (!productDetail) {
        message.error("Product does not exists");
        return;
      }
      const foundProduct = posState?.punchScreenData?.Table?.filter(
        (e) => e.ProductDetailId === productDetail.ProductDetailId
      );

      posState.productCart.push({
        ...foundProduct[0],
        OrderMasterId: null,
        PriceWithoutGST: getFloatValue(foundProduct[0].Price),
        PriceWithGST: getFloatValue(parseFloat(foundProduct[0].Price), 2),
        totalAmount: getFloatValue(
          getFloatValue(parseFloat(foundProduct[0].Price), 2) * 1
        ),
        SpecialInstruction: "",
        OrderParentId: null,
        Quantity: parseInt(1, 0),
        DiscountPercent: 0,
        DiscountAmount: 0,
        RandomId: randomNumber,
      });

      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "productCart",
          value: posState.productCart,
        },
      });
      if (posState.OrderMasterId !== null) {
        let addList = {
          OrderMasterId: posState.OrderMasterId,
          ProductDetailId: foundProduct[0].ProductDetailId,
          Quantity: parseFloat(1),
          PriceWithoutGST: parseFloat(getFloatValue(foundProduct[0].Price)),
          AmountWithGST: 0,
          ProductDetailName: foundProduct[0].ProductDetailName,
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
    }
    setSearchBarcode("");
  };

  useEffect(() => {
    if (posState.selectedCategory > 0)
      setRenderList(
        posState.punchScreenData.Table.filter(
          (x) =>
            posState.selectedCategory &&
            x.CategoryId === posState.selectedCategory &&
            removeCharectersAndtoUpperCase(x.ProductName).match(
              removeCharectersAndtoUpperCase(searchProduct)
            )
        )
      );
    else setRenderList(posState.punchScreenData.Table);
  }, [posState.selectedCategory]);

  const openDrawerOrAddProductToCart = (menu) => {
    let productCart = [...posState.productCart];
    const productDetail = posState.punchScreenData.Table.filter(
      (e) => e.ProductDetailId === menu.ProductDetailId
    );
    let randomNumber = getRandomNumber(1, 10000);
    productCart.unshift({
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
    // }
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
      setSearchProduct(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOpenItemAmount(0);
  };

  const handleOpenItemPrice = () => {
    if (openItemAmount > 0 && selectedProduct) {
      selectedProduct["Price"] = openItemAmount;
      handleCloseModal();
      openDrawerOrAddProductToCart(selectedProduct);
    }
  };

  return (
    <div style={{ height: "90vh", background: "rgb(250, 250, 250)" }}>
      <Row
        style={{
          display: "flex",
          width: "100%",
          padding: "20px 10px 0px 10px",
          background: "#FAFAFA",
        }}
      >
        <ModalComponent
          title="Add Open Item Price"
          isModalVisible={isModalOpen}
          handleCancel={handleCloseModal}
          handleOk={handleOpenItemPrice}
          okText="Add to list"
          cancelText="Close"
          closable={true}
        >
          <Col span={24}>
            <FormTextField
              colSpan={24}
              isNumber="true"
              label="Open Item Price"
              value={openItemAmount}
              name="Price"
              onChange={(event) => setOpenItemAmount(event.value)}
              placeholder="Price"
            />
          </Col>
        </ModalComponent>
        <FormTextField
          colSpan={14}
          placeholder="Search Product"
          size="large"
          prefix={<SearchOutlined />}
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.value)}
          onPressEnter={(e) => e.preventDefault()}
        />
        <FormTextField
          colSpan={10}
          placeholder="Search Barcode"
          size="large"
          prefix={<SearchOutlined />}
          value={searchBarcode}
          onChange={(e) => setSearchBarcode(e.value)}
          onPressEnter={() => searcWithBarcode(searchBarcode)}
          // onBlur={() => searcWithBarcode(searchBarcode)}
        />
      </Row>
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
        {posState.selectedCategory !== 0 &&
          posState.selectedCategory !== null &&
          renderList
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
                    height: "240px",
                    background: "#FFFFFF",
                    borderRadius: "5px",
                    border: "1px solid rgb(0 0 0 / 20%)",
                  }}
                  onClick={() => {
                    if (menu.IsOpen === true) {
                      setSelectedProduct(menu);
                      setIsModalOpen(!isModalOpen);
                    } else {
                      openDrawerOrAddProductToCart(menu);
                    }
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
                            : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
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
                    </div>
                  }
                >
                  <Meta
                    title={menu.ProductDetailName}
                    style={{
                      fontWeight: 200,
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
