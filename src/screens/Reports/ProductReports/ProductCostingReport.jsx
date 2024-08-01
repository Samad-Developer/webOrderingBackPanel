import Title from 'antd/lib/typography/Title';
import ModalComponent from '../../../components/formComponent/ModalComponent';
import React from 'react';
import { Button } from 'antd';

const ProductCostingReport = (props) => {
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
    <ModalComponent
      title='Product Costing Report'
      isModalVisible={props.isModalVisible}
      footer={[<Button onClick={props.handleCancel}>Cancel</Button>]}>
      <div
        style={{
          padding: 20,
          pagebreakinside: 'avoid',
          background: 'white',
          margin: '10px 0px',
        }}>
        {/* <table
          //   className="table"
          style={{ borderCollapse: 'collapse', width: '100%' }}
          id='table-to-xls'>
          <tr>
            <td colSpan={8}>
              <Title level={4} style={{ textAlign: 'center' }}>
                Product Report
              </Title>
            </td>
          </tr>
          <tr style={headRow}>
            <td style={thCssHead}>Department</td>
            <td style={thCssHead}>Category</td>
            <td style={thCssHead}>Product</td>
            <td style={thCssHead}>Size</td>
            <td style={thCssHead}>Variant</td>
            <td style={thCssHead}>Quantity</td>
            <td style={thCssHead}>Price Without GST</td>
            <td style={thCssHead}>Amount</td>
          </tr>
          {props?.html?.map((row) => {
            return (
              <tr>
                <td style={thCss}> {row?.Department}</td>
                <td style={thCss}> {row?.Category} </td>
                <td style={thCss}> {row?.Product} </td>
                <td style={thCss}> {row?.Size}</td>
                <td style={thCss}> {row?.Variant}</td>
                <td style={thCss}> {row?.Quantity}</td>
                <td style={thCss}> {row?.PriceWithoutGST.toFixed(2)} </td>
                <td style={thCss}> {row?.Amount?.toFixed(2)}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={6} style={thCss}>
              Total
            </td>
            <td style={thCss}>
              {props.html
                .reduce((sum, next) => sum + next?.PriceWithoutGST, 0)
                .toFixed(2)}
            </td>

            <td style={thCss}>
              {props.html
                .reduce((sum, next) => sum + next?.Amount, 0)
                .toFixed(2)}
            </td>
          </tr>
        </table> */}
      </div>
    </ModalComponent>
  );
};

export default ProductCostingReport;
