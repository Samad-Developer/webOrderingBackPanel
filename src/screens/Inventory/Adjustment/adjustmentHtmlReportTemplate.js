export const html = (data) => {
  return `
            <div style=' background: white; padding: 10px 30px 10px 10px'>
              <div style='display: flex; flex: 1; justify-content: center;'>
                <h1><b>Stock Adjustment Report</b></h1>
                </div>
              <div style='display: flex; flex: 1; justify-content: center;'>
                <p style='font-size: 11px;'>Period from <b>${
                  data.DATE_FROM
                }</b> To <b>${data.DATE_TO}</b></p>
              </div>
              <div style='display: flex; flex: 1; flex-direction : column; justify-content: flex-start;'>
                <p style='font-size: 14px;'>Adjustment  Number: ${
                  data.master.AdjustmentNumber
                }</p>
                <p style='font-size: 14px;'>Branch: <b>${
                  data.BranchName
                }</b></p>
                <p style='font-size: 14px;'>Date: <b>${
                  data.master.InvAdjustmentDate?.split("T")[0]
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
  let html = `<table>
              <thead>
                  <th><b>Category</b></th>
                  <th><b>Product</b></th>
                  <th><b>Batch Number</b></th>
                  <th><b>Size</b></th>
                  <th><b>Variant</b></th>
                  <th><b>Barcode</b></th>
                  <th><b>Stock</b></th>
                  <th><b>Type</b></th>
                  <th><b>Adjustment Quantity</b></th>
                  
              </thead>
             ${data.detail
               .map(
                 (rowItem) => `<tr>
                 <td>${rowItem.CategoryName}</td>
                 <td>${rowItem.ProductDetailName}</td>
                 <td>${rowItem.BatchNumber}</td>
                 <td>${rowItem.SizeName}</td>
                 <td>${rowItem.FlavorName}</td>
                 <td>${rowItem.Barcode}</td>
                 <td>${rowItem.StockQuantity}</td>
                 <td>${rowItem.TypeName}</td>
                 <td>${rowItem.QtyInLevel2}</td>
             </tr>`
               )
               .join("")} 
          </table>`;

  return html;
};
