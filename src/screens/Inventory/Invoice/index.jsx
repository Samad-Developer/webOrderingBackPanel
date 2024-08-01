import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm
} from "../../../redux/actions/basicFormAction";

import { INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormTextField from "../../../components/general/FormTextField";
import { UPDATE_FORM_FIELD } from "../../../redux/reduxConstants";
import FormSelect from "../../../components/general/FormSelect";
import { postRequest } from "../../../services/mainApp.service";
import { Button, Checkbox } from "antd";
import { getDate } from "../../../functions/dateFunctions";
import Title from "antd/lib/typography/Title";

const initialFormValues = {
  OperationId: 1,
  CompanyId: null,
  VendorId: null,
  PurchaseInvoiceId: null,
  BranchId: null,
  IsSubmit: false,
  PurchaseInvoiceDetail: [],
  Date: getDate(),
  PurchaseInvoiceNumber: "",
  GoodReceivingId: null
};

const initialDetailValue = {
  ProductDetailId: null,
  GrnDetailId: null,
  PurchaseUnitPrice: null,
  SubTotal: null,
  TaxAmount: 0,
  Discount: 0,
  NetAmount: 0,
  BatchId: null,
  PurchaseQuantity: 0,
  IssueQuantity: 0,
  ConsumeQuantity: 0,
  PurchaseUnitId: null,
  IssueUnitId: null,
  ConsumeUnitId: null
};

const initialSearchValues = {
  OperationId: 1,
  CompanyId: null,
  VendorId: null,
  PurchaseInvoiceId: null,
  BranchId: null,
  IsSubmit: false,
  PurchaseInvoiceDetail: [],
  Date: getDate(),
  PurchaseInvoiceNumber: ""
};

const columns = [
  {
    title: "Invoice Number",
    dataIndex: "InvoiceNumber",
    key: "InvoiceNumber"
  },
  {
    title: "Vendor Name",
    dataIndex: "VendorName",
    key: "VendorName"
  },
  {
    title: "Invoice Date",
    dataIndex: "InvoiceDate",
    key: "InvoiceDate"
  },
  {
    title: "Amount",
    dataIndex: "Amount",
    key: "Amount"
  }
];

const Invoice = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [grnList, setGrnList] = useState([]);
  const [grnDetailList, setGrnDetailList] = useState([]);
  const [selectedGrnDetailList, setSelectedGrnDetailList] = useState([]);
  const [updateId, setUpdateId] = useState(null);

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable
  } = useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudInvoice",
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
        payload: itemList.filter((item) => item.InvoiceId === updateId)[0]
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
    if (data.name === "VendorId") {
      setSelectedGrnDetailList([]);
      findGrnFromVendor(data.value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.InvoiceName = searchFields.InvoiceName.trim();
    dispatch(
      setInitialState(
        "/CrudInvoice",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(
      deleteRow("/CrudInvoice", { InvoiceId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    let detailList = [];
    selectedGrnDetailList.forEach((x) => {
      if ((x.selected = true))
        detailList.push({
          ProductDetailId: x?.ProductDetailId,
          GrnDetailId: x?.GoodReceivingDetailId,
          PurchaseUnitPrice: x?.PurchaseUnitPrice,
          SubTotal: x?.SubTotal,
          TaxAmount: x?.TaxAmount,
          Discount: x?.Discount,
          NetAmount: x?.NetAmount,
          PurchaseQuantity: x?.PurchaseQuantity,
          IssueQuantity: x?.IssueQuantity,
          ConsumeQuantity: x?.ConsumeQuantity,
          PurchaseUnitId: x?.PurchaseUnitId,
          IssueUnitId: x?.IssueUnitId,
          ConsumeUnitId: x?.ConsumeUnitId
        });
    });
    let obj = { ...formFields, PurchaseInvoiceDetail: detailList };
    dispatch(
      submitForm(
        "/CrudInvoice",
        obj,
        initialFormValues,
        controller,
        userData,
        id,
        () => {
          setSelectedGrnDetailList([]);
          setGrnList([]);
          setGrnDetailList([]);
          closeForm();
        }
      )
    );
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Invoice Number"
        name="InvoiceNumber"
        size={INPUT_SIZE}
        value={searchFields.InvoiceNumber}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        type="date"
        label="Invoice Date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Invoice Number"
        name="InvoiceNumber"
        size={INPUT_SIZE}
        value={formFields.InvoiceNumber}
        onChange={handleFormChange}
        disabled={true}
      />
      <FormTextField
        colSpan={8}
        type
        label="Invoice Date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={8}
        label="BranchId"
        name="BranchId"
        listItem={supportingTable.Table1}
        valueName="BranchName"
        idName="BranchId"
        size={INPUT_SIZE}
        value={formFields.BranchId}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={8}
        label="Vendor"
        name="VendorId"
        listItem={supportingTable.Table2}
        valueName="VendorName"
        idName="VendorId"
        size={INPUT_SIZE}
        value={formFields.VendorId}
        onChange={handleFormChange}
        required={true}
        disabled={formFields.BranchId === null}
      />
      <br />
      {grnList.length > 0 && (
        <>
          <Title level={5}>GRN List</Title>
          <table>
            <thead>
              <tr>
                <td>#</td>
                <td>GRN Number</td>
                {/* <td>GRN Date</td>
              <td>Action</td> */}
              </tr>
            </thead>
            <tbody>
              {grnList.map((x, i) => (
                <tr key={i}>
                  <td>
                    {
                      <Checkbox
                        checked={selectedGrnDetailList.some(
                          (y) => y.GoodReceivingId === x.GoodReceivingId
                        )}
                        onChange={(e) => {
                          if (e.target.checked === false) {
                            setSelectedGrnDetailList([
                              ...selectedGrnDetailList.filter(
                                (y) => y.GoodReceivingId !== x.GoodReceivingId
                              )
                            ]);
                            return;
                          }
                          setSelectedGrnDetailList([
                            ...selectedGrnDetailList,
                            ...grnDetailList
                              .filter(
                                (y) => y.GoodReceivingId === x.GoodReceivingId
                              )
                              .map((y) => ({ ...y, selected: true }))
                          ]);
                        }}
                      />
                    }
                  </td>
                  <td>{x.GoodReceivingNumber}</td>
                  {/* <td>{x.Date}</td>
                <td>
                  <Button
                    onClick={(e) => {
                      let selectedList = [...selectedGrnList];
                      selectedList.splice(i, 1);
                      setSelectedGrnList(selectedList);
                    }}
                  >
                    Delete
                  </Button>
                </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <br />
      <br />
      <br />
      {selectedGrnDetailList.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <td colSpan={9}>
                  <Title level={5}>GRN Detail List</Title>
                </td>
              </tr>
              <tr>
                <td>#</td>
                <td>GRN Number</td>
                <td>Item Name</td>
                <td>Quantity</td>
                <td>Unit Price</td>
                <td>Tax Amount</td>
                <td>Discount</td>
                <td>Net Amount</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {selectedGrnDetailList.map((x, i) => (
                <tr key={i}>
                  <td>
                    {
                      <Checkbox
                        checked={x.selected}
                        onChange={(e) => {
                          let list = [...selectedGrnDetailList];
                          list[i].selected === e.target.checked;
                          setSelectedGrnDetailList([...list]);
                        }}
                      />
                    }
                  </td>
                  <td>{x.GoodReceivingNumber}</td>
                  <td>{x.ProductSizeName}</td>
                  <td>
                    <FormTextField
                      name="quantity"
                      value={x.PurchaseQuantity}
                      onChange={(e) => {
                        let list = [...selectedGrnDetailList];
                        list[i].PurchaseQuantity = e.value;
                        list[i].NetAmount =
                          list[i].PurchaseUnitPrice * e.value -
                          list[i].TaxAmount -
                          list[i].Discount;
                        setSelectedGrnDetailList(list);
                      }}
                    />
                  </td>
                  <td>{x.PurchaseUnitPrice}</td>
                  <td>{x.TaxAmount}</td>
                  <td>{x.Discount}</td>
                  <td>{x.NetAmount}</td>
                  <td>
                    <Button
                      onClick={(e) => {
                        let selectedList = [...selectedGrnDetailList];
                        selectedList.splice(i, 1);
                        setSelectedGrnDetailList(selectedList);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Fragment>
  );

  const findGrnFromVendor = (vendorId = null) => {
    postRequest("crudInvoice", {
      ...formFields,
      OperationId: 6,
      VendorId: vendorId,
      UserId: userData.UserId,
      UserIP: "",
      CompanyId: userData.CompanyId
    })
      .then((res) => {
        const { Table, Table1 } = res?.data?.DataSet;
        setGrnList(Table);
        setGrnDetailList(Table1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <BasicFormComponent
      formTitle="Invoice"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="InvoiceId"
      editRow={setUpdateId}
      fields={initialFormValues}
      formWidth="60vw"
    />
  );
};

export default Invoice;
