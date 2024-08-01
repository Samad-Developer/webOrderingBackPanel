import { Badge, Descriptions, Modal, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";

const itemDetail = (props) => {
  let { viewOrder, data, toggleNewViewOrder } = props;
  return (
    <Modal
    visible={viewOrder}
    onCancel={toggleNewViewOrder}
    footer={null}
    width={"60vw"}
  >
    <Spin spinning={data === null}>
      <div>
        <Title level={3}>Order Info</Title>
       
        <p> </p>
        <table>
          <tr>
            <td
              style={{
                background: "#f7f7f7",
                color: "black",
              }}
            >
              Product Name
            </td>
            <td
              style={{
                background: "#f7f7f7",
                color: "black",
              }}
            >
              Quantity
            </td>
            <td
              style={{
                background: "#f7f7f7",
                color: "black",
              }}
            >
              Discount
            </td>
            <td
              style={{
                background: "#f7f7f7",
                color: "black",
              }}
            >
              Amount
            </td>
          </tr>

          <tbody>
            {data?.Table1?.map((y) => (
              <tr>
                <td>{y.ProductDetailName}</td>
                <td>{y.Quantity}</td>
                <td>{y.DiscountPercent}</td>
                <td>{y.PriceWithGST}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Spin>
  </Modal>
  );
};

export default itemDetail;
