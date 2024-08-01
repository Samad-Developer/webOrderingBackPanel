import { CloseOutlined, SaveFilled } from "@ant-design/icons";
import { Col, Space, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormButton from "../../../components/general/FormButton";
import FormCheckbox from "../../../components/general/FormCheckbox";
import FormContainer from "../../../components/general/FormContainer";
import FormDrawer from "../../../components/general/FormDrawer";

import {
  SET_POS_STATE,
  SET_RESERVATION_DETAIL,
} from "../../../redux/reduxConstants";
import { BUTTON_SIZE } from "../../../common/ThemeConstants";

const initialCustomerFormValues = {
  PhoneId: null,
  PhoneNumber: "",
  CustomerName: "",
  IsPrimary: false,
  ReservationId: null,
  IsPrimaryAddress: false,
  AddressTypeId: null,
  CityId: null,
  AreaId: null,
  LandMark: "",
  CompanyName: "",
  Building: "",
  RoomHouse: "",
  BlockFloor: "",
  StreetRowLane: "",
  RoomHouseCaptionId: null,
  BlockFloorCaptionId: null,
  StreetRowLaneCaptionId: null,
  Remarks: "",
  CustomerAddressId: null,
  BranchId: null,
  CompleteAddress: "",
};

const initialNewFormRequired = {
  customerName: false,
  address: false,
};

const ReservationEdit = (props) => {
  const userState = useSelector((state) => state.authReducer);
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [phoneDetail, setPhoneDetail] = useState({});
  const [customerDetail, setCustomerDetail] = useState([]);
  const [customerAddressDetail, setCustomerAddressDetail] = useState([]);
  const [newCustomerForm, setNewCustomerForm] = useState(
    initialCustomerFormValues
  );
  const [newCustomerRequired, setNewCustomerRequired] = useState(
    initialNewFormRequired
  );

  useEffect(() => {
    setCustomerDetail(posState.reservationSupportingTable.Table);
  }, [posState.reservationSupportingTable.Table]);

  const closeCustomerEdit = () => {
    dispatch({
      type: SET_POS_STATE,
      payload: { name: "ReservationEditDrawer", value: false },
    });
  };

  const handlePrimaryCustomerChange = (e, record, name) => {
    let index = customerDetail.findIndex(
      (x) => x.ReservationId === record.ReservationId
    );
    let tableIndex = customerDetail.findIndex((x) => x[name] === true);
    if (tableIndex !== index && tableIndex > -1) {
      customerDetail[tableIndex][name] = false;
    }
    customerDetail[index][name] = e.value;
    setCustomerDetail([...customerDetail]);
  };

  const handlePrimaryAddressChange = (e, record, name) => {
    let index = customerAddressDetail.findIndex(
      (x) => x.CustomerAddressId === record.CustomerAddressId
    );
    let tableIndex = customerAddressDetail.findIndex((x) => x[name] === true);
    if (tableIndex !== index && tableIndex > -1) {
      customerAddressDetail[tableIndex][name] = false;
    }
    customerAddressDetail[index][name] = e.value;
    setCustomerAddressDetail([...customerAddressDetail]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filterReservation = customerDetail.find((x) => x.IsPrimary === true);
    dispatch({
      type: SET_RESERVATION_DETAIL,
      payload: filterReservation,
    });
    closeCustomerEdit();
  };

  const customerColumn = [
    {
      title: "Select",
      dataIndex: "IsPrimary",
      key: "IsPrimary",
      render: (record, index) => (
        <FormCheckbox
          name="IsPrimary"
          checked={index.IsPrimary}
          onChange={(e) => handlePrimaryCustomerChange(e, index, "IsPrimary")}
        />
      ),
    },

    {
      title: "Reservation Number",
      dataIndex: "ReservationNumber",
      key: "ReservationNumber",
    },
    {
      title: "Reservation Date",
      dataIndex: "ReservationDate",
      render: (_, record) => {
        return (
          record.ReservationDate &&
          new Date(record.ReservationDate).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        );
      },
    },
    {
      title: "Customer Name",
      dataIndex: "CustomerName",
      key: "CustomerName",
    },
    { title: "Phone Number", dataIndex: "PhoneNumber", key: "PhoneNumber" },
    {
      title: "No Of Adults",
      dataIndex: "NoOfAdults",
      key: "NoOfAdults",
    },
    {
      title: "No Of Children",
      dataIndex: "NoOfChildren",
      key: "NoOfChildren",
    },
    {
      title: "Reservation Status",
      dataIndex: "ReservationStatus",
      key: "ReservationStatus",
    },
    {
      title: "Branch Name",
      dataIndex: "BranchName",
      key: "BranchName",
    },
  ];

  const addressColumn = [
    {
      title: "Primary",
      dataIndex: "IsPrimary",
      key: "IsPrimary",
      render: (record, index) => (
        <FormCheckbox
          name="IsPrimary"
          checked={index.IsPrimary}
          onChange={(e) => handlePrimaryAddressChange(e, index, "IsPrimary")}
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "AddressType",
      key: "AddressType",
    },
    {
      title: "Room / House",
      dataIndex: "RoomHouse",
      key: "RoomHouse",
    },
    {
      title: "Block / Floor",
      dataIndex: "BlockFloor",
      key: "BlockFloor",
    },
    {
      title: "Building",
      dataIndex: "Building",
      key: "Building",
    },
    {
      title: "Street / Lane",
      dataIndex: "StreetRowLane",
      key: "StreetRowLane",
    },
    {
      title: "Area",
      dataIndex: "AreaName",
      key: "AreaName",
    },
    {
      title: "City",
      dataIndex: "CityName",
      key: "CityName",
    },
  ];

  const FormComponent = (
    <FormContainer onSubmit={handleSubmit}>
      <div style={{ paddingTop: 52 }}>
        <div className="formDrawerHeader">
          <h2>Reservation Detail Form</h2>
          <Space>
            <FormButton
              title="Cancel"
              type="default"
              color="gray"
              size={BUTTON_SIZE}
              icon={<CloseOutlined />}
              onClick={closeCustomerEdit}
            />
            <FormButton
              title={
                newCustomerRequired.address || newCustomerRequired.customerName
                  ? "Save"
                  : "Select"
              }
              type="primary"
              icon={<SaveFilled />}
              size={BUTTON_SIZE}
              htmlType="submit"
              loading={loading}
            />
          </Space>
        </div>
        <div className="formDrawerBody">
          <Col span={24}>
            {customerDetail?.length > 0 && (
              <Table
                columns={customerColumn}
                dataSource={customerDetail}
                rowKey={(record) => record.ReservationId}
                size="small"
                pagination={false}
              />
            )}
          </Col>
        </div>
      </div>
    </FormContainer>
  );

  return (
    <FormDrawer
      // title="Customer Detail Form"
      visible={posState.ReservationEditDrawer}
      formComponent={FormComponent}
      onClose={() =>
        dispatch({
          type: SET_POS_STATE,
          payload: { name: "ReservationEditDrawer", value: false },
        })
      }
      width="65vw"
      className="customerDetailContainer"
    />
  );
};

export default ReservationEdit;
