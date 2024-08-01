import { DELIVERY, DINE_IN } from "../../common/SetupMasterEnum";
import POSImage from "../../assets/images/pos.png";

export const generateKotTemplate = (
  orderItemList,
  KOTTemplate,
  selectedOrder,
  posState,
  userData
) => {
  let ordersToEmbad = [];
  orderItemList.map((item) => {
    ordersToEmbad.push(`<tr>
        <td
          style="
            padding: 2px 10px;
            text-align: left;
            vertical-align: middle;
            font-weight: 500;
            border: 0;
            color : #000;
            font-size: 10px;
          "
        >
          ${item.Quantity}
        </td>
        <td
          style="
          display: flex;
          flex-direction: row;
            padding: 2px 10px;
            text-align: left;
            vertical-align: middle;
            font-weight: 500;
            border: 0;
            color : #000;
            font-size: 10px;
          "
        >
          ${item.ProductName}
        </td>
        <td>
        <p style="
        display: flex;
          font-weight: 500;
          color : #000;
          font-size: 10px;
        " >
        ${item.Type}
        </p>
        </td>
      </tr>`);
  });
  ordersToEmbad = ordersToEmbad.join(" ");

  let cloneHTMLTemp = KOTTemplate.replace("{itemBody}", ordersToEmbad);

  if (selectedOrder.OrderModeId === DELIVERY) {
    cloneHTMLTemp = cloneHTMLTemp.replace(
      "{embadFields}",
      `
      <tr>
        <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
          Rider
        </th>
        <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
          ${posState.riderName}
        </th>
      </tr>
      `
    );
  } else {
    cloneHTMLTemp = cloneHTMLTemp.replace("{embadFields}", ``);
  }

  cloneHTMLTemp = parseString(cloneHTMLTemp, selectedOrder, userData);

  return cloneHTMLTemp;
};

const parseString = (value, record, userData) => {
  let cloneTempString = value.replace(
    /{companyName}/g,
    userData.companyList[0].CompanyName
  );
  cloneTempString = cloneTempString.replace(/{orderMode}/g, record.OrderMode);
  cloneTempString = cloneTempString.replace(
    /{address}/g,
    record.CompanyAddress
  );
  cloneTempString = cloneTempString.replace(
    /{orderNumber}/g,
    record.OrderNumber
  );
  cloneTempString = cloneTempString.replace(/{orderDate}/g, record.OrderDate);
  cloneTempString = cloneTempString.replace(
    /{orderDateTime}/g,
    record.OrderDateTime
  );
  cloneTempString = cloneTempString.replace(/{orderMode}/g, record.OrderMode);
  cloneTempString = cloneTempString.replace(/{orderTable}/g, record.OrderTable);
  cloneTempString = cloneTempString.replace(/{orderCover}/g, record.OrderCover);
  cloneTempString = cloneTempString.replace(
    /{phoneNumber}/g,
    record.CompanyPhoneNumber
  );

  const date =
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1) +
    "-" +
    new Date().getDate();

  const time = new Date().toLocaleTimeString();

  cloneTempString = cloneTempString.replace(/{billDate}/g, date);
  cloneTempString = cloneTempString.replace(/{billTime}/g, time);
  cloneTempString = cloneTempString.replace(
    /{orderWaiter}/g,
    record.WaiterName
  );
  cloneTempString = cloneTempString.replace(
    /{companyWebsite}/g,
    record.CompanyWebsite
  );
  cloneTempString = cloneTempString.replace(
    /{companyFBPage}/g,
    record.CompanyFBPage
  );
  cloneTempString = cloneTempString.replace(
    /{companyWhatsApp}/g,
    record.CompanyWhatsApp
  );
  cloneTempString = cloneTempString.replace(/{gstPercent}/g, record.GSTPercent);
  cloneTempString = cloneTempString.replace(
    /{productSubtotal}/g,
    parseFloat(record.TotalAmountWithoutGST).toFixed(2)
  );
  cloneTempString = cloneTempString.replace(
    /{productGst}/g,
    parseFloat(record.GSTAmount).toFixed(2)
  );
  cloneTempString = cloneTempString.replace(
    /{discountAmount}/g,
    parseFloat(record.DiscountAmount).toFixed(2)
  );

  cloneTempString = cloneTempString.replace(
    /{productNetBill}/g,
    parseFloat(
      record.TotalAmountWithGST +
        record.AdditionalServiceCharges -
        record.DiscountAmount
    ).toFixed(2)
  );

  cloneTempString = cloneTempString.replace(
    /{totalAmount}/g,
    parseFloat(
      record.TotalAmountWithGST + record.AdditionalServiceCharges
    ).toFixed(2)
  );

  cloneTempString = cloneTempString.replace(
    /{companyLogo}/g,
    record.CompanyLogo
  );

  return cloneTempString;
};

export const generateBillTemplate = (
  orderItems,
  cloneHTMLTemp,
  record,
  userData,
  selectedOrder
) => {
  let orderToEmbad = [];

  orderItems.map((item) => {
    orderToEmbad.push(`<tr>
     <td
       style="
       padding: 2px 10px;
       text-align: left;
       vertical-align: middle;
       font-weight: 500;
       border: 0;
       color : #000;
       font-size: 10px;
       "
     >
       ${item.Quantity}
     </td>
     <td
       style="
       padding: 2px 10px;
       text-align: left;
       vertical-align: middle;
       font-weight: 500;
       border: 0;
       color : #000;
       font-size: 10px;
       "
     >
       ${item.ProductDetailName}
     </td>
     <td
       style="
       padding: 2px 10px;
       text-align: right;
       vertical-align: middle;
       font-weight: 500;
       border: 0;
       color : #000;
       font-size: 10px;
       "
     >
       ${parseFloat(item.PriceWithoutGST).toFixed(2)}
     </td>
   </tr>`);
  });
  orderToEmbad = orderToEmbad.join(" ");

  cloneHTMLTemp = cloneHTMLTemp.replace("{itemBody}", orderToEmbad);
  if (record.OrderModeId === DINE_IN) {
    cloneHTMLTemp = cloneHTMLTemp.replace(
      "{embadFields}",
      `
      <tr>
      <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
      Table:
      </th>
      <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
      ${record.TableName !== null ? record.TableName : ""}
      </th>
      </tr>
      <tr>
      <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
      Waiter:</th>
      <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
        ${record.WaiterName !== null ? record.WaiterName : ""}
        </th>
        </tr>
        ${
          selectedOrder.CustomerName !== undefined
            ? `
            <tr>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
            Customer:</th>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
        ${selectedOrder.CustomerName}</th>
          </tr>
        `
            : ``
        }
        ${
          selectedOrder.PhoneNumber !== undefined
            ? `
            <tr>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
            Phone:</th>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
        ${selectedOrder.PhoneNumber}</th>
          </tr>
          `
            : ``
        }
        ${
          selectedOrder.Address !== undefined
            ? `
            <tr>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
            ${selectedOrder.Address}</th>
          </tr>
          `
            : ``
        }
        `
    );
  }

  cloneHTMLTemp = parseString(cloneHTMLTemp, record, userData);
  return cloneHTMLTemp;
};

export const generateSaleReceipt = (
  cloneHTMLTemp,
  selectedOrder,
  orderItems,
  payments,
  returnAmount,
  userData,
  posState
) => {
  let netBillStr;
  let additionalChargesStr;
  let deliveryChargesStr;
  let paymentTypeStr;
  let finalStr;

  additionalChargesStr = `<tr>
  <td style="vertical-align: middle; font-weight: 300; border: 0; font-weight: 500;
  color : #000;">
    Service Charges
  </td>
  <td
    style="
      text-align: right;
      vertical-align: middle;
      font-weight: 300;
      border: 0;
      font-weight: 500;
      color : #000;
    "
  >
    ${parseFloat(selectedOrder.AdditionalServiceCharges).toFixed(2)}
  </td>
</tr>
`;

  if (selectedOrder.OrderModeId === DINE_IN) {
    cloneHTMLTemp = cloneHTMLTemp.replace(
      "{embadFields}",
      `
      <tr>
        <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
          Table:
        </th>
        <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
          ${selectedOrder.TableName !== null ? selectedOrder.TableName : ""}
        </th>
      </tr>
      <tr>
        <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
          Waiter:
        </th>
        <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
          ${selectedOrder.WaiterName !== null ? selectedOrder.WaiterName : ""}
        </th>
      </tr>    
      ${
        selectedOrder.CustomerName !== undefined
          ? `
          <tr>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
              Customer:
            </th>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
              ${selectedOrder.CustomerName}
            </th>
          </tr>
      `
          : ``
      }
      ${
        selectedOrder.PhoneNumber !== undefined
          ? `
          <tr>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
              Phone:
            </th>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
              ${selectedOrder.PhoneNumber}
            </th>
          </tr>
        `
          : ``
      }
      ${
        selectedOrder.Address !== undefined
          ? `
          <tr>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
              ${selectedOrder.Address}
            </th>
          </tr>
        `
          : ``
      }

      `
    );
  } else if (selectedOrder.OrderModeId === DELIVERY) {
    cloneHTMLTemp = cloneHTMLTemp.replace(
      "{embadFields}",
      `
          <tr>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
              Rider
            </th>
            <th style="text-align: right; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
            ${
              posState.selectedOrder.RiderName !== null
                ? posState.selectedOrder.RiderName
                : ``
            }
            </th>
          </tr>

      ${
        selectedOrder.CustomerName !== undefined
          ? `
          <tr>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
              Customer
            </th>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
              ${selectedOrder.CustomerName}
            </th>
          </tr>
      `
          : ``
      }
  ${
    selectedOrder.PhoneNumber !== undefined
      ? `
          <tr>
          <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
          Phone
            </th>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
              ${selectedOrder.PhoneNumber}
            </th>
          </tr>
        `
      : ``
  }
      ${
        selectedOrder.Address !== undefined
          ? `
            <tr>
            <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
            ${selectedOrder.Address}
              </th>
            </tr>
        `
          : ``
      }

      `
    );
  } else {
    cloneHTMLTemp = cloneHTMLTemp.replace("{embadFields}", ``);
  }

  let orderToEmbad = [];

  orderItems.map((item) => {
    orderToEmbad.push(`<tr>
   <td
     style="
     padding: 2px 10px;
     text-align: left;
     vertical-align: middle;
     font-weight: 500;
     border: 0;
     color : #000;
     font-size: 10px;
     "
   >
     ${item.Quantity}
   </td>
   <td
     style="
     padding: 2px 10px;
     text-align: left;
     vertical-align: middle;
     font-weight: 500;
     border: 0;
     color : #000;
     font-size: 10px;
     "
   >
     ${item.ProductDetailName}
   </td>
   <td
     style="
     padding: 2px 10px;
     text-align: right;
     vertical-align: middle;
     font-weight: 500;
     border: 0;
     color : #000;
     font-size: 10px;
     "
   >
     ${parseFloat(item.PriceWithoutGST).toFixed(2)}
   </td>
 </tr>`);
  });
  orderToEmbad = orderToEmbad.join(" ");

  cloneHTMLTemp = cloneHTMLTemp.replace("{itemBody}", orderToEmbad);
  if (
    selectedOrder.OrderModeId === DELIVERY &&
    selectedOrder.DeliveryCharges > 0 &&
    selectedOrder.DeliveryCharges !== null
  ) {
    paymentTypeStr =
      payments.length > 0 &&
      `<tr>
    <td style="vertical-align: middle; font-weight: 300; border: 0;font-weight: 500; color : #000;">
      ${payments[0].PaymentName}:
    </td>
    <td
      style="
        text-align: right;
        vertical-align: middle;
        font-weight: 300;
        border: 0;
        font-weight: 500;
        color : #000;
      "
    >
      ${payments[0].ReceivedAmount}
    </td>
  </tr>
  ${
    payments.length === 2
      ? `<tr>
  <td style="vertical-align: middle; font-weight: 300; border: 0;font-weight: 500;color : #000;">
    ${payments[1].PaymentName}:
  </td>
  <td
    style="
      text-align: right;
      vertical-align: middle;
      font-weight: 300;
      border: 0;
      font-weight: 500;
      color : #000;
    "
  >
    ${payments[1].ReceivedAmount}
  </td>
</tr>`
      : ""
  }
<tr>
<td style="vertical-align: middle; font-weight: 300; border: 0;             font-weight: 500;
color : #000;">
  Returned Amount:
</td>
<td
  style="
    text-align: right;
    vertical-align: middle;
    font-weight: 300;
    border: 0;
    font-weight: 500;
    color : #000;
  "
>
  ${returnAmount}
</td>
</tr>
      `;

    cloneHTMLTemp = cloneHTMLTemp.replace(/Net Bill:/g, "Total:");
    deliveryChargesStr = `<tr>
        <td style="vertical-align: middle; font-weight: 300; border: 0; font-weight: 500;
        color : #000;">
          Delivery Charges
        </td>
        <td
          style="
            text-align: right;
            vertical-align: middle;
            font-weight: 300;
            border: 0;
            font-weight: 500;
            color : #000;
          "
        >
          ${parseFloat(selectedOrder.DeliveryCharges).toFixed(2)}
        </td>
      </tr>
      `;
    netBillStr = `
    <tr>
    <td style="vertical-align: middle; font-weight: 300; border: 0; font-weight: 500;
    color : #000;">
      Net Bill:
    </td>
    <td
      style="
        text-align: right;
        vertical-align: middle;
        font-weight: 300;
        border: 0;
        font-weight: 500;
        color : #000;
      "
    >
      ${parseFloat(
        posState.selectedOrder.DeliveryCharges +
          posState.selectedOrder.TotalAmountWithGST
      ).toFixed(2)}
    </td>
    </tr>`;
    finalStr = deliveryChargesStr + netBillStr + paymentTypeStr;
  } else {
    paymentTypeStr =
      payments.length > 0 &&
      `<tr>
  <td style="vertical-align: middle; font-weight: 300; border: 0;font-weight: 500; color : #000;">
    ${payments[0].PaymentName}:
  </td>
  <td
    style="
      text-align: right;
      vertical-align: middle;
      font-weight: 300;
      border: 0;
      font-weight: 500;
      color : #000;
    "
  >
    ${payments[0].ReceivedAmount}
  </td>
</tr>
${
  payments.length === 2
    ? `<tr>
<td style="vertical-align: middle; font-weight: 300; border: 0;font-weight: 500;color : #000;">
  ${payments[1].PaymentName}:
</td>
<td
  style="
    text-align: right;
    vertical-align: middle;
    font-weight: 300;
    border: 0;
    font-weight: 500;
    color : #000;
  "
>
  ${payments[1].ReceivedAmount}
</td>
</tr>`
    : ""
}
<tr>
<td style="vertical-align: middle; font-weight: 300; border: 0;             font-weight: 500;
color : #000;">
Returned Amount:
</td>
<td
style="
  text-align: right;
  vertical-align: middle;
  font-weight: 300;
  border: 0;
  font-weight: 500;
  color : #000;
"
>
${returnAmount}
</td>
</tr>
      `;
    finalStr = paymentTypeStr;
  }

  let qr = document.getElementById("qr-code-container").innerHTML;
  cloneHTMLTemp = cloneHTMLTemp.replace(
    "{fbrIntegration}",
    `<div style="display:flex; justify-content:space-between; align-items:center; margin:20px 5px">
      <div><image style="width:50px; height:auto" src="${POSImage}"/></div>
      <div style="display:flex; flex-direction:column; text-align:center">
      <span>FBR Invoice Number</span>
      <span>0119293939103</span>
      </div>
      <div>${qr}</div>
    </div>`
  );
  let CloneTemplate = cloneHTMLTemp.replace(/{finalBill}/g, finalStr);

  CloneTemplate = CloneTemplate.replace(/PRE-PAYMENT BILL/g, "Sale Recipt");
  CloneTemplate = CloneTemplate.replace(/{beforeBill}/g, additionalChargesStr);

  CloneTemplate = parseString(CloneTemplate, selectedOrder, userData);

  return CloneTemplate;
};
