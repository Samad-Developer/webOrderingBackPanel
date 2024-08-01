import { CloseOutlined, SaveFilled } from "@ant-design/icons";
import { Card, Col, message, Row, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormButton from "../../../components/general/FormButton";
import FormCheckbox from "../../../components/general/FormCheckbox";
import FormContainer from "../../../components/general/FormContainer";
import FormDrawer from "../../../components/general/FormDrawer";
import FormTextField from "../../../components/general/FormTextField";
import {
  SET_CUSTOMER_DETAIL,
  SET_POS_STATE,
} from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";
import { BUTTON_SIZE } from "../../../common/ThemeConstants";
import { DELIVERY, TAKE_AWAY } from "../../../common/SetupMasterEnum";

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

const CustomerEditReservation = (props) => {
  const userState = useSelector((state) => state.authReducer);
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const dispatch = useDispatch();
  const controller = new window.AbortController();

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
    posState.customerSupportingTable.Table &&
    posState.customerSupportingTable.Table.length > 0
      ? setPhoneDetail(posState.customerSupportingTable.Table[0])
      : setPhoneDetail({ PhoneNumber: props.phoneNumber });
    if (posState.customerSupportingTable.Table1) {
      setCustomerDetail(posState.customerSupportingTable.Table1);
      posState.customerSupportingTable.Table1.length === 0 &&
        setNewCustomerRequired({ ...newCustomerRequired, customerName: true });
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
  }, [posState.customerSupportingTable.Table]);

  const closeCustomerEdit = () => {
    dispatch({
      type: SET_POS_STATE,
      payload: { name: "customerEditDrawer", value: false },
    });
  };

  const handleNewCustomerForm = (e) => {
    setNewCustomerForm({ ...newCustomerForm, [e.name]: e.value });
    if (posState.customerDetail.OrderMode === TAKE_AWAY) {
      if (e.name === "BranchId") {
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "BranchId",
            value: e.value,
          },
        });
      }
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

  const handleSubmit = () => {
    // e.preventDefault();
    if (
      posState.customerDetail.OrderMode === TAKE_AWAY &&
      newCustomerForm.BranchId === null
    ) {
      message.error("Please Select Branch First");
      return;
    }
    setLoading("true");
    let branchId =
      posState.customerDetail.OrderMode === TAKE_AWAY
        ? newCustomerForm.BranchId
        : null;
    let address = customerAddressDetail.filter((x) => x.IsPrimary === true)[0];
    let customer = customerDetail.filter((x) => x.IsPrimary === true)[0];
    let data;

    // SETTING BRANCH_ID TO NULL FOR DELIVERY AND TAKEAWAY
    if (
      posState.customerDetail.OrderMode !== 111 &&
      posState.customerDetail.OrderMode !== TAKE_AWAY
    )
      newCustomerForm.BranchId = null;
    if (
      newCustomerRequired.customerName === true ||
      newCustomerRequired.address === true
    ) {
      if (newCustomerRequired.customerName === false)
        data = {
          ...newCustomerForm,
          ...customer,
          IsPrimary: true,
          PhoneId: phoneDetail.PhoneId,
          PhoneNumber: phoneDetail.PhoneNumber,
          OperationId: 2,
          CompanyId: userState.CompanyId,
          UserId: userState.UserId,
          UserIP: "1.2.2.1",
        };
      if (newCustomerRequired.address === false)
        data = {
          ...newCustomerForm,
          ...address,
          IsPrimary: true,
          PhoneId: phoneDetail.PhoneId,
          PhoneNumber: phoneDetail.PhoneNumber,
          OperationId: 2,
          CompanyId: userState.CompanyId,
          UserId: userState.UserId,
          UserIP: "1.2.2.1",
        };
      if (
        newCustomerRequired.customerName === true &&
        newCustomerRequired.address === true
      )
        data = {
          ...newCustomerForm,
          IsPrimary: true,
          PhoneId: phoneDetail.PhoneId ? phoneDetail.PhoneId : null,
          PhoneNumber: phoneDetail.PhoneNumber,
          OperationId: 2,
          CompanyId: userState.CompanyId,
          UserId: userState.UserId,
          UserIP: "1.2.2.1",
        };
    } else {
      if (posState.customerDetail.OrderMode !== TAKE_AWAY) {
        if (
          customerAddressDetail.filter((x) => x.IsPrimary === true).length ===
            0 ||
          customerDetail.filter((x) => x.IsPrimary === true).length === 0
        ) {
          message.error(
            "Please select 1 Customer and 1 Address then try again"
          );
          setLoading(false);
          return;
        }
      }
      data = {
        ...customerAddressDetail.filter((x) => x.IsPrimary === true)[0],
        ...customerDetail.filter((x) => x.IsPrimary === true)[0],

        PhoneId: phoneDetail.PhoneId ? phoneDetail.PhoneId : null,
        PhoneNumber: phoneDetail.PhoneNumber,
        OperationId: 3,
        CompanyId: userState.CompanyId,
        UserId: userState.UserId,
        UserIP: "1.2.2.1",
      };
    }
    postRequest("/crudCustomer", { ...data }, controller).then((response) => {
      setCustomer(response, branchId, data.OperationId);
    });
  };

  const setCustomer = (response, branchId, opId) => {
    if (response.error === true) {
      message.error(response.errorMessage);
      setLoading(false);
      return;
    }
    let DataTable = null;
    let DataTable2 = null;
    if (opId === 3) {
      let {
        data: {
          DataSet: { Table, Table1 },
        },
      } = response;
      DataTable = Table[0];
      DataTable2 = Table1;
    }
    if (opId === 2) {
      let {
        data: {
          DataSet: { Table2, Table1 },
        },
      } = response;
      DataTable = Table1[0];
      DataTable2 = Table2;
    }
    if (posState.customerDetail.OrderMode !== TAKE_AWAY) {
      setNewCustomerForm(initialCustomerFormValues);
    }
    setLoading(false);

    dispatch({
      type: SET_CUSTOMER_DETAIL,
      payload: {
        BranchId:
          posState.customerDetail.OrderMode !== TAKE_AWAY
            ? DataTable.BranchId
            : branchId,
        BranchName:
          posState.customerDetail.OrderMode !== TAKE_AWAY
            ? DataTable.BranchName
            : posState.customerSupportingTable.Table10.filter(
                (e) => e.BranchId === branchId
              )[0].CityBranchName,
        BranchDetailId: DataTable.BranchDetailId,
        CustomerId: DataTable.CustomerId,
        CustomerName: DataTable.CustomerName,
        Address: DataTable.Address,
        CompleteAddress: DataTable.CompleteAddress,
        CustomerAddressId: DataTable.CustomerAddressId,
        PhoneNumber: DataTable.PhoneNumber,
        PhoneId: DataTable.PhoneId,
        AreaId: DataTable.AreaId,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: { name: "deliveryTimeList", value: DataTable2 },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "deliveryCharges",
        value: DataTable.DeliveryCharges,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "deliveryTime",
        value: DataTable.DeliveryTime,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "BranchId",
        value:
          posState.customerDetail.OrderMode !== TAKE_AWAY
            ? DataTable.BranchId
            : branchId,
      },
    });
    dispatch({
      type: SET_POS_STATE,
      payload: {
        name: "BranchName",
        value:
          posState.customerDetail.OrderMode !== TAKE_AWAY
            ? DataTable.BranchName
            : posState.customerSupportingTable.Table10.filter(
                (e) => e.BranchId === branchId
              )[0].BranchName,
      },
    });
    message.info("Customer Selected");
    closeCustomerEdit(false);
  };

  const customerColumn = [
    {
      title: "Primary",
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
      title: "Customer Name",
      dataIndex: "CustomerName",
      key: "CustomerName",
    },
  ];

  const FormComponent = (
    <div style={{ paddingTop: 52 }}>
      <div className="formDrawerHeader">
        <h2>Customer Reservation Detail Form</h2>
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
            onClick={handleSubmit}
            loading={loading}
          />
        </Space>
      </div>
      <div className="formDrawerBody">
        <FormTextField
          colSpan={8}
          label="Customer Phone"
          size={INPUT_SIZE}
          name="PhoneNumber"
          isNumber="true"
          onChange={() => {}}
          disabled={phoneDetail.PhoneNumber !== ""}
          value={phoneDetail.PhoneNumber}
          letterSpacing={2}
        />

        <Col span={24}>
          <Card type="inner" title="Customer Name Form">
            <Row gutter={[8, 8]}>
              <FormCheckbox
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
              <FormTextField
                colSpan={8}
                label="Customer Name"
                size={INPUT_SIZE}
                name="CustomerName"
                onChange={handleNewCustomerForm}
                value={newCustomerForm.CustomerName.toUpperCase()}
                disabled={!newCustomerRequired.customerName}
                required={newCustomerRequired.customerName}
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
    </div>
  );

  return (
    <FormDrawer
      // title="Customer Detail Form"
      visible={posState.customerEditDrawer}
      formComponent={FormComponent}
      onClose={() =>
        dispatch({
          type: SET_POS_STATE,
          payload: { name: "customerEditDrawer", value: false },
        })
      }
      width="90vw"
      className="customerDetailContainer"
    />
  );
};

export default CustomerEditReservation;
