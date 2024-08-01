import { Button, Spin } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";

import { postRequest } from "../../services/mainApp.service";

const CompanySettings = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = () => {
    setLoading(true);
    postRequest(
      "/UpdateFuturePrices",
      {
        OperationId: 2,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
      },
      controller
    ).then((response) => {
      setLoading(false);
      if (response.error === true) {
        message.error(response.errorMessage);
        return;
      }
      if (response.data.response === false) {
        message.error(response.DataSet.Table.errorMessage);
        return;
      }
    });
  };

  //   const formPanel = (
  //     <Fragment>
  //       <FormSelect
  //         colSpan={8}
  //         listItem={supportingTable.Table1 || []}
  //         idName="CountryId"
  //         valueName="CountryName"
  //         size={INPUT_SIZE}
  //         name="CountryId"
  //         label="Country"
  //         value={formFields.CountryId}
  //         onChange={handleFormChange}
  //       />

  //       <FormSelect
  //         colSpan={8}
  //         listItem={
  //           supportingTable.Table2
  //             ? supportingTable.Table2.filter(
  //               (item) => item.CountryId === formFields.CountryId
  //             )
  //             : []
  //         }
  //         disabled={!supportingTable.Table2 || formFields.CountryId === null}
  //         idName="ProvinceId"
  //         valueName="ProvinceName"
  //         size={INPUT_SIZE}
  //         name="ProvinceId"
  //         label="Province"
  //         value={formFields.ProvinceId}
  //         onChange={handleFormChange}
  //       />

  //       <FormTextField
  //         colSpan={8}
  //         label="City Name"
  //         name="CityName"
  //         size={INPUT_SIZE}
  //         value={formFields.CityName}
  //         onChange={handleFormChange}
  //         required={true}
  //       />
  //     </Fragment>
  //   );

  const searchPanel = (
    <Fragment>
      <Button type="primary" onClick={handleFormSubmit}>
        Update Future Price
      </Button>
    </Fragment>
  );
  return (
    <>
      <BasicFormComponent
        formTitle="Company Settings"
        onFormSave={handleFormSubmit}
        searchPanel={searchPanel}
      />
      {loading && (
        <Spin
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      )}
    </>
  );
};

export default CompanySettings;
