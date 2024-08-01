import React, { Fragment, useEffect, useState } from "react";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormTextField from "../../components/general/FormTextField";
import FormCheckbox from "../../components/general/FormCheckbox";
import FormSelect from "../../components/general/FormSelect";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../redux/actions/basicFormAction";
import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, message, Row, Space, Table } from "antd";
import ModalComponent from "../../components/formComponent/ModalComponent";
import FormButton from "../../components/general/FormButton";
import { SET_SUPPORTING_TABLE } from "../../redux/reduxConstants";
import { CloseOutlined, DeleteFilled } from "@ant-design/icons";
import { postRequest } from "../../services/mainApp.service";
import FormSearchSelect from "../../components/general/FormSearchSelect";

const initialFormValues = {
  ProductId: null,
  ProductDetailId: null,
  SizeId: null,
  Price: null,
  TaxPercent: 0,
  OnlyForDeal: false,
  // IsDeal: false,
  IsEnable: true,
  FlavorId: null,
  BranchIds: "",
  ProductDetailBarcode: [],
  ProductDetailProperty: [],
  PriceOrderSourceMap: [],
  IsTopping: false,
  IsDirectDealPunch: false,
  FuturePrice: 0,
  IsPromotion: false,
  IsBestSeller: false,
  RemoteId: null
};

const initialSearchValues = {
  ProductId: null,
  ProductDetailId: null,
  SizeId: null,
  SizeName: "",
  Price: null,
  TaxPercent: null,
  OnlyForDeal: false,
  // IsDeal: false,
  IsEnable: true,
  ProductName: "",
  CompanyName: "",
  FlavorId: null,
  FlavorName: "",
  BranchIds: "",
  CategoryId: null,
  ProductDetailBarcode: [],
  ProductDetailProperty: [],
  PriceOrderSourceMap: [],
  IsTopping: false,
  FuturePrice: 0,
};

const columns = [
  {
    title: "Product",
    dataIndex: "ProductName",
    key: "ProductName",
  },
  {
    title: "Category",
    dataIndex: "CategoryName",
    key: "CategoryName",
  },
  {
    title: "Price",
    dataIndex: "Price",
    key: "Price",
  },
  {
    title: "Variant",
    dataIndex: "FlavorName",
    key: "FlavorName",
  },
  {
    title: "Size",
    dataIndex: "SizeName",
    key: "SizeName",
  },
  {
    title: "Only For Deal",
    key: "OnlyForDeal",
    render: (record) => {
      return (
        <input
          type="checkbox"
          checked={record.OnlyForDeal}
          onChange={() => { }}
        />
      );
    },
  },

//  todo only add REmote code in table
  {
    title: "Topping",
    key: "IsTopping",
    render: (record) => {
      return (
        <input type="checkbox" checked={record.IsTopping} onChange={() => { }} />
      );
    },
  },
];

const ProductDetails = () => {
  const priceColumns = [
    {
      title: "Order Source",
      key: "OrderSource",
      dataIndex: "OrderSource",
    },
    {
      title: "Product Price",
      key: "price",
      dataIndex: "Price",
    },
    {
      title: "Future Price",
      key: "futurePrice",
      dataIndex: "FuturePrice",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record, index) => {
        return (
          <Button
            // disabled={formFields?.IsSubmit === true ? true : false}
            icon={<CloseOutlined />}
            onClick={() => removePriceList(index)}
          />
        );
      },
    },
  ];
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openCategoryModel, setOpenCategoryModel] = useState(false);
  const [openBarcodeModel, setOpenBarcodeModel] = useState(false);
  const [propertyDetail, setPropertyDetail] = useState({
    ProductPropertyId: null,
    Price: 0,
  });
  const [barcode, setBarcode] = useState(0);
  const [productPropertyList, setProductPropertyList] = useState([]);
  const [productBarcodeList, setProductBarcodeList] = useState([]);
  const [productDetailId, setProductDetailId] = useState(null);
  const [priceList, setPriceList] = useState([]);
  const [productWithPriceObj, setProductWithPriceOb] = useState({
    OrderSourceId: null,
    Price: null,
    FuturePrice: null,
  });

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
        "/CrudProductDetail",
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
    // setProductPropertyList(supportingTable.Table7)
  }, []);

  useEffect(() => {
    if (updateId !== null) {
      setProductDetailId(updateId);
      let branches = itemList
        .filter((item) => item.ProductDetailId === updateId)[0]
        .BranchIds.split(",");
      const finalBranches = [];
      branches = branches.map((id) => {
        if (id !== "") {
          finalBranches.push(parseInt(id));
        }
      });
      const productDetailToEidt = itemList.find(
        (item) => item.ProductDetailId === updateId
      );

      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter(
          (item) => item.ProductDetailId === updateId
        )[0],
      });
      const productPropertyListToSet = [];
      supportingTable.Table7.filter((item) => {
        const obj = {};
        if (item.ProductDetailId === updateId) {
          obj.ProductDetailId = item.ProductDetailId;
          obj.ProductPropertyId = item.ProductPropertyId;
          obj.Price = item.Price;
        }
        if (Object.keys(obj).length !== 0) {
          productPropertyListToSet.push(obj);
        }
      });
      setProductPropertyList([...productPropertyListToSet]);
      const productBracodeListToSet = [];
      supportingTable.Table8.filter((item) => {
        const obj = {};
        if (item.ProductDetailId === updateId) {
          obj.ProductDetailId = item.ProductDetailId;
          obj.ProductCode = item.ProductCode;
        }
        if (Object.keys(obj).length !== 0) {
          productBracodeListToSet.push(obj);
        }
      });
      setProductBarcodeList(productBracodeListToSet);
      setSelectedBranch([...finalBranches]);

      if (supportingTable.Table4.length === finalBranches.length) {
        setSelectAll(true);
      }
      postRequest(
        "/CrudProductDetail",
        {
          ProductDetailProperty: productPropertyList,
          ProductDetailBarcode: productBarcodeList,
          OperationId: 5,
          PriceOrderSourceMap: [],
          Price: productDetailToEidt.Price.toString(),
          UserId: userData.UserId,
          BranchIds: finalBranches.join(","),
          ProductId: productDetailToEidt.ProductId,
          SizeId: productDetailToEidt.SizeId,
          ProductDetailId: productDetailToEidt.ProductDetailId,
          TaxPercent: productDetailToEidt.TaxPercent,
          OnlyForDeal: productDetailToEidt.OnlyForDeal,
          IsEnable: productDetailToEidt.IsEnable,
          FlavorId: productDetailToEidt.FlavorId,
          IsTopping: productDetailToEidt.IsTopping,
          CompanyId: userData.CompanyId,
          UserIP: "12.1.1.2",
          FuturePrice: productDetailToEidt.FuturePrice,
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

        setPriceList([...response.data.DataSet.Table]);
      });

      setUpdateId(null);
    }
  }, [updateId]);

  const handleBranchSelection = (id) => {
    let branchIndex = selectedBranch.findIndex((branch) => branch === id);
    if (branchIndex !== -1) {
      selectedBranch.splice(branchIndex, 1);
    } else {
      selectedBranch.push(id);
    }
    setSelectedBranch([...selectedBranch]);
  };

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    if (data.name === "FlavourId") {
      dispatch(setFormFieldValue({ name: "FlavorId", value: data.value }));
    } else {
      dispatch(setFormFieldValue(data));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudProductDetail",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleCategoryAdd = (event) => {
    event.preventDefault();
    const copyOfProductDetail = propertyDetail;

    if (
      copyOfProductDetail.ProductPropertyId === null ||
      copyOfProductDetail.Price === null ||
      copyOfProductDetail.Price === 0
    ) {
      message.error("Please enter the required fields!");
      return;
    }
    if (productDetailId !== null) {
      copyOfProductDetail.ProductDetailId = productDetailId;
    }
    if (copyOfProductDetail.ProductPropertyId !== null) {
      setProductPropertyList([...productPropertyList, copyOfProductDetail]);
    }
    setOpenCategoryModel(false);
    setPropertyDetail({
      ProductDetailId: null,
      ProductPropertyId: null,
      Price: 0,
    });
  };

  const handleBarcodeAdd = (event) => {
    event.preventDefault();
    if (!barcode) {
      message.error("Invalid Barcode!");
      return;
    }
    setProductBarcodeList([
      ...productBarcodeList,
      { ProductDetailId: productDetailId, ProductCode: barcode },
    ]);
    setOpenBarcodeModel(false);
    setBarcode(0);
  };

  const toggleCategoryModal = () => {
    setOpenCategoryModel(!openCategoryModel);
  };

  const toggleBarcodeModel = () => {
    setOpenBarcodeModel(!openBarcodeModel);
  };

  const handleCategoryPropertyChanege = (data) => {
    if (data.name === "Price") {
      setPropertyDetail({
        ...propertyDetail,
        [data.name]: data.value === "" ? data.value : parseFloat(data.value),
      });
    } else {
      setPropertyDetail({
        ...propertyDetail,
        [data.name]: data.value,
      });
    }
  };

  const handleBarCodeChange = (event) => {
    setBarcode(event.value);
  };

  const handleDeleteRow = (id) => {
    const fields = formFields;
    fields.ProductDetailId = id;
    fields.FlavorId = fields.FlavorId;
    dispatch(
      deleteRow(
        "/CrudProductDetail",
        {
          ...fields,
          BranchIds: "",
          ProductDetailBarcode: productBarcodeList,
          ProductDetailProperty: productPropertyList,
          PriceOrderSourceMap: fields.PriceOrderSourceMap || [],
        },
        controller,
        userData,
        (tables) => {
          delete tables.Table;
          const tablesToSet = {
            Table1: tables.Table2,
            Table2: tables.Table3,
            Table3: tables.Table4,
            Table4: tables.Table5,
            Table5: tables.Table6,
            Table6: tables.Table7,
            Table7: tables.Table8,
            Table8: tables.Table9,
            Table9: tables.Table10,
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
        }
      )
    );
  };

  const handleCategoryRemove = (elem) => {
    let productList = productPropertyList;
    var index = productList.indexOf(elem);
    if (index > -1) {
      productList.splice(index, 1);
    }
    setProductPropertyList(productList);
    setProductPropertyList([...productPropertyList]);
  };

  const handleBarcodeRemove = (elem) => {
    let barcodeList = productBarcodeList;
    var index = barcodeList.indexOf(elem);
    if (index > -1) {
      barcodeList.splice(index, 1);
    }
    setProductBarcodeList(barcodeList);
    setProductBarcodeList([...productBarcodeList]);
  };

  const cancelCategoryModal = () => {
    setPropertyDetail({
      ProductDetailId: null,
      ProductPropertyId: null,
      Price: 0,
    });
    setOpenCategoryModel(false);
  };

  const handlePriceDetailChange = (event) => {
    setProductWithPriceOb({
      ...productWithPriceObj,
      [event.name]: event.value,
    });
  };

  const addPriceList = () => {
    if (
      productWithPriceObj.Price === null ||
      productWithPriceObj.OrderSourceId === null ||
      productWithPriceObj.OrderSourceId === undefined
    ) {
      message.error("Null values not allowed");
      return;
    }
    const isItemExist = priceList.find(
      (item) => item.OrderSourceId === productWithPriceObj.OrderSourceId
    );
    if (isItemExist) {
      message.error("Item Already Exists in the list");
      return;
    }
    setPriceList([
      ...priceList,
      {
        OrderSource: supportingTable.Table9.find(
          (item) => item.OrderSourceId === productWithPriceObj.OrderSourceId
        ).OrderSource,
        Price: productWithPriceObj.Price,
        OrderSourceId: productWithPriceObj.OrderSourceId,
        FuturePrice:
          productWithPriceObj.FuturePrice === null
            ? 0
            : productWithPriceObj.FuturePrice,
      },
    ]);
    setProductWithPriceOb({
      OrderSourceId: null,
      Price: null,
      FuturePrice: null,
    });
  };
  const removePriceList = (index) => {
    let arr = priceList;
    arr.splice(index, 1);
    setPriceList([...arr]);
  };

  const cancelBarcodeModal = () => {
    setBarcode(0);
    setOpenBarcodeModel(false);
  };

  const closeForm = () => {
    setSelectedBranch([]);
    setProductBarcodeList([]);
    setProductPropertyList([]);
    setProductDetailId(null);
    setSelectAll(false);
    setPriceList([]);
    setProductWithPriceOb({
      OrderSourceId: null,
      Price: null,
      FuturePrice: null,
    });
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();

    let ids = selectedBranch.join(",");
    ids = ids.replace(",,", ",");
    if (id === 3) {
      setProductDetailId(null);
    }
    dispatch(
      submitForm(
        "/CrudProductDetail",
        {
          ...formFields,
          BranchIds: ids,
          ProductDetailBarcode: productBarcodeList,
          ProductDetailProperty: productPropertyList,
          PriceOrderSourceMap: priceList,
        },
        initialFormValues,
        controller,
        userData,
        id,
        (tables) => {
          delete tables.Table;
          const tablesToSet = {
            Table1: tables.Table2,
            Table2: tables.Table3,
            Table3: tables.Table4,
            Table4: tables.Table5,
            Table5: tables.Table6,
            Table6: tables.Table7,
            Table7: tables.Table8,
            Table8: tables.Table9,
            Table9: tables.Table10,
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
          closeForm();
        }
      )
    );
    setSelectedBranch([]);
    setProductBarcodeList([]);
    setProductPropertyList([]);
    setSelectAll(false);
  };
 
  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table5 ? supportingTable.Table5 : []}
        idName="CategoryId"
        valueName="CategoryName"
        size={INPUT_SIZE}
        name="CategoryId"
        label="Category"
        value={searchFields.CategoryId}
        onChange={handleSearchChange}
      />
      <FormSearchSelect
        colSpan={4}
        listItem={supportingTable?.Table1 || []}
        idName="ProductId"
        valueName="ProductName"
        size={INPUT_SIZE}
        name="ProductId"
        label="Product Name"
        value={searchFields.ProductName}
        onChange={handleSearchChange}
      />
      {/* <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="ProductId"
        valueName="ProductName"
        size={INPUT_SIZE}
        name="ProductId"
        label="Product"
        value={searchFields.ProductId}
        onChange={handleSearchChange}
      /> */}

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table2 ? supportingTable.Table2 : []}
        idName="SizeId"
        valueName="SizeName"
        size={INPUT_SIZE}
        name="SizeId"
        label="Size"
        value={searchFields.SizeId}
        onChange={handleSearchChange}
      />

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table3 ? supportingTable.Table3 : []}
        idName="FlavourId"
        valueName="FlavourName"
        size={INPUT_SIZE}
        name="FlavorId"
        label="Variant"
        value={searchFields.FlavorId}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1 ? supportingTable.Table1 : []}
        idName="ProductId"
        valueName="ProductName"
        size={INPUT_SIZE}
        name="ProductId"
        label="Product"
        value={formFields.ProductId}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table3 ? supportingTable.Table3 : []}
        idName="FlavourId"
        valueName="FlavourName"
        size={INPUT_SIZE}
        name="FlavourId"
        label="Variant Name"
        value={formFields.FlavorId}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table2 ? supportingTable.Table2 : []}
        idName="SizeId"
        valueName="SizeName"
        size={INPUT_SIZE}
        name="SizeId"
        label="Size"
        value={formFields.SizeId}
        onChange={handleFormChange}
        required
      />
      <FormTextField
        colSpan={6}
        label="Default Price"
        name="Price"
        size={INPUT_SIZE}
        value={formFields.Price}
        type="text"
        isNumber="true"
        onChange={(e) => {
          if (e.value < 0 || e.value === null) {
            message.error("Default Price cannot be less than Zero(0)");
            return;
          }
          handleFormChange(e);
        }}
        required
      />
      <FormTextField
        colSpan={6}
        label="Future Price"
        name="FuturePrice"
        size={INPUT_SIZE}
        value={formFields.FuturePrice}
        type="text"
        isNumber="true"
        onChange={(e) => {
          if (e.value < 0) {
            message.error("Future Price cannot be less than Zero(0)");
            return;
          }
          if (e.value === "") e.value = null;

          handleFormChange(e);
        }}
      />
      {/* <FormTextField
        colSpan={6}
        label="Tax percent"
        name="TaxPercent"
        size={INPUT_SIZE}
        value={formFields.TaxPercent}
        onChange={handleFormChange}
        type="text"
        isNumber="true"
        required={true}
      /> */}
      <FormTextField
        colSpan={6}
        label="Remote Code"
        name="RemoteId"
        size={INPUT_SIZE}
        value={formFields.RemoteId}
        onChange={handleFormChange}
        type="text"
        isNumber="true"
        required={true}
      />

      <FormCheckbox
        colSpan={4}
        idName="IsPromotion"
        valueName="IsPromotion"
        name="IsPromotion"
        label="Is Promotion"
        checked={formFields.IsPromotion}
        onChange={handleFormChange}
      />
      <FormCheckbox
        colSpan={4}
        idName="IsBestSeller"
        valueName="IsBestSeller"
        name="IsBestSeller"
        label="Is Best Seller"
        checked={formFields.IsBestSeller}
        onChange={handleFormChange}
      />
      <FormCheckbox
        colSpan={4}
        idName="IsEnable"
        valueName="IsEnable"
        name="IsEnable"
        label="Is Enable"
        checked={formFields.IsEnable}
        onChange={handleFormChange}
      />

      <FormCheckbox
        colSpan={4}
        name="OnlyForDeal"
        label="Only For Deal"
        checked={formFields.OnlyForDeal}
        onChange={handleFormChange}
      // disabled={formFields.OnlyForDeal}
      />
      <FormCheckbox
        colSpan={4}
        name="IsTopping"
        label="Is Topping Product"
        checked={formFields.IsTopping}
        onChange={handleFormChange}
      // disabled={formFields.OnlyForDeal}
      />
      <FormCheckbox
        colSpan={4}
        name="IsDealDirectPunch"
        label="Is Deal Direct Punch"
        checked={formFields.IsDealDirectPunch}
        onChange={handleFormChange}
      />
      <FormButton title="Add Product Property" onClick={toggleCategoryModal} />
      <FormButton title="Add Barcode" onClick={toggleBarcodeModel} />
      <Col span={12}>
        <Row className="listContainer">
          <h4>Product Property</h4>
          <div className="listItem">
            {productPropertyList &&
              productPropertyList.map((item, i) => {
                return (
                  <Row gutter={8} key={i}>
                    <Col>
                      {
                        supportingTable.Table6.find(
                          (x) => x.SetupDetailId === item.ProductPropertyId
                        ).SetupDetailName
                      }
                    </Col>
                    <Col> Price: {item.Price}</Col>
                    <Col>
                      <FormButton
                        title="X"
                        onClick={() => handleCategoryRemove(item)}
                      />
                    </Col>
                  </Row>
                );
              })}
          </div>
        </Row>
      </Col>
      <Col span={12}>
        <Row className="listContainer">
          Product Barcode
          {productBarcodeList &&
            productBarcodeList.map((item, i) => {
              return (
                <div className="listItem">
                  <Row gutter={8} key={i} style={{ alignItems: "center" }}>
                    <Col>Barcode: {item.ProductCode}</Col>
                    <Col>
                      <FormButton
                        type="text"
                        onClick={() => handleBarcodeRemove(item)}
                        icon={<DeleteFilled className="redIcon" />}
                      />
                    </Col>
                  </Row>
                </div>
              );
            })}
        </Row>
      </Col>

      <Col span={24}>
        <Row
          style={{ border: "1px solid lightgray", borderRadus: 5, padding: 10 }}
        >
          <Col span={24} style={{ marginBottom: 20 }}>
            <Space size={35} align="center">
              <h4 style={{ textDecoration: "underline" }}>Branches List</h4>
              &nbsp;&nbsp;
              <FormCheckbox
                checked={selectAll}
                name="SelectAll"
                onChange={(e) => {
                  if (e.value) {
                    setSelectedBranch(
                      supportingTable.Table4.map((item) => item.BranchId)
                    );
                  } else {
                    setSelectedBranch([]);
                  }
                  setSelectAll(!selectAll);
                }}
                label="Select All"
              />
            </Space>
          </Col>
          {supportingTable.Table4 &&
            supportingTable.Table4.length &&
            supportingTable.Table4.map((item, index) => {
              return (
                <FormCheckbox
                  key={index}
                  colSpan={6}
                  checked={selectedBranch.includes(item.BranchId)}
                  name="BranchId"
                  onChange={() => handleBranchSelection(item.BranchId)}
                  label={item.BranchName}
                />
              );
            })}
        </Row>
      </Col>
      <Col span={24}>
        <b style={{ fontSize: 16 }}>Add Price</b>
        <Row gutter={[8, 8]}>
          <FormSelect
            colSpan={6}
            listItem={supportingTable.Table9 || []}
            idName="OrderSourceId"
            valueName="OrderSource"
            size={INPUT_SIZE}
            name="OrderSourceId"
            label="Order Source"
            value={productWithPriceObj.OrderSourceId || ""}
            onChange={handlePriceDetailChange}
          // disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormTextField
            colSpan={6}
            label="Price"
            name="Price"
            size={INPUT_SIZE}
            value={productWithPriceObj.Price}
            onChange={handlePriceDetailChange}
            type="number"
            isNumber="true"
          />
          <FormTextField
            colSpan={6}
            label="Future Price"
            name="FuturePrice"
            size={INPUT_SIZE}
            value={productWithPriceObj.FuturePrice}
            onChange={handlePriceDetailChange}
            type="number"
            isNumber="true"
          />

          <FormButton
            colSpan={6}
            title="Add"
            type="primary"
            size={BUTTON_SIZE}
            colStyle={{ display: "flex", alignItems: "flex-end" }}
            onClick={addPriceList}
          // disabled={formFields?.IsSubmit === true ? true : false}
          />

          <Col span={24}>
            <Table columns={priceColumns} dataSource={priceList} size="small" />
          </Col>
        </Row>
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Product Details"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="ProductDetailId"
        editRow={setUpdateId}
        fields={initialFormValues}
        onFormClose={closeForm}
        formWidth="65vw"
      />
      <ModalComponent
        isModalVisible={openCategoryModel}
        handleCancel={cancelCategoryModal}
        handleOk={handleCategoryAdd}
        okText="Add"
        cancelText="Close"
        closable={true}
      >
        <form onSubmit={handleCategoryAdd}>
          <FormSelect
            listItem={supportingTable.Table6 ? supportingTable.Table6 : []}
            colSpan={24}
            idName="SetupDetailId"
            valueName="SetupDetailName"
            size={INPUT_SIZE}
            name="ProductPropertyId"
            value={propertyDetail.ProductPropertyId}
            onChange={handleCategoryPropertyChanege}
            required={true}
            label="Product Property"
          />
          <FormTextField
            isNumber="true"
            value={propertyDetail.Price}
            name="Price"
            onChange={handleCategoryPropertyChanege}
            required={true}
            label="Price"
          />
          <Button htmlType="submit" title="add" />
        </form>
      </ModalComponent>
      <ModalComponent
        isModalVisible={openBarcodeModel}
        handleCancel={cancelBarcodeModal}
        handleOk={handleBarcodeAdd}
        okText="Add"
        cancelText="Close"
        closable={true}
      >
        <form onSubmit={handleBarcodeAdd}>
          <FormTextField
            isNumber="true"
            value={barcode}
            name="price"
            onChange={handleBarCodeChange}
            required={true}
            label="Barcode"
          />
        </form>
      </ModalComponent>
    </Fragment>
  );
};

export default ProductDetails;
