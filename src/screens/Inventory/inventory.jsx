import { Button, Col, message, Row, Space } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormButton from "../../components/general/FormButton";
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
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD,
} from "../../redux/reduxConstants";
import BarcodeModal from "./BarcodeModal";
import { AiOutlineCloseCircle } from "react-icons/ai";
import FormSearchSelect from "../../components/general/FormSearchSelect";

const initialSearchValues = {
  ProductDetailId: null,
  ProductId: null,
  Price: null,
  TaxPercent: null,
  OnlyForDeal: false,
  IsEnable: false,
  BranchIds: "",
  SizeId: null,
  FlavorId: null,
  CategoryId: null,
  ProductDetailBarcode: [],
  IsSaleable: false,
  IsProduction: false,
  PurchaseUnitId: null,
  IssuanceUnitId: null,
  ConsumeUnitId: null,
  PurchaseIssueConversion: 0.0,
  IssueConsumeConversion: 0.0,
  SKU: "",
  ParentProductDetailId: null,
  ReOrderQuantity: 0.0,
};

const initialFormValues = {
  ProductDetailId: null,
  ProductId: null,
  Price: null,
  TaxPercent: null,
  OnlyForDeal: false,
  IsEnable: true,
  BranchIds: "",
  SizeId: null,
  FlavorId: null,
  CategoryId: null,
  ProductDetailBarcode: [],
  IsSaleable: false,
  IsProduction: true,
  PurchaseUnitId: null,
  IssuanceUnitId: null,
  ConsumeUnitId: null,
  PurchaseIssueConversion: 0.0,
  IssueConsumeConversion: 0.0,
  SKU: "",
  ParentProductDetailId: null,
  ReOrderQuantity: 0.0,
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
    title: "SKU",
    dataIndex: "SKU",
    key: "SKU",
  },
  {
    title: "Minimum Stock Threshold",
    dataIndex: "ReOrderQuantity",
    key: "ReOrderQuantity",
  },
  {
    title: "Barcode",
    dataIndex: "Barcode",
    key: "Barcode",
  },
  {
    title: "Is Enable",
    dataIndex: "IsEnable",
    key: "IsEnable",
    render: (_, record) => {
      return (
        <input type="checkbox" checked={record.IsEnable} onChange={() => {}} />
      );
    },
  },
  {
    title: "Is Production",
    dataIndex: "IsProduction",
    key: "IsProduction",
    render: (_, record) => {
      return (
        <input
          type="checkbox"
          checked={record.IsProduction}
          onChange={() => {}}
        />
      );
    },
  },
];

export default function Inventory() {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [barCodeModal, setBarcodeModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [barcode, setBarcode] = useState(0);
  const [productDetailId, setProductDetailId] = useState(null);
  const [productBarcodeList, setProductBarcodeList] = useState([]);
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
        "/InventoryItem",
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

      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter(
          (item) => item.ProductDetailId === updateId
        )[0],
      });

      const productBracodeListToSet = [];
      supportingTable.Table7.filter((item) => {
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

      setUpdateId(null);
    }
  }, [updateId]);

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
        "/InventoryItem",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();

    // if (selectedBranch.length === 0) {
    //   message.error("Please select branch!");
    //   return;
    // }

    let ids = selectedBranch.join(",");
    ids = ids.replace(",,", ",");
    if (formFields.PurchaseIssueConversion <= 0) {
      message.error("Purchase Issue Conversion should be greater than zero");
      return;
    }
    if (formFields.IssueConsumeConversion <= 0) {
      message.error("Issue Consume Conversion should be greater than zero");
      return;
    }
    if (formFields.ReOrderQuantity <= 0) {
      message.error("Minimum Stock Threshold should be greater than zero");
      return;
    }

    dispatch(
      submitForm(
        "/InventoryItem",
        {
          ...formFields,
          BranchIds: ids,
          ProductDetailBarcode: productBarcodeList,
        },
        initialFormValues,
        controller,
        userData,
        id,
        (tables) => {
          const tablesToSet = {
            Table: tables.Table1,
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
  };

  const handleDeleteRow = (id) => {
    const fields = formFields;
    fields.ProductDetailId = id;
    fields.FlavorId = fields.FlavorId;
    dispatch(
      deleteRow(
        "/InventoryItem",
        {
          ...fields,
          BranchIds: "",
          ProductDetailBarcode: productBarcodeList,
        },
        controller,
        userData
      )
    );
  };
  const closeForm = () => {
    setSelectedBranch([]);
    setProductBarcodeList([]);
    setProductDetailId(null);
    setSelectAll(false);
  };
  const toggleBarcodeModel = () => {
    setBarcode(null);
    setBarcodeModal(!barCodeModal);
  };

  const handleBranchSelection = (id) => {
    let branchIndex = selectedBranch.findIndex((branch) => branch === id);
    if (branchIndex !== -1) {
      selectedBranch.splice(branchIndex, 1);
    } else {
      selectedBranch.push(id);
    }
    setSelectedBranch([...selectedBranch]);
  };

  const handleBarcodeAdd = (event) => {
    event.preventDefault();
    if (!barcode) {
      message.error("Please add barcode");
      return;
    }
    productBarcodeList.push({
      ProductDetailId: productDetailId,
      ProductCode: barcode,
    });
    setProductBarcodeList([...productBarcodeList]);
    toggleBarcodeModel();
  };

  const handleBarCodeChange = (event) => {
    setBarcode(event.value);
  };

  const handleBarcodeRemove = (elem) => {
    let barcodeList = productBarcodeList;
    var index = productBarcodeList.indexOf(elem);
    if (index > -1) {
      barcodeList.splice(index, 1);
    }
    setProductBarcodeList([...barcodeList]);
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="ProductId"
        valueName="ProductName"
        size={INPUT_SIZE}
        name="ProductId"
        label="Product"
        value={searchFields.ProductId}
        onChange={handleSearchChange}
      />

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
    </Fragment>
  );

  const onFormOpen = () => {
    let branchIds = [];
    supportingTable.Table4.forEach((e) => {
      branchIds.push(e.BranchId);
    });
    setSelectedBranch(branchIds);
    setSelectAll(!selectAll);
  };

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={8}
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
        colSpan={8}
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
        colSpan={8}
        listItem={supportingTable.Table2 ? supportingTable.Table2 : []}
        idName="SizeId"
        valueName="SizeName"
        size={INPUT_SIZE}
        name="SizeId"
        label="Size"
        value={formFields.SizeId}
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Price"
        name="Price"
        size={INPUT_SIZE}
        value={formFields.Price}
        type="text"
        isNumber="true"
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Tax percent"
        name="TaxPercent"
        size={INPUT_SIZE}
        value={formFields.TaxPercent}
        onChange={handleFormChange}
        type="text"
        isNumber="true"
        required={true}
      />
      <FormSelect
        colSpan={8}
        label="Purchase Unit"
        idName="UnitId"
        name="PurchaseUnitId"
        valueName="UnitName"
        listItem={supportingTable.Table8 ? supportingTable.Table8 : []}
        size={INPUT_SIZE}
        value={formFields.PurchaseUnitId}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        colSpan={8}
        label="Issuance Unit"
        valueName="UnitName"
        idName="UnitId"
        name="IssuanceUnitId"
        listItem={supportingTable.Table8 ? supportingTable.Table8 : []}
        size={INPUT_SIZE}
        value={formFields.IssuanceUnitId}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        colSpan={8}
        label="Consume Unit ID"
        idName="UnitId"
        name="ConsumeUnitId"
        valueName="UnitName"
        listItem={supportingTable.Table8 ? supportingTable.Table8 : []}
        size={INPUT_SIZE}
        value={formFields.ConsumeUnitId}
        onChange={handleFormChange}
        required={true}
      />

      <FormTextField
        colSpan={8}
        label="Purchase Issue Conversion"
        name="PurchaseIssueConversion"
        size={INPUT_SIZE}
        value={formFields.PurchaseIssueConversion}
        onChange={handleFormChange}
        type="text"
        isNumber="true"
        required={true}
      />

      <FormTextField
        colSpan={8}
        label="Issue Consume Conversion"
        name="IssueConsumeConversion"
        size={INPUT_SIZE}
        value={formFields.IssueConsumeConversion}
        onChange={handleFormChange}
        type="text"
        isNumber="true"
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Minimum Stock Threshold"
        name="ReOrderQuantity"
        size={INPUT_SIZE}
        value={formFields.ReOrderQuantity}
        onChange={handleFormChange}
        type="text"
        isNumber="true"
        required={true}
      />

      <FormTextField
        colSpan={8}
        label="SKU"
        name="SKU"
        size={INPUT_SIZE}
        value={formFields.SKU}
        onChange={handleFormChange}
        type="text"
        required={true}
      />

      <FormCheckbox
        colSpan={6}
        idName="IsEnable"
        valueName="IsEnable"
        name="IsEnable"
        label="Is Enable"
        checked={formFields.IsEnable}
        onChange={handleFormChange}
      />
      <FormCheckbox
        colSpan={6}
        idName="OnlyForDeal"
        valueName="OnlyForDeal"
        name="OnlyForDeal"
        label="Only For Deal"
        checked={formFields.OnlyForDeal}
        onChange={handleFormChange}
      />
      <FormCheckbox
        colSpan={6}
        idName="IsProduction"
        valueName="IsProduction"
        name="IsProduction"
        label="Is  Production"
        checked={formFields.IsProduction}
        onChange={handleFormChange}
      />
      <FormCheckbox
        colSpan={6}
        idName="IsSaleable"
        valueName="IsSaleable"
        name="IsSaleable"
        label="Is Saleable"
        checked={formFields.IsSaleable}
        onChange={handleFormChange}
      />

      <FormSearchSelect
        colSpan={8}
        label="Parent Product"
        idName="ProductDetailId"
        name="ParentProductDetailId"
        valueName="ProductDetailName"
        listItem={supportingTable.Table9 ? supportingTable.Table9 : []}
        size={INPUT_SIZE}
        value={formFields.ParentProductDetailId}
        onChange={handleFormChange}
      />

      <FormButton
        style={{ position: "absolute", bottom: 0 }}
        title="Add Barcode"
        onClick={toggleBarcodeModel}
      />

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
        <Row className="listContainer">
          Product Barcode
          {productBarcodeList.length > 0 &&
            productBarcodeList.map((item, i) => {
              if (item.ProductCode !== "")
                return (
                  <div className="listItem">
                    <Row gutter={8} key={i} style={{ alignItems: "center" }}>
                      <Col> Barcode: {item.ProductCode}</Col>
                      <Col>
                        <Button
                          type="text"
                          size={"large"}
                          icon={<AiOutlineCloseCircle />}
                          onClick={() => handleBarcodeRemove(item)}
                        />
                      </Col>
                    </Row>
                  </div>
                );
            })}
        </Row>
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Inventory"
        formWidth="65vw"
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
        onFormOpen={onFormOpen}
      />

      {barCodeModal && (
        <BarcodeModal
          barCodeModal={barCodeModal}
          toggleBarcodeModel={toggleBarcodeModel}
          handleOk={handleBarcodeAdd}
          handleBarCodeChange={handleBarCodeChange}
          barcode={barcode}
        />
      )}
    </Fragment>
  );
}
