import { Button, Col, message, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ReportComponent from "../../../components/formComponent/ReportComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { dateformatFunction } from "../../../functions/dateFunctions";
import { resetState } from "../../../redux/actions/basicFormAction";
import { postRequest } from "../../../services/mainApp.service";
import BranchRecieveingTemplate from "./branchReceivingTemplate.jsx";

const initialSearchValues = {
  CompanyId: null,
  DateFrom: "",
  DateTo: "",
  OperationId: null,
  IssueBranchId: null,
  ReceiveBranchId: null,
};

const BranchRecevingReport = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [headList, setHeadList] = useState([]);
  const [supportingTable, setSupportingTable] = useState([]);
  const [branches, setBranches] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [parentList, setParentList] = useState([]);
  const [totalList, setTotalList] = useState([]);
  const [disableExcel, setDisableExcel] = useState(true);

  useEffect(() => {
    postRequest(
      "/IssuanceVsReceivingReport",
      {
        ...data,
        CompanyId: userData.CompanyId,
        BranchId: userData.branchId,
        OperationId: 1,
      },
      controller
    )
      .then((res) => {
        setSupportingTable(res.data.DataSet);
        setBranches(res.data.DataSet.Table);
        setProductDetails(res.data.DataSet.Table1);
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
    if (data.DateFrom > data.DateTo) {
      message.error("Invalid Date range");
      return;
    }

    postRequest("/IssuanceVsReceivingReport", {
      ...data,
      CompanyId: userData.CompanyId,
      OperationId: 2,
    })
      .then((res) => {
        if (res.data.DataSet.Table.length <= 0) {
          message.error("No records found!");
          setDisableExcel(true);
          setList([]);
          setParentList([]);
          setTotalList([]);
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
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="IssueBranchId"
          label=" Issue Branch"
          value={data.IssueBranchId}
          onChange={handleSearchChange}
          required
        />
        <FormSelect
          colSpan={4}
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="ReceiveBranchId"
          label="Receiving Branch"
          value={data.ReceiveBranchId}
          onChange={handleSearchChange}
          required
        />

        <FormTextField
          colSpan={4}
          label="Date From"
          type="date"
          name="DateFrom"
          size={INPUT_SIZE}
          value={data.DateFrom}
          required={true}
          onChange={handleSearchChange}
        />
        <FormTextField
          colSpan={4}
          label="Date to"
          type="date"
          name="DateTo"
          size={INPUT_SIZE}
          value={data.DateTo}
          required={true}
          onChange={handleSearchChange}
          max={dateformatFunction(Date.now())}
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
        Issuance/Transfer vs Branch Receiving Report
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>
      {/* <ReportComponent
        rows={list}
        headList={[
          "Issuance",
          "Date",
          "Issue/Transfer",
          "Branch",
          "Receiving",
          "Branch",
          "Document No",
          "Receiving No",
          "Product Name",
          "Unit Name",
          "Issuance/Transfer Quantity",
          "Received Quantity",
          "Quantity Difference",
        ]}
        customTable={true}
        disableExcel={disableExcel}
        table={
          <BranchRecieveingTemplate
            list={list}
            headList={[]}
            date={`For the Period of ${data.DateFrom} To ${data.DateTo}`}
          />
        }
      /> */}

      <ReportExcelDownload
      // htmlFile={
      //   <BranchRecieveingTemplate
      //     list={list}
      //     headList={[]}
      //     date={`For the Period of ${data.DateFrom} To ${data.DateTo}`}
      //   />
      // }
      >
        {list.length > 0 && (
          <BranchRecieveingTemplate
            list={list}
            headList={[]}
            date={`For the Period of ${data.DateFrom} To ${data.DateTo}`}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default BranchRecevingReport;
