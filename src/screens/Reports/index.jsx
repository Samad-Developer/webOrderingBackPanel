import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, message, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE, KOTTemp } from "../../common/ThemeConstants";
import FormButton from "../../components/general/FormButton";
import FormContainer from "../../components/general/FormContainer";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import moment from "moment";
import {
  setInitialReports,
  setBranches,
  getReport,
} from "../../redux/actions/reportActions";
import ModalComponent from "../../components/formComponent/ModalComponent";
import jsPDF from "jspdf";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Title from "antd/lib/typography/Title";
import { postRequest } from "../../services/mainApp.service";
import { getDate } from "../../functions/dateFunctions";
import FinancialReportModal from "../../components/PosComponentsFood/FinancialReportModal";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
};
const colstyle = {
  width: "30%",
};
const tableStyle = {
  width: "100%",
};
const Prints = ({ html }) => (
  <div>
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  </div>
);

const print = (html) => {
  // const string = renderToString(<Prints />);
  const pdf = new jsPDF("p", "in", [3, 10]);
  pdf.setFontSize(1200);

  pdf.html(html, {
    callback: function (doc) {
      pdf.save();
    },
    x: 2,
    y: 10,
  });
  //   pdf.save("pdf");
};

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}

const initialDataBody = {
  OperationId: 1,
  BranchId: null,
  DateFrom: getDate(),
  DateTo: getDate(),
  BusinessDayId: null,
  TerminalDetailId: null,
  ShiftDetailId: null,
};

const dailyExpenseFields = {
  OperationId: 3,
  CompanyId: null,
  UserId: null,
  DateFrom: getDate(),
  DateTo: getDate(),
  UserIP: "12.1.1.2",
};

const Reports = () => {
  const dispatch = useDispatch();
  const [dailConsumptionData, setConsumptionData] = useState([]);
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const repData = useSelector((state) => state.reportsReducer);

  const [bodyData, setBodyData] = useState(initialDataBody);
  const reportRef = useRef();
  const [data, setData] = useState([]);
  const [consumptionLoading, setConsumptionLoading] = useState(false);
  const [operationId, setOperationId] = useState(null);
  const [dailyConsumptionBday, setDailyConsumptionBday] = useState("");
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
  const [reportType, setReportsType] = useState([
    {
      name: "Business Day Single",
      id: 1,
    },
    {
      name: "Shift",
      id: 2,
    },
    {
      name: "Terminal",
      id: 3,
    },
    {
      name: "Business Day Range",
      id: 7,
    },
  ]);
  const [viewReportModal, setViewReportModal] = useState(false);
  const [financialModal, setFinancialModal] = useState(false);
  const [consumptionReport, setConsumptionReport] = useState(false);
  const [html, setHtml] = useState("");

  const {
    reportsList,
    reportsGridLoading,
    branches,
    reportViewLoading,
    reportData,
  } = useSelector((state) => state.reportsReducer);

  const viewReport = (record, operationId) => {
    let data = bodyData;
    if (operationId === 4) {
      data = { ...data, BusinessDayId: record.BusinessDayId };
    } else if (operationId === 5) {
      data = {
        ...data,
        ShiftDetailId: record.ShiftDetailId,
        BusinessDayId: record.BusinessDayId,
      };
    } else if (operationId === 6) {
      data = {
        ...data,
        TerminalDetailId: record.TerminalDetailId,
        BusinessDayId: record.BusinessDayId,
      };
    }
    if (bodyData.BranchId !== null) {
      // setViewReportModal(true);
      setFinancialModal(true);

      dispatch(
        getReport(
          "/PosReports",
          { ...data, OperationId: operationId },
          controller,
          userData,
          (data) => {
            if (data.Table.length > 0) {
              setOperationId(operationId);
              setData(data);
            }
          }
        )
      );
    } else {
      message.error("Select Branch!");
    }
  };
  const viewDailyExpenseReport = (record, opId) => {
    setConsumptionReport(true);
    setConsumptionLoading(true);
    postRequest(
      "/ConsumptionDetailReport",
      {
        ...dailyExpenseFields,
        UserId: userData.UserId,
        CompanyId: userData.CompanyId,
        DateFrom: bodyData.DateFrom,
        DateTo: bodyData.DateTo,
        BranchId: record.BranchId,
      },
      controller
    )
      .then((response) => {
        setConsumptionLoading(false);
        setConsumptionReport(response.data.DataSet.Table);
        setDailyConsumptionBday(record.BusinessDay);
      })
      .catch((error) => {
        setConsumptionLoading(false);
        console.error(error);
      });
  };

  const BranchDaycolumns = [
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
    },
    {
      title: "Business Day",
      dataIndex: "BusinessDay",
      key: "BusinessDay",
    },
    {
      title: "Open Date",
      dataIndex: "OpenDate",
      key: "OpenDate",
    },
    {
      title: "Opened By",
      dataIndex: "OpenedBy",
      key: "OpenedBy",
    },
    {
      title: "Close Date",
      dataIndex: "CloseDate",
      key: "CloseDate",
    },
    {
      title: "Closed By",
      dataIndex: "ClosedBy",
      key: "ClosedBy",
    },
    {
      title: "Financial",
      dataIndex: "view",
      render: (_, record) => {
        return (
          <FormButton
            icon={<EyeOutlined />}
            type="text"
            onClick={() => {
              viewReport(record, 4);
            }}
          />
        );
      },
    },
    {
      title: "Daily Consumption",
      dataIndex: "view",
      render: (_, record) => {
        return (
          <FormButton
            icon={<EyeOutlined />}
            type="text"
            onClick={() => {
              viewDailyExpenseReport(record, 3);
            }}
          />
        );
      },
    },
  ];

  const BranchDayRangecolumns = [
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
    },
    {
      title: "Business Day",
      dataIndex: "BusinessDay",
      key: "BusinessDay",
    },
    {
      title: "Open Date",
      dataIndex: "OpenDate",
      key: "OpenDate",
    },
    {
      title: "Opened By",
      dataIndex: "OpenedBy",
      key: "OpenedBy",
    },
    {
      title: "Close Date",
      dataIndex: "CloseDate",
      key: "CloseDate",
    },
    {
      title: "Closed By",
      dataIndex: "ClosedBy",
      key: "ClosedBy",
    },
    {
      title: "Financial",
      dataIndex: "view",
      render: (_, record) => {
        return (
          <FormButton
            icon={<EyeOutlined />}
            type="text"
            onClick={() => {
              viewReport(record, 8);
            }}
          />
        );
      },
    },
    {
      title: "Daily Consumption",
      dataIndex: "view",
      render: (_, record) => {
        return (
          <FormButton
            icon={<EyeOutlined />}
            type="text"
            onClick={() => {
              viewDailyExpenseReport(record, 3);
            }}
          />
        );
      },
    },
  ];

  const Shiftcolumns = [
    {
      title: "Shift",
      dataIndex: "ShiftName",
      key: "ShiftName",
    },
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
    },
    {
      title: "Business Day",
      dataIndex: "BusinessDay",
      key: "BusinessDay",
    },
    {
      title: "Shift Opening Date",
      dataIndex: "ShiftOpeningDate",
      key: "ShiftOpeningDate",
    },
    {
      title: "Shift Closing Date",
      dataIndex: "ShiftClosingDate",
      key: "ShiftClosingDate",
    },
    {
      title: "Open By",
      dataIndex: "OpenBy",
      key: "OpenBy",
    },
    {
      title: "Close By",
      dataIndex: "CloseBy",
      key: "CloseBy",
    },
    {
      title: "Financial",
      dataIndex: "view",
      render: (_, record) => {
        return (
          <FormButton
            icon={<EyeOutlined />}
            type="text"
            onClick={() => {
              viewReport(record, 5);
            }}
          />
        );
      },
    },
    // {
    //   title: "Daily Consumption",
    //   dataIndex: "view",
    //   render: (_, record) => {
    //     return (
    //       <FormButton
    //         icon={<EyeOutlined />}
    //         type="text"
    //         onClick={() => {
    //           viewDailyExpenseReport(record, 3);
    //         }}
    //       />
    //     );
    //   }
    // }
  ];

  const Terminalcolumns = [
    {
      title: "Terminal",
      dataIndex: "TerminalName",
      key: "TerminalName",
    },
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
    },
    {
      title: "Business Day",
      dataIndex: "BusinessDay",
      key: "BusinessDay",
    },
    {
      title: "Terminal Opening Date",
      dataIndex: "TerminalOpeningDate",
      key: "TerminalOpeningDate",
    },
    {
      title: "Terminal Closing Date",
      dataIndex: "TerminalClosingDate",
      key: "TerminalClosingDate",
    },
    {
      title: "Open By",
      dataIndex: "OpenBy",
      key: "OpenBy",
    },
    {
      title: "Close By",
      dataIndex: "CloseBy",
      key: "CloseBy",
    },
    {
      title: "Financial",
      dataIndex: "view",
      render: (_, record) => {
        return (
          <FormButton
            icon={<EyeOutlined />}
            type="text"
            onClick={() => {
              viewReport(record, 6);
            }}
          />
        );
      },
    },

    // {
    //   title: "Daily Consumption",
    //   dataIndex: "view",
    //   render: (_, record) => {
    //     return (
    //       <FormButton
    //         icon={<EyeOutlined />}
    //         type="text"
    //         onClick={() => {
    //           viewDailyExpenseReport(record, 3);
    //         }}
    //       />
    //     );
    //   }
    // }
  ];

  useEffect(() => {
    dispatch(
      setBranches(
        "/PosReports",
        { ...bodyData, OperationId: 0 },
        controller,
        userData
      )
    );
    dispatch(setInitialReports("/PosReports", bodyData, controller, userData));
    return () => {
      controller.abort();
    };
  }, []);

  //   useEffect(() => {
  //     // if (updateId !== null) {
  //     //   dispatch({
  //     //     type: UPDATE_FORM_FIELD,
  //     //     payload: itemList.filter((item) => item.ProvinceId === updateId)[0],
  //     //   });
  //     // }
  //     // setUpdateId(null);
  //   }, [updateId]);

  //   const handleSearchChange = (data) => {
  //     dispatch(setSearchFieldValue(data));
  //   };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (bodyData.DateFrom !== "" && bodyData.DateTo !== "") {
      if (new Date(bodyData.DateFrom) <= new Date(bodyData.DateTo)) {
        dispatch(
          setInitialReports("/PosReports", bodyData, controller, userData)
        );
      } else message.error("From Date must be less than to date  ");
    } else message.error("Please select both date");
  };

  const handleSearchChange = (event) => {
    if (event.name === "OperationId") {
      if (event.value !== null) {
        dispatch(
          setInitialReports(
            "/PosReports",
            { ...bodyData, [event.name]: event.value },
            controller,
            userData
          )
        );
      }
    }
    setBodyData({ ...bodyData, [event.name]: event.value });
  };

  // Consumption Report
  const ConsumptionReport = React.forwardRef((props, ref) => {
    const { reportData } = props;
    const productCategories = reportData?.length
      ? [...new Set(reportData?.map((item) => item.Category))]
      : [];
    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "white",
          margin: "10px 5px",
          fontWeight: "1000",
          color: "#000",
          overflow: "auto",
          pageBreakInside: "avoid",
          pageBreakAfter: "avoid",
          pageBreakBefore: "avoid",
        }}
        // className="main"
      >
        {/* heading */}
        {consumptionLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
            }}
          >
            <Spin spinning={consumptionLoading} />
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>Branch</p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {
                  branches.find((item) => item.BranchId === bodyData.BranchId)
                    .BranchName
                }
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Business Day
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {dailyConsumptionBday}
              </p>
            </div>
          </div>
        )}
        {productCategories.map((item) => (
          <div
          // className="main"
          >
            <p
              style={{
                border: "2px solid black",
                width: "100%",
                textAlign: "center",
                padding: 3,
                backgroundColor: "#f4f4f4",
              }}
            >
              {item}
            </p>
            <table style={{ marginBottom: 15 }}>
              <thead>
                <th>
                  <b>Product</b>
                </th>
                <th>
                  <b>Quantity</b>
                </th>
                <th>
                  <b>Unit</b>
                </th>
              </thead>
              <tbody>
                {reportData
                  ?.filter((product) => product.Category === item)
                  ?.map((currentItem) => (
                    <tr>
                      <td>{currentItem.Product}</td>
                      <td>{currentItem.Quantity}</td>
                      <td>{currentItem.UnitName}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* <table>
          <tr>
            <th style={{ fontWeight: "1000", color: "#000" }}>Category</th>
            <th style={{ fontWeight: "1000", color: "#000" }}>Product</th>
            <th style={{ fontWeight: "1000", color: "#000" }}>Quantity</th>
            <th style={{ fontWeight: "1000", color: "#000" }}>Unit</th>
          </tr>
          {reportData &&
            reportData.map((row) => {
              return (
                <tr>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {" "}
                    {row.Category}{" "}
                  </td>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {" "}
                    {row.Product}{" "}
                  </td>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {parseFloat(row.Quantity).toFixed(2)}
                  </td>
                  <td style={{ fontWeight: "1000", color: "#000" }}>
                    {row.UnitName}
                  </td>
                </tr>
              );
            })}
        </table> */}
      </div>
    );
  });

  return (
    <div>
      <h1 style={{ color: "#4561B9", fontSize: 28 }}>
        <b>Financial Report</b>
      </h1>
      <Card>
        <FormContainer
          rowStyle={{ alignItems: "flex-end" }}
          onSubmit={handleSearchSubmit}
        >
          <Col span={24}>
            <Row gutter={10} style={{ alignItems: "self-end" }}>
              <FormSelect
                listItem={branches || []}
                colSpan={4}
                idName="BranchId"
                valueName="BranchName"
                size={INPUT_SIZE}
                name="BranchId"
                className="textInput"
                label="Branches"
                value={bodyData.BranchId}
                onChange={handleSearchChange}
                required={true}
              />
              <Col span={4}>
                <div>Date From</div>
                <FormTextField
                  type={"date"}
                  style={{ width: "100%" }}
                  defaultValue={moment(new Date(), "YYYY-MM-DD")}
                  onChange={(e) => {
                    setBodyData({
                      ...bodyData,
                      DateFrom: e.value,
                    });
                  }}
                />
              </Col>
              <Col span={4}>
                <div>Date To</div>
                <FormTextField
                  type="date"
                  style={{ width: "100%" }}
                  defaultValue={moment(new Date(), "YYYY-MM-DD")}
                  onChange={(e) => {
                    setBodyData({
                      ...bodyData,
                      DateTo: e.value,
                    });
                  }}
                />
              </Col>
              {/* <Col span={4}> */}
              <FormSelect
                listItem={reportType || []}
                colSpan={4}
                idName="id"
                valueName="name"
                size={INPUT_SIZE}
                name="OperationId"
                className="textInput"
                label="Report Type"
                value={bodyData.OperationId}
                onChange={handleSearchChange}
                required={true}
              />
              {/* </Col> */}
              <Col span={2}>
                <FormButton
                  title="Search"
                  type="primary"
                  size={BUTTON_SIZE}
                  htmlType="submit"
                  icon={<SearchOutlined />}
                />
              </Col>
            </Row>
          </Col>
        </FormContainer>

        <div
          style={{ margin: "10px 0", borderTop: "1px solid lightgray" }}
        ></div>
        <Table
          dataSource={reportsList}
          columns={
            bodyData.OperationId === 1
              ? BranchDaycolumns
              : bodyData.OperationId === 2
              ? Shiftcolumns
              : bodyData.OperationId === 3
              ? Terminalcolumns
              : bodyData.OperationId === 7
              ? BranchDayRangecolumns
              : []
          }
          tableLoading={reportsGridLoading}
        />
      </Card>

      <ModalComponent
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Title level={5}>Daily Consumption Report</Title>
            <div style={{ display: "flex" }}>
              <Button
                onClick={() => {
                  setConsumptionReport(false);
                  setHtml("");
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
        isModalVisible={consumptionReport}
        // width={"70vw"}
        footer={[]}
      >
        <ConsumptionReport ref={reportRef} reportData={consumptionReport} />
      </ModalComponent>

      <FinancialReportModal
        financialModal={financialModal}
        setFinancialModal={setFinancialModal}
        record={data}
        operationId={operationId}
      />
    </div>
  );
};

export default Reports;
