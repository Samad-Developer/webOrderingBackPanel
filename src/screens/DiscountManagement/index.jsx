import { CloseOutlined } from "@ant-design/icons";
import { Card, Checkbox, Col, message, Row, Table } from "antd";
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
import { SET_SUPPORTING_TABLE } from "../../redux/reduxConstants";
import { compareTime } from "../../functions/dateFunctions";

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
    key: "StartDate",
    render: (record) => {
      return (
        <div>
          {new Date(record.StartDate).getDate() +
            "-" +
            (new Date(record.StartDate).getMonth() + 1) +
            "-" +
            new Date(record.StartDate).getFullYear()}
        </div>
      );
    },
  },
  {
    title: "End Date",
    key: "EndDate",
    render: (record) => {
      return (
        <div>
          {new Date(record.EndDate).getDate() +
            "-" +
            (new Date(record.EndDate).getMonth() + 1) +
            "-" +
            new Date(record.EndDate).getFullYear()}
        </div>
      );
    },
  },
];

const initialSearchValues = {
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
  IsPercentage: true,
  IsAutoDiscount: false,
  DiscountCapStart: 0,
  DiscountCapEnd: 0,
};

const DiscountManagement = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const {
    formFields,
    supportingTable,
    itemList,
    formLoading,
    tableLoading,
    searchFields,
  } = useSelector((state) => state.basicFormReducer);

  const [searchFieldsForPage, setSearchFieldsForPage] = useState({
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
  const [selectAllExceptDeal, setSelectAllExceptDeal] = useState(false);
  const [selectAllProducts, setSelectAllProducts] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [selectAllAreas, setSelectAllAreas] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.DiscountName = searchFields.DiscountName.trim();
    dispatch(
      setInitialState(
        "/CrudDiscount",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const closeForm = () => {
    setDiscountAvailabilityObj({
      DiscountId: null,
      DayId: null,
      DayName: "",
      StartTime: "",
      EndTime: "",
    });
    setOrderModeIds([]);
    setSourceIds([]);
    setBranchIds([]);
    setProductDetailIds([]);
    setAreaIds([]);
    setDiscountDayMapping([]);

    setSearchFieldsForPage({
      categoryId: null,
      productId: null,
      branchId: null,
      dayId: null,
    });
    setFormValues({
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
      IsPercentage: true,
      IsAutoDiscount: false,
      DiscountCapStart: 0,
      DiscountCapEnd: 0,
    });
    setUpdateId(null);
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
      title: "Varient",
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
      render: (record) => {
        return (
          <FormCheckbox checked={record.OnlyForDeal} onChange={() => {}} />
        );
      },
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

    const comparedTime = compareTime(
      formValues.DiscountTimeStart,
      formValues.DiscountTimeEnd
    );

    if (comparedTime === false) {
      message.error("Incorrect Discount Time Interval");
      return;
    }

    const finalObj = formValues;
    if (finalObj.DiscountTimeStart !== "" && finalObj.DiscountTimeEnd !== "") {
      // if (compareDate(finalObj.StartDate, finalObj.EndDate)) {
      if (id !== null) {
        finalObj.DiscountId = updateId;
      }
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
            closeForm();

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
          }
        )
      );
      // } else {
      //   message.error("Invalid Date Selection");
      // }
    } else {
      message.error("Select Discount Time!");
    }
  };

  const manageDiscountDayMapping = (event, obj) => {
    if (event === true) {
      const comparedTime = compareTime(
        discountAvailabilityObj.StartTime,
        discountAvailabilityObj.EndTime
      );

      if (comparedTime === false) {
        message.error("Incorrect  Time Interval");
        return;
      }
      if (
        discountAvailabilityObj.DayId &&
        discountAvailabilityObj.StartTime !== "" &&
        discountAvailabilityObj.EndTime !== ""
      ) {
        const disArr = discountDayMapping.filter((disArea) => {
          if (disArea.DayId === discountAvailabilityObj.DayId) {
            if (
              disArea.StartTime === discountAvailabilityObj.StartTime &&
              disArea.EndTime === discountAvailabilityObj.EndTime
            ) {
              return disArea;
            }
          }
        });

        if (disArr.length === 0) {
          setDiscountDayMapping([
            ...discountDayMapping,
            discountAvailabilityObj,
          ]);
          setDiscountAvailabilityObj({
            DiscountId: null,
            DayId: null,
            DayName: "",
            StartTime: "",
            EndTime: "",
          });
        } else {
          message.error("Same entry already exist!");
        }
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

  const handleDeleteRow = (id) => {
    const values = initialFormValues;
    values.DiscountId = id;
    dispatch(
      deleteRow("/CrudDiscount", values, controller, userData, (tables) => {
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
      })
    );
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
    }
    setFormValues({ ...formValues, [data.name]: data.value });
  };

  const handleSelect = (data) => {
    if (data.name !== "DayId") {
      setSearchFieldsForPage({
        ...searchFieldsForPage,
        [data.name]: data.value,
      });
      if (data.name === "categoryId") {
        if (data.value !== null) {
          const foundProduct = supportingTable.Table11.filter((tab) => {
            return tab.ProductCategoryId === data.value && tab;
          });

          const foundProductDiscount = supportingTable.Table17.filter((tab) => {
            return (
              tab.ProductCategoryId === data.value &&
              tab.OnlyForDeal === selectAllExceptDeal &&
              tab
            );
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
            return (
              tab.ProductCategoryId === searchFieldsForPage.categoryId && tab
            );
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

  const handleSelectAllExceptDeal = (data) => {
    setSelectAllExceptDeal(data.value);
    const foundProduct = supportingTable.Table17.filter((tab) => {
      return tab.OnlyForDeal === data.value && tab;
    });
    setDiscountProductMapping(foundProduct);
  };
  const handleSelectAllAreas = (data) => {
    setSelectAllAreas(data.value);
    if (data.value === true) {
      const areasFound = supportingTable.Table16.filter((item) => {
        return item;
      }).map(function (obj) {
        return obj.AreaId;
      });
      setAreaIds([...areasFound]);
    } else {
      setAreaIds([]);
    }
  };

  const handleSelectAllProducts = (data) => {
    setSelectAllProducts(data.value);
    if (data.value === true) {
      const productsFound = supportingTable.Table17.filter((item) => {
        return item;
      }).map(function (obj) {
        return obj.ProductDetailId;
      });
      setProductDetailIds([...productsFound]);
    } else {
      setProductDetailIds([]);
    }
  };

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudDiscount",
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
    setDiscountProductMapping(supportingTable.Table17);
    setDiscountAreaMapping(supportingTable.Table16);
  }, [supportingTable]);

  useEffect(() => {
    if (itemList) {
      const foundItem = itemList.find((item) => {
        return item.DiscountId === updateId && item;
      });

      if (foundItem) {
        setFormValues({
          ...formValues,
          DiscountName: foundItem.DiscountName,
          DiscountPercent: foundItem.DiscountPercent,
          IsActiveInMobile: foundItem.IsActiveInMobile,
          IsActiveInPOS: foundItem.IsActiveInPOS,
          IsActiveInODMS: foundItem.IsActiveInODMS,
          IsActiveInWeb: foundItem.IsActiveInWeb,
          StartDate: foundItem.StartDate.split("T")[0],
          EndDate: foundItem.EndDate.split("T")[0],
          DiscountTimeStart: foundItem.DiscountTimeStart,
          DiscountTimeEnd: foundItem.DiscountTimeEnd,
          IsAutoDiscount: foundItem.IsAutoDiscount,
          IsPercentage: foundItem.IsPercentage,
          DiscountCapStart: foundItem.DiscountCapStart,
          DiscountCapEnd: foundItem.DiscountCapEnd,
        });
      }
    }
    if (supportingTable.Table4) {
      const orderModeFound = supportingTable.Table4.filter((item) => {
        if (item.DiscountId === updateId) {
          return item;
        }
      }).map(function (obj) {
        return obj.SetupDetailId;
      });
      if (orderModeFound.length > 0) {
        setOrderModeIds([...orderModeFound]);
      }
    }
    if (supportingTable.Table5) {
      const orderSourceFound = supportingTable.Table5.filter((item) => {
        if (item.DiscountId === updateId) {
          return item;
        }
      }).map(function (obj) {
        return obj.SetupDetailId;
      });
      if (orderSourceFound.length > 0) {
        setSourceIds([...orderSourceFound]);
      }
    }
    if (supportingTable.Table2) {
      const branchesFound = supportingTable.Table2.filter((item) => {
        if (item.DiscountId === updateId) {
          return item;
        }
      }).map(function (obj) {
        return obj.BranchId;
      });
      if (branchesFound.length > 0) {
        setBranchIds([...branchesFound]);
      }
    }
    if (supportingTable.Table6) {
      const productDetailIdsFound = supportingTable.Table6.filter((item) => {
        if (item.DiscountId === updateId) {
          return item;
        }
      }).map(function (obj) {
        return obj.ProductDetailId;
      });

      if (productDetailIdsFound.length > 0) {
        setProductDetailIds([...productDetailIdsFound]);
      }
    }
    if (supportingTable.Table7) {
      const areaIdsFound = supportingTable.Table7.filter((item) => {
        if (item.DiscountId === updateId) {
          return item;
        }
      }).map(function (obj) {
        return obj.AreaId;
      });
      if (supportingTable.Table16) {
        if (areaIdsFound.length === supportingTable.Table16.length) {
          setSelectAllAreas(true);
        }
      }
      if (areaIdsFound.length > 0) {
        setAreaIds([...areaIdsFound]);
      }
    }
    const dayAreaMappingArr = [];

    if (supportingTable.Table10) {
      supportingTable.Table10.filter((item) => {
        if (item.DiscountId === updateId) {
          if (supportingTable.Table13) {
            supportingTable.Table13.map((item2) => {
              if (item.DayId === item2.SetupDetailId) {
                dayAreaMappingArr.push({
                  DiscountId: null,
                  DayId: item.DayId,
                  DayName: item2.SetupDetailName,
                  StartTime: item.StartTime,
                  EndTime: item.EndTime,
                });
              }
            });
          }
        }
      });
      if (dayAreaMappingArr.length > 0) {
        setDiscountDayMapping([...dayAreaMappingArr]);
      }
    }
  }, [updateId]);

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Discount Name"
        name="DiscountName"
        size={INPUT_SIZE}
        value={searchFields.DiscountName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <Card title="Discount Detail" style={{ width: "100%" }}>
        <Row
          gutter={[8, 8]}
          style={{ marginBottom: 20, alignItems: "flex-end" }}
        >
          <Col span={4}>
            <FormTextField
              label="Discount Name"
              name="DiscountName"
              size={INPUT_SIZE}
              value={formValues.DiscountName}
              onChange={handleFormChange}
              required={true}
            />
          </Col>
          <Col span={4}>
            <FormTextField
              label="Discount Percentage"
              name="DiscountPercent"
              size={INPUT_SIZE}
              value={formValues.DiscountPercent}
              onChange={handleFormChange}
              required={true}
              isNumber="true"
            />
          </Col>
          <Col span={4}>
            <label>Discount Start Date</label>
            <FormTextField
              type="date"
              name="StartDate"
              style={{ width: "100%" }}
              defaultValue={formValues.StartDate}
              value={
                formValues.StartDate
                  ? formValues.StartDate
                  : formValues.StartDate
              }
              onChange={(e) => {
                setFormValues({
                  ...formValues,
                  StartDate: e.value,
                });
              }}
            />
          </Col>
          <Col span={4}>
            <label>Discount End Date</label>
            <FormTextField
              type="date"
              style={{ width: "100%" }}
              defaultValue={formValues.EndDate}
              name="EndDate"
              value={
                formValues.EndDate ? formValues.EndDate : formValues.EndDate
              }
              onChange={(e) => {
                setFormValues({
                  ...formValues,
                  EndDate: e.value,
                });
              }}
            />
          </Col>
          <Col span={4}>
            <label>Discount Start Time</label>
            <FormTextField
              type="time"
              style={{ width: "100%" }}
              placeholder="Discount Start Time"
              value={
                formValues.DiscountTimeStart ? formValues.DiscountTimeStart : ""
              }
              onChange={(e) => {
                setFormValues({
                  ...formValues,
                  DiscountTimeStart: e.value,
                });
              }}
            />
          </Col>

          <Col span={4}>
            <label>Discount End Time</label>
            <FormTextField
              type="time"
              style={{ width: "100%" }}
              placeholder="Discount End Time"
              //  format="hh:mm:ss"
              value={
                formValues.DiscountTimeEnd ? formValues.DiscountTimeEnd : ""
              }
              onChange={(e) => {
                setFormValues({
                  ...formValues,
                  DiscountTimeEnd: e.value,
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
          <Col span={4}>
            <FormCheckbox
              name="IsPercentage"
              checked={formValues.IsPercentage}
              label="Is Percentage"
              onChange={(event) => {
                handleCheckBox({}, event);
              }}
            />
          </Col>
          <Col span={4}>
            <FormCheckbox
              name="IsAutoDiscount"
              checked={formValues.IsAutoDiscount}
              label="Is Auto Discount"
              onChange={(event) => {
                handleCheckBox({}, event);
              }}
            />
          </Col>
          {/* <Col span={4}>
            <FormCheckbox label="Open Discount" />
          </Col> */}
          <Col span={4}>
            <FormTextField
              label="Discount Cap Start"
              name="DiscountCapStart"
              size={INPUT_SIZE}
              value={formValues.DiscountCapStart}
              onChange={handleFormChange}
              isNumber="true"
            />
          </Col>
          <Col span={4}>
            <FormTextField
              label="Discount Cap End"
              name="DiscountCapEnd"
              size={INPUT_SIZE}
              value={formValues.DiscountCapEnd}
              onChange={handleFormChange}
              isNumber="true"
            />
          </Col>
        </Row>

        <Card type="inner" title="Discount-Order Mode Mapping">
          <Row gutter={[8, 8]}>
            {supportingTable.Table14 &&
              supportingTable.Table14.map((table) => {
                if (userData?.companyList[0]?.BusinessTypeId === 2) {
                  if (
                    table.BusinessType !== "DINE IN" &&
                    table.BusinessType !== "FINISH WASTE"
                  ) {
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
                  }
                } else {
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
                }
              })}
          </Row>
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="Discount-Order Type Mapping"
        >
          <Row gutter={[8, 8]}>
            {supportingTable.Table15 &&
              supportingTable.Table15.map((table) => {
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
                  value={searchFieldsForPage.categoryId}
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
                  value={searchFieldsForPage.productId}
                  onChange={handleSelect}
                />
              </Col>

              <Col span={4}>
                <FormCheckbox
                  checked={selectAllExceptDeal}
                  label="Deals"
                  onChange={handleSelectAllExceptDeal}
                />
              </Col>
              <Col span={4}>
                <FormCheckbox
                  checked={selectAllProducts}
                  label="Select All"
                  onChange={handleSelectAllProducts}
                />
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
                  value={searchFieldsForPage.branchId || ""}
                  onChange={handleSelect}
                />
              </Col>
              <Col span={4}>
                <FormCheckbox
                  checked={selectAllAreas}
                  onChange={handleSelectAllAreas}
                  label="Select All"
                />
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
        <Card type="inner" title="Discount - Day & Time Mapping">
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
              <label>Start Time</label>
              <FormTextField
                type="time"
                style={{ width: "100%" }}
                placeholder="Start Time"
                // format="hh:mm:ss"
                value={
                  discountAvailabilityObj.StartTime
                    ? discountAvailabilityObj.StartTime
                    : formFields.StartTime
                }
                onChange={(e) => {
                  setDiscountAvailabilityObj({
                    ...discountAvailabilityObj,
                    StartTime: e.value,
                  });
                }}
              />
            </Col>
            <Col span={4}>
              <label>End Time</label>
              <FormTextField
                type="time"
                style={{ width: "100%" }}
                placeholder="End Time"
                value={
                  discountAvailabilityObj.EndTime
                    ? discountAvailabilityObj.EndTime
                    : formFields.EndTime
                }
                onChange={(e) => {
                  setDiscountAvailabilityObj({
                    ...discountAvailabilityObj,
                    EndTime: e.value,
                  });
                }}
              />
              {/* <TimePicker
                style={{ width: "100%" }}
                placeholder="End Time"
                // format="hh:mm:ss"
                value={
                  discountAvailabilityObj.EndTime
                    ? discountAvailabilityObj.EndTime
                    : formFields.EndTime
                }
                onChange={(_, timeString) => {
                  setDiscountAvailabilityObj({
                    ...discountAvailabilityObj,
                    EndTime: timeString,
                  });
                }}
              /> */}
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
      </Card>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Discount Management"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      formWidth="95vw"
      formLoading={formLoading}
      tableLoading={tableLoading}
      tableColumn={discountCloumns}
      tableRows={itemList}
      editRow={setUpdateId}
      hideAction={false}
      fields={initialFormValues}
      actionID="DiscountId"
      onFormClose={closeForm}
      crudTitle="Discount"
      deleteRow={handleDeleteRow}
    />
  );
};

export default DiscountManagement;
