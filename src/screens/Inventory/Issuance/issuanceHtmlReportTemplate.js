export const html = (data) => {
  return `
          <div style=' background: white; padding: 10px 30px 10px 10px'>
          <div style='display: flex; flex: 1; justify-content: center;'>
              <h1 style="color:black;"><b>Issuance Report</b></h1>
              </div>
            <div style='display: flex; flex: 1; justify-content: center;'>
              <p style='font-size: 11px; color:black;'>Period from <b>${
                data.DATE_FROM
              }</b> To <b>${data.DATE_TO}</b></p>
            </div>
            <div style='display: flex; flex: 1; flex-direction : column; justify-content: flex-start;'>
              <p style='font-size: 14px; color:black;'>Issuance Number: ${
                data.master.IssuanceNumber
              }</p>
              <p style='font-size: 14px; color:black;'>Branch: <b>${
                data.BranchName
              }</b></p>
              <p style='font-size: 14px; color:black;'>Date: <b>${
                data.master.IssuanceDate?.split("T")[0]
              }</b></p>
            </div>
            <div display='display: flex;'>
                  <div style='display: flex; flex-direction: column; padding: 10px; width: 100%;'>
                  ${data.body}
                  </div>
              </div>
            </div>
            `;
};

export const HTMLChunk = (data) => {
  let html = `<table
            <thead>
                <th style="color:black;"><b>Product</b></th>
                <th style="color:black;"><b>Issuance  Quantity</b></th>
                <th style="color:black;"><b>Issuance Unit</b></th>
                <th style="color:black;"><b>Batch Number</b></th>
                <th style="color:black;"><b>Stock Quantity</b></th>
                
            </thead>
           ${data.detail
             .map(
               (rowItem) => `<tr>
              <td style="color:black;">${rowItem.ProductDetailName}</td>
              <td style="color:black;">${rowItem.IssuanceQuantity}</td>
              <td style="color:black;">${rowItem.IssuanceUnitName}</td>
              <td style="color:black;">${rowItem.BatchNumber}</td>
              <td style="color:black;">${rowItem.StockQuantity}</td>
              </tr>`
             )
             .join("")} 
        </table>`;

  return html;
};
