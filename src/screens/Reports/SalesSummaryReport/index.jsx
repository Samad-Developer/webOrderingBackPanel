import { Col, message, Row, Spin } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { INPUT_SIZE } from '../../../common/ThemeConstants';
import FormSelect from '../../../components/general/FormSelect';
import FormButton from '../../../components/general/FormButton';
import FormTextField from '../../../components/general/FormTextField';
import ReportPdfDownload from '../../../components/ReportingComponents/ReportPdfDownload';
import { currencyFormat } from '../../../functions/generalFunctions';
import { postRequest } from '../../../services/mainApp.service';
import salesSummaryTemplate from './salesSummaryTemplate';
import { renderToString } from 'react-dom/server';
import ReportExcelDownload from '../../../components/ReportingComponents/ReportExcelDownload';

const SalesSummaryReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState({
    CompanyId: userData.CompanyId,
    BranchId: userData.branchId,
    DateFrom: '',
    DateTo: '',
    UserId: userData.UserId,
  });
  const [branches, setBranches] = useState([]);
  const [reportData, setReportData] = useState('');
  const [disablePrint, setDisablePrint] = useState(true);
  const [loading, setLoading] = useState(false);
  const getReportData = (e) => {
    e.preventDefault();
    setLoading(true);
    if (data.DateFrom !== '' && data.DateTo !== '') {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        postRequest('salessummaryreport', data).then((res) => {
          setLoading(false);
          if (res.data.DataSet.Table.length === 0) {
            setDisablePrint(true);
            message.error('No Record found!');
            setReportData('');
            return;
          } else setDisablePrint(false);
          let resp = salesSummaryTemplate(res.data.DataSet);
          setReportData(resp);
        });
      } else {
        message.error('Please select DateTo greater than DateFrom');
        setDisablePrint(true);
      }
    } else {
      message.error('Please select both dates');
      setDisablePrint(true);
    }
  };

  useEffect(() => {
    postRequest('salessummaryreport', data).then((res) => {
      setBranches(res.data.DataSet.Table6);
    });
  }, [data.BranchId]);

  const fieldPanel = (
    <form>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
        <FormSelect
          colSpan={8}
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.BranchId || ''}
          onChange={(e) => setData({ ...data, BranchId: e.value })}
        />
        <FormTextField
          span={8}
          label="Date From"
          name="DateFrom"
          type="date"
          value={data.DateFrom}
          onChange={(e) => setData({ ...data, DateFrom: e.value })}
        />
        <FormTextField
          span={8}
          label="Date To"
          name="DateTo"
          type="date"
          value={data.DateTo}
          onChange={(e) => setData({ ...data, DateTo: e.value })}
        />
        <FormButton type="primary" title="Search" onClick={getReportData} />
      </div>
      <div style={{ margin: '10px 0', borderTop: '1px solid lightgray' }}></div>
    </form>
  );

  return (
    <div>
      <h2 style={{ color: '#4561B9' }}>Sales Summary Report</h2>
      {fieldPanel}

      {loading && (
        <Spin
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
      {/* <ReportPdfDownload
        fileName="sales_summary_report"
        elementId="report1"
        htmlFile={reportData}
        fieldPanel={fieldPanel}
        getReportFunc={getReportData}
        disablePDF={disablePrint}
      /> */}
      <ReportExcelDownload fileName={`Sales Summery Report`}>
        {reportData}
      </ReportExcelDownload>
    </div>
  );
};

export default SalesSummaryReport;
