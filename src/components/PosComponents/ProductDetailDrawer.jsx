import { CloseOutlined, DeleteFilled, SaveFilled } from "@ant-design/icons";
import { Button, Col, Row, Space, Table } from "antd";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import {
  resetState,
  setFormFieldValue,
  setInitialState,
  submitForm,
} from "../../redux/actions/basicFormAction";
import ModalComponent from "../formComponent/ModalComponent";
import FormButton from "../general/FormButton";
import FormCheckbox from "../general/FormCheckbox";
import FormContainer from "../general/FormContainer";
import FormDrawer from "../general/FormDrawer";
import FormSelect from "../general/FormSelect";
import FormTextField from "../general/FormTextField";

const initialFormValues = {
  ProductId: null,
  ProductDetailId: null,
  SizeId: null,
  Price: null,
  TaxPercent: null,
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

const ProductDetailDrawer = (props) => {
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
  const {
    setProductDetailDrawer,
    productDetailDrawer,
    isUpdate,
    formTitle,
    disableForm = false,
    newAddedProduct,
    getUpdatedProducts,
  } = props;

  const { formFields, formLoading, tableLoading, supportingTable } =
    useSelector((state) => state.basicFormReducer);

  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
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

  useEffect(() => {
    if (productDetailDrawer === true) {
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
      dispatch(
        setFormFieldValue({
          name: "ProductId",
          value: newAddedProduct.ProductId,
        })
      );
    }
    return () => {
      controller.abort();
      // dispatch(resetState());
    };
    // setProductPropertyList(supportingTable.Table7)
  }, [productDetailDrawer]);

  const handleBranchSelection = (id) => {
    let branchIndex = selectedBranch.findIndex((branch) => branch === id);
    if (branchIndex !== -1) {
      selectedBranch.splice(branchIndex, 1);
    } else {
      selectedBranch.push(id);
    }
    setSelectedBranch([...selectedBranch]);
  };

  const handleFormChange = (data) => {
    if (data.name === "FlavourId") {
      dispatch(setFormFieldValue({ name: "FlavorId", value: data.value }));
    } else {
      dispatch(setFormFieldValue(data));
    }
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
    setProductDetailDrawer(false);
    getUpdatedProducts();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    let ids = selectedBranch.join(",");
    ids = ids.replace(",,", ",");
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
        2,
        () => {
          // closeForm();
          dispatch(
            setFormFieldValue({
              name: "ProductId",
              value: newAddedProduct.ProductId,
            })
          );
        }
      )
    );
    setSelectedBranch([]);
    setProductBarcodeList([]);
    setProductPropertyList([]);
    setSelectAll(false);
    setPriceList([]);
  };

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
        disabled={true}
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
      <FormTextField
        colSpan={6}
        label="Tax percent"
        name="TaxPercent"
        size={INPUT_SIZE}
        value={formFields.TaxPercent}
        onChange={handleFormChange}
        type="text"
        isNumber="true"
        required={true}
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
            disabled={formFields?.IsSubmit === true ? true : false}
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
            disabled={formFields?.IsSubmit === true ? true : false}
          />

          <Col span={24}>
            <Table columns={priceColumns} dataSource={priceList} size="small" />
          </Col>
        </Row>
      </Col>
    </Fragment>
  );

  const formInnerComponent = (
    <>
      <div className="formDrawerHeader">
        <h2>{`${isUpdate ? "Update" : "New"} ${formTitle}`}</h2>
        <Space>
          <FormButton
            title="Cancel"
            type="default"
            color="gray"
            icon={<CloseOutlined />}
            size={BUTTON_SIZE}
            colSpan={2}
            onClick={closeForm}
          />

          <FormButton
            title={isUpdate ? "Update" : "Save"}
            type="primary"
            icon={<SaveFilled />}
            size={BUTTON_SIZE}
            colSpan={2}
            htmlType="submit"
            // loading={formLoading}
            // disabled={disableSaveAndSubmit}
            onClick={() => {
              setIsSubmit(false);
            }}
          />
        </Space>
      </div>
      <div className="formDrawerBody">{formPanel}</div>
    </>
  );

  return (
    <div>
      <FormDrawer
        visible={productDetailDrawer}
        onClose={closeForm}
        width="65vw"
        className="formDrawerContainer"
        formComponent={
          disableForm ? (
            formInnerComponent
          ) : (
            <FormContainer
              rowStyle={{ alignItems: "flex-end", paddingTop: 56 }}
              onSubmit={handleFormSubmit}
            >
              {formInnerComponent}
            </FormContainer>
          )
        }
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
    </div>
  );
};

export default ProductDetailDrawer;
