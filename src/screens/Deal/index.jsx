import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import FormCheckbox from "../../components/general/FormCheckbox";
import ModalComponent from "../../components/formComponent/ModalComponent";
import FormButton from "../../components/general/FormButton";
import {
  resetState,
  setInitialState,
  submitForm,
  setSearchFieldValue
} from "../../redux/actions/basicFormAction";
import { Row, Col, message, Table, Popconfirm, Space, Button } from "antd";
import { SET_SUPPORTING_TABLE } from "../../redux/reduxConstants";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";

const initialFormValues = {
  ProductDetailId: null,
  tblDealDescription: [],
  tblDealItemDetail: [],
  CategoryId: null,
  DealName: null
};

const initialSearchValues = {
  CategoryId: null,
  DealName: null
};

const columns = [
  {
    title: "Category Name",
    dataIndex: "CategoryName",
    key: "CategoryName"
  },
  {
    title: "Deal Name",
    dataIndex: "ProductName",
    key: "ProductName"
  },
  {
    title: "Price",
    dataIndex: "Price",
    key: "Price"
  }
];

const Deal = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const { searchFields, itemList, supportingTable } = useSelector(
    (state) => state.basicFormReducer
  );

  const [isEditModalMode, setIsEditModalMode] = useState(false);

  const [updateId, setUpdateId] = useState(null);
  const [openDealModel, setOpenDealModel] = useState(false);
  const [tblDealItemDetailObj, setTblDealItemDetailObj] = useState({
    DealItemId: null,
    DealOptionName: "",
    ProductDetailId: null,
    Quantity: 1,
    IsToppingAllowed: false,
    IsDirectDealPunch: false,
    SizeId: null,
    ProductPropertyId: null,
    UserIP: "1.1.1.1",
    SortOrder: 0,
    SizeName: "",
    ProductPropertyName: "",
    MaxQuantity: 1
  });
  const [tblDealDescriptionObj, settblDealDescriptionObj] = useState({
    ProductDetailId: null
  });

  const [tblDealDescription, setTblDealDescription] = useState([]);
  const [tblDealItemDetail, setTblDealItemDetail] = useState([]);

  const [tempResObj, setTempResObj] = useState([]);
  const toggleDealModal = () => {
    if (tblDealItemDetailObj.ProductDetailId) {
      setOpenDealModel(!openDealModel);
    } else {
      message.error("Please Select Prduct");
    }
  };

  const repopulateModal = (record) => {
    setIsEditModalMode(!isEditModalMode);
    setTblDealItemDetailObj({});
    setTblDealDescription([]);
    const dealDescArr = [];
    let obj = {};

    obj.DealItemId = record.DealItemId;
    obj.DealOptionName = record.DealOptionName;
    obj.ProductDetailId = record.ProductDetailId;
    obj.Quantity = record.Quantity;
    obj.IsToppingAllowed = record.IsToppingAllowed;
    obj.SizeId = record.SizeId;
    obj.ProductPropertyId = record.ProductPropertyId;
    obj.UserIP = record.UserIP;
    obj.SortOrder = record.SortOrder;
    obj.SizeName = record.SizeName;
    obj.ProductPropertyName = record.ProductPropertyName;
    obj.MaxQuantity = record.MaxQuantity;
    record.descItem.map((desc) => {
      dealDescArr.push(desc);
    });
    setTblDealItemDetailObj(obj);
    setTblDealDescription(dealDescArr);
  };

  const columnForDealOption = [
    {
      title: "Deal Option Name",
      dataIndex: "DealOptionName",
      key: "DealOptionName"
    },
    {
      title: "Product Property Name",
      key: "ProductPropertyName",
      render: (record) => {
        const obj = supportingTable?.Table4?.find(
          (x) => x.SetupDetailId === record.ProductPropertyId
        );
        return (
          <Fragment>{obj === undefined ? "" : obj.SetupDetailName}</Fragment>
        );
      }
    },
    {
      title: "Min Quantity",
      dataIndex: "Quantity",
      key: "Quantity"
    },
    {
      title: "Max Quantity",
      dataIndex: "MaxQuantity",
      key: "MaxQuantity"
    },
    {
      title: "Size Name",
      dataIndex: "SizeName",
      key: "SizeName"
    },
    {
      title: "Action",
      key: "action",
      width: 160,
      render: (record) => {
        return (
          <Fragment>
            <Space size="middle">
              <Button
                onClick={() => {
                  toggleDealModal();
                  repopulateModal(record);
                }}
                type="text"
                icon={<EditFilled className="blueIcon" />}
              ></Button>
            </Space>
            <Space size="middle">
              <Popconfirm
                title="Are you surely want to delete this row?"
                onConfirm={() => {
                  const copyOfResObj = tempResObj;
                  const index = tempResObj.findIndex((x) => x === record);
                  copyOfResObj.splice(index, 1);
                  setTempResObj([...copyOfResObj]);
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  icon={<DeleteFilled className="redIcon" />}
                ></Button>
              </Popconfirm>
            </Space>
          </Fragment>
        );
      }
    }
  ];

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudDeal",
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
      setTblDealItemDetailObj({
        ...tblDealItemDetailObj,
        ProductDetailId: updateId
      });

      const finalSetArr = [];

      supportingTable.Table1.map((item) => {
        if (item.ProductDetailId === updateId) {
          let obj = {};
          const arr = [];
          supportingTable.Table2.map((detail) => {
            obj.DealItemId = item.DealItemId;
            obj.DealOptionName = item.DealOptionName;
            obj.ProductDetailId = item.ProductDetailId;
            obj.Quantity = item.Quantity;
            obj.MaxQuantity = item.MaxQuantity;
            obj.IsToppingAllowed = item.IsToppingAllowed;
            obj.SizeId = item.SizeId;
            obj.ProductPropertyId = item.ProductPropertyId;
            obj.UserIP = item.UserIP;
            obj.SortOrder = item.SortOrder;
            obj.SizeName = supportingTable.Table3.filter((i) => {
              if (i.SizeId === item.SizeId) {
                return i;
              }
            })[0].SizeName;
            obj.ProductPropertyName = supportingTable.Table4.filter((i) => {
              if (i.ProductPropertyId === item.SetupDetailId) {
                return i;
              }
            })[0].SetupDetailName;
            if (detail.DealItemId === item.DealItemId) {
              arr.push({
                DealDescId: detail.DealDescId,
                DealItemId: detail.DealItemId,
                ProductDetailId: detail.ProductDetailId,
                SortOrder: detail.SortOrder,
                Price: detail.Price,
                ProductDetailName: detail.ProductDetailName
              });
            }
          });
          obj.descItem = arr;
          finalSetArr.push(obj);
        }
      });
      setTempResObj(finalSetArr);
    }
    setUpdateId(null);
  }, [updateId]);

  const cancelDealModal = () => {
    setOpenDealModel(false);
    setIsEditModalMode(false);
    setTblDealItemDetailObj({
      ...tblDealItemDetailObj,
      DealItemId: null,
      DealOptionName: "",
      Quantity: 0,
      IsToppingAllowed: false,
      SizeId: null,
      ProductPropertyId: null,
      UserIP: "1.1.1.1",
      SortOrder: 0,
      SizeName: "",
      ProductPropertyName: "",
      MaxQuantity: 0
    });
    setTblDealDescription([]);
  };

  const closeForm = () => {
    setTempResObj([]);
    setTblDealItemDetailObj({
      DealItemId: null,
      DealOptionName: "",
      ProductDetailId: null,
      Quantity: 0,
      IsToppingAllowed: false,
      SizeId: null,
      ProductPropertyId: null,
      UserIP: "1.1.1.1",
      SortOrder: 0,
      SizeName: "",
      ProductPropertyName: "",
      MaxQuantity: 0
    });
    setTblDealDescription([]);
  };

  const handleDealOptionAdd = () => {
    if (isEditModalMode) {
      if (
        tblDealItemDetailObj.DealOptionName !== "" &&
        tblDealItemDetailObj.SizeId !== null &&
        tblDealItemDetailObj.Quantity !== 0 &&
        parseInt(tblDealItemDetailObj.MaxQuantity, 0) !== 0 &&
        tblDealItemDetailObj.MaxQuantity !== "" &&
        tblDealItemDetailObj.SortOrder !== ""
      ) {
        if (tblDealItemDetailObj.Quantity !== "") {
          const tempObjToReplace = {
            ...tblDealItemDetailObj,
            descItem: tblDealDescription
          };

          const copyOfTemp = tempResObj;

          const index = copyOfTemp.findIndex(
            (x) => x.DealItemId === tblDealItemDetailObj.DealItemId
          );

          copyOfTemp[index] = tempObjToReplace;

          setTempResObj([...copyOfTemp]);
          setIsEditModalMode(false);
          toggleDealModal();
        } else {
          message.error("Please enter the required fields!");
        }
      } else {
        message.error("Please enter the required fields!");
      }
    } else {
      if (
        tblDealItemDetailObj.DealOptionName !== "" &&
        tblDealItemDetailObj.SizeId !== null &&
        tblDealItemDetailObj.Quantity !== 0 &&
        parseInt(tblDealItemDetailObj.MaxQuantity, 0) !== 0 &&
        tblDealItemDetailObj.MaxQuantity !== "" &&
        tblDealItemDetailObj.SortOrder !== ""
      ) {
        if (tblDealItemDetailObj.Quantity !== "") {
          const tempObj = {
            ...tblDealItemDetailObj,
            descItem: tblDealDescription
          };

          setTempResObj([...tempResObj, tempObj]);

          setTblDealDescription([]);

          setTblDealItemDetail([...tblDealItemDetail, tblDealItemDetailObj]);
          settblDealDescriptionObj({
            ...tblDealDescriptionObj,
            ProductDetailId: null
          });

          setTblDealItemDetailObj({
            ...tblDealItemDetailObj,
            DealItemId: null,
            DealOptionName: "",
            Quantity: 0,
            IsToppingAllowed: false,
            SizeId: null,
            ProductPropertyId: null,
            UserIP: "1.1.1.1",
            SortOrder: 0,
            SizeName: "",
            ProductPropertyName: "",
            MaxQuantity: 0
          });
          setIsEditModalMode(false);
          toggleDealModal();
        } else {
          message.error("Please enter the required fields!");
        }
      } else {
        message.error("Please enter the required fields!");
      }
    }
  };

  const handleDealOptionChange = (data) => {
    if (data.name === "ProductPropertyId") {
      const name = supportingTable.Table4.filter((item) => {
        return item.SetupDetailId === data.value;
      })[0];
      setTblDealItemDetailObj({
        ...tblDealItemDetailObj,
        ProductPropertyName: name !== undefined ? name.SetupDetailName : "",
        [data.name]: data.value
      });
    } else if (data.name === "SizeId") {
      const name = supportingTable.Table3.filter((item) => {
        return item.SizeId === data.value;
      })[0];
      setTblDealItemDetailObj({
        ...tblDealItemDetailObj,
        SizeName: name !== undefined ? name.SizeName : "",
        [data.name]: data.value
      });
    } else if (data.name === "Quantity") {
      setTblDealItemDetailObj({
        ...tblDealItemDetailObj,
        [data.name]: data.value === "" ? "" : parseInt(data.value)
      });
    } else {
      setTblDealItemDetailObj({
        ...tblDealItemDetailObj,
        [data.name]: data.value
      });
    }
  };

  const handleDealDescChange = (data) => {
    const name = supportingTable.Table5.filter((item) => {
      return item.ProductDetailId === data.value;
    })[0].ProductName;
    settblDealDescriptionObj({
      ...tblDealDescriptionObj,
      [data.name]: ""
    });
    tblDealDescriptionObj.ProductDetailId;
    setTblDealDescription([
      ...tblDealDescription,
      {
        DealDescId: null,
        DealItemId: tblDealItemDetailObj.DealItemId,
        ProductDetailId: data.value,
        SortOrder: 0,
        Price: 0,
        ProductDetailName: name
      }
    ]);
  };

  const addAllSizeProducts = () => {
    const allProducts = supportingTable.Table5.filter((item) => {
      return item.SizeId === tblDealItemDetailObj.SizeId;
    });
    let list = allProducts.map((x) => ({
      DealDescId: null,
      DealItemId: tblDealItemDetailObj.DealItemId,
      ProductDetailId: x.ProductDetailId,
      SortOrder: tblDealItemDetailObj.SortOrder,
      Price: 0,
      ProductDetailName: x.ProductName
    }));
    setTblDealDescription([...tblDealDescription, ...list]);
  };

  const handleDealDescriptionChange = (data, i) => {
    let arrCopy = tblDealDescription;
    let item = arrCopy[i];
    item = { ...item, [data.name]: data.value };
    arrCopy[i] = item;

    setTblDealDescription([...arrCopy]);
  };

  const removeDealDesc = (id) => {
    let copyOfArr = tblDealDescription;
    copyOfArr.splice(id, 1);
    setTblDealDescription([...copyOfArr]);
  };

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    // setFormFields({ ...formFields, [data.name]: data.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudDeal",
        {
          ProductDetailId: null,
          tblDealDescription: [],
          tblDealItemDetail: [],
          CategoryId: searchFields.CategoryId,
          DealName: searchFields.DealName
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, a, _, closeForm) => {
    e.preventDefault();

    let tblDealDisArr = [];
    let tblDeakItemArr = [];

    tempResObj.map((item, i) => {
      item.descItem.map((desc) => {
        const obj = {
          DealDescId: null,
          DealItemId: desc.DealItemId ? desc.DealItemId : i,
          ProductDetailId: desc.ProductDetailId,
          SortOrder: desc.SortOrder,
          Price: desc.Price,
          ProductDetailName: desc.ProductDetailName
        };
        tblDealDisArr.push(obj);
      });

      tblDeakItemArr.push({
        DealItemId: item.DealItemId ? item.DealItemId : i,
        DealOptionName: item.DealOptionName,
        ProductDetailId: item.ProductDetailId,
        Quantity: item.Quantity,
        IsToppingAllowed: item.IsToppingAllowed,
        SizeId: item.SizeId,
        ProductPropertyId: item.ProductPropertyId,
        UserIP: item.UserIP,
        SortOrder: item.SortOrder,
        SizeName: item.SizeName,
        ProductPropertyName: item.ProductPropertyName,
        MaxQuantity: item.MaxQuantity
      });
    });

    if (tblDealDisArr.length > 0 && tblDeakItemArr.length > 0) {
      dispatch(
        submitForm(
          "/CrudDeal",
          {
            ProductDetailId: tblDealItemDetailObj.ProductDetailId,
            tblDealDescription: tblDealDisArr,
            tblDealItemDetail: tblDeakItemArr,
            CategoryId: null,
            DealName: null
          },
          "",
          controller,
          userData,
          2,
          (tables) => {
            delete tables.Table;
            const tablesToSet = {
              Table1: tables.Table2,
              Table2: tables.Table3,
              Table3: tables.Table4,
              Table4: tables.Table5,
              Table5: tables.Table6,
              Table6: tables.Table7
            };
            dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
            closeForm();
          }
        )
      );

      setTblDealDescription([]);

      setTblDealItemDetail([]);

      setTempResObj([]);
    } else {
      message.error("Please Add Deal Options");
    }
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table6 ? supportingTable.Table6 : []}
        idName="CategoryId"
        valueName="CategoryName"
        size={INPUT_SIZE}
        name="CategoryId"
        label="Product Category"
        value={searchFields.CategoryId}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Deal Name"
        name="DealName"
        size={INPUT_SIZE}
        value={searchFields.DealName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <ModalComponent
        isModalVisible={openDealModel}
        handleCancel={cancelDealModal}
        handleOk={handleDealOptionAdd}
        okText="Add"
        cancelText="Close"
        closable={true}
        width="60vw"
      >
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          <Col span={12}>
            <FormTextField
              value={tblDealItemDetailObj.DealOptionName}
              label="Deal Option Name"
              name="DealOptionName"
              onChange={handleDealOptionChange}
              required={true}
              placeholder="Deal option Name"
              size={INPUT_SIZE}
            />
          </Col>
          <Col span={6}>
            <FormTextField
              isNumber="true"
              label="Min Quantity"
              value={tblDealItemDetailObj.Quantity}
              name="Quantity"
              onChange={handleDealOptionChange}
              required={true}
              placeholder="Quantity"
              size={INPUT_SIZE}
            />
          </Col>
          <Col span={6}>
            <FormTextField
              isNumber="true"
              label="Max Quantity"
              value={tblDealItemDetailObj.MaxQuantity}
              name="MaxQuantity"
              onChange={handleDealOptionChange}
              required={true}
              placeholder="Max Quantity"
              size={INPUT_SIZE}
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          <Col span={12}>
            <FormSelect
              colSpan={24}
              listItem={supportingTable.Table3 || []}
              idName="SizeId"
              valueName="SizeName"
              size={INPUT_SIZE}
              name="SizeId"
              label="Size"
              required={true}
              value={tblDealItemDetailObj.SizeId}
              onChange={handleDealOptionChange}
              allowClear={false}
            />
          </Col>
          <Col span={4} className="bottomContent">
            <Button type="ghost" onClick={addAllSizeProducts}>
              Add All Size Products
            </Button>
          </Col>
          <Col span={4} className="bottomContent">
            <FormCheckbox
              name="IsToppingAllowed"
              label="Is Topping Allowed"
              checked={tblDealItemDetailObj.IsToppingAllowed}
              onChange={handleDealOptionChange}
            />
          </Col>
          <Col span={4} className="bottomContent">
            <FormCheckbox
              name="IsDirectDealPunch"
              label="Is Direct Deal"
              checked={tblDealItemDetailObj.IsDirectDealPunch}
              onChange={handleDealOptionChange}
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          <Col span={12}>
            <FormSelect
              listItem={supportingTable.Table4 || []}
              idName="SetupDetailId"
              valueName="SetupDetailName"
              size={INPUT_SIZE}
              name="ProductPropertyId"
              label="Product Property"
              value={tblDealItemDetailObj.ProductPropertyId}
              onChange={handleDealOptionChange}
              allowClear={false}
            />
          </Col>
          <Col span={12}>
            <FormTextField
              isNumber="true"
              value={tblDealItemDetailObj.SortOrder}
              label="Sort Order"
              name="SortOrder"
              onChange={handleDealOptionChange}
              required={true}
              placeholder="SortOrder"
              size={INPUT_SIZE}
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          <Col span={24}>
            <FormSelect
              listItem={
                (supportingTable.Table5 &&
                  supportingTable.Table5.filter((item) => {
                    return item.IsDeal === false;
                  })) ||
                []
              }
              idName="ProductDetailId"
              valueName="ProductSizeName"
              size={INPUT_SIZE}
              name="ProductDetailId"
              label="Product Detail"
              value={tblDealDescriptionObj.ProductDetailId}
              onChange={handleDealDescChange}
              placeholder="Select Items To Include In Deal Option"
              allowClear={false}
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          {tblDealDescription.length > 0 &&
            tblDealDescription.map((deal, i) => {
              return (
                <Fragment key={i}>
                  <Col span={12}>
                    <FormTextField
                      disabled={true}
                      label="Deal Products"
                      value={
                        supportingTable.Table5.filter((item) => {
                          return item.ProductDetailId === deal.ProductDetailId;
                        })[0].ProductSizeName
                      }
                      textColor="black"
                    />
                  </Col>
                  <Col span={11}>
                    <FormTextField
                      isNumber="true"
                      label="Additional Price"
                      value={deal.Price}
                      textColor="black"
                      name="Price"
                      onChange={(event) => {
                        handleDealDescriptionChange(event, i);
                      }}
                      placeholder="Price"
                    />
                  </Col>
                  <Col span={1} className="bottomContent">
                    {/* <p style={{ marginBottom: 5, marginLeft: 5, font: 0.01 }}>
                      {"."}
                    </p> */}
                    <FormButton
                      onClick={() => {
                        removeDealDesc(i);
                      }}
                      type="text"
                      icon={<DeleteFilled className="redIcon" />}
                      size={BUTTON_SIZE}
                    />
                  </Col>
                </Fragment>
              );
            })}
        </Row>
      </ModalComponent>

      <FormSelect
        colSpan={8}
        listItem={
          (supportingTable.Table5 &&
            supportingTable.Table5.filter((item) => {
              return item.IsDeal === true;
            })) ||
          []
        }
        idName="ProductDetailId"
        valueName="ProductName"
        size={INPUT_SIZE}
        name="ProductDetailId"
        label="Product Detail"
        value={tblDealItemDetailObj.ProductDetailId}
        onChange={handleDealOptionChange}
        disabled={true}
      />

      <Col span={24}>
        <Table
          columns={columnForDealOption}
          rowKey={(record) => record.ProductDetailId}
          dataSource={tempResObj}
          pagination={false}
        />
      </Col>

      <Col span={24}>
        <Row>
          <FormButton
            size={BUTTON_SIZE}
            title="Add Deal Option"
            onClick={toggleDealModal}
            icon={<PlusOutlined />}
          />
        </Row>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Deal"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      fields={initialFormValues}
      tableColumn={columns}
      tableRows={itemList}
      editRow={setUpdateId}
      actionID="ProductDetailId"
      onFormClose={closeForm}
      hideAddButton={true}
      hideDelete={true}
    />
  );
};

export default Deal;
