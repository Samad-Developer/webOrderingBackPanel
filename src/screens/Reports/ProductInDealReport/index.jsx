import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import { tuple } from "antd/lib/_util/type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ReportComponent from "../../../components/formComponent/ReportComponent";
import FormSearchSelect from "../../../components/general/FormSearchSelect";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { resetState } from "../../../redux/actions/basicFormAction";
import { postRequest } from "../../../services/mainApp.service";
import ProductInDealTemp from "./ProductInDealTemp";
const initialSearchValues = {
  CompanyId: null,
  ProductDetailId: 0
};

const ProductInDealReport = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postRequest(
      "/ProductInDealReport",
      {
        ...data,
        CompanyId: userData.CompanyId,
        OperationId: 1
      },
      controller
    )
      .then((res) => {
        setProductList(res.data.DataSet.Table);
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
    if (data.ProductDetailId === null) {
      message.error("Select Product Detail First");
      return;
    }
    setLoading(true);
    postRequest("/ProductInDealReport", {
      ...data,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      OperationId: 2
    })
      .then((res) => {
        setLoading(false);
        if (!res.data.DataSet.Table.length) {
          message.error("No records found!");
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
        <FormSearchSelect
          colSpan={6}
          listItem={productList || []}
          idName="ProductDetailId"
          valueName="ProductName"
          size={INPUT_SIZE}
          name="ProductDetailId"
          label="Product Name"
          value={data.ProductDetailId}
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
      <Title level={4} type="primary">
        Product In Deal Report
      </Title>
      <Row>
        <Col span={24}>
          <Card>{searchPanel}</Card>
        </Col>
      </Row>

      <ReportExcelDownload fileName={`Product_In_Deal_Report_${data.AsOnDate}`}>
        {loading && (
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          />
        )}
        {list.length > 0 && (
          <ProductInDealTemp
            list={list}
            headList={list.length > 0 ? Object.keys(list[0]) : []}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default ProductInDealReport;
