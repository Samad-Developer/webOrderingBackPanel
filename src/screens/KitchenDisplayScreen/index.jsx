import { Card, Checkbox, message, Spin } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FormButton from "../../components/general/FormButton";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import { postRequest } from "../../services/mainApp.service";
import {
  BRANCH_ADMIN,
  COMPANY_ADMIN,
  DISPATCHER,
} from "../../common/SetupMasterEnum";

const KitchenDisplayScreen = () => {
  const initialFormValues = {
    BranchId: null,
    OrderMasterId: 0,
    OrderDetailLogStr: "",
    OperationId: 1,
  };
  const [totalOrders, setTotalOrders] = useState([]);
  const userData = useSelector((state) => state.authReducer);
  const { formLoading } = useSelector((state) => state.basicFormReducer);
  const { RoleId, branchId, Name, userBranchList } = useSelector(
    (state) => state.authReducer
  );
  const [loading, setLoading] = useState(false);
  const [mainList, setMainList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [noDataInBranch, setNoDataInBranch] = useState(false);

  const getOrders = () => {
    setLoading(true);
    postRequest("kds", {
      ...initialFormValues,
      BranchId: branchId !== null ? branchId : formValues.BranchId,
      CompanyId: userData.CompanyId,
      UserIP: "",
      UserId: userData.UserId,
      OperationId: 1,
      CityId: null,
    }).then((res) => {
      if (res.error === true) {
        setLoading(false);
        message.error(res.errorMessage);
        return;
      }
      if (res.data.response === false) {
        setLoading(false);
        message.error(res.DataSet.Table.errorMessage);
        return;
      }
      //mainList is the total number of orders
      setMainList(res.data.DataSet.Table);
      setBranchList(res.data.DataSet.Table2);
      if (RoleId === DISPATCHER) {
        setFormValues({
          ...formLoading,
          ["BranchId"]: res.data.DataSet.Table2[0].BranchId,
        });
      }
      if (
        res.data.DataSet.Table.length === 0 &&
        res.data.DataSet.Table1.length === 0
      ) {
        setLoading(false);
        setNoDataInBranch(true);
        return;
      } else {
        setNoDataInBranch(false);
      }
      let arr = res.data.DataSet.Table1.map((item) => ({
        ...item,
        checked: true,
      }));
      //total orders is an array combining all the order items in
      //an array
      setTotalOrders(arr);
      setLoading(false);
    });
  };

  useEffect(() => {
    getOrders();
  }, [formValues.BranchId]);

  useEffect(() => {
    // if (formValues.BranchId !== null) {
    const interval = setInterval(() => {
      getOrders();
      message.success("Latest Orders Fetched");
    }, 5000);
    return () => clearInterval(interval);
    // }
  }, []);

  const handleFormChange = (data) => {
    setFormValues({ ...formLoading, [data.name]: data.value });
  };
  const orderDone = (order) => {
    let array = totalOrders
      .filter(
        (x) => x.OrderMasterId === order.OrderMasterId && x.checked === true
      )
      .map((y) => y.OrderDetailLogId)
      .join(",");

    postRequest("kds", {
      ...formValues,
      BranchId: formValues.BranchId,
      OperationId: 2,
      OrderMasterId: order.OrderMasterId,
      OrderDetailLogStr: array.concat(","),
      CompanyId: userData.CompanyId,
    }).then((response) => {
      if (response.error === true) {
        setLoading(false);
        message.error(response.errorMessage);
        return;
      }
      if (response.data.response === false) {
        message.error(response.DataSet.Table.errorMessage);
        setLoading(false);
        return;
      }
      getOrders();
    });
  };

  return (
    <div>
      <div style={{ margin: 5 }}>
        <h1 style={{ color: "#4561B9", fontSize: 28 }}>
          <b>Kitchen Display Screen</b>
        </h1>
        <div
          style={{
            background: "white",
            padding: 15,
            boxShadow: "0 0 5px lightgray",
            borderRadius: 2,
          }}
        >
          {/* Select Branch */}
          {branchId === null && (
            <FormSelect
              colSpan={4}
              listItem={branchList || []}
              idName="BranchId"
              valueName="BranchName"
              name="BranchId"
              label="Select Branch"
              value={formValues.BranchId}
              onChange={handleFormChange}
              disabled={RoleId === DISPATCHER}
            />
          )}
          {
            <div
              style={{ margin: "10px 0px", borderTop: "1px solid lightgray" }}
            ></div>
          }
          {branchId !== null && (
            <FormTextField value={Name} disabled={true} colSpan={4} />
          )}
          {loading ? (
            <Spin
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  flexDirection: "column",
                  marginTop: 18,
                }}
              >
                {noDataInBranch && <h3>No Orders in the branch</h3>}

                {/* Card Wrapper  */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    marginTop: 20,
                    flexWrap: "wrap",
                    gap: 80,
                    rowGap: 40,
                  }}
                >
                  {mainList?.map(
                    (order, index) =>
                      order && (
                        <Card
                          title={
                            <div style={{ fontSize: 12 }}>
                              <div>
                                <b>OrderMode:</b> <span>{order.OrderMode}</span>
                              </div>
                              <div>
                                <b>Order Number:</b>
                                <span>{order.OrderNumber}</span>
                              </div>
                              {order.OrderMode === "DineIn" && (
                                <div>
                                  <b>Table:</b>
                                  <span>
                                    {order.TableName || "Not Assigned"}
                                  </span>
                                </div>
                              )}
                              {order.OrderMode === "DineIn" && (
                                <div>
                                  <b>Waiter:</b>
                                  <span>
                                    {order.WaiterName || "Not Assigned"}
                                  </span>
                                </div>
                              )}
                              {order.OrderMode === "Delivery" && (
                                <div>
                                  <b>Rider:</b>
                                  <span>
                                    {order.RiderName || "Not Assigned"}
                                  </span>
                                </div>
                              )}
                            </div>
                          }
                          extra={
                            <FormButton
                              title="Done"
                              type="primary"
                              onClick={() => orderDone(order)}
                            />
                          }
                          style={{
                            width: 350,
                            borderRadius: 2,
                            boxShadow: "lightgrey 0px 0px 5px",
                            marginBottom: 15,
                          }}
                          key={index}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {totalOrders
                              .filter(
                                (x) => x.OrderMasterId === order.OrderMasterId
                              )
                              .map((orderItem, ind) => (
                                <Checkbox
                                  onChange={(event) => {
                                    let ordArr = totalOrders;
                                    let changeIndex = totalOrders.findIndex(
                                      (z) =>
                                        z.OrderDetailLogId ===
                                        orderItem.OrderDetailLogId
                                    );
                                    ordArr[changeIndex].checked =
                                      event.target.checked;
                                    setTotalOrders([...ordArr]);
                                  }}
                                  key={ind}
                                  checked={orderItem.checked}
                                  style={{ marginLeft: 0 }}
                                >
                                  {orderItem.Product}
                                </Checkbox>
                              ))}
                          </div>
                        </Card>
                      )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default KitchenDisplayScreen;
