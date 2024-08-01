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
import BranchStockReportTempBw from "./StockReportBatchTemp.jsx";

const initialSearchValues = {
  BranchId: null,
  AsOnDate: "",
};

const BranchStockReportBrWise = () => {
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
    setList([]);
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
      OperationId: 3,
    })
      .then((res) => {
        if (res.data.DataSet.Table.length <= 0) {
          message.error("No records found!");
          setList([]);
          setDisableExcel(true);
          setLoading(false);
          return;
        }
        setList(res.data.DataSet.Table);
        setDisableExcel(false);
        setLoading(false);
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
        Branch Stock Report Batch wise
        {}
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>
      {/* <ReportComponent
        rows={list}
        customTable={true}
        disableExcel={disableExcel}
        table={
          <BranchStockReportTempBw
            list={list}
            headList={list.length > 0 ? Object.keys(list[0]) : []}
            date={`As Date On: ${data.AsOnDate}`}
            branch={selectedBranch}
          />
        }
      /> */}

      <ReportExcelDownload>
        <>
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
            <BranchStockReportTempBw
              list={list}
              headList={list.length > 0 ? Object.keys(list[0]) : []}
              date={`As Date On: ${data.AsOnDate}`}
              branch={selectedBranch}
            />
          )}
        </>
      </ReportExcelDownload>
    </div>
  );
};

export default BranchStockReportBrWise;
