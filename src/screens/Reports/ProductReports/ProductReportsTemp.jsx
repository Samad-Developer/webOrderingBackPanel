import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import ProductCostingReport from "./ProductCostingReport";

const ProductReportsTemp = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openModalAndSetItem = (item) => {
    setIsModalOpen(true);
    setSelectedItem(item);
  };

  const thCss = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    color: "black",
  };
  const thCssHead = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    background: "#4561b9",
    color: "white",
    fontWeight: "bold",
  };
  const headRow = {
    display: "table-row",
    fontWeight: "900",
    color: "#ffffff",
  };

  return (
    <div
      style={{
        // border: '1px solid gray',
        padding: 20,
        pagebreakinside: "avoid",
        background: "white",
        margin: "10px 0px",
      }}
    >
      {isModalOpen && (
        <ProductCostingReport
          isModalVisible={isModalOpen}
          selectedItem={selectedItem}
          handleCancel={toggleModal}
        />
      )}
      <table
        //   className="table"
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={8}>
            <Title level={4} style={{ textAlign: "center" }}>
              Product Report
            </Title>
          </td>
        </tr>
        <tr>
          <td colSpan={8}>
            <Title level={5} style={{ textAlign: "center" }}>
              {`Date From:${props.DateFrom} `}{" "}
              {props.DateTo ? `- Date To:${props.DateTo}` : null}
            </Title>
          </td>
        </tr>
        <tr style={headRow}>
          <td style={thCssHead}>Department</td>
          <td style={thCssHead}>Category</td>
          <td style={thCssHead}>Product</td>
          <td style={thCssHead}>Size</td>
          <td style={thCssHead}>Variant</td>
          <td style={thCssHead}>Quantity</td>
          <td style={thCssHead}>Price Without GST</td>
          {/* <td style={thCssHead}>Tax</td> */}
          <td style={thCssHead}>Amount</td>
        </tr>
        {props?.html?.map((row) => {
          return (
            <tr>
              <td style={thCss}> {row?.Department}</td>
              <td style={thCss}> {row?.Category} </td>
              <td style={thCss}>{row?.Product}</td>
              <td style={thCss}> {row?.Size}</td>
              <td style={thCss}> {row?.Variant}</td>
              <td style={thCss}> {row?.Quantity}</td>
              <td style={thCss}> {row?.PriceWithoutGST.toFixed(2)} </td>
              {/* <td style={thCss}> {row?.Tax?.toFixed(2) || 0}</td> */}
              <td style={thCss}> {row?.Amount?.toFixed(2)}</td>
            </tr>
          );
        })}
        <tr>
          <td colSpan={6} style={thCss}>
            Total
          </td>
          <td style={thCss}>
            {props.html
              .reduce((sum, next) => sum + next?.PriceWithoutGST, 0)
              .toFixed(2)}
          </td>

          <td style={thCss}>
            {props.html.reduce((sum, next) => sum + next?.Amount, 0).toFixed(2)}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default ProductReportsTemp;
