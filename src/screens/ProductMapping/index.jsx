import { CloseOutlined, EditFilled, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  message,
  Modal,
  Row,
  Table,
  TimePicker,
} from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormButton from "../../components/general/FormButton";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import FormCheckbox from "../../components/general/FormCheckbox";
import moment from "moment";

import {
  resetState,
  setInitialState,
  setSearchFieldValue,
} from "../../redux/actions/basicFormAction";
import {
  RESET_FORM_FIELD,
  SET_SUPPORTING_TABLE,
  SET_TABLE_DATA,
  TOGGLE_FORM_LOADING,
  TOGGLE_TABLE_LOADING,
  UPDATE_FORM_FIELD,
} from "../../redux/reduxConstants";
import { postRequest } from "../../services/mainApp.service";
import {
  getDate,
  compareDate,
  compareTime,
} from "../../functions/dateFunctions";

const initialSearchValues = {
  BranchName: "",
  BranchId: null,
  CategoryName: "",
  CategoryId: null,
  ProductName: "",
  ProductId: null,
  SizeName: "",
  SizeId: null,
  FlavourName: "",
  FlavourId: null,
  CityName: "",
  CityId: null,
  VariantId: null,
  IsEnable: true,
  ValidFrom: "",
  ValidTo: "",
  ProductAvailability: [],
  DayId: null,
};

const initialFormField = {
  ProductId: null,
  OperationId: 1,
  CompanyId: null,
  BranchId: null,
  CategoryId: null,
  SizeId: null,
  VariantId: null,
  CityId: null,
  ProductBranchId: null,
  IsEnable: false,
  UserId: null,
  ValidFrom: "",
  ValidTo: "",
  ProductAvailability: [],
};

const initialProductAvailable = {
  ProductBranchId: null,
  DayId: null,
  StartTime: "",
  EndTime: "",
  Day: "",
};

const ProductMapping = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formFields, setFormFields] = useState(initialFormField);

  const [availableProduct, setAvailableProduct] = useState(
    initialProductAvailable
  );
  const [productDetail, setProductDetail] = useState({
    productDetailID: null,
    productID: null,
  });
  const { searchFields, itemList, formLoading, tableLoading, supportingTable } =
    useSelector((state) => state.basicFormReducer);

  const showModal = (record) => {
    let filteredAvailableProducts = [];
    setIsModalVisible(true);

    filteredAvailableProducts = supportingTable
      ? supportingTable.Table6.filter(
          (product) => product.ProductBranchId === record.ProductBranchId
        )
      : [];

    setFormFields({
      ...formFields,
      ...record,
      ProductAvailability: [...filteredAvailableProducts],
    });
    setProductDetail({
      productDetailID: record.ProductBranchId,
      productID: record.ProductId,
    });
  };
  const addProductAvailable = () => {
    if (
      availableProduct.StartTime === "" ||
      availableProduct.EndTime === "" ||
      availableProduct.DayId == null ||
      availableProduct.DayId === ""
    ) {
      message.error("Time,date and Day cant be empty");
      return;
    }

    const comparedTime = compareTime(
      availableProduct.StartTime,
      availableProduct.EndTime
    );

    // if (comparedTime === false) {
    //   message.error("Incorrect  Time Interval");
    //   return;
    // }
    if (
      formFields.ProductAvailability.filter(
        (x) =>
          x.DayId === availableProduct.DayId &&
          x.StartTime === availableProduct.StartTime &&
          x.EndTime === availableProduct.EndTime
      ).length > 0
    ) {
      message.error("Record already exists");
      return;
    }

    setFormFields({
      ...formFields,
      ProductAvailability: [
        ...formFields.ProductAvailability,
        {
          ...availableProduct,
          ProductBranchId: productDetail.productDetailID,
        },
      ],
    });

    setAvailableProduct({
      ...availableProduct,
      StartTime: "",
      EndTime: "",
      DayId: "",
      Day: "None",
    });
  };
  const removeAvailableProduct = (record, index) => {
    let arr = formFields.ProductAvailability;
    arr.splice(index, 1);
    setFormFields({
      ...formFields,
      ProductAvailability: [...arr],
    });
  };
  const handleOk = () => {
    const comparedDate = compareDate(
      new Date(getDate(formFields.ValidFrom)),
      new Date(getDate(formFields.ValidTo))
    );
    if (comparedDate === false) {
      message.error("Valid To cant be greater than Valid From");
      return;
    }
    const data = {
      ...formFields,
      ProductId: productDetail.productID,
    };

    postRequest(
      "CrudProductDetailMapping",
      {
        ...data,
        OperationId: 2,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "1.2.2.1",
      },
      controller
    ).then((response) => {
      if (response.error === true) {
        dispatch({
          type: TOGGLE_TABLE_LOADING,
        });
        message.error(response.errorMessage);
        return;
      }
      if (response.data.response === false) {
        message.error(response.DataSet.Table.errorMessage);
        return;
      }

      dispatch({
        type: SET_SUPPORTING_TABLE,
        payload: { Table6: response.data.DataSet.Table7 },
      });
      dispatch({
        type: SET_TABLE_DATA,
        payload: { table: response.data.DataSet.Table1 },
      });
      message.success("Saved Successfully!");
    });
    setAvailableProduct({
      ...availableProduct,
      ProductBranchId: null,
      DayId: null,
      StartTime: "",
      EndTime: "",
      Day: "",
    });
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setAvailableProduct({
      ...availableProduct,
      ProductBranchId: null,
      DayId: "",
      StartTime: "",
      EndTime: "",
      Day: "",
    });
  };
  const updateStatus = (event, record) => {
    postRequest(
      "/CrudProductDetailMapping",
      {
        ...record,
        isEnable: event.value,
        OperationId: 3,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "1.2.2.1",
      },
      controller
    ).then((response) => {
      if (response.error === true) {
        dispatch({
          type: TOGGLE_FORM_LOADING,
        });
        message.error(response.errorMessage);
        return;
      }
      dispatch({
        type: RESET_FORM_FIELD,
        payload: {
          initialSearchValues,
          listItem: response.data.DataSet.Table1,
        },
      });
      message.success(response.successMessage);
      // returnFunction && returnFunction(response.data.DataSet);
      dispatch({ type: TOGGLE_FORM_LOADING });
    });
  };
  const columns = [
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "branchName",
    },
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "categoryName",
    },
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "productName",
    },
    {
      title: "Size",
      dataIndex: "SizeName",
      key: "sizeName",
    },
    {
      title: "Variant",
      dataIndex: "VariantName",
      key: "variantName",
    },
    {
      title: "Enable",
      dataIndex: "Enable",
      key: "enable",
      render: (i, record) => {
        return (
          <FormCheckbox
            onChange={(e) => {
              updateStatus(e, record);
            }}
            checked={record.IsEnable}
          />
        );
      },
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (i, record) => (
        <Button
          type="text"
          icon={<EditFilled className="blueIcon" />}
          onClick={() => showModal(record)}
        />
      ),
    },
  ];

  const modalTabCols = [
    {
      title: "Day",
      dataIndex: "Day",
      key: "DayId",
    },
    {
      title: "Start Time",
      dataIndex: "StartTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "EndTime",
      key: "endTime",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record, index) => {
        return (
          <Button
            icon={<CloseOutlined />}
            onClick={() => removeAvailableProduct(record, index)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudProductDetailMapping",
        initialSearchValues,
        {},
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
        payload: itemList.filter((item) => item.CityId === updateId)[0], //thing to be fixed
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudProductDetailMapping",
        searchFields,
        initialSearchValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table2 || []}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={searchFields.BranchId}
        onChange={handleSearchChange}
        placeholder="Select Branch"
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table3 || []}
        idName="CategoryId"
        valueName="CategoryName"
        size={INPUT_SIZE}
        name="CategoryId"
        label="Category"
        value={searchFields.CategoryId}
        onChange={handleSearchChange}
      />

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table7 || []}
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
        listItem={supportingTable.Table4 || []}
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
        listItem={supportingTable.Table5 || []}
        idName="FlavourId"
        valueName="FlavourName"
        size={INPUT_SIZE}
        name="VariantId"
        label="Variant"
        value={searchFields.FlavourId}
        onChange={handleSearchChange}
      />

      <Modal
        title="Product Availability"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="80%"
        okText="Save"
      >
        <Card title="Product Availability">
          <Row gutter={[8, 8]}>
            <Col span={4}>
              <FormTextField
                label="Branch"
                value={formFields.BranchName}
                onChange={() => {}}
                disabled={true}
              />
            </Col>
            <Col span={4}>
              <FormTextField
                label="Category"
                value={formFields.CategoryName}
                onChange={() => {}}
                disabled={true}
              />
            </Col>
            <Col span={4}>
              <FormTextField
                label="Product"
                value={formFields.ProductName}
                onChange={() => {}}
                disabled={true}
              />
            </Col>
            <Col span={4}>
              <FormTextField
                label="Size"
                value={formFields.SizeName}
                onChange={() => {}}
                disabled={true}
              />
            </Col>
            <Col span={4}>
              <FormTextField
                label="Variant"
                value={formFields.VariantName}
                onChange={() => {}}
                disabled={true}
              />
            </Col>
            <Col span={4}>
              <FormTextField
                label="Price"
                value={formFields.Price}
                onChange={() => {}}
                disabled={true}
              />
            </Col>
            <Col span={4}>
              <label>Valid From</label>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Valid From"
                value={
                  formFields.ValidFrom
                    ? moment(formFields.ValidFrom, "YYYY-MM-DD")
                    : formFields.ValidFrom
                }
                allowClear={true}
                onChange={(time, timeString) => {
                  setFormFields({ ...formFields, ValidFrom: timeString });
                }}
              />
            </Col>
            <Col span={4}>
              <label>Valid Till</label>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Valid Till"
                value={
                  formFields.ValidTo
                    ? moment(formFields.ValidTo, "YYYY-MM-DD")
                    : formFields.ValidTo
                }
                allowClear={true}
                onChange={(time, timeString) => {
                  setFormFields({ ...formFields, ValidTo: timeString });
                }}
              />
            </Col>
          </Row>
          <Card
            type="inner"
            title="Day Wise Product Start / End Time"
            style={{ marginTop: 16 }}
          >
            <Row gutter={[8, 8]} style={{ alignItems: "flex-end" }}>
              <Col span={4}>
                <FormSelect
                  listItem={supportingTable.Table1 || []}
                  idName="DayId"
                  valueName="Day"
                  size={INPUT_SIZE}
                  name="DayId"
                  label="Day"
                  value={availableProduct.DayId}
                  onChange={(e) => {
                    setAvailableProduct({
                      ...availableProduct,
                      DayId: e.value,
                      Day: supportingTable.Table1.filter((x) => {
                        if (e.value !== null && x.DayId === e.value) return x;
                        else if (e.value === null) {
                          return { DayId: 0, Day: "None" };
                        }
                      })[0].Day,
                    });
                  }}
                />
              </Col>
              <Col span={4}>
                <label>Start Time</label>
                <TimePicker
                  style={{ width: "100%" }}
                  placeholder="Start Time"
                  value={
                    availableProduct.StartTime
                      ? moment(availableProduct.StartTime, "hh:mm")
                      : formFields.StartTime
                  }
                  required={true}
                  onChange={(_, timeString) => {
                    setAvailableProduct({
                      ...availableProduct,
                      StartTime: timeString,
                    });
                  }}
                />
              </Col>
              <Col span={4}>
                <label>End Time</label>
                <TimePicker
                  style={{ width: "100%" }}
                  placeholder="End Time"
                  value={
                    availableProduct.EndTime
                      ? moment(availableProduct.EndTime, "hh:mm")
                      : formFields.EndTime
                  }
                  onChange={(_, timeString) => {
                    setAvailableProduct({
                      ...availableProduct,
                      EndTime: timeString,
                    });
                  }}
                />
              </Col>
              <Col span={4}>
                <FormButton
                  title="Add"
                  type="primary"
                  onClick={addProductAvailable}
                />
              </Col>
            </Row>
          </Card>

          <Row>
            <Col span={24}>
              <Table
                columns={modalTabCols}
                dataSource={formFields.ProductAvailability}
                style={{ marginTop: 16 }}
              />
            </Col>
          </Row>
        </Card>
      </Modal>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Branch Product Mapping"
      searchPanel={searchPanel}
      searchSubmit={handleSearchSubmit}
      tableRows={itemList}
      tableColumn={columns}
      crudTitle=" Branch Product Mapping"
      formLoading={formLoading}
      tableLoading={tableLoading}
    />
  );
};

export default ProductMapping;
