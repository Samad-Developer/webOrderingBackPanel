import Title from "antd/lib/typography/Title";

export default function IssuenceDetailTemplate(props) {
  const thCss = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    color: "black",
  };
  const thCssHead = {
    border: "1px solid black",
    padding: "6px 12px",
    display: "table-cell",
    background: "#4561b9",
    color: "white",
    fontWeight: "bold",
  };
  const headRow = {
    display: "table-row",
    fontWeight: "900",
    color: "#ffffff",
  };

  return (
    <div style={{ border: "1px solid gray", padding: 20 }}>
      <table
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={10}>
            <Title level={4} style={{ textAlign: "center" }}>
              Issuance/Transfer vs Branch Receiving Report
            </Title>
          </td>
        </tr>

        <tr>
          <td colSpan={10}>
            <Title level={5} style={{ textAlign: "center" }}>
              {props.date}
            </Title>
          </td>
        </tr>

        <tr style={{ headRow }}>
          <td style={thCssHead}>Issuance Date</td>
          <td style={thCssHead}>Issue/Transfer Branch</td>
          <td style={thCssHead}>Receiving Branch</td>
          <td style={thCssHead}>Document No</td>
          <td style={thCssHead}>Receiving No</td>
          <td style={thCssHead}>Product Name</td>
          <td style={thCssHead}>UnitName</td>
          <td style={thCssHead}>Issuance/Transfer Quantity</td>
          <td style={thCssHead}>Received Quantity</td>
          <td style={thCssHead}>Quantity Difference</td>
        </tr>

        <tbody>
          {props?.list?.map((y) => (
            <tr>
              <td style={thCss}>{y.Date?.split("T")[0]}</td>
              <td style={thCss}>{y.Issue_TransferBranch}</td>
              <td style={thCss}>{y.ReceiveBranch}</td>
              <td style={thCss}>{y.DocumentNo}</td>
              <td style={thCss}>{y["ReceivingNo."]}</td>
              <td style={thCss}>{y.ProductName}</td>
              <td style={thCss}>{y.UnitName}</td>
              <td style={thCss}>{y.Issuance_TransferQty}</td>
              <td style={thCss}>{y.ReceivedQty}</td>
              <td style={thCss}>{y.QtyDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <Title level={5} style={{ textAlign: "right" }}>
            Issue Quantity :{" "}
            {
              props?.totalList?.filter(
                (e) => e.ProductDetailId === x.ProductDetailId
              )[0]?.IssueQty
            }{" "}
            | Transfer Quantity :{" "}
            {
              props?.totalList?.filter(
                (e) => e.ProductDetailId === x.ProductDetailId
              )[0]?.TransferQty
            }{" "}
            | Branch Receiving Quantity :{" "}
            {
              props?.totalList?.filter(
                (e) => e.ProductDetailId === x.ProductDetailId
              )[0]?.BranchRecevQty
            }
          </Title> */}
      {/* </> */}
    </div>
  );
}
