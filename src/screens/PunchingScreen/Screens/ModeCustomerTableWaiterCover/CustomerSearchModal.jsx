import { Card, Checkbox, Col, DatePicker, message, Row, Table } from "antd";
import React, { useEffect } from "react";
import ModalComponent from "../../Components/ModalComponent";
import TextField from "../../Components/general/TextFeildSP";
import FormButtonSP from "../../Components/general/FormButtonSP";
import FormSelectSP from "../../Components/general/FormSelectSP";
import {
  SP_SET_CUSTOMER_DETAIL,
  SP_SET_CUSTOMER_SUPPORTING_SINGLE_TABLE,
  SP_SET_CUSTOMER_SUPPORTING_TABLE,
  SP_SET_ORDER_MODE,
} from "../../redux/reduxConstantsSinglePagePOS";
import {
  DELIVERY,
  DINE_IN,
  FINISHED_WASTE,
  TAKE_AWAY,
} from "../../common/SetupMstrEnum";
import TextFieldSP from "../../Components/general/TextFeildSP";
import { useDispatch, useSelector } from "react-redux";
import FormCheckboxSP from "../../Components/general/FormCheckboxSP";
import { useState } from "react";
import { list } from "../../data";
import { Fragment } from "react";
import { customerData } from "../../data";

const initialCustomerFormValues = {
  PhoneId: null,
  PhoneNumber: "",
  CustomerName: "",
  IsPrimary: false,
  CustomerId: null,
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

const CustomerSearchModal = (props) => {
  const { visible, toggleModal } = props;
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const dispatch = useDispatch();
  const controller = new window.AbortController();

  const [loading, setLoading] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(null);
  const [phoneDetail, setPhoneDetail] = useState({});
  const [customerDetail, setCustomerDetail] = useState([]);
  const [customerAddressDetail, setCustomerAddressDetail] = useState([]);
  const [newCustomerForm, setNewCustomerForm] = useState(
    initialCustomerFormValues
  );
  const [newCustomerRequired, setNewCustomerRequired] = useState(
    initialNewFormRequired
  );

  // const searchCustomerPhone = () => {};

  useEffect(() => {
    posState.customerSupportingTable.Table &&
    posState.customerSupportingTable.Table.length > 0
      ? setPhoneDetail(posState.customerSupportingTable.Table[0])
      : setPhoneDetail({ PhoneNumber: props.phoneNumber });
    if (posState.customerSupportingTable.Table1) {
      setCustomerDetail(posState.customerSupportingTable.Table1);
      if (posState.customerSupportingTable.Table1.length === 0) {
        setNewCustomerRequired({ ...newCustomerRequired, customerName: true });
      }
    }
    posState.customerSupportingTable.Table2 &&
      setCustomerAddressDetail(posState.customerSupportingTable.Table2);
    setNewCustomerForm({
      ...newCustomerForm,
      CityId:
        posState?.customerSupportingTable?.Table9?.length === 1
          ? posState?.customerSupportingTable?.Table9[0]?.CityId
          : null,
      BranchId:
        posState?.customerSupportingTable?.Table10?.length === 1 &&
        posState.customerDetail.OrderMode !== DELIVERY
          ? posState?.customerSupportingTable?.Table10[0]?.BranchId
          : null,
    });
    return () => {
      controller.abort();
      setNewCustomerRequired(initialNewFormRequired);
      setNewCustomerForm(initialCustomerFormValues);
      setPhoneDetail({});
    };
  }, [posState.customerSupportingTable]);

  const changeCustomerPhone = (e) => {
    setCustomerPhone(e.value);
  };

  const searchCustomerPhone = () => {
    if (customerPhone === customerData.Table[0].PhoneNumber) {
      dispatch({
        type: SP_SET_CUSTOMER_SUPPORTING_TABLE,
        payload: customerData,
      });
    } else {
      dispatch({
        type: SP_SET_CUSTOMER_SUPPORTING_SINGLE_TABLE,
        payload: { name: "Table1", value: [] },
      });
      message.error("No customer found");
    }
  };

  const handlePrimaryCustomerChange = (e, record, name) => {
    let index = customerDetail.findIndex(
      (x) => x.CustomerId === record.CustomerId
    );
    let tableIndex = customerDetail.findIndex((x) => x[name] === true);
    if (tableIndex !== index && tableIndex > -1) {
      customerDetail[tableIndex][name] = false;
    }
    customerDetail[index][name] = e.value;
    setCustomerDetail([...customerDetail]);
  };

  const customerSelectSubmit = () => {
    dispatch({
      type: SP_SET_CUSTOMER_DETAIL,
      payload: {
        BranchId: posState.customerSupportingTable.Table10[0].BranchId,
        // posState.OrderModeId !== TAKE_AWAY
        //   ? DataTable.BranchId
        //   : branchId,
        BranchName: posState.customerSupportingTable.Table10[0].CityBranchName,
        //posState.OrderModeId !== TAKE_AWAY
        // ? DataTable.BranchName
        // : posState.customerSupportingTable.Table10.filter(
        //     (e) => e.BranchId === branchId
        //   )[0].CityBranchName,
        // BranchDetailId: DataTable.BranchDetailId,
        CustomerId: customerDetail?.find((x) => x.IsPrimary === true)
          ?.CustomerId,
        CustomerName: customerDetail?.find((x) => x.IsPrimary === true)
          ?.CustomerName,
        Address: posState.customerSupportingTable.Table2[1].CompleteAddress,
        CompleteAddress:
          posState.customerSupportingTable.Table2[1].CompleteAddress,
        // CustomerAddressId: DataTable.CustomerAddressId,
        // PhoneNumber: DataTable.PhoneNumber,
        PhoneId: posState.customerSupportingTable.Table2[1].PhoneId,
        AreaId: posState.customerSupportingTable.Table2[1].AreaId,
      },
    });
    toggleModal();
  };

  const customerColumn = [
    {
      title: "Primary",
      dataIndex: "IsPrimary",
      key: "IsPrimary",
      render: (record, index) => (
        <FormCheckboxSP
          name="IsPrimary"
          checked={index.IsPrimary}
          onChange={(e) => handlePrimaryCustomerChange(e, index, "IsPrimary")}
        />
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "CustomerName",
      key: "CustomerName",
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

  return (
    <div>
      <ModalComponent
        title="Customer Search"
        isModalVisible={visible}
        handleOk={customerSelectSubmit}
        handleCancel={toggleModal}
        width="60%"
      >
        <div>
          <div style={{ display: "flex", width: "500px" }}>
            <TextFieldSP
              width="100%;"
              placeholder="Search customer with phone"
              size="large"
              isNumber="true"
              name="PhoneNumber"
              maxLength={11}
              minLength={11}
              value={customerPhone}
              onChange={changeCustomerPhone}
              //   ref={customerInputRef}
              autoFocus={true}
              tabIndex={0}
              containerStyle={{ width: "100%" }}
            />
            <FormButtonSP
              title="Find Customer"
              type="primary"
              size="large"
              onClick={searchCustomerPhone}
              // loading={loading}
              // disabled={customerPhone.PhoneNumber === ""}
            />
          </div>
          <div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              <FormSelectSP
                colSpan={8}
                label="Order Mode"
                listItem={[
                  { id: DINE_IN, name: "Dine In" },
                  { id: DELIVERY, name: "Delivery" },
                  { id: TAKE_AWAY, name: "Take Away" },
                  { id: FINISHED_WASTE, name: "Finished / Waste" },
                ]}
                idName="id"
                valueName="name"
                name="OrderMode"
                //   size={INPUT_SIZE}
                onChange={(e) =>
                  dispatch({
                    type: SP_SET_ORDER_MODE,
                    payload: {
                      id: e.value,
                      name: e.value === DELIVERY ? "Delivery" : "Take Away",
                    },
                  })
                }
                allowClear={false}
                value={posState.OrderModeId}
              />
              <TextFieldSP
                colSpan={8}
                label="Customer Phone"
                //   size={INPUT_SIZE}
                name="PhoneNumber"
                isNumber="true"
                //   onChange={() => {}}
                //   disabled={phoneDetail.PhoneNumber !== ""}
                //   value={phoneDetail.PhoneNumber}
                letterSpacing={2}
              />
              <FormSelectSP
                colSpan={8}
                label="Phone Type"
                listItem={posState.customerSupportingTable.Table4 || []}
                idName="SetupDetailId"
                valueName="SetupDetailName"
                name="PhoneTypeId"
                //   size={INPUT_SIZE}
                //   onChange={handleNewCustomerForm}
                //   value={
                //     phoneDetail === {}
                //       ? newCustomerForm.PhoneTypeId
                //       : phoneDetail.PhoneTypeId
                //   }
                // disabled={phoneDetail != {}}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <Col span={24}>
                <Card type="inner" title="Customer Name Form">
                  <Row gutter={[8, 8]}>
                    <FormCheckboxSP
                      colSpan={4}
                      label="New Customer Name"
                      name="customerName"
                      checked={newCustomerRequired.customerName}
                      onChange={(e) =>
                        setNewCustomerRequired({
                          ...newCustomerRequired,
                          [e.name]: e.value,
                        })
                      }
                      disabled={loading}
                    />
                    <TextFieldSP
                      colSpan={8}
                      label="Customer Name"
                      //   size={INPUT_SIZE}
                      name="CustomerName"
                      // onChange={handleNewCustomerForm}
                      //   value={newCustomerForm.CustomerName.toUpperCase()}
                      //   disabled={!newCustomerRequired.customerName}
                      //   required={newCustomerRequired.customerName}
                    />
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                {customerDetail.length > 0 && (
                  <Table
                    columns={customerColumn}
                    dataSource={customerDetail}
                    rowKey={(record) => record.CustomerId}
                    size="small"
                    pagination={false}
                  />
                )}
              </Col>
            </div>
            <div style={{ marginTop: "10px" }}>
              {posState.OrderModeId === DELIVERY ? (
                <Fragment>
                  <Card type="inner" title="Customer Address Form">
                    <Row gutter={[8, 8]}>
                      <FormCheckboxSP
                        colSpan={4}
                        label="New Customer Address"
                        name="address"
                        // checked={newCustomerRequired.address}
                        // onChange={(e) =>
                        //   setNewCustomerRequired({
                        //     ...newCustomerRequired,
                        //     [e.name]: e.value,
                        //   })
                        // }
                        // disabled={loading}
                      />
                      <FormSelectSP
                        colSpan={10}
                        label="City"
                        listItem={posState.customerSupportingTable.Table9 || []}
                        idName="CityId"
                        valueName="CityName"
                        name="CityId"
                        // size={INPUT_SIZE}
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.CityId}
                        // disabled={!newCustomerRequired.address}
                        // required={newCustomerRequired.address}
                      />
                      <FormSelectSP
                        colSpan={10}
                        label="Area"
                        listItem={
                          (posState.customerSupportingTable.Table8 &&
                            posState.customerSupportingTable.Table8.filter(
                              (x) => x.CityId === newCustomerForm.CityId
                            )) ||
                          []
                        }
                        idName="AreaId"
                        valueName="AreaName"
                        name="AreaId"
                        // size={INPUT_SIZE}
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.AreaId}
                        // required={newCustomerRequired.address}
                        // disabled={
                        //   newCustomerForm.CityId === null ||
                        //   !newCustomerRequired.address
                        // }
                      />
                      <TextFieldSP
                        colSpan={24}
                        label="Complete Address"
                        // size={INPUT_SIZE}
                        name="CompleteAddress"
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.CompleteAddress}
                        // disabled={!newCustomerRequired.address}
                      />
                      <TextFieldSP
                        colSpan={5}
                        label="Company Name"
                        // size={INPUT_SIZE}
                        name="CompanyName"
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.CompanyName}
                        // disabled={!newCustomerRequired.address}
                      />
                      <FormSelectSP
                        colSpan={3}
                        label="Address Type"
                        listItem={posState.customerSupportingTable.Table3 || []}
                        idName="SetupDetailId"
                        valueName="SetupDetailName"
                        name="AddressTypeId"
                        // size={INPUT_SIZE}
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.AddressTypeId}
                        // disabled={!newCustomerRequired.address}
                      />
                      <FormSelectSP
                        colSpan={3}
                        label="Room / House Type"
                        listItem={posState.customerSupportingTable.Table5 || []}
                        idName="SetupDetailId"
                        valueName="SetupDetailName"
                        name="RoomHouseCaptionId"
                        // size={INPUT_SIZE}
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.RoomHouseCaptionId}
                        // disabled={!newCustomerRequired.address}
                        // required={newCustomerRequired.address}
                      />
                      <TextFieldSP
                        colSpan={3}
                        label="Room / House No"
                        // size={INPUT_SIZE}
                        name="RoomHouse"
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.RoomHouse}
                        // disabled={!newCustomerRequired.address}
                        // required={newCustomerRequired.address}
                      />
                      <FormSelectSP
                        colSpan={3}
                        label="Block / Floor Type"
                        listItem={posState.customerSupportingTable.Table6 || []}
                        idName="SetupDetailId"
                        valueName="SetupDetailName"
                        name="BlockFloorCaptionId"
                        // size={INPUT_SIZE}
                        // value={newCustomerForm.BlockFloorCaptionId}
                        // onChange={handleNewCustomerForm}
                        // disabled={!newCustomerRequired.address}
                        // required={newCustomerRequired.address}
                      />
                      <TextFieldSP
                        colSpan={3}
                        label="Block / Floor No"
                        // size={INPUT_SIZE}
                        name="BlockFloor"
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.BlockFloor}
                        // disabled={!newCustomerRequired.address}
                        // required={newCustomerRequired.address}
                      />
                      <TextFieldSP
                        colSpan={4}
                        label="Building"
                        // size={INPUT_SIZE}
                        name="Building"
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.Building}
                        // disabled={!newCustomerRequired.address}
                        // required={newCustomerRequired.address}
                      />
                      <FormSelectSP
                        colSpan={5}
                        label="Street / Lane Type"
                        listItem={posState.customerSupportingTable.Table7 || []}
                        idName="SetupDetailId"
                        valueName="SetupDetailName"
                        name="StreetRowLaneCaptionId"
                        // size={INPUT_SIZE}
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.StreetRowLaneCaptionId}
                        // disabled={!newCustomerRequired.address}
                        // required={newCustomerRequired.address}
                      />
                      <TextFieldSP
                        colSpan={7}
                        label="Street / Lane"
                        // size={INPUT_SIZE}
                        name="StreetRowLane"
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.StreetRowLane}
                        // disabled={!newCustomerRequired.address}
                        // required={newCustomerRequired.address}
                      />
                      <TextFieldSP
                        colSpan={12}
                        label="Landmark"
                        // size={INPUT_SIZE}
                        name="LandMark"
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.LandMark}
                        // disabled={!newCustomerRequired.address}
                      />
                      <TextFieldSP
                        colSpan={24}
                        label="Remarks"
                        // size={INPUT_SIZE}
                        name="Remarks"
                        // onChange={handleNewCustomerForm}
                        // value={newCustomerForm.Remarks}
                        // disabled={!newCustomerRequired.address}
                      />
                    </Row>
                  </Card>
                  <Col span={24}>
                    {/* {customerAddressDetail.length > 0 && ( */}
                    <Table
                      columns={addressColumn}
                      //   dataSource={customerAddressDetail}
                      rowKey={(record) => record.CustomerAddressId}
                      size="small"
                      pagination={false}
                    />
                    {/* )} */}
                  </Col>
                </Fragment>
              ) : (
                <FormSelectSP
                  colSpan={6}
                  label="Branch List"
                  listItem={posState.customerSupportingTable.Table10 || []}
                  idName="BranchId"
                  valueName="CityBranchName"
                  name="BranchId"
                  //   size={INPUT_SIZE}
                  //   onChange={handleNewCustomerForm}
                  //   value={newCustomerForm.BranchId}
                />
              )}
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default CustomerSearchModal;
