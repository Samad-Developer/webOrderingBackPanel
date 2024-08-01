import { Button, Menu, Image, message, Space, Table } from "antd";
import { FrownOutlined } from '@ant-design/icons';
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormTextField from "../../components/general/FormTextField";
import { postImageRequest, postRequest } from "../../services/mainApp.service";

const WebOrdering = () => {
  const [tableData, setTableData] = useState([]);
  const [settingsList, setSettingList] = useState([]);
  const uniqueParentNames = [...new Set(settingsList.map(item => item.ParentName))];
  const [activeTab, setActiveTab] = useState(uniqueParentNames.length > 0 ? uniqueParentNames[0] : '');
  const userData = useSelector((state) => state.authReducer);
  const [settingsObj, setSettingsObj] = useState({
    SettingId: null,
    File: null,
    Value: "",
  });

  const combineData = (settingsList, tableData) => {
   
    return settingsList.map((setting) => {
      const correspondingData = tableData.find((data) => data.SetupDetailId === setting.SetupDetailId);
      
      return {
        ...setting,
        SettingId: correspondingData?.SettingId,
        SettingValue: correspondingData?.SettingValue,
      };
      
    });
  };

  const combinedData = combineData(settingsList, tableData);
  

  const onColorChange = (key, newValue) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.SetupDetailId === key ? { ...row, SettingValue: newValue } : row
      )
    );
    setSettingList((prevData) =>
      prevData.map((row) =>
        row.SetupDetailId === key ? { ...row, SettingValue: newValue } : row
      )
    );
  };

  const columns = [

    {
      title: "File",
      key: "FileName",
      render: (_, record) =>
        record.Flex2 === "IMG" || record.Flex2 === 'MULTIPLE_IMG' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {record.SettingValue ? <Image
              src={process.env.REACT_APP_BASEURL + "/" + record.SettingValue}
              style={{ width: "50px", height: "50px" }}
            /> : <div style={{ padding: '5px', textAlign: 'center' }}>
            <FrownOutlined style={{ fontSize: '48px', color: 'black' }} />
            <p>No Image</p>
          </div>}
            <input
              type="file"
              title="Upload Image"
              name="File"
              style={{ marginTop: "20px" }}
              onChange={(e) => handleImageChange(e, record)}
            />
          </div>
        ) : record.Flex2 === "COLOR" ? (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {record.SettingValue ?
              <div
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: record.SettingValue,
                  border: `1px solid ${record.SettingValue}`,
                  borderRadius: '50%',
                }}
              ></div> :
              <div style={{ padding: '5px', textAlign: 'center' }}>
                <FrownOutlined style={{ fontSize: '48px', color: 'black' }} />
                <p>No Color</p>
              </div>
            }

          </div>
        ) : (
          <>
            <p style={{  }}>{record.SettingValue}</p>
            <FormTextField
              colSpan={16}
              placeholder="Enter top bar text"
              name="Value"
              value={settingsObj.Value}
              onChange={(e) => handleTextChange(e, record)}
            />
          </>
        ),
    },

    {
      title: "Type",
      dataIndex: "SetupDetailName",
      key: "SetupDetailName",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.Flex2 === 'TEXT' || record.Flex2 === 'IMG' || record.Flex2 === 'MULTIPLE_IMG' ? null : <input
            type="color"
            name="Value"
            value={setSettingsObj.Value}
            onChange={(e) => handleColorChange(e, record)}
            style={{ padding: 'none' }}
          />}

          <Button
            type="primary"
            style={{ marginTop: "auto", borderRadius: '5px' }}
            onClick={(e) => {
              if (record.Flex2 === 'COLOR') {
                updateColor(record);
              } else if (record.Flex2 === 'IMG' || record.Flex2 === 'MULTIPLE_IMG') {
                updateImage(record);
              } else if (record.Flex2 === 'TEXT') {
                updateText(record);
              }
            }}
          >
            {
              (() => {
                switch (record.Flex2) {
                  case 'COLOR':
                    return 'Update Color';
                  case 'IMG':
                    return 'Update Logo';
                  case 'TEXT':
                    return 'Update Text';
                  case 'MULTIPLE_IMG':
                    return 'Updated Bannar'    
                  default:
                    return '';
                }
              })()
            }
          </Button>
        </Space>
      ),
    },
  ];

  const controller = new window.AbortController();

  useEffect(() => {
    if (!activeTab && uniqueParentNames.length > 0) {
      setActiveTab(uniqueParentNames[0]);
    }
    const formData = new FormData();
    formData.append("OperationId", 1);
    formData.append("CompanyId", userData.CompanyId);
    formData.append("UserId", userData.UserId);
    formData.append("SettingId", null);
    formData.append("Value", "");
    formData.append("UserIP", "12.1.1.12");
    formData.append("SetupDetailId", null);
    postImageRequest("/WebOrderingSetting", formData, controller).then(
      (response) => {
        if (response.error === true) {
          message.error(response.errorMessage);
          return;
        }
        if (response.data.response === false) {
          message.error(response.DataSet.Table.errorMessage);
          return;
        }
        setSettingList(response.data.DataSet.Table);
        setTableData(response.data.DataSet.Table1);
      }
    );

    return () => {
      controller.abort();
    };
  }, [activeTab]);

  const handleTextChange = (e, record) => {
    // console.log('woow', e)
    setSettingsObj({
      ...settingsObj,
      [e.name]: e.value,
      SettingId: record.SetupDetailId,
    });
    console.log('checking settingsObj after text change', settingsObj)
  };

  const handleImageChange = (e, record) => {

    setSettingsObj({
      ...settingsObj,
      [e.target.name]: e.target.files[0],
      SettingId: record.SetupDetailId,
    });
  };

  const handleColorChange = (e, record) => {

    setSettingsObj({
      ...settingsObj,
      Value: e.target.value,
      SettingId: record.SetupDetailId,
    });
  };

  const updateText = (record) => {

    if (settingsObj.SettingId === null || settingsObj.Value === null) {
      message.error("Provide Correct Inputs");
    } else {
      const formData = new FormData();
      formData.append("OperationId", 2);
      formData.append("CompanyId", userData.CompanyId);
      formData.append("UserId", userData.UserId);
      formData.append("SettingId", settingsObj.SettingId);
      formData.append("Value", settingsObj.Value);
      formData.append("UserIP", "12.1.1.12");
      formData.append("SetupDetailId", settingsObj.SettingId);
      console.log('this is your fomData', formData)
      postImageRequest("/WebOrderingSetting", formData, controller).then(
        (response) => {
          if (response.error === true) {
            message.error(response.errorMessage);
            return;
          }
          if (response.data.response === false) {
            message.error(response.DataSet.Table.Error_Message);
            return;
          }
          if (response.data.Response === true) {
            setTableData(response.data.DataSet.Table2);
          }
          message.success("Uploaded Successfully");
        }
      );
      setSettingsObj({
        SettingId: null,
        File: null,
        Value: "",
      });
    }
  };


  const updateImage = (record) => {

    if (settingsObj.SettingId === null || settingsObj.File === null) {
      message.error("Provide Correct Inputs");
    } else {
      const formData = new FormData();
      formData.append("OperationId", 2);
      formData.append("CompanyId", userData.CompanyId);
      formData.append("UserId", userData.UserId);
      formData.append("SettingId", settingsObj.SettingId);
      formData.append("Value", settingsObj.File);
      formData.append("UserIP", "12.1.1.12");
      formData.append("SetupDetailId", settingsObj.SettingId);
      console.log('this is your fomData', formData)
      postImageRequest("/WebOrderingSetting", formData, controller).then(
        (response) => {
          if (response.error === true) {
            message.error(response.errorMessage);
            return;
          }
          if (response.data.response === false) {
            message.error(response.DataSet.Table.Error_Message);
            return;
          }
          if (response.data.Response === true) {
            setTableData(response.data.DataSet.Table2);
          }
          message.success("Uploaded Successfully");
        }
      );
      setSettingsObj({
        SettingId: null,
        File: null,
        Value: "",
      });
    }
  };

  const updateColor = (e) => {
    if (settingsObj.SettingId === null || settingsObj.Value === "") {
      message.error("Provide Correct Inputs");
    } else {
      const formData = new FormData();
      formData.append("OperationId", 3);
      formData.append("CompanyId", userData.CompanyId);
      formData.append("UserId", userData.UserId);
      formData.append("SettingId", settingsObj.SettingId);
      formData.append("Value", settingsObj.Value);
      formData.append("UserIP", "12.1.1.12");
      formData.append("SetupDetailId", settingsObj.SettingId);
      postImageRequest("/WebOrderingSetting", formData, controller).then(
        (response) => {
          if (response.error === true) {
            message.error(response.errorMessage);
            return;
          }
          if (response.data.response === false) {
            message.error(response.DataSet.Table.Error_Message);
            return;
          }
          if (response.data.Response === true) {
            setTableData(response.data.DataSet.Table2);
          }
          message.success("Added Successfully");
        }
      );
      setSettingsObj({
        SettingId: null,
        File: null,
        Value: "",
      });
    }
  };
  return (
    <>
      <Title level={3}>Web Ordering Settings</Title>
      <Menu
        mode="horizontal"
        selectedKeys={[activeTab]}
        onClick={({ key }) => setActiveTab(key)}
      >
        {uniqueParentNames.map((name) => (
          <Menu.Item key={name}>{name}</Menu.Item>
        ))}
      </Menu>
      <Table columns={columns} dataSource={combinedData.filter(item => item.ParentName === activeTab)} rowKey="SetupDetailId" />
    </>
  );
};

export default WebOrdering;
