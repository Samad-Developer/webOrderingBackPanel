import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from '../../../components/formComponent/ModalComponent';
import {
  SET_DAY_SHIFT_TERMINAL_MODAL,
  SET_ORDER_SOURCE_LIST,
} from '../../../redux/reduxConstants';
import { postRequest } from '../../../services/mainApp.service';
import moment from 'moment';
import { Button, message, Spin } from 'antd';
import FormSelect from '../../../components/general/FormSelect';
import FormButton from '../../../components/general/FormButton';
import { INPUT_SIZE } from '../../../common/ThemeConstants';
import FormTextField from '../../../components/general/FormTextField';
import FormContainer from '../../../components/general/FormContainer';
import { useNavigate } from 'react-router-dom';
import {
  BRANCH_ADMIN,
  CASHIER,
  DAY_SHIFT_TERMINAL,
  TERMINAL_UNIQUE_ID,
} from '../../../common/SetupMasterEnum';
import { getRandomAlphaNumericString } from '../../../functions/generalFunctions';

const DayShiftTerminalModal = (props) => {
  const { dstModal, setDstModal, modalLoading, setModalLoading, setDstDetail } =
    props;
  const userData = useSelector((state) => state.authReducer);
  const posState = useSelector((state) => state.PointOfSaleReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const controller = new window.AbortController();
  const [restartDay, setRestartDay] = useState(false);

  const [shiftList, setShiftList] = useState([]);
  const [terminalList, setTerminalList] = useState([]);
  const [data, setData] = useState({
    BusinessDayId: 0,
    Date: Date.now(),
    ShiftDetailId: 0,
    TerminalDetailId: 0,
    TerminalOpeningAmount: 0,
    TerminalClosingAmount: 0,
    ShiftId: 0,
    TerminalId: 0,
    BranchId: 0,
  });

  const setLocalState = (data) => {
    localStorage.setItem(DAY_SHIFT_TERMINAL, JSON.stringify(data));
  };

  const postDayShitTerminal = (operationId) => {
    let terminalUniqueKey = '';
    if (operationId === 1) {
      terminalUniqueKey = localStorage.getItem(TERMINAL_UNIQUE_ID);
      if (terminalUniqueKey === null || terminalUniqueKey === '') {
        terminalUniqueKey = getRandomAlphaNumericString(36, 6);
        localStorage.setItem(TERMINAL_UNIQUE_ID, terminalUniqueKey);
      }
    }
    if (operationId === 6) {
      terminalUniqueKey = localStorage.getItem(TERMINAL_UNIQUE_ID);
      if (terminalUniqueKey === null || terminalUniqueKey === '') {
        terminalUniqueKey = getRandomAlphaNumericString(36, 6);
        localStorage.setItem(TERMINAL_UNIQUE_ID, terminalUniqueKey);
      }
    } else if (operationId === 7) {
      terminalUniqueKey = localStorage.getItem(TERMINAL_UNIQUE_ID);
      if (terminalUniqueKey !== null) {
        localStorage.setItem(TERMINAL_UNIQUE_ID, '');
      }
    }
    postRequest(
      '/BusinessDayShiftTerminal',
      {
        ...data,
        BranchId: userData.branchId,
        OperationId: operationId,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: '12.1.1.2',
        UniqueId: terminalUniqueKey,
      },
      controller,
    )
      .then((response) => {
        setModalLoading(false);
        let data1;
        if (operationId === 1) {
          dispatch({
            type: SET_ORDER_SOURCE_LIST,
            payload: response.data.DataSet.Table3,
          });
        }
        if (response.data.DataSet.Table[0].HasError !== undefined) {
          if (operationId === 1) {
            setRestartDay(response.data.DataSet.Table[0].BusinessDayStarted);
          }
          if (operationId === 9) {
            setRestartDay(false);
          }
          data1 = { ...response.data.DataSet.Table1[0] };
          setShiftList(response.data.DataSet.Table2);
          setTerminalList(response.data.DataSet.Table3);
        } else {
          if (operationId === 1) {
            setRestartDay(response.data.DataSet.Table[0].BusinessDayStarted);
          }
          if (operationId === 9) {
            setRestartDay(false);
          }
          data1 = { ...response.data.DataSet.Table[0] };
          setShiftList(response.data.DataSet.Table1);
          setTerminalList(response.data.DataSet.Table2);
        }
        setLocalState(data1);
        setData({ ...data, ...data1 });
        setDstDetail(data1);

        if (data.TerminalId > 0) {
          setDstModal({
            ...dstModal,
            terminalModal: false,
          });
          return;
        } else if (data1.BusinessDayId === 0) {
          setDstModal({ ...dstModal, dayModal: true });
          return;
        } else if (data1.BusinessDayId > 0 && data1.ShiftDetailId === 0) {
          setDstModal({ ...dstModal, shiftModal: true, dayModal: false });
          return;
        } else if (
          data1.BusinessDayId > 0 &&
          data1.ShiftDetailId > 0 &&
          data1.TerminalDetailId === 0
        ) {
          setDstModal({
            ...dstModal,
            terminalModal: true,
            shiftModal: false,
            dayModal: false,
          });
          return;
        } else if (data.ShiftDetailId > 0) {
          setDstModal({
            ...dstModal,
            shiftModal: false,
          });
          return;
        } else if (data.BusinessDayId > 0) {
          setDstModal({
            ...dstModal,
            dayModal: false,
          });
          return;
        } else {
          setDstModal({
            ...dstModal,
            terminalModal: false,
            shiftModal: false,
            dayModal: false,
          });
          return;
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDayShiftTerminal = (e, opId) => {
    e.preventDefault();
    postDayShitTerminal(restartDay ? 9 : opId);
  };

  const handleDayShiftChange = (data) => {
    dispatch({
      type: SET_DAY_SHIFT_TERMINAL_MODAL,
      payload: data,
    });
  };

  useEffect(() => {
    setLocalState({ ...data, BranchId: userData.branchId });
    if (userData.RoleId === BRANCH_ADMIN || userData.RoleId === CASHIER) {
      if (posState.IsPos === false) return;
      postDayShitTerminal(1);
    }

    return () => controller.abort();
  }, []);

  return (
    <div>
      {/* DAY MODAL */}
      <ModalComponent
        title='Start Your Day'
        isModalVisible={dstModal.dayModal}
        footer={null}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {modalLoading && <Spin />}
          <p>
            {moment().format('dddd') + ' - ' + moment().format('MMM Do YY')}
          </p>
        </div>
        <FormContainer
          onSubmit={(e) =>
            handleDayShiftTerminal(e, data.BusinessDayId > 0 ? 3 : 2)
          }>
          <FormSelect
            colSpan={24}
            listItem={userData.userBranchList || []}
            idName='BranchId'
            valueName='BranchName'
            size={INPUT_SIZE}
            name='BranchId'
            label='Branch'
            value={data.BranchId}
            onChange={(e) => setData({ ...data, BranchId: e.value })}
            required
          />
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px solid #eee',
              paddingTop: '15px',
              marginTop: '24px',
            }}
            align='right'>
            <Button type='default' onClick={() => navigate('/')}>
              Back To Home
            </Button>
            {restartDay ? (
              <FormButton htmlType='submit' type='primary' title='Reopen Day' />
            ) : (
              <FormButton htmlType='submit' type='primary' title='Start Day' />
            )}
          </div>
        </FormContainer>
      </ModalComponent>

      {/* SHIFT DAY */}

      <ModalComponent
        title='Start Your Shift'
        isModalVisible={dstModal.shiftModal}
        footer={null}>
        <FormContainer
          onSubmit={(e) =>
            handleDayShiftTerminal(e, data.ShiftDetailId > 0 ? 5 : 4)
          }>
          {modalLoading && <Spin />}
          <FormSelect
            colSpan={24}
            listItem={shiftList || []}
            idName='ShiftId'
            valueName='ShiftName'
            size={INPUT_SIZE}
            name='ShiftId'
            label='Select Shift'
            value={data.ShiftId}
            onChange={(e) => setData({ ...data, ShiftId: e.value })}
          />
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px solid #eee',
              paddingTop: '15px',
              marginTop: '24px',
            }}
            align='right'>
            <Button
              onClick={() =>
                setDstModal({
                  ...dstModal,
                  shiftModal: false,
                  dayModal: true,
                })
              }>
              Cancel
            </Button>
            <FormButton
              title='Start Shift'
              type='primary'
              onClick={(e) =>
                handleDayShiftTerminal(e, data.ShiftDetailId > 0 ? 5 : 4)
              }
            />
          </div>
        </FormContainer>
      </ModalComponent>

      {/* TERMINAL DAY */}
      <ModalComponent
        title='Counter'
        isModalVisible={dstModal.terminalModal}
        footer={null}
        handleCancel={() => setDstModal({ ...dstModal, terminalModal: false })}
        closable={data.TerminalDetailId !== 0}>
        <FormContainer
          onSubmit={(e) => {
            e.preventDefault();
            if (
              data.TerminalDetailId === 0 &&
              (data.TerminalOpeningAmount <= 0 ||
                data.TerminalOpeningAmount === undefined)
            ) {
              message.warn('Starting Or Ending amount cant be zero!');
              return;
            }
            handleDayShiftTerminal(e, data.TerminalDetailId > 0 ? 7 : 6);
          }}>
          {data.TerminalDetailId === 0 ? (
            <FormTextField
              colSpan={24}
              placeholder='Opening Amount'
              style={{ width: '250px' }}
              label='Opening Amount'
              required
              name='TerminalOpeningAmount'
              value={data.TerminalOpeningAmount}
              isNumber='true'
              onClick={(e) => e.target.select()}
              min='0'
              onChange={(e) =>
                setData({ ...data, TerminalOpeningAmount: e.value })
              }
            />
          ) : (
            <FormTextField
              colSpan={24}
              placeholder='Closing Amount'
              style={{ width: '250px' }}
              label='Closing Amount'
              required
              name='TerminalClosingAmount'
              type='number'
              value={data.TerminalClosingAmount}
              isNumber={true}
              min='0'
              onChange={(e) =>
                setData({ ...data, TerminalClosingAmount: e.value })
              }
            />
          )}

          <FormSelect
            colSpan={24}
            listItem={terminalList || []}
            idName='TerminalId'
            valueName='TerminalName'
            size={INPUT_SIZE}
            name='TerminalId'
            label='Select Terminal'
            value={data.TerminalId}
            onChange={(e) => setData({ ...data, TerminalId: e.value })}
            required
            disabled={data.TerminalDetailId > 0 ? true : false}
          />
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px solid #eee',
              paddingTop: '15px',
              marginTop: '24px',
            }}
            align='right'>
            <Button
              onClick={() =>
                setDstModal({
                  ...dstModal,
                  terminalModal: false,
                  shiftModal: true,
                })
              }>
              Cancel
            </Button>
            <FormButton
              title={
                data.TerminalDetailId > 0 ? 'End Counter' : 'Start Counter'
              }
              type='primary'
              htmlType='submit'
            />
          </div>
        </FormContainer>
      </ModalComponent>
    </div>
  );
};

export default DayShiftTerminalModal;
