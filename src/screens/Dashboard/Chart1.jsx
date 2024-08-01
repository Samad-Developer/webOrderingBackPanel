import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';

const Chart1 = () => {
    const data = [
        {
            type: '1',
            sales: 38,
        },
        {
            type: '2',
            sales: 52,
        },
        {
            type: '3',
            sales: 61,
        },
        {
            type: '4',
            sales: 125,
        },
        {
            type: '5',
            sales: 48,
        },
        {
            type: '6',
            sales: 38,
        },
        {
            type: '7',
            sales: 50,
        },
        {
            type: '8',
            sales: 38,
        },
        {
            type: '9',
            sales: 62,
        },
        {
            type: '10',
            sales: 72,
        },
        {
            type: '11',
            sales: 25,
        },
        {
            type: '12',
            sales: 90,
        },
        {
            type: '13',
            sales: 83,
        },
        {
            type: '14',
            sales: 38,
        },
    ];
    const config = {
        data,
        style: {
            height: "28vh",
        },
        xField: 'type',
        yField: 'sales',
        seriesField : 'type', 
        color: ['#4561B9'],
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            type: {
                alias: 'dsfsdfsd',
            },
            sales: {
                alias: 'sales',
            },
        },
    };
    return <Column {...config} />;
};

export default Chart1;
