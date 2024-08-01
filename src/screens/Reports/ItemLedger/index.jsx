import { Button, Card, Col, message, Row, Spin } from "antd";
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
import ItemLedgerTemplate from "./itemledgertemplate.jsx";

const initialSearchValues = {
  CompanyId: null,
  BranchId: null,
  DateFrom: "",
  DateTo: "",
  ProductDtl: null,
  OperationId: null,
};

const ItemLedger = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supportingTable, setSupportingTable] = useState([]);
  const [branches, setBranches] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [disableExcel, setDisableExcel] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postRequest(
      "/CrudRPTItemLedger",
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
    setLoading(true);
    if (data.DateFrom > data.DateTo) {
      message.error("Invalid Date range");
      return;
    }
    postRequest("/CrudRPTItemLedger", {
      ...data,
      CompanyId: userData.CompanyId,
      OperationId: 2,
    })
      .then((res) => {
        setList(res.data.DataSet.Table1);
        if (res.data.DataSet.Table1.length === 0) {
          message.error("No Records found");
          setCategories([]);
          setDisableExcel(true);
          setLoading(false);
          return;
        }
        setCategories(res.data.DataSet.Table);
        setDisableExcel(false);
        setLoading(false);
        setSelectedBranch(
          branches.find((branch) => branch.BranchId === data.BranchId)
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
        Item Ledger
      </Title>
      <Card>
        <Row>
          <Col span={24}>{searchPanel}</Col>
        </Row>
      </Card>
      {/* <ReportComponent
        rows={list}
        customTable={true}
        disableExcel={disableExcel}
        table={
          <ItemLedgerTemplate
            list={list}
            headList={[]}
            categories={categories}
            date={` Period: ${data.DateFrom} To ${data.DateTo}`}
            branch={selectedBranch}
          />
        }
      /> */}
      <ReportExcelDownload
        fileName={`Item_ledger_Report: ${data.DateFrom}-${data.DateTo}`}
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
          <ItemLedgerTemplate
            list={list}
            headList={[]}
            categories={categories}
            date={` Period: ${data.DateFrom} To ${data.DateTo}`}
            branch={selectedBranch}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default ItemLedger;
