import { Avatar, Card, Radio, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import FormTextField from "../../components/general/FormTextField";
import FormSelect from "../../components/general/FormSelect";

const CompanyProfile = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Card
        title="Company Profile"
        bordered={true}
        style={{
          width: "500px",
          textAlign: "center",
        }}
      >
        <Row gutter={[8, 8]} style={{ justifyContent: "center" }}>
          <FormTextField label="Company Name" colSpan={20} />
          <FormTextField label="Company Phone" colSpan={20} />
          <FormTextField label="Company Email" colSpan={20} />
          <FormSelect label="Bussiness Type" colSpan={20} />
          <FormTextField
            label="Number of Terminals"
            type="number"
            colSpan={20}
          />
        </Row>
        {/* <div style={{ marginTop: 15 }}>
        <p>Address</p>
        <TextArea
          rows={4}
          placeholder="Company Adderess"
          style={{ width: 400 }}
        />
      </div> */}

        {/* <div style={{ marginTop: 15 }}>
        <p>Company Category</p>
        <Radio.Group onChange={() => {}} defaultValue="a">
          <Radio.Button value="a">1 Start</Radio.Button>
          <Radio.Button value="b">2 Star</Radio.Button>
          <Radio.Button value="c">3 Start</Radio.Button>
          <Radio.Button value="d">4 Star</Radio.Button>
        </Radio.Group>
      </div> */}
      </Card>
    </div>
  );
};

export default CompanyProfile;
