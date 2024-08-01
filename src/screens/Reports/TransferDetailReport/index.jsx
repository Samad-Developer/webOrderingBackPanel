import { Button, Col, message, Row, Spin } from "antd";
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
import TransferDetailTemplate from "./TransferDetailTemplate";

const initialSearchValues = {
  CompanyId: null,
  BranchId: null,
  DateFrom: "",
  DateTo: "",
  ProductDtl: null,
  OperationId: null,
};

const TransferDetailReport = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [supportingTable, setSupportingTable] = useState([]);
  const [branches, setBranches] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postRequest(
      "/CrudRPTTransferDetail",
      {
        ...data,
        CompanyId: userData.CompanyId,
        BranchId: userData.branchId,
        OperationId: 1,
      },
      controller
    )
      .then((res) => {
        if (!res.data.DataSet.Table.length) {
          message.error("No Record found!");
          return;
        }
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
    setLoading(true);
    if (data.DateFrom > data.DateTo) {
      message.error("Invalid Date range");
      return;
    }

    postRequest("/CrudRPTTransferDetail", {
      ...data,
      CompanyId: userData.CompanyId,
      OperationId: 2,
    })
      .then((res) => {
        setLoading(false);
        if (res.data.DataSet.Table.length <= 0) {
          message.error("No Records Found.");
          setList([]);
          return;
        }
        setList(res.data.DataSet.Table);
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
        />
        <FormSelect
          colSpan={4}
          listItem={productDetails || []}
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
        Transfer Detail Report
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>
      {/* <ReportComponent
        rows={list}
        customTable={true}
        table={
          <TransferDetailTemplate
            list={list}
            headList={list.length > 0 ? Object.keys(list[0]) : []}
            date={`Period ${data.DateFrom} To ${data.DateTo}`}
          />
        }
      /> */}
      <ReportExcelDownload
        fileName={`Transfer_Detail_Report: ${data.DateFrom} to ${data.DateTo}`}
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
          <TransferDetailTemplate
            list={list}
            headList={list.length > 0 ? Object.keys(list[0]) : []}
            date={`Period ${data.DateFrom} To ${data.DateTo}`}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default TransferDetailReport;
