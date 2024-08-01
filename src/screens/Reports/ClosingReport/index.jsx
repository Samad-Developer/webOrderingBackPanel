import { Button, Col, message, Row } from "antd";
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
import ClosingReportTemplate from "./ClosingReportTemplate";

const initialSearchValues = {
  CompanyId: null,
  BranchId: null,
  InvDate: "",
  ProductDtl: null,
  OperationId: null,
};

const ClosingReport = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [productDetials, setProductDetails] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [disableExcel, setDisableExcel] = useState(true);

  useEffect(() => {
    postRequest(
      "/CrudRPTClosingInventory",
      {
        CompanyId: userData.CompanyId,
        BranchId: null,
        InvDate: "",
        ProductDtl: null,
        OperationId: 1,
      },
      controller
    )
      .then((res) => {
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
    postRequest("/CrudRPTClosingInventory", {
      ...data,
      OperationId: 2,
      CompanyId: userData.CompanyId,
    })
      .then((res) => {
        if (res.data.DataSet.Table.length <= 0) {
          message.error("No Records found!");

          setTableData(res.data.DataSet.Table);
          setList(res.data.DataSet.Table);
          setDisableExcel(true);
          return;
        }
        setTableData(res.data.DataSet.Table);
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
          name="BranchId"
          label="Branch"
          value={data.BranchId}
          onChange={handleSearchChange}
          required={true}
        />
        <FormSelect
          colSpan={4}
          listItem={productDetials || []}
          idName="ProductDtl"
          valueName="ProductDetails"
          size={INPUT_SIZE}
          name="ProductDtl"
          label="Product Details"
          value={data.ProductDtl}
          onChange={handleSearchChange}
        />

        <FormTextField
          colSpan={4}
          label="Inventory Date"
          type="date"
          name="InvDate"
          size={INPUT_SIZE}
          value={data.InvDate}
          required={true}
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
        Closing Report
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>
      {/* <ReportComponent
        rows={list}
        customTable={true}
        disableExcel={disableExcel}
        table={
          <ClosingReportTemplate
            list={tableData}
            headList={[]}
            date={`Inv Date ${data.InvDate}`}
          />
        }
      /> */}
      <ReportExcelDownload
        fileName={`Closing Inventory Report:${data.InvDate}`}
      >
        {list.length > 0 && (
          <ClosingReportTemplate
            list={tableData}
            headList={[]}
            date={`Inv Date ${data.InvDate}`}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default ClosingReport;
