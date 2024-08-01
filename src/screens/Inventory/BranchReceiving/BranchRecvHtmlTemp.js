export const html = (data) => {
  return `
              <div style=' background: white; padding: 10px 30px 10px 10px'>
                <div style='display: flex; flex: 1; justify-content: center;'>
                  <h1 style="color:black;"><b>Branch Receving Report</b></h1>
                  </div>
                <div style='display: flex; flex: 1; justify-content: center;'>
                  <p style='font-size: 11px; color:black;'>Period from <b>${
                    data.DATE_FROM
                  }</b> To <b>${data.DATE_TO}</b></p>
                </div>
                <div style='display: flex; flex: 1; flex-direction : column; justify-content: flex-start;'>
                  <p style='font-size: 14px; color:black;'>Branch Receving  Number: ${
                    data.master.ReceivingNumber
                  }</p>
                  <p style='font-size: 14px; color:black;'>Branch: <b>${
                    data.master.Branch
                  }</b></p>
                  <p style='font-size: 14px; color:black;'>Date: <b>${
                    data.master.Date?.split("T")[0]
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
                    <th style="color:black;"><b>Product</b></th>
                    <th style="color:black;"><b>Unit</b></th>
                    <th style="color:black;"><b>Transfer/Issuance Quantity</b></th>
                    <th style="color:black;"><b>Receiving Quantity</b></th>         
                </thead>
               ${data.detail
                 .map(
                   (rowItem) => `<tr>
                   <td style="color:black;">${rowItem.ProductSizeName}</td>
                   <td style="color:black;">${rowItem.UnitName}</td>
                   <td style="color:black;">${rowItem.TransferIssuanceQuantity}</td>
                   <td style="color:black;">${rowItem.QtyInLevel2}</td>
               </tr>`
                 )
                 .join("")} 
            </table>`;

  return html;
};
