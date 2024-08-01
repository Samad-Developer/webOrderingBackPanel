export const BUTTON_SIZE = "middle";
export const INPUT_SIZE = "middle";
export const BUTTON_COLOR = "#4561B9";
export const PRIMARY_COLOR = "#4561B9";
export const TABLE_SIZE = "middle";
export const defaultPageSize = 10;
export const VERSION_CONTROL = 'Pfv-v-7lsyZ5GQ-c-xi0'

export const KOTTemp = `  <div  style="background-color:white; color : #000;font-weight : 1000">
<div style="border: 2px solid #000; text-align: center; font-size: 10px">
  <h2 style="margin-top: 0; margin-bottom: 10px">Kitchen (KOT) <br> {orderNumber} </h2>
  <div style="display: flex; justify-content: space-between">
    <p style="margin: 3px 0; text-align: center; font-size: 10px">{billDate}</p>
    <p style="margin: 3px 0; text-align: center; font-size: 10px">{billTime}</p>
  </div>
</div>
<div style="display: flex; justify-content: space-between">
  <p style="margin: 3px 0; text-align: center; font-size: 10px;">Order #</p>
  <p style="margin: 3px 0; text-align: center; font-size: 10px;">{orderNumber}</p>
</div>
<div style="display: flex; justify-content: space-between">
  <p style="margin: 3px 0; text-align: center; font-size: 10px;">Order Date/Time:</p>
  <p style="margin: 3px 0; text-align: center; font-size: 10px;">{orderDateTime}</p>
</div>
<div style="display: flex; justify-content: space-between">
  <p style="margin: 3px 0; text-align: center; font-size: 10px;">Order Mode:</p>
  <p style="margin: 3px 0; text-align: center; font-size: 10px;">{orderMode}</p>
</div>
{embadFields}

<table
  style="
    width: 100%;
    border-top: 1px solid #555;
    border-bottom: 1px solid #555;
  "
>
  <thead>
    <tr>
      <th
        style="
          text-align: left;
          font-weight: 500;
          text-transform: uppercase;
          border: 0;
          color : #000;
          font-size: 10px;
        "
      >
        Qty
      </th>
      <th
        style="
          text-align: left;
          font-weight: 500;
          text-transform: uppercase;
          border: 0;
          color : #000;
          font-size: 10px;
        "
      >
        Item
      </th>
      <th
        style="
          text-align: left;
          font-weight: 500;
          text-transform: uppercase;
          border: 0;
          color : #000;
          font-size: 10px;
        "
      >
        Type
      </th>

    </tr>
  </thead>
  <tbody>
  {itemBody}
  </tbody>
</table>
</div>`;
