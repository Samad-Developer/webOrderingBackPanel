import { Row } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RadioSelect from "../../../components/PosComponents/RadioSelect";
import { SET_POS_STATE } from "../../../redux/reduxConstants";

const TableSlot = (props) => {
  const [selectedTables, setSelectedTables] = useState([]);
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.PointOfSaleReducer);

  const toggleTables = (tableId, tableName) => {
    let val = selectedTables.includes(tableId);
    if (val === true) {
      let index = selectedTables.findIndex((x) => x === tableId);
      selectedTables.splice(index, 1);
    } else selectedTables.push(tableId);
    setSelectedTables([...selectedTables]);

    if (posState.tableId === tableId) {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "tableId",
          value: null,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "tableName",
          value: null,
        },
      });
    } else {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "tableId",
          value: tableId,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "tableName",
          value: tableName,
        },
      });
    }
  };
  return (
    <div style={{ borderTop: "1px solid #d9d9d9", padding: "10px 20px" }}>
      <Title level={3} style={{ color: "#336fc4e0" }}>
        Select Table
      </Title>

      <Row gutter={[10, 8]}>
        <RadioSelect
          list={props.tables}
          listId="TableId"
          listName="TableName"
          onClick={toggleTables}
          disabled={props.disabled}
        />
        {/* {calcBtnTxt.map((item, index) => (
          <Col key={index}>
            <Button
              style={buttonStyle}
              type={selectedTables.includes(item.id) && "primary"}
              onClick={() =>
                toggleTables(item.id, selectedTables.includes(item.id))
              }
            >
              {item.name}
            </Button>
          </Col>
        ))} */}
      </Row>
    </div>
  );
};

export default TableSlot;
