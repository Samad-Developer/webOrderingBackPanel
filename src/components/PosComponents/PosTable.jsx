import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import React from "react";
import "../PosComponents/pos.css";

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
    // {
    //   title: 'Delivery Date Time',
    //   dataIndex: 'OrderDeliveryDateTime',
    //   key: 'OrderDeliveryDateTime',
    // },
    // {
    //   title: 'Delivery Time (Mins)',
    //   dataIndex: 'DeliveryTime',
    //   key: 'DeliveryTime',
    // },
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
        return record?.orderSourceName;
      },
    },
    {
      title: "Order Date Time",
      dataIndex: "OrderDateTime",
      render: (_, record, index) => {
        return record?.orderSourceNane;
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
            onClick: () => selectedTabId !== 3 && onClick(record, rowIndex),
          };
        }}
        columns={
          // selectedTabId === 1
          //   ? dineInColumns
          //   : selectedTabId === 2
          //   ? deliveryColumns
          //   : selectedTabId === 3
          //   ? takeawayColumns
          //   : selectedTabId === 5
          //   ? holdOrderColums
          //   : []
          selectedTabId === 1
            ? takeawayColumns
            : selectedTabId === 2
            ? deliveryColumns
            : selectedTabId === 3
            ? holdOrderColums
            : // : selectedTabId === 5
              // ? dineInColumns
              []
        }
        dataSource={orderData}
        pagination={false}
        size="small"
        scroll={{ y: "55vh" }}
      />
    </div>
  );
};

export default PosTable;
