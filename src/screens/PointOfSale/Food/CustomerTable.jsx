import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormDrawer from "../../../components/general/FormDrawer";
import FormTextField from "../../../components/general/FormTextField";
import FormTileButton from "../../../components/general/FormTileButton";
import FormButton from "../../../components/general/FormButton";
import {
  OPEN_PUNCH,
  SET_POS_STATE,
  SET_CUSTOMER_SUPPORTING_TABLE,
  SET_RESERVATION_SUPPORTING_TABLE,
  CLOSE_DRAWERS,
  SET_CUSTOMER_DETAIL,
  SET_GST,
  SET_ORDER_SOURCE,
} from "../../../redux/reduxConstants";
import CustomerEdit from "./CustomerEdit";
import { Col, DatePicker, message, Row, Space, Table } from "antd";
import FormContainer from "../../../components/general/FormContainer";
import { CloseOutlined, RightOutlined } from "@ant-design/icons";
import { postRequest } from "../../../services/mainApp.service";
import {
  MdFastfood,
  MdDeliveryDining,
  MdTakeoutDining,
  MdReceipt,
} from "react-icons/md";
import CoverSlot from "./CoverSlot";
import TableSlot from "./TableSlot";
import WaiterSlot from "./WaiterSlot";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";

import {
  DELIVERY,
  DINE_IN,
  FINISHED_WASTE,
  TAKE_AWAY,
  CASHIER,
  AGENT,
} from "../../../common/SetupMasterEnum";
import Title from "antd/lib/typography/Title";
import FormSelect from "../../../components/general/FormSelect";
import ReservationEdit from "./RerservationEdit";
import moment from "moment";

const waiterTableInitalValues = {
  OperationId: null,
  BranchId: null,
  UserId: null,
};

const CustomerTable = () => {
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const authState = useSelector((state) => state.authReducer);
  const [waiterTableFormValues, setWaiterTableFormValues] = useState(
    waiterTableInitalValues
  );

  const { supportingTable } = useSelector((state) => state.basicFormReducer);

  const userData = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const [tables, setTables] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const customerInputRef = useRef(null);

  const initialCustomerPhone = {
    OperationId: 1,
    CompanyId: authState.CompanyId,
    PhoneNumber: "",
    UserId: authState.UserId,
    UserIP: "1.1.1.1",
  };

  const initialReservation = {
    OperationId: 6,
    CompanyId: authState.CompanyId,
    PhoneNumber: null,
    ReservationNumber: null,
    ReservationDetail: [],
    UserId: authState.UserId,
    UserIP: "1.1.1.1",
  };

  const [branchId, setBranchId] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone);
  const [reservationSearch, setReservationSearch] =
    useState(initialReservation);
  const { RoleId } = useSelector((state) => state.authReducer);

  useEffect(() => {
    customerInputRef.current && customerInputRef.current.focus();
    if (authState?.userBranchList?.length === 1) {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "BranchId",
          value: authState?.userBranchList[0].BranchId,
        },
      });
    }
    postRequest(
      "/CrudInitial",
      {
        ...waiterTableFormValues,
        BranchId:
          posState.customerDetail.OrderMode === TAKE_AWAY
            ? posState.BranchId
            : authState.branchId,
        OperationId: 1,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "1.2.2.1",
      },
      controller
    )
      .then((response) => {
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "dealItemsList",
            value: response.data.DataSet.Table3,
          },
        });
        dispatch({
          type: SET_POS_STATE,
          payload: {
            name: "ridersList",
            value: response.data.DataSet.Table4,
          },
        });
        setTables(
          response?.data?.DataSet?.Table1 ? response?.data?.DataSet?.Table1 : []
        );
        setWaiters(
          response?.data?.DataSet?.Table ? response?.data?.DataSet?.Table : []
        );
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (authState.IsPos === true) {
      dispatch({
        type: SET_CUSTOMER_DETAIL,
        payload: { OrderMode: DINE_IN, OrderModeName: "Dine-In" },
      });
    } else {
      dispatch({
        type: SET_CUSTOMER_DETAIL,
        payload: { OrderMode: DELIVERY, OrderModeName: "Delivery" },
      });
    }

    return () => {
      setCustomerPhone(initialCustomerPhone);
    };
  }, []);

  useEffect(() => {
    if (posState.customerDetail.BranchId !== null)
      setBranchId(posState.customerDetail.BranchId);
  }, [posState.customerDetail.BranchId]);

  useEffect(() => {
    if (
      posState.customerDetail.OrderMode === TAKE_AWAY &&
      supportingTable?.Table3
    ) {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "BranchId",
          value: supportingTable?.Table3[0]?.BranchId,
        },
      });
    } else {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "BranchId",
          value: null,
        },
      });
    }
  }, [posState.customerDetail.OrderMode]);

  const selectOrderMode = (modeId, modeName) => {
    dispatch({
      type: SET_ORDER_SOURCE,
      payload: {
        id: null,
        name: "",
      },
    });
    dispatch({
      type: SET_CUSTOMER_DETAIL,
      payload: { OrderMode: modeId, OrderModeName: modeName },
    });
  };

  const changeCustomerPhone = (e) => {
    setCustomerPhone({ ...customerPhone, [e.name]: e.value });
  };

  const changeReservationSearch = (e) => {
    setReservationSearch({ ...reservationSearch, [e.name]: e.value });
  };

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

  const searchReservation = (e) => {
    e.preventDefault();
    setSearchLoading(true);
    postRequest("CrudReservation", { ...reservationSearch }, controller)
      .then((response) => {
        if (response.error === true) {
          setSearchLoading(false);
          return;
        }
        dispatch({
          type: SET_RESERVATION_SUPPORTING_TABLE,
          payload: response.data.DataSet,
        });
        dispatch({
          type: SET_POS_STATE,
          payload: { name: "ReservationEditDrawer", value: true },
        });
        setSearchLoading(false);
      })
      .catch((error) => console.error(error))
      .finally(() => setSearchLoading(false));
  };

  const gotoPunchScreen = () => {
    const extraCharges = [];
    // if (posState.customerDetail.OrderModeName === "Dine-In") {
    //   dispatch({
    //     type: OPEN_PUNCH,
    //   });
    //   return;
    // }
    postRequest(
      "crudMenu",
      {
        DisplayInPos: userData.IsPos,
        DisplayInWeb: false,
        DisplayInOdms: !userData.IsPos ? true : false,
        DisplayInMobile: false,
        BranchId: ![DINE_IN, FINISHED_WASTE].includes(
          posState.customerDetail.OrderMode
        )
          ? posState.BranchId
          : userData.branchId,
        Barcode: "",
        CompanyId: authState.CompanyId,
        OrderSourceId: posState.orderSourceId,
      },
      controller
    ).then((response) => {
      if (response.error === true) {
        message.error(response.errorMessage);
        return;
      }
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "punchScreenData",
          value: response.data.DataSet,
        },
      });
      response.data.DataSet.Table10.length &&
        response.data.DataSet.Table10.forEach((e) => {
          if (e.OrderModeId === posState.customerDetail.OrderMode)
            extraCharges.push({
              ExtraChargesName: e.ExtraChargesName,
              ExtraChargesId: e.ExtraChargesId,
              IsPercent: e.IsPercent,
              ChargesValue: e.ChargesValue,
              ExtraChargesAmount: e.IsPercent ? 0 : e.ChargesValue,
              Percentage: e.IsPercent ? e.ChargesValue : 0,
            });
        });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "extraCharges",
          value: extraCharges,
        },
      });

      // dispatch({
      //   type: SET_POS_STATE,
      //   payload: {
      //     name: "gstList",
      //     value: response?.data?.DataSet?.Table11,
      //   },
      // });
      const maxGst =
        posState.gstList.length !== 0 &&
        posState.gstList.reduce(function (prev, current) {
          return prev.GSTPercentage > current.GSTPercentage ? prev : current;
        });

      dispatch({
        type: SET_GST,
        payload: {
          GSTId: maxGst === false ? null : maxGst?.GSTId,
          GSTPercentage: maxGst === false ? 0 : maxGst?.GSTPercentage,
        },
      });
      dispatch({
        type: OPEN_PUNCH,
      });
    });
  };

  const OrderModeGroup = (
    <div style={{ padding: 20 }}>
      <Title level={3} style={{ color: "#336fc4e0" }}>
        Select Order Mode
      </Title>

      <div className="posOrderMode">
        <Col>
          {authState.IsPos && RoleId !== AGENT && (
            <FormTileButton
              type="outlined"
              color={
                posState.customerDetail.OrderMode === 109
                  ? "ant-btn-primary"
                  : ""
              }
              title="Dine-In"
              onClick={() => selectOrderMode(DINE_IN, "Dine-In")}
              font={14}
              icon={<MdFastfood fontSize={26}></MdFastfood>}
            />
          )}
        </Col>
        <Col>
          <FormTileButton
            type="outlined"
            color={
              posState.customerDetail.OrderMode === DELIVERY
                ? "ant-btn-primary"
                : ""
            }
            title="Delivery"
            onClick={() => selectOrderMode(DELIVERY, "Delivery")}
            font={14}
            icon={<MdDeliveryDining fontSize={26} />}
          />
        </Col>
        <Col>
          <FormTileButton
            type="outlined"
            color={
              posState.customerDetail.OrderMode === TAKE_AWAY
                ? "ant-btn-primary"
                : ""
            }
            title="Take Away"
            onClick={() => selectOrderMode(TAKE_AWAY, "Take Away")}
            font={14}
            icon={<MdTakeoutDining fontSize={26} />}
          />
        </Col>
        <Col>
          {authState.IsPos && RoleId !== AGENT && (
            <FormTileButton
              type="outlined"
              color={
                posState.customerDetail.OrderMode === FINISHED_WASTE
                  ? "ant-btn-primary"
                  : ""
              }
              title="Finished Waste"
              onClick={() => selectOrderMode(FINISHED_WASTE, "Finished Waste")}
              font={14}
              icon={<MdReceipt fontSize={26} />}
            />
          )}
        </Col>
        {posState.customerDetail.OrderMode === TAKE_AWAY && (
          <FormSelect
            // colSpan={6}
            label="Branch List"
            listItem={authState?.userBranchList || []}
            // listItem={supportingTable?.Table3 || []}
            idName="BranchId"
            valueName="BranchName"
            name="BranchId"
            size={INPUT_SIZE}
            onChange={(event) => {
              dispatch({
                type: SET_POS_STATE,
                payload: {
                  name: "BranchId",
                  value: event.value,
                },
              });
            }}
            value={
              // authState?.userBranchList?.length === 1
              //   ? authState?.userBranchList[0].BranchId
              //   :
              posState.BranchId
            }
          />
        )}
      </div>
      <Row
        className="posOrderSource"
        gutter={[10, 10]}
        style={{ marginTop: 15 }}
      >
        {posState?.orderSourceList
          ?.filter((x) => posState.customerDetail.OrderMode === x.OrderModeId)
          ?.map((source) => (
            <Col>
              <FormTileButton
                type="outlined"
                color={
                  posState.orderSourceId === source.OrderSourceId
                    ? "ant-btn-primary"
                    : ""
                }
                title={source.OrderSource}
                onClick={() => {
                  dispatch({
                    type: SET_ORDER_SOURCE,
                    payload: {
                      id: source.OrderSourceId,
                      name: source.OrderSource,
                    },
                  });
                }}
                height={90}
                width={90}
                font={13}
                // icon={<MdTakeoutDining fontSize={26} />}
              />
            </Col>
          ))}
      </Row>
    </div>
  );

  const Customer = (
    <div
      style={{
        borderLeft: "1px solid #d9d9d9",
        borderRight: "1px solid #d9d9d9",
        height: "100%",
        padding: 20,
      }}
    >
      <FormContainer onSubmit={searchCustomer} className="searchCustomer">
        <Title level={3} style={{ color: "#336fc4e0" }}>
          Select Customer
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
          }}
          className="divDiv"
        >
          <FormTextField
            width="100%;"
            placeholder="Search customer with phone"
            size="large"
            isNumber="true"
            name="PhoneNumber"
            value={customerPhone.PhoneNumber}
            onChange={changeCustomerPhone}
            maxLength={11}
            minLength={11}
            ref={customerInputRef}
            autoFocus={true}
            tabIndex={0}
            containerStyle={{ width: "100%" }}
          />
          <FormButton
            title="Find Customer"
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            disabled={customerPhone.PhoneNumber === ""}
          />
        </div>
        <div className="customerDetailDiv">
          <Row>
            <Col span={8}>
              <h3>Customer Name:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.customerDetail.CustomerName}
              </h3>
            </Col>
            <Col span={8}>
              <h3>Customer Phone:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.customerDetail.PhoneNumber}
              </h3>
            </Col>
            <Col span={8}>
              <h3>Complete Address:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.customerDetail.CompleteAddress}
              </h3>
            </Col>
            <Col span={8}>
              <h3>Customer Address:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.customerDetail.Address}
              </h3>
            </Col>
          </Row>
        </div>
      </FormContainer>

      <FormContainer onSubmit={searchReservation} className="searchCustomer">
        <Title level={3} style={{ color: "#336fc4e0" }}>
          Select Reservation
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
          }}
          className="divDiv"
        >
          <FormTextField
            width="40%;"
            placeholder="Search By Phone"
            size="medium"
            isNumber="true"
            name="PhoneNumber"
            value={reservationSearch.PhoneNumber}
            onChange={changeReservationSearch}
            maxLength={11}
            minLength={11}
            ref={customerInputRef}
            autoFocus={true}
            tabIndex={0}
            containerStyle={{ width: "40%" }}
          />

          <FormTextField
            width="40%;"
            placeholder="Search By Reservation No."
            size="medium"
            name="ReservationNumber"
            value={reservationSearch.ReservationNumber}
            onChange={changeReservationSearch}
            ref={customerInputRef}
            autoFocus={true}
            tabIndex={0}
            containerStyle={{ width: "40%" }}
          />
          <FormButton
            title="Find Reservation"
            type="primary"
            size="medium"
            htmlType="submit"
            loading={searchLoading}
            disabled={
              reservationSearch.ReservationNumber === "" &&
              reservationSearch.PhoneNumber === ""
            }
          />
        </div>
        <div className="customerDetailDiv">
          <Row>
            <Col span={8}>
              <h3>Reservation Number:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.reservationDetail.ReservationNumber}
              </h3>
            </Col>
            <Col span={8}>
              <h3>Reservation Date:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.reservationDetail.ReservationDate &&
                  new Date(
                    posState.reservationDetail.ReservationDate
                  ).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
              </h3>
            </Col>
            <Col span={8}>
              <h3>No Of Adults:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.reservationDetail.NoOfAdults}
              </h3>
            </Col>
            <Col span={8}>
              <h3>No of Children:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.reservationDetail.NoOfChildren}
              </h3>
            </Col>
            <Col span={8}>
              <h3>Status:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.reservationDetail.ReservationStatus}
              </h3>
            </Col>
          </Row>
        </div>
      </FormContainer>
    </div>
  );

  const reservation = (
    <div
      style={{
        borderLeft: "1px solid #d9d9d9",
        borderRight: "1px solid #d9d9d9",
        height: "100%",
        padding: 20,
      }}
    >
      <FormContainer onSubmit={searchCustomer} className="searchCustomer">
        <Title level={3} style={{ color: "#336fc4e0" }}>
          Select Customer
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
          }}
          className="divDiv"
        >
          <FormTextField
            width="100%;"
            placeholder="Search customer with phone"
            size="large"
            isNumber="true"
            name="PhoneNumber"
            value={customerPhone.PhoneNumber}
            onChange={changeCustomerPhone}
            maxLength={11}
            minLength={11}
            ref={customerInputRef}
            autoFocus={true}
            tabIndex={0}
            containerStyle={{ width: "100%" }}
          />
          <FormButton
            title="Find Customer"
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            disabled={customerPhone.PhoneNumber === ""}
          />
        </div>
        <div className="customerDetailDiv">
          <Row>
            <Col span={8}>
              <h3>Customer Name:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.customerDetail.CustomerName}
              </h3>
            </Col>
            <Col span={8}>
              <h3>Customer Phone:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.customerDetail.PhoneNumber}
              </h3>
            </Col>
            <Col span={8}>
              <h3>Complete Address:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.customerDetail.CompleteAddress}
              </h3>
            </Col>
            <Col span={8}>
              <h3>Customer Address:</h3>
            </Col>
            <Col span={16}>
              <h3 style={{ color: "#00954A" }}>
                {posState.customerDetail.Address}
              </h3>
            </Col>
          </Row>
        </div>
      </FormContainer>
    </div>
  );

  const FormComponent = (
    <div style={{ paddingTop: 50 }}>
      <div className="formDrawerHeader">
        <Row
          align="right"
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h2>New Order</h2>
          <Space>
            <FormButton
              title="Cancel Order"
              color="gray"
              type="default"
              size={BUTTON_SIZE}
              icon={<CloseOutlined />}
              onClick={() => {
                dispatch({
                  type: CLOSE_DRAWERS,
                });
                dispatch({
                  type: "RESET_DEFAULT_POS_STATE",
                  payload: {
                    RoleId: userData.RoleId,
                    BusinessTypeId: userData?.companyList[0]?.BusinessTypeId,
                  },
                });
              }}
            />
            <FormButton
              title="Next"
              size={BUTTON_SIZE}
              type="primary"
              icon={<RightOutlined />}
              onClick={gotoPunchScreen}
              disabled={
                posState.orderSourceId === null ||
                (posState.BranchId === null &&
                  ![FINISHED_WASTE, DINE_IN].includes(
                    posState.customerDetail.OrderMode
                  )) ||
                (posState.tableId === null &&
                  [DINE_IN].includes(posState.customerDetail.OrderMode) &&
                  tables[0]?.IsMandatoryTableSelection !== 0)
              }
            />
          </Space>
        </Row>
      </div>
      <div className="formDrawerBody" style={{ padding: 0 }}>
        <Col
          span={16}
          style={{
            display: "flex",
          }}
        >
          <Col span={12}>{OrderModeGroup}</Col>
          <Col span={12}>{Customer}</Col>
        </Col>
        {RoleId === CASHIER && (
          <Col
            span={8}
            style={{
              height: "46vh",
              padding: "20px",
            }}
          >
            <CoverSlot
              disabled={
                !authState.IsPos ||
                posState.customerDetail.OrderMode !== DINE_IN
              }
            />
          </Col>
        )}
        {RoleId === CASHIER && (
          <Col span={16} style={{ height: "44vh" }}>
            <TableSlot
              disabled={
                !authState.IsPos ||
                posState.customerDetail.OrderMode !== DINE_IN
              }
              tables={tables}
            />
          </Col>
        )}
        {authState?.IsPos && (
          <Col
            span={8}
            style={{
              height: "44vh",
              borderLeft: "1px solid #d9d9d9",
              borderTop: "1px solid #d9d9d9",
              padding: "10px 20px",
            }}
          >
            <WaiterSlot
              disabled={
                !authState.IsPos ||
                posState.customerDetail.OrderMode !== DINE_IN
              }
              waiters={waiters}
            />
          </Col>
        )}
      </div>
      <CustomerEdit phoneNumber={customerPhone.PhoneNumber} />
      <ReservationEdit phoneNumber={reservationSearch.PhoneNumber} />
    </div>
  );

  return (
    posState.customerTableDrawer && (
      <FormDrawer
        visible={posState.customerTableDrawer}
        formComponent={FormComponent}
        width="100vw"
        className="formDrawer"
      />
    )
  );
};

export default CustomerTable;
