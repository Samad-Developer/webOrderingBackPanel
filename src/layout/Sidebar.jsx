import React from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

const Sidebar = () => {
  const appStore = useSelector((state) => state.authReducer);

  return (
    <Menu mode="inline" theme="dark" style={{ 
      width: 270, 
      // height: 'Calc(100vh - 96px)',
      minHeight: '100%', 
      borderRight: 0, 
      padding: 25 }}>
      {appStore?.menuList
        .filter((item) => item.Parent_Id === null)
        .map((item) => (
          <SubMenu key={item.MenuId} title={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {item.IconClass && <div dangerouslySetInnerHTML={{ __html: item.IconClass }} />}
              <span style={{ marginLeft: '8px' }}>
                {item.Menu_URL ? ( // Check if Menu_URL exists
                  <Link to={item.Menu_URL}>{item.Menu_Name}</Link>
                ) : (
                  item.Menu_Name
                )}
              </span>
            </span>
          }>
            {appStore?.menuList
              .filter((subItem) => subItem.Parent_Id === item.MenuId)
              .map((subItem) => (
                <Menu.Item key={subItem.MenuId}>
                  {subItem.Menu_URL ? ( // Check if Menu_URL exists
                    <Link to={subItem.Menu_URL}>{subItem.Menu_Name}</Link>
                  ) : (
                    subItem.Menu_Name
                  )}
                </Menu.Item>
              ))}
          </SubMenu>
        ))}
    </Menu>
  );
};

export default Sidebar;
