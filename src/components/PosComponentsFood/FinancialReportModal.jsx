import { Button, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ModalComponent from "../formComponent/ModalComponent";

const FinancialReportModal = (props) => {
  const reportRef = useRef();
  const handleOnPrint = useReactToPrint({
    content: () => reportRef.current,
    pageStyle: `
        @media print {
          .main {
            page-break-inside: avoid;
          }
        }
        `,
  });

  const FinancialReport = React.forwardRef((props, ref) => {
    const { reportData, operationId } = props;
    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "white",
          margin: "10px 5px",
          fontWeight: "1000",
          color: "#000",
        }}
        className="main"
      >
        <div style={{ border: "2px solid #000", textAlign: "center" }}>
          <p style={{ marginTop: 0, color: "#000" }}>
            {operationId === 4
              ? "Business Day Financial Report"
              : operationId === 5
              ? "Shift Financial Report"
              : operationId === 6
              ? "Terminal Financial Report"
              : ""}
          </p>
        </div>
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          User Details
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>Branch</p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData && reportData?.Table && reportData.Table[0]?.BranchName}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>Business Day</p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
              reportData?.Table &&
              reportData.Table[0]?.BusinessDayName}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>Business Date</p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
              reportData?.Table &&
              reportData.Table[0]?.BusinessDate.split("T")[0]}
          </p>
        </div>
        {operationId === 5 ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>Shift</p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData &&
                  reportData?.Table &&
                  reportData.Table[0]?.ShiftName}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>Shift Date</p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData &&
                  reportData?.Table &&
                  reportData.Table[0]?.ShiftDate.split("T")[0]}
              </p>
            </div>
          </>
        ) : (
          ""
        )}
        {operationId === 6 ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>Shift</p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData &&
                  reportData?.Table &&
                  reportData.Table[0]?.ShiftName}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>Terminal</p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData &&
                  reportData?.Table &&
                  reportData.Table[0]?.TerminalName}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Terminal Date
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData &&
                  reportData?.Table &&
                  reportData.Table[0]?.TerminalDate.split("T")[0]}
              </p>
            </div>
          </>
        ) : (
          ""
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>Open By</p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
            reportData?.Table &&
            reportData.Table[0]?.OpenBy === null
              ? ""
              : reportData.Table && reportData.Table[0]?.OpenBy}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>Close By</p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
            reportData?.Table &&
            reportData.Table[0]?.CloseBy === null
              ? ""
              : reportData.Table && reportData.Table[0]?.CloseBy}
          </p>
        </div>
        <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Sales Summary
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>Sub Total</p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
            reportData?.Table &&
            reportData?.Table[0]?.SubTotal === null
              ? ""
              : reportData &&
                reportData?.Table &&
                parseFloat(reportData?.Table[0]?.SubTotal).toFixed(2)}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>GST</p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
            reportData?.Table &&
            reportData.Table[0]?.SubTotal === null
              ? ""
              : reportData &&
                reportData?.Table &&
                parseFloat(reportData.Table[0]?.GSTAmount).toFixed(2)}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            Discount Amount
          </p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
            reportData?.Table &&
            reportData.Table &&
            reportData.Table[0]?.DiscountAmount === null
              ? ""
              : reportData &&
                reportData?.Table &&
                parseFloat(reportData.Table[0]?.DiscountAmount).toFixed(2)}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            Delivery Charges
          </p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
            reportData?.Table &&
            reportData.Table[0]?.DeliveryCharges === null
              ? ""
              : reportData &&
                reportData?.Table &&
                parseFloat(reportData.Table[0]?.DeliveryCharges).toFixed(2)}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            Additional Charges
          </p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
            reportData?.Table &&
            reportData.Table[0]?.AdditionalCharges === null
              ? ""
              : reportData &&
                reportData?.Table &&
                reportData.Table[0]?.AdditionalCharges}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ margin: "3px 0", textAlign: "center" }}>Net Sale</p>
          <p style={{ margin: "3px 0", textAlign: "center" }}>
            {reportData &&
            reportData?.Table &&
            reportData.Table[0]?.NetSale === null
              ? ""
              : reportData &&
                reportData?.Table &&
                parseFloat(reportData.Table[0]?.NetSale).toFixed(2)}
          </p>
        </div>
        <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Sales By Payment Mode
        </p>

        <table>
          <tr>
            <th style={{ fontWeight: "1000", color: "#000" }}>Payment Mode</th>
            <th style={{ fontWeight: "1000", color: "#000" }}>Order Count</th>
            <th style={{ fontWeight: "1000", color: "#000" }}>Net Sale</th>
          </tr>
          {reportData.Table1 &&
            reportData.Table1.map((row) => {
              return (
                <tr>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {" "}
                    {row.PaymentMode}{" "}
                  </td>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {" "}
                    {row.OrderCount}{" "}
                  </td>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {parseFloat(row.NetSale).toFixed(2)}
                  </td>
                </tr>
              );
            })}
        </table>
        <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Payment Status
        </p>

        <table>
          <tr>
            <th style={{ fontWeight: "1000", color: "#000" }}>
              Payment status
            </th>
            <th style={{ fontWeight: "1000", color: "#000" }}>Count</th>
            <th style={{ fontWeight: "1000", color: "#000" }}>Net Sale</th>
          </tr>
          {reportData.Table2 &&
            reportData.Table2.map((row) => {
              return (
                <tr>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {" "}
                    {row.Type}{" "}
                  </td>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {" "}
                    {row.OrderCount}{" "}
                  </td>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {parseFloat(row.NetSale).toFixed(2)}
                  </td>
                </tr>
              );
            })}
        </table>
        <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Order mode
        </p>

        <table>
          <tr>
            <th style={{ fontWeight: "1000", color: "#000" }}>Order Mode</th>
            <th style={{ fontWeight: "1000", color: "#000" }}>Count</th>
            <th style={{ fontWeight: "1000", color: "#000" }}>Net Sale</th>
          </tr>
          {reportData.Table3 &&
            reportData.Table3.map((row) => {
              return (
                <tr>
                  <td style={{ fontWeight: "800", color: "#000" }}>
                    {row.OrderModeName}
                  </td>
                  <td style={{ fontWeight: "800", color: "#000" }}>
                    {" "}
                    {row.OrderCount}{" "}
                  </td>
                  <td style={{ fontWeight: "800", color: "#000" }}>
                    {parseFloat(row.NetSale).toFixed(2)}
                  </td>
                </tr>
              );
            })}
        </table>

        {/* Order Source */}
        <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Order Source
        </p>
        {reportData.Table7 && reportData.Table7.length > 0 ? (
          <table>
            <tr>
              <th style={{ fontWeight: "1000", color: "#000" }}>
                Order Source
              </th>
              <th style={{ fontWeight: "1000", color: "#000" }}>Count</th>
              <th style={{ fontWeight: "1000", color: "#000" }}>Net Sale</th>
            </tr>
            {reportData.Table7 &&
              reportData.Table7.sort(
                (a, b) => a.OrderSourceName - b.OrderSourceName
              ).map((row) => {
                return (
                  <tr>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.OrderSourceName}{" "}
                    </td>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.OrderCount}{" "}
                    </td>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.NetSale}{" "}
                    </td>
                  </tr>
                );
              })}
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No Profit / Loss</p>
        )}

        <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Discounts
        </p>

        {reportData.Table4 && reportData.Table4.length > 0 ? (
          <table>
            <tr>
              <th style={{ fontWeight: "800", color: "#000" }}>Discount</th>
              <th style={{ fontWeight: "800", color: "#000" }}>Count</th>
              <th style={{ fontWeight: "800", color: "#000" }}>Amount</th>
            </tr>
            {reportData.Table4 &&
              reportData.Table4.map((row) => {
                return (
                  <tr>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.DiscountPercent}{" "}
                    </td>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.OrderCount}{" "}
                    </td>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {parseFloat(row.DiscountAmount).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No Discounts</p>
        )}

        <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Expenses
        </p>

        {reportData.Table5 && reportData.Table5.length > 0 ? (
          <table>
            <tr>
              <th style={{ fontWeight: "1000", color: "#000" }}>Account</th>
              <th style={{ fontWeight: "1000", color: "#000" }}>Count</th>
              <th style={{ fontWeight: "1000", color: "#000" }}>Amount</th>
            </tr>
            {reportData.Table5 &&
              reportData.Table5.map((row) => {
                return (
                  <tr>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.AccountName}{" "}
                    </td>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.Count}{" "}
                    </td>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {parseFloat(row.Total).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No Expenses</p>
        )}

        <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Cash Reconciliation
        </p>

        {reportData.Table8 && reportData.Table8.length > 0 ? (
          <table>
            <tr>
              <th style={{ fontWeight: "1000", color: "#000" }}>Type</th>
              <th style={{ fontWeight: "1000", color: "#000" }}>Amount</th>
            </tr>
            {reportData.Table8 &&
              reportData.Table8.map((row) => {
                return (
                  <tr>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.Type}{" "}
                    </td>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.Amount}{" "}
                    </td>
                  </tr>
                );
              })}
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No Cash Reconciliation</p>
        )}

        <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Profit / Loss
        </p>

        {reportData.Table6 && reportData.Table6.length > 0 ? (
          <table>
            <tr>
              <th style={{ fontWeight: "1000", color: "#000" }}>Name</th>
              <th style={{ fontWeight: "1000", color: "#000" }}>Amount</th>
            </tr>
            {reportData.Table6 &&
              reportData.Table6.map((row) => {
                return (
                  <tr>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.Name}{" "}
                    </td>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.Amount}{" "}
                    </td>
                  </tr>
                );
              })}
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No Profit / Loss</p>
        )}

        {/* food margin */}
        {/* <hr style={{ height: 2, backgroundColor: "gray" }} />
        <p style={{ textAlign: "center", fontWeight: "1000", fontSize: 20 }}>
          Food Cost Margin
        </p>
        {reportData.Table7 && reportData.Table7.length > 0 ? (
          <table>
            <tr>
              <th style={{ fontWeight: "1000", color: "#000" }}>Name</th>
              <th style={{ fontWeight: "1000", color: "#000" }}>Amount</th>
            </tr>
            {reportData.Table7 &&
              reportData.Table7.map((row) => {
                return (
                  <tr>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.Name}{" "}
                    </td>
                    <td style={{ fontWeight: "800", color: "#000" }}>
                      {" "}
                      {row.Amount.toFixed(2)}{" "}
                    </td>
                  </tr>
                );
              })}
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No Profit / Loss</p>
        )} */}
      </div>
    );
  });

  return (
    <div>
      <ModalComponent
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Title level={5}>Financial Report</Title>
            <div style={{ display: "flex" }}>
              <Button
                onClick={() => {
                  props.setFinancialModal(false);
                  //   setHtml("");
                }}
                style={{ marginRight: 5 }}
              >
                Close
              </Button>

              <Button
                onClick={() => {
                  handleOnPrint();
                }}
                type="primary"
              >
                Print
              </Button>
            </div>
          </div>
        }
        // title="Financial Report"
        isModalVisible={props.financialModal}
        // width={"70vw"}
        footer={[]}
      >
        <div align="center">
          {/* {reportViewLoading ? <Spin /> : <Prints html={html} />} */}
          <Row style={{ placeContent: "center" }}>
            <FinancialReport
              ref={reportRef}
              reportData={props.record}
              operationId={props.operationId}
            />
          </Row>
        </div>
      </ModalComponent>
    </div>
  );
};

export default FinancialReportModal;
