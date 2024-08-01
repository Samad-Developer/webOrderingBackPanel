import { message } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormTextField from "../../../components/general/FormTextField";
import RadioSelect from "../../../components/PosComponentsFood/RadioSelect";

const ToppingModal = (props) => {
  const { visible, toggleVisible, handleSubmit } = props;
  const posState = useSelector((state) => state.PointOfSaleReducer);

  const [data, setData] = useState({ Quantity: 1 });

  const submitModal = () => {
    if (data.Quantity === null) {
      message.error("Please select Quantity First");
      return;
    }
    if (
      posState.punchScreenData.Table7.filter(
        (x) => x.SizeId === posState.selectedSizeId
      ).length === 0 ||
      data.SizeId === undefined
    ) {
      message.error("Select a Topping First");
      return;
    }
    handleSubmit({ ...data, Price: data.Price });
    toggleVisible();
  };

  return (
    <ModalComponent
      title="Toppings"
      isModalVisible={visible}
      handleCancel={toggleVisible}
      handleOk={submitModal}
      destroyOnClose={true}
    >
      <FormTextField
        name="Quantity"
        isNumber="true"
        label="Topping Quantity"
        value={data.Quantity}
        onChange={(e) => setData({ ...data, Quantity: e.value.toString() })}
      />
      <RadioSelect
        list={posState.punchScreenData.Table7.filter(
          (x) => x.SizeId === posState.selectedSizeId
        )}
        listId="ProductDetailId"
        listName="ProductDetailName"
        onClick={(id) => {
          setData({
            ...data,
            ...posState.punchScreenData.Table7.filter(
              (x) => x.ProductDetailId === id
            )[0],
          });
        }}
      />
    </ModalComponent>
  );
};

export default ToppingModal;
