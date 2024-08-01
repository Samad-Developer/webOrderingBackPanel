import { Button, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/skeleton/Title";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ReportComponent from "../../../components/formComponent/ReportComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import ReportPdfDownload from "../../../components/ReportingComponents/ReportPdfDownload";
import { setBranches } from "../../../redux/actions/reportActions";
import { postRequest } from "../../../services/mainApp.service";
import HourlyProductSaleReportTemp from "./HourlyProductSaleReportTemp";

const HourlyProductSaleReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const { branches } = useSelector((state) => state.reportsReducer);
  const [disableExcel, setDisableExcel] = useState(true);
  const testItem = "testItem";
  const dispatch = useDispatch();
  const [data, setData] = useState({
    OperationId: 1,
    CompanyId: null,
    UserId: userData.UserId,
    BranchId: null,
    DateFrom: null,
    DateTo: null,
  });

  const [reportData, setReportData] = useState([]);
  const controller = new window.AbortController();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(
      setBranches(
        "/PosReports",
        {
          ...data,
          OperationId: 0,
          CompanyId: userData.CompanyId,
        },
        controller,
        userData
      )
    );
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        postRequest("HourlyProductSaleReport", {
          ...data,
          OperationId: 2,
          CompanyId: userData.CompanyId,
        }).then((res) => {
          setLoading(false);
          if (!res.data.DataSet.Table.length) {
            message.error("Records not found!");
            return;
          }
          setReportData(res.data.DataSet.Table);
          setDisableExcel(false);
        });
      } else {
        message.error("Please select DateTo greater than DateFrom");
      }
    } else {
      message.error("Please select both dates");
    }
  };

  const fieldPanel = (
    <form onSubmit={handleSearchSubmit}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        <FormSelect
          colSpan={4}
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.BranchId || ""}
          onChange={(e) => {
            setData({ ...data, BranchId: e.value });
          }}
          required={true}
        />
        <FormTextField
          span={4}
          label="Date From"
          name="DateFrom"
          type="date"
          value={data.DateFrom}
          onChange={(e) => setData({ ...data, DateFrom: e.value })}
        />
        <FormTextField
          span={4}
          label="Date To"
          name="DateTo"
          type="date"
          value={data.DateTo}
          onChange={(e) => setData({ ...data, DateTo: e.value })}
        />

        <Button type="primary" htmlType="submit" style={{ marginLeft: "auto" }}>
          Search
        </Button>
      </div>
      <div style={{ margin: "10px 0", borderTop: "1px solid lightgray" }}></div>
    </form>
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <h2 style={{ color: "#4561B9" }}>Hourly Product Sale Report</h2>

      <Row>
        <Col span={24}>{fieldPanel}</Col>
      </Row>

      <ReportExcelDownload
        fileName={`Daily Sale Report ${data.DateFrom} - ${data.DateTo}`}
        // hidePdf={1}
      >
        {loading && (
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
        {reportData.length > 0 && (
          <HourlyProductSaleReportTemp
            list={reportData}
            branch={
              branches.find((x) => x.BranchId === data.BranchId).BranchName
            }
            headList={reportData.length > 0 ? Object.keys(reportData[0]) : []}
            date={`Date Range: ${data.DateFrom} to ${data.DateTo}`}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default HourlyProductSaleReport;
