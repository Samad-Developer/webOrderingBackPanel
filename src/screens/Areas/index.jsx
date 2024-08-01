import { message, TimePicker } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormCheckbox from "../../components/general/FormCheckbox";
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
  TOGGLE_FORM_LOADING,
  UPDATE_FORM_FIELD,
} from "../../redux/reduxConstants";
import moment from "moment";
import { compareTime } from "../../functions/dateFunctions";

const initialFormValues = {
  CountryId: null,
  ProvinceId: null,
  CityId: null,
  AreaId: null,
  AreaName: "",
  IsEnable: true,
  StartTime: "",
  EndTime: "",
};

const initialSearchValues = {
  CountryId: null,
  ProvinceId: null,
  CityId: null,
  AreaId: null,
  AreaName: "",
  IsEnable: false,
  StartTime: "",
  EndTime: "",
};

const columns = [
  {
    title: "Area Name",
    dataIndex: "AreaName",
    key: "AreaName",
    sorter: (a, b) => a.AreaName - b.AreaName,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Country",
    dataIndex: "CountryName",
    key: "CountryName",
    sorter: (a, b) => b.AreaName - a.AreaName,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Province",
    dataIndex: "ProvinceName",
    key: "ProvinceName",
    sorter: (a, b) => a.ProvinceName - b.ProvinceName,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "City",
    dataIndex: "CityName",
    key: "CityName",
    sorter: (a, b) => a.CityName - b.CityName,
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Start Time",
    dataIndex: "StartTime",
    key: "CityName",
    //sorter: (a, b) => a.CityName - b.CityName,
    //sortDirections: ["ascend", "descend"],
  },
  {
    title: "End Time",
    dataIndex: "EndTime",
    key: "EndTime",
    //sorter: (a, b) => a.CityName - b.CityName,
    //sortDirections: ["ascend", "descend"],
  },
  {
    title: "Area Enabled",
    key: "IsEnable",
    render: (record) => {
      return (
        <input type="checkbox" checked={record.IsEnable} onChange={() => {}} />
      );
    },
  },
];

const Areas = () => {
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
        "/CrudArea",
        initialSearchValues,
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

  useEffect(() => {
    if (updateId !== null) {
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter((item) => item.AreaId === updateId)[0],
      });
      setUpdateId(null);
    }
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.AreaName = searchFields.AreaName.trim();
    dispatch(
      setInitialState(
        "/CrudArea",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CrudArea", { AreaId: id }, controller, userData));
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    // const comparedTime = compareTime(formFields.StartTime, formFields.EndTime);
    // if (comparedTime === false) {
    //   message.error("Incorrect  Time Interval");
    //   return;
    // }

    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudArea",
        formFields,
        initialFormValues,
        controller,
        userData,
        id
      )
    );
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="CountryId"
        valueName="CountryName"
        size={INPUT_SIZE}
        name="CountryId"
        label="Country"
        value={searchFields.CountryId || ""}
        onChange={handleSearchChange}
      />

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table2 || []}
        disabled={!supportingTable.Table2}
        idName="ProvinceId"
        valueName="ProvinceName"
        size={INPUT_SIZE}
        name="ProvinceId"
        label="Province"
        value={searchFields.ProvinceId}
        onChange={handleSearchChange}
      />

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table3 || []}
        disabled={!supportingTable.Table3}
        idName="CityId"
        valueName="CityName"
        size={INPUT_SIZE}
        name="CityId"
        label="City"
        value={searchFields.CityId}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Area Name"
        name="AreaName"
        size={INPUT_SIZE}
        value={searchFields.AreaName}
        onChange={handleSearchChange}
      />
      <FormCheckbox
        colSpan={4}
        checked={searchFields.IsEnable}
        name="IsEnable"
        onChange={handleSearchChange}
        label="Enabled"
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        // tabIndex="3"
        colSpan={8}
        label="Area Name"
        name="AreaName"
        size={INPUT_SIZE}
        value={formFields.AreaName}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="CountryId"
        valueName="CountryName"
        size={INPUT_SIZE}
        name="CountryId"
        label="Country"
        value={formFields.CountryId}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        // tabIndex="1"
        colSpan={8}
        listItem={
          supportingTable.Table2
            ? supportingTable.Table2.filter(
                (item) => item.CountryId === formFields.CountryId
              )
            : []
        }
        disabled={!supportingTable.Table2 || formFields.CountryId === null}
        idName="ProvinceId"
        valueName="ProvinceName"
        size={INPUT_SIZE}
        name="ProvinceId"
        label="Province"
        value={formFields.ProvinceId}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        colSpan={8}
        listItem={
          supportingTable.Table3
            ? supportingTable.Table3.filter(
                (item) => item.ProvinceId === formFields.ProvinceId
              )
            : []
        }
        disabled={!supportingTable.Table3 || formFields.ProvinceId === null}
        idName="CityId"
        valueName="CityName"
        size={INPUT_SIZE}
        name="CityId"
        label="City"
        value={formFields.CityId}
        onChange={handleFormChange}
        required={true}
      />
      <div
        className="ant-col ant-col-8"
        style={{
          paddingLeft: "4px",
          paddingRight: "4px",
        }}
      >
        <FormTextField
          type="time"
          style={{ width: "100%" }}
          placeholder="Start Time"
          value={formFields.StartTime}
          required={true}
          label="Start Time"
          onChange={(e) => {
            handleFormChange({ name: "StartTime", value: e.value });
          }}
        />
      </div>

      <div
        className="ant-col ant-col-8"
        style={{
          paddingLeft: "4px",
          paddingRight: "4px",
        }}
      >
        <FormTextField
          type="time"
          style={{ width: "100%" }}
          placeholder="End Time"
          value={formFields.EndTime}
          required={true}
          label="End Time"
          onChange={(e) => {
            handleFormChange({ name: "EndTime", value: e.value });
          }}
        />
      </div>

      <FormCheckbox
        colSpan={8}
        checked={formFields.IsEnable}
        name="IsEnable"
        onChange={handleFormChange}
        label="Enabled"
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Areas"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="AreaId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Area"
    />
  );
};

export default Areas;
