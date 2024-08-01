import React from "react";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import FormButton from "../../../components/general/FormButton";
import FormContainer from "../../../components/general/FormContainer";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";

const ExpenseModal = (props) => {
  let { onSubmit, visible, data, changeValue, onClose } = props;

  return (
    <ModalComponent footer={[]} isModalVisible={visible} title="Add Expense">
      <FormContainer onSubmit={onSubmit}>
        <FormTextField
          colSpan={12}
          label="Date"
          name="ExpenseDate"
          type="date"
          value={data?.ExpenseDate}
          onChange={changeValue}
        />
        <FormSelect
          colSpan={12}
          listItem={[]}
          idName="ExpenseTypeId"
          valueName="ExpenseTypeName"
          name="ExpenseType"
          label="Expense Type"
          width="100%"
          value={data?.ExpenseType}
          onChange={changeValue}
        />
        <FormTextField
          colSpan={12}
          label="Expence Amount"
          name="ExpenceAmount"
          isNumber="true"
          value={data?.ExpenceAmount}
          onChange={changeValue}
        />
        <FormTextField
          colSpan={12}
          label="Total Expence for the Business Day"
          name="TotalExpenceAmount"
          value={data?.TotalExpenceAmount}
          onChange={changeValue}
        />
        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <FormButton title="Close" type="secondary" onClick={onClose} />
          <FormButton title="Add Expense" htmlType="submit" type={"primary"} />
        </div>
      </FormContainer>
    </ModalComponent>
  );
};

export default ExpenseModal;
