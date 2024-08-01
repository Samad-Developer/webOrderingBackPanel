import { Button, Input, Table, message } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormSearchSelect from "../../../components/general/FormSearchSelect";
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
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD,
} from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";

const initialFormValues = {
  OperationId: 1,
  WastageId: null,
  WastageNumber: "",
  Date: null, 
  BranchId: null,
  BranchName: "",
  WastageDetail: [],
  IsSubmit: false,
};

const initialSearchValues = {
  OperationId: 1,
  WastageId: null,
  WastageNumber: "",
  Date: null,
  BranchId: null,
  WastageDetail: [],
};

const columns = [
  {
    title: "Wastage Number",
    dataIndex: "WastageNumber",
    key: "WastageNumber",
  },
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
  },
  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Status",
    key: "Submit",
    render: (_, record) => (record.IsSubmit ? "Submitted" : null),
  },
];

const initialAddProductDetailObj = {
  CategoryId: null,
  ProductId: null,
  ProductDetailId: null,
  Barcode: "",
};

const Wastage = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [primaryWastageDetail, setPrimaryWastageDetail] = useState([]);
  const [updateId, setUpdateId] = useState(null);
  const [addProductDetail, setAddProductDetail] = useState(
    initialAddProductDetailObj
  );

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
        "/CrudWastage",
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
    };
  }, []);

  useEffect(() => {
    if (updateId !== null) {
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter((item) => item.WastageId === updateId)[0],
      });
      postRequest(
        "/CrudWastage",
        {
          ...initialFormValues,
          WastageId: updateId,
          OperationId: 5,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "1.2.2.1",
        },
        controller
      ).then((response) => {
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }

        setPrimaryWastageDetail([...response.data.DataSet.Table]);
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleDetailChange = (e, index, name) => {
    let data = [...primaryWastageDetail];
    data[index][name] = e.value;

    if (name === "BatchId") {
      let stkQty = supportingTable.Table5.filter((x) => x.BatchId === e.value);
      data[index].StockQuantity = stkQty[0]?.StockQuantity;
      data[index].QtyInLevel2 = null;
    }
    if (name === "QtyInLevel2") {
      if (e.value < 0) {
        message.error(
          "Quantity cannot be negative OR Greater then Stock Quantity"
        );
        return;
      }
    }
    setPrimaryWastageDetail([...data]);
  };

  const deleteDetailItem = (record, index) => {
    primaryWastageDetail.splice(index, 1);
    setPrimaryWastageDetail([...primaryWastageDetail]);
  };

  const dtlColumn = [
    {
      title: "Product Detail Name",
      dataIndex: "ProductDetailName",
      key: "ProductDetailName",
    },
    {
      title: "Unit",
      dataIndex: "Level2UnitName",
      key: "Level2UnitName",
    },
    {
      title: "Stock Quantity",
      key: "StockQuantity",
      render: (_, record) => record.StockQuantity,
    },
    {
      title: "Batch No",
      key: "BatchNo",
      render: (_, record, index) => (
        <FormSelect
          listItem={supportingTable?.Table5?.filter(
            (x) => x.ProductDetailId === record.ProductDetailId
          )}
          idName="BatchId"
          valueName="BatchNumber"
          name="BatchId"
          value={primaryWastageDetail[index].BatchId}
          onChange={(e) => handleDetailChange(e, index, "BatchId")}
          disabled={formFields?.IsSubmit === true ? true : false}
        />
      ),
    },
    {
      title: "Wastage Quantity",
      key: "QtyInLevel2",
      render: (_, record, index) => (
        <Input
          type="number"
          name="QtyInLevel2"
          value={record?.QtyInLevel2}
          onChange={(e) =>
            handleDetailChange(
              { name: e.target.name, value: e.target.value },
              index,
              "QtyInLevel2"
            )
          }
          required={true}
          disabled={formFields?.IsSubmit === true ? true : false}
        />
      ),
    },
    {
      title: "Action",
      key: "Action",
      render: (_, record, index) => (
        <Button
          disabled={formFields?.IsSubmit === true ? true : false}
          type="text"
          onClick={() => deleteDetailItem(record, index)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    if (data.name === "BranchId") {
      postRequest("crudwastage", {
        ...initialFormValues,
        OperationId: 6,
        BranchId: data.value,
        CompanyId: userData.CompanyId,
      })
        .then((res) => {
          if (res.error === true) {
            dispatch({
              type: TOGGLE_TABLE_LOADING,
            });
            message.error(res.errorMessage);
            return;
          }
          if (res.data.response === false) {
            message.error(res.DataSet.Table.errorMessage);
            return;
          }
          let sptTbl = { ...supportingTable, Table5: res.data.DataSet.Table };
          dispatch({
            type: SET_SUPPORTING_TABLE,
            payload: sptTbl,
          });
        })
        .catch();
    }
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.WastageNumber = searchFields.WastageNumber.trim();
    dispatch(
      setInitialState(
        "/CrudWastage",
        { ...searchFields, WastageNumber: `%${searchFields.WastageNumber}%` },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(
      deleteRow(
        "/CrudWastage",
        { WastageId: id, WastageDetail: [] },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();
    const formFieldsCloned = { ...formFields };
    if (primaryWastageDetail.length === 0) {
      message.error("Please Add Product Before Save");
      return;
    }

    const length = primaryWastageDetail.filter((e) => e.BatchId === null);
    if (length.length > 0) {
      message.error("Batch is required!");
      return;
    }

    formFieldsCloned.WastageDetail = primaryWastageDetail;
    formFieldsCloned.IsSubmit = submit;
    dispatch(
      submitForm(
        "/CrudWastage",
        formFieldsCloned,
        initialFormValues,
        controller,
        userData,
        id,
        (res) => {
          setPrimaryWastageDetail([]);
          closeForm();
        }
      )
    );
  };

  const handleProductDetailChange = (e) => {
    setAddProductDetail({ ...addProductDetail, [e.name]: e.value });
  };

  const addItemsToList = () => {
    if (formFields.BranchId === null) {
      message.error("Select Your Branch First");
      return;
    }
    if (addProductDetail.ProductDetailId === null) {
      message.error("Fill all the required fields!");
      return;
    }
    const filteredProductArray = supportingTable?.Table4?.filter(
      (x) =>
        (x.CategoryId === addProductDetail.CategoryId ||
          addProductDetail.CategoryId === null) &&
        (x.ProductId === addProductDetail.ProductId ||
          addProductDetail.ProductId === null) &&
        (x.ProductDetailId === addProductDetail.ProductDetailId ||
          addProductDetail.ProductDetailId === null)
    ).map((obj) => ({
      ...obj,
      ProductDetailName: obj.ProductSizeName,
      ProductDetailId: obj.ProductDetailId,
      Level2UnitId: obj.IssuanceUnitId,
      Level2UnitName: obj.IssueUnitName,
      BatchId: null,
      QtyInLevel2: 1,
      WastageDetailId: null,
    }));

    setPrimaryWastageDetail([...primaryWastageDetail, ...filteredProductArray]);
    setAddProductDetail(initialAddProductDetailObj);
    message.success("Product Successfully Added");
  };

  const submitProductDetail = () => {
    if (formFields.BranchId === null) {
      message.error("Select Branch first!");
      return;
    }

    if (addProductDetail.Barcode !== "") {
      const productDetail = [];
      supportingTable.Table4.forEach((ob) => {
        if (ob.Barcode === addProductDetail.Barcode) {
          if (formFields.BranchId === ob.BranchId) {
            productDetail.push({
              ...ob,
              ProductDetailName: ob.ProductSizeName,
              ProductDetailId: ob.ProductDetailId,
              Level2UnitId: ob.IssuanceUnitId,
              Level2UnitName: ob.IssueUnitName,
              BatchId: null,
              QtyInLevel2: 1,
              WastageDetailId: null,
            });
          }
        }
      });
      if (productDetail.length === 0) {
        message.error("Inventory items not found!");
        return;
      }
      setPrimaryWastageDetail([...primaryWastageDetail, ...productDetail]);
      setAddProductDetail({
        ProductDetailId: null,
        ProductId: null,
        CategoryId: null,
        Barcode: "",
      });
    } else {
      if (
        addProductDetail.ProductDetailId !== null &&
        addProductDetail.ProductId !== null &&
        addProductDetail.CategoryId !== null
      ) {
        const productDetail = [];
        supportingTable.Table4.forEach((ob) => {
          if (ob.ProductDetailId === addProductDetail.ProductDetailId) {
            if (formFields.BranchId === ob.BranchId) {
              productDetail.push({
                ...ob,
                ProductDetailName: ob.ProductSizeName,
                ProductDetailId: ob.ProductDetailId,
                Level2UnitId: ob.IssuanceUnitId,
                Level2UnitName: ob.IssueUnitName,
                StockQuantity: 0,
                BatchId: null,
                QtyInLevel2: null,
                WastageDetailId: null,
              });
            }
          }
        });
        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }
        setPrimaryWastageDetail([...primaryWastageDetail, ...productDetail]);
        setAddProductDetail({
          ProductDetailId: null,
          ProductId: null,
          CategoryId: null,
          Barcode: "",
        });
      } else if (
        addProductDetail.CategoryId !== null &&
        addProductDetail.ProductId !== null
      ) {
        const productDetail = [];
        supportingTable.Table4.forEach((ob) => {
          if (ob.ProductId === addProductDetail.ProductId) {
            if (formFields.BranchId === ob.BranchId) {
              productDetail.push({
                ...ob,
                ProductDetailName: ob.ProductSizeName,
                ProductDetailId: ob.ProductDetailId,
                Level2UnitId: ob.IssuanceUnitId,
                Level2UnitName: ob.IssueUnitName,
                BatchId: null,
                StockQuantity: 0,
                QtyInLevel2: null,
                WastageDetailId: null,
              });
            }
          }
        });
        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }
        setPrimaryWastageDetail([...primaryWastageDetail, ...productDetail]);
        setAddProductDetail({
          ProductDetailId: null,
          ProductId: null,
          CategoryId: null,
          Barcode: "",
        });
      } else if (addProductDetail.CategoryId !== null) {
        const productDetail = [];
        supportingTable.Table4.forEach((ob) => {
          if (ob.CategoryId === addProductDetail.CategoryId) {
            if (formFields.BranchId === ob.BranchId) {
              productDetail.push({
                ...ob,
                ProductDetailName: ob.ProductSizeName,
                ProductDetailId: ob.ProductDetailId,
                Level2UnitId: ob.IssuanceUnitId,
                Level2UnitName: ob.IssueUnitName,
                BatchId: null,
                StockQuantity: 0,
                QtyInLevel2: null,
                WastageDetailId: null,
              });
            }
          }
        });
        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }
        setPrimaryWastageDetail([...primaryWastageDetail, ...productDetail]);
        setAddProductDetail({
          ProductDetailId: null,
          ProductId: null,
          CategoryId: null,
          Barcode: "",
        });
      } else {
        message.error("Fill all the required fields!");
      }
    }
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Wastage Number"
        name="WastageNumber"
        size={INPUT_SIZE}
        value={searchFields.WastageNumber}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
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
        label="Date"
        name="Date"
        size={INPUT_SIZE}
        value={searchFields.Date}
        onChange={handleSearchChange}
        type="date"
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Wastage Number"
        name="WastageNumber"
        size={INPUT_SIZE}
        value={formFields.WastageNumber}
        onChange={handleFormChange}
        disabled={true}
      />
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 ? supportingTable.Table1 : []}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={formFields.BranchId}
        onChange={handleFormChange}
        required={true}
        disabled={formFields.IsSubmit === true}
      />
      <FormTextField
        colSpan={8}
        label="Date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
        required={true}
        type="date"
        disabled={formFields.IsSubmit === true}
      />

      <div
        style={{
          border: "1px solid lightgray",
          position: "relative",
          margin: 5,
          borderRadius: 5,
          padding: 10,
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <p className="container-label-custom">Add Product</p>
        <FormSelect
          colSpan={6}
          listItem={supportingTable.Table2 || []}
          idName="CategoryId"
          valueName="CategoryName"
          size={INPUT_SIZE}
          name="CategoryId"
          label="Category"
          value={addProductDetail.CategoryId}
          onChange={handleProductDetailChange}
          disabled={formFields.BranchId === ("" || null)}
        />
        <FormSelect
          colSpan={6}
          listItem={
            supportingTable.Table3?.filter(
              (product) =>
                product?.ProductCategoryId === addProductDetail?.CategoryId ||
                addProductDetail.CategoryId === null
            ) || []
          }
          idName="ProductId"
          valueName="ProductName"
          size={INPUT_SIZE}
          name="ProductId"
          label="Product"
          value={addProductDetail.ProductId}
          onChange={handleProductDetailChange}
          disabled={formFields.BranchId === ("" || null)}
        />
        <FormSearchSelect
          colSpan={6}
          listItem={
            supportingTable.Table4?.filter(
              (product) =>
                (product.ProductId === addProductDetail.ProductId ||
                  addProductDetail.ProductId === null) &&
                (product.CategoryId === addProductDetail.CategoryId ||
                  addProductDetail.CategoryId === null)
            ) || []
          }
          idName="ProductDetailId"
          valueName="ProductSizeName"
          size={INPUT_SIZE}
          name="ProductDetailId"
          label="Product Detail"
          value={addProductDetail.ProductDetailId}
          onChange={handleProductDetailChange}
          disabled={formFields.BranchId === ("" || null)}
        />
        <FormTextField
          colSpan={6}
          label="Barcode"
          name="Barcode"
          size={INPUT_SIZE}
          value={addProductDetail.Barcode}
          onChange={handleProductDetailChange}
          disabled={
            formFields.BranchId === ("" || null) ||
            (addProductDetail.CategoryId === "" &&
              addProductDetail.ProductId == "") ||
            formFields.IsSubmit
          }
        />
        <Button
          type="ghost"
          style={{ margin: 5 }}
          onClick={addItemsToList}
          disabled={
            formFields.BranchId === ("" || null) ||
            (addProductDetail.CategoryId === "" &&
              addProductDetail.ProductId === "" &&
              addProductDetail.ProductDetailId === "") ||
            formFields.IsSubmit
          }
        >
          Add Product
        </Button>
      </div>
      <Table
        style={{ width: "100%" }}
        columns={dtlColumn}
        dataSource={primaryWastageDetail}
        key={(x) => x.ProductDetailId}
        pagination={false}
      />
    </Fragment>
  );

  const onFormClose = () => {
    setPrimaryWastageDetail([]);
    setAddProductDetail({
      CategoryId: null,
      ProductId: null,
      ProductDetailId: null,
      Barcode: "",
    });
  };

  return (
    <BasicFormComponent
      formTitle="Wastage"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="WastageId"
      editRow={setUpdateId}
      fields={initialFormValues}
      key={(record) => record.WastageId}
      formWidth="60vw"
      disableSaveAndSubmit={formFields.IsSubmit === true ? true : false}
      showSubmit={true}
      onFormClose={onFormClose}
    />
  );
};

export default Wastage;
