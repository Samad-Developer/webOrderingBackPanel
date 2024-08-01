import { Button, Card, Col, message, Row } from "antd";
import React from "react";
import { useState } from "react";
import BulkModal from "./BulkModal";
import { useDispatch } from "react-redux";
import { submitForm } from "../../redux/actions/basicFormAction";
import { useSelector } from "react-redux";
import { postRequest } from "../../services/mainApp.service";
import Title from "antd/lib/typography/Title";
import { IoMdCloudUpload } from "react-icons/io";

const BulkUpload = () => {
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkInventoryModal, setBulkInventoryModal] = useState(false);
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [loading, setLoading] = useState(false);

  //handle bulk upload pos products function
  const handleFormSubmit = (event, file) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("OperationId", 2);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");
    formData.append("File", file, file.name);

    postRequest("BulkUpload", formData).then((res) => {
      if (res.error === true) {
        setLoading(false);
        message.error(res.errorMessage);
        return;
      }
      if (res.data.response === false) {
        setLoading(false);
        message.error(res.DataSet.Table.errorMessage);
        return;
      }

      message.success("Bulk data uploaded successfully!");
      setLoading(false);
      toggleBulkModal();
    });
  };

  //handle bulk upload retail(inventory) products function
  const handleInventoryFormSubmit = (event, file) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("OperationId", 2);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("UserIP", "12.1.1.12");
    formData.append("File", file, file.name);

    postRequest("BulkUploadRetail", formData).then((res) => {
      if (res.error === true) {
        setLoading(false);
        message.error(res.errorMessage);
        return;
      }
      if (res.data.response === false) {
        setLoading(false);
        message.error(res.DataSet.Table.errorMessage);
        return;
      }

      message.success("Bulk data uploaded successfully!");
      setLoading(false);
      toggleBulkInventoryModal();
    });
  };

  const toggleBulkModal = () => {
    setBulkModal(!bulkModal);
  };
  const toggleBulkInventoryModal = () => {
    setBulkInventoryModal(!bulkInventoryModal);
  };

  return (
    <>
      <div style={{ margin: 5 }}>
        <Title level={3} style={{ color: '#4561B9' }}>
          Bulk Uploads
        </Title>
        <div
          style={{
            background: "white",
            padding: 15,
            boxShadow: "0 0 5px lightgray",
            borderRadius: 2,
          }}
        >
          <Row gutter={[8, 8]} style={{ width: "100%", padding: 10 }}>
            {userData?.companyList[0]?.BusinessTypeId === 1 && (
              <Col span={7}>
                <Button
                  type="primary"
                  style={{ width: "100%", height: 200, fontSize: 22 }}
                  onClick={() => setBulkModal(true)}
                >
                  Bulk Upload POS Products
                </Button>
              </Col>
            )}
            <Col span={7}>
              <Button
                type="primary"
                style={{ width: "100%", height: 200, fontSize: 22 }}
                onClick={() => setBulkInventoryModal(true)}
              // icon={<IoMdCloudUpload className="blueIcon" />}
              >
                Bulk Upload Inventory Products
              </Button>
            </Col>
          </Row>
        </div>
        <BulkModal
          title="Bulk Upload POS Products"
          isModalVisible={bulkModal}
          handleCancel={toggleBulkModal}
          width={"40vw"}
          handleOk={handleFormSubmit}
          isLoading={loading}
          sampleFileURL="/UploadFiles/BulkUploadSampleFile.xlsx"
        />
        <BulkModal
          title="Bulk Upload Inventory Products"
          isModalVisible={bulkInventoryModal}
          handleCancel={toggleBulkInventoryModal}
          width={"40vw"}
          handleOk={handleInventoryFormSubmit}
          isLoading={loading}
          sampleFileURL="/UploadFiles/BulkUploadInventorySampleFile.xlsx"
        />
      </div>
    </>
  );
};

export default BulkUpload;
