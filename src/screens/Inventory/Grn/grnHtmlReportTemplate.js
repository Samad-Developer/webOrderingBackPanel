export const html = (data) => {
  return `
        <div style=' background: white; padding: 10px 30px 10px 10px'>
        <div style='display: flex; flex: 1; justify-content: center;'>
            <h1 style="color:black;"><b>GRN Report</b></h1>
            </div>
          <div style='display: flex; flex: 1; justify-content: center;'>
            <p style='font-size: 13px; color:black;'>Period from <b>${
              data.DATE_FROM
            }</b> To <b>${data.DATE_TO}</b></p>
          </div>
          <div style='display: flex; flex: 1; flex-direction : column; justify-content: flex-start;'>
            <p style='font-size: 14px; color:black;'>GRN Number: <b>${
              data.master.GRNo
            }</b></p>
            <p style='font-size: 14px; color:black;'>Branch: <b>${
              data.master.Branch
            }</b></p>
            <p style='font-size: 14px; color:black;'>Date: <b>${
              data.master.GRDate?.split("T")[0]
            }</b></p>
            <p style='font-size: 14px; color:black;'>Vendor: <b>${
              data.vendorName
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
              <th style="color:black;"><b>Quantity</b></th>
              <th style="color:black;"><b> Unit Price</b></th>
              <th style="color:black;"><b>Tax Amount</b></th>
              <th style="color:black;"><b>Sub Total<b></th>
              <th style="color:black;"><b>Net Amount<b></th>
          </thead>
         ${data.detail
           .map(
             (rowItem) => `<tr>
         <td style="color:black;">${rowItem.Product}</td>
         <td style="color:black;">${rowItem.PurchaseQuantity}</td>
         <td style="color:black;">${rowItem.PurchaseUnitPrice}</td>
         <td style="color:black;">${rowItem.TaxAmount}</td>
         <td style="color:black;">${rowItem.SubTotal}</td>
          <td style="color:black;">${rowItem.NetAmount}</td>
          </tr>`
           )
           .join("")} 
           <tr style="border:0"><td style="color:black;"><b>Total Quantity</b></td><td style="color:black;"><b>${data.detail.reduce(
             (sum, next) => sum + next.PurchaseQuantity,
             0
           )}</b></td>
           <td></td>
           <td></td>
           <td></td>
           <td style="color:black;"><b>${data.detail.reduce(
             (sum, next) => sum + next.NetAmount,
             0
           )}</b></td>
           </tr>
        
      </table>`;

  return html;
};
