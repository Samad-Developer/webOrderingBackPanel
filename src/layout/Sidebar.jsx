import React from 'react';
import 'antd/dist/antd.css';
import { useSelector } from 'react-redux';
import logo from '../assets/images/biryaniWala.png'
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ collapsed }) => {
  const appStore = useSelector((state) => state.authReducer);

  return (
    <>
     <Sider  collapsed={collapsed} width={220} style={{ backgroundColor: '#E8EEF0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0' }}>
        <img src={logo} alt="Brand Logo" style={{ height: collapsed ? '40px' : '60px', transition: 'height 0.2s' }} />
      </div>
      <Menu mode="inline" style={{ borderRight: 0, padding: 25, backgroundColor: '#E8EEF0', minHeight: '100%' }}>
        {appStore?.menuList
          .filter((item) => item.Parent_Id === null)
          .map((item) => (
            <SubMenu
              key={item.MenuId}
              title={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {item.IconClass && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div dangerouslySetInnerHTML={{ __html: item.IconClass }} />
                    </div>
                  )}
                  {!collapsed && (
                    <span style={{ marginLeft: '8px', marginBottom:  '14px',display: 'flex', alignItems: 'center' }}>
                      {item.Menu_URL ? (
                        <Link style={{ color: 'black',fontSize: '16px' }} to={item.Menu_URL}>
                          {item.Menu_Name}
                        </Link>
                      ) : (
                        item.Menu_Name
                      )}
                    </span>
                  )}
                </span>
              }
            >
              {appStore?.menuList
                .filter((subItem) => subItem.Parent_Id === item.MenuId)
                .map((subItem) => (
                  <Menu.Item key={subItem.MenuId}>
                    {subItem.Menu_URL ? <Link to={subItem.Menu_URL}>{subItem.Menu_Name}</Link> : subItem.Menu_Name}
                  </Menu.Item>
                ))}
            </SubMenu>
          ))}
      </Menu>
    </Sider>
  
    </>);
};

export default Sidebar;
