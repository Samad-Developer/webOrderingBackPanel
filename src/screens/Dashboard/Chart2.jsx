import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";

const Chart2 = ({ chartData }) => {
  const data = [
    {
      type: "Dine In",
      sales: 38
    },
    {
      type: "Takeaway",
      sales: 52
    },
    {
      type: "Delivery",
      sales: 61
    }
  ];
  const paletteSemanticRed = "#F4664A";
  const brandColor = "#5B8FF9";
  const config = {
    // chartData,
    data,
    style: {
      height: "28vh"
    },
    xField: "type",
    yField: "sales",
    seriesField: "type",
    color: ["#62DAAB", "#F4664A", "#4561B9"],
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6
      }
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false
      }
    },
    meta: {
      type: {
        alias: "dsfsdfsd"
      },
      sales: {
        alias: "sales"
      }
    }
  };
  return <Column {...config} />;
};

export default Chart2;
