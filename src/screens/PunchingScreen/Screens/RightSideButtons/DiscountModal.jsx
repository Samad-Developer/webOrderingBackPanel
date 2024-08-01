import { Button, Col, Radio, Space } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalComponent from "../../Components/ModalComponent";
import { list } from "../../data";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";

export const DiscountModal = (props) => {
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const { DiscountProductMappingList, DiscountTypeList } = list;
  const { isModalVisible, handleCancel } = props;

  const removeDiscount = () => {
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "selectedDiscount",
        value: [],
      },
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "DiscountId",
        value: null,
      },
    });
    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "DiscountPercent",
        value: 0,
      },
    });
    posState.productCart.map((cartItem) => {
      cartItem.DiscountPercent = 0;
      cartItem.DiscountAmount = 0;
    });
  };

  const applyDiscountSubmit = () => {
    posState.productCart.map((cartItem) => {
      posState.selectedDiscount.map((dis) => {
        if (cartItem.ProductDetailId === dis.ProductDetailId) {
          cartItem.DiscountPercent = dis.DiscountPercent;
          const initialDAmount =
            dis.IsPercentage === true
              ? (cartItem.PriceWithoutGST * dis.DiscountPercent) / 100
              : dis.DiscountPercent;

          const DAmount = cartItem.Quantity * initialDAmount;

          cartItem.DiscountAmount = DAmount;
        }
      });
    });
    let dAmt = posState.productCart.reduce((prev, next) => {
      return prev + next.DiscountAmount;
    }, 0);

    let woGst = posState.productCart.reduce((prev, next) => {
      return prev + parseFloat(next.PriceWithoutGST);
    }, 0);

    dispatch({
      type: SP_SET_POS_STATE,
      payload: {
        name: "prices",
        value: {
          ...posState.prices,
          discountAmt: dAmt,
          // withGst: parseFloat(woGst) + parseFloat(posState.prices.gst),
        },
      },
    });
    handleCancel();
  };
  return (
    <div>
      <ModalComponent
        title="Apply Discount"
        isModalVisible={isModalVisible}
        handleOk={applyDiscountSubmit}
        handleCancel={handleCancel}
      >
        <Col
          style={{
            display: "flex",
            flexDirection: "Row",
            alignItems: "center",
            flexWrap: "wrap",
            alignSelf: "flex-start",
            padding: "10px 0px",
          }}
        >
          {DiscountTypeList.length > 0 ? (
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={posState.DiscountId}
            >
              <Space direction="vertical">
                {DiscountTypeList.map((item, index) => (
                  <Radio
                    key={index}
                    onChange={() => {
                      const foundDiscount = DiscountProductMappingList?.filter(
                        (discount) => {
                          return (
                            discount.DiscountId === item.DiscountId && discount
                          );
                        }
                      );
                      dispatch({
                        type: SP_SET_POS_STATE,
                        payload: {
                          name: "selectedDiscount",
                          value: foundDiscount,
                        },
                      });
                      dispatch({
                        type: SP_SET_POS_STATE,
                        payload: {
                          name: "DiscountId",
                          value: item.DiscountId,
                        },
                      });
                      dispatch({
                        type: SP_SET_POS_STATE,
                        payload: {
                          name: "DiscountPercent",
                          value: foundDiscount[0].DiscountPercent,
                        },
                      });
                    }}
                    value={item.DiscountId}
                  >
                    {item.DiscountName}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          ) : (
            <div></div>
          )}
        </Col>
        <Col>
          <Button onClick={removeDiscount}>Remove Discount</Button>
        </Col>
      </ModalComponent>
    </div>
  );
};
