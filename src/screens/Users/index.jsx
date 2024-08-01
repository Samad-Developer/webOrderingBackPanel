import { Col, message, Row, Space } from "antd";
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
import {
  UPDATE_FORM_FIELD,
  SET_SUPPORTING_TABLE,
} from "../../redux/reduxConstants";

const initialFormValues = {
  Name: "",
  RoleName: "",
  UserName: "",
  User_Id: null,
  Password: "",
  RoleId: null,
  IsEnable: true,
  IsActive: true,
  EmailAddress: "",
  BranchIds: "",
};

const initialSearchValues = {
  Name: "",
  RoleName: "",
  UserName: "",
  User_Id: null,
  Password: "",
  RoleId: null,
  IsEnable: true,
  IsActive: true,
  EmailAddress: "",
  BranchIds: "",
};

const columns = [
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
  },
  {
    title: "User Name",
    dataIndex: "UserName",
    key: "UserName",
  },

  {
    title: "User Role",
    dataIndex: "RoleName",
    key: "RoleName",
  },
  {
    title: "Email Address",
    dataIndex: "EmailAddress",
    key: "EmailAddress",
  },
];

const Users = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [updateId, setUpdateId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [disableChecks, setDisableChecks] = useState(false);

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
        "/CreateUser",
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

  const handleBranchSelection = (id) => {
    const copyOfSelectedBranches = selectedBranch;
    let branchIndex = selectedBranch.findIndex((branch) => branch === id);
    if (branchIndex !== -1) {
      copyOfSelectedBranches.splice(branchIndex, 1);
    } else {
      copyOfSelectedBranches.push(id);
    }
    setSelectedBranch([...copyOfSelectedBranches]);
  };

  useEffect(() => {
    if (updateId !== null) {
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter((item) => item.User_Id === updateId)[0],
      });
      const user = itemList.filter((item) => item.User_Id === updateId)[0];

      const seletedBranches =
        supportingTable.Table3 &&
        supportingTable.Table3.filter((x) => x.UserID === updateId);
      const role =
        supportingTable.Table1 &&
        supportingTable.Table1.filter((x) => x.RoleId === user.RoleId)[0];

      if (role.RoleName === "Agent" || role.RoleName === "CompanyAdmin") {
        setDisableChecks(true);
      } else {
        setDisableChecks(false);
      }

      const filterdBranches = [];

      seletedBranches.map((y) => {
        supportingTable.Table3 &&
          supportingTable.Table3.map((z) => {
            if (y.BranchId === z.BranchId) {
              filterdBranches.push(z.BranchId);
            }
          });
      });

      if (filterdBranches.length === supportingTable.Table3.length) {
        setSelectAll(true);
      }
      setSelectedBranch(filterdBranches);
    }
    // setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    if (data.name === "RoleId" && data.value !== null) {
      const role =
        supportingTable.Table1 &&
        supportingTable.Table1.filter((x) => {
          if (x.RoleId === data.value) {
            return x;
          } else {
            return;
          }
        })[0];

      if (role.RoleName === "Agent" || role.RoleName === "CompanyAdmin") {
        setSelectedBranch([]);
        const brancheIds = supportingTable.Table3.map((item) => item.BranchId);
        setSelectedBranch([...brancheIds]);
        setDisableChecks(true);
      } else {
        setSelectedBranch([]);
        setDisableChecks(false);
      }
    }
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.Name = searchFields.Name.trim();
    searchFields.UserName = searchFields.UserName.trim();
    dispatch(
      setInitialState(
        "/CreateUser",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CreateUser", { User_Id: id }, controller, userData));
  };
  const formClose = () => {
    setSelectAll(null);
    setSelectedBranch([]);
    setUpdateId(null);
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    if (id === 3) {
      setUpdateId(null);
    }
    if (formFields.RoleId !== 1) {
      if (selectedBranch.length === 0) {
        message.error("Please Select Atleast One Branch");
        return;
      }
    }

    if (
      selectedBranch.length > 1 &&
      (formFields.RoleId == 2 || formFields.RoleId == 5)
    ) {
      message.error("Please Select Only One Branch");
      return;
    }
    dispatch(
      submitForm(
        "/CreateUser",
        { ...formFields, BranchIds: selectedBranch.join(",") },
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
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
          closeForm();
        }
      )
    );
    formClose();
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Name"
        name="Name"
        size={INPUT_SIZE}
        value={searchFields.Name}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="User Name"
        name="UserName"
        size={INPUT_SIZE}
        value={searchFields.UserName}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="RoleId"
        valueName="RoleName"
        size={INPUT_SIZE}
        name="RoleId"
        label="User Role"
        value={searchFields.RoleId}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Name"
        name="Name"
        size={INPUT_SIZE}
        value={formFields.Name}
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Username"
        name="UserName"
        size={INPUT_SIZE}
        value={formFields.UserName}
        onChange={handleFormChange}
        required={true}
        disabled={updateId ? true : false}
      />

      <FormTextField
        colSpan={8}
        label="Email Address"
        name="EmailAddress"
        size={INPUT_SIZE}
        value={formFields.EmailAddress}
        onChange={handleFormChange}
        required={true}
        type="email"
      />

      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        idName="RoleId"
        valueName="RoleName"
        size={INPUT_SIZE}
        name="RoleId"
        label="User Role"
        value={formFields.RoleId}
        onChange={handleFormChange}
        required={true}
      />

      <div className="ant-col ant-col-8 mt-26">
        <FormCheckbox
          // colSpan={8}
          idName="IsEnable"
          valueName="IsEnable"
          name="IsEnable"
          label="Is Enabled"
          checked={formFields.IsEnable}
          onChange={handleFormChange}
        />
      </div>
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
                      supportingTable.Table3.map((item) => item.BranchId)
                    );
                  } else {
                    setSelectedBranch([]);
                  }
                  setSelectAll(!selectAll);
                }}
                label="Select All"
                disabled={disableChecks}
              />
            </Space>
          </Col>
          {supportingTable.Table4 &&
            supportingTable.Table4.length &&
            supportingTable.Table4.map((item, index) => (
              <FormCheckbox
                key={index}
                colSpan={6}
                checked={selectedBranch.includes(item.BranchId)}
                name="BranchId"
                onChange={() => handleBranchSelection(item.BranchId)}
                label={item.BranchName}
                disabled={disableChecks}
              />
            ))}
        </Row>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Users"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="User_Id"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="User"
      onFormClose={formClose}
    />
  );
};

export default Users;
