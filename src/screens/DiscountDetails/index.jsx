import { CloseOutlined, EditFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  message,
  Row,
  Table,
  TimePicker,
} from "antd";
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
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../redux/actions/basicFormAction";
import moment from "moment";
import { SET_SUPPORTING_TABLE } from "../../redux/reduxConstants";

const discountCloumns = [
  {
    title: "Discount Name",
    dataIndex: "DiscountName",
    key: "DiscountName",
  },
  {
    title: "Discount Percent",
    dataIndex: "DiscountPercent",
    key: "DiscountPercent",
  },
  {
    title: "Priority",
    dataIndex: "Priority",
    key: "Priority",
  },
  {
    title: "Active in Web",
    key: "IsActiveInWeb",
    render: (record) => {
      return (
        <div>
          <Checkbox checked={record.IsActiveInWeb} disabled={true} />
        </div>
      );
    },
  },
  {
    title: "Active in POS",
    key: "IsActiveInPOS",
    render: (record) => {
      return (
        <div>
          <Checkbox checked={record.IsActiveInPOS} disabled={true} />
        </div>
      );
    },
  },

  {
    title: "Start Date",
    dataIndex: "StartDate",
    key: "StartDate",
  },
  {
    title: "End Date",
    dataIndex: "EndDate",
    key: "EndDate",
  },
];

const DiscountDetails = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const { formFields, supportingTable, itemList, formLoading, tableLoading } =
    useSelector((state) => state.basicFormReducer);

  const [searchFields, setSearchFields] = useState({
    categoryId: null,
    productId: null,
    branchId: null,
    dayId: null,
  });

  const [discountAvailabilityObj, setDiscountAvailabilityObj] = useState({
    DiscountId: null,
    DayId: null,
    DayName: "",
    StartTime: "",
    EndTime: "",
  });

  const [orderModeIds, setOrderModeIds] = useState([]);
  const [orderSourceIds, setSourceIds] = useState([]);
  const [BranchIds, setBranchIds] = useState([]);
  const [ProductDetailIds, setProductDetailIds] = useState([]);
  const [AreaIds, setAreaIds] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [discountProductMapping, setDiscountProductMapping] = useState([]);
  const [discountAreaMapping, setDiscountAreaMapping] = useState([]);
  const [discountDayMapping, setDiscountDayMapping] = useState([]);
  const [updateId, setUpdateId] = useState(null);

  const initialFormValues = {
    PriorityName: "",
    PriorityId: null,
    IsActiveInWeb: false,
    IsActiveInPOS: false,
    IsActiveInODMS: false,
    IsActiveInMobile: false,
    OpenForDiscount: false,
    VerndorSharePercentage: null,
    DiscountId: null,
    DiscountPercent: null,
    DiscountTimeStart: "",
    DiscountTimeEnd: "",
    DiscountName: "",
    OrderType: "",
    StartDate:
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate(),
    EndDate:
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate(),
    DiscountTypeId: null,
    AreaId: "",
    BranchId: "",
    OrderMode: "",
    ProductDetail: "",
    DiscountAvailability: [],
    DiscountTimeStart: "",
    DiscountTimeEnd: "",
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  const productMappingTabCol = [
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "productName",
    },
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "categoryName",
    },
    {
      title: "Size",
      dataIndex: "SizeName",
      key: "sizeName",
    },
    {
      title: "Flavour",
      dataIndex: "FlavourName",
      key: "flavourName",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "price",
    },
    {
      title: "Only for Deal",
      key: "OnlyForDeal",
      render: (record) => <FormCheckbox checked={record} />,
    },

    {
      title: "Select",
      dataIndex: "Select",
      render: (_, record) => {
        return (
          <FormCheckbox
            onChange={(event) => {
              handleCheckBox(record, event);
            }}
            name="ProductDetail"
            checked={ProductDetailIds.includes(record.ProductDetailId)}
          />
        );
      },
    },
  ];

  const discountAreaTabCol = [
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "branchName",
    },
    {
      title: "Area",
      dataIndex: "AreaName",
      key: "AreaName",
    },
    {
      title: "Select",
      dataIndex: "Select",
      render: (_, record) => {
        return (
          <FormCheckbox
            onChange={(event) => {
              handleCheckBox(record, event);
            }}
            name="AreaId"
            checked={AreaIds.includes(record.AreaId)}
          />
        );
      },
    },
  ];
  const dayTimeTabCols = [
    {
      title: "Day",
      dataIndex: "DayName",
      key: "DayName",
    },
    {
      title: "Start Time",
      dataIndex: "StartTime",
    },
    {
      title: "End Time",
      dataIndex: "EndTime",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record) => {
        return (
          <FormButton
            icon={<CloseOutlined />}
            onClick={() => {
              manageDiscountDayMapping(false, record);
            }}
          >
            X
          </FormButton>
        );
      },
    },
  ];

  const handleFormSubmit = (event, id, _, closeForm) => {
    event.preventDefault();
    const finalObj = formValues;
    finalObj.AreaId = AreaIds.join(",");
    finalObj.BranchId = BranchIds.join(",");
    finalObj.OrderMode = orderModeIds.join(",");
    finalObj.OrderType = orderSourceIds.join(",");
    finalObj.ProductDetail = ProductDetailIds.join(",");
    finalObj.DiscountPercent = parseFloat(finalObj.DiscountPercent);
    finalObj.DiscountAvailability = discountDayMapping;
    dispatch(
      submitForm(
        "/CrudDiscount",
        finalObj,
        initialFormValues,
        controller,
        userData,
        id,
        (tables) => {
          delete tables.Table;
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
            Table10: tables.Table11,
            Table11: tables.Table12,
            Table12: tables.Table13,
            Table13: tables.Table14,
            Table14: tables.Table15,
            Table15: tables.Table16,
            Table16: tables.Table17,
            Table17: tables.Table18,
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
          closeForm()
        }
      )
    );
  };

  const manageDiscountDayMapping = (event, obj) => {
    if (event === true) {
      if (
        discountAvailabilityObj.DayId &&
        discountAvailabilityObj.StartTime !== "" &&
        discountAvailabilityObj.EndTime !== ""
      ) {
        setDiscountDayMapping([...discountDayMapping, discountAvailabilityObj]);
        setDiscountAvailabilityObj({
          DiscountId: null,
          DayId: null,
          DayName: "",
          StartTime: "",
          EndTime: "",
        });
      } else {
        message.error("Day Start Time and End Time is required!");
      }
    } else {
      const copyOfDiscountDayMapping = discountDayMapping;
      const index = copyOfDiscountDayMapping.findIndex((x) => (x = obj));
      if (index > -1) {
        copyOfDiscountDayMapping.splice(index, 1);
      }
      setDiscountDayMapping([...copyOfDiscountDayMapping]);
    }
  };

  const handleFormChange = (data) => {
    setFormValues({ ...formValues, [data.name]: data.value });
  };

  const handleCheckBox = (item, data) => {
    if (data.name === "OrderMode") {
      if (data.value === true) {
        const itemId = item.SetupDetailId;
        setOrderModeIds([...orderModeIds, itemId]);
      } else {
        const orderModeArr = orderModeIds;
        let index = orderModeArr.findIndex((x) => x === item.SetupDetailId);
        if (index > -1) {
          orderModeArr.splice(index, 1);
        }
        setOrderModeIds([...orderModeArr]);
      }
    } else if (data.name === "OrderSource") {
      if (data.value === true) {
        const itemId = item.SetupDetailId;
        setSourceIds([...orderSourceIds, itemId]);
      } else {
        const orderSourceArr = orderSourceIds;
        let index = orderSourceArr.findIndex((x) => x === item.SetupDetailId);
        if (index > -1) {
          orderSourceArr.splice(index, 1);
        }
        setSourceIds([...orderSourceArr]);
      }
    } else if (data.name === "BranchId") {
      if (data.value === true) {
        const itemId = item.BranchId;
        setBranchIds([...BranchIds, itemId]);
      } else {
        const branchIdsArr = BranchIds;
        let index = branchIdsArr.findIndex((x) => x === item.BranchId);
        if (index > -1) {
          branchIdsArr.splice(index, 1);
        }
        setBranchIds([...branchIdsArr]);
      }
    } else if (data.name === "ProductDetail") {
      if (data.value === true) {
        const itemId = item.ProductDetailId;
        setProductDetailIds([...ProductDetailIds, itemId]);
      } else {
        const productDetailIdsArr = ProductDetailIds;
        let index = productDetailIdsArr.findIndex(
          (x) => x === item.ProductDetailId
        );
        if (index > -1) {
          productDetailIdsArr.splice(index, 1);
        }
        setProductDetailIds([...productDetailIdsArr]);
      }
    } else if (data.name === "AreaId") {
      if (data.value === true) {
        const itemId = item.AreaId;
        setAreaIds([...AreaIds, itemId]);
      } else {
        const areaIdsArr = AreaIds;
        let index = areaIdsArr.findIndex((x) => x === item.AreaId);
        if (index > -1) {
          areaIdsArr.splice(index, 1);
        }
        setAreaIds([...areaIdsArr]);
      }
    } else if (data.name === "IsActiveInMobile") {
      if (data.value === true) {
        setFormValues({ ...formValues, IsActiveInMobile: data.value });
      } else {
        setFormValues({ ...formValues, IsActiveInMobile: data.value });
      }
    } else if (data.name === "IsActiveInODMS") {
      if (data.value === true) {
        setFormValues({ ...formValues, IsActiveInODMS: data.value });
      } else {
        setFormValues({ ...formValues, IsActiveInODMS: data.value });
      }
    } else if (data.name === "IsActiveInPOS") {
      if (data.value === true) {
        setFormValues({ ...formValues, IsActiveInPOS: data.value });
      } else {
        setFormValues({ ...formValues, IsActiveInPOS: data.value });
      }
    } else if (data.name === "IsActiveInWeb") {
      if (data.value === true) {
        setFormValues({ ...formValues, IsActiveInWeb: data.value });
      } else {
        setFormValues({ ...formValues, IsActiveInWeb: data.value });
      }
    }
  };

  const handleSelect = (data) => {
    if (data.name !== "DayId") {
      setSearchFields({ ...searchFields, [data.name]: data.value });
      if (data.name === "categoryId") {
        if (data.value !== null) {
          const foundProduct = supportingTable.Table11.filter((tab) => {
            return tab.ProductCategoryId === data.value && tab;
          });

          const foundProductDiscount = supportingTable.Table17.filter((tab) => {
            return tab.ProductCategoryId === data.value && tab;
          });

          setDiscountProductMapping([...foundProductDiscount]);

          setFilteredProducts([...foundProduct]);
        } else {
          setDiscountProductMapping([...supportingTable.Table17]);

          setFilteredProducts([...supportingTable.Table11]);
        }
      }
      if (data.name === "productId") {
        if (data.value !== null) {
          const foundProduct = supportingTable.Table17.filter((tab) => {
            return tab.ProductId === data.value && tab;
          });
          setDiscountProductMapping([...foundProduct]);
        } else {
          const foundProductDiscount = supportingTable.Table17.filter((tab) => {
            return tab.ProductCategoryId === searchFields.categoryId && tab;
          });
          setDiscountProductMapping([...foundProductDiscount]);
        }
      }

      if (data.name === "branchId") {
        if (data.value !== null) {
          const foundProduct = supportingTable.Table16.filter((tab) => {
            return tab.BranchId === data.value && tab;
          });
          setDiscountAreaMapping([...foundProduct]);
        } else {
          setDiscountAreaMapping([...supportingTable.Table16]);
        }
      }
    } else {
      const day = supportingTable.Table13.filter((day) => {
        return day.SetupDetailId === data.value && day;
      })[0];

      setDiscountAvailabilityObj({
        ...discountAvailabilityObj,
        [data.name]: data.value,
        DayName: day.SetupDetailName,
      });
    }
  };

  const handleProductSelect = (data) => {
    setSearchFields({ ...searchFields, [data.name]: data.value });
    const foundProduct = supportingTable.Table10.filter((tab) => {
      return tab.ProductCategoryId === data.value && tab;
    });
    setFilteredProducts([...foundProduct]);
  };

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudDiscount",
        initialFormValues,
        initialFormValues,
        initialFormValues,
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
    setDiscountProductMapping(supportingTable.Table17);
    setDiscountAreaMapping(supportingTable.Table16);
  }, [supportingTable]);

  const formPanel = (
    <Fragment>
      <Card title="Discount Detail" style={{ width: "100%" }}>
        <Row
          gutter={[8, 8]}
          style={{ marginBottom: 20, alignItems: "flex-end" }}
        >
          <Col span={4}>
            <FormTextField
              label="Discount  Name"
              name="DiscountName"
              size={INPUT_SIZE}
              value={formValues.DiscountName}
              onChange={handleFormChange}
              required={true}
            />
          </Col>
          <Col span={4}>
            <FormTextField
              label="Discount  Percentage"
              name="DiscountPercent"
              size={INPUT_SIZE}
              value={formValues.DiscountPercent}
              onChange={handleFormChange}
              required={true}
              isNumber="true"
            />
          </Col>
          <Col span={4}>
            <DatePicker
              style={{ width: "100%" }}
              defaultValue={moment(new Date(), "YYYY/MM/DD")}
              onChange={(date, dateString) => {
                setFormValues({
                  ...formValues,
                  StartDate: dateString,
                });
              }}
            />
          </Col>
          <Col span={4}>
            <DatePicker
              style={{ width: "100%" }}
              defaultValue={moment(new Date(), "YYYY/MM/DD")}
              onChange={(date, dateString) => {
                setFormValues({
                  ...formValues,
                  EndDate: dateString,
                });
              }}
            />
          </Col>
          <Col span={4}>
            <TimePicker
              placeholder="Discount Start Time"
              format="hh:mm"
              value={
                formValues.DiscountTimeStart
                  ? moment(formValues.DiscountTimeStart, "hh:mm")
                  : ""
              }
              onChange={(time, timeString) => {
                setFormValues({
                  ...formValues,
                  DiscountTimeStart: timeString,
                });
              }}
            />
          </Col>

          <Col span={4}>
            <TimePicker
              placeholder="Discount Start Time"
              format="hh:mm"
              value={
                formValues.DiscountTimeEnd
                  ? moment(formValues.DiscountTimeEnd, "hh:mm")
                  : ""
              }
              onChange={(time, timeString) => {
                setFormValues({
                  ...formValues,
                  DiscountTimeEnd: timeString,
                });
              }}
            />
          </Col>

          <Col span={4}>
            <FormCheckbox
              name="IsActiveInWeb"
              checked={formValues.IsActiveInWeb}
              label="Active in Web"
              onChange={(event) => {
                handleCheckBox({}, event);
              }}
            />
          </Col>
          <Col span={4}>
            <FormCheckbox
              name="IsActiveInPOS"
              checked={formValues.IsActiveInPOS}
              label="Active in POS"
              onChange={(event) => {
                handleCheckBox({}, event);
              }}
            />
          </Col>
          <Col span={4}>
            <FormCheckbox
              name="IsActiveInMobile"
              checked={formValues.IsActiveInMobile}
              label="Active in Mob"
              onChange={(event) => {
                handleCheckBox({}, event);
              }}
            />
          </Col>
          <Col span={4}>
            <FormCheckbox
              name="IsActiveInODMS"
              checked={formValues.IsActiveInODMS}
              label="Active in ODMS"
              onChange={(event) => {
                handleCheckBox({}, event);
              }}
            />
          </Col>
          {/* <Col span={4}>
            <FormCheckbox label="Open Discount" />
          </Col> */}
        </Row>

        <Card type="inner" title="Discount-Order Mode Mapping">
          <Row gutter={[8, 8]}>
            {supportingTable.Table14 &&
              supportingTable.Table14.map((table) => {
                return (
                  <Col span={4}>
                    <FormCheckbox
                      onChange={(event) => {
                        handleCheckBox(table, event);
                      }}
                      label={table.SetupDetailName}
                      name="OrderMode"
                      checked={orderModeIds.includes(table.SetupDetailId)}
                    />
                  </Col>
                );
              })}
          </Row>
        </Card>
        <button
          onClick={(event) => {
            event.preventDefault();
            const finalObj = formValues;
            finalObj.AreaId = AreaIds.join(",");
            finalObj.BranchId = BranchIds.join(",");
            finalObj.OrderMode = orderModeIds.join(",");
            finalObj.OrderType = orderSourceIds.join(",");
            finalObj.ProductDetail = ProductDetailIds.join(",");
            finalObj.DiscountAvailability = discountDayMapping;
          }}
        >
          hello
        </button>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="Discount-Order Type Mapping"
        >
          <Row gutter={[8, 8]}>
            {supportingTable.Table5 &&
              supportingTable.Table5.map((table) => {
                return (
                  <Col span={4}>
                    <FormCheckbox
                      onChange={(event) => {
                        handleCheckBox(table, event);
                      }}
                      label={table.SetupDetailName}
                      name="OrderSource"
                      checked={orderSourceIds.includes(table.SetupDetailId)}
                    />
                  </Col>
                );
              })}
          </Row>
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="Discount-Branch Mapping"
        >
          <Row gutter={[8, 8]}>
            {supportingTable.Table3 &&
              supportingTable.Table3.map((table) => {
                return (
                  <Col span={4}>
                    <FormCheckbox
                      onChange={(event) => {
                        handleCheckBox(table, event);
                      }}
                      label={table.BranchName}
                      name="BranchId"
                      checked={BranchIds.includes(table.BranchId)}
                    />
                  </Col>
                );
              })}
          </Row>
        </Card>

        <Card
          type="inner"
          title="Discount-Product Mapping"
          style={{ marginTop: 16 }}
        >
          <Card type="inner" title="Search">
            <Row gutter={[8, 8]} style={{ alignItems: "flex-end" }}>
              <Col span={4}>
                <FormSelect
                  listItem={supportingTable.Table1 || []}
                  idName="CategoryId"
                  valueName="CategoryName"
                  size={INPUT_SIZE}
                  name="categoryId"
                  label="Product Categories"
                  value={searchFields.categoryId}
                  onChange={handleSelect}
                />
              </Col>
              <Col span={4}>
                <FormSelect
                  listItem={filteredProducts}
                  idName="ProductId"
                  valueName="ProductName"
                  size={INPUT_SIZE}
                  name="productId"
                  label="Products"
                  value={searchFields.productId}
                  onChange={handleSelect}
                />
              </Col>

              <Col span={4}>
                <FormCheckbox label="Select All Except Deals" />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  columns={productMappingTabCol}
                  dataSource={discountProductMapping || []}
                  style={{ marginTop: 16 }}
                />
              </Col>
            </Row>
          </Card>
        </Card>

        <Card
          type="inner"
          title="Discount-Area Mapping"
          style={{ marginTop: 16 }}
        >
          <Card type="inner" title="Search">
            <Row
              gutter={[8, 8]}
              style={{
                alignItems: "flex-end",
              }}
            >
              <Col span={4}>
                <FormSelect
                  listItem={supportingTable.Table3 || []}
                  idName="BranchId"
                  valueName="BranchName"
                  size={INPUT_SIZE}
                  name="branchId"
                  label="Branch"
                  value={searchFields.branchId || ""}
                  onChange={handleSelect}
                />
              </Col>
              <Col span={4}>
                <FormCheckbox label="Select All" />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  columns={discountAreaTabCol}
                  dataSource={discountAreaMapping || []}
                  style={{ marginTop: 16 }}
                />
              </Col>
            </Row>
          </Card>
        </Card>
        <Card type="inner" title="Discount-Day & Time Mapping">
          <Row gutter={[8, 8]} style={{ alignItems: "flex-end" }}>
            <Col span={4}>
              <FormSelect
                listItem={supportingTable.Table13 || []}
                idName="SetupDetailId"
                valueName="SetupDetailName"
                size={INPUT_SIZE}
                name="DayId"
                label="Day"
                value={discountAvailabilityObj.DayId || ""}
                onChange={handleSelect}
              />
            </Col>
            <Col span={4}>
              <TimePicker
                placeholder="Start Time"
                format="hh:mm"
                value={
                  discountAvailabilityObj.StartTime
                    ? moment(discountAvailabilityObj.StartTime, "hh:mm")
                    : formFields.StartTime
                }
                onChange={(time, timeString) => {
                  setDiscountAvailabilityObj({
                    ...discountAvailabilityObj,
                    StartTime: timeString,
                  });
                }}
              />
            </Col>
            <Col span={4}>
              <TimePicker
                placeholder="End Time"
                format="hh:mm"
                value={
                  discountAvailabilityObj.EndTime
                    ? moment(discountAvailabilityObj.EndTime, "hh:mm")
                    : formFields.EndTime
                }
                onChange={(time, timeString) => {
                  setDiscountAvailabilityObj({
                    ...discountAvailabilityObj,
                    EndTime: timeString,
                  });
                }}
              />
            </Col>
            <Col span={4}>
              <FormButton
                onClick={() => {
                  manageDiscountDayMapping(true, {});
                }}
                title="Add"
                type="primary"
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                rowSelection={true}
                columns={dayTimeTabCols}
                dataSource={discountDayMapping}
                style={{ marginTop: 16 }}
              />
            </Col>
          </Row>
        </Card>
        <Row
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "flex-end",
          }}
          gutter={[2, 2]}
        >
          <Col>
            <FormButton title="Save" type="primary" />
          </Col>
          <Col>
            <FormButton title="Cancel" />
          </Col>
        </Row>
      </Card>
    </Fragment>
  );

  return (
    // <BasicFormComponent
    //   formTitle="Discount Management"
    //   // searchPanel={searchPanel}
    //   formPanel={formPanel}
    //   //   searchSubmit={handleSearchSubmit}
    //   onFormSave={handleFormSubmit}
    //   tableRows={itemList}
    //   tableLoading={tableLoading}
    //   formLoading={formLoading}
    //   tableColumn={discountCloumns}
    //   //   deleteRow={handleDeleteRow}
    //   //   actionID="CityId"
    //   editRow={setUpdateId}
    //   fields={initialFormValues}
    //   crudTitle="Discount Management"
    //   formWidth="95vw"
    // />
    <BasicFormComponent
      formTitle="Branches"
      // searchPanel={searchPanel}
      formPanel={formPanel}
      // searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      formWidth="95vw"
      formLoading={formLoading}
      tableLoading={tableLoading}
      tableColumn={discountCloumns}
      tableRows={itemList}
      editRow={setUpdateId}
      deleteRow={() => { }}
      hideAction={false}
      fields={initialFormValues}
      actionID="BranchId"
      // onFormClose={closeForm}
      // onFormOpen={setAreaToShow}
      crudTitle="Branch"
    />
  );
};

export default DiscountDetails;
