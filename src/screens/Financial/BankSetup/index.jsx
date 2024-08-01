import { Button, Col, message, Tag } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import { UPDATE_FORM_FIELD } from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";

const initialFormValues = {
  OperationId: 1,
  BankId: null,
  BankName: "",
};

const initialSearchValues = {
  OperationId: 1,
  BankId: null,
  BankName: "",
};

const initialDetailObj = {
  AccountNo: "",
  BankDetailId: null,
  OpeningBalance: 0,
};

const columns = [
  {
    title: "Bank Name",
    dataIndex: "BankName",
    key: "BankName",
  },
];

const BankSetup = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [bankDetail, setBankDetail] = useState([]);
  const [bankDetailObj, setBankDetailObj] = useState(initialDetailObj);

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudBank",
        initialFormValues,
        initialFormValues,
        initialSearchValues,
        controller,
        userData
      )
    );

    return () => {
      controller.abort();
      dispatch(resetState());
      setBankDetail([]);
      setBankDetailObj(initialDetailObj);
    };
  }, []);

  useEffect(() => {
    if (updateId !== null) {
      postRequest(
        "/CrudBank",
        {
          OperationId: 5,
          BankId: updateId,
          BankName: "",
          CompanyId: 112,
          UserId: 203,
          UserIP: "1.1.1.1",
        },
        controller
      )
        .then((response) => {
          if (response.error === true) {
            message.error(response.errorMessage);
            return;
          }
          const dataSet = response.data.DataSet.Table;
          const _initialFormValues = {
            OperationId: 1,
            BankId: dataSet[0].BankId,
            BankName: dataSet[0].BankName,
            Accounts: dataSet,
          };
          setBankDetail(
            dataSet.map((item) => {
              return { ...item };
            })
          );
          dispatch({
            type: UPDATE_FORM_FIELD,
            payload: _initialFormValues,
          });
          return;
        })
        .catch((error) => {
          console.error(error);
        });
      // dispatch({
      //   type: UPDATE_FORM_FIELD,
      //   payload: itemList.filter((item) => item.BankId === updateId)[0],
      // });
    }
    setUpdateId(null);
  }, [updateId]);

  const addAccount = () => {
    if (bankDetailObj.AccountNo === "" || bankDetailObj.OpeningBalance === "") {
      message.error("Please fill Account Number and Opening Balance first");
      return;
    }
    let isAccountDuplicate = bankDetail.find(
      (bnkDtl) => bnkDtl.AccountNo === bankDetailObj.AccountNo
    );
    if (isAccountDuplicate) {
      message.error("bank account exists");
      return;
    }

    setBankDetail([
      ...bankDetail,
      {
        AccountNo: bankDetailObj.AccountNo,
        OpeningBalance: bankDetailObj.OpeningBalance,
      },
    ]);
    setBankDetailObj({ ...initialDetailObj });
  };

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.BankName = searchFields.BankName.trim();
    dispatch(
      setInitialState(
        "/CrudBank",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CrudBank", { CityId: id }, controller, userData));
  };

  const onFormClose = () => {
    setBankDetail([]);
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    if (!bankDetail[0]) {
      message.error("Please add at least 1 account.");
      return;
    }
    dispatch(
      submitForm(
        "/CrudBank",
        { ...formFields, BankDetail: bankDetail },
        initialFormValues,
        controller,
        userData,
        id
      )
    );
    closeForm();
    setBankDetail([]);
  };

  const handleDetailFormChange = (e) => {
    setBankDetailObj({ ...bankDetailObj, [e.name]: e.value });
  };

  const deleteAccount = (x, i) => {
    let arr = [...bankDetail];
    arr.splice(i, 1);
    setBankDetail(arr);
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Bank Name"
        name="BankName"
        size={INPUT_SIZE}
        value={searchFields.BankName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={12}
        label="Bank Name"
        name="BankName"
        size={INPUT_SIZE}
        value={formFields.BankName}
        onChange={handleFormChange}
        required={true}
      />
      <Col span={24}>
        <div
          style={{
            padding: 10,
            border: "1px solid lightgray",
            borderRadius: 3,
            position: "relative",
            marginTop: 5,
          }}
        >
          <p
            style={{
              position: "absolute",
              top: -8,
              fontSize: 12,
              background: "white",
              padding: "0 5px",
            }}
          >
            Add Account Number
          </p>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <FormTextField
              colSpan={8}
              label="Account Number"
              name="AccountNo"
              size={INPUT_SIZE}
              value={bankDetailObj.AccountNo}
              onChange={handleDetailFormChange}
              isNumber="true"
            />
            <FormTextField
              colSpan={8}
              label="Opening Balance"
              name="OpeningBalance"
              size={INPUT_SIZE}
              value={bankDetailObj.OpeningBalance}
              onChange={handleDetailFormChange}
              isNumber="true"
            />
            <Button type="primary" onClick={addAccount}>
              Add
            </Button>
          </div>
          <div style={{ padding: 10 }}>
            <table>
              <tr>
                <td>Account Number</td>
                <td>Opening Balance</td>
                <td></td>
              </tr>
              {bankDetail.map((x, i) => (
                <tr>
                  <td>{x.AccountNo}</td>
                  <td>{parseFloat(x.OpeningBalance).toFixed(2)}</td>
                  <td>
                    <Button onClick={() => deleteAccount(x, i)}>x</Button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Banks"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="BankId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Bank"
      hideDelete={true}
      onFormClose={onFormClose}
    />
  );
};

export default BankSetup;
