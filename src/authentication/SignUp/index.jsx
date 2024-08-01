import {
  ArrowLeftOutlined,
  LoginOutlined,
  MailFilled,
  ShoppingFilled,
} from "@ant-design/icons";
import { Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import FormButton from "../../components/general/FormButton";
import FormTextField from "../../components/general/FormTextField";
import "./styles.css";
import { SignUpAction } from "../../redux/actions/authAction";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import { resetState } from "../../redux/actions/basicFormAction";
import FormSelect from "../../components/general/FormSelect";
import { postRequest } from "../../services/mainApp.service";
const initialValues = {
  OperationId: 2,
  EmailAddress: "",
  CompanyId: null,
  CompanyName: "",
  NoOfTerminals: 1,
  BusinessTypeId: 1,
  CountryId: null,
  UserId: 0,
  UserIP: "",
  CompanyLogo: "",
};

const busiessTypeValue = {
  SetupMasterId: 1,
  ParentId: null,
  SetupDetailName: "",
  Flex1: "",
  Flex2: "",
  Flex3: "",
  SetupDetailId: null,
  OperationId: 1,
  UserId: 0,
  CompanyId: null,
  UserIP: "1.1.1.1",
};
const countriesInitValues = {
  CountryId: null,
  CountryName: "",
  OperationId: 1,
  CompanyId: 1,
  UserId: 0,
  UserIP: "1.2.2.1",
};
const SignUp = () => {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState(initialValues);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.authReducer);
  const controller = new window.AbortController();
  const [countiesList, setCountriesList] = useState([]);
  const [bussinessTypes, setBusinessTypes] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(SignUpAction(formFields, navigate));
  };

  const handleFormFields = (data) => {
    setFormFields({ ...formFields, [data.name]: data.value });
  };

  useEffect(() => {
    postRequest("/GetBusinessTypeList", busiessTypeValue, controller).then(
      (res) => setBusinessTypes(res.data.DataSet.Table)
    );
    postRequest("/CrudAllCountry", countriesInitValues, controller).then(
      (res) => setCountriesList(res.data.DataSet.Table)
    );
    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  return (
    <div className="authParent">
      <div className="insideAuth">
        <form onSubmit={handleSubmit}>
          <div className="authLogo">
            <img src={null} alt="" className="logo" />
          </div>
          <Row className={"authChild"}>
            <FormTextField
              colSpan={24}
              name="CompanyName"
              value={formFields.CompanyName}
              onChange={handleFormFields}
              required={true}
              size={INPUT_SIZE}
              className="textInput"
              label="Company Name"
              prefix={<ShoppingFilled />}
            />

            <FormTextField
              colSpan={24}
              name="EmailAddress"
              type="email"
              value={formFields.EmailAddress}
              onChange={handleFormFields}
              required={true}
              size={INPUT_SIZE}
              className="textInput"
              label="Email"
              prefix={<MailFilled />}
            />

            <FormTextField
              colSpan={24}
              name="NoOfTerminals"
              value={formFields.NoOfTerminals}
              onChange={handleFormFields}
              required={true}
              size={INPUT_SIZE}
              className="textInput"
              label="Number of Terminals"
              min={1}
              isNumber="true"
              prefix={<ShoppingFilled />}
            />

            <FormSelect
              listItem={bussinessTypes || []}
              colSpan={24}
              idName="SetupDetailId"
              valueName="SetupDetailName"
              size={INPUT_SIZE}
              name="BusinessTypeId"
              className="textInput"
              label="Business Type"
              value={formFields.BusinessTypeId}
              onChange={handleFormFields}
              required={true}
            />

            <FormSelect
              listItem={countiesList || []}
              colSpan={24}
              idName="CountryId"
              valueName="CountryName"
              size={INPUT_SIZE}
              className="textInput"
              name="CountryId"
              label="Country Name"
              value={formFields.CountryId}
              onChange={handleFormFields}
              required={true}
            />
            <div className="formAction">
              <FormButton
                colSpan={24}
                title="Sign Up"
                htmlType="submit"
                type="primary"
                size={BUTTON_SIZE}
                className="actionButton"
                icon={<LoginOutlined />}
                loading={userInfo.authLoading}
              />
            </div>
            <Link to="/login" className="goBackToLogin">
              <Typography.Text
                style={{
                  fontSize: "13px",
                  fontStyle: "normal",
                  color: "#4561b9",
                }}
              >
                <ArrowLeftOutlined />
                &nbsp;Go back to login
              </Typography.Text>
            </Link>
          </Row>
        </form>
        <Typography.Text className="copyRightTxt">
          Copyright © {new Date().getFullYear()}
        </Typography.Text>
      </div>
    </div>
  );
};

export default SignUp;
