import { Col, Image } from "antd";
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
  submitForm
} from "../../redux/actions/basicFormAction";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD
} from "../../redux/reduxConstants";

const initialFormValues = {
  CategoryId: null,
  DepartmentId: null,
  CategoryName: "",
  CategoryImage: "",
  IsEnable: true,
  SortOrder: null
};

const initialSearchValues = {
  CategoryId: null,
  DepartmentId: null,
  CategoryName: ""
};

const columns = [
  {
    title: "Category Name",
    dataIndex: "CategoryName",
    key: "CategoryName"
  },
  { title: "Department", dataIndex: "DepartmentName", key: "DepartmentName" },
  {
    title: "Image",
    key: "image",
    render: (_, record) => (
      <Image
        src={process.env.REACT_APP_BASEURL + record.CategoryImage}
        style={{ width: "50px", height: "50px" }}
      />
    )
  }
];

const Categories = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  let selectedImgUrl = "";

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable
  } = useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    const formData = new FormData();
    formData.append("OperationId", 1);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");

    Object.keys(initialFormValues).map((keyName, i) => {
      return formData.append(keyName, initialFormValues[keyName]);
    });

    dispatch(
      setInitialState(
        "/CrudCategory",

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
        payload: itemList.filter((item) => item.CategoryId === updateId)[0]
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
    searchFields.CategoryName = searchFields.CategoryName.trim();

    const formData = new FormData();
    formData.append("OperationId", 1);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");

    Object.keys(searchFields).map((keyName, i) =>
      formData.append(keyName, searchFields[keyName])
    );
    dispatch(
      setInitialState(
        "/CrudCategory",
        formData,
        initialFormValues,
        searchFields,
        controller,
        userData,
        true
      )
    );
  };

  const handleDeleteRow = (categoryId) => {
    const formData = new FormData();
    formData.append("OperationId", 4);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");
    formData.append("CategoryId", categoryId);
    dispatch(
      deleteRow(
        "/crudCategory",
        formData,
        controller,
        userData,
        (data) => {
          let tables = data;
          delete tables.Table;
          delete tables.Table1;

          const finalTables = { Table1: tables.Table2 };

          dispatch({
            type: SET_SUPPORTING_TABLE,
            payload: finalTables
          });
        },
        true
      )
    );
  };

  const handleFormSubmit = (e, operationID) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("OperationId", operationID);
    formData.append("UserId", userData.UserId);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserIP", "12.1.1.12");

    Object.keys(formFields).map((keyName, i) => {
      if (keyName !== "CategoryImage")
        return formData.append(keyName, formFields[keyName]);
    });
    formData.append("CategoryImage", image);
    dispatch(
      submitForm(
        "/crudCategory",
        formData,
        initialFormValues,
        controller,
        userData,
        operationID,
        null,
        true
      )
    );
    setImage(null);
    setImageUrl("");
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="DepartmentId"
        valueName="DepartmentName"
        size={INPUT_SIZE}
        name="DepartmentId"
        label="Department"
        value={searchFields.DepartmentId || ""}
        onChange={handleSearchChange}
        disabled={!supportingTable.Table1}
      />
      <FormTextField
        colSpan={4}
        label="Category Name"
        name="CategoryName"
        size={INPUT_SIZE}
        value={searchFields.CategoryName || ""}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        idName="DepartmentId"
        valueName="DepartmentName"
        size={INPUT_SIZE}
        name="DepartmentId"
        label="Department"
        value={formFields.DepartmentId || ""}
        onChange={handleFormChange}
        disabled={!supportingTable.Table1}
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Category Name"
        name="CategoryName"
        size={INPUT_SIZE}
        value={formFields.CategoryName || ""}
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Sort Order"
        name="SortOrder"
        size={INPUT_SIZE}
        value={formFields.SortOrder || ""}
        onChange={handleFormChange}
      />

      <div className="ant-col ant-col-8 mt-26">
        <FormCheckbox
          idName="id"
          valueName="name"
          name="IsEnable"
          label="Is Enabled"
          checked={formFields.IsEnable}
          onChange={handleFormChange}
        />
      </div>

      <Col span={16} style={{ display: "flex", flexDirection: "column" }}>
        <input type="file" accept="image/*" onChange={onImageChange} />
        <br />
        <img 
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
    </Fragment>
  );
  const closeForm = () => {
    setImage();
    setImageUrl("");
  };

  return (
    <BasicFormComponent
      formTitle="Product Categories"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="CategoryId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Product Category"
      onFormClose={closeForm}
    />
  );
};

export default Categories;
