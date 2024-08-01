import { EyeFilled } from '@ant-design/icons';
import { Button, Row, Table, TimePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { INPUT_SIZE } from '../../common/ThemeConstants';
import BasicFormComponent from '../../components/formComponent/BasicFormComponent';
import ModalComponent from '../../components/formComponent/ModalComponent';
import FormCheckbox from '../../components/general/FormCheckbox';
import FormSelect from '../../components/general/FormSelect';
import FormTextField from '../../components/general/FormTextField';
import { convertToDateFormat } from "../../utils/commonfunction"
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from '../../redux/actions/basicFormAction';

const initialFormValues = {
  OperationId: 1,
  SalesReturnId: null,
  SalesReturnNumber: null,
  UserId: null,
  Date: null,
  BranchId: null,
  UserIP: '',
  OrderMasterId: null,
  NetAmount: null,
  CompanyId: null,
  SalesReturnDetail: [],
  DiscountPercent: 0,
};

const initialSearchValues = {
  OperationId: 1,
  SalesReturnId: null,
  SalesReturnNumber: null,
  UserId: null,
  Date: null,
  BranchId: null,
  UserIP: '',
  OrderMasterId: null,
  NetAmount: null,
  CompanyId: null,
  SalesReturnDetail: [],
  DiscountPercent: 0,
};


const orderTableColumn = [
  {
    title: 'Product',
    dataIndex: 'Column1',
    key: 'column1',
  },
  {
    title: 'Order Date',
    dataIndex: 'OrderDate',
    key: 'orderDate',
  },
  {
    title: 'Order Number',
    dataIndex: 'OrderNumber',
    key: 'orderNumber',
  },
  {
    title: 'Price Without TAX',
    dataIndex: 'PriceWithoutGST',
    key: 'priceWithoutGST',
  },
  {
    title: 'Quantity',
    dataIndex: 'Quantity',
    key: 'quantity',
  },
];

const SalesReturn = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState('');
  const [tableData, setTableData] = useState([]);
  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    dispatch(
      setInitialState(
        '/CrudSaleReturn',
        initialSearchValues,
        { ...initialFormValues, BranchId: userData.branchId },
        initialSearchValues,
        controller,
        userData,
      ),
    );

    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, [userData]);

  const columns = [
    {
      title: 'Sales Return Number',
      dataIndex: 'SalesReturnNumber',
      key: 'salesReturnNumber',
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'date',
      render: (_, record) => (
        convertToDateFormat(record.Date)
      ),
    },
    {
      title: 'Order Number',
      dataIndex: 'OrderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Net Amount',
      dataIndex: 'NetAmount',
      key: 'netAmount',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type='text'
          onClick={() => handleOpen(record)}
          icon={<EyeFilled className='blueIcon' />}></Button>
      ),
    },
  ];

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleOpen = async (record) => {
    setIsModalOpen(true);
    setCurrentRecord(record);

    const res = await axios.post('/CrudSaleReturn', {
      ...initialFormValues,
      OrderMasterId: record.orderMasterId,
      BranchId: userData.userBranchList[0].BranchId,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: userData.UserIP,
      SalesReturnId: record.SalesReturnId,
      SalesReturnNumber: record.SalesReturnNumber,
      OperationId: 7,
    });

    setTableData(res.data.DataSet.Table);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.AreaName = searchFields.AreaName.trim();
    dispatch(
      setInitialState(
        '/CrudArea',
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData,
      ),
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow('/CrudArea', { AreaId: id }, controller, userData));
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        '/CrudArea',
        formFields,
        initialFormValues,
        controller,
        userData,
        id,
      ),
    );
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label='Sales Return Number'
        size={INPUT_SIZE}
        name='SalesReturnNumber'
        value={searchFields.SalesReturnNumber}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label='Order Number'
        name='OrderNumber'
        size={INPUT_SIZE}
        value={searchFields.OrderNumber}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label='Date'
        type='date'
        name='Date'
        size={INPUT_SIZE}
        value={searchFields.Date}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        tabIndex='3'
        colSpan={8}
        label='Area Name'
        name='AreaName'
        size={INPUT_SIZE}
        value={formFields.AreaName}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName='CountryId'
        valueName='CountryName'
        size={INPUT_SIZE}
        name='CountryId'
        label='Country'
        value={formFields.CountryId}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        tabIndex='1'
        colSpan={8}
        listItem={
          supportingTable.Table2
            ? supportingTable.Table2.filter(
              (item) => item.CountryId === formFields.CountryId,
            )
            : []
        }
        disabled={!supportingTable.Table2 || formFields.CountryId === null}
        idName='ProvinceId'
        valueName='ProvinceName'
        size={INPUT_SIZE}
        name='ProvinceId'
        label='Province'
        value={formFields.ProvinceId}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        colSpan={8}
        listItem={
          supportingTable.Table3
            ? supportingTable.Table3.filter(
              (item) => item.ProvinceId === formFields.ProvinceId,
            )
            : []
        }
        disabled={!supportingTable.Table3 || formFields.ProvinceId === null}
        idName='CityId'
        valueName='CityName'
        size={INPUT_SIZE}
        name='CityId'
        label='City'
        value={formFields.CityId}
        onChange={handleFormChange}
        required={true}
      />
      <div
        className='ant-col ant-col-8'
        style={{
          paddingLeft: '4px',
          paddingRight: '4px',
        }}>
        <label htmlFor=''>Start Time</label>
        <TimePicker
          style={{ width: '100%' }}
          placeholder='Start Time'
          value={
            formFields.StartTime
              ? moment(formFields.StartTime, 'hh:mm')
              : formFields.StartTime
          }
          required={true}
          onChange={(_, timeString) => {
            handleFormChange({ name: 'StartTime', value: timeString });
          }}
        />
      </div>

      <div
        className='ant-col ant-col-8'
        style={{
          paddingLeft: '4px',
          paddingRight: '4px',
        }}>
        <label htmlFor=''>End Time</label>
        <TimePicker
          style={{ width: '100%' }}
          placeholder='End Time'
          value={
            formFields.EndTime
              ? moment(formFields.EndTime, 'hh:mm')
              : formFields.EndTime
          }
          required={true}
          onChange={(_, timeString) => {
            handleFormChange({ name: 'EndTime', value: timeString });
          }}
        />
      </div>

      <FormCheckbox
        colSpan={8}
        checked={formFields.IsEnable}
        name='IsEnable'
        onChange={handleFormChange}
        label='Enabled'
      />
    </Fragment>
  );

  return (
    <>
      <BasicFormComponent
        formTitle='Sales Return'
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID='AreaId'
        editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle='Sale Return'
        hideAction={true}
        hideAddButton={true}
      />
      <ModalComponent
        title='View Sale Return'
        width='70vw'
        isModalVisible={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}>
        <Row gutter={8}>
          <FormTextField
            colSpan={8}
            label='Branch Name'
            size={INPUT_SIZE}
            name='BranchName'
            value={currentRecord.BranchName}
            disabled
          />
          <FormTextField
            colSpan={8}
            label='Net Amount'
            type='number'
            size={INPUT_SIZE}
            name='NetAmount'
            value={currentRecord.NetAmount}
            disabled
          />
          <FormTextField
            colSpan={8}
            label='Order Date'
            type='date'
            size={INPUT_SIZE}
            name='OrderDate'
            value={convertToDateFormat(currentRecord.Date)}
            disabled
          />
          <FormTextField
            colSpan={8}
            label='Order Number'
            size={INPUT_SIZE}
            name='OrderNumber'
            value={currentRecord.OrderNumber}
            disabled
          />
          <FormTextField
            colSpan={8}
            label='Sales Return Number'
            size={INPUT_SIZE}
            name='SalesReturnNumber'
            value={currentRecord.SalesReturnNumber}
            disabled
          />
        </Row>
        <br />
        <br />
        <Table dataSource={tableData} columns={orderTableColumn} />;
      </ModalComponent>
    </>
  );
};

export default SalesReturn;
