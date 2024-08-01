import { SearchOutlined } from "@ant-design/icons";
import { Row } from "antd";
import React from "react";
import { useState } from "react";
import TextFieldSP from "../../Components/general/TextFeildSP";
import ProductList from "./ProductList";

export const ProductSearch = () => {
  const [searchProduct, setSearchProduct] = useState("");
  return (
    <div>
      <TextFieldSP
        placeholder="Search Product"
        size="large"
        prefix={<SearchOutlined />}
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.value)}
        //   onPressEnter={(e) => {
        //     e.preventDefault();
        //     return;
        //   }}
      />
      <Row style={{ overflow: "auto" }}>
        <div style={{ height: "700px" }}>
          <ProductList searchProduct={searchProduct} />
        </div>
      </Row>
    </div>
  );
};
