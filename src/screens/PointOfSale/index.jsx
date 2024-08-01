import Title from "antd/lib/skeleton/Title";
import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  DELIVERY,
  DINE_IN,
  FOOD_BUSINESS_TYPE,
  RETAIL_BUSINESS_TYPE,
  TAKE_AWAY,
} from "../../common/SetupMasterEnum";
import { PRIMARY_COLOR } from "../../common/ThemeConstants";
import { SET_COLLAPSABLE, SET_POS_STATE } from "../../redux/reduxConstants";
import PointOfSaleFood from "./Food";
import PointOfSaleRetail from "./Retail";

const PointOfSale = () => {
  const userData = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userData?.companyList[0]?.BusinessTypeId === 1) {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "customerDetail",
          value: {
            OrderMode: userData.RoleId === 2 ? DINE_IN : DELIVERY,
            OrderModeName: userData.RoleId === 2 ? "Dine-In" : "Delivery",
            BranchId: null,
            BranchDetailId: null,
            CustomerId: null,
            CustomerAddressId: null,
            PhoneNumber: null,
            PhoneId: null,
            AreaId: null,
            CustomerName: null,
            Address: null,
            GSTId: null,
            GSTPercentage: 0,
          },
        },
      });
    }
    if (userData?.companyList[0]?.BusinessTypeId === 2) {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "customerDetail",
          value: {
            OrderMode: userData.RoleId === 2 ? TAKE_AWAY : DELIVERY,
            OrderModeName: userData.RoleId === 2 ? "Take Away" : "Delivery",
            BranchId: null,
            BranchDetailId: null,
            CustomerId: null,
            CustomerAddressId: null,
            PhoneNumber: null,
            PhoneId: null,
            AreaId: null,
            CustomerName: null,
            Address: null,
            GSTId: null,
            GSTPercentage: 0,
          },
        },
      });
    }
  }, []);

  return userData?.companyList.length &&
    userData?.companyList[0]?.BusinessTypeId == FOOD_BUSINESS_TYPE ? (
    <PointOfSaleFood />
  ) : userData?.companyList.length &&
    userData?.companyList[0]?.BusinessTypeId == RETAIL_BUSINESS_TYPE ? (
    <PointOfSaleRetail />
  ) : (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        flexDirection: "column",
      }}
    >
      <Title level={1} style={{ color: PRIMARY_COLOR }}>
        Point Of Sale Main Screen
      </Title>
      <Title level={2} style={{ color: PRIMARY_COLOR }}>
        Your Company don't have any Business Type. Please contact System Admin
      </Title>
    </div>
  );
};
export default PointOfSale;
