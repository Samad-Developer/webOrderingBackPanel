import { Button, Card, Row } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { Fragment, useState } from "react";
import { useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "../specificComponents/ComponentToPrint";

const ReportPdfDownload = ({
  elementId,
  fileName,
  htmlFile,
  getReportFunc,
  fieldPanel,
  docType = "a4",
  direction = "p",
  docWidth = "210mm",
  disablePDF,
}) => {
  const [displayRep, setDisplayRep] = useState("none");
  let componentRef = useRef();

  useEffect(() => {
    if (displayRep === "block") {
      const elem = document.getElementById("report1");
      html2canvas(elem).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF(direction, "pt", docType);
        pdf.addImage(imgData, "JPEG", 10, 50);
        pdf.save(`${fileName}`);
      });
    }
    setDisplayRep("none");
  }, [displayRep]);

  const downloadPdf = () => {
    setDisplayRep("block");
  };
  const pageStyle = `{
    @media print {
   *{
    padding:10px;
    margin:10px
  }
 
}
  }`;

  return (
    <div style={{ padding: 20 }}>
      <form onSubmit={getReportFunc}>
        <Card>
          <Row gutter={[8, 8]} style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "flex-end",
                height: "100%",
              }}
            >
              <div>{fieldPanel && fieldPanel}</div>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 10 }}
              >
                Get Report
              </Button>
            </div>
          </Row>
          <div
            style={{ margin: "10px 0", borderTop: "1px solid lightgray" }}
          ></div>
        </Card>
      </form>
      <br />
      {htmlFile !== ("" || null) && (
        <Fragment>
          {/* <Button type="default" onClick={downloadPdf} disabled={disablePDF}>
            Download PDF
          </Button> */}
          <div>
            {/* button to trigger printing of target component */}

            <ReactToPrint
              trigger={() => <Button>Print PDF</Button>}
              content={() => componentRef}
              pageStyle={pageStyle}
            />

            {/* component to be printed */}
            <div style={{ display: "none" }}>
              <ComponentToPrint
                ref={(el) => (componentRef = el)}
                Bill={htmlFile}
              />
            </div>
          </div>
          <br />
          <br />
          <div dangerouslySetInnerHTML={{ __html: htmlFile }}></div>
          <div
            id="report1"
            style={{ width: docWidth, display: displayRep }}
            dangerouslySetInnerHTML={{ __html: htmlFile }}
          ></div>
        </Fragment>
      )}
    </div>
  );
};

export default ReportPdfDownload;
