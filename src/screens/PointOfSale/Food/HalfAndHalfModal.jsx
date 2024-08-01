import { message } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormTextField from "../../../components/general/FormTextField";
import RadioSelect from "../../../components/PosComponentsFood/RadioSelect";

const HalfAndHalfModal = (props) => {
  const { visible, toggleVisible, handleSubmit } = props;
  const posState = useSelector((state) => state.PointOfSaleReducer);

  const [data, setData] = useState({ Quantity: 1 });

  const submitModal = () => {
    if (data.Quantity === null) {
      message.error("Please select Quantity First");
      return;
    }
    if (
      posState.punchScreenData.Table9.filter(
        (x) =>
          x.SizeId === posState.selectedSizeId &&
          x.FlavourId === posState.selectedFlavourId &&
          x.ProductId === posState.selectedProductId
      ).length === 0 ||
      data.SizeId === undefined
    ) {
      message.error("Select a Topping First");
      return;
    }
    handleSubmit({ ...data, Price: data.Quantity * data.Price });
    toggleVisible();
  };

  return (
    <ModalComponent
      title="Half And Half"
      isModalVisible={visible}
      handleCancel={toggleVisible}
      handleOk={submitModal}
      destroyOnClose={true}
    >
      <FormTextField
        name="Quantity"
        isNumber={"true"}
        label="Half Quantity"
        value={data.Quantity}
        onChange={(e) => {
          if (e.value > 0 || e.value == "")
            setData({ ...data, Quantity: e.value.toString() });
          if (e.value < 1) return;
        }}
        type="number"
      />
      <RadioSelect
        list={posState.punchScreenData.Table9.filter(
          (x) =>
            x.SizeId === posState.selectedSizeId &&
            x.FlavourId === posState.selectedFlavourId
        )}
        listId="ProductDetailId"
        listName="ProductDetailName"
        onClick={(id) =>
          setData({
            ...data,
            ...posState.punchScreenData.Table9.filter(
              (x) => x.ProductDetailId === id
            )[0],
          })
        }
      />
    </ModalComponent>
  );
};

export default HalfAndHalfModal;
