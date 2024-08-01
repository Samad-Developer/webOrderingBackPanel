import React, { Fragment, useState } from "react";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import FormCheckbox from "../../components/general/FormCheckbox";

const initialFormValues = {
  menuName: "",
  menuUrl: "",
  parentId: "",
  isDisplayedInMenu: true,
  menuId: "",
  menuItemFeaturedId: "",
  sortOrder: "",
  iconClass: "",
  isActive: true,
};

const initialSearchValues = {
  menuName: "",
  menuUrl: "",
  parentId: "",
  isDisplayedInMenu: true,
  menuId: "",
  menuItemFeaturedId: "",
  sortOrder: "",
  iconClass: "",
  isActive: true,
};

const columns = [
  {
    name: "nameMenu",
    dataIndex: "menuName",
    key: "meniName",
  },
];

const MenuPage = () => {
  const [formFields, setFormFields] = useState(initialFormValues);
  const [searchFields, setSearchFields] = useState(initialSearchValues);

  const parentIds = [
    { id: 1, name: "parentId 1" },
    { id: 2, name: "parentId 2" },
    { id: 3, name: "parentId 3" },
  ];

  const handleSearchChange = (data) => {
    setSearchFields({ ...searchFields, [data.name]: data.value });
  };

  const handleFormChange = (data) => {
    setFormFields({ ...formFields, [data.name]: data.value });
  };

  const handleSearchSubmit = () => {};

  const handleFormSubmit = (e, a, _, closeForm) => {
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Menu Name"
        name="menuName"
        size={INPUT_SIZE}
        value={searchFields.menuName}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Menu URL"
        name="menuURL"
        size={INPUT_SIZE}
        value={searchFields.menuURL}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={parentIds}
        idName="id"
        valueName="name"
        size={INPUT_SIZE}
        name="parentId"
        label="Parent Id"
        value={searchFields.parentId}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Menu Name"
        name="menuName"
        size={INPUT_SIZE}
        value={formFields.menuName}
        onChange={handleFormChange}
      />

      <FormTextField
        colSpan={8}
        label="Menu URL"
        name="menuURL"
        size={INPUT_SIZE}
        value={formFields.menuURL}
        onChange={handleFormChange}
      />
      <FormSelect
        colSpan={8}
        listItem={parentIds}
        idName="id"
        valueName="name"
        size={INPUT_SIZE}
        name="parentId"
        label="Parent Id"
        value={formFields.parentId}
        onChange={handleFormChange}
      />

      <FormTextField
        colSpan={8}
        label="Menu Id"
        name="menuId"
        size={INPUT_SIZE}
        value={formFields.menuId}
        isNumber="true"
        onChange={handleFormChange}
      />
      <FormTextField
        colSpan={8}
        label="Menu Item Featured Id"
        name="menuItemFeaturedId"
        size={INPUT_SIZE}
        value={formFields.menuItemFeaturedId}
        onChange={handleFormChange}
      />

      <FormTextField
        colSpan={8}
        label="Sort Order"
        name="sortOrder"
        size={INPUT_SIZE}
        value={formFields.sortOrder}
        isNumber="true"
        onChange={handleFormChange}
      />
      <FormTextField
        colSpan={8}
        label="Icon Class"
        name="iconClass"
        size={INPUT_SIZE}
        value={formFields.iconClass}
        onChange={handleFormChange}
      />
      <div className="ant-col ant-col-8 mt-26">
        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="isActive"
          label="Is Active"
          checked={formFields.isActive}
          onChange={handleFormChange}
        />
      </div>
      <div className="ant-col ant-col-8 mt-26">
        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="isDisplayedInMenu"
          label="Is Displayed In Menu"
          checked={formFields.isDisplayedInMenu}
          onChange={handleFormChange}
        />
      </div>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Menu Page"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      formSubmit={handleFormSubmit}
      tableColumn={columns}
      fields={initialFormValues}
    />
  );
};

export default MenuPage;
