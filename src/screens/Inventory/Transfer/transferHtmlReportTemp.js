export const html = (data) => {
  return `
            <div style=' background: white; padding: 10px 30px 10px 10px'>
            <div style='display: flex; flex: 1; justify-content: center;'>
                <h1 style="color:black;"><b>Transfer Report</b></h1>
                </div>
              <div style='display: flex; flex: 1; justify-content: center;'>
                <p style='font-size: 14px; color:black;'>Period from <b>${
                  data.DATE_FROM
                }</b> To <b>${data.DATE_TO}</b></p>
              </div>
              <div style='display: flex; flex: 1; flex-direction : column; justify-content: flex-start;'>
                <p style='font-size: 16px; color:black;'>Transfer Number: ${
                  data.master.TransferNumber
                }</p>
                <p style='font-size: 16px; color:black;'>Transfer Date: ${
                  data.master.TransferDate?.split("T")[0]
                }</p>
                <p style='font-size: 16px; color:black;'>TransferFrom: ${
                  data.master.TransferFrom
                }</p>
                  <p style='font-size: 16px; color:black;'>TransferTo: ${
                    data.master.TransferTo
                  }</p>
              </div>
              <div display='display: flex;'>
                    <div style='display: flex; flex-direction: column; padding: 5px; width: 100%;'>
                    ${data.body}
                    </div>
                </div>
              </div>
              `;
};

export const HTMLChunk = (data, BranchFrom) => {
  let html = `<table
              <thead>
                  <th style="color:black; "><b>Product</b></th>
                  <th style="color:black; "><b>Purchase Unit</b></th>
                  <th style="color:black; "><b>Barcode</b></th>
                  <th style="color:black; "><b>Issuance Unit</b></th>
                  <th style="color:black; "><b>Stock(${BranchFrom})</b></th>
                  <th style="color:black; "><b>Batch</b></th>
                  <th style="color:black; "><b>Quantity Level</b></th>
              
              </thead>
             ${data.detail
               .map(
                 (rowItem) => `<tr>
                <td style="color:black; font-size: 16px;">${rowItem.ProductSizeName}</td>
                <td style="color:black; font-size: 16px;">${rowItem.PurchaseUnitName}</td>
                <td style="color:black; font-size: 16px;">${rowItem.Barcode}</td>
                <td style="color:black; font-size: 16px;">${rowItem.IssueUnitName}</td>
                <td style="color:black; font-size: 16px;">${rowItem.StockQuantity}</td>
                <td style="color:black; font-size: 16px;">${rowItem.BatchId}</td>
                <td style="color:black; font-size: 16px;">${rowItem.QtyInLevel2}</td>

                </tr>`
               )
               .join("")} 
          </table>`;

  return html;
};
