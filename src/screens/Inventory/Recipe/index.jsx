import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, message, Row, Table } from "antd";
import Title from "antd/lib/typography/Title";
import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormButton from "../../../components/general/FormButton";
import FormCheckbox from "../../../components/general/FormCheckbox";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD,
} from "../../../redux/reduxConstants";

const initialFormValues = {
  RecipeId: null,
  ProductDetailId: null,
  SubRecipeItemId: null,
  ItemCode: "",
  ProductName: "",
  CategoryId: null,
};

const initialSearchValues = {
  RecipeId: null,
  ProductDetailId: null,
  SubRecipeItemId: null,
  ItemCode: "",
  ProductName: "",
  ProductId: null,
  CategoryId: null,
};
const columns = [
  {
    title: "Product",
    dataIndex: "ProductName",
    key: "ProductName",
  },
  {
    title: "Category",
    dataIndex: "CategoryName",
    key: "CategoryName",
  },
  {
    title: "Size",
    dataIndex: "SizeName",
    key: "SizeName",
  },
  {
    title: "Flavour",
    dataIndex: "FlavourName",
    key: "FlavourName",
  },
];

const Recipe = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [updateId, setUpdateId] = useState(null);
  const [recipeModal, setRecipeModal] = useState(false);
  const [recipeDetail, setRecipeDetail] = useState([]);
  const [showProductName, setShowProductName] = useState(false);

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const [recipeDetailObj, setRecipeDetailObj] = useState({
    ProductDetailId: null,
    ConsumeQty: null,
    ConsumeUnitID: null,
    CategoryId: null,
    ProductId: null,
    CategoryName: "",
    ProductSizeName: "",
    ProductName: "",
    OrderModeID: null,
    OrderModeName: "",
    ConsumeUnitID: null,
    UnitName: "",
    EliminateInDeal: false,
  });

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudRecipe",
        { ...initialFormValues, RecipeDetail: recipeDetail },
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
      setShowProductName(true);
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter((item) => item.RecipeId === updateId)[0],
      });
      const filterdRecipeDetail = supportingTable.Table1.filter(
        (e) => e.RecipeId === updateId
      );
      setRecipeDetail([...filterdRecipeDetail]);
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.ProductName = searchFields.ProductName.trim();
    dispatch(
      setInitialState(
        "/CrudRecipe",
        { ...searchFields, RecipeDetail: [] },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(
      deleteRow(
        "/CrudRecipe",
        { ...formFields, RecipeId: id, RecipeDetail: [] },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();

    dispatch(
      submitForm(
        "/CrudRecipe",
        { ...formFields, RecipeDetail: recipeDetail },
        initialFormValues,
        controller,
        userData,
        id,
        (tables) => {
          const tablesToSet = {
            Table: tables.Table1,
            Table1: tables.Table2,
            Table2: tables.Table3,
            Table3: tables.Table4,
            Table4: tables.Table5,
            Table5: tables.Table6,
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
        }
      )
    );
    setRecipeDetailObj({
      ProductDetailId: null,
      ConsumeQty: null,
      ConsumeUnitID: null,
      CategoryId: null,
      ProductId: null,
      CategoryName: "",
      ProductSizeName: "",
      ProductName: "",
    });
    setRecipeDetail([]);
    closeForm();
    setShowProductName(false);
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        value={searchFields.ProductName}
        label="Product Detail"
        name="ProductName"
        onChange={handleSearchChange}
        placeholder="Product Name"
        size={INPUT_SIZE}
      />
      <FormSelect
        listItem={supportingTable.Table7 || []}
        idName="CategoryId"
        valueName="CategoryName"
        size={INPUT_SIZE}
        name="CategoryId"
        label="Category"
        value={searchFields.CategoryId || ""}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const removeRecipeDetail = (record, index) => {
    let arr = [...recipeDetail];
    arr.splice(index, 1);
    setRecipeDetail(arr);
  };

  const modalTabCols = [
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "CategoryName",
    },
    {
      title: "Item",
      dataIndex: "ProductName",
      key: "ProductName",
    },
    {
      title: "Item Detail",
      dataIndex: "ProductSizeName",
      key: "ProductSizeName",
    },
    {
      title: "Quantity",
      dataIndex: "ConsumeQty",
      key: "ConsumeQty",
    },
    {
      title: "Unit",
      dataIndex: "UnitName",
      key: "UnitName",
    },
    {
      title: "Order Mode",
      dataIndex: "OrderModeName",
      key: "OrderModeName",
    },
    {
      title: "Eliminate In Deal",
      key: "EliminateInDeal",
      render: (_, record, index) => (
        <Checkbox
          checked={record.EliminateInDeal}
          onChange={() => {
            let changedRecipeDetail = [...recipeDetail];

            changedRecipeDetail[index].EliminateInDeal =
              !changedRecipeDetail[index].EliminateInDeal;

            setRecipeDetail(changedRecipeDetail);
          }}
        />
      ),
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record, index) => {
        return (
          <Button
            icon={<CloseOutlined />}
            onClick={() => removeRecipeDetail(record, index)}
          />
        );
      },
    },
  ];

  const closeForm = () => {
    setRecipeDetail([]);
    setShowProductName(false);
  };

  const toggleRecipeDetailModal = () => {
    setRecipeModal(!recipeModal);
  };

  const cancelRecipeModal = () => {
    setRecipeModal(false);
    setRecipeDetailObj({
      ProductDetailId: null,
      ConsumeQty: null,
      ConsumeUnitID: null,
      CategoryId: null,
      ProductId: null,
      CategoryName: "",
      ProductSizeName: "",
      ProductName: "",
    });
  };

  const handleRecipeOptionAdd = () => {
    if (
      recipeDetailObj.ProductDetailId !== null &&
      recipeDetailObj.ProductId !== null &&
      recipeDetailObj.CategoryId !== null &&
      recipeDetailObj.ConsumeQty > 0
    ) {
      setRecipeDetail([...recipeDetail, recipeDetailObj]);
      setRecipeDetailObj({
        ProductDetailId: null,
        ConsumeQty: null,
        ConsumeUnitID: null,
        CategoryId: null,
        ProductId: null,
        CategoryName: "",
        ProductSizeName: "",
        ProductName: "",
      });
    } else {
      message.error("Fill all the required fields!");
    }
  };

  const handleProductOptionChange = (data) => {
    let CategoryName, ProductName, ProductSizeName, OrderModeName, Unit;
    if (data.name === "ConsumeQty") {
      if (parseInt(data.value, 0) > 5000) {
        message.error("Maximum consume quantity is 5000");
        return;
      }
    }

    if (data.name === "CategoryId") {
      if (data.value === null) {
        setRecipeDetailObj({
          ...recipeDetailObj,
          [data.name]: data.value,
          ProductId: null,
          ProductDetailId: null,
        });
      } else {
        CategoryName = supportingTable.Table2?.filter(
          (e) => e.CategoryId === data.value
        )[0].CategoryName;
        setRecipeDetailObj({
          ...recipeDetailObj,
          [data.name]: data.value,
          CategoryName: CategoryName,
        });
      }
    } else if (data.name === "ProductId") {
      if (data.value === null) {
        setRecipeDetailObj({
          ...recipeDetailObj,
          [data.name]: data.value,
          ProductDetailId: null,
        });
      } else {
        ProductName = supportingTable.Table3?.filter(
          (e) => e.ProductId === data.value
        )[0].ProductName;
        setRecipeDetailObj({
          ...recipeDetailObj,
          [data.name]: data.value,
          ProductName: ProductName,
        });
      }
    } else if (data.name === "ProductDetailId") {
      if (data.value === null) {
        ProductSizeName = "None";
      } else {
        ProductSizeName = supportingTable.Table5?.filter(
          (e) => e.ProductDetailId === data.value
        )[0].ProductSizeName;
        Unit = supportingTable.Table5?.filter(
          (e) => e.ProductDetailId === data.value
        )[0];
      }
      setRecipeDetailObj({
        ...recipeDetailObj,
        [data.name]: data.value,
        ProductSizeName: ProductSizeName,
        UnitName: Unit.UnitName,
        ConsumeUnitID: Unit.UnitId,
      });
    } else if (data.name === "SetupDetailId") {
      if (data.value === null) OrderModeName = "None";
      else
        OrderModeName = supportingTable.Table6?.filter(
          (e) => e.SetupDetailId === data.value
        )[0].SetupDetailName;
      setRecipeDetailObj({
        ...recipeDetailObj,
        OrderModeID: data.value,
        OrderModeName: OrderModeName,
      });
    } else {
      setRecipeDetailObj({
        ...recipeDetailObj,
        [data.name]: data.value,
      });
    }
  };

  const formPanel = (
    <Fragment>
      <ModalComponent
        isModalVisible={recipeModal}
        okText="Add"
        cancelText="Close"
        closable={false}
        width="45vw"
        title={
          <Title level={4} style={{ marginBottom: 0 }}>
            Add Recipe Item Form
          </Title>
        }
        footer={null}
      >
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          <Col span={12}>
            <FormSelect
              listItem={supportingTable.Table2 || []}
              idName="CategoryId"
              valueName="CategoryName"
              size={INPUT_SIZE}
              name="CategoryId"
              label="Category"
              value={recipeDetailObj.CategoryId || ""}
              onChange={handleProductOptionChange}
              required={true}
            />
          </Col>
          <Col span={12}>
            <FormSelect
              listItem={
                (recipeDetailObj.CategoryId !== null &&
                  supportingTable.Table3?.filter(
                    (e) => e.ProductCategoryId === recipeDetailObj.CategoryId
                  )) ||
                []
              }
              idName="ProductId"
              valueName="ProductName"
              size={INPUT_SIZE}
              name="ProductId"
              label="Item"
              value={recipeDetailObj.ProductId || ""}
              onChange={handleProductOptionChange}
            />
          </Col>
          <Col span={12}>
            <FormSelect
              listItem={
                (recipeDetailObj.ProductId !== null &&
                  supportingTable.Table5?.filter(
                    (e) => e.ProductId === recipeDetailObj.ProductId
                  )) ||
                []
              }
              idName="ProductDetailId"
              valueName="ProductSizeName"
              size={INPUT_SIZE}
              name="ProductDetailId"
              label="Item Detail"
              value={recipeDetailObj.ProductDetailId || ""}
              onChange={handleProductOptionChange}
            />
          </Col>
          <Col span={12}>
            <FormTextField
              value={recipeDetailObj.UnitName}
              label="Consume Unit"
              size={INPUT_SIZE}
              disabled={true}
            />
          </Col>
          <Col span={12}>
            <FormTextField
              value={recipeDetailObj.ConsumeQty}
              label="Quantity"
              name="ConsumeQty"
              onChange={handleProductOptionChange}
              required={true}
              placeholder="Quantity"
              size={INPUT_SIZE}
              // isNumber={true}
              min="0"
              type="number"
              maxLength={4}
            />
          </Col>
        </Row>
        <br />
        <div style={{ border: "0.5px solid lightgray" }} />
        <br />
        <Row>
          <Col span={6}>
            <FormCheckbox
              size={INPUT_SIZE}
              name="EliminateInDeal"
              label="Eliminate In Deal"
              checked={recipeDetailObj.EliminateInDeal}
              onChange={handleProductOptionChange}
              // required={true}
            />
          </Col>
          <Col span={18}>
            <FormSelect
              listItem={supportingTable.Table6 || []}
              idName="SetupDetailId"
              valueName="SetupDetailName"
              size={INPUT_SIZE}
              name="SetupDetailId"
              label="Order Mode"
              value={recipeDetailObj.OrderModeID || ""}
              onChange={handleProductOptionChange}
              // required={true}
            />
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            justifyContent: "flex-end",
          }}
          align="right"
        >
          <Button onClick={cancelRecipeModal} style={{ marginRight: 10 }}>
            Close
          </Button>
          <Button type="primary" onClick={handleRecipeOptionAdd}>
            Add
          </Button>
        </div>
      </ModalComponent>

      {showProductName === false && (
        <FormSelect
          colSpan={8}
          listItem={supportingTable.Table4 || []}
          idName="ProductDetailId"
          valueName="ProductSizeName"
          size={INPUT_SIZE}
          name="ProductDetailId"
          label="Product"
          value={formFields.ProductDetailId || ""}
          onChange={handleFormChange}
          required={true}
        />
      )}
      {showProductName && (
        <>
          <Col>
            <Col>
              <Row>
                <p>Product</p>
              </Row>
            </Col>
            <Col>
              <Row>
                <p>
                  {formFields.ProductName} - {formFields.SizeName} -{" "}
                  {formFields.FlavourName}{" "}
                </p>
              </Row>
            </Col>
          </Col>
        </>
      )}
      <Col span={24}>
        <Table
          columns={modalTabCols}
          dataSource={recipeDetail}
          style={{ marginTop: 16 }}
          pagination={false}
          size="small"
        />
      </Col>
      <Col span={24}>
        <Row>
          <FormButton
            size={BUTTON_SIZE}
            title="Add Item"
            onClick={toggleRecipeDetailModal}
            icon={<PlusOutlined />}
          />
        </Row>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Recipe"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="RecipeId"
      editRow={setUpdateId}
      fields={initialFormValues}
      disableSaveAndSubmit={recipeDetail.length === 0}
      onFormClose={closeForm}
    />
  );
};

export default Recipe;
