import React from "react";
export default class ComponentToPrint extends React.PureComponent {
  
  render() {

    const { Bill } = this.props;
    return <div dangerouslySetInnerHTML={{ __html: Bill }} />;
  }
}
