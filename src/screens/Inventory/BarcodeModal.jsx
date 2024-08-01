import React from 'react'
import ModalComponent from '../../components/formComponent/ModalComponent'
import FormTextField from '../../components/general/FormTextField';

export default function BarcodeModal(props) {
    const { barCodeModal, toggleBarcodeModel, handleOk, handleBarCodeChange, barcode } = props;

    return (
        <ModalComponent
            title={"Add Barcode"}
            isModalVisible={barCodeModal}
            handleCancel={toggleBarcodeModel}
            handleOk={handleOk}
            okText="Add"
            cancelText="Close"
            closable={true}
        >
            <form onSubmit={handleOk}>
                <FormTextField
                    isNumber="true"
                    value={barcode}
                    name="price"
                    onChange={handleBarCodeChange}
                    required={true}
                />
            </form>
        </ModalComponent>
    )
}
