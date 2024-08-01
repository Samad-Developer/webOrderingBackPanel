import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteRow,
    resetState,
    setInitialState,
    setSearchFieldValue,
    submitForm,
} from "../../../redux/actions/basicFormAction";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormTextField from "../../../components/general/FormTextField";
import { UPDATE_FORM_FIELD } from "../../../redux/reduxConstants";



const initialSearchValues = {
    UnitId: null,
    UnitName: "",
};

const columns = [
    {
        title: "Unit",
        dataIndex: "UnitName",
        key: "UnitName",
    },
];

const StockReport = () => {
    const dispatch = useDispatch();
    const controller = new window.AbortController();
    const userData = useSelector((state) => state.authReducer);

    const [updateId, setUpdateId] = useState(null);

    const { searchFields, itemList, formLoading, tableLoading } =
        useSelector((state) => state.basicFormReducer);

    useEffect(() => {
        dispatch(
            setInitialState(
                "/CrudUnit",
                initialSearchValues,
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
                payload: itemList.filter((item) => item.UnitId === updateId)[0],
            });
        }
        setUpdateId(null);
    }, [updateId]);

    const handleSearchChange = (data) => {
        dispatch(setSearchFieldValue(data));
    };



    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchFields.UnitName = searchFields.UnitName.trim();
        dispatch(
            setInitialState(
                "/CrudUnit",
                searchFields,
                initialFormValues,
                searchFields,
                controller,
                userData
            )
        );
    };

    const handleDeleteRow = (id) => {
        dispatch(
            deleteRow("/CrudUnit", { UnitId: id }, controller, userData)
        );
    };



    const searchPanel = (
        <Fragment>
            <FormTextField
                colSpan={4}
                label="Unit"
                name="UnitName"
                size={INPUT_SIZE}
                value={searchFields.UnitName}
                onChange={handleSearchChange}
            />
        </Fragment>
    );


    return (
        <BasicFormComponent
            formTitle="Stock Report"
            searchPanel={searchPanel}
            searchSubmit={handleSearchSubmit}
            tableRows={itemList}
            tableLoading={tableLoading}
            formLoading={formLoading}
            tableColumn={columns}
            deleteRow={handleDeleteRow}
            actionID="UnitId"
            editRow={setUpdateId}
        />
    );
};

export default StockReport;
