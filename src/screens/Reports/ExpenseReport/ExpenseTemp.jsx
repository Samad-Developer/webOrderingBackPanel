import Title from "antd/lib/typography/Title";

const ExpenseTemp = (props) => {
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
    <div
      style={{
        border: "1px solid gray",
        padding: 20,
        backgroundColor: "white",
      }}
    >
      <table
        style={{ borderCollapse: "collapse", width: "100%" }}
        id="table-to-xls"
      >
        <tr>
          <td colSpan={10}>
            <Title level={4} style={{ textAlign: "center" }}>
              Expense Report:{props.branch}
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
        <tr style={headRow}>
          <td style={thCssHead}>
            <b>Date</b>
          </td>
          <td style={thCssHead}>
            <b>Expense Type</b>
          </td>
          <td style={thCssHead}>
            <b>Expense Amount</b>
          </td>
          <td style={thCssHead}>
            <b>Branch</b>
          </td>
        </tr>
        <tbody>
          {props?.list.map((row) => (
            <tr style={{ pageBreakInside: "avoid" }}>
              <td style={thCss}> {row.Date}</td>
              <td style={thCss}> {row.ExpenseTypeName} </td>
              <td style={thCss}> {row.ExpenseAmount} </td>
              <td style={thCss}> {row.BranchName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ExpenseTemp;
