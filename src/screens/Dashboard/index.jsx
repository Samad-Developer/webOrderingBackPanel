import { Card, Col, Input, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { MdPointOfSale, MdShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  delay,
  formatCurrencyValue,
  nFormatter,
} from "../../functions/generalFunctions";
import {
  changeCompany,
  changeDateFrom,
  changeDateTo,
  changeBranch,
} from "../../redux/actions/authAction";
import SideMenu from "./SideMenu";
import "./style.css";
// import { TbShoppingCartDiscount } from "react-icons/ci";
import { FunnelPlotOutlined, LoadingOutlined } from "@ant-design/icons";
import { COMPANY_ADMIN } from "../../common/SetupMasterEnum";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import FormButton from "../../components/general/FormButton";
import FormSelect from "../../components/general/FormSelect";
import { getDate } from "../../functions/dateFunctions";
import { getAllDataFromIDB } from "../../functions/storage/getDataFromIDB";
import updateDataToIDB from "../../functions/storage/updateDataToIDB";
import { postRequest } from "../../services/mainApp.service";
const Dashboard = () => {
  const dispatch = useDispatch();

  const [chartData, setChartData] = useState({});
  const [reportData, setReportData] = useState({});
  const [paymentMode, setPaymentMode] = useState([]);
  const [productlist, setProductList] = useState([]);
  const [orderMode, setOrderMode] = useState([]);
  const [orderSource, setOrderSource] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [companySaleList, setCompanySaleList] = useState([]);
  const [branchDropdownList, setBranchDropdownList] = useState([]);

  const [loading, setLoading] = useState(false);
  const appStore = useSelector((state) => state.authReducer);
  const isDashboard = appStore.menuList.some((item) => item.Menu_URL == "#");

  const {
    companyList,
    RoleName,
    CompanyId,
    RoleId,
    dateFrom,
    dateTo,
    branchId,
  } = useSelector((state) => state.authReducer);
  const [data, setData] = useState({
    DateFrom: getDate(),
    DateTo: getDate(),
    BranchId: null,
  });

  const handleCompanyChange = (companyId) => {
    if (companyId !== null) {
      let data = companyList.filter(
        (listItem) => listItem.CompanyId === companyId
      );
      getAllDataFromIDB("userData", (result) => {
        updateDataToIDB(
          "userData",
          result[0].id,
          {
            ...result[0],
            CompanyId: data[0].CompanyId,
            CompanyName: data[0].CompanyName,
          },
          () => {
            dispatch(changeCompany(data[0]));
          }
        );
      });

      dispatch(changeBranch(null));
    } else if (companyId === null) {
      getAllDataFromIDB("userData", (result) => {
        updateDataToIDB(
          "userData",
          result[0].id,
          {
            ...result[0],
            CompanyId: null,
            CompanyName: null,
          },
          () => {
            dispatch(changeCompany({}));
          }
        );
      });
    }
  };

  const antIcon = (
    <LoadingOutlined style={{ fontSize: 28, marginTop: 10 }} spin />
  );

  useEffect(() => {
    let element = document.getElementById(appStore.selectedRouteId);
    if (element && appStore.selectedRouteId != null) {
      var pos = element.style.position;
      var left = element.style.left;
      var width = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      element.style.position = "relative";
      if (appStore.selectedRouteId === "2") {
        element.style.left = "0px";
      } else {
        element.style.left = width / 20 + "px";
      }
      element.style.left = left;
      element.style.position = pos;
      delay(() => (element.style.backgroundColor = "#60db60"), 400);
      delay(() => (element.style.backgroundColor = "transparent"), 600);
      delay(() => (element.style.backgroundColor = "#fff0b5"), 800);
    }
  }, [appStore.selectedRouteId]);

  const getReport = () => {
    setLoading(true);
    postRequest("DashboardReport", {
      OperationId: 1,
      CompanyId: appStore.CompanyId,
      BranchId:
        appStore.userBranchList?.length > 0 &&
        appStore.IsPos === true &&
        appStore.RoleId !== COMPANY_ADMIN
          ? appStore.userBranchList[0]?.BranchId
          : RoleId === 14
          ? branchId
          : data.BranchId,
      DateFrom: RoleId === 14 ? dateFrom : data.DateFrom,
      DateTo: RoleId === 14 ? dateTo : data.DateTo,
    })
      .then((res) => {
        setLoading(false);
        setReportData(res.data.DataSet.Table[0]);
        setOrderMode(res.data.DataSet.Table1);
        setOrderSource(res.data.DataSet.Table2);
        setPaymentMode(res.data.DataSet.Table3);
        setProductList(res.data.DataSet.Table4);
        setBranchList(res.data.DataSet.Table5);
        setCompanySaleList(res.data.DataSet.Table6);
        setBranchDropdownList(res.data.DataSet.Table7);

        // setChartData(res.data.DataSet.Table1);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    getReport();
    var groups = document.querySelectorAll(".inner-container");
    for (let item of groups) {
      item.style.width = item.scrollWidth - 20 + "px";
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });

    const scrollContainer = document.querySelector(".dashboardContainer");
    scrollContainer.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      scrollContainer.scrollLeft += evt.deltaY;
    });

    const slider = document.querySelector(".dashboardContainer");
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }, []);

  return (


    <div style={{ display: "flex", height: "100%" }}>
      <div className="dashboardContainer">
        {/* {isDashboard && (
          <>
            <div id="2">
              <h2>Dashboardd</h2>
              <div className="dashboardChartFilter" gutter={[10, 10]}>
                }
                <Col
                  className="dashboardChartFilterInput"
                  {...(RoleId === 14 && { span: 6 })}
                >
                  <span>Date From</span>
                  <Input
                    type="date"
                    style={{ width: "100%" }}
                    value={RoleId === 14 ? dateFrom : data.DateFrom}
                    onChange={(e) => {
                      RoleId === 14
                        ? dispatch(changeDateFrom(e.target.value))
                        : setData({ ...data, DateFrom: e.target.value });
                    }}
                  />
                </Col>
                <Col
                  className="dashboardChartFilterInput"
                  {...(RoleId === 14 && { span: 6 })}
                >
                  <span>Date To</span>
                  <Input
                    type="date"
                    style={{ width: "100%" }}
                    value={RoleId === 14 ? dateTo : data.DateTo}
                    onChange={(e) => {
                      RoleId === 14
                        ? dispatch(changeDateTo(e.target.value))
                        : setData({ ...data, DateTo: e.target.value });
                    }}
                  />
                </Col>

                {RoleName === "Management" && RoleId === 14 && (
                  <FormSelect
                    value={CompanyId}
                    onChange={(e) => {
                      handleCompanyChange(e.value);
                    }}
                    label="Select Company"
                    {...(RoleId === 14 && { colSpan: 5 })}
                    listItem={companyList}
                    idName="CompanyId"
                    valueName="CompanyName"
                    placeholder="Choose a Company"
                  />
                )}
                <FormSelect
                  listItem={
                    RoleId === 14
                      ? branchDropdownList.filter(
                          (company) => company.CompanyId === CompanyId
                        )
                      : appStore.userBranchList || []
                  }
                  {...(RoleId === 14 && { colSpan: 5 })}
                  idName="BranchId"
                  valueName="BranchName"
                  size={INPUT_SIZE}
                  className="textInput"
                  label="Select Branch"
                  value={RoleId === 14 ? branchId : data.BranchId}
                  onChange={(e) => {
                    RoleId === 14
                      ? dispatch(changeBranch(e.value))
                      : setData({ ...data, BranchId: e.value });
                  }}
                />

                <FormButton
                  title={RoleId === 14 ? "" : "Apply"}
                  icon={<FunnelPlotOutlined />}
                  sm={6}
                  type="primary"
                  onClick={getReport}
                />
              </div>
              <div
                id="n0"
                className="inner-container dashboardChart"
                style={{ overflow: "hidden" }}
              >
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <MdShoppingCart />
                  </div>
                  <div className="cardDetails">
                    <p>Total Orders</p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {RoleId === 14
                          ? formatCurrencyValue(reportData?.TotalOrder)
                          : nFormatter(reportData?.TotalOrder, 1)}
                      </h2>
                    )}
                  </div>
                </Card>
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <MdPointOfSale />
                  </div>
                  <div className="cardDetails">
                    <p>
                      Total Sale {RoleId === 14 ? `(PKR)` : `(Rs)`} Without Tax
                    </p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {RoleId === 14
                          ? formatCurrencyValue(
                              reportData?.TotalAmountWithoutGst
                            )
                          : nFormatter(
                              parseFloat(reportData?.TotalAmountWithoutGst),
                              1
                            )}
                      </h2>
                    )}
                  </div>
                </Card>
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.0"
                      width="24pt"
                      height="24pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <path d="M938 5104 c-63 -19 -148 -98 -179 -166 l-24 -53 -3 -847 -2 -848 1830 0 1830 0 0 330 0 330 -571 0 -571 0 -40 22 c-24 14 -48 38 -59 60 -18 35 -19 67 -19 613 l0 575 -1072 -1 c-904 0 -1080 -3 -1120 -15z m1372 -654 c45 -23 80 -80 80 -130 0 -50 -35 -107 -80 -130 -37 -19 -58 -20 -431 -20 -387 0 -392 0 -431 22 -101 57 -102 194 -2 254 l39 24 393 0 c374 0 395 -1 432 -20z m0 -640 c45 -23 80 -80 80 -130 0 -50 -35 -107 -80 -130 -37 -19 -58 -20 -431 -20 -387 0 -392 0 -431 22 -101 57 -102 194 -2 254 l39 24 393 0 c374 0 395 -1 432 -20z" />
                        <path d="M3430 4585 l0 -435 437 0 438 0 -435 435 c-239 239 -436 435 -437 435 -2 0 -3 -196 -3 -435z" />
                        <path d="M78 2869 c-23 -12 -46 -35 -58 -59 -20 -38 -20 -57 -20 -890 0 -816 1 -852 19 -888 11 -22 35 -46 59 -60 l40 -22 2441 0 c2428 0 2442 0 2481 20 26 13 47 34 60 60 20 38 20 57 20 890 0 833 0 852 -20 890 -13 26 -34 47 -60 60 -39 20 -53 20 -2482 20 -2413 -1 -2443 -1 -2480 -21z m1672 -259 c45 -23 80 -80 80 -130 0 -50 -35 -107 -80 -130 -34 -17 -59 -20 -180 -20 l-140 0 0 -500 c0 -482 -1 -502 -20 -540 -23 -45 -80 -80 -130 -80 -50 0 -107 35 -130 80 -19 38 -20 58 -20 540 l0 500 -141 0 c-128 0 -145 2 -181 22 -45 25 -78 80 -78 128 0 48 35 107 78 129 35 19 59 20 470 21 414 0 434 -1 472 -20z m886 1 c22 -10 50 -30 61 -44 26 -34 453 -1173 453 -1210 0 -47 -36 -105 -80 -127 -49 -25 -90 -25 -139 -1 -46 24 -60 44 -96 144 l-28 77 -248 0 -247 0 -13 -37 c-6 -21 -24 -66 -39 -100 -23 -50 -36 -66 -69 -82 -51 -26 -91 -27 -141 -1 -44 22 -80 80 -80 128 0 34 418 1145 450 1196 24 40 91 76 140 76 19 0 53 -9 76 -19z m870 2 c28 -14 68 -62 181 -220 80 -112 148 -203 153 -203 4 0 73 91 153 203 151 212 178 237 248 237 76 0 149 -74 149 -152 0 -44 -20 -75 -204 -332 -86 -121 -154 -226 -151 -233 2 -8 76 -114 163 -236 88 -122 167 -236 176 -254 47 -92 -28 -213 -132 -213 -72 0 -95 22 -249 236 -80 112 -149 204 -153 204 -4 0 -73 -91 -153 -202 -152 -214 -177 -238 -250 -238 -82 0 -151 78 -144 162 4 42 21 71 178 290 95 133 173 250 173 258 0 8 -78 125 -173 258 -157 219 -174 248 -178 290 -10 116 107 195 213 145z" />
                        <path d="M2495 1929 c-33 -88 -61 -165 -63 -170 -2 -5 51 -9 128 -9 101 0 131 3 128 13 -29 85 -124 327 -128 327 -3 0 -32 -73 -65 -161z" />
                        <path d="M732 438 c3 -191 5 -218 24 -259 31 -66 78 -114 142 -146 l57 -28 1605 0 1605 0 46 21 c66 31 114 78 146 142 28 56 28 60 31 270 l3 212 -1831 0 -1831 0 3 -212z" />
                      </g>
                    </svg>
                  </div>
                  <div className="cardDetails">
                    <p>Total Taxes {RoleId === 14 ? `(PKR)` : `(Rs)`}</p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {RoleId === 14
                          ? formatCurrencyValue(reportData?.TotalTax)
                          : nFormatter(parseFloat(reportData?.TotalTax), 1)}
                      </h2>
                    )}
                  </div>
                </Card>
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.0"
                      width="24pt"
                      height="24pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <path d="M2743 5106 c-136 -34 -73 25 -1414 -1315 -1159 -1159 -1248 -1251 -1276 -1311 -72 -152 -69 -296 8 -439 44 -83 1909 -1947 1986 -1985 145 -72 283 -73 433 -4 61 28 143 108 1311 1277 1155 1156 1248 1251 1277 1311 16 36 35 92 42 125 8 43 10 335 8 1025 l-3 965 -23 56 c-50 125 -156 231 -280 281 l-57 23 -980 2 c-762 1 -991 -1 -1032 -11z m1487 -808 c143 -72 93 -278 -67 -278 -167 0 -196 241 -34 290 41 13 54 11 101 -12z m-1555 -373 c167 -44 296 -173 340 -342 76 -292 -151 -583 -455 -583 -416 0 -626 508 -331 800 122 120 286 166 446 125z m915 -1233 c50 -25 80 -75 80 -132 0 -57 -30 -107 -80 -132 -33 -17 -103 -18 -1030 -18 -927 0 -997 1 -1030 18 -107 53 -107 211 0 264 33 17 103 18 1030 18 927 0 997 -1 1030 -18z m-923 -582 c119 -28 245 -123 301 -228 103 -194 74 -413 -77 -562 -262 -258 -693 -139 -786 217 -64 244 86 500 335 569 54 15 169 17 227 4z" />
                        <path d="M2480 3617 c-153 -81 -93 -317 80 -317 173 0 233 236 80 317 -55 29 -105 29 -160 0z" />
                        <path d="M2500 1813 c-63 -26 -110 -95 -110 -161 0 -59 38 -122 90 -149 55 -29 105 -29 160 0 109 57 119 217 18 288 -32 23 -125 36 -158 22z" />
                      </g>
                    </svg>
                  </div>
                  <div className="cardDetails">
                    <p>Total Discount {RoleId === 14 ? `(PKR)` : `(Rs)`}</p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {RoleId === 14
                          ? formatCurrencyValue(reportData?.DiscountAmount)
                          : nFormatter(
                              parseFloat(reportData?.DiscountAmount),
                              1
                            )}
                      </h2>
                    )}
                  </div>
                </Card>
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.0"
                      width="30pt"
                      height="30pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <path d="M558 4059 c-68 -35 -78 -71 -78 -279 l0 -180 -105 0 c-86 0 -113 -4 -145 -20 -45 -23 -80 -80 -80 -130 0 -50 35 -107 80 -130 37 -19 58 -20 449 -20 345 0 417 -2 449 -15 96 -39 101 -180 9 -249 -28 -21 -40 -21 -530 -26 -456 -5 -505 -7 -534 -23 -38 -20 -73 -82 -73 -127 0 -50 35 -107 80 -130 38 -19 58 -20 747 -20 l708 0 39 -23 c100 -57 100 -197 0 -254 l-39 -23 -708 0 c-689 0 -709 -1 -747 -20 -45 -23 -80 -80 -80 -130 0 -50 35 -107 80 -130 35 -18 59 -20 220 -20 l180 0 0 -240 c0 -352 0 -352 278 -360 l173 -5 22 -65 c30 -90 69 -152 137 -220 224 -224 586 -224 810 0 68 68 107 130 137 220 l22 65 761 0 761 0 22 -65 c30 -90 69 -152 137 -220 224 -224 586 -224 810 0 68 68 107 130 137 220 l22 65 153 5 c176 6 205 16 238 80 19 38 20 58 20 538 0 542 -2 562 -57 665 -36 64 -119 139 -197 176 -125 60 -133 61 -795 61 l-603 0 -40 22 c-79 45 -78 36 -78 563 l0 465 -1377 0 c-1352 -1 -1379 -1 -1415 -21z m1052 -2184 c92 -46 160 -153 160 -250 0 -97 -68 -204 -159 -250 -121 -61 -296 1 -364 129 -31 58 -31 184 0 242 30 56 106 121 162 139 57 18 155 14 201 -10z m2650 0 c92 -46 160 -153 160 -250 0 -97 -68 -204 -159 -250 -121 -61 -296 1 -364 129 -31 58 -31 184 0 242 30 56 106 121 162 139 57 18 155 14 201 -10z" />
                        <path d="M3650 3690 l0 -360 410 0 c226 0 410 3 410 6 0 13 -125 210 -184 289 -118 159 -233 260 -382 334 -63 31 -227 91 -250 91 -2 0 -4 -162 -4 -360z" />
                      </g>
                    </svg>
                  </div>
                  <div className="cardDetails">
                    <p>Delivery Amounts {RoleId === 14 ? `(PKR)` : `(Rs)`}</p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {RoleId === 14
                          ? formatCurrencyValue(reportData?.DeliveryCharges)
                          : nFormatter(
                              parseFloat(reportData?.DeliveryCharges),
                              1
                            )}
                      </h2>
                    )}
                  </div>
                </Card>
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 16 16"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                      <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"></path>
                    </svg>
                  </div>
                  <div className="cardDetails">
                    <p>
                      Cash Sale {RoleId === 14 ? `(PKR)` : `(Rs)`}
                      {branchList.length === 1 &&
                        reportData?.TaxOnCashSale !== 0 &&
                        ` With Tax ${reportData?.TaxOnCashSale} %`}
                    </p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {RoleId === 14
                          ? formatCurrencyValue(reportData?.CashPayment)
                          : nFormatter(parseFloat(reportData?.CashPayment), 1)}
                      </h2>
                    )}
                  </div>
                </Card>
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 16 16"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"></path>
                    </svg>
                  </div>
                  <div className="cardDetails">
                    <p>
                      Credit Card Sale {RoleId === 14 ? `(PKR)` : `(Rs)`}
                      <br></br>
                      {branchList.length === 1 &&
                        reportData?.TaxOnCardSale !== 0 &&
                        ` With Tax ${reportData?.TaxOnCardSale} %`}
                    </p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {RoleId === 14
                          ? formatCurrencyValue(reportData?.CardPayment)
                          : nFormatter(parseFloat(reportData?.CardPayment), 1)}
                      </h2>
                    )}
                  </div>
                </Card>
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.0"
                      width="30pt"
                      height="30pt"
                      viewBox="0 0 134.000000 134.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,134.000000) scale(0.100000,-0.100000)"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <path d="M594 1177 c-38 -33 -46 -116 -15 -158 l22 -30 -35 -39 c-41 -46 -48 -76 -44 -190 l3 -85 140 0 140 0 3 99 c3 114 -5 143 -54 185 -27 24 -31 31 -19 41 26 22 39 79 26 121 -23 76 -110 105 -167 56z" />
                        <path d="M133 920 c-29 -12 -63 -67 -63 -102 0 -34 14 -70 34 -91 15 -15 15 -18 -9 -33 -45 -29 -57 -67 -59 -183 l-1 -106 143 -3 c121 -2 143 0 148 13 4 9 2 64 -3 122 -10 105 -11 107 -46 140 l-36 33 21 35 c30 52 21 119 -21 157 -32 29 -67 34 -108 18z" />
                        <path d="M1094 911 c-57 -35 -69 -128 -23 -177 l21 -22 -38 -34 c-36 -34 -37 -36 -47 -140 -5 -58 -7 -113 -4 -122 6 -14 25 -16 149 -14 l143 3 0 101 c-1 113 -14 154 -56 185 l-29 21 20 25 c14 18 20 41 20 75 0 43 -4 54 -34 84 -40 40 -75 44 -122 15z" />
                        <path d="M622 570 c-40 -59 -41 -60 -16 -60 l24 0 0 -140 0 -141 -62 7 c-75 7 -200 31 -235 45 -21 8 -24 14 -19 35 6 22 4 25 -9 20 -9 -3 -35 -6 -58 -6 -70 0 -74 -9 -37 -78 32 -61 32 -61 50 -40 15 19 21 20 46 10 101 -40 158 -47 364 -46 190 1 211 2 295 27 90 26 90 26 107 6 17 -20 18 -19 48 42 36 70 32 79 -37 79 -23 0 -49 3 -58 6 -13 5 -15 2 -9 -20 5 -21 2 -27 -19 -35 -35 -14 -160 -38 -234 -46 l-63 -7 0 141 0 141 26 0 26 0 -38 53 c-21 28 -40 55 -44 60 -3 4 -25 -20 -48 -53z" />
                      </g>
                    </svg>
                  </div>
                  <div className="cardDetails">
                    <p>
                      Third Party Sale {RoleId === 14 ? `(PKR)` : `(Rs)`}
                      <br />
                      {branchList.length === 1 &&
                        reportData?.TaxOnThirdPartySale !== 0 &&
                        ` With Tax ${reportData?.TaxOnThirdPartySale} %`}
                    </p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {RoleId === 14
                          ? formatCurrencyValue(reportData?.ThirdPartySale)
                          : nFormatter(
                              parseFloat(reportData?.ThirdPartySale),
                              1
                            )}
                      </h2>
                    )}
                  </div>
                </Card>
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.0"
                      width="30pt"
                      height="30pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <path d="M1910 5083 c-25 -13 -85 -85 -212 -253 -148 -197 -182 -236 -207 -241 -17 -4 -140 -9 -273 -13 -134 -4 -265 -12 -291 -17 -50 -12 -101 -53 -117 -95 -5 -13 -30 -150 -55 -306 -25 -155 -47 -284 -49 -285 -1 -1 -112 -66 -247 -143 -152 -88 -256 -154 -276 -176 -59 -67 -57 -85 49 -405 l94 -284 -158 -249 c-87 -138 -161 -265 -164 -284 -11 -56 12 -109 74 -171 31 -32 129 -127 218 -212 l161 -154 -25 -297 -24 -298 23 -47 c14 -27 37 -55 54 -65 17 -9 149 -51 295 -93 146 -41 271 -79 278 -83 7 -4 63 -124 124 -267 61 -143 119 -272 129 -286 24 -34 83 -62 128 -61 20 0 159 25 310 57 238 49 275 54 290 42 119 -102 424 -346 451 -359 44 -23 96 -23 140 0 27 13 332 257 451 359 15 12 52 7 290 -42 151 -32 290 -57 310 -57 45 -1 104 27 128 61 10 14 68 143 129 286 61 143 117 263 124 267 7 4 132 42 278 83 146 42 279 84 295 93 17 10 40 38 54 65 l23 47 -24 298 -25 297 161 154 c89 85 187 180 218 212 62 62 85 115 74 171 -3 19 -77 146 -164 284 l-158 249 94 284 c106 320 108 338 49 405 -20 22 -124 88 -276 176 -135 77 -246 142 -247 143 -2 1 -24 130 -49 285 -25 156 -50 293 -55 306 -16 42 -67 83 -117 94 -26 6 -149 14 -273 17 -124 3 -246 8 -272 11 l-47 6 -175 234 c-97 128 -187 241 -201 250 -15 9 -48 19 -75 22 -46 4 -64 -3 -314 -122 -146 -69 -270 -126 -276 -126 -6 0 -126 55 -267 122 -279 132 -319 144 -383 111z m1267 -1495 l23 -21 0 -859 0 -859 -25 -24 c-23 -24 -30 -25 -144 -25 -131 0 -164 9 -180 49 -8 18 -11 281 -9 872 3 817 4 848 22 868 18 19 30 21 154 21 126 0 137 -2 159 -22z m-1884 -323 c107 -28 187 -79 187 -120 0 -40 -60 -200 -81 -217 -28 -23 -64 -23 -103 1 -93 58 -185 45 -207 -27 -19 -65 6 -102 133 -197 134 -100 171 -135 219 -208 51 -79 72 -153 71 -257 -1 -185 -85 -326 -237 -402 -159 -79 -406 -62 -523 36 -40 35 -41 65 -7 166 45 133 67 146 168 97 49 -24 76 -31 129 -31 60 -1 70 2 93 25 48 47 43 141 -9 201 -13 14 -61 54 -107 88 -161 118 -234 207 -265 324 -37 140 8 307 112 410 106 106 276 150 427 111z m989 -13 c150 -53 236 -170 267 -363 6 -36 11 -238 11 -464 1 -220 5 -436 9 -480 14 -131 0 -144 -160 -145 -104 0 -119 2 -143 21 l-28 22 -41 -21 c-95 -46 -179 -53 -276 -23 -128 40 -224 150 -260 296 -16 65 -15 217 2 280 38 138 130 252 256 319 71 37 200 76 253 76 25 0 28 3 28 33 0 44 -17 101 -38 127 -38 46 -150 44 -244 -5 -91 -48 -121 -28 -163 108 -32 103 -28 122 32 160 133 82 355 109 495 59z m1843 -11 c116 -57 201 -176 246 -346 17 -61 23 -119 26 -240 5 -149 4 -162 -15 -185 l-20 -25 -283 -5 -284 -5 4 -44 c8 -121 60 -230 126 -269 36 -20 50 -23 125 -19 54 3 104 12 137 26 90 35 120 10 148 -126 20 -95 15 -127 -23 -147 -96 -49 -275 -79 -392 -65 -230 28 -385 180 -452 444 -20 79 -23 114 -23 285 1 230 17 317 90 465 99 203 247 300 443 291 68 -3 95 -10 147 -35z" />
                        <path d="M2125 2454 c-82 -30 -124 -99 -125 -203 0 -80 29 -148 67 -157 42 -11 88 18 113 72 20 40 24 68 28 176 l5 128 -24 -1 c-13 0 -42 -7 -64 -15z" />
                        <path d="M3915 2968 c-40 -35 -77 -100 -95 -168 -6 -25 -13 -53 -16 -62 -5 -17 7 -18 161 -18 l166 0 -6 38 c-12 70 -37 147 -58 177 -50 73 -96 83 -152 33z" />
                      </g>
                    </svg>
                  </div>
                  <div className="cardDetails">
                    <p>FOC Sale {RoleId === 14 ? `(PKR)` : `(Rs)`}</p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {" "}
                        {RoleId === 14
                          ? formatCurrencyValue(reportData?.FocSale)
                          : nFormatter(parseFloat(reportData?.FocSale), 1)}
                      </h2>
                    )}
                  </div>
                </Card>
                <Card className="dashboardCard">
                  <div className="cardIcon">
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="30pt"
                      height="30pt"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#fff"
                        stroke="none"
                      >
                        <path
                          d="M2315 5109 c-423 -43 -829 -189 -1177 -421 -128 -85 -269 -202 -387
                            -319 -404 -405 -649 -903 -733 -1494 -17 -118 -17 -512 0 -630 84 -591 329
                            -1089 733 -1494 405 -404 903 -649 1494 -733 118 -17 512 -17 630 0 591 84
                            1089 329 1494 733 404 405 649 903 733 1494 17 118 17 512 0 630 -84 591 -329
                            1089 -733 1494 -395 394 -883 639 -1449 726 -126 19 -477 28 -605 14z m565
                            -394 c951 -144 1689 -886 1836 -1845 25 -158 25 -462 0 -620 -147 -964 -882
                            -1699 -1846 -1846 -158 -25 -462 -25 -620 0 -964 147 -1699 882 -1846 1846
                            -25 158 -25 462 0 620 110 722 556 1332 1201 1645 252 123 505 192 795 219 87
                            8 376 -4 480 -19z"
                        />
                        <path
                          d="M1325 2734 c-46 -24 -93 -74 -106 -112 -15 -46 -6 -128 18 -160 10
                          -14 36 -40 57 -56 l38 -31 1221 0 1222 0 33 23 c17 13 44 40 60 59 23 31 27
                          46 27 103 0 57 -4 72 -27 103 -16 19 -43 46 -60 59 l-33 23 -1210 3 c-1081 2
                          -1213 0 -1240 -14z"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="cardDetails">
                    <p>
                      Item Less After KOT ({RoleId === 14 ? `PKR` : `Rs`} / Qty)
                    </p>
                    {loading ? (
                      <Spin indicator={antIcon} />
                    ) : (
                      <h2>
                        {reportData?.ItemLessAmount === null
                          ? "0.00"
                          : RoleId === 14
                          ? formatCurrencyValue(reportData?.ItemLessAmount)
                          : nFormatter(
                              parseFloat(reportData?.ItemLessAmount),
                              1
                            )}{" "}
                        /{" "}
                        {reportData?.ItemLessQty === null
                          ? 0
                          : RoleId === 14
                          ? formatCurrencyValue(reportData?.ItemLessQty)
                          : nFormatter(reportData?.ItemLessQty, 1)}
                      </h2>
                    )}
                  </div>
                </Card>
              </div>
            </div>
            {/* <div id="1" className="dashboardChartInner" style={{}}>
              {/* <div style={{ width: "inherit" }}>
                <Row className="dashboardChartRow" gutter={[10, 10]}>
                  <Col span={16} style={{ padding: 0 }}>
                    <div className="chartStyle chart1Style">
                      <h2>Total Sales</h2>
                      <br></br>
                      {loading ? <Skeleton active /> : <Chart1 />}
                    </div>
                  </Col>
                  <Col span={8} style={{ padding: 0 }}>
                    <div className="chartStyle">
                      <h2>Sales by Order Mode</h2>
                      <br></br>
                      {loading ? (
                        <Skeleton active />
                      ) : (
                        <Chart2 chartData={chartData} />
                      )}
                    </div>
                  </Col>
                  <Col span={24} style={{ padding: 0 }}>
                    <div className="chartStyle">
                      <h2>Sales by Order Source</h2>
                      <br></br>
                      {loading ? <Skeleton active /> : <Chart3 />}
                    </div>
                  </Col>
                </Row>
              </div> 
            
          </>
                      )}*/ }

        {/* {RoleId === 14 && (
          <div id="1" className="dashboardTableInner" style={{}}>
            <div style={{ width: "inherit" }}>
              <Row className="dashboardTableRow" gutter={[10, 10]}>
                {orderMode?.length > 0 && (
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    xl={12}
                    style={{ padding: 0 }}
                    className="tableColumn"
                  >
                    <div
                      className="dashboardtableStyle"
                      style={{
                        background: "#ffffff",
                        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "4px",
                        padding: "18px",
                        marginRight: "10px",
                        height: "37vh",
                        width: "70vh",
                        borderTop: "10px",
                      }}
                    >
                      <h2>Sales by Order Mode</h2>
                      <div className="dashboardTableHeight">
                        <table style={{}}>
                          <tr>
                            <td>Order Mode</td>
                            <td>Count</td>
                            <td>Amount</td>
                          </tr>
                          {orderMode.map((item, _index) => (
                            <tr>
                              <td>{item.OrderMode}</td>
                              <td>{item.OrderCount || 0}</td>
                              <td>
                                {loading ? (
                                  <Spin indicator={antIcon} />
                                ) : (
                                  <h2>
                                    {RoleId === 14
                                      ? formatCurrencyValue(item.TotalAmount)
                                      : nFormatter(
                                          parseFloat(item.TotalAmount),
                                          1
                                        )}
                                  </h2>
                                )}
                              </td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  </Col>
                )}

                {companySaleList?.length > 0 && (
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    xl={12}
                    style={{ padding: 0, display: "table" }}
                    className="tableColumn"
                  >
                    <div
                      style={{
                        background: "#ffffff",
                        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "4px",
                        padding: "18px",
                        marginRight: "10px",
                        height: "37vh",
                        width: "70vh",
                        borderTop: "10px",
                      }}
                    >
                      <h2>Sales By Company</h2>
                      <div className="dashboardTableHeight">
                        <table>
                          <tr>
                            <td>Company</td>
                            <td>Branch</td>
                            <td>Total Orders</td>
                            <td>Net Sale</td>
                          </tr>
                          {companySaleList.map((item, _index) =>
                            loading ? (
                              <tr>
                                <td colspan="3">
                                  <Spin indicator={antIcon} />
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td>{item.CompanyName}</td>
                                <td>{item.BranchName}</td>
                                <td>{item.TotalOrders}</td>
                                <td>
                                  {loading ? (
                                    <Spin indicator={antIcon} />
                                  ) : (
                                    <h2>
                                      {RoleId === 14
                                        ? formatCurrencyValue(item.NetSale)
                                        : nFormatter(
                                            parseFloat(item.NetSale),
                                            1
                                          )}
                                    </h2>
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </table>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        )} */}
{/* 
        {RoleId !== 14 && (
          <div id="1" className="dashboardTableInner" style={{}}>
            <div style={{ width: "inherit" }}>
              <Row className="dashboardTableRow" gutter={[10, 10]}>
                {orderMode?.length > 0 && (
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    xl={12}
                    style={{ padding: 0 }}
                    className="tableColumn"
                  >
                    <div className="dashboardtableStyle">
                      <h2>Sales by Order Mode</h2>
                      <div className="dashboardTableHeight">
                        <table style={{}}>
                          <tr>
                            <td>Order Mode</td>
                            <td>Count</td>
                            <td>Amount</td>
                          </tr>
                          {orderMode.map((item, _index) => (
                            <tr>
                              <td></td>
                              <td>{item.OrderMode}</td>
                              <td>{item.OrderCount || 0}</td>
                              <td>
                                {loading ? (
                                  <Spin indicator={antIcon} />
                                ) : (
                                  <h2>
                                    {RoleId === 14
                                      ? formatCurrencyValue(item.TotalAmount)
                                      : nFormatter(
                                          parseFloat(item.TotalAmount),
                                          1
                                        )}
                                  </h2>
                                )}
                              </td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  </Col>
                )} */}
                {/* {orderSource?.length > 0 && (
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    xl={12}
                    style={{ padding: 0 }}
                    className="tableColumn"
                  >
                    <div className="dashboardtableStyle">
                      <h2>Sales by Order Source</h2>
                      <div className="dashboardTableHeight">
                        <table>
                          <tr>
                            <td>Order Source</td>
                            <td>Count</td>
                            <td>Amount</td>
                          </tr>
                          {orderSource.map((item, _index) => (
                            <tr>
                              <td>{item.OrderSource}</td>
                              <td>{item.OrderCount || 0}</td>
                              <td>
                                {loading ? (
                                  <Spin indicator={antIcon} />
                                ) : (
                                  <h2>
                                    {RoleId === 14
                                      ? formatCurrencyValue(item.TotalAmount)
                                      : nFormatter(
                                          parseFloat(item.TotalAmount),
                                          1
                                        )}
                                  </h2>
                                )}
                              </td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  </Col>
                )} */}
                {/* {paymentMode?.length > 0 && (
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    xl={12}
                    style={{ padding: 0 }}
                    className="tableColumn"
                  >
                    <div className="dashboardtableStyle">
                      <h2>Third Party Sales</h2>
                      <div className="dashboardTableHeight">
                        <table>
                          <tr>
                            <td>Payment Mode</td>
                            <td>Count</td>
                            <td>Amount</td>
                          </tr>
                          {paymentMode.map((item, _index) => (
                            <tr>
                              <td>{item.PaymentMode}</td>
                              <td>{item.OrderCount || 0}</td>
                              <td>
                                {loading ? (
                                  <Spin indicator={antIcon} />
                                ) : (
                                  <h2>
                                    {RoleId === 14
                                      ? formatCurrencyValue(item.TotalAmount)
                                      : nFormatter(
                                          parseFloat(item.TotalAmount),
                                          1
                                        )}
                                  </h2>
                                )}
                              </td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    </div>
                  </Col>
                )}
                {productlist?.length > 0 && (
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    xl={12}
                    style={{ padding: 0 }}
                    className="tableColumn"
                  >
                    <div className="dashboardtableStyle">
                      <h2>Product Sales</h2>
                      <div className="dashboardTableHeight">
                        <table>
                          <tr>
                            <td>Branch</td>
                            <td>Product</td>
                            <td>Quantity</td>
                            <td>Amount</td>
                          </tr>
                          {productlist.map((item, _index) =>
                            loading ? (
                              <tr>
                                <td colspan="3">
                                  <Spin indicator={antIcon} />
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td>{item.BranchName}</td>
                                <td>{item.Product}</td>
                                <td>{item.Quantity}</td>
                                <td>
                                  <h2>
                                    {RoleId === 14
                                      ? formatCurrencyValue(
                                          item.PriceWithoutGST
                                        )
                                      : nFormatter(
                                          parseFloat(item.PriceWithoutGST),
                                          1
                                        )}
                                  </h2>
                                </td>
                              </tr>
                            )
                          )}
                        </table>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        )} */}
        {/* {RoleId !== 14 && branchList?.length > 0 && (
          <Col
            xs={24}
            sm={12}
            md={12}
            xl={12}
            style={{ padding: 0, display: "table" }}
            className="tableColumn"
          >
            <div
              style={{
                background: "#ffffff",
                boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                padding: "18px",
                marginRight: "10px",
                height: "37vh",
                width: "70vh",
                borderTop: "10px",
                marginTop: "37px",
              }}
            >
              <h2>Inventory Transaction Status</h2>
              <div className="dashboardTableHeight">
                <table>
                  <tr>
                    <td>Branch </td>
                    <td>GRN</td>
                    <td>Receiving</td>
                    <td>Transfer</td>
                    <td>Closing </td>
                  </tr>
                  {branchList.map((item, _index) =>
                    loading ? (
                      <tr>
                        <td colspan="3">
                          <Spin indicator={antIcon} />
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>{item.BranchName}</td>
                        <td>{item.GRN}</td>
                        <td>{item.Receiving}</td>
                        <td>{item.Transfer}</td>
                        <td>{item.Closing}</td>
                      </tr>
                    )
                  )}
                </table>
              </div>
            </div>
          </Col>
        )} */}

        <SideMenu />
        <div>
          <div style={{ width: "50vw" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
