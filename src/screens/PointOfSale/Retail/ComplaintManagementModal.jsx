import { Col, Row, Input, Card, Table, message, Button } from "antd";
import React, { useEffect, useState } from "react";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import { getDate, getDateTime } from "../../../functions/dateFunctions";
// import { getDateTime } from "../../../components/functions/dateFunctions";

const initialFormFields = {
  OrderMasterId: null,
  ComplainMasterId: null,
  ComplainStatusId: null,
  ComplainTypeId: null,
  ComplainCategoryId: null,
  Remarks: "",
};

export default function ComplaintManagementModal(props) {
  const isLaunchComplaint = props.hasOwnProperty("selectedOrder");
  const { TextArea } = Input;
  const [formFields, setFormFields] = useState(initialFormFields);

  useEffect(() => {
    setFormFields({ ...formFields });
    if (isLaunchComplaint) {
      const { selectedOrder } = props;
      const { OrderMasterId } = selectedOrder;
      setFormFields({ ...formFields, OrderMasterId: OrderMasterId });
    }
    if (!isLaunchComplaint) {
      let launchModalData = props.modalData;
      setFormFields({
        ...formFields,
        OrderNumber: launchModalData.OrderNumber,
        OrderMasterId: launchModalData.OrderMasterId,
        ComplainCategoryId: launchModalData.ComplainCategoryId,
        ComplainTypeId: launchModalData.ComplainTypeId,
        ComplainMasterId: launchModalData.ComplainMasterId,
      });
    }
  }, []);

  if (isLaunchComplaint) {
    //when we launch  a complain from odms
    const { complaintTypes, complaintCategories } = props;
    const { selectedOrder } = props;
    const { OrderMasterId } = selectedOrder;

    return (
      <ModalComponent
        title="Launch Complaint"
        isModalVisible={props.isModalVisible}
        handleCancel={props.closeModal}
        handleOk={() =>
          props.saveComplaint({
            ...formFields,
            OrderMasterId: OrderMasterId,
          })
        }
        width="80vw"
        okText="Add"
        cancelText="Close"
        closable={true}
      >
        <form
          onSubmit={() =>
            props.saveComplaint({
              ...formFields,
              OrderMasterId: OrderMasterId,
            })
          }
        >
          <Card title="Order Details" style={{ width: "100%" }}>
            <Row gutter={[8, 8]} style={{ width: "100%", marginTop: "20" }}>
              <Col span={4}>
                <FormTextField
                  label="Order No"
                  value={
                    selectedOrder.OrderNumber ? selectedOrder.OrderNumber : null
                  }
                  disabled
                  style={{ color: "black" }}
                />
              </Col>
              <Col span={4}>
                <FormTextField
                  label="Branch"
                  value={
                    selectedOrder.BranchName ? selectedOrder.BranchName : ""
                  }
                  disabled
                  style={{ color: "black" }}
                />
              </Col>
              <Col span={4}>
                <FormTextField
                  label="Customer Name"
                  value={
                    selectedOrder.CustomerName ? selectedOrder.CustomerName : ""
                  }
                  disabled
                  style={{ color: "black" }}
                />
              </Col>
              <Col span={4}>
                <FormTextField
                  label="Phone"
                  value={
                    selectedOrder.PhoneNumber ? selectedOrder.PhoneNumber : ""
                  }
                  disabled
                  style={{ color: "black" }}
                />
              </Col>

              <Col span={4}>
                <FormTextField
                  label="Delivery Date Time"
                  value={
                    selectedOrder.OrderDeliveryDateTime
                      ? selectedOrder.OrderDeliveryDateTime
                      : ""
                  }
                  disabled
                  style={{ color: "black" }}
                />
              </Col>
              <Col span={4}>
                <FormTextField
                  label="Delivery Time (Mins)"
                  value={
                    selectedOrder.DeliveryTime ? selectedOrder.DeliveryTime : ""
                  }
                  disabled
                  style={{ color: "black" }}
                />
              </Col>
              <Col span={4}>
                <FormTextField
                  label="Special Instruction"
                  value={
                    selectedOrder.SpecialInstruction === ""
                      ? "No Specail instruction"
                      : selectedOrder.SpecialInstruction
                  }
                  disabled
                  style={{ color: "black" }}
                />
              </Col>
              <Col span={4}>
                <FormTextField
                  label="Status"
                  value={selectedOrder.OrderStatus}
                  disabled
                  style={{ color: "black" }}
                />
              </Col>
            </Row>
          </Card>

          <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
            <Col span={4}>
              <FormSelect
                listItem={complaintTypes || []}
                idName="SetupDetailId"
                valueName="SetupDetailName"
                size={INPUT_SIZE}
                name="SetupDetailId"
                label="Complaint Type"
                value={formFields.ComplainTypeId}
                onChange={(e) => {
                  setFormFields({ ...formFields, ComplainTypeId: e.value });
                }}
                required
              />
            </Col>
            <Col span={4}>
              <FormSelect
                listItem={
                  complaintCategories
                    ? complaintCategories.filter(
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
                onChange={(e) =>
                  setFormFields({
                    ...formFields,
                    ComplainCategoryId: e.value,
                  })
                }
                required
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <TextArea
              rows={4}
              placeholder="Enter complaint Message here!"
              value={formFields.Remarks}
              onChange={(e) =>
                setFormFields({ ...formFields, Remarks: e.target.value })
              }
              required
            />
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Button onClick={props.closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save Complain
            </Button>
          </div>
        </form>
      </ModalComponent>
    );
  } else {
    // true when we edit a complaint from complaint page
    const complaintStatusCols = [
      {
        title: "Complaint Launch Date",
        dataIndex: "CreatedDate",
        key: "createdDate",
        render: (i, record) => getDate(record.CreatedDate),
      },
      {
        title: "Complaint Status",
        dataIndex: "ComplainStatusName",
        key: "complainStatusName",
      },
      {
        title: "Complaint Remarks",
        dataIndex: "Remarks",
        key: "Remarks",
      },
    ];
    const {
      modalData,
      complainTypeDropDownData,
      complainCatDropDownData,
      complainStatusHistory,
      complaintStatusDropDownData,
    } = props;

    const { OrderMasterId, ComplainMasterId } = modalData;
    const filteredComplainStatusHistory = complainStatusHistory.filter(
      (data) => data.ComplainMasterId === ComplainMasterId
    );

    return (
      <ModalComponent
        title="Edit Complaint"
        isModalVisible={props.isModalVisible}
        handleOk={() => props.saveComplaint(formFields)}
        handleCancel={props.closeModal}
        width="80vw"
        okText="Save"
        cancelText="Close"
        closable={true}
      >
        <div>
          {OrderMasterId !== null && (
            <Row gutter={[8, 8]} style={{ width: "100%", marginTop: "20" }}>
              <Col span={4}>
                <FormTextField label="Order No" value={modalData.OrderNumber} />
              </Col>
            </Row>
          )}
          <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
            <Col span={4}>
              <FormSelect
                label="Complaint Type"
                value={modalData.ComplainTypeId}
                listItem={complainTypeDropDownData}
                idName="SetupDetailId"
                valueName="SetupDetailName"
                size={INPUT_SIZE}
                name="SetupDetailId"
                onChange={(e) => e.value}
                disabled={true}
              />
            </Col>

            <Col span={4}>
              <FormSelect
                listItem={complainCatDropDownData.filter(
                  (category) =>
                    category.ComplainTypeId === modalData.ComplainTypeId
                )}
                idName="ComplainCategoryId"
                valueName="ComplainCategoryName"
                size={INPUT_SIZE}
                name="ComplainCategoryId"
                label="Complaint Cateogry"
                value={modalData.ComplainCategoryId}
                required={true}
                disabled={true}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Table
                columns={complaintStatusCols}
                dataSource={filteredComplainStatusHistory}
                pagination={false}
              />
            </Col>
          </Row>

          <Row gutter={[8, 8]} style={{ marginTop: 10, alignItems: "center" }}>
            <Col span={4}>
              <FormSelect
                label="Complaint Status"
                listItem={complaintStatusDropDownData}
                idName="ComplainStatusId"
                valueName="ComplainStatusName"
                size={INPUT_SIZE}
                name="ComplainStatusId"
                value={formFields.ComplainStatusId}
                onChange={(e) => {
                  setFormFields({ ...formFields, ComplainStatusId: e.value });
                }}
                required={true}
              />
            </Col>
            <Col span={20}>
              <TextArea
                placeholder="Remarks"
                style={{ width: 500, marginTop: 40 }}
                onChange={(e) => {
                  setFormFields({ ...formFields, Remarks: e.target.value });
                }}
                required={true}
              />
            </Col>
          </Row>
        </div>
      </ModalComponent>
    );
  }
}
