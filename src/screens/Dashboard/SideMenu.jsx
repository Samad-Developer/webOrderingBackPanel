import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ID_dashboard, ID_podms } from "../../common/SetupMasterEnum";
import FormTileButton from "../../components/general/FormTileButton";

const SideMenu = () => {
  const appStore = useSelector((state) => state.authReducer);
  const navigate = useNavigate();

  const excludedMenuNames = ['Inventory', 'Financials'];

  return appStore.menuList.map((item, ind) => {
    if (
      item.Is_Displayed_In_Menu === true &&
      item.Parent_Id === null &&
      ![ID_dashboard, ID_podms].includes(item.MenuId) &&
      !excludedMenuNames.includes(item.Menu_Name)
    ) {
      return (
<></>

        // <div key={ind} id={item.MenuId} className="dashboardSections">
        //   <h2>{item.Menu_Name}</h2>
        //   <div className="inner-container">
        //     {appStore.menuList.map((nestedItem, index) => {
        //       if (nestedItem.Parent_Id === item.MenuId) {
        //         return (
        //           <>
        //             <Link key={index} to={nestedItem.Menu_URL}>
        //               <FormTileButton
        //                 key={index}
        //                 className="tileButton"
        //                 title={nestedItem.Menu_Name === ('GST' || 'gst') ? 'Tax' : nestedItem.Menu_Name}
        //                 type="primary"
        //                 innerHtml={nestedItem.IconClass}
        //               />
        //             </Link>
        //           </>
        //         );
        //       }
        //     })}
        //   </div>
        // </div>
      );
    }
  });
};

export default SideMenu;
