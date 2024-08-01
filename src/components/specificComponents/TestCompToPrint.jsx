import React from "react";
class TestComponentToPrint extends React.Component {
  render() {
    const { Bill } = this.props;

    return <div>{Bill}</div>;
  }
}
export default TestComponentToPrint;
