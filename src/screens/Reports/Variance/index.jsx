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
import VarianceRepTemp from "./varianceRepTemp.jsx";

const initialSearchValues = {
  CompanyId: null,
  OperationId: null,
  BranchId: null,
  DateFrom: "",
  DateTo: "",
};

const VarianceReport = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [disableExcel, setDisableExcel] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postRequest(
      "/InventoryItemReport",
      {
        ...data,
        CompanyId: userData.CompanyId,
        BranchId: userData.branchId,
        OperationId: 1,
      },
      controller
    )
      .then((res) => {
        setCategoryList(res.data.DataSet.Table);
        setBranchList(res.data.DataSet.Table1);
        setCategoryList(res.data.DataSet.Table);
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
    postRequest("/inventoryitemreport", {
      ...data,
      CompanyId: userData.CompanyId,
      OperationId: 2,
    })
      .then((res) => {
        setLoading(false);
        if (!res.data.DataSet.Table.length) {
          setList([]);
          setParentList([]);
          setTotalList([]);
          setDisableExcel(true);
          message.error("No records found!");
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
        <FormTextField
          colSpan={4}
          label="Product Name"
          name="ProductName"
          size={INPUT_SIZE}
          value={data.ProductName}
          onChange={handleSearchChange}
        />

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

        <FormSelect
          colSpan={4}
          listItem={categoryList || []}
          idName="CategoryId"
          valueName="CategoryName"
          size={INPUT_SIZE}
          name="CategoryId"
          label="Category"
          value={data.CategoryId}
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
        Variance Report
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>

      <ReportExcelDownload
        fileName={`Variance_Report_${data.DateFrom} - ${data.DateTo}`}
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
          <VarianceRepTemp
            list={list}
            headList={[]}
            date={` Period of ${data.DateFrom} To ${data.DateTo}`}
            branch={
              branchList.find((item) => item.BranchId === data.BranchId)
                ?.BranchName
            }
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default VarianceReport;
