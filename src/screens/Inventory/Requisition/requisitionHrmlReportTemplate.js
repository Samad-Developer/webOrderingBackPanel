export const html = (data) => {
  return `
  <div style=' background: white; padding: 10px 30px 10px 10px'>
  <div style='display: flex; flex: 1; justify-content: center;'>
      <h1 style="color:black;"><b>Purchase Requisition  Report</b></h1>
      </div>
    <div style='display: flex; flex: 1; justify-content: center;'>
      <p style='font-size: 11px; color:black;'>Period from <b>${
        data.DATE_FROM
      }</b> To <b>${data.DATE_TO}</b></p>
    </div>
    <div style='display: flex; flex: 1; flex-direction : column; justify-content: flex-start;'>
      <p style='font-size: 14px; color:black'>Requisition Number: <b>${
        data.master.RequisitionNo
      }</b></p>
      <p style='font-size: 14px; color:black'>Branch: <b>${
        data.master.Branch
      }</b></p>
      <p style='font-size: 14px; color:black'>Date: <b>${
        data.master.RequisiDate?.split("T")[0]
      }</b></p>
    </div>
    <br />

    
      <div display='display: block;'>
          <div style='display: block;padding: 10px; width: 100%;'>
          ${data.body}
          </div>
          <p style="text-align:right;color:black">Total Requisition Quantity:${
            data.totalQty
          }</p>
      </div>
    </div>
    `;
};

export const HTMLChunk = (data) => {
  let html = `<table>
  <th style="color:black"><b>Product Category</b></th>
    <th style="color:black"><b>Product</b></th>
    <th style="color:black"><b>Unit Namet<b></th>
    <th style="color:black"><b>Requisition Quantity</b></th>
    <tbody>
      ${data.detail
        .map(
          (rowItem) => `<tr>
          <td style="color:black">${rowItem.CategoryName}</td>
          <td style="color:black">${rowItem.Product}</td>
          <td style="color:black">${rowItem.UnitName}</td>
          <td style="color:black">${rowItem.QuantityInPurchase}</td>
        </tr>`
        )
        .join("")}
    </tbody>
    </table>`;
  let totalPurchaseQty = data.detail.reduce(
    (sum, next) => sum + next.QuantityInPurchase,
    0
  );

  return { html, totalPurchaseQty };
};
