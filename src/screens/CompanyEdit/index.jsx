import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import FormCheckbox from "../../components/general/FormCheckbox";

import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../redux/actions/basicFormAction";
import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";
import { Button, Col, Row, Space } from "antd";

const initialFormValues = {
  // OperationId: 1,
  // CompanyId: null,
  // CompanyName: "%%",
  // NoOfTerminals: null,
  // BusinessTypeId: null,
  // CompanyCode: "",
  // CountryId: null,
  // UserId: null,
  // UserIP: "",
  // EmailAddress: "",
  // // Contact1: "",
  // // Contact2: "",
  // // CompanyPocDetail: [],
  // IsEnabled: true,
  // OrderMode: "",
  // CompanyLogo: "",
  // Msg: "",

  OperationId: 1,
  CompanyId: null,
  // CompanyName: "%%",
  NoOfTerminals: null,
  // BusinessTypeId: null,
  // CompanyCode: "",
  // CountryId: null,
  UserId: null,
  UserIP: "",
  // CompanyLogo: "",
  // EmailAddress: "",
  IsEnable: true,
  Msg: "",
  // Contact1: "",
  // Contact2: "",
  // CompanyPocDetail: [],
  // OrderMode: "",
};

const initialSearchValues = {
  OperationId: 1,
  CompanyId: null,
  // CompanyName: "",
  NoOfTerminals: null,
  // BusinessTypeId: null,
  // CompanyCode: "",
  // CountryId: null,
  UserId: null,
  UserIP: "",
  // CompanyLogo: "",
  // EmailAddress: "",
  IsEnable: true,
  Msg: "",
  // Contact1: "",
  // Contact2: "",
  // CompanyPocDetail: [],
  // OrderMode: "",
};

// public int OperationId { get; set; }
// public int? CompanyId { get; set; }
// public string CompanyName { get; set; }
// public int NoOfTerminals { get; set; }
// public int BusinessTypeId { get; set; }
// public int CountryId { get; set; }
// public int UserId { get; set; }
// public string UserIP { get; set; }
// public string? CompanyLogo { get; set; }
// public string EmailAddress { get; set; }
// public bool IsEnable { get; set; }
// public string Msg { get; set; }

const columns = [
  {
    title: "Company Name",
    dataIndex: "CompanyName",
    key: "CompanyName",
  },
  {
    title: "Country",
    dataIndex: "CountryName",
    key: "CountryName",
  },
  {
    title: "Email",
    dataIndex: "EmailAddress",
    key: "EmailAddress",
  },
  {
    title: "Business Type",
    dataIndex: "BusinessTypeName",
    key: "BusinessTypeName",
  },
  {
    title: "Number of Terminals",
    dataIndex: "NoOfTerminals",
    key: "NoOfTerminals",
  },
  {
    title: "Enable",
    dataIndex: "IsEnabled",
    key: "IsEnabled",
  },
];
const CompanyEdit = () => {
  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [disableChecks, setDisableChecks] = useState(false);
  const [selectedOrderModes, setSelectOrderModes] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  let selectedImgUrl = "";
  useEffect(() => {
    const formData = new FormData();
    formData.append("OperationId", 1);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");

    // formData.append(
    //   "CountryId",
    //   userData?.companyList?.find(
    //     (company) => company.CompanyId === userData.CompanyId
    //   )?.CountryId
    // );
    formData.append(
      "NoOfTerminals",
      userData?.companyList?.find(
        (company) => company.CompanyId === userData.CompanyId
      )?.NoOfTerminals
    );
    // formData.append(
    //   "EmailAddress",
    //   userData?.companyList?.find(
    //     (company) => company.CompanyId === userData.CompanyId
    //   )?.EmailAddress
    // );
    // formData.append(
    //   "BusinessTypeId",
    //   userData?.companyList?.find(
    //     (company) => company.CompanyId === userData.CompanyId
    //   )?.BusinessTypeId
    // );

    Object.keys(initialFormValues).map((keyName, i) =>
      formData.append(keyName, initialFormValues[keyName])
    );
    dispatch(
      setInitialState(
        "/CrudCompanyEdit",
        // {
        //   ...formData,
        //   CountryId: userData?.companyList?.find(
        //     (company) => company.CompanyId === userData.CompanyId
        //   )?.CountryId,
        //   NoOfTerminals: userData?.companyList?.find(
        //     (company) => company.CompanyId === userData.CompanyId
        //   )?.NoOfTerminals,
        //   EmailAddress: userData?.companyList?.find(
        //     (company) => company.CompanyId === userData.CompanyId
        //   )?.EmailAddress,
        //   BusinessTypeId: userData?.companyList?.find(
        //     (company) => company.CompanyId === userData.CompanyId
        //   )?.BusinessTypeId,
        // },
        formData,
        initialFormValues,
        initialSearchValues,
        controller,
        userData,
        true
      )
    );

    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  const onImageChange = (e) => {
    selectedImgUrl = URL.createObjectURL(e.target.files[0]);
    setImage(e.target.files[0]);
    setImageUrl(selectedImgUrl);
  };
  useEffect(() => {
    if (updateId !== null) {
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter((item) => item.CompanyId === updateId)[0],
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // searchFields.CompanyName = searchFields.CompanyName.trim();
    // searchFields.OperationId = 1;
    // searchFields.CompanyId = userData.CompanyId;
    // console.log(searchFields);

    const formData = new FormData();
    formData.append("OperationId", 1);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");

    dispatch(
      setInitialState(
        "/CrudCompanyEdit",
        formData,
        initialFormValues,
        searchFields,
        controller,
        formData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(
      deleteRow("/CrudCompanyEdit", { CompanyId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();

    formFields.OrderMode = selectedOrderModes.join(",");
    const formData = new FormData();
    formData.append("OperationId", id);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");
    formData.append("IsEnable", formFields.IsEnable);

    Object.keys(formFields).map((keyName, i) => {
      if (keyName !== "CompanyLogo")
        return formData.append(keyName, formFields[keyName]);
    });
    // formData.append("CompanyLogo", image);
    dispatch(
      submitForm(
        "/CrudCompanyEdit",
        formData,
        initialFormValues,
        controller,
        userData,
        id,
        () => {
          closeForm();
        },
        true
      )
    );
    // setImage(null);
    // setImageUrl("");

    // closeForm();
  };
  const handleOrderModeChange = (name, obj) => {
    const copyOfSelectedOrderModes = selectedOrderModes;
    let orderModeIndex = selectedOrderModes.findIndex(
      (OrderModeName) => OrderModeName === name
    );
    if (orderModeIndex !== -1) {
      copyOfSelectedOrderModes.splice(orderModeIndex, 1);
    } else {
      copyOfSelectedOrderModes.push(name);
    }
    setSelectOrderModes([...copyOfSelectedOrderModes]);
    // setSelectOrderModes((prevMode) => {
    //   let orderModeIndex = prevMode.findIndex(
    //     (OrderModeName) => OrderModeName === name
    //   );
    //   if (orderModeIndex !== -1) {
    //     return prevMode.splice(orderModeIndex, 1);
    //   } else {
    //     return [...prevMode, name];
    //   }
    // });
  };
  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={6}
        size={INPUT_SIZE}
        name="CompanyName"
        label="Company Name"
        value={searchFields.CompanyName}
        onChange={handleSearchChange}
      />

      {/* <FormSelect
        colSpan={6}
        label="Business Type"
        name="BusinessTypeId"
        listItem={supportingTable.Table1 || []}
        valueName="BusinessType"
        idName="BusinessTypeId"
        size={INPUT_SIZE}
        value={searchFields.BusinessTypeId}
        onChange={handleSearchChange}
        // required={true}
      /> */}
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        size={INPUT_SIZE}
        name="CompanyName"
        label="Company Name"
        value={formFields.CompanyName}
        onChange={handleFormChange}
        disabled={true}
      />

      {/* <FormTextField
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        size={INPUT_SIZE}
        name="EmailAddress"
        label="Email"
        value={formFields.EmailAddress}
        onChange={handleFormChange}
        disabled={true}
      /> */}
      <FormSelect
        colSpan={6}
        label="Business Type"
        name="BusinessTypeId"
        listItem={supportingTable.Table1 || []}
        valueName="BusinessType"
        idName="BusinessTypeId"
        size={INPUT_SIZE}
        value={formFields.BusinessTypeId}
        onChange={handleFormChange}
        required={true}
      />

      <FormTextField
        colSpan={8}
        label="Number of Terminals"
        name="NoOfTerminals"
        size={INPUT_SIZE}
        value={formFields.NoOfTerminals}
        onChange={handleFormChange}
        required={true}
        type="number"
      />

      <FormTextField
        colSpan={22}
        label="Message"
        name="Msg"
        size={INPUT_SIZE}
        value={formFields.Msg}
        onChange={handleFormChange}
      />
      <FormCheckbox
        // colSpan={8}
        idName="id"
        valueName="name"
        name="IsEnable"
        label="Is Enabled"
        checked={formFields.IsEnable}
        onChange={handleFormChange}
      />

      {/*<Col span={24} style={{ display: "flex", flexDirection: "column" }}>
        <input type="file" accept="image/*" onChange={onImageChange} />
        <br />
        <img // src={formFields.CategoryImage != '' && imageUrl != '' ? imageUrl : process.env.REACT_APP_BASEURL + formFields.CategoryImage}
          src={
            imageUrl !== ""
              ? imageUrl
              : formFields.CategoryImage !== ""
              ? process.env.REACT_APP_BASEURL + formFields.CategoryImage
              : ""
          }
          alt=""
          style={{ width: "250px", height: "auto", objectFit: "cover" }}
        />
      </Col>
       <Col span={24}>
        <Row
          style={{ border: "1px solid lightgray", borderRadus: 5, padding: 10 }}
        >
          <Col span={24} style={{ marginBottom: 20 }}>
            <Space size={35} align="center">
              <h4 style={{ textDecoration: "underline" }}>Order Modes</h4>
              &nbsp;&nbsp;
            </Space>
          </Col>
          {supportingTable.Table2 &&
            supportingTable.Table2.length &&
            supportingTable.Table2.map((item, index) => (
              <FormCheckbox
                key={index}
                colSpan={6}
                checked={selectedOrderModes.includes(item.OrderModeId)}
                name="OrderModeId"
                onChange={(obj) => handleOrderModeChange(item.OrderModeId, obj)}
                label={item.OrderModeName}
                disabled={disableChecks}
              />
            ))}
        </Row>
      </Col> */}
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Company Edit"
      formPanel={formPanel}
      // searchPanel={searchPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="CompanyId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Company"
      hideAddButton={true}
    />
  );
};

export default CompanyEdit;
