import { Col } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RadioSelectSP from "../../Components/RadioSelectSP";
import { list } from "../../data";
import { removeCharectersAndtoUpperCase } from "../../functionsSP/generalFunctionsSP";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";

const CategoryList = (props) => {
  const posState = useSelector((state) => state.SinglePagePOSReducers);
  const dispatch = useDispatch();

  return (
    <div>
      <Col
        style={{
          display: "flex",
          flexDirection: "Row",
          alignItems: "center",
          flexWrap: "wrap",
          alignSelf: "flex-start",
          // padding: "10px 0px",
        }}
      >
        <RadioSelectSP
          list={list.CategoryList.filter((x) =>
            removeCharectersAndtoUpperCase(x.CategoryName).match(
              removeCharectersAndtoUpperCase(props.categoryName)
            )
          )}
          listId="CategoryId"
          listName="CategoryName"
          onClick={(id) =>
            dispatch({
              type: SP_SET_POS_STATE,
              payload: {
                name: "selectedCategory",
                value: posState.selectedCategory === id ? 0 : id,
              },
            })
          }
          // disabled={props.disabled}
        />
      </Col>
    </div>
  );
};
export default CategoryList;
