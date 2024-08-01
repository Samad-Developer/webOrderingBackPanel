import { DeleteFilled, EditFilled, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tooltip } from "antd";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SET_POS_STATE } from "../../redux/reduxConstants";
import { postRequest } from "../../services/mainApp.service";
import "../PosComponentsFood/pos.css";
import ViewOrderModal from "./ViewOrderModal";

const PosTable = (props) => {
  const {
    onClick,
    orderData,
    loading,
    supportingTable,
    selectedTabId,
    editHoldOrder,
    deleteHoldOrder,
  } = props;
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.authReducer);
  const [viewOrderData, setViewOrderData] = useState(null);
  const [viewOrder, setViewOrder] = useState(false);
  const timeOutRef = useRef(null);

  const getOrderDetail = (record) => {
    setViewOrder(true);
    timeOutRef.current = setTimeout(() => {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "selectedOrderModal",
          value: false,
        },
      });
    }, 200);

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

  const toggleViewOrder = () => {
    if (viewOrder === true) {
      setViewOrderData(null);
      setViewOrder(!viewOrder);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeOutRef);
    };
  }, []);

  const dineInColumns = [
    {
      title: "Order Number",
      dataIndex: "OrderNumber",
      key: "OrderNumber",
    },
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
    },
    // {
    //   title: "Order Mode",
    //   dataIndex: "OrderMode",
    //   key: "OrderMode",
    // },
    {
      title: "Table",
      dataIndex: "TableName",
      key: "TableName",
    },
    {
      title: "Waiter",
      dataIndex: "WaiterName",
      key: "WaiterName",
    },
    {
      title: "Order Date Time",
      dataIndex: "OrderDateTime",
      key: "OrderDateTime",
    },
    {
      title: "Amount",
      key: "TotalAmountWithGST",
      render: (record) =>
        isNaN(
          parseFloat(
            record.TotalAmountWithoutGST +
              record.DeliveryCharges +
              record.AdditionalServiceCharges +
              record.GSTAmount -
              record.DiscountAmount
          ).toFixed(2)
        )
          ? ""
          : parseFloat(
              record.TotalAmountWithoutGST +
                record.DeliveryCharges +
                record.AdditionalServiceCharges +
                record.GSTAmount -
                record.DiscountAmount
            ).toFixed(2),
    },
    // {
    //   title: "Special Instruction",
    //   dataIndex: "SpecialInstruction",
    //   key: "SpecialInstruction",
    // },
    {
      title: "Status",
      key: "OrderStatus",
      render: (record) => {
        return (
          <div
            style={{ color: record.OrderStatus === "New" ? "#fff" : "#000" }}
            className={record.OrderStatus === "New" ? "orderStatus" : ""}
          >
            {record.OrderStatus}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Tooltip title="View Order">
            <Button type="text" onClick={() => getOrderDetail(record)}>
              <EyeOutlined />
            </Button>
          </Tooltip>
        );
      },
    },
  ];
  const finishedWasteColums = [
    {
      title: "Order Number",
      dataIndex: "OrderNumber",
      key: "OrderNumber",
    },
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
    },
    // {
    //   title: "Order Mode",
    //   dataIndex: "OrderMode",
    //   key: "OrderMode",
    // },
    {
      title: "Order Date Time",
      dataIndex: "OrderDateTime",
      key: "OrderDateTime",
    },
    {
      title: "Amount",
      key: "TotalAmountWithGST",
      render: (record) =>
        isNaN(
          parseFloat(
            record.TotalAmountWithoutGST +
              record.DeliveryCharges +
              record.AdditionalServiceCharges +
              record.GSTAmount -
              record.DiscountAmount
          ).toFixed(2)
        )
          ? ""
          : parseFloat(
              record.TotalAmountWithoutGST +
                record.DeliveryCharges +
                record.AdditionalServiceCharges +
                record.GSTAmount -
                record.DiscountAmount
            ).toFixed(2),
    },
    // {
    //   title: "Special Instruction",
    //   dataIndex: "SpecialInstruction",
    //   key: "SpecialInstruction",
    // },
    {
      title: "Status",
      key: "OrderStatus",
      render: (record) => {
        return (
          <div
            style={{ color: record.OrderStatus === "New" ? "#fff" : "#000" }}
            className={record.OrderStatus === "New" ? "orderStatus" : ""}
          >
            {record.OrderStatus}
          </div>
        );
      },
    },
  ];
  const deliveryColumns = [
    {
      title: "Order Number",
      dataIndex: "OrderNumber",
      key: "OrderNumber",
    },
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
    },
    // {
    //   title: "Order Mode",
    //   dataIndex: "OrderMode",
    //   key: "OrderMode",
    // },
    {
      title: "Phone",
      dataIndex: "PhoneNumber",
      key: "name",
    },
    {
      title: "Customer Name",
      dataIndex: "CustomerName",
      key: "CustomerName",
    },
    {
      title: "Order Date Time",
      dataIndex: "OrderDateTime",
      key: "OrderDateTime",
    },
    {
      title: "Delivery Date Time",
      dataIndex: "OrderDeliveryDateTime",
      key: "OrderDeliveryDateTime",
    },
    {
      title: "Amount",
      key: "TotalAmountWithGST",
      render: (record) =>
        parseFloat(
          record.TotalAmountWithoutGST +
            record.DeliveryCharges +
            record.AdditionalServiceCharges +
            record.GSTAmount -
            record.DiscountAmount
        ).toFixed(2),
    },
    {
      title: "Rider",
      dataIndex: "RiderName",
      key: "RiderName",
    },
    {
      title: "Delivery Time (Mins)",
      dataIndex: "DeliveryTime",
      key: "DeliveryTime",
    },
    // {
    //   title: "Special Instruction",
    //   dataIndex: "SpecialInstruction",
    //   key: "SpecialInstruction",
    // },
    {
      title: "Order Source",
      dataIndex: "OrderSource",
      key: "OrderSource",
    },
    {
      title: "Status",
      key: "OrderStatus",
      render: (record) => {
        return (
          <div
            style={{ color: record.OrderStatus === "New" ? "#fff" : "#000" }}
            className={record.OrderStatus === "New" ? "orderStatus" : ""}
          >
            {record.OrderStatus}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Tooltip title="View Order">
            <Button type="text" onClick={() => getOrderDetail(record)}>
              <EyeOutlined />
            </Button>
          </Tooltip>
        );
      },
    },
  ];
  const takeawayColumns = [
    {
      title: "Order Number",
      dataIndex: "OrderNumber",
      key: "OrderNumber",
    },
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
    },
    // {
    //   title: "Order Mode",
    //   dataIndex: "OrderMode",
    //   key: "OrderMode",
    // },
    {
      title: "Phone",
      dataIndex: "PhoneNumber",
      key: "name",
    },
    {
      title: "Customer Name",
      dataIndex: "CustomerName",
      key: "CustomerName",
    },
    {
      title: "Order Date Time",
      dataIndex: "OrderDateTime",
      key: "OrderDateTime",
    },
    {
      title: "Delivery Date Time",
      dataIndex: "OrderDeliveryDateTime",
      key: "OrderDeliveryDateTime",
    },
    {
      title: "Delivery Time (Mins)",
      dataIndex: "DeliveryTime",
      key: "DeliveryTime",
    },
    {
      title: "Amount",
      key: "TotalAmountWithGST",
      render: (record) =>
        parseFloat(
          record.TotalAmountWithoutGST +
            record.DeliveryCharges +
            record.AdditionalServiceCharges +
            record.GSTAmount -
            record.DiscountAmount
        ).toFixed(2),
    },
    // {
    //   title: "Special Instruction",
    //   dataIndex: "SpecialInstruction",
    //   key: "SpecialInstruction",
    // },
    {
      title: "Order Source",
      dataIndex: "OrderSource",
      key: "OrderSource",
    },
    {
      title: "Status",
      key: "OrderStatus",
      render: (record) => {
        return (
          <div
            style={{ color: record.OrderStatus === "New" ? "#fff" : "#000" }}
            className={record.OrderStatus === "New" ? "orderStatus" : ""}
          >
            {record.OrderStatus}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Tooltip title="View Order">
            <Button type="text" onClick={() => getOrderDetail(record)}>
              <EyeOutlined />
            </Button>
          </Tooltip>
        );
      },
    },
  ];
  const holdOrderColums = [
    {
      title: "Customer Name",
      dataIndex: "CustomerName",
      render: (_, record, index) => {
        return record?.customerDetail?.CustomerName;
      },
    },
    {
      title: "Phone",
      dataIndex: "PhoneNumber",
      render: (_, record, index) => {
        return record?.customerDetail?.PhoneNumber;
      },
    },
    {
      title: "Order Mode",
      dataIndex: "OrderMode",
      render: (_, record, index) => {
        return record?.customerDetail?.OrderModeName;
      },
    },
    {
      title: "Order Source",
      dataIndex: "OrderSource",
      render: (_, record, index) => {
        return record?.customerDetail?.OrderSourceName;
      },
    },
    {
      title: "Order Date Time",
      dataIndex: "OrderDateTime",
      render: (_, record, index) => {
        return record?.customerDetail?.orderDateTime;
      },
    },
    {
      title: "Action",
      key: "Action",
      render: (_, record, index) => {
        return (
          <>
            <Button
              type="text"
              onClick={() => editHoldOrder(record, index)}
              icon={<EditFilled className="blueIcon" />}
            ></Button>
            <Popconfirm
              title="Are you surely want to delete this row?"
              onConfirm={() => deleteHoldOrder(record, index)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteFilled className="redIcon" />}
              ></Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div className="posTableStyle">
      <Table
        loading={loading}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => selectedTabId !== 5 && onClick(record, rowIndex),
          };
        }}
        columns={
          selectedTabId === 1
            ? dineInColumns
            : selectedTabId === 2
            ? deliveryColumns
            : selectedTabId === 3
            ? takeawayColumns
            : selectedTabId === 4
            ? finishedWasteColums
            : selectedTabId === 5
            ? holdOrderColums
            : []
        }
        dataSource={orderData}
        pagination={false}
        size="small"
        scroll={{ y: "55vh" }}
      />
      {viewOrder === true && (
        <ViewOrderModal
          data={viewOrderData}
          viewOrder={viewOrder}
          toggleViewOrder={toggleViewOrder}
        />
      )}
    </div>
  );
};

export default PosTable;
