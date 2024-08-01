import { Col, Row, Space } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
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
import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";

// import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";

const initialFormValues = {
  OperationId: null,
  CompanyId: null,
  BranchId: "",
  OrderSourceId: null,
  UserId: null,
  UserIP: "",
};

const initialSearchValues = {
  OperationId: null,
  CompanyId: null,
  BranchId: "",
  OrderSourceId: null,
  UserId: null,
  UserIP: "",
};

const columns = [
  {
    title: "Order Source",
    dataIndex: "OrderSource",
    key: "OrderSourceId",
  },
];

const BranchOrderSource = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [updateId, setUpdateId] = useState(null);
  const [disableFormText, setDisableFormText] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState([]);

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
        "/BranchOrderSourceMapping",
        // {
        //   ...initialSearchValues,
        //   BranchId: userData.userBranchList[0].BranchId.toString(),
        // },
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
      setDisableFormText(true);
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter((item) => item.OrderSourceId === updateId)[0],
      });
      const branches = supportingTable.Table2.filter(
        (item) => item.OrderSourceId === updateId
      ).map((order) => order.BranchId);
      setSelectedBranch(branches);
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    dispatch(
      setInitialState(
        "/BranchOrderSourceMapping",
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
        "/BranchOrderSourceMapping",
        { ...initialSearchValues, OrderSourceId: id },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/BranchOrderSourceMapping",
        {
          ...formFields,
          BranchId: selectedBranch.filter((item) => item !== null).join(","),
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

  const handleBranchSelection = (id) => {
    const copyOfSelectedBranch = selectedBranch;
    let orderSourceIndex = selectedBranch.findIndex(
      (orderSource) => orderSource === id
    );
    if (orderSourceIndex !== -1) {
      copyOfSelectedBranch.splice(orderSourceIndex, 1);
    } else {
      copyOfSelectedBranch.push(id);
    }
    setSelectedBranch([...copyOfSelectedBranch]);
  };

  const handleSelectAllBranches = () => {
    if (selectedBranch.length > 2) {
      setSelectedBranch([]);
    } else {
      const branches = supportingTable.Table1.map((order) => order.BranchId);
      setSelectedBranch(branches);
    }
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={6}
        listItem={itemList}
        idName="OrderSourceId"
        valueName="OrderSource"
        size={INPUT_SIZE}
        name="OrderSourceId"
        label="Order Source"
        value={searchFields.OrderSourceId || ""}
        onChange={handleSearchChange}
      />
    </Fragment>
  );
  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={6}
        listItem={itemList}
        idName="OrderSourceId"
        valueName="OrderSource"
        size={INPUT_SIZE}
        name="OrderSourceId"
        label="Order Source"
        value={formFields.OrderSourceId || ""}
        onChange={handleFormChange}
        required={true}
        disabled={
          itemList.find((y) => y.OrderSourceId === formFields.OrderSourceId)
            ?.OrderSourceId
            ? true
            : false
        }
      />

      <Col span={24}>
        <Row
          style={{ border: "1px solid lightgray", borderRadus: 5, padding: 10 }}
        >
          <Col span={24} style={{ marginBottom: 20 }}>
            <Space size={35} align="center">
              <h4 style={{ textDecoration: "underline" }}>Branch List</h4>
              &nbsp;&nbsp;
              <FormCheckbox
                // key={index}
                colSpan={6}
                checked={selectedBranch.length > 2}
                name="BranchId"
                onChange={handleSelectAllBranches}
                label={""}
              />
            </Space>
          </Col>
          {supportingTable.Table1 &&
            supportingTable.Table1.length &&
            supportingTable.Table1.map((item, index) => (
              <FormCheckbox
                key={index}
                colSpan={6}
                checked={selectedBranch.includes(item.BranchId)}
                name="BranchId"
                onChange={() => handleBranchSelection(item.BranchId)}
                label={item.BranchName}
                // disabled={disableChecks}
              />
            ))}
        </Row>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Branch Order Source"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="OrderSourceId"
      editRow={setUpdateId}
      fields={initialFormValues}
      hideAddButton={true}
    />
  );
};

export default BranchOrderSource;
