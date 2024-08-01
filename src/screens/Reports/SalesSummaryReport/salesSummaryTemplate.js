import { Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react';

const salesSummaryTemplate = (data) => {
  const tableCss = { borderCollapse: 'collapse', width: '100%' };

  const thCss = {
    border: '1px solid black',
    padding: '6px 12px',
    display: 'table-cell',
    color: 'black',
  };
  const thCssHead = {
    border: '1px solid black',
    padding: '6px 12px',
    display: 'table-cell',
    background: '#4561b9',
    color: 'white',
    fontWeight: 'bold',
  };
  const headRow = {
    display: 'table-row',
    fontWeight: '900',
    color: '#ffffff',
  };
  return (
    <div style={{ backgroundColor: 'white', width: '100%' }}>
      <table style={tableCss} id="table-to-xls">
        <tr style={{ width: '100%', display: 'table' }}>
          <thead>
            <tr>
              <td colSpan={7}>
                <Title
                  level={4}
                  style={{ textAlign: 'center', fontWeight: 'bold' }}
                >
                  Sales Summary
                </Title>
              </td>
            </tr>
            <tr style={headRow}>
              {Object.keys(data.Table[0]).map((x) => (
                <th style={thCssHead}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.Table2.map((y) => (
              <tr>
                {Object.keys(y).map((x) => (
                  <td style={thCss}>{y[x]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </tr>
        {/* Table 2 /////////////////////////////////// */}
        {data.Table2.length ? (
          <tr style={{ width: '100%', display: 'table' }}>
            <thead>
              <tr>
                <td colSpan={3}>
                  <Title
                    level={4}
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                  >
                    Order Mode Detail
                  </Title>
                </td>
              </tr>
              <tr style={headRow}>
                {Object.keys(data.Table2[0]).map((x) => (
                  <th style={thCssHead}>
                    <b>{x}</b>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.Table2.map((y) => (
                <tr>
                  {Object.keys(y).map((x) => (
                    <td style={thCss}>{y[x]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </tr>
        ) : (
          ''
        )}
        {/* Table 3/////////////////////////////////////// */}
        {data.Table3.length ? (
          <tr style={{ width: '100%', display: 'table' }}>
            <thead>
              <tr>
                <td colSpan={3}>
                  <Title
                    level={4}
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                  >
                    Order Types
                  </Title>
                </td>
              </tr>
              <tr style={headRow}>
                {Object.keys(data.Table3[0]).map((x) => (
                  <th style={thCssHead}>
                    <b>{x}</b>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.Table3.map((y) => (
                <tr>
                  {Object.keys(y).map((x) => (
                    <td style={thCss}>{y[x]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </tr>
        ) : (
          ''
        )}
        {/*Table 4 /////////////////////////////////////// */}
        {data.Table4.length ? (
          <tr style={{ width: '100%', display: 'table' }}>
            <thead>
              <tr>
                <td colSpan={3}>
                  <Title
                    level={4}
                    style={{ textAlign: 'center', fontweight: 'bold' }}
                  >
                    Discount Details
                  </Title>
                </td>
              </tr>
              <tr style={headRow}>
                {Object.keys(data.Table4[0]).map((x) => (
                  <th style={thCssHead}>
                    <b>{x}</b>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.Table4.map((y) => (
                <tr>
                  {Object.keys(y).map((x) => (
                    <td style={thCss}>{y[x]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </tr>
        ) : (
          ''
        )}
        {/* Table 5////////////////////////////////////////// */}
        {data.Table5.length ? (
          <tr style={{ width: '100%', display: 'table' }}>
            <thead>
              <tr>
                <td colSpan={3}>
                  <Title
                    level={4}
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                  >
                    Payment Mode Details
                  </Title>
                </td>
              </tr>
              <tr style={headRow}>
                {Object.keys(data.Table5[0]).map((x) => (
                  <th style={thCssHead}>
                    <b>{x}</b>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.Table5.map((y) => (
                <tr>
                  {Object.keys(y).map((x) => (
                    <td style={thCss}>{y[x]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </tr>
        ) : (
          ''
        )}
        {/* table 6/////////////////////////////////// */}
        {/* {data.Table6.length ? (
        <tr style={{ width: '100%', display: 'table' }}>
          
          <thead >
          <tr>
            <td colSpan={10}>
              <Title
                level={4}
                style={{ textAlign: 'center', fontweight: 'bold' }}
              >
                Branch Details
              </Title>
            </td>
          </tr>
            <tr style={headRow}>
              
              {Object.keys(data.Table6[0])
                .map((x) => (
                  <th style={thCssHead}>
                    <b>{x}</b>
                  </th>
                ))
                .join('')}
            </tr>
          </thead>
          <tbody>
            {data.Table6.map((y) => (
              <tr>
                {Object.keys(y)
                  .map((x) => <td style={thCss}>{y[x]}</td>)
                  .join('')}
              </tr>
            )).join('')}
          </tbody>
        </tr>
      ) : (
        ''
      )} */}
      </table>
    </div>
  );
};

export default salesSummaryTemplate;
