import { Button } from "antd";
import React, { Component } from "react";
import { useRef } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactToPrint from "react-to-print";
import TestComponentToPrint from "../specificComponents/TestCompToPrint";

const ReportExcelDownload = (props) => {
  let componentRef = useRef();
  const pageStyle = `{
      @media print {
     *{
      padding:10px;
      margin:10px;
      page-break-inside:avoid;
      width:100%
    }
  }
    }`;
  return (
    <div>
      {!props.hidePdf && (
        <>
          <ReactToPrint
            trigger={() => <Button>Download PDF</Button>}
            content={() => componentRef}
            pageStyle={pageStyle}
          />

          <div style={{ display: "none" }}>
            <TestComponentToPrint
              ref={(el) => (componentRef = el)}
              Bill={<div style={{ width: "inherit" }}>{props.children}</div>}
            />
          </div>
        </>
      )}
      {/* download-table-xls-button */}
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="ant-btn ant-btn-default"
        table="table-to-xls"
        filename={props.fileName}
        sheet="tablexls"
        buttonText="Download Excel"
      />
      {props.children}
    </div>
  );
};

export default ReportExcelDownload;
