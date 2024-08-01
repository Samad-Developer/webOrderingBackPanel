import {
  CloseOutlined,
  DeleteFilled,
  EditFilled,
  PlusOutlined,
  SaveFilled,
  SearchOutlined,
  PrinterFilled,
  ClearOutlined,
  SaveOutlined
} from "@ant-design/icons";
import { Button, Popconfirm, Row, Space, Table } from "antd";
import { array, bool, element, func, string } from "prop-types";
import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, TABLE_SIZE } from "../../common/ThemeConstants";
import FormButton from "../general/FormButton";
import FormContainer from "../general/FormContainer";
import FormDrawer from "../general/FormDrawer";
import "./BasicFormComponent.css";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import Title from "antd/lib/typography/Title";

const BasicFormComponent = (props) => {
  const {
    reset,
    handleReset,
    handleSave,
    formTitle,
    searchPanel,
    searchSubmit,
    formPanel,
    tableColumn = [],
    tableRows = [],
    tableLoading = false,
    onFormSave,
    formWidth,
    hideAction = false,
    hideEdit = false,
    hideDelete = false,
    actionID,
    editRow,
    deleteRow,
    formLoading,
    fields,
    onFormClose,
    onUpdate,
    onFormOpen,
    hideAddButton = false,
    hideSearchButton = false,
    crudTitle,
    showSubmit = false,
    submitForm,
    submitFormLoading,
    disableSaveAndSubmit = false,
    disableForm = false,
    report = false,
    viewReport,
    componentRefPrint,
    isCancel = false,
    onCancel,
  } = props;

  const model = useSelector((state) => state.basicFormReducer);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const toggleDrawer = () => {
    setIsUpdate(!isUpdate);
    setVisible(!visible);
  };

  const handleUpdateAction = (id) => {
    editRow && editRow((x) => (x = id));
    toggleDrawer();
  };

  const handleDeleteAction = (id, record) => {
    deleteRow && deleteRow(id, record);
  };

  useEffect(() => {
    !model.formLoading && setVisible(false);
  }, [model.formLoading]);

  useEffect(() => {
    !hideAction &&
      tableColumn &&
      tableColumn.push({
        title: "Action",
        key: "action",
        width: 120,
        render: (record) => {
          return (
            <Space size="middle">
              {!hideEdit && (
                <Button
                  type="text"
                  onClick={() => handleUpdateAction(record[actionID])}
                  icon={<EditFilled className="blueIcon" />}
                ></Button>
              )}
              {!hideDelete && (
                <Popconfirm
                  title="Are you surely want to delete this row?"
                  onConfirm={() => handleDeleteAction(record[actionID], record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    icon={<DeleteFilled className="redIcon" />}
                  ></Button>
                </Popconfirm>
              )}
              {report && (
                <ReactToPrint content={() => componentRefPrint.current}>
                  <PrintContextConsumer>
                    {({ handlePrint }) => (
                      <Button
                        type="text"
                        onClick={() => viewReport(record, handlePrint)}
                        icon={<PrinterFilled className="blueIcon" />}
                      ></Button>
                    )}
                  </PrintContextConsumer>
                </ReactToPrint>
              )}
            </Space>
          );
        },
      });
    return () => {
      tableColumn.pop();
    };
  }, []);

  const handlePagination = (pagination) => {
    // console.log(pagination);
  };

  const closeForm = () => {
    fields &&
      dispatch({
        type: "RESET_FORM_FIELDS",
        payload: { initialValue: fields },
      });
    if (isCancel) onCancel();
    toggleDrawer();
    onFormClose && onFormClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!disableSaveAndSubmit) {
      if (isUpdate) {
        onFormSave(e, 3, isSubmit, closeForm);
        onUpdate && onUpdate();
      } else {
        onFormSave(e, 2, isSubmit, closeForm);
      }
    }
  };

  const formInnerComponent = (
    <>
      <div className="formDrawerHeader">
        <h2>{`${isUpdate ? "Update" : "New"} ${crudTitle ? crudTitle : formTitle
          }`}</h2>
        <Space>
          <FormButton
            title="Cancel"
            type="default"
            color="gray"
            icon={<CloseOutlined />}
            size={BUTTON_SIZE}
            colSpan={2}
            onClick={closeForm}
          />
          {!disableSaveAndSubmit && (
            <>
              <FormButton
                title={isUpdate ? "Update" : "Save"}
                type="primary"
                icon={<SaveFilled />}
                size={BUTTON_SIZE}
                colSpan={2}
                htmlType="submit"
                loading={formLoading}
                disabled={disableSaveAndSubmit}
                onClick={() => {
                  setIsSubmit(false);
                }}
              />
              {showSubmit && (
                <FormButton
                  title={"Submit"}
                  type="default"
                  icon={<SaveFilled />}
                  size={BUTTON_SIZE}
                  colSpan={2}
                  onClick={() => {
                    setIsSubmit(true);
                  }}
                  htmlType="submit"
                  loading={submitFormLoading}
                  disabled={disableSaveAndSubmit}
                />
              )}
            </>
          )}
        </Space>
      </div>
      <div className="formDrawerBody">{formPanel}</div>
    </>
  );

  return (
    <div style={{ margin: 5 }}>
      <Title level={3} style={{ color: "#4561B9" }}>
        {formTitle}
      </Title>
      <div
        style={{
          background: "white",
          padding: 15,
          boxShadow: "0 0 5px lightgray",
          borderRadius: 2,
        }}
      >
        {searchPanel && (
          <FormContainer
            rowStyle={{ alignItems: "flex-end" }}
            onSubmit={searchSubmit}
          >
            {searchPanel}
            {!hideSearchButton && (
              <Fragment>
                <FormButton
                  title="Search"
                  type="primary"
                  size={BUTTON_SIZE}
                  colSpan={2}
                  htmlType="submit"
                  icon={<SearchOutlined />}
                />
                {reset && (
                  <FormButton
                    title="Reset"
                    type="default"
                    size={BUTTON_SIZE}
                    colSpan={2}
                    htmlType="button"
                    onClick={handleReset}
                    style={{ marginLeft: '10px' }}
                    icon={<ClearOutlined />}
                  />
                )}
              </Fragment>

            )}
          </FormContainer>
        )}
        <div
          style={{ margin: "10px 0", borderTop: "1px solid lightgray" }}
        ></div>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          {
            reset && (
              <FormButton
                title="Save"
                type="primary"
                size={BUTTON_SIZE}
                colSpan={2}
                htmlType="button"
                onClick={handleSave}
                icon={<SaveOutlined />}
              />
            )
          }
        </div>
        {formPanel && !hideAddButton && (
          <Row style={{ flexDirection: "row-reverse" }}>
            <FormButton
              type="primary"
              icon={<PlusOutlined />}
              title="Add New"
              size={BUTTON_SIZE}
              color="green"
              onClick={() => {
                onFormOpen && onFormOpen();
                setVisible(true);
                setIsUpdate(false);
              }}
            />
          </Row>
        )}

        {tableColumn && (
          <div style={{ margin: "10px 0" }}>
            <Table
              columns={tableColumn}
              rowKey={(record) => record[actionID]}
              dataSource={tableRows}
              // pagination={{
              //   current: 1,
              //   pageSize: 10,
              //   pageSizeOptions: [10, 20],
              //   showSizeChanger: true,
              // }}
              loading={tableLoading}
              size={TABLE_SIZE}
              onChange={handlePagination}
            // sorter={(a, b) => console.log(a, b)}
            />
          </div>
        )}
      </div>
      <FormDrawer
        visible={visible}
        onClose={closeForm}
        width={formWidth}
        className="formDrawerContainer"
        formComponent={
          disableForm ? (
            formInnerComponent
          ) : (
            <FormContainer
              rowStyle={{ alignItems: "flex-end", paddingTop: 56 }}
              onSubmit={handleFormSubmit}
            >
              {formInnerComponent}
            </FormContainer>
          )
        }
      />
    </div>
  );
};

BasicFormComponent.propTypes = {
  formWidth: string,
  formTitle: string,
  searchPanel: element,
  searchSubmit: func,
  formPanel: element,
  tableLoading: bool,
  tableRows: array,
  tableColumn: array,
  onFormSave: func,
  isCancel: bool,
  onCancel: func,
  hideAction: bool,
  hideEdit: bool,
  hideDelete: bool,
  actionID: string,
  editRow: func,
  deleteRow: func,
  formLoading: bool,
  onUpdate: func,
  onFormClose: func,
  onFormOpen: func,
  hideAddButton: bool,
  crudTitle: string,
  showSubmit: bool,
  submitForm: func,
  submitFormLoading: bool,
  disableSaveAndSubmit: bool,
  disableForm: bool,
  report: bool,
  viewReport: func,
  componentRefPrint: func,
};

export default BasicFormComponent;
