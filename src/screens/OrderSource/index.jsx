import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import { OrderSourceID } from "../../common/SetupMasterEnum";
import FormTextField from "../../components/general/FormTextField";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm
} from "../../redux/actions/basicFormAction";
import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";
import FormSelect from "../../components/general/FormSelect";
import { Col, Row, Space } from "antd";
import FormCheckbox from "../../components/general/FormCheckbox";
import { postRequest } from "../../services/mainApp.service";

const initialFormValues = {
  SetupDetailName: "",
  Flex1: "",
  Flex2: "",
  Flex3: "",
  OrderModeId: null,
  SetupDetailId: null
};

const initialSearchValues = {
  SetupDetailName: "",
  Flex1: "",
  Flex2: "",
  Flex3: "",
  OrderModeId: null,
  SetupDetailId: null
};

const columns = [
  {
    title: "Order Souce",
    dataIndex: "SetupDetailName",
    key: "SetupDetailName"
  },
  {
    title: "Display Name",
    dataIndex: "Flex1",
    key: "Flex1"
  }
];

const OrderSource = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [selectedOrderSource, setSelectedOrderSource] = useState([]);
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
        "/CrudOrderSource",
        {
          SetupDetailName: "",
          Flex1: "",
          Flex2: "",
          Flex3: "",
          OrderModeId: null
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
      const objectTodEidt = itemList.find(
        (item) => item.SetupDetailId === updateId
      );
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: objectTodEidt
      });
      const orderModes = supportingTable.Table2.filter(
        (item) => item.OrderSourceId === updateId
      ).map((order) => order.OrderModeId);
      setSelectedOrderSource(orderModes);
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };
  const handleOrderSourceSelection = (id) => {
    const copyOfSelectedOrderSource = selectedOrderSource;
    let orderSourceIndex = selectedOrderSource.findIndex(
      (orderSource) => orderSource === id
    );
    if (orderSourceIndex !== -1) {
      copyOfSelectedOrderSource.splice(orderSourceIndex, 1);
    } else {
      copyOfSelectedOrderSource.push(id);
    }
    setSelectedOrderSource([...copyOfSelectedOrderSource]);
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.SetupDetailName = searchFields.SetupDetailName.trim();
    dispatch(
      setInitialState(
        "/CrudOrderSource",
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
      deleteRow(
        "/CrudOrderSource",
        { SetupDetailId: id, SetupMasterId: OrderSourceID },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudOrderSource",
        {
          ...formFields,
          OrderModeId: selectedOrderSource
            .filter((item) => item !== null)
            .join(","),
          Flex2: ""
        },
        initialFormValues,
        controller,
        userData,
        id,
        (dataSet) => {
          (supportingTable.Table = dataSet.Table1),
            (supportingTable.Table1 = dataSet.Table2);
          supportingTable.Table2 = dataSet.Table3;
        }
      )
    );
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Order Source"
        name="SetupDetailName"
        size={INPUT_SIZE}
        value={searchFields.SetupDetailName}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Display Name"
        name="Flex1"
        size={INPUT_SIZE}
        value={searchFields.Flex1}
        onChange={handleSearchChange}
      />
      {/* <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="SetupDetailId"
        valueName="SetupDetailName"
        size={INPUT_SIZE}
        name="OrderModeId"
        label="Order Mode"
        value={searchFields.OrderModeId}
        onChange={handleSearchChange}
      /> */}
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Order Source"
        name="SetupDetailName"
        size={INPUT_SIZE}
        value={formFields.SetupDetailName}
        onChange={handleFormChange}
        required={true}
      />

      <FormTextField
        colSpan={8}
        label="Display Name"
        name="Flex1"
        size={INPUT_SIZE}
        value={formFields.Flex1}
        onChange={handleFormChange}
      />
      {/* <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        idName="SetupDetailId"
        valueName="SetupDetailName"
        size={INPUT_SIZE}
        name="OrderModeId"
        label="Order Mode"
        value={formFields.OrderModeId}
        onChange={handleFormChange}
      /> */}

      <Col span={24}>
        <Row
          style={{ border: "1px solid lightgray", borderRadus: 5, padding: 10 }}
        >
          <Col span={24} style={{ marginBottom: 20 }}>
            <Space size={35} align="center">
              <h4 style={{ textDecoration: "underline" }}>Order Mode List</h4>
              &nbsp;&nbsp;
            </Space>
          </Col>
          {supportingTable.Table1 &&
            supportingTable.Table1.length &&
            supportingTable.Table1.map((item, index) => (
              <FormCheckbox
                key={index}
                colSpan={6}
                checked={selectedOrderSource.includes(item.SetupDetailId)}
                name="SetupDetailId"
                onChange={() => handleOrderSourceSelection(item.SetupDetailId)}
                label={item.SetupDetailName}
                // disabled={disableChecks}
              />
            ))}
        </Row>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Order Source"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="SetupDetailId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default OrderSource;
