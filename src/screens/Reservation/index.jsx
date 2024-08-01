// Library Imports
import { CloseOutlined, DeleteFilled } from "@ant-design/icons";
import { Button, Col, DatePicker, Input, Row, Spin, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
// import moment from "moment";
import { Fragment, default as React, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

// Style and Theme Imports

// Common Components
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import { postRequest } from "../../services/mainApp.service";
// Redux Imports
import { EyeOutlined } from "@ant-design/icons";
import ModalComponent from "../../components/formComponent/ModalComponent";
import FormButton from "../../components/general/FormButton";
import FormCheckbox from "../../components/general/FormCheckbox";
import FormContainer from "../../components/general/FormContainer";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../redux/actions/basicFormAction";
import {
  SET_CUSTOMER_DETAIL,
  SET_CUSTOMER_SUPPORTING_TABLE,
  SET_POS_STATE,
  UPDATE_FORM_FIELD,
} from "../../redux/reduxConstants";
import CustomerEditReservation from "../PointOfSale/Retail/CustomerEditReservation";
import moment from "moment";
import { CASHIER } from "../../common/SetupMasterEnum";

// Initial state for the form field

const initialFormValues = {
  BranchId: null,
  Category: null,
  CNIC: null,
  Comments: null,
  CustomerId: null,
  CustomerAddressId: null,
  Email: null,
  Event: null,
  NoOfAdults: null,
  NoOfChildren: null,
  TotalAdvance: null,
  Comments: null,
  CommentsManagement: null,
  ReservationStatusId: null,
  CustomerId: null,
  PhoneId: null,
  CustomerAddressId: null,
  BranchId: null,
  PhoneNumber: null,
  PhoneId: null,
  ReservationDate: null,
  ReservationDetail: [],
  ReservationId: null,
  ReservationNumber: null,
  ReservationStatusId: null,
  TableId: null,
  TotalAdvance: null,
  IsWalkIn: false,
  CheckInTime: null,
  CheckOutTime: null,
  CutOffTime: null,
};

// Initial state for the search & filter

const initialSearchValues = {
  BranchId: null,
  DateFrom: null,
  DateTo: null,
  PhoneNumber: null,
  ReservationDetail: [],
  ReservationNumber: null,
};

// Initial Customer Form State
const initialCustomerFormValues = {
  AreaId: null,
  Address: null,
  BranchDetailId: null,
  BranchId: null,
  CompleteAddress: null,
  OrderMode: null,
  OrderModeName: "",
  BranchId: null,
  PaymentModeId: null,
  BranchDetailId: null,
  SlotId: null,
  IsWalkIn: false,
  GuestTypeId: null,
  SettingId: null,
  CustomerId: null,
  CustomerAddressId: null,
  CustomerName: null,
  GSTId: null,
  GSTPercentage: 0,
  OrderMode: null,
  OrderModeName: "",
  PhoneNumber: null,
  PhoneId: null,
};

// Columns for the Reservation Table
const columns = [
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

// Component Reservation
const Reservation = () => {
  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);
  const reportRef = useRef();
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const { RoleId } = useSelector((state) => state.authReducer);
  const userData = useSelector((state) => state.authReducer);
  const authState = useSelector((state) => state.authReducer);
  const customerInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const [html, setHtml] = useState("");

  const [updateId, setUpdateId] = useState(null);

  const [isUpdate, setIsUpdate] = useState(false);

  const [consumptionReport, setConsumptionReport] = useState(false);
  const [consumptionLoading, setConsumptionLoading] = useState(false);

  const [noOfReservation, setNoOfReservation] = useState();

  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedProduct, setSelectedProduct] = useState();

  const [itemTableList, setItemTableList] = useState([]);

  useEffect(() => {
    setItemTableList(
      supportingTable?.Table9?.filter(
        (e) => e.ReservationId === formFields.ReservationId
      )
    );
  }, [formFields.ReservationId]);

  const handleAddToList = (e) => {
    if (!selectedCategory || !e) {
      return;
    }

    const filteredItem = supportingTable.Table8.find(
      (obj) => obj.ProductDetailId === e.value
    );

    if (
      !filteredItem ||
      itemTableList?.find(
        (obj) => obj?.ProductDetailId === filteredItem?.ProductDetailId
      )
    ) {
      return;
    }

    if (itemTableList?.length > 0) {
      setItemTableList([...itemTableList, { ...filteredItem }]);
    } else {
      setItemTableList([{ ...filteredItem }]);
    }
  };

  const handleChangeItemListDetails = (event, record, name) => {
    const itemDetailArr = itemTableList;
    const index = itemDetailArr.findIndex(
      (x) => x.ProductDetailId === record.ProductDetailId
    );
    if (index > -1) {
      if (name === "Quantity") {
        let grnDet = itemDetailArr[index];
        grnDet[name] = Number(event.target.value);
        grnDet["Amount"] = Number(grnDet.Rate) * event.target.value;
        grnDet["ReservationId"] = grnDet["ReservationId"] ?? null;
        setItemTableList([...itemDetailArr]);
      }
    }
  };

  const handleRemoveItemDetail = (record, index) => {
    let arr = itemTableList;
    arr.splice(index, 1);
    setItemTableList([...arr]);
  };

  const initialCustomerPhone = {
    OperationId: 1,
    CompanyId: authState.CompanyId,
    PhoneNumber: "",
    UserId: authState.UserId,
    UserIP: "1.1.1.1",
  };

  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone);
  // Redux state for formFields, searchFields, itemList, formLoading, tableLoading, supportingTable
  // formFields handle all state of form
  // searchFields handle all state of search box
  // itemList is a list of reservations/items coming from the server
  // tableLoading is a boolean which enable or disable loading on table loading when any operation is occurring
  // supportingTable will help in DropDown data

  const handleOnPrint = useReactToPrint({
    content: () => reportRef.current,
    pageStyle: `
    @media print {
      .main {
        page-break-inside: avoid;
      }
    }
    `,
  });

  const viewDailyExpenseReport = (record, opId) => {
    if (record) {
      setConsumptionReport(record);
      setConsumptionLoading(false);
    } else {
      setConsumptionLoading(true);
    }
  };

  // Consumption Report
  const ConsumptionReport = React.forwardRef((props, ref) => {
    const { reportData } = props;

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "white",
          margin: "10px 5px",
          fontWeight: "1000",
          color: "#000",
          overflow: "auto",
          pageBreakInside: "avoid",
          pageBreakAfter: "avoid",
          pageBreakBefore: "avoid",
        }}
        // className="main"
      >
        {/* heading */}
        {consumptionLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
            }}
          >
            <Spin spinning={consumptionLoading} />
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Reservation No
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.ReservationNumber}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Branch Name
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.BranchName}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Customer Name
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.CustomerName}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                No Of Adults
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.NoOfAdults}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                No Of Childrens
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.NoOfChildrens}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Total Advance
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.TotalAdvance}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Reservation Date
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {/* {moment(reportData.ReservationDate).format("YYYY-MM-DD")} */}
                {reportData.ReservationDate &&
                  new Date(reportData.ReservationDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Reservation Status
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.ReservationStatus}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  });

  const changeCustomerPhone = (e) => {
    setCustomerPhone({ ...customerPhone, [e.name]: e.value });
  };

  useEffect(() => {
    if (formFields.ReservationDate && formFields?.BranchId) {
      postRequest(
        "/CrudReservation",
        {
          OperationId: 7,
          CompanyId: authState.CompanyId,
          ReservationDate: formFields.ReservationDate,
          UserId: authState.UserId,
          BranchId: formFields?.BranchId,
          ReservationDetail: [],
          UserIP: "1.1.1.1",
        },
        controller
      )
        .then((response) => {
          setNoOfReservation(response.data.DataSet.Table[0].TotalPersonsCount);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [formFields.ReservationDate, formFields.BranchId]);

  useEffect(() => {
    return () => {
      setCustomerPhone(initialCustomerPhone);
    };
  }, []);

  // useEffect(() => {
  //   // setItemTableList((x) => ({
  //   //   ...x,
  //   //   ExpiryDate: x.ExpiryDate?.split("T")[0],
  //   //   ManufactureDate: x.ManufactureDate?.split("T")[0],
  //   // }));
  // }, []);

  useEffect(() => {
    customerInputRef.current && customerInputRef.current.focus();
  }, []);

  const searchCustomer = (e) => {
    e.preventDefault();
    setLoading(true);
    postRequest("crudCustomer", { ...customerPhone }, controller).then(
      (response) => {
        if (response.error === true) {
          setLoading(false);
          return;
        }
        dispatch({
          type: SET_CUSTOMER_SUPPORTING_TABLE,
          payload: response.data.DataSet,
        });
        dispatch({
          type: SET_POS_STATE,
          payload: { name: "customerEditDrawer", value: true },
        });
        setLoading(false);
      }
    );
  };

  // This useEffect will work only once when component get render and get Data for displaying
  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudReservation",
        initialFormValues,
        initialFormValues,
        initialSearchValues,
        controller,
        userData
      )
    );
    columns.splice(columns.length - 2, 1, {
      title: "Slip",
      dataIndex: "view",
      render: (_, record) => {
        return (
          <FormButton
            icon={<EyeOutlined />}
            type="text"
            onClick={() => {
              viewDailyExpenseReport(record, 3);
            }}
          />
        );
      },
    });

    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  // This useEffect will work when we want to update any reservation
  useEffect(() => {
    if (updateId !== null) {
      // Just sending updated one reservation

      const reservationObject = itemList.filter(
        (item) => item.ReservationId === updateId
      )[0];
      reservationObject.ReservationDetail = itemTableList;

      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: reservationObject,
      });
    }
    setIsUpdate(true);
    setUpdateId(null);
  }, [updateId]);

  const handleCustomerClearRequest = () => {
    dispatch({
      type: SET_CUSTOMER_DETAIL,
      payload: initialCustomerFormValues,
    });
    setCustomerPhone(initialCustomerPhone);
    setItemTableList([]);
    setSelectedCategory();
    setSelectedProduct();
    setIsUpdate(false);
  };

  // function addOneDay(inputDate) {
  //   const convertedDate = new Date(inputDate);
  //   convertedDate.setDate(convertedDate.getDate() + 1);
  //   const formattedDate = convertedDate.toISOString().split("T")[0];
  //   return formattedDate;
  // }

  // This function will help in initialize value to state for search states
  const handleSearchChange = (data) => {
    if (data.value !== "") {
      dispatch(setSearchFieldValue(data));
    } else {
      dispatch(setSearchFieldValue({ name: data.name, value: null }));
    }
  };

  const funcSetReservationStatus = () => {
    if (RoleId == CASHIER) {
      if (isUpdate === true) {
        return supportingTable?.Table1;
      } else {
        return supportingTable?.Table1?.filter((a) => a.IsClosed === false);
      }
    } else {
      return supportingTable?.Table1;
    }
  };

  // This function will help in setting value to state for search states
  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  // This function will handle in hitting API request against the searches and filter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.ReservationNumber
      ? (searchFields.ReservationNumber = searchFields.ReservationNumber.trim())
      : null;
    searchFields.PhoneNumber
      ? (searchFields.PhoneNumber = searchFields.PhoneNumber.trim())
      : null;

    dispatch(
      setInitialState(
        "/CrudReservation",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  // This function will handle the delete reservation request
  const handleDeleteRow = (id) => {
    dispatch(
      deleteRow(
        "/CrudReservation",
        { ReservationId: id, ReservationDetail: [] },
        controller,
        userData
      )
    );
  };

  // This function will handle the form submission request
  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    const { CustomerId, CustomerAddressId, PhoneNumber, PhoneId } =
      posState.customerDetail;

    formFields.CustomerId = CustomerId ?? formFields.CustomerId;
    formFields.CustomerAddressId =
      CustomerAddressId ?? formFields.CustomerAddressId;
    formFields.PhoneNumber = PhoneNumber ?? formFields.PhoneNumber;
    formFields.PhoneId = PhoneId ?? formFields.PhoneId;
    formFields.ReservationDetail = itemTableList ?? [];

    if (formFields.ReservationDate?._d != undefined) {
      formFields.ReservationDate =
        formFields.ReservationDate?._d?.toLocaleString();
    }
    if (formFields.CheckInTime?._d != undefined) {
      formFields.CheckInTime = formFields.CheckInTime?._d?.toLocaleString();
    }
    if (formFields.CheckOutTime?._d != undefined) {
      formFields.CheckOutTime = formFields.CheckOutTime?._d?.toLocaleString();
    }
    if (formFields.CutOffTime?._d != undefined) {
      formFields.CutOffTime = formFields.CutOffTime?._d?.toLocaleString();
    }

    dispatch(
      submitForm(
        "/CrudReservation",
        formFields,
        initialFormValues,
        controller,
        userData,
        id
      )
    );
    handleCustomerClearRequest();
    closeForm();
  };

  // This function will store UI design for Search Panel
  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Date From"
        type="date"
        name="DateFrom"
        size={INPUT_SIZE}
        value={searchFields.DateFrom}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Date to"
        type="date"
        name="DateTo"
        size={INPUT_SIZE}
        value={searchFields.DateTo}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Reservation Number"
        name="ReservationNumber"
        size={INPUT_SIZE}
        value={searchFields.ReservationNumber}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        isNumber="true"
        label="Phone Number"
        name="PhoneNumber"
        size={INPUT_SIZE}
        value={searchFields.PhoneNumber}
        onChange={handleSearchChange}
        minLength={11}
        maxLength={11}
        pattern={"[0-9]{11}"}
      />

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table2 || []}
        disabled={!supportingTable.Table2}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch Name"
        value={searchFields.BranchId || ""}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  // This function will store UI design for submission form
  const formPanel = (
    <Fragment>
      <Col span={19} />
      <div
        style={{
          // borderLeft: "1px solid #d9d9d9",
          // borderRight: "1px solid #d9d9d9",
          height: "100%",
          padding: 20,
          marginTop: "-30px",
        }}
      >
        <FormContainer onSubmit={searchCustomer} className="searchCustomer">
          <Title level={5} style={{ color: "#336fc4e0" }}>
            Select Customer
          </Title>
          <div
            style={{
              display: "flex",
              justifyContent: "unset",
              alignItems: "center",
              width: "100%",
            }}
            className="divDiv"
          >
            <FormTextField
              width="100%;"
              placeholder="Search customer with phone"
              size="medium"
              isNumber="true"
              name="PhoneNumber"
              value={customerPhone.PhoneNumber}
              onChange={changeCustomerPhone}
              maxLength={11}
              minLength={11}
              ref={customerInputRef}
              autoFocus={true}
              tabIndex={0}
              containerStyle={{ width: "50%" }}
            />
            <Button
              style={{ background: "#4561b9 ", height: "32px", color: "white" }}
              type="text"
              onClick={(e) => {
                searchCustomer(e);
              }}
            >
              Find Customer
            </Button>
          </div>
          <div className="customerDetailDiv">
            <Row>
              <Col span={8}>
                <h4>Customer Name:</h4>
              </Col>
              <Col span={16}>
                <h4 style={{ color: "#00954A" }}>
                  {posState.customerDetail.CustomerName ||
                    formFields.CustomerName}
                </h4>
              </Col>
              <Col span={8}>
                <h4>Customer Phone:</h4>
              </Col>
              <Col span={16}>
                <h4 style={{ color: "#00954A" }}>
                  {posState.customerDetail.PhoneNumber ||
                    formFields.PhoneNumber}
                </h4>
              </Col>
            </Row>
          </div>
        </FormContainer>
      </div>

      <div
        style={{
          margin: "10px 0",
          borderTop: "1px solid lightgray",
          width: "100%",
        }}
      ></div>

      <FormTextField
        colSpan={8}
        label="Reservation Number"
        name="ReservationNumber"
        size={INPUT_SIZE}
        disabled={true}
        value={formFields.ReservationNumber}
        onChange={handleFormChange}
      />
      <FormTextField
        colSpan={8}
        name="Email"
        label="Customer Email"
        value={formFields.Email}
        onChange={handleFormChange}
        size={INPUT_SIZE}
        className="textInput"
      />
      <FormTextField
        colSpan={8}
        isNumber="true"
        label="Customer CNIC"
        name="CNIC"
        size={INPUT_SIZE}
        value={formFields.CNIC}
        onChange={handleFormChange}
        minLength={13}
        maxLength={13}
        pattern={"[0-9]{13}"}
      />
      <FormTextField
        colSpan={8}
        isNumber="true"
        label="Adults"
        name="NoOfAdults"
        size={INPUT_SIZE}
        value={formFields.NoOfAdults}
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Children"
        name="NoOfChildren"
        isNumber="true"
        size={INPUT_SIZE}
        value={formFields.NoOfChildren}
        onChange={handleFormChange}
        required={true}
      />

      <div
        style={{
          margin: "10px ",
          borderTop: "1px solid lightgray",
          width: "100%",
        }}
      ></div>

      {formFields.ReservationDate && formFields.BranchId && (
        <div span={24}>
          <Text span={8} level={2}>
            {noOfReservation === 0
              ? `No person is reserved for the selected date`
              : `${noOfReservation} person are reserved for the selected date.`}
          </Text>
        </div>
      )}

      {formFields.ReservationDate && formFields.BranchId && (
        <div
          style={{
            margin: "10px ",
            borderTop: "1px solid lightgray",
            width: "100%",
          }}
        />
      )}

      <FormTextField
        colSpan={8}
        label="Event"
        name="Event"
        size={INPUT_SIZE}
        value={formFields.Event}
        onChange={handleFormChange}
      />

      <FormTextField
        colSpan={8}
        label="Advance Payment"
        name="TotalAdvance"
        isNumber="true"
        size={INPUT_SIZE}
        value={formFields.TotalAdvance}
        onChange={handleFormChange}
      />

      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table4 || []}
        disabled={!supportingTable.Table4}
        idName="PaymentModeId"
        valueName="PaymentMode"
        size={INPUT_SIZE}
        name="PaymentModeId"
        label="Payment Mode"
        value={formFields.PaymentModeId || ""}
        onChange={handleFormChange}
        // required={true}
      />

      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table2 || []}
        disabled={!supportingTable.Table2}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch Name"
        value={formFields.BranchId || ""}
        onChange={handleFormChange}
        required={true}
      />

      <Col
        span={8}
        style={{
          // marginTop: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Text>
          {"Reservation Date"}
          <span style={{ color: "red", fontSize: 18, lineHeight: "14px" }}>
            *
          </span>
        </Text>
        <DatePicker
          style={{ width: "100%" }}
          placeholder="Advance Reservation Date"
          format="YYYY-MM-DD HH:mm:ss"
          value={
            formFields.ReservationDate
              ? moment(formFields?.ReservationDate)
              : ""
          }
          showTime
          allowClear={true}
          onChange={(time) => {
            handleFormChange({ name: "ReservationDate", value: time });
          }}
          required={true}
          defaultValue={moment()}
        />
      </Col>

      <FormSelect
        colSpan={8}
        // listItem={supportingTable.Table1 || []}
        listItem={funcSetReservationStatus() || []}
        disabled={
          !supportingTable.Table1 ||
          (RoleId === CASHIER &&
            isUpdate &&
            supportingTable.Table1.find(
              (obj) =>
                obj?.ReservationStatusId === formFields?.ReservationStatusId
            )?.IsClosed)
        }
        idName="ReservationStatusId"
        valueName="ReservationStatus"
        size={INPUT_SIZE}
        name="ReservationStatusId"
        label="Reservation Status"
        value={formFields.ReservationStatusId || ""}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={8}
        listItem={
          formFields.ReservationStatusId == 2
            ? supportingTable.Table3.filter(
                (item) => item.IsOpen === true && item.IsReserved === false
              )
            : supportingTable.Table3 || []
        }
        disabled={!supportingTable.Table3}
        idName="TableId"
        valueName="TableName"
        size={INPUT_SIZE}
        name="TableId"
        label="Table"
        value={formFields.TableId || ""}
        onChange={handleFormChange}
      />

      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table5 || []}
        disabled={!supportingTable.Table5}
        idName="GuestTypeId"
        valueName="GuestType"
        size={INPUT_SIZE}
        name="GuestTypeId"
        label="Reservation Guest"
        value={formFields.GuestTypeId || ""}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table6 || []}
        disabled={!supportingTable.Table6}
        idName="SlotId"
        valueName="Slot"
        size={INPUT_SIZE}
        name="SlotId"
        label="Slot"
        value={formFields.SlotId || ""}
        onChange={handleFormChange}
        required={false}
      />
      <FormCheckbox
        colSpan={24}
        idName="IsWalkIn"
        valueName="WalkIn"
        name="IsWalkIn"
        label="Walk In"
        checked={formFields.IsWalkIn}
        onChange={handleFormChange}
      />
      <DatePicker
        style={{ width: "30%", marginRight: "1%" }}
        placeholder="Check In Date Time"
        format="YYYY-MM-DD HH:mm:ss"
        value={formFields.CheckInTime ? moment(formFields?.CheckInTime) : ""}
        showTime
        allowClear={true}
        onChange={(time) => {
          handleFormChange({ name: "CheckInTime", value: time });
        }}
        required={true}
        defaultValue={moment()}
      />

      <DatePicker
        style={{ width: "30%", marginRight: "1%" }}
        placeholder="Check Out Date Time"
        format="YYYY-MM-DD HH:mm:ss"
        value={formFields.CheckOutTime ? moment(formFields?.CheckOutTime) : ""}
        showTime
        allowClear={true}
        onChange={(time) => {
          handleFormChange({ name: "CheckOutTime", value: time });
        }}
        required={true}
        defaultValue={moment()}
      />
      <DatePicker
        style={{ width: "30%", marginRight: "1%" }}
        placeholder="Cut Off Date Time"
        format="YYYY-MM-DD HH:mm:ss"
        value={formFields.CutOffTime ? moment(formFields?.CutOffTime) : ""}
        showTime
        allowClear={true}
        onChange={(time) => {
          handleFormChange({ name: "CutOffTime", value: time });
        }}
        required={true}
        defaultValue={moment()}
      />

      <div
        style={{
          margin: "10px 0",
          borderTop: "1px solid lightgray",
          width: "100%",
        }}
      ></div>

      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table7 || []}
        disabled={!supportingTable.Table7}
        idName="CategoryId"
        valueName="CategoryName"
        size={INPUT_SIZE}
        name="CategoryId"
        label="Category"
        value={selectedCategory?.value || ""}
        onChange={(e) => {
          setSelectedCategory(e);
          setSelectedProduct();
        }}
      />

      <FormSelect
        colSpan={8}
        listItem={
          supportingTable?.Table8?.filter(
            (obj) => obj.CategoryId === selectedCategory?.value
          ) || []
        }
        disabled={!supportingTable.Table8 || !selectedCategory}
        idName="ProductDetailId"
        valueName="ProductName"
        size={INPUT_SIZE}
        name="ProductDetailId"
        label="Product"
        value={selectedProduct?.value || ""}
        onChange={(e) => {
          setSelectedProduct(e);
          handleAddToList(e);
        }}
      />

      <Col span={8} />

      {itemTableList && itemTableList.length > 0 && (
        <Col span={24}>
          <Table
            rowClassName={(record, index) => {}}
            columns={[
              {
                title: "Item",
                dataIndex: "ProductName",
                key: "ProductDetailId",
                width: "25%",
              },
              {
                title: "Item Quantity",
                key: "Quantity",
                width: "25%",
                render: (_, record) => {
                  return (
                    <Input
                      required={true}
                      value={record.Quantity}
                      onChange={(event) => {
                        if (
                          event.target.value >= 0 ||
                          event.target.value === ""
                        )
                          handleChangeItemListDetails(
                            event,
                            record,
                            "Quantity"
                          );
                        else return;
                      }}
                      isNumber="true"
                      disabled={formFields?.IsSubmit === true ? true : false}
                      min={1}
                    />
                  );
                },
              },
              {
                title: "Rate",
                dataIndex: "Rate",
                key: "Rate",
                width: "25%",
              },
              {
                title: "Amount",
                dataIndex: "Amount",
                key: "Amount",
                width: "25%",
                render: (_, record) => {
                  return isNaN(record.Rate * record.Quantity)
                    ? ""
                    : record.Rate * record.Quantity;
                },
              },
              {
                title: "Delete",
                dataIndex: "delete",
                render: (_, record) => {
                  return (
                    <FormButton
                      type="text"
                      icon={<DeleteFilled className="redIcon" />}
                      onClick={() => {
                        handleRemoveItemDetail(record);
                      }}
                    >
                      X
                    </FormButton>
                  );
                },
              },
            ]}
            dataSource={itemTableList || []}
            rowKey={(e, i) => i}
            size="small"
            pagination={false}
          />
        </Col>
      )}

      <div
        style={{
          margin: "10px 0",
          borderTop: "1px solid lightgray",
          width: "100%",
        }}
      ></div>

      <div>
        <label>Comment</label>
        <TextArea
          cols={120}
          maxLength={1000}
          label="Comments"
          name="Comments"
          size={INPUT_SIZE}
          value={formFields.Comments}
          onChange={(e) =>
            handleFormChange({ name: e.target.name, value: e.target.value })
          }
        />
      </div>
      <div>
        <label>Comment By Management</label>
        <TextArea
          cols={120}
          maxLength={1000}
          label="CommentsManagement"
          name="CommentsManagement"
          size={INPUT_SIZE}
          value={formFields.CommentsManagement}
          onChange={(e) =>
            handleFormChange({ name: e.target.name, value: e.target.value })
          }
        />
      </div>
      <CustomerEditReservation phoneNumber={customerPhone.PhoneNumber} />
    </Fragment>
  );

  return (
    <>
      <BasicFormComponent
        formTitle="Reservation"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="ReservationId"
        editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle="Reservation"
        isCancel={true}
        onCancel={handleCustomerClearRequest}
      />

      <ModalComponent
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Title level={5}>Reservation</Title>
            <div style={{ display: "flex" }}>
              <Button
                onClick={() => {
                  setConsumptionReport(false);
                  setHtml("");
                }}
                style={{ marginRight: 5 }}
              >
                Close
              </Button>

              <Button
                onClick={() => {
                  handleOnPrint();
                }}
                type="primary"
              >
                Print
              </Button>
            </div>
          </div>
        }
        isModalVisible={consumptionReport}
        footer={[]}
      >
        <ConsumptionReport ref={reportRef} reportData={consumptionReport} />
      </ModalComponent>
    </>
  );
};

export default Reservation;
