import { Button, message, Spin } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { INPUT_SIZE } from '../../../common/ThemeConstants';
import ModalComponent from '../../../components/formComponent/ModalComponent';
import FormButton from '../../../components/general/FormButton';
import FormSelect from '../../../components/general/FormSelect';
import { postRequest } from '../../../services/mainApp.service';
export default function Shift(props) {
  const userData = useSelector((state) => state.authReducer);
  const {
    handleCancel,
    shiftModal,
    modalLoading,
    DayShiftTerminalInitialFormValues,
    closeShiftModal,
    openCounterModal,
  } = props;
  let dayShiftTable;
  try {
    dayShiftTable = JSON.parse(localStorage.getItem('dayShiftTable'));
  } catch (error) {}
  const [shiftFormValues, setShiftFormValues] = useState(
    DayShiftTerminalInitialFormValues,
  );

  const startShiftRequest = (formValues) => {
    localStorage.setItem('s_id', formValues.ShiftId);
    postRequest('/BusinessDayShiftTerminal', {
      ...formValues,
      BusinessDayId: parseInt(localStorage.getItem('businessDayId'), 0),
      BranchId: parseInt(localStorage.getItem('selectedBranchId'), 0),
      OperationId: 4,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: '12.1.1.2',
    })
      .then((response) => {
        if (response.error === true) {
          message.error(response.errorMessage);
          if (response.errorMessage === 'Shift Already Started') {
            const shifDetailId = response.data.DataSet.Table1[0].ShiftDetailId;
            localStorage.setItem('shifDetailId', shifDetailId);
            closeShiftModal();
            openCounterModal();
          }
          return;
        }
        const shifDetailId = response.data.DataSet.Table1[0].ShiftDetailId;
        localStorage.setItem('shifDetailId', shifDetailId);
        if (shifDetailId > 0) {
          closeShiftModal();
          openCounterModal();
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <ModalComponent
      title='Start Your Shift'
      isModalVisible={shiftModal}
      handleCancel={handleCancel}
      footer={[<Button onClick={closeShiftModal}>Close</Button>]}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        {modalLoading && <Spin />}
        <FormSelect
          colSpan={4}
          listItem={dayShiftTable || []}
          idName='ShiftId'
          valueName='ShiftName'
          size={INPUT_SIZE}
          name='ShiftId'
          label='Select Shift'
          value={shiftFormValues.ShiftId}
          onChange={(e) => {
            setShiftFormValues({ ...shiftFormValues, ShiftId: e.value });
          }}
        />
        <FormButton
          title='Start Shift'
          type='primary'
          onClick={() => startShiftRequest(shiftFormValues)}
        />
      </div>
    </ModalComponent>
  );
}
