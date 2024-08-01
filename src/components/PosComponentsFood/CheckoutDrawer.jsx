import { CloseOutlined, SaveFilled } from "@ant-design/icons";
import { Button, Space } from "antd";
import React, { useRef } from "react";
import { Fragment } from "react";
import { BUTTON_SIZE } from "../../common/ThemeConstants";
import FormButton from "../general/FormButton";
import FormContainer from "../general/FormContainer";
import FormDrawer from "../general/FormDrawer";

const CheckoutDrawer = React.forwardRef((props, ref) => {
  const {
    visible,
    closeForm,
    formWidth,
    formPanel,
    disableForm,
    handleFormSubmit,
    formLoading,
  } = props;

  const formInnerComponent = (
    <>
      <div className="formDrawerHeader">
        <h2>{"Bill Payment Options"}</h2>
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
          <FormButton
            type="primary"
            icon={<SaveFilled />}
            size={BUTTON_SIZE}
            // color="green"
            colSpan={2}
            htmlType="submit"
            loading={formLoading}
            // disabled={disableSaveAndSubmit}
            ref={ref}
            title="Complete"
          />
        </Space>
      </div>
      <div className="formDrawerBody checkoutformBody">{formPanel}</div>
    </>
  );

  return (
    <Fragment>
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
    </Fragment>
  );
});

export default CheckoutDrawer;
