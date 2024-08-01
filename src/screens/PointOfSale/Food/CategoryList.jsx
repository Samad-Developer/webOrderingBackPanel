import { Col } from "antd";
import React, { Fragment, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import FormTextField from "../../../components/general/FormTextField";
import RadioSelect from "../../../components/PosComponentsFood/RadioSelect";
import { removeCharectersAndtoUpperCase } from "../../../functions/generalFunctions";
import { SET_POS_STATE } from "../../../redux/reduxConstants";

const CategoryList = () => {
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");

  return (
    <Fragment>
      <div style={{ padding: "20px 5px 20px 20px" }}>
        <Col>
          <FormTextField
            value={categoryName}
            onChange={(e) => setCategoryName(e.value)}
            size="large"
            prefix={<MdSearch />}
            autoComplete="off"
            placeholder="Search Category"
          />
        </Col>
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
          <RadioSelect
            list={posState.punchScreenData.Table1.filter((x) =>
              removeCharectersAndtoUpperCase(x.CategoryName).match(
                removeCharectersAndtoUpperCase(categoryName)
              )
            )}
            listId="CategoryId"
            listName="CategoryName"
            onClick={(id) =>
              dispatch({
                type: SET_POS_STATE,
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
    </Fragment>
  );
};

export default CategoryList;
