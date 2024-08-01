import { EditFilled, EditOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormButton from "../../components/general/FormButton";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import {
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../redux/actions/basicFormAction";
import {
  RESET_FORM_FIELD,
  SET_SUPP_TABLES_TABLE,
  UPDATE_FORM_FIELD,
} from "../../redux/reduxConstants";
import { postRequest } from "../../services/mainApp.service";
import ComplaintManagementModal from "../PointOfSale/Food/ComplaintManagementModal";

const initialFormValues = {
  OrderMasterId: null,
  ComplainMasterId: null,
  ComplainStatusId: null,
  ComplainTypeId: null,
  ComplainCategoryId: null,
  Remarks: "",
};

const initialSearchValues = {
  // OrderMasterId: null,
  ComplainNumber: null,
  ComplainMasterId: null,
  ComplainStatusId: null,
  ComplainTypeId: null,
  ComplainCategoryId: null,
  Remarks: "",
};

const ComplaintManagement = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.authReducer);
  const [complainModalRowData, setComplainModalRowData] = useState({});
  const [complainTypeDropDownData, setComplainTypeDropDownData] = useState([]);
  const [complainCatDropDownData, setComplainCatDropDownData] = useState([]);
  const [complainStatusHistory, setComplainStatusHistory] = useState([]);
  const [complaintStatusDropDownData, setComplaintStatusDropDownData] =
    useState([]);
  const [updateId, setUpdateId] = useState(null);
  const controller = new window.AbortController();
  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const editComplaint = (record) => {
    setComplainModalRowData(record);
    setComplainTypeDropDownData(supportingTable.Table2);
    setComplainCatDropDownData(supportingTable.Table1);
    setComplainStatusHistory(supportingTable.Table3);
    setComplaintStatusDropDownData(supportingTable.Table4);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const saveComplaint = (editedFields) => {
    if (editedFields.ComplainStatusId === null || editedFields.Remarks === "") {
      message.error("Complaint status Or remarks cant be empty");
      return;
    }

    postRequest(
      "/CrudComplain",
      {
        ...editedFields,
        OperationId: 3,
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
      dispatch({
        type: RESET_FORM_FIELD,
        payload: { initialValue: {}, listItem: response.data.DataSet.Table1 },
      });
      updateSuppTable(response.data.DataSet);
    });

    setIsModalVisible(false);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudComplain",
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
        payload: itemList.filter(
          (item) => item.ComplainMasterId === updateId
        )[0],
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleComplainTypeChange = (data) => {
    dispatch(setSearchFieldValue(data));
    dispatch(setSearchFieldValue({ name: "ComplainCategoryId", value: null }));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.ComplainNumber = searchFields.ComplainNumber.trim();
    dispatch(
      setInitialState(
        "/CrudComplain",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const updateSuppTable = (dataset) => {
    dispatch({
      type: SET_SUPP_TABLES_TABLE,
      payload: { name: "Table3", value: dataset.Table4 },
    });
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudComplain",
        formFields,
        initialFormValues,
        controller,
        userData,
        id,
        updateSuppTable
      )
    );
    closeForm();
  };

  const cols = [
    {
      title: "Complaint Number",
      dataIndex: "ComplainNumber",
      key: "complainNumber",
    },
    {
      title: "Complaint Type",
      dataIndex: "ComplainType",
      key: "complainType",
    },
    {
      title: "Complaint Category",
      dataIndex: "ComplainCategoryName",
      key: "complainCategoryName",
    },

    {
      title: "Complaint Status",
      dataIndex: "ComplainStatusName",
      key: "complainStatusName",
    },
    {
      title: "Edit",
      dataIndex: "Edit",
      render: (i, record) => {
        return (
          <Button
            type="text"
            icon={<EditFilled className="blueIcon" />}
            onClick={() => editComplaint(record)}
          />
        );
      },
    },
  ];

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable ? supportingTable.Table2 : []}
        idName="SetupDetailId"
        valueName="SetupDetailName"
        size={INPUT_SIZE}
        name="ComplainTypeId"
        label="Complaint Type"
        defaultValue={searchFields.ComplainTypeId}
        value={searchFields.ComplainTypeId}
        onChange={handleComplainTypeChange}
      />

      <FormSelect
        colSpan={4}
        listItem={
          supportingTable.Table1
            ? supportingTable.Table1.filter(
                (category) =>
                  category.ComplainTypeId === searchFields.ComplainTypeId
              )
            : []
        }
        idName="ComplainCategoryId"
        valueName="ComplainCategoryName"
        size={INPUT_SIZE}
        name="ComplainCategoryId"
        label="Complaint Cateogry"
        value={searchFields.ComplainCategoryId}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Complaint Number"
        name="ComplainNumber"
        size={INPUT_SIZE}
        value={searchFields.ComplainNumber}
        onChange={handleSearchChange}
      />

      {isModalVisible && (
        <ComplaintManagementModal
          isModalVisible={isModalVisible}
          closeModal={closeModal}
          saveComplaint={saveComplaint}
          modalData={complainModalRowData}
          complainTypeDropDownData={complainTypeDropDownData}
          complainCatDropDownData={complainCatDropDownData}
          complainStatusHistory={complainStatusHistory}
          complaintStatusDropDownData={complaintStatusDropDownData}
        />
      )}
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={12}
        listItem={supportingTable ? supportingTable.Table2 : []}
        idName="SetupDetailId"
        valueName="SetupDetailName"
        size={INPUT_SIZE}
        name="ComplainTypeId"
        label="Complaint Type"
        value={formFields.ComplainTypeId}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        colSpan={12}
        listItem={
          supportingTable.Table1
            ? supportingTable.Table1.filter(
                (category) =>
                  category.ComplainTypeId === formFields.ComplainTypeId
              )
            : []
        }
        idName="ComplainCategoryId"
        valueName="ComplainCategoryName"
        size={INPUT_SIZE}
        name="ComplainCategoryId"
        label="Complaint Cateogry"
        value={formFields.ComplainCategoryId}
        onChange={handleFormChange}
        required={true}
      />

      <FormTextField
        placeholder="Enter complaint message here!"
        label="Complaint message"
        required={true}
        value={formFields.Remarks}
        onChange={handleFormChange}
        name="Remarks"
        colSpan={24}
      />
      {/* <TextArea
        placeholder="Enter complaint message here!"
        label="Complaint message"
        required={true}
        rows={7}
        value={formFields.Remarks}
        onChange={handleFormChange}
        name="Remarks"
      /> */}
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Complaint Management"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableColumn={cols}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default ComplaintManagement;
