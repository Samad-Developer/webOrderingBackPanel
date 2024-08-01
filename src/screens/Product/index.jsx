import { DeleteFilled } from "@ant-design/icons";
import { Col, Image, Input, Row, Space, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormButton from "../../components/general/FormButton";

import FormCheckbox from "../../components/general/FormCheckbox";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import ProductDetailDrawer from "../../components/PosComponents/ProductDetailDrawer";

import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../redux/actions/basicFormAction";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD,
} from "../../redux/reduxConstants";

const initialFormValues = {
  ProductName: "",
  ProductId: null,
  ProductCategoryId: null,
  IsEnable: true,
  DisplayInWeb: true,
  DisplayInPos: true,
  DisplayInOdms: true,
  DisplayInMobile: true,
  IsDeal: false,
  IsExpiryMandatory: false,
  ProductImage: "",
  CommisionTypeId: null,
  CommisionValue: 0,
  Description: "",
  SortOrder: null,
};

const initialSearchValues = {
  ProductName: "",
  ProductId: null,
  ProductCategoryId: null,
  IsEnable: true,
  DisplayInWeb: true,
  DisplayInPos: true,
  // IsExpiryMandatory: false
};

const columns = [
  {
    title: "Product Name",
    dataIndex: "ProductName",
    key: "ProductName",
  },
  {
    title: "Product Category",
    dataIndex: "CategoryName",
    key: "Category Name",
  },
  {
    title: "IsDeal",
    key: "IsDeal",
    render: (record) => <p>{record.IsDeal ? "True" : "False"}</p>,
  },
  {
    title: "Image",
    key: "image",
    render: (_, record) => (
      <Image
        src={process.env.REACT_APP_BASEURL + record.ProductImage}
        style={{ width: "50px", height: "50px" }}
      />
    ),
  },
];

const Product = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const { TextArea } = Input;

  const [updateId, setUpdateId] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [productDetailDrawer, setProductDetailDrawer] = useState(false);
  const [addedProduct, setAddedProduct] = useState([]);
  const [isProductUpdate, setIsProductUpdate] = useState(false);
  let selectedImgUrl = "";

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    const formData = new FormData();
    formData.append("OperationId", 1);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");

    Object.keys(initialFormValues).map((keyName, i) =>
      formData.append(keyName, initialFormValues[keyName])
    );

    dispatch(
      setInitialState(
        "/CrudProduct",
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
        payload: itemList.filter((item) => item.ProductId === updateId)[0],
      });

      setIsProductUpdate(true);
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const closeForm = () => {
    setImage();
    setImageUrl("");
  };

  const getUpdatedProducts = () => {
    const formData = new FormData();
    formData.append("OperationId", 1);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");

    Object.keys(initialFormValues).map((keyName, i) =>
      formData.append(keyName, initialFormValues[keyName])
    );

    dispatch(
      setInitialState(
        "/CrudProduct",
        formData,
        initialFormValues,
        initialSearchValues,
        controller,
        userData,
        true
      )
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.ProductName = searchFields.ProductName.trim();
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
        "/CrudProduct",
        formData,
        initialFormValues,
        searchFields,
        controller,
        userData,
        true
      )
    );
  };

  const handleDeleteRow = (id) => {
    const formData = new FormData();
    formData.append("OperationId", 4);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");
    formData.append("ProductId", id);
    dispatch(
      deleteRow(
        "/CrudProduct",
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
            payload: finalTables,
          });
        },
        true
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("OperationId", id);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");

    Object.keys(formFields).map((keyName, i) =>
      formData.append(keyName, formFields[keyName])
    );

    formData.append("ProductImage", image);

    dispatch(
      submitForm(
        "/CrudProduct",
        formData,
        initialFormValues,
        controller,
        userData,
        id,
        openProductDetailDrawer,
        true
      )
    );
    setIsProductUpdate(false);
    setImage(null);
    setImageUrl("");
    closeForm();
  };

  const openProductDetailDrawer = (data) => {
    if (!isProductUpdate) {
      setAddedProduct(
        data.Table1.find((x) => x.ProductName === formFields.ProductName)
      );
      setProductDetailDrawer(true);
    }
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="CategoryId"
        valueName="CategoryName"
        size={INPUT_SIZE}
        name="ProductCategoryId"
        label="Product Category"
        value={searchFields.ProductCategoryId}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Product Name"
        name="ProductName"
        size={INPUT_SIZE}
        value={searchFields.ProductName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="CategoryId"
        valueName="CategoryName"
        size={INPUT_SIZE}
        name="ProductCategoryId"
        label="Product Category"
        value={formFields.ProductCategoryId || ""}
        onChange={handleFormChange}
        required={true}
      />

      <FormTextField
        colSpan={8}
        label="Product Name"
        name="ProductName"
        size={INPUT_SIZE}
        value={formFields.ProductName}
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
        // required={true}
      />

      <div className="ant-col ant-col-8 mt-26">
        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="IsEnable"
          label="Is Enabled"
          checked={formFields.IsEnable}
          onChange={handleFormChange}
        />
      </div>
      <div className="ant-col ant-col-8 mt-5">
        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInPos"
          label="Display in Pos"
          checked={formFields.DisplayInPos}
          onChange={handleFormChange}
        />
      </div>
      <div className="ant-col ant-col-8 mt-5">
        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInWeb"
          label="Display In Web"
          checked={formFields.DisplayInWeb}
          onChange={handleFormChange}
        />
      </div>
      <div className="ant-col ant-col-8 mt-5">
        <FormCheckbox
          // colSpan={8}
          name="DisplayInOdms"
          label="Display In ODMS"
          checked={formFields.DisplayInOdms}
          onChange={handleFormChange}
        />
      </div>
      <div className="ant-col ant-col-8 mt-5">
        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInMobile"
          label="Display In Mobile"
          checked={formFields.DisplayInMobile}
          onChange={handleFormChange}
        />
      </div>
      <div className="ant-col ant-col-8 mt-5">
        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="IsDeal"
          label="Is Deal"
          checked={formFields.IsDeal}
          onChange={handleFormChange}
        />
      </div>
      <div className="ant-col ant-col-8 mt-5">
        <FormCheckbox
          // colSpan={8}
          name="IsExpiryMandatory"
          label="Is Expiry Product"
          checked={formFields.IsExpiryMandatory}
          onChange={handleFormChange}
        />
      </div>
      <div
        style={{
          border: "1px solid lightgray",
          position: "relative",
          margin: 5,
          marginTop: 10,
          borderRadius: 5,
          padding: 10,
          display: "flex",
          width: "auto",
          flexWrap: "wrap",
        }}
      >
        <p className="container-label-custom">Product Commission</p>
        <FormSelect
          colSpan={12}
          listItem={supportingTable.Table2 || []}
          idName="SetupDetailId"
          valueName="SetupDetailName"
          size={INPUT_SIZE}
          name="CommisionTypeId"
          label="Commission Type"
          value={formFields.CommisionTypeId}
          onChange={handleFormChange}
        />

        <FormTextField
          colSpan={12}
          label="Commission Rate"
          name="CommisionValue"
          size={INPUT_SIZE}
          value={formFields.CommisionValue}
          onChange={handleFormChange}
          disabled={formFields.CommisionTypeId === null}
        />
      </div>

      <Col span={16} style={{ display: "flex", flexDirection: "column" }}>
        <input type="file" accept="image/*" onChange={onImageChange} />
        <br />
        <img
          src={
            imageUrl !== ""
              ? imageUrl
              : formFields.ProductImage !== ""
              ? process.env.REACT_APP_BASEURL + formFields.ProductImage
              : ""
          }
          alt=""
          style={{ width: "250px", height: "auto", objectFit: "cover" }}
        />
      </Col>
      <Col span={24}>
        <label>Product Description</label>
        <TextArea
          rows={3}
          placeholder="Enter product Description..."
          name="Description"
          onChange={(event) =>
            handleFormChange({ name: "Description", value: event.target.value })
          }
          value={formFields.Description}
        />
      </Col>
    </Fragment>
  );

  return (
    <>
      <BasicFormComponent
        formTitle="Product"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        onFormClose={closeForm}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="ProductId"
        editRow={setUpdateId}
        fields={initialFormValues}
      />
      <ProductDetailDrawer
        productDetailDrawer={productDetailDrawer}
        setProductDetailDrawer={setProductDetailDrawer}
        isProductUpdate={isProductUpdate}
        newAddedProduct={addedProduct}
        formTitle="Product Detail Drawer"
        getUpdatedProducts={getUpdatedProducts}
      />
    </>
  );
};

export default Product;
