import { Col, Tag } from "antd";
import { array, func, number } from "prop-types";

const { CheckableTag } = Tag;

const CheckableTags = (props) => {
  const { optionArray, selectedArray, onChange, colSpan } = props;

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedArray, tag]
      : selectedArray.filter((t) => t !== tag);
    onChange(nextSelectedTags);
  };

  return (
    <Col span={colSpan}>
      <span style={{ marginRight: 8 }}>{title}</span>
      {optionArray.map((tag, index) => (
        <CheckableTag
          key={index}
          checked={selectedArray.indexOf(tag) > -1}
          onChange={(checked) => handleChange(tag, checked)}
        >
          {tag}
        </CheckableTag>
      ))}
    </Col>
  );
};

CheckableTags.propTypes = {
  optionArray: array,
  selectedArray: array,
  onChange: func,
  colSpan: number,
};

export default CheckableTags;
