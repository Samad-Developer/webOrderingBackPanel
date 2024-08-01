import { PrinterFilled } from "@ant-design/icons";
import { Button, Col, Input, message, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import FormButton from "../../components/general/FormButton";
import FormSelect from "../../components/general/FormSelect";
import ComponentToPrint from "../../components/specificComponents/ComponentToPrint";
import { postRequest } from "../../services/mainApp.service";

const GenerateQRMenu = () => {
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const componentRef = React.useRef(null);
  const [htmlState, setHtmlState] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [QRSize, setQRSize] = useState(null);
  const [url, setURL] = useState("");
  const [QRValue, setQRValue] = useState("");

  useEffect(() => {
    const data = {
      OperationId: 1,
      CompanyId: userData.CompanyId,
    };
    postRequest("/GenerateQRMenu", data, controller).then((response) => {
      if (response.error === true) {
        message.error(response.errorMessage);
        return;
      }
      if (response.data.response === false) {
        message.error(response.DataSet.Table.errorMessage);
        return;
      }
      setBranchList(response.data.DataSet.Table);
      setURL(response.data.DataSet.Table1[0].UrlLink);
    });
  }, []);

  const toggleGenerateQR = () => {
    if (selectedBranch === null) {
      message.error("No branch selected");
      return;
    }
    setQRValue(url + selectedBranch + "/" + userData.CompanyId);
  };

  const printQRMenu = (html, handlePrint) => {
    const setHtml = new Promise((resolutionFunc, rejectionFunc) => {
      const htmlText = document.getElementById("printQRMenu").innerHTML;
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
        <Title level={3} style={{ color: "#4561B9" }}>
          Generate QR Menu
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
            <Row gutter={[8, 8]} style={{ width: "100%", padding: 10 }}>
              <FormSelect
                listItem={branchList || []}
                colSpan={7}
                idName="BranchId"
                valueName="BranchName"
                size={INPUT_SIZE}
                className="textInput"
                label="Select Branch"
                value={selectedBranch?.BranchId}
                onChange={(e) => {
                  setSelectedBranch(e.value);
                  setQRValue(null);
                }}
              />
              <FormButton
                title="Generate QR"
                style={{ marginTop: "22px" }}
                type="primary"
                onClick={toggleGenerateQR}
              />
            </Row>
            <Row gutter={[8, 8]} style={{ width: "100%", padding: 10 }}>
              {/* <Col>
                <p className="mb-0">Height </p>
                <Input
                  colSpan={4}
                  required={true}
                  //   value={barcodeParam.height}
                  //   onChange={(e) =>
                  //     handleHightWidthChange({
                  //       name: "height",
                  //       value: e.target.value,
                  //     })
                  //   }
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
                  //   disabled={!enableHeightWidth}
                />
              </Col> */}
              <Col>
                <p className="mb-0">Size</p>
                <Input
                  colSpan={4}
                  required={true}
                  //   value={barcodeParam.width}
                  onChange={(e) => setQRSize(e.target.value)}
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
                  //   disabled={!enableHeightWidth}
                />
              </Col>
              {/* <div className="ant-col ant-col-4 mt-26">
                <FormCheckbox
                  // colSpan={4}
                  name="enableHeightWidth"
                  label="Edit"
                  //   checked={enableHeightWidth}
                  //   onChange={handleHightWidthChange}
                />
              </div> */}
            </Row>

            <div
              style={{ margin: "10px 0px", borderTop: "1px solid lightgray" }}
            ></div>
            {QRValue && selectedBranch !== null && (
              <Row gutter={[8, 8]} style={{ width: "100%", padding: 10 }}>
                <div id="printQRMenu">
                  <QRCode
                    ref={componentRef}
                    size={QRSize ? QRSize : 250}
                    value={QRValue}
                    style={{ margin: 15 }}
                  />
                </div>
              </Row>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <ReactToPrint content={() => componentRef.current}>
                <PrintContextConsumer>
                  {({ handlePrint }) => (
                    <Button
                      type="primary"
                      onClick={() => {
                        printQRMenu("", handlePrint);
                      }}
                    >
                      Print
                    </Button>
                  )}
                </PrintContextConsumer>
              </ReactToPrint>
            </div>
            <div style={{ display: "none" }}>
              {htmlState !== "" && (
                <ComponentToPrint ref={componentRef} Bill={htmlState} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateQRMenu;
