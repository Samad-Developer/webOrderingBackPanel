import { CloseOutlined, DeleteFilled } from "@ant-design/icons";
import { Button, message } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import {
    deleteRow,
    resetState,
    setFormFieldValue,
    setInitialState,
    setSearchFieldValue,
    submitForm,
} from "../../redux/actions/basicFormAction";

import { SET_TABLE_DATA, UPDATE_FORM_FIELD } from "../../redux/reduxConstants";
import { postRequest } from "../../services/mainApp.service";

const initialFormValues = {
    TerminalDetailId: null
};


const Province = () => {
    const dispatch = useDispatch();
    const controller = new window.AbortController();
    const userData = useSelector((state) => state.authReducer);
    const [updateId, setUpdateId] = useState(null);

    const {
        itemList,
        formLoading,
        tableLoading,
    } = useSelector((state) => state.basicFormReducer);

    const columns = [
        {
            title: "Branch",
            dataIndex: "BranchName",
            key: "BranchName",
        },
        {
            title: "Terminal",
            dataIndex: "TerminalName",
            key: "TerminalName",
        },
        {
            title: "Access By",
            dataIndex: "Name",
            key: "Name",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record, index) => {
                return (
                    <Button
                        type='text'
                        icon={<DeleteFilled className='redIcon' />}
                        onClick={() => handleDeleteRow(record)}
                    />
                );
            },
        },
    ];

    useEffect(() => {
        dispatch(
            setInitialState(
                "/TerminalRevokeAccess",
                initialFormValues,
                initialFormValues,
                {},
                controller,
                userData
            )
        );

        return () => {
            controller.abort();
            dispatch(resetState());
        };
    }, []);



    const handleDeleteRow = (record) => {
        postRequest("/TerminalRevokeAccess", {
            CompanyId: userData.CompanyId,
            OperationId: 2, TerminalDetailId: record.TerminalDetailId
        }, controller).then((response) => {
            if (response.error === true) {
                message.error(response.errorMessage);
                return;
            }
            if (response.data.response === false) {
                message.error(response.DataSet.Table.errorMessage);
                return;
            }

            message.success(response.data.DataSet.Table[0].Message);
            dispatch({
                type: SET_TABLE_DATA,
                payload: { table: response.data.DataSet.Table1 },
            });
        });
    };


    return (
        <BasicFormComponent
            formTitle="Revoke Terminal Access"
            tableRows={itemList}
            tableLoading={tableLoading}
            formLoading={formLoading}
            tableColumn={columns}
            actionID="TerminalRevokeId"
            fields={initialFormValues}
        />
    );
};

export default Province;
