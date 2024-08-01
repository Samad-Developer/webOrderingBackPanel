import { Input, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RadioSelect from "../../../components/PosComponentsFood/RadioSelect";
import { SET_POS_STATE } from "../../../redux/reduxConstants";
import "./style.css";

const WaiterSlot = (props) => {
  const [selectedWaiters, setSelectedWaiters] = useState([]);
  const dispatch = useDispatch();
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const [waiters, setWaiters] = useState([]);

  const toggleWaiters = (waiterId, waiterName) => {
    let val = selectedWaiters.includes(waiterId);
    if (val === true) {
      let index = selectedWaiters.findIndex((x) => x === waiterId);
      selectedWaiters.splice(index, 1);
    } else selectedWaiters.push(waiterId);
    setSelectedWaiters([...selectedWaiters]);

    if (posState.waiterId === waiterId) {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "waiterId",
          value: null,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "waiterName",
          value: null,
        },
      });
    } else {
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "waiterId",
          value: waiterId,
        },
      });
      dispatch({
        type: SET_POS_STATE,
        payload: {
          name: "waiterName",
          value: waiterName,
        },
      });
    }
  };

  return (
    <div
      style={{
        // width: "550px",
        height: "100%",
      }}
    >
      <Title level={3} style={{ color: "#336fc4e0" }}>
        Select Waiter
      </Title>

      <Input
        placeholder="Search Waiters"
        style={{
          height: "40px",
          width: "100%",
          marginBottom: "10px",
        }}
        onChange={(e) =>
          setWaiters(
            props.waiters.filter((item) =>
              item.WaiterName.toLowerCase().includes(
                e.target.value.toLowerCase()
              )
            )
          )
        }
        disabled={props.disabled}
      />

      <Row
        gutter={[10, 8]}
        style={{
          margin: 0,
        }}
      >
        <RadioSelect
          list={props?.waiters}
          listId="WaiterId"
          listName="WaiterName"
          onClick={toggleWaiters}
          disabled={props.disabled}
          noRecordsMsg="No waiters to show"
        />
        {/* {waiters.map((item, index) => (
          <Col key={index} className="waiter-section">
            <Button
              style={style}
              type={selectedWaiters.includes(item.id) && "primary"}
              onClick={() =>
                toggleWaiters(item.id, selectedWaiters.includes(item.id))
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

export default WaiterSlot;
