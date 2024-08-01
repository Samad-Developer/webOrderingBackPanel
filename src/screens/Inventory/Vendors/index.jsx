import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Table } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormButton from "../../../components/general/FormButton";
import FormSearchSelect from "../../../components/general/FormSearchSelect";
import FormTextField from "../../../components/general/FormTextField";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm
} from "../../../redux/actions/basicFormAction";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD
} from "../../../redux/reduxConstants";

const initialFormValues = {
  VendorId: null,
  VendorName: "",
  Address: "",
  ContactNumber: "",
  Email: "",
  ProductDetailList: []
};

const initialSearchValues = {
  VendorId: null,
  VendorName: "",
  Address: "",
  ContactNumber: "",
  Email: ""
};
const columns = [
  {
    title: "Vendor Name",
    dataIndex: "VendorName",
    key: "VendorName"
  },
  {
    title: "Address",
    dataIndex: "Address",
    key: "Address"
  },
  {
    title: "Contact Number",
    dataIndex: "ContactNumber",
    key: "ContactNumber"
  },
  {
    title: "Email",
    dataIndex: "Email",
    key: "Email"
  }
];

const Vendor = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [updateId, setUpdateId] = useState(null);
  const [pocModal, setPocModal] = useState(false);
  const [pocs, setPocs] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [productDetailList, setProductDetailList] = useState([]);

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable
  } = useSelector((state) => state.basicFormReducer);

  const [pocObj, setPocObj] = useState({
    PocName: "",
    PocContact: "",
    Email: ""
  });

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudVendor",
        { ...initialFormValues, PocDetail: pocs },
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
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter((item) => item.VendorId === updateId)[0]
      });
      const filterdPoc = supportingTable.Table1.filter(
        (e) => e.VendorId === updateId
      );
      const filterProductDetail = supportingTable?.Table3.filter(
        (x) => x.VendorId === updateId
      );
      setPocs([...filterdPoc]);
      setProductDetailList(
        supportingTable.Table2.filter((x) =>
          filterProductDetail.some(
            (y) => y.ProductDetailId === x.ProductDetailId
          )
        )
      );
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
    searchFields.VendorName = searchFields.VendorName.trim();
    dispatch(
      setInitialState(
        "/CrudVendor",
        {
          ...searchFields,
          PocDetail: [],
          ProductDetailStr: ""
        },
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
        "/CrudVendor",
        { ...formFields, VendorId: id, PocDetail: [] },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudVendor",
        {
          ...formFields,
          PocDetail: pocs,
          ProductDetailStr: productDetailList
            .map((x) => x.ProductDetailId)
            .join(",")
        },
        initialFormValues,
        controller,
        userData,
        id,
        (tables) => {
          const tablesToSet = {
            Table: tables.Table1,
            Table1: tables.Table2
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
        }
      )
    );
    setPocObj({
      PocName: "",
      PocContact: "",
      Email: ""
    });
    setPocs([]);
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Vendor Name"
        name="VendorName"
        size={INPUT_SIZE}
        value={searchFields.VendorName}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Contact Number"
        name="ContactNumber"
        size={INPUT_SIZE}
        value={searchFields.ContactNumber}
        onChange={handleSearchChange}
        isNumber="true"
        maxLength={11}
      />
      <FormTextField
        colSpan={4}
        label="Email"
        name="Email"
        size={INPUT_SIZE}
        value={searchFields.Email}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const removePoc = (record, index) => {
    let arr = pocs;
    arr.splice(index, 1);
    setPocs([...arr]);
  };

  const productTabCols = [
    {
      title: "Product Detail",
      dataIndex: "ProductDetailName",
      key: "ProductDetailName"
    },
    {
      title: "Action",
      key: "ProductDetailName",
      render: (_, record, index) => (
        <Button
          onClick={() => {
            let pdl = [...productDetailList];
            let list = pdl.filter(
              (x) => x.ProductDetailId !== record.ProductDetailId
            );
            setProductDetailList(list);
          }}
          type="text"
        >
          Delete
        </Button>
      )
    }
  ];

  const modalTabCols = [
    {
      title: "Name",
      dataIndex: "PocName",
      key: "PocName"
    },
    {
      title: "Contact",
      dataIndex: "PocContact",
      key: "PocContact"
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email"
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record, index) => {
        return (
          <Button
            icon={<CloseOutlined />}
            onClick={() => removePoc(record, index)}
          />
        );
      }
    }
  ];

  const togglePOCModal = () => {
    setPocModal(!pocModal);
  };

  const cancelPocModal = () => {
    setPocModal(false);
    setPocObj({
      PocName: "",
      PocContact: "",
      Email: ""
    });
  };

  const handlePocOptionAdd = (e) => {
    e.preventDefault();
    if (formFields.BranchId === null) {
      message.error("Select Branch First!");
      return;
    }
    if (
      pocObj.PocName !== "" &&
      pocObj.PocContact !== "" &&
      pocObj.Email !== ""
    ) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(pocObj.Email)) {
        setPocs([...pocs, pocObj]);
        setPocObj({
          PocName: "",
          PocContact: "",
          Email: ""
        });
        setPocModal(false);
      } else message.warn("You have entered an invalid email!");
    } else {
      message.error("Fill all the required fields!");
    }
  };

  const handlePocOptionChange = (data) => {
    setPocObj({
      ...pocObj,
      [data.name]: data.value
    });
  };
  const closeForm = () => {
    //setPocObj({ PocName: "", PocContact: "", Email: "" });
    setPocs([]);
  };

  const addProductDetail = () => {
    if (productDetailList?.some((x) => x.ProductDetailId === productDetail)) {
      message.error("Product Already added in the List");
      return;
    }
    let copyProductDetailObj = supportingTable?.Table2.find(
      (x) => x.ProductDetailId === productDetail
    );
    setProductDetailList([...productDetailList, copyProductDetailObj]);
    setProductDetail(null);
  };

  const formPanel = (
    <Fragment>
      <ModalComponent
        isModalVisible={pocModal}
        handleCancel={cancelPocModal}
        handleOk={handlePocOptionAdd}
        okText="Add"
        cancelText="Close"
        closable={true}
        width="60vw"
      >
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          <Col span={6}>
            <FormTextField
              value={pocObj.PocName}
              label="POC Name"
              name="PocName"
              onChange={handlePocOptionChange}
              required={true}
              placeholder="POC Name"
              size={INPUT_SIZE}
            />
          </Col>
          <Col span={6}>
            <FormTextField
              value={pocObj.PocContact}
              label="POC Contact"
              name="PocContact"
              onChange={handlePocOptionChange}
              required={true}
              placeholder="POC Contact"
              size={INPUT_SIZE}
              isNumber="true"
              maxLength={11}
              min={11}
            />
          </Col>
          <Col span={6}>
            <FormTextField
              value={pocObj.Email}
              label="POC Email"
              name="Email"
              onChange={handlePocOptionChange}
              required={true}
              placeholder="POC Email"
              size={INPUT_SIZE}
              type="email"
            />
          </Col>
        </Row>
      </ModalComponent>

      <FormTextField
        colSpan={8}
        label="Vendor Name"
        name="VendorName"
        size={INPUT_SIZE}
        value={formFields.VendorName}
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Address"
        name="Address"
        size={INPUT_SIZE}
        value={formFields.Address}
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Contact Number"
        name="ContactNumber"
        size={INPUT_SIZE}
        value={formFields.ContactNumber}
        onChange={handleFormChange}
        required={true}
        maxLength={11}
        isNumber="true"
        minLength={11}
        pattern={".{7,11}"}
      />
      <FormTextField
        colSpan={8}
        label="Email"
        name="Email"
        size={INPUT_SIZE}
        value={formFields.Email}
        onChange={handleFormChange}
        required={true}
        type="email"
      />
      <Col span={24}>
        <Table
          columns={modalTabCols}
          dataSource={pocs}
          style={{ marginTop: 16 }}
          size="small"
          pagination={false}
        />
      </Col>
      <Col span={24}>
        <Row>
          <FormButton
            size={BUTTON_SIZE}
            title="Add POC"
            onClick={togglePOCModal}
            icon={<PlusOutlined />}
          />
        </Row>
      </Col>
      <Col span={24}>
        <Row style={{ marginTop: 16 }}>
          <FormSearchSelect
            colSpan={8}
            listItem={
              supportingTable?.Table2?.filter(
                (x) =>
                  !productDetailList.some(
                    (y) => y.ProductDetailId === x.ProductDetailId
                  )
              ) || []
            }
            idName="ProductDetailId"
            valueName="ProductDetailName"
            value={productDetail}
            onChange={(e) => setProductDetail(e.value)}
          />
          &nbsp;
          <FormButton
            size={BUTTON_SIZE}
            title="Add Product Detail"
            onClick={addProductDetail}
            icon={<PlusOutlined />}
            disabled={productDetail === null}
          />
        </Row>
      </Col>
      <Col span={24}>
        <Table
          columns={productTabCols}
          dataSource={productDetailList}
          style={{ marginTop: 16 }}
          size="small"
          pagination={false}
        />
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Vendor"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="VendorId"
      editRow={setUpdateId}
      fields={initialFormValues}
      onFormClose={closeForm}
    />
  );
};

export default Vendor;
