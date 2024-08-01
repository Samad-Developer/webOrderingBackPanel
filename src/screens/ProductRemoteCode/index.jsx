import React, { Fragment, useEffect, useState } from 'react';
import BasicFormComponent from '../../components/formComponent/BasicFormComponent';
import FormSearchSelect from "../../components/general/FormSearchSelect";
import FormTextField from '../../components/general/FormTextField';
import { Button, Col, message, Row, Space, Table, Input } from "antd";
import FormSelect from '../../components/general/FormSelect';
import { postRequest } from '../../services/mainApp.service';

const ProductRemoteCode = () => {
    const controller = new window.AbortController();
    const [itemsList, setItemsList] = useState([]);
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState([]);
    const [size, setSize] = useState([]);
    const [variant, setVariant] = useState([]);
    const [productRemoteCodeData, setProductRemoteCodeData] = useState(null);
    const [searchValues, setSearchValues] = useState({
        CategoryId: null,
        ProductId: null,
        SizeId: null,
        FlavorId: null,
    });
    const [changedRemoteCodes, setChangedRemoteCodes] = useState([]);

    const initialFormValues = {
        "OperationId": 1,
        "CompanyId": 151,
        "UserId": 456,
        "UserIP": "192.168.1.100",
        "ProductId": null,
        "SizeId": null,
        "FlavorId": null,
        "CategoryId": null,
        "RemoteCode": null,
        "ProductRemoteCode": []
    };

    const initialRemoteCode = async (url, data, controller) => {
        try {
            const response = await postRequest(url, data, controller);
            return response;
        } catch (error) {
            console.error('Error in initialRemoteCode:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchProductRemoteCode = async () => {
            try {
                const response = await initialRemoteCode('/UpdateProductDetailRemoteCode', initialFormValues, controller);
                setProductRemoteCodeData(response);
                setItemsList(response?.data?.DataSet?.Table || []);
                setProduct(response?.data?.DataSet?.Table1 || []);
                setCategory(response?.data?.DataSet?.Table4 || []);
                setSize(response?.data?.DataSet?.Table2 || []);
                setVariant(response?.data?.DataSet?.Table3 || []);
            } catch (error) {
                console.error('Error fetching product remote code:', error);
            }
        };

        fetchProductRemoteCode();

        return () => {
            controller.abort();
        };
    }, []);

    const handleSearchChange = (data) => {
        setSearchValues((prevState) => ({
            ...prevState,
            [data.name]: data.value,
        }));
    };

    const handleReset = () => {
        setItemsList(productRemoteCodeData?.data?.DataSet?.Table || []);
        setSearchValues({
            CategoryId: null,
            ProductId: null,
            SizeId: null,
            FlavorId: null,
        });
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        const searchFields = {
            ...initialFormValues,
            "ProductId": searchValues.ProductId,
            "SizeId": searchValues.SizeId,
            "FlavorId": searchValues.FlavorId,
            "CategoryId": searchValues.CategoryId,
        };
        try {
            const response = await initialRemoteCode('/UpdateProductDetailRemoteCode', searchFields, controller);
            setItemsList(response?.data?.DataSet?.Table || []);
        } catch (error) {
            console.error('Error fetching product remote code:', error);
        }
        setSearchValues({
            CategoryId: null,
            ProductId: null,
            SizeId: null,
            FlavorId: null,
        });
    };

    const handleRemoteCodeChange = (productDetailId, newValue) => {
        setItemsList((prevState) =>
            prevState.map(item =>
                item.ProductDetailId === productDetailId ? { ...item, RemoteId: newValue } : item
            )
        );
        setChangedRemoteCodes((prevState) => {
            const existingIndex = prevState.findIndex(item => item.ProductDetailId === productDetailId);
            if (existingIndex !== -1) {
                const updatedState = [...prevState];
                updatedState[existingIndex].RemoteCode = newValue;
                return updatedState;
            }
            return [...prevState, { ProductDetailId: productDetailId, RemoteCode: newValue }];
        });
    };

    const handleSave = async () => {
        console.log('here is chagedREmoteCodes', changedRemoteCodes)
        const saveData = {
            ...initialFormValues,
            "OperationId": 3,
            "ProductRemoteCode": changedRemoteCodes,
        };
        try {
            const response = await postRequest('/UpdateProductDetailRemoteCode', saveData, controller);
            if (response) {
                message.success('Remote codes updated successfully.');
                setItemsList(data?.DataSet?.Table)
                setChangedRemoteCodes([]); // Reset the changed remote codes after successful save
                
            } else {
                message.error('Failed to update remote codes.');
            }
        } catch (error) {
            
        }
    };

    const searchPanel = (
        <Fragment>
            <FormSelect
                colSpan={4}
                listItem={category}
                idName="CategoryId"
                valueName="CategoryName"
                name="CategoryId"
                label="Category"
                value={searchValues.CategoryId}
                onChange={handleSearchChange}
            />
            <FormSearchSelect
                colSpan={4}
                listItem={product}
                idName="ProductId"
                valueName="ProductName"
                name="ProductId"
                label="Product Name"
                value={searchValues.ProductId}
                onChange={handleSearchChange}
            />
            <FormSelect
                colSpan={4}
                listItem={size}
                idName="SizeId"
                valueName="SizeName"
                name="SizeId"
                label="Size"
                value={searchValues.SizeId}
                onChange={handleSearchChange}
            />
            <FormSelect
                colSpan={4}
                listItem={variant}
                idName="FlavourId"
                valueName="FlavourName"
                name="FlavorId"
                label="Variant"
                value={searchValues.FlavorId}
                onChange={handleSearchChange}
            />
        </Fragment>
    );

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
            title: "Price",
            dataIndex: "Price",
            key: "Price",
        },
        {
            title: "Variant",
            dataIndex: "FlavorName",
            key: "FlavorName",
        },
        {
            title: "Size",
            dataIndex: "SizeName",
            key: "SizeName",
        },
        {
            title: "Remote Code",
            key: "RemoteId",
            render: (record) => (
                <Input
                    value={record.RemoteId || ""}
                    onChange={(e) => handleRemoteCodeChange(record.ProductDetailId, e.target.value)}
                    onKeyPress={(e) => {
                        if (!/^\d*$/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    type="text"
                    required
                    style={{ width: '100%' }}
                />
            ),
        },
    ];

    return (
        <div>
            <Fragment>
                <BasicFormComponent
                    formTitle="Product Remote Code"
                    searchPanel={searchPanel}
                    searchSubmit={handleSearchSubmit}
                    tableRows={itemsList}
                    tableColumn={columns}
                    reset={true}
                    handleReset={handleReset}
                    handleSave={handleSave}
                    actionID="ProductDetailId"
                />
            </Fragment>
        </div>
    );
};

export default ProductRemoteCode;
