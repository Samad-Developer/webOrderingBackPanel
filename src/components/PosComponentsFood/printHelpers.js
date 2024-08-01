import {
  CASHIER,
  DELIVERY,
  DINE_IN,
  DUPLICATE_SALE_RECIEPT,
  TAKE_AWAY,
} from "../../common/SetupMasterEnum";
import POSImage from "../../assets/images/pos.png";
import { useSelector } from "react-redux";
import { getDate, getFullTime } from "../../functions/dateFunctions";
import { isNullValue } from "../../functions/generalFunctions";
import FBRImage from "../../assets/images/pos.png";
import SRBImage from "../../assets/images/srbPOS.png";

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

  let cloneHTMLTemp = KOTTemplate?.replace("{itemBody}", ordersToEmbad);

  if (selectedOrder.OrderModeId === DELIVERY) {
    cloneHTMLTemp = cloneHTMLTemp?.replace(
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
    cloneHTMLTemp = cloneHTMLTemp?.replace("{embadFields}", ``);
  }

  cloneHTMLTemp = parseString(cloneHTMLTemp, selectedOrder, userData);

  return cloneHTMLTemp;
};

const parseString = (value, record, userData) => {
  let cloneTempString = value?.replace(
    /{companyName}/g,
    userData.companyList[0].CompanyName
  );
  cloneTempString = cloneTempString?.replace(/{orderMode}/g, record.OrderMode);
  cloneTempString = cloneTempString?.replace(
    /{address}/g,
    record.CompanyAddress
  );
  cloneTempString = cloneTempString?.replace(
    /{orderNumber}/g,
    record.OrderNumber
  );
  cloneTempString = cloneTempString?.replace(/{orderDate}/g, record.OrderDate);
  cloneTempString = cloneTempString?.replace(
    /{orderDateTime}/g,
    record.OrderDateTime
  );
  cloneTempString = cloneTempString?.replace(/{orderMode}/g, record.OrderMode);
  cloneTempString = cloneTempString?.replace(
    /{orderTable}/g,
    record.OrderTable
  );
  cloneTempString = cloneTempString?.replace(
    /{orderCover}/g,
    record.OrderCover
  );
  cloneTempString = cloneTempString?.replace(
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

  // cloneTempString = cloneTempString?.replace(/{billDate}/g, date);
  // cloneTempString = cloneTempString?.replace(/{billTime}/g, time);
  cloneTempString = cloneTempString?.replace(
    /{orderWaiter}/g,
    record.WaiterName
  );
  cloneTempString = cloneTempString?.replace(
    /{companyWebsite}/g,
    record.CompanyWebsite
  );
  cloneTempString = cloneTempString?.replace(
    /{companyFBPage}/g,
    record.CompanyFBPage
  );
  cloneTempString = cloneTempString?.replace(
    /{companyWhatsApp}/g,
    record.CompanyWhatsApp
  );
  cloneTempString = cloneTempString?.replace(
    /{gstPercent}/g,
    record.GSTPercent
  );
  cloneTempString = cloneTempString?.replace(
    /{productSubtotal}/g,
    parseFloat(record.TotalAmountWithoutGST).toFixed(2)
  );
  cloneTempString = cloneTempString?.replace(
    /{productGst}/g,
    parseFloat(record.GSTAmount).toFixed(2)
  );
  cloneTempString = cloneTempString?.replace(
    /{discountAmount}/g,
    parseFloat(record.DiscountAmount).toFixed(2)
  );

  cloneTempString = cloneTempString?.replace(
    /{productNetBill}/g,
    parseFloat(
      record.TotalAmountWithGST +
        record.AdditionalServiceCharges -
        record.DiscountAmount
    ).toFixed(2)
  );

  cloneTempString = cloneTempString?.replace(
    /{totalAmount}/g,
    parseFloat(
      record.TotalAmountWithGST + record.AdditionalServiceCharges
    ).toFixed(2)
  );

  cloneTempString = cloneTempString?.replace(
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

  cloneHTMLTemp = cloneHTMLTemp?.replace("{itemBody}", orderToEmbad);
  if (record.OrderModeId === DINE_IN) {
    cloneHTMLTemp = cloneHTMLTemp?.replace(
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

  if (userData?.RoleId === CASHIER) {
    cloneHTMLTemp =
      userData?.userBranchList[0].BranchAddress !== ""
        ? cloneHTMLTemp?.replace(
            "{{branchAddress}}",
            userData?.userBranchList[0].BranchAddress || ""
          )
        : "";
  }
  if (selectedOrder.OrderModeId === DINE_IN) {
    cloneHTMLTemp = cloneHTMLTemp?.replace(
      "{embadFields}",
      `
      ${
        [null, undefined, ""].includes(selectedOrder.TableName)
          ? ""
          : `<tr>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">Table:</th>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
                ${selectedOrder.TableName}
              </th>
            </tr>`
      }
      ${
        [null, undefined, ""].includes(selectedOrder.WaiterName)
          ? ""
          : `<tr>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">Waiter:</th>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
                ${selectedOrder.WaiterName}
              </th>
            </tr>`
      }
      ${
        [null, undefined, ""].includes(selectedOrder.CustomerName)
          ? ""
          : `<tr>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">Customer:</th>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
                ${selectedOrder.CustomerName}
              </th>
            </tr>`
      }
      ${
        [null, undefined, ""].includes(selectedOrder.PhoneNumber)
          ? ""
          : `<tr>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">Phone:</th>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
                ${selectedOrder.PhoneNumber}
              </th>
            </tr>`
      }
      ${
        [null, undefined, ""].includes(selectedOrder.Address)
          ? ""
          : `<tr>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">Address:</th>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
                ${selectedOrder.Address}
              </th>
            </tr>`
      }
      `
    );
  } else if (selectedOrder.OrderModeId === DELIVERY) {
    cloneHTMLTemp = cloneHTMLTemp?.replace(
      "{embadFields}",
      `
      ${
        [null, undefined, ""].includes(posState.selectedOrder.RiderName)
          ? ""
          : `<tr>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">Rider</th>
              <th style="text-align: right; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
                ${posState.selectedOrder.RiderName}
              </th>
            </tr>`
      }

      ${
        [null, undefined, ""].includes(selectedOrder.CustomerName)
          ? ""
          : `<tr>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">Customer</th>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
                ${selectedOrder.CustomerName}
              </th>
            </tr>
      `
      }
      ${
        [null, undefined, ""].includes(selectedOrder.PhoneNumber)
          ? ""
          : `<tr>
                <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">Phone</th>
                <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
                  ${selectedOrder.PhoneNumber}
                </th>
              </tr>`
      }
      ${
        [null, undefined, ""].includes(selectedOrder.Address)
          ? ""
          : `<tr>
              <th style="text-align: left; font-weight: 500; border: 0; color: #000; padding: 0px; font-size: 12px; height: 20px; line-height: 14px;">
                ${selectedOrder.Address}
              </th>
            </tr>
        `
      }

      `
    );
  } else {
    cloneHTMLTemp = cloneHTMLTemp?.replace("{embadFields}", ``);
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

  cloneHTMLTemp = cloneHTMLTemp?.replace("{itemBody}", orderToEmbad);
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

    cloneHTMLTemp = cloneHTMLTemp?.replace(/Net Bill:/g, "Total:");
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
  cloneHTMLTemp = cloneHTMLTemp?.replace(
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
  let CloneTemplate = cloneHTMLTemp?.replace(/{finalBill}/g, finalStr);

  CloneTemplate = CloneTemplate?.replace(/PRE-PAYMENT BILL/g, "Sale Recipt");
  CloneTemplate = CloneTemplate?.replace(/{beforeBill}/g, additionalChargesStr);

  CloneTemplate = parseString(CloneTemplate, selectedOrder, userData);

  return CloneTemplate;
};

export const generateDuplicateSaleReceipt = (
  record,
  posState,
  template,
  userData
) => {
  let duplicateBillTemplate = posState?.templateList?.Table?.filter(
    (e) => e.TemplateTypeId == DUPLICATE_SALE_RECIEPT
  )[0]?.TemplateHtml; // HTMLBill;
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{branchAddress}",
    userData?.userBranchList[0].BranchAddress || ""
  );
  // duplicateBillTemplate = duplicateBillTemplate?.replace(
  //   "{fbrIntegration}",
  //   ""
  // );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{gstPercent}",

    `{${posState.selectedOrder.GSTPercent.toFixed(2)}%}`
  );
  if (posState.selectedOrder.OrderModeId === DELIVERY) {
    //  duplicateBillTemplate = duplicateBillTemplate?.replace(
    //   "{embadFields}",
    //   `<div style="display: flex; justify-content: space-between">
    //         <p style="margin: 3px 0; text-align: center">Rider:</p>
    //         <p style="margin: 3px 0; text-align: center">${posState.riderName}</p>
    //       </div>
    //       <div style="display: flex; justify-content: space-between">
    //         <p style="margin: 3px 0; text-align: center">Name:</p>
    //         <p style="margin: 3px 0; text-align: center">${selectedOrder.CustomerName}</p>
    //       </div>
    //       <div style="display: flex; justify-content: space-between">
    //         <p style="margin: 3px 0; text-align: center">Phone:</p>
    //         <p style="margin: 3px 0; text-align: center">${selectedOrder.PhoneNumber}</p>
    //       </div>
    //       <div style="display: flex; justify-content: flex-start">
    //         <p style="margin: 3px 0; text-align: left; font-size : 12px">${selectedOrder.Address}</p>
    //       </div>
    //       `
    // );

    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{customerName}",
      isNullValue(posState.selectedOrder.CustomerName) &&
        `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Customer:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.CustomerName}
            </td>
          </tr>`
    );

    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{address}",
      isNullValue(posState.selectedOrder.CompleteAddress)
        ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Address:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.CompleteAddress}
            </td>
          </tr>`
        : `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Address:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.Address}
            </td>
          </tr>`
    );

    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{phone}",
      isNullValue(posState.selectedOrder.PhoneNumber) &&
        `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Phone #:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.PhoneNumber}
            </td>
          </tr>`
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{rider}",
      isNullValue(posState.riderName)
        ? `<tr >
            <td style="text-align: left; font-weight: 500; border: 0; color: #000" >Rider:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.riderName}</td>
          </tr>`
        : `<tr></tr>`
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{waiter}",

      `<tr>
           
          </tr>`
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{table}",

      `<tr>
      </tr>`
    );
  } else if (posState.selectedOrder.OrderModeId === DINE_IN) {
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{customerName}",
      `<tr></tr>`
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{address}",
      "<tr></tr>"
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{phone}",
      "<tr></tr>"
    );

    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{rider}",
      `<tr>
           
          </tr>`
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{waiter}",
      isNullValue(posState.selectedOrder.WaiterName)
        ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Waiter:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.WaiterName}</td>
          </tr>`
        : `<tr></tr>`
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{table}",
      isNullValue(posState.selectedOrder.TableName)
        ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Table:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.TableName}</td>
          </tr>`
        : `<tr>
            
          </tr>`
    );
  } else if (posState.selectedOrder.OrderModeId === TAKE_AWAY) {
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{rider}",
      `<tr></tr>`
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{waiter}",

      `<tr></tr>`
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{table}",

      `<tr>
        </tr>`
    );

    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{customerName}",
      `<tr></tr>`
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{address}",
      "<tr></tr>"
    );
    duplicateBillTemplate = duplicateBillTemplate?.replace(
      "{phone}",
      "<tr></tr>"
    );
  }
  let orderItems = posState.seletedOrderItems
    .map(
      (item) =>
        `<tr>
      <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.Quantity}</td>
      <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.ProductDetailName}</td>
      <td style="text-align: right; font-weight: 500; border: 0; color: #000">${item.PriceWithoutGST}</td>
      </tr>`
    )
    .join(" ");
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{itemBody}",
    orderItems
  );

  let sumOfAllProducts = posState?.seletedOrderItems?.reduce(
    (sum, next) => sum + next?.PriceWithoutGST,
    0
  );
  let discountAmount = posState.seletedOrderItems.reduce(
    (sum, next) => sum + (next.PriceWithoutGST * next.DiscountPercent) / 100,
    0
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{productSubtotal}",
    sumOfAllProducts.toFixed(2)
  );
  // duplicateBillTemplate = prePaymentHelper(posState, duplicateBillTemplate);
  // duplicateBillTemplate = duplicateBillTemplate?.replace(
  //   "SALE RECEIPT",
  //   "Pre Payment Bill::"
  // );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{orderDateTime}",
    posState.selectedOrder.OrderDateTime.split("T")[0]
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{orderNumber}",
    posState.selectedOrder.OrderNumber
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{orderMode}",
    posState.selectedOrder.OrderMode
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{companyName}",
    userData.CompanyName
  );
  // duplicateBillTemplate = duplicateBillTemplate?.replace(
  //   "{billDate}",
  //   getDate()
  // );
  // duplicateBillTemplate = duplicateBillTemplate?.replace(
  //   "{billTime}",
  //   getFullTime(Date.now())
  // );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{gst}",

    posState.selectedOrder.GSTAmount.toFixed(2)
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{gstPercents}",

    `{${posState.selectedOrder.GSTPercent.toFixed(2)}%}`
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{productGst}",
    posState.selectedOrder.GSTPercent
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{totalAmount}",
    (sumOfAllProducts + posState.selectedOrder.GSTAmount).toFixed(2)
  );

  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{discountAmount}",
    discountAmount.toFixed(2)
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    "{productNetBill}",

    (
      sumOfAllProducts +
      posState.selectedOrder.GSTAmount +
      posState.selectedOrder.AdditionalServiceCharges +
      posState.selectedOrder.DeliveryCharges -
      discountAmount
    ).toFixed(2)
  );

  let deliveryChargesStr = ``;
  let additionalChargesStr = ``;
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
    ${parseFloat(posState.selectedOrder.AdditionalServiceCharges).toFixed(2)}
  </td>
</tr>
`;
  if (
    posState.selectedOrder.OrderModeId === DELIVERY &&
    posState.selectedOrder.DeliveryCharges > 0 &&
    posState.selectedOrder.DeliveryCharges !== null
  ) {
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
        ${parseFloat(posState.selectedOrder.DeliveryCharges).toFixed(2)}
      </td>
    </tr>`;
  }
  const arr = record.map((element) => {
    return `<tr>
    <td style="vertical-align: middle; font-weight: 300; border: 0; font-weight: 500;
    color : #000;">
      ${element.PaymentMode}:
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
      ${element.ReceivedAmount}
    </td>
  </tr>`;
  });
  deliveryChargesStr = deliveryChargesStr + arr.join("");
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    /PRE-PAYMENT BILL/g,
    "Duplicate Sale Recipt"
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    /{finalBill}/g,
    deliveryChargesStr
  );
  duplicateBillTemplate = duplicateBillTemplate?.replace(
    /{beforeBill}/g,
    additionalChargesStr
  );

  return duplicateBillTemplate;
};

export const prePaymentHelper = (posState, template) => {
  let deliveryChargesStr = ``;
  let additionalChargesStr = ``;
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
      ${parseFloat(posState.selectedOrder.AdditionalServiceCharges).toFixed(2)}
    </td>
  </tr>
  `;
  if (
    posState.selectedOrder.OrderModeId === DELIVERY &&
    posState.selectedOrder.DeliveryCharges > 0 &&
    posState.selectedOrder.DeliveryCharges !== null
  ) {
    template = template?.replace(/Net Bill:/g, "Total:");
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
        ${parseFloat(posState.selectedOrder.DeliveryCharges).toFixed(2)}
      </td>
    </tr>
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
            posState.selectedOrder.TotalAmountWithGST +
            posState.selectedOrder.AdditionalServiceCharges
        ).toFixed(2)}
      </td>
    </tr>
    `;
  }
  template = template?.replace(/{finalBill}/g, deliveryChargesStr);

  template = template?.replace(/{beforeBill}/g, additionalChargesStr);

  return template;
};

//THIS IS FOR CHECKOUT AFTER KOT GENERATION
export const generateAnotherSaleReciept = (
  rows,
  saleRecieptTemplate,
  userData,
  posState,
  payments,
  returnAmount,
  FbrInvoiceId,
  SrbInvoiceId
) => {
  let rowItems = rows.map(
    (item, index) => `<tr>
      <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.Quantity}</td>
      <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.ProductDetailName}</td>
      <td style="text-align: right; font-weight: 500; border: 0; color: #000">${item.PriceWithoutGST}</td>

  </tr>`
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{companyName}",
    userData.CompanyName
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{username}",
    `<tr><td style="text-align: left; font-weight: 500; border: 0; color: #000">Username: </td>
    <td style="text-align: right; font-weight: 500; border: 0; color: #000">${userData.UserName}</td></tr>`
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{itemBody}",
    rowItems.join(" ")
  );

  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{paymentMode}",
    payments.map(
      (item) => `<tr>
  <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.PaymentName}</td>
  <td style="text-align: right; font-weight: 500; border: 0; color: #000">${item.ReceivedAmount}</td>
  </tr>`
    )
  );
  //some fields
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{branchAddress}",
    userData?.userBranchList[0].BranchAddress || ""
  );
  // saleRecieptTemplate = saleRecieptTemplate?.replace("{fbrIntegration}", "");
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{returnAmount}",
    ` <tr> <td style="text-align: left; font-weight: 500; border: 0; color: #000">Return Amount:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${returnAmount}</td> </tr>`
  );

  if (posState.selectedOrder.OrderModeId === DELIVERY) {
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{customerName}",
      isNullValue(posState.selectedOrder.CustomerName) &&
        `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Customer:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.CustomerName}
            </td>
          </tr>`
    );

    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{address}",
      isNullValue(posState.selectedOrder.CompleteAddress)
        ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Address:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.CompleteAddress}
            </td>
          </tr>`
        : `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Address:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.Address}
            </td>
          </tr>`
    );

    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{phone}",
      isNullValue(posState.selectedOrder.PhoneNumber) &&
        `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Phone #:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.PhoneNumber}
            </td>
          </tr>`
    );

    // saleRecieptTemplate = saleRecieptTemplate?.replace(
    //   "{beforeBill}",

    //   `<tr>
    //       </tr>`
    // );

    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{finalBill}",

      `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Delivery Charges:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.DeliveryCharges}</td>
          </tr>`
    );

    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{rider}",
      isNullValue(posState.selectedOrder.RiderName)
        ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Rider:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.RiderName}</td>
          </tr>`
        : "<tr></tr>"
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{waiter}",

      `<tr>
          </tr>`
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{table}",

      `<tr></tr>`
    );
  } else if (posState.selectedOrder.OrderModeId === DINE_IN) {
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{customerName}",
      "<tr></tr>"
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace("{rider}", "<tr></tr>");
    // saleRecieptTemplate = saleRecieptTemplate?.replace("{waiter}", "<tr></tr>");
    // saleRecieptTemplate = saleRecieptTemplate?.replace("{table}", "<tr></tr>");
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{address}",
      "<tr></tr>"
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace("{phone}", "<tr></tr>");

    // saleRecieptTemplate = saleRecieptTemplate?.replace(
    //   "{beforeBill}",
    //   posState?.punchScreenData?.Table10?.filter(
    //     (x) => x.OrderModeId === posState?.customerDetail?.OrderMode
    //   )
    //     ?.map(
    //       (x) =>
    //         `<tr>
    //                 <td style="text-align: left; font-weight: 500; border: 0; color: #000">${x.ExtraChargesName}</td>
    //                 <td style="text-align: right; font-weight: 500; border: 0; color: #000">${x.ChargesValue}</td>
    //               </tr>`
    //     )
    //     .join("")
    // );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{finalBill}",

      `<tr>
          </tr>`
    );
    // saleRecieptTemplate = saleRecieptTemplate?.replace(
    //   "{beforeBill}",
    //   posState?.punchScreenData?.Table10?.filter(
    //     (x) => x.OrderModeId === posState?.customerDetail?.OrderMode
    //   )
    //     ?.map(
    //       (x) =>
    //         `<tr>
    //                 <td style="text-align: left; font-weight: 500; border: 0; color: #000">${x.ExtraChargesName}</td>
    //                 <td style="text-align: right; font-weight: 500; border: 0; color: #000">${x.ChargesValue}</td>
    //               </tr>`
    //     )
    //     .join("")
    // );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{rider}",
      `<tr>
            
          </tr>`
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{waiter}",
      isNullValue(posState.selectedOrder.WaiterName)
        ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Waiter:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.WaiterName}</td>
          </tr>`
        : `<tr>
          
          </tr>`
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{table}",
      isNullValue(posState.selectedOrder.TableName)
        ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000"s>Table:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.TableName}</td>
          </tr>`
        : `<tr></tr>`
    );
  } else {
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{customerName}",
      "<tr></tr>"
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace("{rider}", "<tr></tr>");
    saleRecieptTemplate = saleRecieptTemplate?.replace("{waiter}", "<tr></tr>");
    saleRecieptTemplate = saleRecieptTemplate?.replace("{table}", "<tr></tr>");
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{address}",
      "<tr></tr>"
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace("{phone}", "<tr></tr>");

    // saleRecieptTemplate = saleRecieptTemplate?.replace(
    //   "{beforeBill}",

    //   `<tr>

    //       </tr>`
    // );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{finalBill}",

      `<tr>
           
          </tr>`
    );
  }

  //extra charges
  {
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{beforeBill}",
      posState.selectedOrder.AdditionalServiceCharges > 0
        ? posState?.punchScreenData?.Table10?.filter(
            (x) => x.OrderModeId === posState.selectedOrder.OrderModeId
          )
            ?.map(
              (x) =>
                `<tr>
                    <td style="text-align: left; font-weight: 500; border: 0; color: #000">${
                      x.ExtraChargesName
                    }</td>
                    <td style="text-align: right; font-weight: 500; border: 0; color: #000">${
                      x.IsPercent
                        ? (
                            (x.ChargesValue / 100) *
                            posState.selectedOrder.TotalAmountWithoutGST
                          ).toFixed(2)
                        : x.ChargesValue.toFixed(2)
                    }</td>
                  </tr>`
            )
            .join("")
        : "<tr></tr>"
    );
  }

  //end of extra charges

  saleRecieptTemplate = saleRecieptTemplate.replace(
    "{specialInstruction}",
    posState.selectedOrder.SpecialInstruction == null ||
      posState.selectedOrder.SpecialInstruction == ""
      ? ""
      : `<tr><td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.SpecialInstruction}</td></tr>`
  );

  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{productSubtotal}",
    `${posState.selectedOrder.TotalAmountWithoutGST.toFixed(2)}`
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{totalAmount}",

    posState.selectedOrder.TotalAmountWithGST.toFixed(2)
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{discountAmount}",

    posState.selectedOrder.DiscountAmount.toFixed(2)
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{gst}",
    posState.selectedOrder.GSTAmount.toFixed(2)
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{gstPercents}",

    `{${posState.selectedOrder.GSTPercent.toFixed(2)}%}`
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{productNetBill}",

    (
      posState.selectedOrder.TotalAmountWithGST +
      posState.selectedOrder.AdditionalServiceCharges +
      posState.selectedOrder?.DeliveryCharges -
      posState.selectedOrder.DiscountAmount
    ).toFixed(2)
  );

  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{orderNumber}",

    posState.selectedOrder.OrderNumber
  );

  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{orderMode}",

    posState.selectedOrder.OrderMode
  );

  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{orderDateTime}",

    posState.selectedOrder.OrderDateTime.split("T")[0]
  );

  //FBR QR
  if (FbrInvoiceId !== null && FbrInvoiceId !== undefined) {
    let fbrQR = document.getElementById("qr-code-container")?.innerHTML;
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{fbrIntegration}",
      `<div style="display:flex; justify-content:space-between; align-items:center; margin:20px 5px">
      <div>
        <image style="width:50px; height:auto;" src="${FBRImage}"/></div>
      <div style="display:flex; flex-direction:column; text-align:center">
        <span><p style='color:black;  margin-right:10px;'>FBR Invoice Number</p></span>
        <span><p style='color:black;  margin-right:20px;'>${FbrInvoiceId}</p></span>
      </div>
      <div>${fbrQR}</div>
    </div>`
    );
    saleRecieptTemplate = saleRecieptTemplate.replace("{srbIntegration}", "");
  } else {
    saleRecieptTemplate = saleRecieptTemplate.replace("{fbrIntegration}", "");
  }

  //SRB QR
  if (SrbInvoiceId !== null && SrbInvoiceId !== undefined) {
    let srbQR = document.getElementById("srb-code-container")?.innerHTML;
    saleRecieptTemplate = saleRecieptTemplate.replace(
      "{srbIntegration}",
      `<div style="display:flex; justify-content:space-between; align-items:center; margin:20px 5px">
      <div>
      <image style="width:50px; height:auto;" src="${SRBImage}"/></div>
      <div style="display:flex; flex-direction:column; text-align:center">
      <span><p style='color:black;  margin-right:10px;'>SRB Invoice Number</p></span>
      <span><p style='color:black;  margin-right:20px;'>${SrbInvoiceId}</p></span>
      </div>
      <div>${srbQR}</div>
      
      </div>`
    );
    saleRecieptTemplate = saleRecieptTemplate.replace("{fbrIntegration}", "");
  } else {
    saleRecieptTemplate = saleRecieptTemplate.replace("{srbIntegration}", "");
  }

  return saleRecieptTemplate;
};

export const generateDirectCheckoutRecptRetail = (
  saleRecieptTemplate,
  userData,
  posState,
  payments,
  orderDetails,
  extraCharges,
  returnAmount
) => {
  let cartItems = posState?.productCart
    ?.map(
      (item) =>
        `<tr>
      <td style="text-align: left; font-weight: 500; border: 0; color: #000;" colspan="3">${item.ProductDetailName}</td>
      </tr>
      <tr>
              <td style="text-align: left; font-weight: 500; border: 0; color: #000">${item.Quantity}</td>
              <td style="font-weight: 500; border: 0; color: #000;text-align:left">${item.PriceWithGST}</td>
              <td style="font-weight: 500; border: 0; color: #000;text-align:right">${item.totalAmount}</td>
            </tr>`
    )
    .join("");
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{paymentMode}",
    payments
      .map(
        (item) => `<tr>
  <td style="text-align: left; font-weight: 500; border: 0; color: #000">${
    item.PaymentName
  }</td>
  <td style="text-align: right; font-weight: 500; border: 0; color: #000">${item.ReceivedAmount.toFixed(
    2
  )}</td>
  </tr>`
      )
      .join(" ")
  );

  saleRecieptTemplate = saleRecieptTemplate?.replace("{itemBody}", cartItems);
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{orderNumber}",
    orderDetails.OrderNumber
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{orderMode}",
    posState?.customerDetail?.OrderModeName
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{companyName}",
    userData.CompanyName
  );
  // const t = getDate
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{orderDateTime}",
    orderDetails.OrderDate
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{branchAddress}",
    userData?.userBranchList[0].BranchAddress || ""
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace("{orderDateTime}");
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{productSubtotal}",
    posState?.prices?.withoutGst
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace("{orderNumber}");
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{gst}",
    posState?.prices?.gst
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{gstPercents}",
    `(${posState?.GSTPercentage}%)`
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{totalAmount}",
    posState?.prices?.withGst
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{discountAmount}",
    posState?.prices?.discountAmt
  );
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{productNetBill}",
    (
      parseFloat(posState?.prices?.withGst) +
      parseFloat(posState?.deliveryCharges ? posState?.deliveryCharges : 0) +
      extraCharges -
      parseFloat(posState?.prices?.discountAmt)
    ).toFixed(2)
  );
  //return amount
  saleRecieptTemplate = saleRecieptTemplate?.replace(
    "{returnAmount}",
    ` <tr> <td style="text-align: left; font-weight: 500; border: 0; color: #000">Return Amount:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${returnAmount}</td> </tr>`
  );

  //Extra charges
  {
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{beforeBill}",
      posState?.punchScreenData?.Table10?.filter(
        (x) => x.OrderModeId === posState?.customerDetail?.OrderMode
        // response?.data?.DataSet?.Table2[0]?.OrderMode
      )
        ?.map(
          (x) =>
            `<tr>
                    <td style="text-align: left; font-weight: 500; border: 0; color: #000">${
                      x.ExtraChargesName
                    }</td>
                    <td style="text-align: right; font-weight: 500; border: 0; color: #000">${
                      x.IsPercent
                        ? (
                            (x.ChargesValue / 100) *
                            posState.prices.withoutGst
                          ).toFixed(2)
                        : x.ChargesValue.toFixed(2)
                    }</td>
                  </tr>`
        )
        .join("")
      // : "<tr></tr>"
    );
  }
  saleRecieptTemplate = saleRecieptTemplate.replace(
    "{specialInstruction}",
    posState.selectedOrder.SpecialInstruction == null ||
      posState.selectedOrder.SpecialInstruction == ""
      ? ""
      : `<tr><td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.selectedOrder.SpecialInstruction}</td></tr>`
  );
  if (posState.customerDetail.OrderMode === DELIVERY) {
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{finalBill}",
      `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Delivery Charges:</td>
            <td style="margin: 3px 0; text-align: right; font-weight: 500; border: 0; color: #000">${posState?.deliveryCharges}</td>
          </tr>`
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{rider}",
      `<tr>
            
          </tr>`
    );

    //setting customer details
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{customerName}",
      isNullValue(posState.customerDetail.CustomerName) &&
        `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Customer:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.customerDetail.CustomerName}
            </td>
          </tr>`
    );

    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{address}",
      isNullValue(posState.customerDetail.CompleteAddress)
        ? `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Address:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.customerDetail.CompleteAddress}
            </td>
          </tr>`
        : `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Address:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.customerDetail.Address}
            </td>
          </tr>`
    );

    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{phone}",
      isNullValue(posState.customerDetail.PhoneNumber) &&
        `<tr>
            <td style="text-align: left; font-weight: 500; border: 0; color: #000">Phone #:</td>
            <td style="text-align: right; font-weight: 500; border: 0; color: #000">${posState.customerDetail.PhoneNumber}
            </td>
          </tr>`
    );
  } else {
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{finalBill}",
      "<tr></tr>"
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{customerName}",
      "<tr></tr>"
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace(
      "{address}",
      `<tr></tr>`
    );
    saleRecieptTemplate = saleRecieptTemplate?.replace("{phone}", "<tr></tr>");
    saleRecieptTemplate = saleRecieptTemplate?.replace("{rider}", "<tr></tr>");
  }
  return saleRecieptTemplate;
};
