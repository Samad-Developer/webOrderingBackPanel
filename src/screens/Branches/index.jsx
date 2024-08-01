import { Col, message, Row, TimePicker } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormCheckbox from "../../components/general/FormCheckbox";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm
} from "../../redux/actions/basicFormAction";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD
} from "../../redux/reduxConstants";
import moment from "moment";
import "./style.css";
import { compareTime } from "../../functions/dateFunctions";

const initialFormValues = {
  BranchId: null,
  BranchName: "",
  CityId: null,
  IsEnable: true,
  NTNNumber: "",
  NTNName: "",
  BusinessDayStartTime: "2011-10-05T14:48:00.000Z",
  BusinessDayEndTime: "2011-10-05T14:48:00.000Z",
  IsCallCenter: false,
  BranchDetail: [],
  IsWarehouse: false,
  BranchAddress: ""
};

const initialSearchValues = {
  BranchId: null,
  BranchName: "",
  CityId: null,
  AreaId: null,
  IsEnable: true,
  NTNNumber: "",
  NTNName: "",
  BusinessDayStartTime: "2011-10-05T14:48:00.000Z",
  BusinessDayEndTime: "2011-10-05T14:48:00.000Z",
  IsCallCenter: false,
  BranchDetail: [],
  IsWarehouse: false,
  BranchAddress: ""
};

const columns = [
  {
    title: "Branch Name",
    dataIndex: "BranchName",
    key: "BranchName"
  },
  {
    title: "Start Time",
    dataIndex: "BusinessDayStartTime",
    key: "BusinessDayStartTime"
  },
  {
    title: "End Time",
    dataIndex: "BusinessDayEndTime",
    key: "BusinessDayEndTime"
  },
  {
    title: "City",
    dataIndex: "CityName",
    key: "CityName"
  },
  {
    title: "Call Center Enabled",
    key: "IsCallCenter",
    render: (record) => {
      return (
        <input
          type="checkbox"
          checked={record.IsCallCenter}
          onChange={() => {}}
        />
      );
    }
  },
  {
    title: "Product Enable",
    key: "IsEnable",
    render: (record) => {
      return (
        <input type="checkbox" checked={record.IsEnable} onChange={() => {}} />
      );
    }
  },
  {
    title: "Warehouse",
    key: "IsWarehouse",
    render: (record) => {
      return (
        <input
          type="checkbox"
          checked={record.IsWarehouse}
          onChange={() => {}}
        />
      );
    }
  }
];

const Branches = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [BranchDetail, setBranchDetail] = useState([]);
  const [copyOfArea, setCopyOfArea] = useState([]);
  const [areaToShow, setAreasToShow] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [selectAllChangeObj, setSelectAllChangeObj] = useState({
    BranchId: null,
    AreaId: null,
    DeliveryTime: null,
    DeliveryTime1: null,
    DeliveryTime2: null,
    DeliveryTime3: null,
    MinimumOrder: null,
    DeliveryCharges: null,
    AlternateBranch1: null,
    AlternateBranch2: null,
    AlternateBranch3: null,
    IsEnable: true
  });

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable
  } = useSelector((state) => state.basicFormReducer);

  const closeForm = () => {
    setBranchDetail([]);
    setCopyOfArea([]);
    setAreasToShow([]);
    setSelectAllChangeObj({
      BranchId: null,
      AreaId: null,
      DeliveryTime: null,
      DeliveryTime1: null,
      DeliveryTime2: null,
      DeliveryTime3: null,
      MinimumOrder: null,
      DeliveryCharges: null,
      AlternateBranch1: null,
      AlternateBranch2: null,
      AlternateBranch3: null,
      IsEnable: true
    });
  };

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudBranch",
        initialFormValues,
        initialFormValues,
        initialSearchValues,
        controller,
        userData
      )
    );

    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  useEffect(() => {
    if (updateId !== null) {
      const cityId = itemList.filter((item) => item.BranchId === updateId)[0]
        .CityId;
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter((item) => item.BranchId === updateId)[0]
      });
      let detail = supportingTable.Table3.filter(
        (x) => x.BranchId === updateId
      );
      setBranchDetail(detail);

      const areas = [];

      const finalAreas = [];

      supportingTable.Table2.filter((item, i) => {
        const detailIndex = detail.findIndex((x) => x.AreaId === item.AreaId);
        if (detailIndex > -1) {
          let area = detail[detailIndex];
          const index = supportingTable.Table2.findIndex(
            (x) => x.AreaId === area.AreaId
          );
          if (index > -1) {
            areas.push(supportingTable.Table2[index]);
          }
        }

        const index2 = supportingTable.Table3.findIndex(
          (x) => x.AreaId === item.AreaId
        );
        if (index2 === -1) {
          areas.push(supportingTable.Table2[i]);
        }
      });

      areas.filter((item) => {
        if (item.CityId === cityId) {
          finalAreas.push(item);
        }
      });

      setCopyOfArea([...finalAreas]);
      setAreasToShow([...finalAreas]);
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
    if (data.name === "CityId") {
      const areasToShowTempArr = [];

      copyOfArea.map((x, index) => {
        if (x.CityId === data.value) {
          areasToShowTempArr.push(copyOfArea[index]);
        }
      });
      if (areasToShowTempArr.length > 0) {
        setAreasToShow([...areasToShowTempArr]);
      } else {
        setAreasToShow([]);
      }
    }
  };

  const chnageDeliveryTime = (area, event) => {
    if (event.value === "") {
      event.value = 0;
    }
    const branchDetail = BranchDetail;
    let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
    branchDetail[index].DeliveryTime = parseInt(event.value, 0);
    setBranchDetail([...branchDetail]);
  };

  const chnageDeliveryTime1 = (area, event) => {
    if (event.value === "") {
      event.value = 0;
    }
    const branchDetail = BranchDetail;
    let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
    branchDetail[index].DeliveryTime1 = parseInt(event.value, 0);
    setBranchDetail([...branchDetail]);
  };

  const chnageDeliveryTime2 = (area, event) => {
    if (event.value === "") {
      event.value = 0;
    }
    const branchDetail = BranchDetail;
    let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
    branchDetail[index].DeliveryTime2 = parseInt(event.value, 0);
    setBranchDetail([...branchDetail]);
  };

  const chnageDeliveryTime3 = (area, event) => {
    if (event.value === "") {
      event.value = 0;
    }
    const branchDetail = BranchDetail;
    let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
    branchDetail[index].DeliveryTime3 = parseInt(event.value, 0);
    setBranchDetail([...branchDetail]);
  };

  const chnageDeliveryCharges = (area, event) => {
    if (event.value === "") {
      event.value = 0;
    }
    const branchDetail = BranchDetail;
    let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
    branchDetail[index].DeliveryCharges = parseInt(event.value, 0);
    setBranchDetail([...branchDetail]);
  };

  const chnageMinimumOrder = (area, event) => {
    if (event.value === "") {
      event.value = 0;
    }
    const branchDetail = BranchDetail;
    let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
    branchDetail[index].MinimumOrder = parseInt(event.value, 0);
    setBranchDetail([...branchDetail]);
  };

  const chnageAlternateBranch1 = (area, event) => {
    if (event.value === null) {
      const branchDetail = BranchDetail;
      let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
      branchDetail[index].AlternateBranch1 = event.value;
      branchDetail[index].DeliveryTime1 = null;
      setBranchDetail([...branchDetail]);
    } else {
      const branchDetail = BranchDetail;
      let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
      branchDetail[index].AlternateBranch1 = event.value;
      branchDetail[index].DeliveryTime1 = 0;
      setBranchDetail([...branchDetail]);
    }
  };

  const chnageAlternateBranch2 = (area, event) => {
    if (event.value === null) {
      const branchDetail = BranchDetail;
      let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
      branchDetail[index].AlternateBranch2 = event.value;
      branchDetail[index].DeliveryTime2 = null;
      setBranchDetail([...branchDetail]);
    } else {
      const branchDetail = BranchDetail;
      let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
      branchDetail[index].AlternateBranch2 = event.value;
      branchDetail[index].DeliveryTime2 = 0;
      setBranchDetail([...branchDetail]);
    }
  };

  const chnageAlternateBranch3 = (area, event) => {
    if (event.value === null) {
      const branchDetail = BranchDetail;
      let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
      branchDetail[index].AlternateBranch3 = event.value;
      branchDetail[index].DeliveryTime3 = null;
      setBranchDetail([...branchDetail]);
    } else {
      const branchDetail = BranchDetail;
      let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
      branchDetail[index].AlternateBranch3 = event.value;
      branchDetail[index].DeliveryTime3 = 0;
      setBranchDetail([...branchDetail]);
    }
  };

  const setAreaToShow = () => {
    const areasToPush = [];
    supportingTable.Table2.filter((item, i) => {
      const index = supportingTable.Table3.findIndex(
        (x) => x.AreaId === item.AreaId
      );
      if (index === -1) {
        areasToPush.push(supportingTable.Table2[i]);
      }
    });
    setCopyOfArea(areasToPush);
  };

  const validateCheck = (area, event) => {
    if (event.value === true) {
      const obj = {
        BranchId: null,
        AreaId: area.AreaId,
        DeliveryTime: null,
        DeliveryTime1: null,
        DeliveryTime2: null,
        DeliveryTime3: null,
        MinimumOrder: null,
        DeliveryCharges: null,
        AlternateBranch1: null,
        AlternateBranch2: null,
        AlternateBranch3: null,
        IsEnable: true
      };
      setBranchDetail([...BranchDetail, obj]);
    } else {
      const branchDetail = BranchDetail;
      let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
      if (index > -1) {
        branchDetail.splice(index, 1);
      }
      setBranchDetail([...branchDetail]);
    }
  };

  const handleChangeAllSelectedProperty = (data) => {
    setSelectAllChangeObj({ ...selectAllChangeObj, [data.name]: data.value });
    const branchDetail = BranchDetail;
    const arr = branchDetail.map((b) => {
      const obj = b;
      if (data.value === "") {
        data.value = 0;
      }
      obj[data.name] = parseInt(data.value);
      return obj;
    });
    // let index = branchDetail.findIndex((x) => x.AreaId === area.AreaId);
    // branchDetail[index].AlternateBranch3 = event.value;
    setBranchDetail([...branchDetail]);
  };

  const validateSelectAll = (areas, event) => {
    if (event.value === true) {
      const finalAreasToPush = [];
      const existingAreas = BranchDetail;
      if (existingAreas.length > 0) {
        existingAreas.map((exe) => {
          areas.map((are) => {
            if (exe.AreaId === are.AreaId) {
              finalAreasToPush.push(exe);
            } else {
              const obj = {
                BranchId: null,
                AreaId: are.AreaId,
                DeliveryTime: null,
                DeliveryTime1: null,
                DeliveryTime2: null,
                DeliveryTime3: null,
                MinimumOrder: 0,
                DeliveryCharges: 0,
                AlternateBranch1: null,
                AlternateBranch2: null,
                AlternateBranch3: null,
                IsEnable: true
              };
              finalAreasToPush.push(obj);
            }
          });
        });
        setBranchDetail([...finalAreasToPush]);
      } else {
        const areaToFill = areas.map((area) => {
          const obj = {
            BranchId: null,
            AreaId: area.AreaId,
            DeliveryTime: null,
            DeliveryTime1: null,
            DeliveryTime2: null,
            DeliveryTime3: null,
            MinimumOrder: 0,
            DeliveryCharges: 0,
            AlternateBranch1: null,
            AlternateBranch2: null,
            AlternateBranch3: null,
            IsEnable: true
          };
          return obj;
        });
        setBranchDetail([...areaToFill]);
      }
      setSelectAll(true);
    } else {
      setBranchDetail([]);
      setSelectAll(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudBranch",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (branchId) => {
    delete formFields.BranchId;
    dispatch(
      deleteRow(
        "/CrudBranch",
        {
          ...formFields,
          BranchId: branchId,
          BranchDetail: [],
          BranchName: "",
          CityId: null,
          IsEnable: true,
          NTNNumber: "",
          NTNName: "",
          BusinessDayStartTime: "2011-10-05T14:48:00.000Z",
          BusinessDayEndTime: "2011-10-05T14:48:00.000Z",
          IsCallCenter: true,
          UserIP: "1.1.1.1",
          BranchDetail: []
        },
        controller,
        userData,
        (tables) => {
          delete tables.Table;
          const tablesToSet = {
            Table1: tables.Table2,
            Table2: tables.Table3,
            Table3: tables.Table4
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
        }
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    // const comparedTime = compareTime(
    //   formFields.BusinessDayStartTime,
    //   formFields.BusinessDayEndTime
    // );
    // if (comparedTime === false) {
    //   message.error("Incorrect  Time Interval");
    //   return;
    // }
    e.preventDefault();
    if (id === 3) {
      BranchDetail.forEach((branchD) => {
        let branch = branchD;
        branch.BranchId = formFields.BranchId;
        setBranchDetail([...BranchDetail, branch]);
      });
    }
    dispatch(
      submitForm(
        "/CrudBranch",
        {
          ...formFields,
          BranchDetail
        },
        initialFormValues,
        controller,
        userData,
        id,
        (tables) => {
          delete tables.Table;
          const tablesToSet = {
            Table1: tables.Table2,
            Table2: tables.Table3,
            Table3: tables.Table4
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
          closeForm();
        }
      )
    );
    setBranchDetail([]);
    setAreasToShow([]);
    setCopyOfArea([]);
    setSelectAllChangeObj({
      BranchId: null,
      AreaId: null,
      DeliveryTime: null,
      DeliveryTime1: null,
      DeliveryTime2: null,
      DeliveryTime3: null,
      MinimumOrder: null,
      DeliveryCharges: null,
      AlternateBranch1: null,
      AlternateBranch2: null,
      AlternateBranch3: null,
      IsEnable: true
    });
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Branch"
        name="BranchName"
        size={INPUT_SIZE}
        value={searchFields.BranchName || ""}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="CityId"
        valueName="CityName"
        size={INPUT_SIZE}
        name="CityId"
        label="City"
        value={searchFields.cityName}
        onChange={handleSearchChange}
        allowClear={true}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Branch"
        name="BranchName"
        size={INPUT_SIZE}
        value={formFields.BranchName || ""}
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={4}
        label="Tax Number"
        name="NTNNumber"
        size={INPUT_SIZE}
        value={formFields.NTNNumber}
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={4}
        label="Tax Name"
        name="NTNName"
        size={INPUT_SIZE}
        value={formFields.NTNName}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="CityId"
        valueName="CityName"
        size={INPUT_SIZE}
        name="CityId"
        label="City"
        value={formFields.CityId}
        onChange={handleFormChange}
        required={true}
      />
      {/* <div
        className="ant-col ant-col-4"
        style={{
          paddingLeft: "4px",
          paddingRight: "4px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label htmlFor="">Start Time</label>
        <TimePicker
          placeholder="Start Time"
          value={
            formFields.BusinessDayStartTime
              ? moment(formFields.BusinessDayStartTime, "hh:mm")
              : formFields.BusinessDayStartTime
          }
          required={true}
          onChange={(_, timeString) => {
            handleFormChange({
              name: "BusinessDayStartTime",
              value: timeString,
            });
          }}
        />
      </div> */}
      <FormTextField
        colSpan={4}
        type="time"
        style={{ width: "100%" }}
        placeholder="Start Time"
        value={formFields.BusinessDayStartTime}
        required={true}
        label="Start Time"
        onChange={(e) => {
          handleFormChange({ name: "BusinessDayStartTime", value: e.value });
        }}
      />
      {/* <div
        className="ant-col ant-col-4"
        style={{
          paddingLeft: "4px",
          paddingRight: "4px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label htmlFor="">End Time</label>
        <TimePicker
          placeholder="End Time"
          value={
            formFields.BusinessDayEndTime
              ? moment(formFields.BusinessDayEndTime, "hh:mm")
              : formFields.BusinessDayEndTime
          }
          required={true}
          onChange={(_, timeString) => {
            handleFormChange({ name: "BusinessDayEndTime", value: timeString });
          }}
        />
      </div> */}
      <FormTextField
        type="time"
        colSpan={4}
        style={{ width: "100%" }}
        placeholder="End Time"
        value={formFields.BusinessDayEndTime}
        required={true}
        label="End Time"
        onChange={(e) => {
          handleFormChange({ name: "BusinessDayEndTime", value: e.value });
        }}
      />

      <FormTextField
        colSpan={8}
        label="Branch Address"
        name="BranchAddress"
        size={INPUT_SIZE}
        value={formFields.BranchAddress || ""}
        onChange={handleFormChange}
      />
      <FormCheckbox
        colSpan={4}
        checked={formFields.IsCallCenter}
        name="IsCallCenter"
        onChange={handleFormChange}
        label="Call Center"
      />
      <FormCheckbox
        colSpan={4}
        checked={formFields.IsEnable}
        name="IsEnable"
        onChange={handleFormChange}
        label="Enabled"
      />
      <FormCheckbox
        colSpan={4}
        checked={formFields.IsWarehouse}
        name="IsWarehouse"
        onChange={handleFormChange}
        label="Warehouse"
      />
      <Col span={24}>
        <Row className="branchListContainer">
          <div className="branchListItem">
            <table>
              <thead>
                <tr style={{ borderBottom: "none" }}>
                  <th></th>
                  <th style={{ textAlign: "left" }}>Area</th>
                  <th>Delivery Time</th>
                  <th>Alt. Branch 1 (Delivery Time)</th>
                  <th>Alt. Branch 2 (Delivery Time)</th>
                  <th>Alt. Branch 3 (Delivery Time)</th>
                  <th>Minimum Order</th>
                  <th>Delivery Charges</th>
                </tr>
                <tr style={{ borderBottom: "1px solid #0000000f" }}>
                  <th>
                    <FormCheckbox
                      checked={selectAll}
                      onChange={(event) => {
                        validateSelectAll(areaToShow, event);
                      }}
                    />
                  </th>
                  <th> </th>
                  <th>
                    <FormTextField
                      name="DeliveryTime"
                      value={selectAllChangeObj.DeliveryTime}
                      onChange={(event) => {
                        handleChangeAllSelectedProperty(event);
                      }}
                      placeholder="Time"
                      suffix={"/min"}
                      isNumber="true"
                    />
                  </th>
                  <th>
                    <FormTextField
                      name="DeliveryTime1"
                      value={selectAllChangeObj.DeliveryTime1}
                      onChange={(event) => {
                        handleChangeAllSelectedProperty(event);
                      }}
                      suffix={"/min"}
                      placeholder="Time"
                      isNumber="true"
                    />
                  </th>
                  <th>
                    <FormTextField
                      name="DeliveryTime2"
                      value={selectAllChangeObj.DeliveryTime2}
                      onChange={(event) => {
                        handleChangeAllSelectedProperty(event);
                      }}
                      suffix={"/min"}
                      placeholder="Time"
                      isNumber="true"
                    />
                  </th>
                  <th>
                    <FormTextField
                      name="DeliveryTime3"
                      value={selectAllChangeObj.DeliveryTime3}
                      onChange={(event) => {
                        handleChangeAllSelectedProperty(event);
                      }}
                      suffix={"/min"}
                      placeholder="Time"
                      isNumber="true"
                    />
                  </th>
                  <th>
                    <FormTextField
                      name="MinimumOrder"
                      value={selectAllChangeObj.MinimumOrder}
                      onChange={(event) => {
                        handleChangeAllSelectedProperty(event);
                      }}
                      isNumber="true"
                      prefix={"Rs."}
                      placeholder="Minimum Order"
                    />
                  </th>
                  <th>
                    <FormTextField
                      name="DeliveryCharges"
                      value={selectAllChangeObj.DeliveryCharges}
                      onChange={(event) => {
                        handleChangeAllSelectedProperty(event);
                      }}
                      isNumber="true"
                      prefix={"Rs."}
                      placeholder="Delivery Charges"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {supportingTable.Table2 &&
                  areaToShow &&
                  areaToShow.map((item, key) => {
                    return (
                      <tr
                        style={{
                          background: !BranchDetail.find(
                            (x) => x.AreaId === item.AreaId
                          )
                            ? "#F5F5F5"
                            : key % 2
                            ? "#0093ff12"
                            : "#fff"
                        }}
                        key={key}
                      >
                        <td>
                          <FormCheckbox
                            checked={
                              BranchDetail.find((x) => x.AreaId === item.AreaId)
                                ? true
                                : false
                            }
                            onChange={(event) => {
                              validateCheck(item, event);
                            }}
                          />
                        </td>
                        <td> {item.AreaName} </td>
                        <td>
                          <FormTextField
                            required={true}
                            value={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].DeliveryTime
                            }
                            onChange={(event) => {
                              chnageDeliveryTime(item, event);
                            }}
                            suffix={"/min"}
                            placeholder="Time"
                            disabled={
                              !BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              )
                            }
                            isNumber="true"
                          />
                        </td>
                        <td>
                          <FormSelect
                            colSpan={24}
                            listItem={itemList || []}
                            idName="BranchId"
                            valueName="BranchName"
                            size={INPUT_SIZE}
                            name="BranchId"
                            placeholder="Select Alternate Branch"
                            allowClear={true}
                            value={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].AlternateBranch1
                            }
                            onChange={(event) => {
                              chnageAlternateBranch1(item, event);
                            }}
                            disabled={
                              !BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              )
                            }
                          />
                          <FormTextField
                            onChange={(event) => {
                              chnageDeliveryTime1(item, event);
                            }}
                            suffix={"/min"}
                            placeholder="Time"
                            value={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].DeliveryTime1
                            }
                            isNumber="true"
                            disabled={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].AlternateBranch1 === null
                                ? true
                                : !BranchDetail.find(
                                    (x) => x.AreaId === item.AreaId
                                  )
                            }
                          />
                        </td>
                        <td>
                          <FormSelect
                            colSpan={24}
                            listItem={itemList || []}
                            idName="BranchId"
                            valueName="BranchName"
                            size={INPUT_SIZE}
                            name="BranchId"
                            placeholder="Select Alternate Branch"
                            onChange={(event) => {
                              chnageAlternateBranch2(item, event);
                            }}
                            allowClear={true}
                            value={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].AlternateBranch2
                            }
                            disabled={
                              !BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              )
                            }
                          />
                          <FormTextField
                            onChange={(event) => {
                              chnageDeliveryTime2(item, event);
                            }}
                            isNumber="true"
                            suffix={"/min"}
                            placeholder="Time"
                            value={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].DeliveryTime2
                            }
                            disabled={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].AlternateBranch2 === null
                                ? true
                                : !BranchDetail.find(
                                    (x) => x.AreaId === item.AreaId
                                  )
                            }
                          />
                        </td>
                        <td>
                          <FormSelect
                            colSpan={24}
                            listItem={itemList || []}
                            idName="BranchId"
                            valueName="BranchName"
                            size={INPUT_SIZE}
                            name="BranchId"
                            placeholder="Select Alternate Branch"
                            onChange={(event) => {
                              chnageAlternateBranch3(item, event);
                            }}
                            allowClear={true}
                            value={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].AlternateBranch3
                            }
                            disabled={
                              !BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              )
                            }
                          />
                          <FormTextField
                            onChange={(event) => {
                              chnageDeliveryTime3(item, event);
                            }}
                            isNumber="true"
                            suffix={"/min"}
                            placeholder="Time"
                            value={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].DeliveryTime3
                            }
                            disabled={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].AlternateBranch3 === null
                                ? true
                                : !BranchDetail.find(
                                    (x) => x.AreaId === item.AreaId
                                  )
                            }
                          />
                        </td>
                        <td>
                          <FormTextField
                            value={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].MinimumOrder
                            }
                            onChange={(event) => {
                              chnageMinimumOrder(item, event);
                            }}
                            isNumber="true"
                            placeholder="Minimum Order"
                            disabled={
                              !BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              )
                            }
                            prefix={"Rs."}
                            required={true}
                          />
                        </td>
                        <td>
                          <FormTextField
                            onChange={(event) => {
                              chnageDeliveryCharges(item, event);
                            }}
                            isNumber="true"
                            placeholder="Delivery Charges"
                            value={
                              BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              ) &&
                              BranchDetail.filter(
                                (x) => x.AreaId === item.AreaId
                              )[0].DeliveryCharges
                            }
                            disabled={
                              !BranchDetail.find(
                                (x) => x.AreaId === item.AreaId
                              )
                            }
                            prefix={"Rs."}
                            required={true}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Row>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Branches"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      formWidth="95vw"
      formLoading={formLoading}
      tableLoading={tableLoading}
      tableColumn={columns}
      tableRows={itemList}
      editRow={setUpdateId}
      deleteRow={handleDeleteRow}
      fields={initialFormValues}
      actionID="BranchId"
      onFormClose={closeForm}
      onFormOpen={setAreaToShow}
      crudTitle="Branch"
    />
  );
};

export default Branches;
