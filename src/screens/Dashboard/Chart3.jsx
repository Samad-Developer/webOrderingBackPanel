import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';

const Chart3 = () => {
  const data = [
        {
          "date": "2018/8/1",
          "type": "ODMS",
          "value": 4623
        },
        {
          "date": "2018/8/1",
          "type": "Web Ordering",
          "value": 2208
        },
        {
          "date": "2018/8/1",
          "type": "Mob App",
          "value": 182
        },
        {
          "date": "2018/8/2",
          "type": "ODMS",
          "value": 6145
        },
        {
          "date": "2018/8/2",
          "type": "Web Ordering",
          "value": 2016
        },
        {
          "date": "2018/8/2",
          "type": "Mob App",
          "value": 257
        },
        {
          "date": "2018/8/3",
          "type": "ODMS",
          "value": 508
        },
        {
          "date": "2018/8/3",
          "type": "Web Ordering",
          "value": 2916
        },
        {
          "date": "2018/8/3",
          "type": "Mob App",
          "value": 289
        },
        {
          "date": "2018/8/4",
          "type": "ODMS",
          "value": 6268
        },
        {
          "date": "2018/8/4",
          "type": "Web Ordering",
          "value": 4512
        },
        {
          "date": "2018/8/4",
          "type": "Mob App",
          "value": 428
        },
        {
          "date": "2018/8/5",
          "type": "ODMS",
          "value": 6411
        },
        {
          "date": "2018/8/5",
          "type": "Web Ordering",
          "value": 8281
        },
        {
          "date": "2018/8/5",
          "type": "Mob App",
          "value": 619
        },
        {
          "date": "2018/8/6",
          "type": "ODMS",
          "value": 1890
        },
        {
          "date": "2018/8/6",
          "type": "Web Ordering",
          "value": 2008
        },
        {
          "date": "2018/8/6",
          "type": "Mob App",
          "value": 87
        },
        {
          "date": "2018/8/7",
          "type": "ODMS",
          "value": 4251
        },
        {
          "date": "2018/8/7",
          "type": "Web Ordering",
          "value": 1963
        },
        {
          "date": "2018/8/7",
          "type": "Mob App",
          "value": 706
        },
        {
          "date": "2018/8/8",
          "type": "ODMS",
          "value": 2978
        },
        {
          "date": "2018/8/8",
          "type": "Web Ordering",
          "value": 2367
        },
        {
          "date": "2018/8/8",
          "type": "Mob App",
          "value": 387
        },
        {
          "date": "2018/8/9",
          "type": "ODMS",
          "value": 3880
        },
        {
          "date": "2018/8/9",
          "type": "Web Ordering",
          "value": 2956
        },
        {
          "date": "2018/8/9",
          "type": "Mob App",
          "value": 488
        },
        {
          "date": "2018/8/10",
          "type": "ODMS",
          "value": 3606
        },
        {
          "date": "2018/8/10",
          "type": "Web Ordering",
          "value": 678
        },
        {
          "date": "2018/8/10",
          "type": "Mob App",
          "value": 507
        },
        {
          "date": "2018/8/11",
          "type": "ODMS",
          "value": 4311
        },
        {
          "date": "2018/8/11",
          "type": "Web Ordering",
          "value": 3188
        },
        {
          "date": "2018/8/11",
          "type": "Mob App",
          "value": 548
        },
        {
          "date": "2018/8/12",
          "type": "ODMS",
          "value": 4116
        },
        {
          "date": "2018/8/12",
          "type": "Web Ordering",
          "value": 3491
        },
        {
          "date": "2018/8/12",
          "type": "Mob App",
          "value": 456
        },
        {
          "date": "2018/8/13",
          "type": "ODMS",
          "value": 6419
        },
        {
          "date": "2018/8/13",
          "type": "Web Ordering",
          "value": 2852
        },
        {
          "date": "2018/8/13",
          "type": "Mob App",
          "value": 689
        },
        {
          "date": "2018/8/14",
          "type": "ODMS",
          "value": 1643
        },
        {
          "date": "2018/8/14",
          "type": "Web Ordering",
          "value": 4788
        },
        {
          "date": "2018/8/14",
          "type": "Mob App",
          "value": 280
        },
        {
          "date": "2018/8/15",
          "type": "ODMS",
          "value": 445
        },
        {
          "date": "2018/8/15",
          "type": "Web Ordering",
          "value": 4319
        },
        {
          "date": "2018/8/15",
          "type": "Mob App",
          "value": 176
        }
      ];

  const config = {
    data,
    style: {
        height: "28vh",
    },
    xField: 'date',
    yField: 'value',
    yAxis: {
      label: {
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    seriesField: 'type',
    color: ({ type }) => {
      return type === 'Web Ordering' ? '#F4664A' : type === 'ODMS' ? '#30BF78' : '#4561B9';
    },
    lineStyle: ({ type }) => {
      if (type === 'Web Ordering') {
        return {
        //   lineDash: [4, 4],
          opacity: 1,
        };
      }

      return {
        opacity: 0.5,
      };
    },
  };

  return <Line {...config} />;
};

export default Chart3;
