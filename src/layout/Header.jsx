import { Button, Col, Menu, Row, Tooltip } from "antd";
import { Header } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "../redux/actions/authAction";
import {
  AlignCenterOutlined,
  EditOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  LogoutOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import default_image from "../assets/images/default-user-image.jpg";
import ImageDropdown from "../components/specificComponents/ImageDropdown";
import { MdMenuOpen } from "react-icons/md";
import { DAY_SHIFT_TERMINAL, DISPATCHER } from "../common/SetupMasterEnum";
import "./style.css";

const HeaderLayout = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { CompanyName, Name, online, userBranchList, RoleId, UserName } =
    useSelector((state) => state.authReducer);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DAY_SHIFT_TERMINAL))
      setDate(
        new Date(
          JSON.parse(localStorage.getItem(DAY_SHIFT_TERMINAL)).Date
        ).toLocaleDateString()
      );
  }, [localStorage.getItem(DAY_SHIFT_TERMINAL)]);

  const logout = () => {
    dispatch(signOut(navigate));
  };

  const toggleNetwork = (network) =>
    dispatch({ type: "TOGGLE_NETWORK", payload: network });

  let t;

  useEffect(() => {
    startTime();
    window.addEventListener("online", () => toggleNetwork(navigator.onLine));
    window.addEventListener("offline", () => toggleNetwork(navigator.onLine));

    return () => {
      window.removeEventListener("online", () =>
        toggleNetwork(navigator.onLine)
      );
      window.removeEventListener("offline", () =>
        toggleNetwork(navigator.onLine)
      );
      clearTimeout(t);
    };
  }, []);

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<EditOutlined />}
        onClick={() => navigate("changepassword")}
      >
        Change Password
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={logout}>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  function startTime() {
    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    var prepand = hour >= 12 ? " PM " : " AM ";
    hour = hour >= 12 ? hour - 12 : hour;
    if (hour === 0 && prepand === " PM ") {
      if (minute === 0 && second === 0) {
        hour = 12;
        prepand = " Noon";
      } else {
        hour = 12;
        prepand = " PM";
      }
    }
    if (hour === 0 && prepand === " AM ") {
      if (minute === 0 && second === 0) {
        hour = 12;
        prepand = " Midnight";
      } else {
        hour = 12;
        prepand = " AM";
      }
    }
    hour = checkTime(hour);
    minute = checkTime(minute);
    second = checkTime(second);
    prepand = checkTime(prepand);
    setTime(hour + ":" + minute + ":" + second + prepand);
    t = setTimeout(startTime, 500);
  }

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  const exitFullScreen = (isFullscreens) => {
    if (isFullscreens) {
      if (elem.exitFullscreen) {
        elem.exitFullscreen();
      } else if (elem.webkitExitFullscreen) {
        /* Safari */
        elem.webkitExitFullscreen();
      } else if (elem.msExitFullscreen) {
        /* IE11 */
        elem.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const fullScreen = () => {
    let elem = document.documentElement;
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  return (
    <Header className="mainHeader">
      <Row justify="center">
        <Col
          // span={9}
          xs={18}
          sm={9}
          className="header-col"
          style={{
            justifyContent: "flex-start",
          }}
          align="left"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              height: 57,
            }}
          >
            <Button
              type="text"
              onClick={props.toggleCollapse}
              icon={
                <MdMenuOpen
                  style={{
                    fontSize: 28,
                    transform: props.collapsable && "scaleX(-1)",
                    transition: "0.2s",
                  }}
                />
              }
              className="sidebarButton"
              style={{ marginRight: 20 }}
            />
            {RoleId !== 14 && (
              <h3 style={{ marginBottom: 0, marginRight: 10 }}>
                Branch:{" "}
                <b>
                  {RoleId === 3
                    ? "Agent"
                    : RoleId === 1
                    ? "Company Admin"
                    : RoleId === 0
                    ? "Super Admin"
                    : userBranchList.length > 0 && userBranchList[0].BranchName
                    ? userBranchList[0].BranchName
                    : ""}
                </b>
                {/* , Counter: <b>Main</b> */}
              </h3>
            )}
            {RoleId !== 1 && RoleId !== 3 && RoleId !== 0 && (
              <h3 style={{ marginBottom: 0 }}>
                Role:{" "}
                <b>
                  {RoleId === 2
                    ? "Cashier"
                    : RoleId === 5
                    ? "Branch Admin"
                    : RoleId === DISPATCHER
                    ? "Dispatcher"
                    : RoleId === 14
                    ? "Management"
                    : ""}
                </b>
              </h3>
            )}
          </div>
        </Col>
        <Col
          span={6}
          className="header-col headerCompanyName"
          style={{
            justifyContent: "center",
          }}
          align="center"
        >
          <h2 style={{ margin: 0 }}>
            <b>{CompanyName}</b>
          </h2>
        </Col>
        <Col xs={6} sm={9} align="right">
          <Row
            align="right"
            style={{
              height: 57,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <h3 className="timeStyle">{date}</h3>
            <h3 className="timeStyle">{time}</h3>

            <Tooltip placement="bottom" title="Full Screen">
              <Button className="sync-button" type="text" onClick={fullScreen}>
                {!isFullscreen ? (
                  <FullscreenOutlined />
                ) : (
                  <FullscreenExitOutlined />
                )}
              </Button>
            </Tooltip>
            <ImageDropdown
              title={Name}
              menu={menu}
              DisplayText={UserName.substring(0, 1).toUpperCase()}
            />
          </Row>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderLayout;
