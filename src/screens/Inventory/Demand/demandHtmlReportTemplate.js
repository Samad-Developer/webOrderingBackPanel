export const html = (data) => {
  return `
    <div style=' background: white; padding: 10px 30px 10px 10px'>
    <div style='display: flex; flex: 1; justify-content: center;'>
        <h1 style="color:black;"><b>Demand Detail Report</b></h1>
        </div>
      <div style='display: flex; flex: 1; justify-content: center;'>
        <p style='font-size: 11px; color:black;'>Period from <b>${
          data.DATE_FROM
        }</b> To <b>${data.DATE_TO}</b></p>
      </div>
      <div style='display: flex; flex: 1; flex-direction : column; justify-content: flex-start;'>
        <p style='font-size: 14px; color:black;'>Demand Number: <b>${
          data.master.DemandNo
        }</b></p>
        <p style='font-size: 14px; color:black;'>Branch: <b>${
          data.master.Branch
        }</b></p>
        <p style='font-size: 14px; color:black;'>Date: <b>${
          data.master.DemandDate?.split("T")[0]
        }</b></p>
      </div>
      <br />
   
      
        <div display='display: flex;'>
            <div style='display: flex; flex-direction: column; padding: 10px; width: 100%;'>
            ${data.body}
            </div>
        </div>
      </div>
      `;
};

export const HTMLChunk = (data) => {
  return `<table>
  <th style="color:black;"><b>Category</b></th>
  <th style="color:black;"><b>Product</b></th>
  <th style="color:black;"><b>Demand Quantity</b></th>
  <th style="color:black;"><b> Unit</b></th>
  <th style="color:black;"><b>Barcode</b></th>
  ${data.detail
    .map(
      (rowItem) =>
        `<tr>
          <td style="color:black;">${rowItem.CategoryName}</td>
          <td style="color:black;">${rowItem.ProductDetail}</td>
          <td style="color:black;">${rowItem.DemandQuantityInIssue}</td>
          <td style="color:black;">${rowItem.UnitName}</td>
          <td style="color:black;">${rowItem.ProductCode}</td>
      </tr>`
    )
    .join("")}
  </table>`;
  html = html.join("");
  return html;
};
