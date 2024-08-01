import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import { tuple } from "antd/lib/_util/type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ReportComponent from "../../../components/formComponent/ReportComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { resetState } from "../../../redux/actions/basicFormAction";
import { postRequest } from "../../../services/mainApp.service";
import BranchStockReportTemp from "./StockReportTemp.jsx";

const initialSearchValues = {
  BranchId: null,
  AsOnDate: "",
};

const BranchStockReport = () => {
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
      "/BranchStockReport",
      {
        ...data,
        CompanyId: userData.CompanyId,
        OperationId: 1,
        UserId: userData.UserId,
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
    setSelectedBranch(
      branchList.filter((branch) => branch.BranchId === data.BranchId)[0]
        ?.BranchName
    );
    postRequest("/BranchStockReport", {
      ...data,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      OperationId: 2,
    })
      .then((res) => {
        setLoading(false);
        if (!res.data.DataSet.Table.length) {
          message.error("No records found!");
          setList([]);
          setDisableExcel(true);
          return;
        }
        setList(res.data.DataSet.Table);
        setDisableExcel(false);
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
          name="AsOnDate"
          size={INPUT_SIZE}
          value={data.AsOnDate}
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
        Branch Stock Report
        {}
      </Title>
      <Row>
        <Col span={24}>
          <Card>{searchPanel}</Card>
        </Col>
      </Row>

      <ReportExcelDownload fileName={`Branch_Stock_Report_${data.AsOnDate}`}>
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
          <BranchStockReportTemp
            list={list}
            headList={list.length > 0 ? Object.keys(list[0]) : []}
            date={`As Date On: ${data.AsOnDate}`}
            branch={selectedBranch}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default BranchStockReport;
