import React from "react";
import { Col, Popconfirm, Radio, Row } from "antd";
import PopoverButton from "../../Components/PopoverButton";
// import { BUTTON_SIZE } from "../../common/ThemeConstants";
// import FormButton from "../../components/general/FormButton";
import { list } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import { SP_SET_POS_STATE } from "../../redux/reduxConstantsSinglePagePOS";
import RadioSelectSP from "../../Components/RadioSelectSP";

const TableSlot = () => {
  const { TableList } = list;
  const posState = useSelector((state) => state.SinglePagePOSReducers);

  const dispatch = useDispatch();

  const toggleTableChange = (tableId, tableName) => {
    if (posState.tableId === tableId) {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "tableId",
          value: null,
        },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "tableName",
          value: null,
        },
      });
    } else {
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "tableId",
          value: tableId,
        },
      });
      dispatch({
        type: SP_SET_POS_STATE,
        payload: {
          name: "tableName",
          value: tableName,
        },
      });
    }
  };
  return (
    <div style={{ width: "150px" }}>
      <PopoverButton
        buttonName="Table Slot"
        title={
          <div>
            <h3>Select Table</h3>
            <Row gutter={[10, 8]}>
              <RadioSelectSP
                list={TableList}
                listId="TableId"
                listName="TableName"
                onClick={toggleTableChange}
                disVar={"IsOpen"}
                cond={true}
              />
            </Row>
          </div>
        }
        ifNull={!posState?.tableId}
        // isDisable={OrderModeName !== "Dine-In"}
      />

      <Row>
        <Col span={8}>
          <h3>Table:</h3>
        </Col>
        <Col span={14}>
          <h3> {posState?.tableName} </h3>
        </Col>
      </Row>
    </div>
  );
};

export default TableSlot;
