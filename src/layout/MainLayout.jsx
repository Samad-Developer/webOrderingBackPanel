import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import ModalComponent from "../components/formComponent/ModalComponent";
import FormSelect from "../components/general/FormSelect";
import ErrorBoundary from "../components/specificComponents/ErrorBoundary";
import { delay } from "../functions/generalFunctions";
import { getAllDataFromIDB } from "../functions/storage/getDataFromIDB";
import updateDataToIDB from "../functions/storage/updateDataToIDB";
import { changeCompany, signOut } from "../redux/actions/authAction";
import { SET_COLLAPSABLE } from "../redux/reduxConstants";
import HeaderLayout from "./Header";
import Sidebar from "./Sidebar";
import "./style.css";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { CompanyId, companyList, collapsable, RoleName, RoleId } = useSelector(
    (state) => state.authReducer
  );
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  // const [collapsable, setCollapsable] = useState(false);

  useEffect(() => {
    if (CompanyId === null) {
      if (RoleName !== "Management" && RoleId !== 14) setShowCompanyModal(true);
    }
  }, [CompanyId]);

  const cancelCompanyModal = () => {
    delay(() => {
      dispatch(signOut(navigate));
      setShowCompanyModal(false);
    }, 500);
  };

  const handleOk = () => {
    if (companyId !== null) {
      let data = companyList.filter(
        (listItem) => listItem.CompanyId === companyId
      );
      getAllDataFromIDB("userData", (result) => {
        updateDataToIDB(
          "userData",
          result[0].id,
          {
            ...result[0],
            CompanyId: data[0].CompanyId,
            CompanyName: data[0].CompanyName,
          },
          () => {
            dispatch(changeCompany(data[0]));
            if (CompanyId !== null) {
              setShowCompanyModal(false);
            }
          }
        );
      });
    }
  };

  const toggleCollapse = () => {
    dispatch({ type: SET_COLLAPSABLE, payload: !collapsable });
  };

  return (
    <div>
      <ModalComponent
        isModalVisible={showCompanyModal}
        handleCancel={cancelCompanyModal}
        handleOk={handleOk}
        okText="Proceed"
        cancelText="Sign Out"
        closable={false}
      >
        <h2>You're Super Admin :)</h2>
        <h3>Please Select a Company to continue...</h3>
        <br />
        <FormSelect
          value={companyId}
          onChange={(e) => {
            setCompanyId(e.value);
          }}
          listItem={companyList}
          idName="CompanyId"
          valueName="CompanyName"
          placeholder="Choose a Company"
        />
        <br />
        <span style={{ fontSize: 12, color: "gray" }}>
          Click anywhere on the screen to signout
        </span>
      </ModalComponent>
      <Layout>
        <HeaderLayout
          toggleCollapse={toggleCollapse}
          collapsable={collapsable}
        />
        <Layout style={{ display: "flex", flexDirection: "row" }}>
          <Sidebar collapsed={collapsable} />
          <Content
            className="content-container"
            style={{
              height: "Calc(100vh - 95px)",
              padding: "10px 10px 8px 10px",
              background: "#F8F8F8",
              overflow: "auto",
            }}
          >
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Content>
        </Layout>
        <footer className="mainFooter">
          Powered by{" "}
          <a href="/">
            <b></b>
          </a>
        </footer>
      </Layout>
    </div>
  );
};

export default MainLayout;
