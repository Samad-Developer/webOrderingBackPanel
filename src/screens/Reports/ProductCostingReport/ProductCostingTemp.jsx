import Title from "antd/lib/typography/Title";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import React from "react";
import { Button } from "antd";
import { useState } from "react";

const ProductCostingTemp = (props) => {
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
      <table
        //   className="table"
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={9}>
            <Title level={4} style={{ textAlign: "center" }}>
              Product Costing Report
            </Title>
          </td>
        </tr>
        <tr>
          <td colSpan={9}>
            <Title level={5} style={{ textAlign: "center" }}>
              {props.branch}
            </Title>
          </td>
        </tr>
        <tr>
          <td colSpan={9}>
            <Title level={5} style={{ textAlign: "center" }}>
              {props.date}
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
          <td style={thCssHead}>Total Consumption Amount</td>
        </tr>
        {props?.html?.map((row) => {
          return (
            <tr onClick={() => openModalAndSetItem(row)}>
              <td style={thCss}> {row?.Department}</td>
              <td style={thCss}> {row?.Category} </td>
              <td style={thCss}>{row?.Product}</td>
              <td style={thCss}> {row?.Size}</td>
              <td style={thCss}> {row?.Variant}</td>
              <td style={thCss}> {row?.Quantity}</td>
              <td style={thCss}> {row?.PriceWithoutGST.toFixed(2)} </td>
              {/* <td style={thCss}> {row?.Tax?.toFixed(2) || 0}</td> */}
              <td style={thCss}> {row?.Amount?.toFixed(2)}</td>
              <td style={thCss}> {row?.TotalConsumptionAmount?.toFixed(2)}</td>
            </tr>
          );
        })}
        <tr>
          <td colSpan={7} style={thCss}>
            Total
          </td>

          <td style={thCss}>
            <b>
              {props.html
                .reduce((sum, next) => sum + next?.Amount, 0)
                .toFixed(2)}
            </b>
          </td>
          <td style={thCss}>
            <b>
              {props.html
                .reduce((sum, next) => sum + next?.TotalConsumptionAmount, 0)
                .toFixed(2)}
            </b>
          </td>
        </tr>
      </table>

      <ModalComponent
        title="Product Costing Report"
        isModalVisible={isModalOpen}
        footer={[<Button onClick={toggleModal}>Cancel</Button>]}
        width="60vw"
      >
        <div
          style={{
            padding: "0px 20px",
            pagebreakinside: "avoid",
            background: "white",
            margin: "10px 0px",
          }}
        >
          <table
            //   className="table"
            style={{ borderCollapse: "collapse", width: "100%" }}
            id="table-to-xls"
          >
            <tr>
              <td colSpan={8}>
                <Title level={4} style={{ textAlign: "center" }}>
                  Product Recipe Items NAME
                </Title>
              </td>
            </tr>
            <tr style={headRow}>
              <td style={thCssHead}>Category</td>
              <td style={thCssHead}>Ingredient</td>
              <td style={thCssHead}>Total Qty</td>
              <td style={thCssHead}>Unit</td>
              <td style={thCssHead}>Consume Price</td>
              <td style={thCssHead}>Consumption Amount</td>
            </tr>
            {props?.htmlDetail
              ?.filter(
                (x) => x?.ProductDetailId === selectedItem?.ProductDetailId
              )
              ?.map((row) => {
                return (
                  <tr>
                    <td style={thCss}> {row?.CategoryName}</td>
                    <td style={thCss}> {row?.IngredientName} </td>
                    <td style={thCss}> {row?.TotalQty}</td>
                    <td style={thCss}> {row?.UnitName}</td>
                    <td style={thCss}> {row?.ConsumeUnitPrice}</td>
                    <td style={thCss}>
                      {row?.TotalConsumptionAmount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
          </table>
        </div>
      </ModalComponent>
    </div>
  );
};

export default ProductCostingTemp;
