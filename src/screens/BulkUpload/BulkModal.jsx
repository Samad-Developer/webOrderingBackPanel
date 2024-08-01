import { Button, Input, Spin, Typography, Upload } from "antd";
import React, { useState } from "react";
import ModalComponent from "../../components/formComponent/ModalComponent";
import { CloudDownloadOutlined, InboxOutlined } from "@ant-design/icons";
const { Dragger } = Upload;

export default function BulkModal(props) {
  const [file, setFile] = useState("");

  const { isModalVisible, handleOk, handleCancel, title, width, isLoading, sampleFileURL } =
    props;
  // const draggerProps = {
  //   name: "file",
  //   multiple: false,
  //   // action: ",

  //   onChange(info) {
  //     console.log("fileeeeeeeee:", info.file);
  //     const { status } = info.file;

  //     if (status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }

  //     if (status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully.`);
  //     } else if (status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },

  //   onDrop(e) {
  //     console.log("Dropped files", e.dataTransfer.files);
  //   },
  // };
  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <ModalComponent
      title={title}
      isModalVisible={isModalVisible}
      handleOk={(event) => handleOk(event, file)}
      handleCancel={handleCancel}
      width={width}
    >

      {isLoading && (
        <Spin style={{ display: "flex", justifyContent: "center" }} />
      )}
      <div>
        <Button
          type="primary"
          icon={<CloudDownloadOutlined />}
          style={{ marginBottom: 20 }}
          onClick={() =>
            (window.location.href =
              process.env.REACT_APP_BASEURL +
              sampleFileURL)
          }
        >
          Download Sample File
        </Button>
      </div>
      <Input
        type="file"
        multiple={false}
        onChange={handleChange}
        title="choose file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </ModalComponent>
  );
}
