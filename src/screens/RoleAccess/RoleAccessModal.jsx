import { Button, Input } from "antd";
import React from "react";
import ModalComponent from "../../components/formComponent/ModalComponent";
import FormTextField from "../../components/general/FormTextField.jsx";
import FormSelect from "../../components/general/FormSelect.jsx";
import FormCheckbox from "../../components/general/FormCheckbox.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export const RoleAccessModal = (props) => {
  const { TextArea } = Input;
  const userData = useSelector((state) => state.authReducer);
  const [state, setState] = React.useState({
    menuName: "",
    menuUrl: "",
    sortOrder: 0,
    parentId: 0,
    display: false,
    iconClass: ""
  });
  const { menuName, menuUrl, sortOrder, display, iconClass, parentId } = state;

  const handleFormChange = (e) => {
    setState({ ...state, [e.name]: e.value });
  };

  const handleFormSubmit = async () => {
    const res = await axios.post("/CrudMenuItem", {
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
      UserIP: userData.UserIP,
      OperationId: 2,
      MenuId: null,
      Parent_Id: parentId,
      Menu_Name: menuName,
      Menu_URL: menuUrl,
      SortOrder: sortOrder,
      Is_Displayed_In_Menu: display,
      IconClass: iconClass
    });

    props.setMenuUpdated(true);
    // props.updateMenu();
    props.toggleRoleModal(false);
  };

  return (
    <ModalComponent
      title="Add Menu"
      isModalVisible={props.roleModal}
      width={"40vw"}
      footer={[
        <Button
          onClick={() => {
            props.toggleRoleModal(false);
          }}
        >
          Cancel
        </Button>,
        <Button type="primary" onClick={handleFormSubmit}>
          Save Menu
        </Button>
      ]}
    >
      <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
        <FormTextField
          label="Menu Name"
          value={menuName}
          name="menuName"
          onChange={handleFormChange}
        />
        <FormTextField
          label="Menu URL"
          onChange={handleFormChange}
          name="menuUrl"
          value={menuUrl}
        />
        <div style={{ display: "inline-flex", alignItems: "end" }}>
          <FormTextField
            label="Sort Order"
            onChange={handleFormChange}
            name="sortOrder"
            value={sortOrder}
            type="number"
          />
          <FormSelect
            colSpan={8}
            listItem={props.parentList}
            idName="MenuId"
            valueName="Menu_Name"
            name="parentId"
            label="Parent Menu"
            value={parentId}
            onChange={handleFormChange}
          />
          <FormCheckbox
            label="Is Display In Menu"
            name="display"
            onChange={handleFormChange}
            checked={display}
          />
        </div>
        <span>Icon Class:</span>
        <TextArea
          showCount
          name="iconClass"
          onChange={(e) => setState({ ...state, iconClass: e.target.value })}
          value={iconClass}
          maxLength={100}
          style={{
            height: 120
          }}
        />
      </div>
    </ModalComponent>
  );
};
