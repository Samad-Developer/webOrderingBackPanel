import { Drawer } from 'antd';
import { bool, element, func, string } from 'prop-types';
import React from 'react';

const FormDrawer = (props) => {
  const {
    visible,
    title,
    width,
    placement = 'right',
    formComponent,
    extraComponent,
    onClose,
    getContainer = true,
    closable = false,
    className,
    maskClosable = true,
    destroyOnClose = true,
  } = props;

  return (
    <Drawer
      closable={closable}
      title={title}
      placement={placement}
      width={width || 800}
      onClose={onClose}
      visible={visible}
      extra={extraComponent}
      style={{
        overflow: 'auto',
        position: getContainer === false ? 'absolute !important' : null,
      }}
      getContainer={getContainer}
      className={className}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}>
      {formComponent}
    </Drawer>
  );
};

FormDrawer.propTypes = {
  visible: bool,
  title: string,
  width: string,
  placement: string,
  formComponent: element,
  extraComponent: element,
  onClose: func,
  closable: bool,
  getContainer: bool,
  className: string,
  maskClosable: bool,
  destroyOnClose: bool,
};

export default FormDrawer;
