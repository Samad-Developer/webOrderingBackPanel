import { Button, Card, Col, Input, Row, Typography } from "antd";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { POS_TOKEN } from "../../common/SetupMasterEnum";
import FormSelect from "../../components/general/FormSelect";
import { INPUT_SIZE, PRIMARY_COLOR } from "../../common/ThemeConstants";
import Barcode from "react-barcode";
import FormTextField from "../../components/general/FormTextField";
import { PrinterFilled } from "@ant-design/icons";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import ComponentToPrint from "../../components/specificComponents/ComponentToPrint";
import ModalComponent from "../../components/formComponent/ModalComponent";
import { postRequest } from "../../services/mainApp.service";
import Title from "antd/lib/typography/Title";
import FormCheckbox from "../../components/general/FormCheckbox";
import { AiOutlineCloseCircle } from "react-icons/ai";

const BarcodeList = () => {
  //   const [bulkModal, setBulkModal] = useState(false);
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const componentRef = React.useRef(null);
  const [products, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [htmlState, setHtmlState] = useState("");
  const [printModal, setPrintModal] = useState(false);
  const [barcodeParam, setBarcodeParam] = useState({
    height: 25,
    width: 1.1,
  });
  const [enableHeightWidth, setEnableHightWidth] = useState(false);

  useEffect(() => {
    const data = {
      CompanyId: userData.CompanyId,
    };
    postRequest("/CrudGetProductForBarcode", data, controller).then((e) => {
      setProduct(e.data.DataSet.Table);
    });
  }, []);

  const handleSelectChange = (data) => {
    const filterProduct = products.filter(
      (e) => e.ProductDetailId === data.value
    );
    setSelectedProduct(data.value);
    const alredyExist = selectedProducts.filter(
      (r) => r.ProductDetailId === data.value
    );
    if (filterProduct.length > 0 && alredyExist.length === 0) {
      const index = products.findIndex((p) => p.ProductDetailId === data.value);
      const foundProduct = products[index];
      setSelectedProducts([...selectedProducts, { ...foundProduct, qty: 1 }]);
    }
  };

  const handleSelectedProductsChange = (data, i) => {
    let cloneOfSelectedProducts = [...selectedProducts];
    cloneOfSelectedProducts[i].qty = data.target.value;
    setSelectedProducts([...cloneOfSelectedProducts]);
  };

  const handleHightWidthChange = (data) => {
    if (data.name === "enableHeightWidth") {
      setEnableHightWidth(data.value);
    } else {
      setBarcodeParam({
        ...barcodeParam,
        [data.name]: data.value,
      });
    }
  };

  const printBarCode = (html, handlePrint) => {
    const setHtml = new Promise((resolutionFunc, rejectionFunc) => {
      const htmlText = document.getElementById("printBarcodes").innerHTML;
      setHtmlState(htmlText);
      resolutionFunc("Resolved");
    });
    setHtml.then((e) => {
      handlePrint();
    });
  };

  return (
    <>
      <div style={{ margin: 5 }}>
        <Title level={3} style={{ color: '#4561B9' }}>
          Barcode
        </Title>
        <div
          style={{
            background: "white",
            padding: 15,
            boxShadow: "0 0 5px lightgray",
            borderRadius: 2,
          }}
        >
          <div>
            <Row gutter={[8, 8]} style={{ width: "100%", padding: 10, }}>
              <Col>
                {/* <FormTextField
                  colSpan={24}
                  // placeholder="Username"
                  name="height"
                  label="Height"
                  value={barcodeParam.height}
                  onChange={handleHightWidthChange}
                  required={true}
                  size={INPUT_SIZE}
                  className="textInput"
                  disabled={enableHeightWidth}
                /> */}
                <p className="mb-0">Height </p>
                <Input
                  colSpan={4}
                  required={true}
                  value={barcodeParam.height}
                  onChange={(e) =>
                    handleHightWidthChange({
                      name: "height",
                      value: e.target.value,
                    })
                  }
                  type="number"
                  min={1}
                  onKeyPress={(e) => {
                    if (
                      e.code === "Minus" ||
                      e.code === "NumpadSubtract" ||
                      e.code === "NumpadAdd"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  disabled={!enableHeightWidth}
                />
              </Col>
              <Col>
                {/* <FormTextField
                  colSpan={24}
                  // placeholder="Username"
                  name="width"
                  label="Width"
                  value={barcodeParam.width}
                  onChange={handleHightWidthChange}
                  required={true}
                  size={INPUT_SIZE}
                  className="textInput"
                  disabled={enableHeightWidth}
                  isNumber="true"
                /> */}
                <p className="mb-0">Width</p>
                <Input
                  colSpan={4}
                  required={true}
                  value={barcodeParam.width}
                  onChange={(e) =>
                    handleHightWidthChange({ name: "width", value: e.target.value })
                  }
                  type="number"
                  min={1}
                  onKeyPress={(e) => {
                    if (
                      e.code === "Minus" ||
                      e.code === "NumpadSubtract" ||
                      e.code === "NumpadAdd"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  disabled={!enableHeightWidth}
                />
              </Col>
              <div className="ant-col ant-col-4 mt-26">
                <FormCheckbox
                  // colSpan={4}
                  name="enableHeightWidth"
                  label="Edit"
                  checked={enableHeightWidth}
                  onChange={handleHightWidthChange}
                />
              </div>
              <FormSelect
                colSpan={12}
                listItem={products.length && products}
                idName="ProductDetailId"
                valueName="ProductDetailName"
                size={INPUT_SIZE}
                name="ProductDetailId"
                label="Product"
                value={selectedProduct || ""}
                onChange={handleSelectChange}
              />
            </Row>
            <div style={{ margin: "10px 0px", borderTop: "1px solid lightgray" }} ></div>
            <Row gutter={[8, 8]} style={{ width: "100%", padding: 10 }}>
              {selectedProducts.map((sp, i) => {
                return (
                  // <Col span={6}>
                  //   <Col style={{ display: "flex", flexDirection: "row" }}>
                  //     <Row>{sp.ProductDetailName}</Row>
                  //     <Button
                  //       onClick={() => {
                  //         let clone = [...selectedProducts];
                  //         clone.splice(i, 1);
                  //         setSelectedProducts([...clone]);
                  //       }}
                  //       style={{ marginLeft: 190 }}
                  //     >
                  //       X
                  //     </Button>
                  //   </Col>
                  //   {/* <FormTextField
                  //     colSpan={24}
                  //     // placeholder="Username"
                  //     name="qty"
                  //     label="Quantity"
                  //     value={sp.qty}
                  //     onChange={(e) => {
                  //       handleSelectedProductsChange(e, i);
                  //     }}
                  //     required={true}
                  //     size={INPUT_SIZE}
                  //     className="textInput"
                  //   /> */}
                  //   <p>Quantity</p>
                  //   <Input
                  //     required={true}
                  //     value={sp.qty}
                  //     onChange={(e) => handleSelectedProductsChange(e, i)}
                  //     type="number"
                  //     min={1}
                  //     onKeyPress={(e) => {
                  //       if (
                  //         e.code === "Minus" ||
                  //         e.code === "NumpadSubtract" ||
                  //         e.code === "NumpadAdd"
                  //       ) {
                  //         e.preventDefault();
                  //       }
                  //     }}
                  //   />
                  // </Col>
                  <Col span={6}>
                    <Row
                      style={{
                        minHeight: 170,
                        background: "#ebebeb",
                        padding: "12px",
                        borderRadius: 5,
                      }}
                    >
                      <Col span={20}>
                        <Typography.Text>{sp.ProductDetailName}</Typography.Text>
                      </Col>
                      <Col span={4} style={{ textAlignLast: "right" }}>
                        <Button
                          icon={
                            <AiOutlineCloseCircle
                              size={"large"}
                              color={PRIMARY_COLOR}
                            />
                          }
                          type="text"
                          onClick={() => {
                            let clone = [...selectedProducts];
                            clone.splice(i, 1);
                            setSelectedProducts([...clone]);
                          }}
                        ></Button>
                      </Col>
                      <Col span={24} style={{ position: "absolute", bottom: 0, width: "88%" }}>
                        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Col span={8}>
                            <div
                              style={{
                                position: "absolute",
                                width: "100%",
                                bottom: 0,
                              }}
                            >
                              <p style={{ marginBottom: 0 }}>Quantity</p>
                              <Input
                                required={true}
                                value={sp.qty}
                                onChange={(e) => handleSelectedProductsChange(e, i)}
                                type="number"
                                min={1}
                                onKeyPress={(e) => {
                                  if (
                                    e.code === "Minus" ||
                                    e.code === "NumpadSubtract" ||
                                    e.code === "NumpadAdd"
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          </Col>
                          <Col span={14}>
                            <div style={{ marginBottom: 2, textAlign: "right" }}>
                              <Barcode
                                height={
                                  Number.isNaN(barcodeParam.height) === false
                                    ? parseFloat(barcodeParam.height)
                                    : 0
                                }
                                width={
                                  Number.isNaN(barcodeParam.width) === false
                                    ? parseFloat(barcodeParam.width)
                                    : 0
                                }
                                fontSize={12}
                                value={sp.ProductCode}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                );
              })}
            </Row>
            {/* {new Array(10).fill("A").map((ev) => {
          return <p>ASDF</p>; //<Barcode value={ev} />;
        })} */}
            {/* <Row gutter={[8, 8]} style={{ width: "100%", padding: 10 }}>
          <Col span={6}>
            <Barcode
              height={
                Number.isNaN(barcodeParam.height) === false
                  ? parseFloat(barcodeParam.height)
                  : 0
              }
              width={
                Number.isNaN(barcodeParam.width) === false
                  ? parseFloat(barcodeParam.width)
                  : 0
              }
              fontSize={12}
              value={selectedProducts[0]?.ProductCode}
            />
          </Col>
        </Row> */}
            {/* <div id="printBarcodes">
          {selectedProducts.map((e) => {
            return new Array(e.qty).map((ev) => {
              return <Barcode value={e.barCode} />;
            });
          })}
        </div> */}
            <div style={{ margin: "10px 0px", borderTop: "1px solid lightgray" }} ></div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="text"
                onClick={() => setPrintModal(true)}
                icon={<PrinterFilled className="blueIcon" />}
              >
                View Print
              </Button>
            </div>
            <div style={{ display: "none" }}>
              {htmlState !== "" && (
                <ComponentToPrint ref={componentRef} Bill={htmlState} />
              )}
            </div>
          </div>
          <ModalComponent
            title="Barcodes"
            isModalVisible={printModal}
            footer={[
              <Button
                onClick={() => {
                  setPrintModal(false);
                }}
              >
                Cancel
              </Button>,
              <ReactToPrint content={() => componentRef.current}>
                <PrintContextConsumer>
                  {({ handlePrint }) => (
                    <Button
                      type="primary"
                      onClick={() => {
                        printBarCode("", handlePrint);
                      }}
                    >
                      Print
                    </Button>
                  )}
                </PrintContextConsumer>
              </ReactToPrint>,
            ]}
            width={"40vw"}
          >
            <div style={{ overflowY: "auto", height: "60vh" }} id="printBarcodes">
              {selectedProducts.map((e) => {
                if (parseInt(e.qty) > 0) {
                  return new Array(parseInt(e.qty)).fill(null).map((ev) => {
                    return (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <b style={{ fontSize: 10, marginTop: 10 }}>
                            {e.ProductDetailName}
                          </b>
                          <Barcode
                            value={e.ProductCode}
                            height={
                              Number.isNaN(barcodeParam.height) === false
                                ? parseFloat(barcodeParam.height)
                                : 0
                            }
                            width={
                              Number.isNaN(barcodeParam.width) === false
                                ? parseFloat(barcodeParam.width)
                                : 0
                            }
                            fontSize={12}
                          />
                        </div>
                      </div>
                    );
                  });
                }
              })}
            </div>
          </ModalComponent>
        </div>
      </div>
    </>
  );
};

export default BarcodeList;
