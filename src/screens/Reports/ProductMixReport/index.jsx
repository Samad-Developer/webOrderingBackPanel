import { Col, message, Row, Spin } from "antd";
import Title from "antd/lib/skeleton/Title";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormButton from "../../../components/general/FormButton";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import ReportPdfDownload from "../../../components/ReportingComponents/ReportPdfDownload";
import { postRequest } from "../../../services/mainApp.service";
import {
  productMixReportTemplate,
  HTML_Chunk,
} from "./productMixReportTemplate";

const ProductMixReport = () => {
  const userData = useSelector((state) => state.authReducer);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    CompanyId: userData.CompanyId,
    BranchId: userData.BranchId,
    DateFrom: "",
    DateTo: "",
    UserId: userData.UserId,
  });
  const [reportData, setReportData] = useState("");
  const [disablePrint, setDisablePrint] = useState(true);
  const [branches, setBranches] = useState([]);

  const getReportData = (e) => {
    e.preventDefault();
    setLoading(true);
    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        postRequest("ProductMixReport", data).then((res) => {
          setLoading(false);
          if (res.data.DataSet.Table.length === 0) {
            setDisablePrint(true);
            message.error("No records found");
            setReportData("");

            return;
          } else setDisablePrint(false);

          const groupByCategory = res.data.DataSet.Table.reduce(
            (group, product) => {
              const { CategoryName } = product;
              group[CategoryName] = group[CategoryName] ?? [];
              group[CategoryName].push(product);
              return group;
            },
            {}
          );

          const newArr = Object.entries(groupByCategory);

          // let htmlObj = HTML_Chunk(
          //   newArr,
          //   res.data.DataSet.Table1[0].SubTotalWithoutGST
          // );

          let resp = productMixReportTemplate({
            // body: htmlObj.html,
            footerData: res.data.DataSet.Table1,
            DATE_FROM: data.DateFrom,
            DATE_TO: data.DateTo,
            tableItems: newArr,
            branchName: branches.find((x) => x.BranchId === data.BranchId)
              ?.BranchName,
          });

          setReportData(resp);
        });
      } else {
        setLoading(false);

        setDisablePrint(true);
        message.error("Please select DateTo greater than DateFrom");
      }
    } else {
      setLoading(false);
      setDisablePrint(true);
      message.error("Please select both dates");
    }
  };

  useEffect(() => {
    postRequest("ProductMixReport", data).then((res) => {
      setBranches(res.data.DataSet.Table2);
    });
  }, []);

  const fieldPanel = (
    <Row gutter={10} style={{ alignItem: "self-end" }}>
      <FormSelect
        colSpan={8}
        listItem={branches || []}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={data.BranchId || ""}
        onChange={(e) => setData({ ...data, BranchId: e.value })}
        // disabled={!supportingTable.Table1}
      />
      <FormTextField
        span={8}
        label="Date From"
        name="DateFrom"
        type="date"
        value={data.DateFrom}
        onChange={(e) => setData({ ...data, DateFrom: e.value })}
        required={true}
      />
      <FormTextField
        span={8}
        label="Date To"
        name="DateTo"
        type="date"
        value={data.DateTo}
        onChange={(e) => setData({ ...data, DateTo: e.value })}
        required={true}
      />
      <div>
        <br />
        <FormButton title="Search" onClick={getReportData} type="primary" />
      </div>
    </Row>
  );

  return (
    <div>
      <h2 style={{ color: "#4561B9" }}>Product Mix Report</h2>
      <Row>{fieldPanel}</Row>
      <ReportExcelDownload fileName={`Product Mix Report`}>
        {loading && (
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
        <div style={{ background: "white", padding: 20 }}>{reportData}</div>
      </ReportExcelDownload>
    </div>
  );
};

export default ProductMixReport;
