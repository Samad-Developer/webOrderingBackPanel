import { Modal } from "antd";
import { any } from "prop-types";
import { bool, func, object, string } from "prop-types";
import React from "react";

const ModalComponent = (props) => {
  const {
    isModalVisible,
    handleOk,
    handleCancel,
    title,
    children,
    okText,
    cancelText,
    closable = false,
    width,
    destroyOnClose = true,
    style,
    footer,
    maskClosable = false,
    centered = true,
  } = props;
  return (
    <Modal
      style={style}
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText={cancelText}
      okText={okText}
      closable={closable}
      width={width}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      footer={footer}
      centered={centered}
    >
      {children}
    </Modal>
  );
};

ModalComponent.propTypes = {
  isModalVisible: bool,
  closable: bool,
  handleOk: func,
  handleCancel: func,
  title: string,
  okText: string,
  style: object,
  cancelText: string,
  width: string,
  destroyOnClose: bool,
  footer: any,
};

export default ModalComponent;
