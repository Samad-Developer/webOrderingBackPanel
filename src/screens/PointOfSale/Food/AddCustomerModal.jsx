import { Col, Row, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { INPUT_SIZE } from '../../../common/ThemeConstants';
import ModalComponent from '../../../components/formComponent/ModalComponent';
import FormSelect from '../../../components/general/FormSelect';
import FormTextField from '../../../components/general/FormTextField';
import { postRequest } from '../../../services/mainApp.service';

const initialFormFields = {
  OrderMasterId: null,
  PhoneNumber: '',
  CustomerName: '',
  CustomerId: '',
};

export default function AddCustomerModal(props) {
  const controller = new window.AbortController();
  //   const isLaunchComplaint = props.hasOwnProperty('selectedOrder');
  const [formFields, setFormFields] = useState(initialFormFields);
  const userData = useSelector((state) => state.authReducer);
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    // if (isLaunchComplaint) {
    const { selectedOrder } = props;
    const { OrderMasterId } = selectedOrder;

    setFormFields({ ...formFields, OrderMasterId });
    // }

    // if (!isLaunchComplaint) {
    //   let launchModalData = props.modalData;

    //   setFormFields({
    //     ...formFields,
    //     OrderNumber: launchModalData.OrderNumber,
    //     OrderMasterId: launchModalData.OrderMasterId,
    //     ComplainCategoryId: launchModalData.ComplainCategoryId,
    //     ComplainTypeId: launchModalData.ComplainTypeId,
    //     ComplainMasterId: launchModalData.ComplainMasterId,
    //   });
    // }
  }, []);

  const addNewCustomer = () => {
    postRequest(
      '/CrudCreditCustomer',
      {
        OperationId: 2,
        CompanyId: userData.CompanyId,
        PhoneNumber: formFields.PhoneNumber,
        CustomerName: formFields.CustomerName,
        PhoneTypeId: null,
        CustomerId: null,
        UserId: userData.UserId,
        UserIP: '12.1.1.2',
      },
      controller,
    ).then((res) => {
      setFormFields({ ...formFields, PhoneNumber: '' });
      setCustomers(res.data.DataSet.Table1);
    });
  };

  const searchCustomer = () => {
    postRequest(
      '/CrudCreditCustomer',
      {
        OperationId: 1,
        CompanyId: userData.CompanyId,
        PhoneNumber: formFields.PhoneNumber,
        CustomerName: '',
        PhoneTypeId: null,
        CustomerId: null,
        UserId: userData.UserId,
        UserIP: '12.1.1.2',
      },
      controller,
    ).then((res) => {
      // setFormFields({ ...formFields, PhoneNumber: '' });
      setCustomers(res.data.DataSet.Table);
    });
  };

  //   if (isLaunchComplaint) {
  //when we launch  a complain from odms
  const { complaintTypes, complaintCategories } = props;
  const { selectedOrder } = props;
  const { OrderMasterId } = selectedOrder;

  return (
    <ModalComponent
      title='Add Customer'
      isModalVisible={props.isModalVisible}
      width='80vw'
      okText='Add'
      cancelText='Close'
      footer={[]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          searchCustomer();
        }}>
        <Row gutter={[8, 8]} style={{ width: '100%', marginTop: '20px' }}>
          <Col span={6}>
            <FormTextField
              label='Phone Number'
              required
              value={formFields.PhoneNumber}
              size={INPUT_SIZE}
              name='PhoneNumber'
              type='number'
              onChange={(e) =>
                setFormFields({ ...formFields, PhoneNumber: e.value })
              }
              style={{ color: 'black' }}
            />
          </Col>
          <Col span={6} style={{ width: '100%', marginTop: '20px' }}>
            <Button htmlType='submit'>Search</Button>
          </Col>
        </Row>
      </form>
      {customers && customers.length === 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();

            addNewCustomer();
          }}>
          <Row gutter={[8, 8]} style={{ width: '100%', marginTop: '20px' }}>
            <Col span={5}>
              <FormTextField
                label='Customer Name'
                required
                value={formFields.CustomerName}
                size={INPUT_SIZE}
                name='CustomerName'
                type='text'
                onChange={(e) =>
                  setFormFields({ ...formFields, CustomerName: e.value })
                }
                style={{ color: 'black' }}
              />
            </Col>
            <Col span={5}>
              <FormTextField
                label='Phone Number'
                required
                value={formFields.PhoneNumber}
                size={INPUT_SIZE}
                name='PhoneNumber'
                type='number'
                onChange={(e) =>
                  setFormFields({ ...formFields, PhoneNumber: e.value })
                }
                style={{ color: 'black' }}
              />
            </Col>
            <Col span={2} style={{ width: '100%', marginTop: '20px' }}>
              <Button htmlType='submit'>Add New Customer</Button>
            </Col>
          </Row>
        </form>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          props.saveCustomer({
            ...formFields,
            OrderMasterId,
          });
        }}>
        {customers && customers.length > 0 && (
          <Row gutter={[8, 8]} style={{ width: '100%', marginTop: '20px' }}>
            <Col span={12}>
              <FormSelect
                listItem={customers || []}
                idName='CustomerId'
                valueName='CustomerName'
                size={INPUT_SIZE}
                name='CustomerId'
                label='Customer Names'
                value={formFields.CustomerId}
                onChange={(e) => {
                  setFormFields({ ...formFields, CustomerId: e.value });
                }}
                required
              />
            </Col>
          </Row>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <Button onClick={props.closeModal}>Cancel</Button>
          {customers && customers.length > 0 && (
            <Button type='primary' htmlType='submit'>
              Add Customer
            </Button>
          )}
        </div>
      </form>
    </ModalComponent>
  );
  //   }
  //   else {
  //     // true when we edit a complaint from complaint page
  //     const complaintStatusCols = [
  //       {
  //         title: 'Complaint Launch Date',
  //         dataIndex: 'CreatedDate',
  //         key: 'createdDate',
  //         render: (i, record) => getDate(record.CreatedDate),
  //       },
  //       {
  //         title: 'Complaint Status',
  //         dataIndex: 'ComplainStatusName',
  //         key: 'complainStatusName',
  //       },
  //       {
  //         title: 'Complaint Remarks',
  //         dataIndex: 'Remarks',
  //         key: 'Remarks',
  //       },
  //     ];
  //     const {
  //       modalData,
  //       complainTypeDropDownData,
  //       complainCatDropDownData,
  //       complainStatusHistory,
  //       complaintStatusDropDownData,
  //     } = props;

  //     const { OrderMasterId, ComplainMasterId } = modalData;
  //     const filteredComplainStatusHistory = complainStatusHistory.filter(
  //       (data) => data.ComplainMasterId === ComplainMasterId,
  //     );

  //     return (
  //       <ModalComponent
  //         title='Edit Complaint'
  //         isModalVisible={props.isModalVisible}
  //         handleOk={() => props.saveComplaint(formFields)}
  //         handleCancel={props.closeModal}
  //         width='80vw'
  //         okText='Save'
  //         cancelText='Close'
  //         closable={true}>
  //         <div>
  //           {OrderMasterId !== null && (
  //             <Row gutter={[8, 8]} style={{ width: '100%', marginTop: '20' }}>
  //               <Col span={4}>
  //                 <FormTextField label='Order No' value={modalData.OrderNumber} />
  //               </Col>
  //             </Row>
  //           )}
  //           <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
  //             <Col span={4}>
  //               <FormSelect
  //                 label='Complaint Type'
  //                 value={modalData.ComplainTypeId}
  //                 listItem={complainTypeDropDownData}
  //                 idName='SetupDetailId'
  //                 valueName='SetupDetailName'
  //                 size={INPUT_SIZE}
  //                 name='SetupDetailId'
  //                 onChange={(e) => e.value}
  //                 disabled={true}
  //               />
  //             </Col>

  //             <Col span={4}>
  //               <FormSelect
  //                 listItem={complainCatDropDownData.filter(
  //                   (category) =>
  //                     category.ComplainTypeId === modalData.ComplainTypeId,
  //                 )}
  //                 idName='ComplainCategoryId'
  //                 valueName='ComplainCategoryName'
  //                 size={INPUT_SIZE}
  //                 name='ComplainCategoryId'
  //                 label='Complaint Cateogry'
  //                 value={modalData.ComplainCategoryId}
  //                 required={true}
  //                 disabled={true}
  //               />
  //             </Col>
  //           </Row>
  //           <Row style={{ marginTop: 16 }}>
  //             <Col span={24}>
  //               <Table
  //                 columns={complaintStatusCols}
  //                 dataSource={filteredComplainStatusHistory}
  //                 pagination={false}
  //               />
  //             </Col>
  //           </Row>

  //           <Row gutter={[8, 8]} style={{ marginTop: 10, alignItems: 'center' }}>
  //             <Col span={4}>
  //               <FormSelect
  //                 label='Complaint Status'
  //                 listItem={complaintStatusDropDownData}
  //                 idName='ComplainStatusId'
  //                 valueName='ComplainStatusName'
  //                 size={INPUT_SIZE}
  //                 name='ComplainStatusId'
  //                 value={formFields.ComplainStatusId}
  //                 onChange={(e) => {
  //                   setFormFields({ ...formFields, ComplainStatusId: e.value });
  //                 }}
  //                 required={true}
  //               />
  //             </Col>
  //             <Col span={20}>
  //               <TextArea
  //                 placeholder='Remarks'
  //                 style={{ width: 500, marginTop: 40 }}
  //                 onChange={(e) => {
  //                   setFormFields({ ...formFields, Remarks: e.target.value });
  //                 }}
  //                 required={true}
  //               />
  //             </Col>
  //           </Row>
  //         </div>
  //       </ModalComponent>
  //     );
  //   }
}
