import { Button, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSearchSelect from "../../../components/general/FormSearchSelect";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { getDate } from "../../../functions/dateFunctions";
import { resetState } from "../../../redux/actions/basicFormAction";
import { postRequest } from "../../../services/mainApp.service";
import InventoryItemByProductTemplate from "./InventoryItemByProductTemplate";

const initialSearchValues = {
  OperationId: 1,
  CompanyId: null,
  BranchId: null,
  ProductDetailId: null,
  CategoryId: null,
  ProductId: null,
  ProductDetailId: null,
  DateFrom: "",
  DateTo: ""
};

const InventoryItemByProduct = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productDetailList, setProductDetailList] = useState([]);
  const [disableExcel, setDisableExcel] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postRequest(
      "/InventoryItemByProductReport",
      {
        ...data,
        CompanyId: userData.CompanyId,
        BranchId: userData.branchId,
        OperationId: 1,
        UserId: userData.UserId
      },
      controller
    )
      .then((res) => {
        const { Table, Table1, Table2, Table3 } = res?.data?.DataSet;
        setBranchList(Table);
        setCategoryList(Table1);
        setProductList(Table2);
        setProductDetailList(Table3);
        setData({ ...data, DateFrom: getDate(), DateTo: getDate() });
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
    postRequest("/InventoryItemByProductReport", {
      ...data,
      CompanyId: userData.CompanyId,
      OperationId: 2
    })
      .then((res) => {
        setLoading(false);
        if (res.data.DataSet.Table.length === 0) {
          message.error("No records found!");
          setList([]);
          setParentList([]);
          setTotalList([]);
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
          colSpan={3}
          listItem={branchList}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          disabled={branchList.length === 0}
          value={data.BranchId}
          required={true}
          onChange={handleSearchChange}
        />

        <FormSelect
          colSpan={4}
          listItem={categoryList}
          idName="CategoryId"
          valueName="CategoryName"
          size={INPUT_SIZE}
          name="CategoryId"
          label="Category"
          disabled={categoryList.length === 0}
          value={data.CategoryId}
          onChange={handleSearchChange}
        />

        <FormSelect
          colSpan={4}
          listItem={productList.filter(
            (x) => x.CategoryId === data.CategoryId || data.CategoryId === null
          )}
          idName="ProductId"
          valueName="ProductName"
          size={INPUT_SIZE}
          name="ProductId"
          label="Product"
          disabled={productList.length === 0}
          value={data.ProductId}
          onChange={handleSearchChange}
        />

        <FormSearchSelect
          colSpan={4}
          listItem={productDetailList.filter(
            (x) =>
              (x.CategoryId === data.CategoryId || data.CategoryId === null) &&
              (x.ProductId === data.ProductId || data.ProductId === null)
          )}
          idName="ProductDetailId"
          valueName="ProductSizeName"
          size={INPUT_SIZE}
          name="ProductDetailId"
          label="Product Detail"
          disabled={productDetailList.length === 0}
          value={data.ProductDetailId}
          onChange={handleSearchChange}
          required={true}
        />

        <FormTextField
          colSpan={3}
          label="Date From"
          name="DateFrom"
          value={data.DateFrom}
          onChange={handleSearchChange}
          type="date"
        />

        <FormTextField
          colSpan={3}
          label="Date To"
          name="DateTo"
          value={data.DateTo}
          onChange={handleSearchChange}
          type="date"
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
        Inventory Item By Product Report
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>
      {loading && (
        <Spin
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        />
      )}
      <ReportExcelDownload
        fileName={`InventoryItemByProduct_${data.DateFrom}_${data.DateTo}`}
      >
        {list.length > 0 && (
          <InventoryItemByProductTemplate
            list={list}
            headList={[]}
            date={`For the Period of ${data.DateFrom} To ${data.DateTo}`}
            branch={
              branchList?.find((item) => item.BranchId === data.BranchId)
                .BranchName
            }
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default InventoryItemByProduct;
