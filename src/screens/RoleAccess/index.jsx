import { Col, message, Row, TimePicker } from "antd";
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
import { compareTime } from "../../functions/dateFunctions";
import FormButton from "../../components/general/FormButton";
import { RoleAccessModal } from "./RoleAccessModal";
import Title from "antd/lib/typography/Title";
import { postRequest } from "../../services/mainApp.service";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

const columns = [
  {
    title: "Role Name",
    dataIndex: "RoleName",
    key: "RoleName",
  },
  {
    title: "Company",
    dataIndex: "CompanyName",
    key: "CompanyName",
  },
  {
    title: "Is Active",
    dataIndex: "IsActive",
    key: "IsActive",
    render: (_, record) =>
      record.IsActive ? (
        <CheckCircleFilled className="blueIcon" />
      ) : (
        <CloseCircleFilled className="redIcon" />
      ),
  },
  {
    title: "Is Pos",
    dataIndex: "IsPos",
    key: "IsPos",
    render: (_, record) =>
      record.IsPos ? (
        <CheckCircleFilled className="blueIcon" />
      ) : (
        <CloseCircleFilled className="redIcon" />
      ),
  },
  {
    title: "Is Default",
    dataIndex: "IsDefaultRole",
    key: "IsDefaultRole",
    render: (_, record) =>
      record.IsDefaultRole ? (
        <CheckCircleFilled className="blueIcon" />
      ) : (
        <CloseCircleFilled className="redIcon" />
      ),
  },
];

const RoleAccess = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [roleModal, setRoleModal] = useState(false);
  const [menuUpdated, setMenuUpdated] = useState(false);
  const [menuListCheckboxes, setMenuListCheckboxes] = useState([]);
  const [updateId, setUpdateId] = useState(null);
  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const initialFormValues = {
    CompanyId: null,
    UserId: null,
    UserIP: "12.1.1.2",
    RoleName: "",
    RoleId: null,
    OperationId: 1,
    IsPos: false,
    IsDefaultRole: false,
    MenuList: [],
  };

  const initialSearchValues = {
    RoleName: "",
    MenuList: [],
  };

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudRoleAccess",
        initialSearchValues,
        initialFormValues,
        initialSearchValues,
        controller,
        userData
      )
    );

    if (menuUpdated) {
      setMenuUpdated(false);
    }

    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, [menuUpdated]);

  // useEffect(() => {
  //   if (supportingTable?.Table1)
  //     setMenuListCheckboxes(
  //       supportingTable.Table1.map((item) => {
  //         return {
  //           url: item.Menu_URL,
  //           name: item.Menu_Name,
  //           isChecked: false,
  //           parentId: item.Parent_Id,
  //           menuId: item.MenuId,
  //         };
  //       }),
  //     );
  // }, [supportingTable.Table1]);

  useEffect(() => {
    if (updateId !== null) {
      let objToUpdate = itemList.filter((item) => item.RoleId === updateId)[0];

      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: objToUpdate,
      });

      postRequest(
        "/CrudRoleAccess",
        {
          ...initialFormValues,
          RoleId: updateId,
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

        setMenuListCheckboxes(response.data.DataSet.Table);
      });
    }

    setUpdateId(null);
  }, [updateId]);

  const toggleRoleModal = () => {
    setRoleModal((prevState) => !prevState);
  };
  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleCheckboxChange = (checkType, id, childParentId, value) => {
    let checkedArray_1 = [];
    let checkedArray_2 = [];

    if (!value) {
      if (checkType === "parent") {
        checkedArray_1 = menuListCheckboxes.filter(
          (item) => item.Parent_Id !== id
        );

        checkedArray_2 = checkedArray_1.filter((item) => item.MenuId !== id);

        setMenuListCheckboxes(checkedArray_2);
      } else {
        let count = 0;

        menuListCheckboxes.map((item, index) => {
          if (item.Parent_Id === childParentId) {
            count++;
          }
        });

        if (count === 1) {
          checkedArray_1 = menuListCheckboxes.filter(
            (item) => item.MenuId !== childParentId
          );

          checkedArray_2 = checkedArray_1.filter((item) => item.MenuId !== id);

          setMenuListCheckboxes(checkedArray_2);
        } else {
          checkedArray_1 = menuListCheckboxes.filter(
            (item) => item.MenuId !== id
          );

          setMenuListCheckboxes(checkedArray_1);
        }
      }
    } else {
      if (checkType === "parent") {
        supportingTable.Table1.map((item, index) => {
          if (item.Parent_Id === id) {
            checkedArray_1.push({
              MenuId: item.MenuId,
              Parent_Id: item.Parent_Id,
            });
          }
        });

        checkedArray_1.push({ MenuId: id, Parent_Id: null });

        setMenuListCheckboxes(menuListCheckboxes.concat(checkedArray_1));
      } else {
        supportingTable.Table1.map((item, index) => {
          if (item.MenuId === childParentId) {
            checkedArray_1.push({
              MenuId: item.MenuId,
              Parent_Id: item.Parent_Id,
            });
          }
        });

        checkedArray_1.push({ MenuId: id, Parent_Id: childParentId });

        setMenuListCheckboxes(menuListCheckboxes.concat(checkedArray_1));
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.AreaName = searchFields.AreaName.trim();
    dispatch(
      setInitialState(
        "/CrudRoleAccess",
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
      deleteRow("/CrudRoleAccess", { RoleId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();

    dispatch(
      submitForm(
        "/CrudRoleAccess",
        { ...formFields, MenuList: menuListCheckboxes },
        initialFormValues,
        controller,
        userData,
        id,
        () => {
          setMenuListCheckboxes([]);
        }
      )
    );

    closeForm();
  };

  const onFormClose = () => {
    setMenuListCheckboxes([]);
  };

  const onFormOpen = () => {
    postRequest(
      "CrudRoleAccess",
      { ...initialFormValues, RoleId: 1 },
      controller
    ).then((response) => {});
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Role Name"
        name="RoleName"
        size={INPUT_SIZE}
        value={searchFields.RoleName}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table2 || []}
        disabled={!supportingTable?.Table2}
        idName="CompanyId"
        valueName="CompanyName"
        size={INPUT_SIZE}
        name="CompanyId"
        label="Company Name"
        value={searchFields.CompanyId || ""}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Role Name"
        name="RoleName"
        size={INPUT_SIZE}
        disabled={true}
        value={formFields?.RoleName}
        onChange={handleFormChange}
      />
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table2 || []}
        disabled={true}
        idName="CompanyId"
        valueName="CompanyName"
        size={INPUT_SIZE}
        name="CompanyId"
        label="Company Name"
        value={formFields?.CompanyId || ""}
        onChange={handleFormChange}
      />
      <Col span={24}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={5}>Menu's List</Title>
          <FormButton
            title="Add Menu"
            type="primary"
            onClick={toggleRoleModal}
            size={"small"}
          />
        </div>
        <Row style={{ padding: "4px" }}>
          {supportingTable?.Table1?.length > 0 &&
            supportingTable.Table1.map(
              (parentItem, parentIndex) =>
                parentItem.Parent_Id === null && (
                  <>
                    <Col span={24}>
                      <FormCheckbox
                        key={parentIndex}
                        colSpan={24}
                        checked={menuListCheckboxes.find(
                          (item, indx) => item.MenuId === parentItem.MenuId
                        )}
                        name="MenuItem"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "parent",
                            parentItem.MenuId,
                            null,
                            e.value
                          )
                        }
                        label={<b>{parentItem.Menu_Name}</b>}
                      />
                      <Row>
                        {supportingTable.Table1.map(
                          (childItem, childIndex) =>
                            parentItem.MenuId === childItem.Parent_Id && (
                              <Col span={6} style={{ paddingLeft: "50px" }}>
                                <FormCheckbox
                                  key={childIndex}
                                  colSpan={24}
                                  checked={menuListCheckboxes.find(
                                    (item, indx) =>
                                      // item.MenuId === childItem.Parent_Id
                                      //   ? true
                                      //   : item.MenuId === childItem.MenuId
                                      //   ? true
                                      //   : false,
                                      item.MenuId === childItem.MenuId
                                  )}
                                  name="MenuItem"
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "child",
                                      childItem.MenuId,
                                      childItem.Parent_Id,
                                      e.value
                                    )
                                  }
                                  label={childItem.Menu_Name}
                                />
                              </Col>
                            )
                        )}
                      </Row>
                      <br />
                    </Col>
                  </>
                )
            )}
        </Row>
      </Col>
      {/* </div> */}
      <RoleAccessModal
        setMenuUpdated={setMenuUpdated}
        parentList={supportingTable.Table3}
        roleModal={roleModal}
        toggleRoleModal={toggleRoleModal}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Role Access"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="RoleId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Role Access"
      formWidth={"70vw"}
      onFormOpen={onFormOpen}
      onFormClose={onFormClose}
      hideAddButton={true}
    />
  );
};

export default RoleAccess;
