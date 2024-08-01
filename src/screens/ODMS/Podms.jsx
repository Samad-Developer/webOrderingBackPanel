import React, { useState, useEffect, useRef } from 'react';
import FormTextField from '../../components/general/FormTextField';
import { INPUT_SIZE } from '../../common/ThemeConstants';
import {
  Col,
  Drawer,
  Tabs,
  Row,
  Table,
  Collapse,
  Button,
  message,
  Input,
  Typography,
} from "antd";
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons';
// import { Button, Spin } from "antd";
import FormSelect from '../../components/general/FormSelect';
import { useSelector } from 'react-redux';
import moment from "moment";
import { SearchOutlined } from '@ant-design/icons';
import FormButton from '../../components/general/FormButton';
import { postRequest } from '../../services/mainApp.service';
import { getTime } from '../../functions/dateFunctions';
import ViewOrderModal from '../../components/PosComponentsFood/ViewOrderModal';
import { itemDetail } from './ItemDetail';
const { Panel } = Collapse;
import { Popover } from 'antd';

function Podms() {

  const [orderStatusList, setOrderStatusList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [orderSourceList, setOrderSourceList] = useState([]);
  const [CustomerPhone, setCustomerPhone] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOrderData, setViewOrderData] = useState(null);
  const [viewOrder, setViewOrder] = useState(false);
  const timeOutRef = useRef(null);
  const [expandedRow, setExpandedRow] = useState(null);
  // New Api Calling
  const [newviewOrderData, setNewViewOrderData] = useState(null);
  const [NewviewOrder, setNewViewOrder] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState({});
  const [popoverData, setPopoverData] = useState({});


  const [dateFrom, setDateFrom] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment(new Date()).format("YYYY-MM-DD"));
  //  Redux 
  const userData = useSelector((state) => state.authReducer);
  const { userBranchList } = useSelector(
    (state) => state.authReducer);
  const { selectedOrder, cancelOrderStatusObj, FromDate, ToDate, controller } = useSelector(
    (state) => state.PointOfSaleReducer);

  const [data, setData] = useState({
    areaId: null,
    StatusId: null,
    orderNumber: null,
    CustomerId: null,
    customerName: "",
    CustomerPhone: null,
    cityId: null,
    DateFrom: "",
    DateTo: "",
  });

  const columns = [
    {
      title: "Order Number",
      dataIndex: 'OrderNumber',
      key: 'OrderNumber',
    },
    {
      title: 'Branch',
      dataIndex: 'BranchName',
      key: 'BranchName',
    },
    {
      title: 'Phone',
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber',
    },
    {
      title: 'Customer Name',
      dataIndex: 'CustomerName',
      key: 'CustomerName',
    },
    {
      title: 'Order Date Time',
      dataIndex: 'OrderDateTime',
      key: 'OrderDateTime',
    },
    {
      title: 'Delivery Date Time',
      dataIndex: 'OrderDeliveryDateTime',
      key: 'OrderDeliveryDateTime',
    },
    {
      title: 'Amount',
      dataIndex: 'TotalAmountWithGST',
      key: 'TotalAmountWithGST',
    },
    {
      title: 'Rider',
      dataIndex: 'RiderName',
      key: 'RiderName',
    },
    {
      title: 'Delivery Time(Mins)',
      dataIndex: 'DeliveryTime',
      key: 'DeliveryTime',
    },
    {
      title: 'Order Source',
      dataIndex: 'OrderSourceValue',
      key: 'OrderSourceValue',
    },
    {
      title: 'Status',
      dataIndex: 'OrderStatus',
      key: 'OrderStatus',
    },
    {
      title: 'Action',
      dataIndex: 'x',
      key: 'x',
      render: (text, item) =>
        <>
          <Button type="text" onClick={() => getOrderDetail(item)}>
            <EyeOutlined />
          </Button>
          <ViewOrderModal
            data={viewOrderData}
            viewOrder={viewOrder}
            toggleViewOrder={toggleViewOrder}
          />
        </>

    },
  ]

  const initialFormValues = {
    BranchId: null,
    AreaId: null,
    OrderNumber: "",
    CustomerId: null,
    CustomerName: "",
    CustomerPhone: "",
    OrderModeId: null,
    OrderSourceId: null,
    DateFrom: "",
    DateTo: "",
    StatusId: null,
    CityId: null,
  };

  // HANDLE SEARCH SUBMIT
  const [filteredData, setFilteredData] = useState([]);
  const [searchFields, setSearchFields] = useState({
    BranchId: null,
    AreaId: null,
    OrderNumber: "",
    CustomerId: null,
    CustomerName: "",
    CustomerPhone: "",
    OrderModeId: null,
    OrderSourceId: null,
    DateFrom: null,
    DateTo: null,
    StatusId: null,
  });

  const [formData, setFormData] = useState(initialFormValues);
  console.log('checking newDate', new Date())
  const DateRefFrom = useRef({});
  const DateRefTo = useRef({});

  const formattedDateFrom = moment(searchFields.DateFrom).format("YYYY-MM-DD 00:00:00.000");
  const formattedDateTo = moment(searchFields.DateTo).format("YYYY-MM-DD 00:00:00.000");


  const fetchDataFromApi = () => {
    postRequest('GetOrder', {
      OperationId: 1,
      UserIP: '12.1.1.2',
      // BranchId: searchFields?.BranchId,
      BranchId: selectedOrder?.BranchId || userBranchList.length === 1
        ? userBranchList[0].BranchId : null,
      AreaId: searchFields?.AreaId,
      StatusId: searchFields.StatusId,
      OrderNumber: searchFields.OrderNumber || "%%",
      CustomerName: searchFields.CustomerName || "%%",
      CustomerPhone: searchFields.CustomerPhone || "%%",
      DateFrom: null,
      DateTo: null,
      CityId: userBranchList[0]?.CityId,
      CompanyId: userData.CompanyId,
      userId: userData.UserId,
      OrderModeId: searchFields.OrderModeId || null,
      OrderSourceId: searchFields.OrderSourceId || null,
    }).then((response) => {
      if (response.data.error === true) {
        message.error(response.data.errorMessage);
        return;
      }

      if (response.data.response === false) {
        message.error(response.data.DataSet.Table.errorMessage);
        return;
      }

      const data = response.data.DataSet;
      const { Table2, Table3, Table4, Table10, Table } = data;

      // Populate your dropdown lists based on the data
      setOrderStatusList(Table2 || []);
      setBranchList(Table3 || []);
      setAreaList(Table4 || []);
      setOrderSourceList(Table10 || []);
      setFilteredData(Table || []);
    }).catch((error) => {
      console.error('Error:', error);
    });
  };


  // Add a function to handle form submission
  // useEffect(() => {
  //   fetchDataFromApi()
  // }, []);

  useEffect(() => {
    fetchDataFromApi();
    const intervalId = setInterval(() => {
      fetchDataFromApi();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);


  // const handleSearchFieldChange = (data) => {
  //   const { name, value } = data;

  //   // Update your state here (data state).
  //   setData({ ...data, [name]: value });
  // };

  const handleSearchFieldChange = (data) => {
    const { name, value } = data;

    if (name === 'CustomerName' || name === 'CustomerPhone' || name === 'OrderNumber') {
      setSearchFields({ ...searchFields, [name]: value });
    } else if (name === 'DateFrom' || name === 'DateTo') {
      setSearchFields({ ...searchFields, [name]: value + ' 00:00:00.000' });
    } else {
      setSearchFields({ ...searchFields, [name]: value });
    }
  };



  DateRefFrom.current = searchFields.DateFrom;
  DateRefTo.current = searchFields.DateTo;
  /**
     * This function change the state of Select in Search Field
     * @param {{}} data event object of field
     */
  const handleSelectChange = (data) => {
    
    if (data.value !== null) {
      setSearchFields({ ...searchFields, [data.name]: data.value });
    } else {
      // If the user clears the selection, set the field to null
      setSearchFields({ ...searchFields, [data.name]: null });
    }
    
  };


  ///      Handle Search Submit ///
  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formattedDateFrom = moment(dateFromRef.current.value).format("YYYY-MM-DD 00:00:00.000");
    const formattedDateTo = moment(dateToRef.current.value).format("YYYY-MM-DD 00:00:00.000");
    
    const payload = {
      // BranchId: userBranchList[0].BranchId,
      BranchId: searchFields?.BranchId || null,
      AreaId: searchFields.AreaId || null,
      OrderNumber: searchFields.OrderNumber || "%%",
      CustomerId: searchFields.CustomerId || null,
      CustomerName: searchFields.CustomerName || "%%",
      CustomerPhone: searchFields.CustomerPhone || "%%",
      OrderModeId: searchFields.OrderModeId || null,
      OrderSourceId: searchFields.OrderSourceId || null,
      // DateFrom: "2022-01-08 00:00:00.000",
      DateFrom: searchFields.DateFrom,
      DateTo: searchFields.DateTo,
      StatusId: searchFields.StatusId || null,
      OperationId: 1,
      CompanyId: userData.CompanyId,
      UserId: userData.userId,
      UserIP: "12.1.1.2",
    };

    console.log('checking my seach ayload', payload)
    postRequest('/GetOrder', payload)
      .then((response) => {
        if (response.data.Response && response.data.DataSet.Table) {
          setLoading(false);
          setFilteredData(response.data.DataSet.Table);
        } else {
          setLoading(false);
          console.error("API request was not successful");
        }
      })
      .catch((error) => {
        setLoading(false);

        console.error("Error:", error);
      });

  };

  /// Get order Detail
  /// Get order Detail
  const getOrderDetail = (record) => {
    if (!record || !record.OrderMasterId) {
      console.error("OrderMasterId is undefined in the record:", record);
      return;
    }

    setViewOrder(true);

    postRequest("getOrderDetail", {
      OperationId: 1,
      CompanyId: userData.CompanyId,
      OrderId: record.OrderMasterId,
      UserId: userData.UserId,
      UserIP: "192.1.1.1",
    })
      .then((response) => {
        setViewOrderData(response.data.DataSet);
      })
      .catch((error) => {
        setViewOrder(false);
        console.error(error);
      });
  };

  // const toggleViewOrder = () => {
  //   setViewOrder(!viewOrder);
  // };

  useEffect(() => {
    getOrderDetail();
  }, []);

  //// New API
  const getDetail = (record) => {
    if (!record || !record.OrderMasterId) {
      console.error('OrderMasterId is undefined in the record:', record);
      return;
    }

    setPopoverVisible((prevVisible) => ({
      ...prevVisible,
      [record.OrderMasterId]: true,
    }));

    postRequest('getOrderDetail', {
      OperationId: 1,
      CompanyId: userData.CompanyId,
      OrderId: record.OrderMasterId,
      UserId: userData.UserId,
      UserIP: '192.1.1.1',
    })
      .then((response) => {
        setPopoverData((prevData) => ({
          ...prevData,
          [record.OrderMasterId]: response.data.DataSet,
        }));
      })
      .catch((error) => {
        setPopoverVisible((prevVisible) => ({
          ...prevVisible,
          [record.OrderMasterId]: false,
        }));
        console.error(error);
      });
  };

  const toggleNewViewOrder = () => {
    setNewViewOrder(!NewviewOrder);
  };

  useEffect(() => {
    // Assuming you want to fetch details for the first item in filteredData initially
    if (filteredData.length > 0) {
      getDetail(filteredData[0]);
    }
  }, [filteredData]);

  const DetailPopover = ({ data }) => {
    return (
      <div>
        <Table
          size='small'
          className='podms-table'
          columns={[
            { title: 'Product Name', dataIndex: 'ProductDetailName', key: 'ProductDetailName' },
            { title: 'Quantity', dataIndex: 'Quantity', key: 'Quantity' },
            { title: 'Discount', dataIndex: 'DiscountPercent', key: 'DiscountPercent' },
            { title: 'Amount', dataIndex: 'PriceWithGST', key: 'PriceWithGST' },
          ]}
          dataSource={data?.Table1?.map((item, index) => ({
            key: index,
            ProductDetailName: item.ProductDetailName,
            Quantity: item.Quantity,
            DiscountPercent: item.DiscountPercent,
            PriceWithGST: item.PriceWithGST,
          })) || []}
          pagination={false}
        />
      </div>
    );
  };



  function toggleViewOrder() {
    setViewOrder(!viewOrder);
  };
  // ...


  // const handleSearchFieldChange = (data) => {
  //   if (
  //     data.name === "CustomerName" ||
  //     data.name === "CustomerPhone" ||
  //     data.name === "OrderNumber"

  //   ) {

  //     data.value = `%${data.value}%`;
  //   }
  //   setSearchFields({ ...searchFields, [data.name]: data.value });
  // };



  return (
    <div style={{
      background: "white",
      padding: 15,
      boxShadow: "0 0 5px lightgray",
      borderRadius: 2,
    }}>
      <Collapse defaultActiveKey={['searchForm']}>
        <Panel header="Search Order" key="searchForm">
          <form style={{ gap: '10px', alignItems: 'flex-end' }} onSubmit={handleSearchSubmit}>
            <Row
              style={{ gap: "10px", alignItems: "flex-end" }}
              gutter={[10, 10]}
            >
              <FormTextField
                colSpan={6}
                label="Phone No"
                size={INPUT_SIZE}
                name="CustomerPhone"
                onChange={handleSearchFieldChange}
                isNumber="true"
                type="text"
              />

              <FormTextField
                colSpan={6}
                label="Order No"
                size={INPUT_SIZE}
                name="OrderNumber"
                onChange={handleSearchFieldChange}
                isNumber="true"
                type="text"
              />

              <FormTextField
                colSpan={6}
                label="Customer Name"
                size={INPUT_SIZE}
                name="CustomerName"
                onChange={handleSearchFieldChange}
              />

              <FormSelect
                colSpan={5}
                listItem={orderStatusList}
                idName="OrderStatusId"
                valueName="OrderStatus"
                size={INPUT_SIZE}
                name="StatusId"
                label="Status"
                value={searchFields.StatusId || ""}
                onChange={handleSelectChange}
              />

              <FormSelect
                colSpan={5}
                listItem={branchList}
                idName="BranchId"
                valueName="BranchName"
                size={INPUT_SIZE}
                name="BranchId"
                label="Branch"
                value={searchFields.BranchId || ""}
                onChange={handleSelectChange}
              />

              <FormSelect
                colSpan={5}
                listItem={areaList}
                idName="AreaId"
                valueName="AreaName"
                size={INPUT_SIZE}
                name="AreaId"
                label="Area"
                value={searchFields.AreaId || ""}
                onChange={handleSelectChange}
              />

              <FormSelect
                colSpan={5}
                listItem={orderSourceList}
                idName="OrderSourceId"
                valueName="OrderSource"
                size={INPUT_SIZE}
                name="OrderSourceId"
                label="Order Source"
                value={searchFields.OrderSourceId || ""}
                onChange={handleSelectChange}
              />

              <FormTextField
                type="date"
                style={{ width: "100%" }}
                label="Date From"
                name="DateFrom"
                placeholder="MM/DD/YYYY"
                ref={dateFromRef}
                onChange={(dateValue) => {
                  // console.log('what is date value', dateValue.value)
                  // const formattedDate = moment(dateValue).format("YYYY-MM-DD");
                  setSearchFields({
                    ...searchFields,
                    DateFrom: dateValue.value,
                  }); 
                  
                }}
              />

              <FormTextField
                type="date"
                style={{ width: "100%" }}
                label="Date To"
                name="DateTo"
                placeholder="MM/DD/YYYY"
                ref={dateToRef}
                onChange={(dateValue) => {
                  // const formattedDate = moment(dateValue).format("YYYY-MM-DD");
                  setSearchFields({
                    ...searchFields,
                    DateTo: dateValue.value,
                  });
                  console.log('checking dateto', {
                    ...searchFields,
                    DateTo: dateValue.value,
                  })
                }}
              />

              <FormButton
                title="Search"
                type="primary"
                icon={loading ? <LoadingOutlined /> : <SearchOutlined />}
                htmlType="submit"
              />

            </Row>
          </form>
        </Panel>
      </Collapse>

      <br />
      <Table
        loading={loading}
        columns={columns}
        expandable={{
          expandedRowRender: (item) => (
            <DetailPopover data={popoverData[item.OrderMasterId]} />
          ),
          rowExpandable: (record) => record.name !== 'Not Expandable',
          onExpand: (expanded, item) => getDetail(item)
        }}
        dataSource={filteredData}
        rowKey='RowNum'
      />

    </div>
  );
}

export default Podms;