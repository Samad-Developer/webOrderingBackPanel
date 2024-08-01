import { Col } from "antd";
import React, { useState } from "react";
import { MdSearch } from "react-icons/md";
import TextFieldSP from "../../Components/general/TextFeildSP";
import CategoryList from "./CategoryList";

const CategorySearch = () => {
  const [categoryName, setCategoryName] = useState("");

  return (
    <div>
      <TextFieldSP
        placeholder="Search Category"
        size="large"
        prefix={<MdSearch />}
        autoComplete="off"
        value={categoryName}
        onChange={(e) => setCategoryName(e.value)}
      />
      <CategoryList categoryName={categoryName} />
    </div>
  );
};
export default CategorySearch;
