import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../redux/actions/basicFormAction";
import {
  RESET_STATE,
  SET_FORM_FIELD_VALUE,
  SET_SEARCH_FIELD_VALUE,
  UPDATE_FORM_FIELD,
} from "../../redux/reduxConstants";
import { DeleteFilled, SaveFilled } from "@ant-design/icons";
import { Button, Space, message } from "antd";
import FormButton from "../../components/general/FormButton";
import { isNullValue } from "../../functions/generalFunctions";

const initialFormValues = {
  OperationId: null,
  CompanyId: null,
  SettingId: null,
  Value: "",
  UserId: null,
  UserIP: "1.2.2.1",
  SetupDetailId: null,
  BranchId: null,
};

const initialSearchValues = {
  OperationId: null,
  CompanyId: null,
  SettingId: null,
  Value: "",
  UserId: null,
  UserIP: "1.2.2.1",
  SetupDetailId: null,
  BranchId: null,
  SetupMasterId: null,
};

const CompanyDetailSettings = () => {
  const columns = [
    {
      title: "Setting",
      dataIndex: "SettingId",
      key: "SettingId",
    },
    {
      title: "Value",
      dataIndex: "SettingValue",
      key: "SettingValue",
    },
    {
      title: "Type",
      dataIndex: "Flex1",
      key: "Flex1",
    },
    {
      title: "Action",
      key: "action",
      render: (index) => (
        <Space size="middle">
          <Button
            type="text"
            onClick={() => handleDeleteRow(index.SettingId)}
            icon={<DeleteFilled className="redIcon" />}
          ></Button>
        </Space>
      ),
    },
  ];
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);

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
        "/CompanyDetailSetting",
        {
          OperationId: 1,
          CompanyId: userData.CompanyId,
          SettingId: null,
          Value: "",
          UserId: userData.UserId,
          UserIP: userData.UserIP,
          SetupDetailId: null,
          BranchId: null,
        },
        initialFormValues,
        initialSearchValues,
        controller,
        userData
      )
    );

    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  // useEffect(() => {
  //   if (updateId !== null) {
  //     dispatch({
  //       type: UPDATE_FORM_FIELD,
  //       payload: itemList.filter((item) => item.SubGroupId === updateId)[0],
  //     });
  //   }
  //   setUpdateId(null);
  // }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleDeleteRow = (id) => {
    dispatch(
      deleteRow(
        "/CompanyDetailSetting",
        { SettingId: id },
        controller,
        userData
      )
    );
  };
  const handleAdd = () => {
    if (
      searchFields.SetupMasterId === null ||
      searchFields.SetupDetailId === null
    ) {
      message.error("Please Fill Required Feilds");
      return;
    }
    if (searchFields.Value === "" || searchFields.Value === undefined) {
      message.error("Please Enter Value");
      return;
    }

    dispatch(
      submitForm(
        "/CompanyDetailSetting",
        {
          //   OperationId: 2,
          CompanyId: userData.CompanyId,
          SettingId: searchFields.SettingId,
          Value: searchFields.Value,
          SetupDetailId: searchFields.SetupDetailId,
          BranchId: searchFields.BranchId || null,
          UserId: userData.UserId,
          UserIP: userData.UserIP,
        },
        // formFields,
        initialFormValues,
        controller,
        userData,
        2
      )
    );
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table2 || []}
        idName="SetupMasterId"
        valueName="SetupMasterName"
        size={INPUT_SIZE}
        name="SetupMasterId"
        label="Main Setting"
        value={searchFields.SetupMasterId}
        onChange={handleSearchChange}
        required={true}
      />
      <FormSelect
        colSpan={4}
        listItem={
          searchFields.SetupMasterId !== null
            ? supportingTable?.Table1?.filter(
                (x) => x.SetupMasterId === searchFields.SetupMasterId
              )
            : supportingTable.Table1 || []
        }
        idName="SetupDetailId"
        valueName="SetupDetailName"
        size={INPUT_SIZE}
        name="SetupDetailId"
        label="Sub-Setting"
        value={searchFields.SetupDetailId}
        onChange={handleSearchChange}
        required={true}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table3 || []}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={searchFields.BranchId}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Value"
        name="Value"
        size={INPUT_SIZE}
        value={searchFields.Value || ""}
        onChange={handleSearchChange}
        required={true}
      />
      <FormButton
        colSpan={4}
        title="Update"
        type="primary"
        size={BUTTON_SIZE}
        className="actionButton"
        icon={<SaveFilled />}
        onClick={handleAdd}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Company Detail Setting"
      searchPanel={searchPanel}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="SettingId"
      editRow={setUpdateId}
      fields={initialFormValues}
      hideAddButton={true}
      hideSearchButton={true}
      hideEdit={true}
    />
  );
};

export default CompanyDetailSettings;
