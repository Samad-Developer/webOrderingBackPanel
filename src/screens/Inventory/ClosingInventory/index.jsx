import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Input,
  message,
  Row,
  Spin,
  Table
} from "antd";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormButton from "../../../components/general/FormButton";
import FormCheckbox from "../../../components/general/FormCheckbox";
import FormSearchSelect from "../../../components/general/FormSearchSelect";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import { getDate } from "../../../functions/dateFunctions";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm
} from "../../../redux/actions/basicFormAction";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD
} from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";

const initialFormValues = {
  CloseId: null,
  BranchId: null,
  IsSubmit: false,
  Date: getDate(),
  UseScanner: false,
  Barcode: "",
  ClosingDate: null
};

const initialSearchValues = {
  CloseId: null,
  BranchId: null,
  IsSubmit: false,
  ClosingDetail: []
};

const columns = [
  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "BranchName"
  },
  {
    title: "Closed By",
    dataIndex: "ClosedBy",
    key: "ClosedBy"
  },
  {
    title: "Closing Date",
    render: (_, record) => record?.ClosingDate?.split("T")[0],
    key: "Date"
  },
  {
    title: "Is Submit",
    key: "IsSubmit",
    render: (_, record) => {
      return (
        <div>{record.IsSubmit === true ? "Submitted" : "Un-Submitted  "}</div>
      );
    }
  }
];

const ClosingInventory = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [closingDetail, setClosingDetail] = useState([]);
  const [date, setDate] = useState(new Date());
  const [formTableLoading, setFormTableLoading] = useState(false);
  const [detailListLoading, setDetailListLoading] = useState(false);

  const [searchDate, setSearchDate] = useState(
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1) +
    "-" +
    new Date().getDate() +
    " " +
    "00:00:00.000"
  );

  const [closingObj, setClosingObj] = useState({
    CategoryId: null,
    ProductDetailId: null,
    ProductId: null,
    Barcode: ""
  });
  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable
  } = useSelector((state) => state.basicFormReducer);

  const handleClosingDetailChnage = (event, record, name, index) => {
    const closingDetailArr = closingDetail;
    if (index > -1) {
      let closeDet = closingDetailArr[index];
      if (name === "BatchId") {
        closeDet[name] = event.value;
        closeDet.StockQuantity = supportingTable.Table5.filter(
          (e) => e.BatchId === event.value
        )[0]?.StockQuantity;
        closingDetailArr[index] = closeDet;
        setClosingDetail([...closingDetailArr]);
      } else {
        closeDet[name] = event.target.value;
        closingDetailArr[index] = closeDet;
        setClosingDetail([...closingDetailArr]);
      }
    }
  };

  const columnsClosingDetail = [
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "CategoryName"
    },
    {
      title: "Product",
      // dataIndex: "ProductSizeName",
      key: "ProductSizeName",
      render: (_, record) =>
        record.ProductSizeName +
        " - " +
        record.SizeName +
        " - " +
        record.FlavorName
    },
    {
      title: "Barcode",
      dataIndex: "Barcode",
      key: "Barcode"
    },
    {
      title: "Batch",
      key: "BatchId",
      render: (_, record, index) => {
        return (
          <FormSelect
            colSpan={24}
            listItem={supportingTable.Table5.filter(
              (e) => e.ProductDetailId === record.ProductDetailId
            )}
            idName="BatchId"
            valueName="BatchNumber"
            size={INPUT_SIZE}
            name="BatchId"
            label=""
            value={record.BatchId || ""}
            disabled={formFields?.IsSubmit === true ? true : false}
            onChange={(event) =>
              handleClosingDetailChnage(event, record, "BatchId", index)
            }
          />
        );
      }
    },
    {
      title: "Closing Quantity In Hand",
      key: "IssueQuantity",
      render: (_, record, index) => {
        return (
          <Input
            value={parseFloat(record.IssueQuantity)}
            onChange={(event) =>
              handleClosingDetailChnage(event, record, "IssueQuantity", index)
            }
            step="any"
            type="number"
            disabled={formFields?.IsSubmit === true ? true : false}
            min={0}
            onKeyPress={(e) => {
              if (e.code === "Minus") {
                e.preventDefault();
              }
            }}
          />
        );
      }
    },
    {
      title: "Issue Unit Name",
      key: "IssueUnitName",
      dataIndex: "IssueUnitName"
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record, index) => {
        return (
          <Button
            icon={<CloseOutlined />}
            onClick={() => removeClosingDetail(index)}
          />
        );
      }
    }
  ];

  useEffect(() => {
    setDate(getDate() + " " + "00:00:00.000");
    dispatch(
      setInitialState(
        "/CrudClosingInventory",
        {
          ...initialFormValues,
          ClosingDetail: []
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

  useEffect(() => {
    if (updateId !== null) {
      setDetailListLoading(true);
      const item = itemList.find((item) => item.CloseId === updateId);
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: { ...item, ClosingDate: item?.ClosingDate?.split("T")[0] } //itemList.filter((item) => item.CloseId === updateId)[0]
      });

      postRequest(
        "/CrudClosingInventory",
        {
          ...initialFormValues,
          BranchId: item.BranchId,
          Date: item?.ClosingDate?.split("T")[0],
          ClosingDetail: [],
          CloseId: updateId,
          OperationId: 5,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "1.2.2.1"
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
        setClosingDetail([...response.data.DataSet.Table]);
        setDetailListLoading(false);
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const addItemsToList = () => {
    if (formFields.BranchId === null) {
      message.error("Select Your Branch First");
      return;
    }
    let filteredProductArray = supportingTable?.Table4?.filter(
      (x) =>
        (x.CategoryId === closingObj.CategoryId ||
          closingObj.CategoryId === null) &&
        (x.ProductId === closingObj.ProductId ||
          closingObj.ProductId === null) &&
        (x.ProductDetailId === closingObj.ProductDetailId ||
          closingObj.ProductDetailId === null)
    ).map((obj) => ({
      ...obj,
      IssueQuantity: 1,
      BatchId: null,
      StockQuantity: 0
    }));

    // For checking does the product already exist
    const isAlreadyExisting = closingDetail.find((product) => product.id === filteredProductArray[0]?.id)

    // If not existing then adding it to the list
    if (!isAlreadyExisting) {
      setClosingDetail([...closingDetail, ...filteredProductArray]);
      message.success("Product Successfully Added");
    }
    else {
      message.error("Product is already added to the closing inventory");
    }

  };

  const handleFormChange = (data) => {
    if (data.name === "BranchId") {
      const Datee = new Date();
      const finalDatee =
        Datee.getFullYear() +
        "-" +
        (Datee.getMonth() + 1) +
        "-" +
        Datee.getDate() +
        " " +
        "00:00:00.000";
      postRequest(
        "/CrudClosingInventory",
        {
          ...initialFormValues,
          BranchId: data.value,
          Date: getDate(),
          ClosingDetail: [],
          CloseId: updateId,
          OperationId: 6,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "1.2.2.1"
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

        dispatch({
          type: SET_SUPPORTING_TABLE,
          payload: { ...supportingTable, Table5: response.data.DataSet.Table }
        });
      });
    }
    dispatch(setFormFieldValue(data));
  };

  const handleClosingObjChange = (data) => {
    setClosingObj({ ...closingObj, [data.name]: data.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudClosingInventory",
        { ...searchFields, Date: searchDate },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleClosingOptionAdd = () => {
    if (formFields.BranchId === null) {
      message.error("Select Branch first!");
      return;
    }
    setFormTableLoading(true);
    const Datee = new Date();
    const finalDatee =
      Datee.getFullYear() +
      "-" +
      (Datee.getMonth() + 1) +
      "-" +
      Datee.getDate() +
      " " +
      "00:00:00.000";
    postRequest(
      "/CrudClosingInventory",
      {
        ...initialFormValues,
        BranchId: formFields.BranchId,
        Date: finalDatee,
        ClosingDetail: [],
        CloseId: updateId,
        OperationId: 1,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "1.2.2.1"
      },
      controller
    ).then((response) => {
      setFormTableLoading(false);
      if (response.error === true) {
        message.error(response.errorMessage);
        return;
      }
      if (response.data.response === false) {
        message.error(response.DataSet.Table.errorMessage);
        return;
      }

      if (closingObj.Barcode !== "") {
        const filterClosing = closingDetail.filter(
          (c) => c.Barcode === closingObj.Barcode
        );
        if (filterClosing.length === 0) {
          const productDetail = [];

          response.data.DataSet.Table4.filter((ob) => {
            if (ob.Barcode === closingObj.Barcode) {
              if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
                productDetail.push({
                  ...ob,
                  IssueQuantity: 1,
                  BatchId: null,
                  StockQuantity: 0
                });
              }
            }
          });

          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setClosingDetail([...closingDetail, ...productDetail]);
          setClosingObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: ""
          });
        } else {
          message.error("Item Already Exist");
        }
      } else {
        if (
          closingObj.ProductDetailId !== null &&
          closingObj.ProductId !== null &&
          closingObj.CategoryId !== null
        ) {
          const filterClosing = closingDetail.filter(
            (e) => e.ProductDetailId === closingObj.ProductDetailId
          );
          if (filterClosing.length === 0) {
            const productDetail = [];

            response.data.DataSet.Table4.filter((ob) => {
              if (ob.ProductDetailId === closingObj.ProductDetailId) {
                if (
                  ob.BranchId === formFields.BranchId ||
                  ob.BranchId === null
                ) {
                  productDetail.push({
                    ...ob,
                    IssueQuantity: 1,
                    BatchId: null,
                    StockQuantity: 0
                  });
                }
              }
            });

            if (productDetail.length === 0) {
              message.error("Inventory items not found!");
              return;
            }
            setClosingDetail([...closingDetail, ...productDetail]);
            setClosingObj({
              ProductDetailId: null,
              ProductId: null,
              CategoryId: null,
              Barcode: ""
            });
          } else {
            message.error("Item Already Exist");
          }
        } else if (
          closingObj.CategoryId !== null &&
          closingObj.ProductId !== null
        ) {
          const filterClosing = closingDetail.filter(
            (e) => e.ProductId === closingObj.ProductId
          );
          if (filterClosing.length === 0) {
            const productDetail = [];

            response.data.DataSet.Table4.filter((ob) => {
              if (ob.ProductId === closingObj.ProductId) {
                if (
                  ob.BranchId === formFields.BranchId ||
                  ob.BranchId === null
                ) {
                  productDetail.push({
                    ...ob,
                    IssueQuantity: 1,
                    BatchId: null,
                    StockQuantity: 0
                  });
                }
              }
            });
            if (productDetail.length === 0) {
              message.error("Inventory items not found!");
              return;
            }
            setClosingDetail([...closingDetail, ...productDetail]);
            setClosingObj({
              ProductDetailId: null,
              ProductId: null,
              CategoryId: null,
              Barcode: ""
            });
          } else {
            message.error("Item Already Exist");
          }
        } else if (closingObj.CategoryId !== null) {
          const filterClosing = closingDetail.filter(
            (e) => e.CategoryId === closingObj.CategoryId
          );
          if (filterClosing.length === 0) {
            const productDetail = [];

            response.data.DataSet.Table4.filter((ob) => {
              if (ob.CategoryId === closingObj.CategoryId) {
                if (
                  ob.BranchId === formFields.BranchId ||
                  ob.BranchId === null
                ) {
                  productDetail.push({
                    ...ob,
                    IssueQuantity: 1,
                    BatchId: null,
                    StockQuantity: 0
                  });
                }
              }
            });
            if (productDetail.length === 0) {
              message.error("Inventory items not found!");
              return;
            }
            setClosingDetail([...closingDetail, ...productDetail]);
            setClosingObj({
              ProductDetailId: null,
              ProductId: null,
              CategoryId: null,
              Barcode: ""
            });
          } else {
            message.error("Item Already Exist");
          }
        } else {
          message.error("Fill all the required fields!");
        }
      }
    });
  };

  const closeForm = () => {
    setClosingDetail([]);
    setClosingObj({
      ProductDetailId: null,
      ProductId: null,
      CategoryId: null,
      Barcode: ""
    });
  };

  const handleDeleteRow = (id, record) => {
    if (record.IsSubmit === false) {
      const Datee = new Date();
      const finalDatee =
        Datee.getFullYear() +
        "-" +
        (Datee.getMonth() + 1) +
        "-" +
        Datee.getDate() +
        " " +
        "00:00:00.000";
      dispatch(
        deleteRow(
          "/CrudClosingInventory",
          {
            ...initialFormValues,
            CloseId: id,
            Date: finalDatee,
            ClosingDetail: []
          },
          controller,
          userData
        )
      );
    } else {
      message.error("Record cant be deleted!");
    }
  };

  const removeClosingDetail = (index) => {
    let arr = closingDetail;
    arr.splice(index, 1);
    setClosingDetail([...arr]);
  };

  const handleFormSubmit = (e, id, submit, close) => {
    e.preventDefault();
    const clonedFormFields = { ...formFields };
    clonedFormFields.IsSubmit = submit;

    const filteredObj = closingDetail.filter(
      (detailItem) => detailItem.BatchId === null
    );

    if (clonedFormFields.BranchId === null) {
      message.error("Branch is required");
      return;
    }
 
    if (filteredObj.length > 0) {
      message.error("Batch is required");
      return;
    }
    if (closingDetail.length === 0) {
      message.error("Closing Detail is required");
      return;
    }
    if (date === " 00:00:00.000") {
      message.error("Date cant be empty");
      return;
    }
    let obj = {
      ...clonedFormFields,
      ClosingDetail: closingDetail,
      Date: formFields.ClosingDate
    };

    dispatch(
      submitForm(
        "/CrudClosingInventory",
        obj,
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
            Table8: tables.Table9
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
          closeForm();
          close();
        }
      )
    );
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={searchFields.BranchId || ""}
        onChange={handleSearchChange}
      />
      <Col span={4}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
          }}
        >
          <label>Date</label>
          <DatePicker
            style={{ width: "100%" }}
            defaultValue={moment(new Date(), "YYYY/MM/DD")}
            onChange={(date, dateString) => {
              setSearchDate(dateString + " " + "00:00:00.000");
            }}
            allowClear={false}
          />
        </div>
      </Col>
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={formFields.BranchId || ""}
        onChange={handleFormChange}
        required={true}
        disabled={
          formFields?.IsSubmit === true
            ? true
            : closingDetail.length > 0
              ? true
              : false
        }
      />
      <Col span={6}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
          }}
        >

          <FormTextField
            colSpan={8}
            style={{ width: "130px" }}
            label="Date"
            name="ClosingDate"
            size={INPUT_SIZE}
            value={formFields.ClosingDate}
            onChange={(date) => {
              dispatch(
                setFormFieldValue({ name: "ClosingDate", value: date.value })
              );
            }}
            required={true}
            type="date"
            disabled={formFields.IsSubmit === true}
          />
        </div>
      </Col>
      <div className="ant-col ant-col-6 mt-26">
        <FormCheckbox
          label={"Use Scanner For Entry"}
          checked={formFields.UseScanner}
          onChange={handleFormChange}
          name="UseScanner"
          disabled={formFields?.IsSubmit === true ? true : false}
        />
        {formFields.UseScanner && (
          <FormTextField
            colSpan={6}
            label="Barcode"
            name="Barcode"
            size={INPUT_SIZE}
            value={formFields.Barcode}
            onChange={handleFormChange}
            disabled={false}
          />
        )}
      </div>
      <Col span={24}>
        <b style={{ fontSize: 16 }}>Search</b>
        <Row gutter={[8, 8]}>
          <FormSelect
            colSpan={4}
            listItem={supportingTable?.Table2}
            idName="CategoryId"
            valueName="CategoryName"
            size={INPUT_SIZE}
            name="CategoryId"
            label="Category"
            value={closingObj.CategoryId || ""}
            onChange={handleClosingObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSelect
            colSpan={4}
            listItem={
              closingObj.CategoryId !== null &&
              supportingTable?.Table3?.filter(
                (e) =>
                  e.ProductCategoryId === closingObj.CategoryId ||
                  closingObj.CategoryId === null
              )
            }
            idName="ProductId"
            valueName="ProductName"
            size={INPUT_SIZE}
            name="ProductId"
            label="Product"
            value={closingObj.ProductId || ""}
            onChange={handleClosingObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSearchSelect
            colSpan={4}
            listItem={
              (closingObj.ProductId !== null &&
                supportingTable?.Table4?.filter(
                  (e) =>
                    (e.ProductId === closingObj.ProductId ||
                      closingObj.ProductId === null) &&
                    (e.CategoryId === closingObj.CategoryId ||
                      closingObj.CategoryId === null)
                )) ||
              []
            }
            idName="ProductDetailId"
            valueName="ProductSizeName"
            size={INPUT_SIZE}
            name="ProductDetailId"
            label="Product Detail"
            value={closingObj.ProductDetailId || ""}
            onChange={handleClosingObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />

          <FormTextField
            colSpan={4}
            label="Barcode"
            name="Barcode"
            size={INPUT_SIZE}
            value={closingObj.Barcode}
            onChange={handleClosingObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormButton
            colSpan={6}
            loading={formTableLoading}
            title="Add"
            type="primary"
            size={BUTTON_SIZE}
            colStyle={{ display: "flex", alignItems: "flex-end" }}
            onClick={addItemsToList}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
        </Row>
      </Col>
      <Col span={24}>
        <Spin tip="Loading..." spinning={formTableLoading}>
          <Table
            columns={columnsClosingDetail}
            dataSource={closingDetail}
            pagination={false}
            loading={detailListLoading}
            size="small"
          />
        </Spin>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Closing Inventory"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="CloseId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Closing Inventory"
      formWidth="80vw"
      showSubmit={true}
      onFormClose={closeForm}
      disableSaveAndSubmit={formFields.IsSubmit === true ? true : false}
    />
  );
};

export default ClosingInventory;
