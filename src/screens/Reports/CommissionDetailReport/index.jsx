import { Button, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ReportComponent from "../../../components/formComponent/ReportComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { resetState } from "../../../redux/actions/basicFormAction";
import { postRequest } from "../../../services/mainApp.service";
import CommissionDetReportTemp from "./CommissionRepTemp";

const initialSearchValues = {
  CompanyId: null,
  BranchId: null,
  OperationId: null,
  DateFrom: "",
  DateTo: "",
  OperationId: 1,
  UserId: null,
};
const initialBranchValues = {
  BranchId: null,
  BranchName: "",
  CityId: null,
  IsEnable: true,
  NTNNumber: "",
  NTNName: "",
  BusinessDayStartTime: "2011-10-05T14:48:00.000Z",
  BusinessDayEndTime: "2011-10-05T14:48:00.000Z",
  IsCallCenter: false,
  BranchDetail: [],
  IsWarehouse: false,
};

const CommissionDetailReport = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [disableExcel, setDisableExcel] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postRequest(
      "/CommisionDetailReport",
      {
        ...data,
        CompanyId: userData.CompanyId,
        OperationId: 1,
        UserId: userData.CompanyId,
      },
      controller
    )
      .then((res) => {
        setBranchList(res.data.DataSet.Table);
      })
      .catch((err) => console.error(err));
    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  const handleSearchChange = (e) => {
    setData({ ...data, [e.name]: e.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    postRequest("/CommisionDetailReport", {
      ...data,
      CompanyId: userData.CompanyId,
      UserId: userData.CompanyId,
      OperationId: 2,
    })
      .then((res) => {
        setLoading(false);
        if (res.data.DataSet.Table.length <= 0) {
          setList([]);
          message.error("No records found!");
          setDisableExcel(true);
          return;
        }
        setList(res.data.DataSet.Table);
        setDisableExcel(false);
        setSelectedBranch(
          branchList.filter((item) => item.BranchId === data.BranchId)[0]
            .BranchName
        );
      })
      .catch((err) => console.error(err));
  };

  const searchPanel = (
    <form onSubmit={handleSearchSubmit}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <FormSelect
          colSpan={4}
          listItem={branchList || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.BranchId}
          required={true}
          onChange={handleSearchChange}
        />

        <FormTextField
          colSpan={4}
          label="Date"
          type="date"
          name="DateFrom"
          size={INPUT_SIZE}
          value={data.DateFrom}
          onChange={handleSearchChange}
        />

        <FormTextField
          colSpan={4}
          label="Date"
          type="date"
          name="DateTo"
          size={INPUT_SIZE}
          value={data.DateTo}
          onChange={handleSearchChange}
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
      <Title level={3} type="primary">
        Commission Detail Report:
        {}
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>
      {/* <ReportComponent
        rows={list}
        customTable={true}
        table={
          <CommissionDetReportTemp
            list={list}
            headList={list.length > 0 ? Object.keys(list[0]) : []}
            date={`Period: ${data.DateFrom} To ${data.DateTo}`}
            branch={selectedBranch}
          />
        }
        disableExcel={disableExcel}
      /> */}
      <ReportExcelDownload
        fileName={`Commission_Detail_Report_${data.DateFrom} - ${data.DateTo}`}
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
        {list.length > 0 && (
          <CommissionDetReportTemp
            list={list}
            headList={list.length > 0 ? Object.keys(list[0]) : []}
            date={`Period: ${data.DateFrom} To ${data.DateTo}`}
            branch={selectedBranch}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default CommissionDetailReport;
