import { Col, Popconfirm, Row } from "antd";
import React from "react";
import { Cart } from "../PunchingScreen/Screens/Cart";
import { Category } from "../PunchingScreen/Screens/Category";
import ModeCustomerTableWaiterCover from "../PunchingScreen/Screens/ModeCustomerTableWaiterCover/index";
import { ProductMenu } from "../PunchingScreen/Screens/ProductMenu";
import { RightSideButtons } from "../PunchingScreen/Screens/RightSideButtons";
import "./style.css";
import { list } from "./data";
import {
  SP_ADD_USER_BRANCH_LIST,
  SP_CHANGE_COMPANY,
  SP_SET_AUTH_STATE,
  SP_UPDATE_PRODUCT_CART,
  SP_USER_ROLE,
} from "./redux/reduxConstantsSinglePagePOS";
import { useEffect } from "react";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";

export default function PunchingScreen() {
  const { Branch, BranchList } = list;
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch({
      type: "SP_SET_BRANCH_ID",
      payload: Branch[0].BranchId,
    });
    dispatch({
      type: SP_ADD_USER_BRANCH_LIST,
      payload: BranchList,
    });
    dispatch({
      type: SP_USER_ROLE,
      payload: { RoleId: 2, RoleName: "Cashier" },
    });
    dispatch({
      type: SP_CHANGE_COMPANY,
      payload: { CompanyId: 116, CompanyName: "Krispy 2 Go" },
    });
    dispatch({
      type: SP_SET_AUTH_STATE,
      payload: { name: "UserName", value: "Cashier" },
    });
  }, []);

  return (
    <div className="main-container" style={{ padding: 10 }}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <ModeCustomerTableWaiterCover />
        </Col>
        <Col span={7}>
          <Cart />
        </Col>
        <Col span={11}>
          <ProductMenu />
        </Col>
        <Col span={4}>
          <Category />
        </Col>
        <Col span={2} style={{ display: "flex", justifyContent: "center" }}>
          <RightSideButtons />
        </Col>
      </Row>
    </div>
  );
}
