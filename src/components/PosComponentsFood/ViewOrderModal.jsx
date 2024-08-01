import { Badge, Col, Descriptions, Modal, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useState,useEffect,useRef } from "react";
import FormSelect from "../general/FormSelect";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import { useSelector } from "react-redux";
import { postRequest } from "../../services/mainApp.service";
import {submitForm} from '../../redux/actions/basicFormAction'
const controller = new window.AbortController();
import axios from "axios";

const ViewOrderModal = (props) => {
  let { viewOrder, data, toggleViewOrder } = props;
  const { OrderMasterId,AreaId,OrderSourceId,AreaName,OrderNumber,OrderDate } = data?.Table[0] || {};
  const controller = new window.AbortController();
  const [isStatusChange, setIsStatusChange] = useState(false)

  


console.log("props data", data);
  const [orderStatus, setOrderStatus] = useState([]);
  const [orderStatusList, setOrderStatusList] = useState([]);
  const DateRefFrom = useRef({});
  const DateRefTo = useRef({});
  const [supportingTable, setSupportingTable] = useState()
  const [selectedOrder, setSelectedOrder] = useState([])
  const [orderItemsDetail, setOrderItemsDetail] = useState([]);

  const { formFields, itemList, formLoading, tableLoading } =
    useSelector((state) => state.basicFormReducer);
    const userData = useSelector((state) => state.authReducer);
    const { userBranchList } = useSelector(
      (state) => state.authReducer);
      const {  cancelOrderStatusObj, FromDate, ToDate } = useSelector(
        (state) => state.PointOfSaleReducer);  

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
      

    const fetchDataFromApi = () => {
      postRequest('GetOrder',{
        OperationId: 1,
        UserIP: '12.1.1.2',
        BranchId: selectedOrder?.BranchId || (userBranchList && userBranchList.length === 1)
          ? userBranchList[0].BranchId : null,
        DateFrom: "2022-01-13 00:00:00.000",
        DateTo: "2023-11-13 00:00:00.000",
        CityId: userBranchList && userBranchList[0]?.CityId,
        CompanyId: userData.CompanyId,
        userId: userData?.userId,
        userData:data?.Table || [],

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
        const { Table2} = data;
    
        // Populate your dropdown lists based on the data
        setOrderStatusList(Table2 || [] );
      }).catch((error) => {
        console.error('Error:', error);
      });
    };
  
  
    // Add a function to handle form submission
  // useEffect(() => {
  //  fetchDataFromApi()
  // }, []);
  //   useEffect(() => {
  //     if (Object.keys(supportingTable).length !== 0) {
  //       const statusArr = [];
  //       const orderStatusObj = supportingTable.Table2
  //         ? supportingTable.Table2.filter((table) => {
  //             if (table.IsCancelable === true) {
  //               return table;
  //             } else {
  //               statusArr.push(table);
  //             }
  //           })
  //         : [{}];
  //         setOrderStatusList(statusArr);  // Directly update orderStatusList
  //       }
  //   }, [supportingTable]);
   
  const handleStatusChange = async (data) => {
    setIsStatusChange(true)
    setOrderStatus(data.value);
  
    if (data.value !== null) {
      var finalDate = DateRefFrom.current;
      var finalDateTo = DateRefTo.current;
  
      if (+finalDate === +new Date() && +finalDateTo === +new Date()) {
        finalDate =
          finalDate.getFullYear() +
          "-" +
          (finalDate.getMonth() + 1) +
          "-" +
          finalDate.getDate() +
          " " +
          "00:00:00.000";
  
        finalDateTo =
          finalDateTo.getFullYear() +
          "-" +
          (finalDateTo.getMonth() + 1) +
          "-" +
          finalDateTo.getDate() +
          " " +
          "00:00:00.000";
      }
      
  
      try {
        const response = await axios.post("/UpdateOrderStatus", {
          OperationId: 3,
          OrderMasterId,
          CompanyId: 152,
          OrderStatusId: data.value,
          DateFrom: "2022-01-13 00:00:00.000",
          DateTo:"2023-11-13 00:00:00.000",
          userId: 257,
          AreaId,
          OrderSourceId,
          AreaName,
          OrderNumber,
          OrderDate,
        });
  console.log("api data response", response);
        const { DataSet } = response.data;
        if (DataSet && DataSet.Table) {
          const { HasError, Error_Message, Message, Id } = DataSet.Table[0];
  
          if (HasError === 1) {
            console.error(`Error: ${Error_Message} - ${Message}`);
          } else {
            console.log(`Success: ${Message}`);
          }
        }
  
        if (DataSet && DataSet.Table1) {
          console.log(DataSet);
          const orderMas = DataSet.Table1.find((item) => {
            console.log(item);
            return data.OrderMasterId === item.OrderMasterId;
          });
  
          setSelectedOrder(orderMas);
        }
  
        if (DataSet && DataSet.Table2) {
          const orderItems = DataSet.Table2.filter((item) => {
            return data.OrderMasterId === item.OrderMasterId;
          });
  
          setFilteredOrders([...orderItems]);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  useEffect(() => {
    fetchDataFromApi();
  }, [userBranchList]); 

  return (
    <Modal
      visible={viewOrder}
      onCancel={toggleViewOrder}
      footer={null}
      width={"60vw"}
      afterClose={() => {
        setIsStatusChange(false)
        console.log('i am called')
      }}
    >
      <Spin spinning={data === null}>
        <div>
       
          <Title level={3}>Order Info</Title>

          <Col>
      <div style={{ display: "flex", alignSelf: "flex-start" }}>
        Status
      </div>


      <Col>
        <FormSelect
          colSpan={24}
          listItem={orderStatusList}
          idName="OrderStatusId"
          valueName="OrderStatus"
          size={INPUT_SIZE}
          name="OrderStatusId"
          value={isStatusChange ? orderStatus : data?.Table[0].OrderStatusId || ""}
          onChange={handleStatusChange}
        />
      </Col>
    </Col>



          <Descriptions bordered size="small">
            <Descriptions.Item label="Order Number">
              {data?.Table[0]?.OrderNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Order Date:" span={2}>
              {data?.Table[0]?.OrderDate}
            </Descriptions.Item>
            <Descriptions.Item label="Phone No.: ">
              {data?.Table[0]?.PhoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Name: " span={2}>
              {data?.Table[0]?.CustomerName}
            </Descriptions.Item>
            <Descriptions.Item label="City Name: ">
              {data?.Table[0]?.CityName}
            </Descriptions.Item>
            <Descriptions.Item label="Area Name:" span={2}>
              {data?.Table[0]?.AreaName}
            </Descriptions.Item>
            <Descriptions.Item label="Address: " span={3}>
              {data?.Table[0]?.CompleteAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Landmark: ">
              {data?.Table[0]?.LandMark}
            </Descriptions.Item>
            <Descriptions.Item label="Remarks: " span={2}>
              {data?.Table[0]?.Remarks1}
            </Descriptions.Item>
            <Descriptions.Item label="Room House: ">
              {data?.Table[0]?.RoomHouse}
            </Descriptions.Item>
          </Descriptions>
          <p> </p>
          <table>
            <tr>
              <td
                style={{
                  background: "#f7f7f7",
                  color: "black",
                }}
              >
                Product Name
              </td>
              <td
                style={{
                  background: "#f7f7f7",
                  color: "black",
                }}
              >
                Quantity
              </td>
              <td
                style={{
                  background: "#f7f7f7",
                  color: "black",
                }}
              >
                Discount
              </td>
              <td
                style={{
                  background: "#f7f7f7",
                  color: "black",
                }}
              >
                Amount
              </td>
            </tr>

            <tbody>
              {data?.Table1?.map((y) => (
                <tr>
                  <td>{y.ProductDetailName}</td>
                  <td>{y.Quantity}</td>
                  <td>{y.DiscountPercent}</td>
                  <td>{y.PriceWithGST}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Spin>
    </Modal>
  );
};

export default ViewOrderModal;
