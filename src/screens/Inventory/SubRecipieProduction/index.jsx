import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";

// import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormTextField from "../../../components/general/FormTextField";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD,
} from "../../../redux/reduxConstants";
import FormSelect from "../../../components/general/FormSelect";
import { Button, Col, DatePicker, Input, message, Row, Table } from "antd";
import moment from "moment";
import FormButton from "../../../components/general/FormButton";
import { CloseOutlined } from "@ant-design/icons";
import { postRequest } from "../../../services/mainApp.service";

const initialFormValues = {
  ProductionId: null,
  BranchId: null,
  IsSubmit: false,
  Date: "",
  ProductionNumber: "",
};

const initialSearchValues = {
  ProductionId: null,
  BranchId: null,
  IsSubmit: false,
  Date: "",
  ProductionNumber: "",
};

const columns = [
  {
    title: "Production Number",
    dataIndex: "ProductionNumber",
    key: "ProductionNumber",
  },
  {
    title: "Branch Name",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Date",
    key: "Date",
    render: (_, record) => {
      return <div>{record.Date?.split("T")[0]}</div>;
    },
  },
  {
    title: "Is Submit",
    key: "IsSubmit",
    render: (_, record) => {
      // record.Date.split(":")[0]
      return <div>{record.IsSubmit === true ? "Submitted" : ""}</div>;
    },
  },
];

const SubRecipieProduction = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [updateId, setUpdateId] = useState(null);

  const [productionObj, setProductionObj] = useState({
    CategoryId: null,
    ProductDetailId: null,
    ProductId: null,
    Barcode: "",
  });

  const [SubRecipeProductionDetailList, setSubRecipeProductionDetailList] =
    useState([]);

  const [date, setDate] = useState(new Date());

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    const Datee = date;
    const finalDatee =
      Datee.getFullYear() +
      "-" +
      (Datee.getMonth() + 1) +
      "-" +
      Datee.getDate() +
      " " +
      "00:00:00.000";
    setDate(finalDatee);
    dispatch(
      setInitialState(
        "/CrudSubRecipeProduction",
        {
          ...initialSearchValues,
          Date: finalDatee,
          SubRecipeProductionDetailList: [],
          ProductionNumber: `%%`,
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
      let editObj = itemList.filter(
        (item) => item.ProductionId === updateId
      )[0];

      dispatch({
        type: UPDATE_FORM_FIELD,
        // payload: itemList.filter((item) => item.RequisitionId === updateId)[0],
        payload: { ...editObj, Date: editObj.Date.split("T")[0] },
      });

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
        "/CrudSubRecipeProduction",
        {
          ...initialFormValues,
          Date: finalDatee,
          SubRecipeProductionDetailList: [],
          ProductionId: updateId,
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

        setSubRecipeProductionDetailList([...response.data.DataSet.Table]);
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSubRecipeProductionDetailListChange = (event, record, name) => {
    const SubRecipeProductionDetailListArr = SubRecipeProductionDetailList;
    const index = SubRecipeProductionDetailListArr.findIndex(
      (x) => x.ProductDetailId === record.ProductDetailId
    );
    if (index > -1) {
      let closeDet = SubRecipeProductionDetailListArr[index];
      closeDet[name] = event.target.value;
      SubRecipeProductionDetailListArr[index] = closeDet;
      setSubRecipeProductionDetailList([...SubRecipeProductionDetailListArr]);
    }
  };

  const productionDemandDetail = (index) => {
    let arr = SubRecipeProductionDetailList;
    arr.splice(index, 1);
    setSubRecipeProductionDetailList([...arr]);
  };

  const columnsDemandDetail = [
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "CategoryName",
    },
    {
      title: "Product",
      dataIndex: "ProductSizeName",
      key: "ProductSizeName",
    },
    {
      title: "Unit",
      dataIndex: "IssueUnitName",
      key: "IssueUnitName",
    },
    {
      title: "Product Quantity",
      key: "QtyInLevel2",
      render: (_, record) => {
        return (
          <Input
            value={parseInt(record.QtyInLevel2)}
            onChange={(event) =>
              handleSubRecipeProductionDetailListChange(
                event,
                record,
                "QtyInLevel2"
              )
            }
            type="number"
            disabled={formFields?.IsSubmit === true ? true : false}
            min={1}
            onKeyPress={(e) => {
              if (
                e.code === "Minus" ||
                e.code === "NumpadSubtract" ||
                e.code === "NumpadAdd"
              ) {
                e.preventDefault();
              }
            }}
            required={true}
          />
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record, index) => {
        return (
          <Button
            disabled={formFields?.IsSubmit === true ? true : false}
            icon={<CloseOutlined />}
            onClick={() => productionDemandDetail(index)}
          />
        );
      },
    },
  ];

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleProductionOptionAdd = () => {
    if (formFields.BranchId === null) {
      message.error("Select Branch first!");
      return;
    }

    if (productionObj.Barcode !== "") {
      const filterClosing = SubRecipeProductionDetailList.filter(
        (e) => e.Barcode === productionObj.Barcode
      );
      if (filterClosing.length === 0) {
        const productDetail = [];
        supportingTable.Table4.filter((ob) => {
          if (ob.Barcode === productionObj.Barcode) {
            if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
              productDetail.push({ ...ob, QtyInLevel2: 1 });
            }
          }
        });

        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }
        setSubRecipeProductionDetailList([
          ...SubRecipeProductionDetailList,
          ...productDetail,
        ]);
        setProductionObj({
          ProductDetailId: null,
          ProductId: null,
          CategoryId: null,
          Barcode: "",
        });
      } else {
        message.error("Item Already Exist");
      }
    } else {
      if (
        productionObj.ProductDetailId !== null &&
        productionObj.ProductId !== null &&
        productionObj.CategoryId !== null
      ) {
        const filterClosing = SubRecipeProductionDetailList.filter(
          (e) => e.ProductDetailId === productionObj.ProductDetailId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table4.filter((ob) => {
            if (ob.ProductDetailId === productionObj.ProductDetailId) {
              if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
                productDetail.push({
                  ...ob,
                  QtyInLevel2: 1,
                  Level2UnitID: ob.IssuanceUnitId,
                });
                return (ob.QtyInLevel2 = 1);
              }
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setSubRecipeProductionDetailList([
            ...SubRecipeProductionDetailList,
            ...productDetail,
          ]);
          setProductionObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (
        productionObj.CategoryId !== null &&
        productionObj.ProductId !== null
      ) {
        const filterClosing = SubRecipeProductionDetailList.filter(
          (e) => e.ProductId === productionObj.ProductId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table4.filter((ob) => {
            // if (ob.CategoryId === productionObj.CategoryId) {
            if (ob.ProductId === productionObj.ProductId) {
              if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
                productDetail.push({
                  ...ob,
                  QtyInLevel2: 1,
                  Level2UnitID: ob.IssuanceUnitId,
                });
                return (ob.QtyInLevel2 = 1);
              }
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setSubRecipeProductionDetailList([
            ...SubRecipeProductionDetailList,
            ...productDetail,
          ]);
          setProductionObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (productionObj.CategoryId !== null) {
        const filterClosing = SubRecipeProductionDetailList.filter(
          (e) => e.CategoryId === productionObj.CategoryId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table4.filter((ob) => {
            if (ob.CategoryId === productionObj.CategoryId) {
              if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
                productDetail.push({
                  ...ob,
                  QtyInLevel2: 1,
                  Level2UnitID: ob.IssuanceUnitId,
                });
                return (ob.QtyInLevel2 = 1);
              }
            }
          });

          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }

          setSubRecipeProductionDetailList([
            ...SubRecipeProductionDetailList,
            ...productDetail,
          ]);
          setProductionObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else {
        message.error("Fill all the required fields!");
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudSubRecipeProduction",
        {
          ...searchFields,
          SubRecipeProductionDetailList: [],
          ProductionNumber: `%${searchFields.ProductionNumber}%`,
        },
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
        "/CrudSubRecipeProduction",
        { ProductionId: id, Date: date, SubRecipeProductionDetailList: [] },
        controller,
        userData
      )
    );
  };

  const handleProductionObjChange = (data) => {
    setProductionObj({ ...productionObj, [data.name]: data.value });
  };

  const closeForm = () => {
    setSubRecipeProductionDetailList([]);
    setProductionObj({
      ProductDetailId: null,
      CategoryId: null,
      ProductId: null,
      Barcode: "",
    });
  };

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();
    delete formFields.IsSubmitted;
    formFields.IsSubmit = submit;
    if (date === " 00:00:00.000") {
      message.error("Date cant be empty");
      return;
    }
    if (SubRecipeProductionDetailList.length === 0) {
      message.error("Production Detail is required!");
      return;
    }
    const arr = SubRecipeProductionDetailList.filter((e) => {
      return parseInt(e.QtyInLevel2) === 0 || e.QtyInLevel2 === "";
    });

    if (arr.length > 0) {
      message.error("Quantity is Required!");
      return;
    }
    dispatch(
      submitForm(
        "/CrudSubRecipeProduction",
        {
          ...formFields,
          SubRecipeProductionDetailList: SubRecipeProductionDetailList,
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
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
          closeForm();
        }
      )
    );
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Production Number"
        name="ProductionNumber"
        size={INPUT_SIZE}
        value={searchFields.ProductionNumber}
        onChange={handleSearchChange}
        required
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <Fragment>
        <FormTextField
          colSpan={6}
          label="Production"
          name="ProductionNumber"
          size={INPUT_SIZE}
          value={formFields.ProductionNumber}
          onChange={handleFormChange}
          disabled={true}
        />
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
          disabled={formFields?.IsSubmit === true ? true : false}
        />
        {/* <Col span={6}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <label>Date</label>
            <DatePicker
              style={{ width: "100%" }}
              value={
                formFields.DemandDate === ""
                  ? moment(new Date(), "YYYY/MM/DD")
                  : moment(formFields.DemandDate)
              }
              onChange={(date, dateString) => {
                setDate(dateString + " " + "00:00:00.000");
                handleFormChange({ name: "DemandDate", value: dateString });
              }}
              allowClear={false}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
          </div>
        </Col> */}
        <FormTextField
          colSpan={6}
          label="Production Date"
          type="date"
          name="Date"
          size={INPUT_SIZE}
          value={formFields.Date}
          onChange={handleFormChange}
          disabled={formFields?.IsSubmit === true ? true : false}
          required={true}
        />
        <Col span={24}>
          <b style={{ fontSize: 16 }}>Search</b>
          <Row gutter={[8, 8]}>
            <FormSelect
              colSpan={6}
              listItem={supportingTable.Table2}
              idName="CategoryId"
              valueName="CategoryName"
              size={INPUT_SIZE}
              name="CategoryId"
              label="Category"
              value={productionObj.CategoryId || ""}
              onChange={handleProductionObjChange}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
            <FormSelect
              colSpan={6}
              listItem={
                (productionObj.CategoryId !== null &&
                  supportingTable.Table3?.filter(
                    (e) => e.ProductCategoryId === productionObj.CategoryId
                  )) ||
                []
              }
              idName="ProductId"
              valueName="ProductName"
              size={INPUT_SIZE}
              name="ProductId"
              label="Product"
              value={productionObj.ProductId || ""}
              onChange={handleProductionObjChange}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
            <FormSelect
              colSpan={6}
              listItem={
                (productionObj.ProductId !== null &&
                  supportingTable.Table4?.filter(
                    (e) =>
                      e.ProductId === productionObj.ProductId &&
                      e.BranchId === formFields.BranchId
                  )) ||
                []
              }
              idName="ProductDetailId"
              valueName="ProductSizeName"
              size={INPUT_SIZE}
              name="ProductDetailId"
              label="ProductDetail"
              value={productionObj.ProductDetailId || ""}
              onChange={handleProductionObjChange}
              disabled={formFields?.IsSubmit === true ? true : false}
            />

            <FormTextField
              colSpan={6}
              label="Barcode"
              name="Barcode"
              size={INPUT_SIZE}
              value={productionObj.Barcode}
              onChange={handleProductionObjChange}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
            <FormButton
              colSpan={6}
              title="Add"
              type="primary"
              size={BUTTON_SIZE}
              colStyle={{ display: "flex", alignItems: "flex-end" }}
              onClick={handleProductionOptionAdd}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
          </Row>
        </Col>
        <Col span={24}>
          <Table
            columns={columnsDemandDetail}
            dataSource={SubRecipeProductionDetailList}
          />
        </Col>
      </Fragment>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Sub Recipe Production"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="ProductionId"
      editRow={setUpdateId}
      fields={initialFormValues}
      showSubmit={true}
      onFormClose={closeForm}
      disableSaveAndSubmit={formFields.IsSubmit === true ? true : false}
    />
  );
};

export default SubRecipieProduction;
