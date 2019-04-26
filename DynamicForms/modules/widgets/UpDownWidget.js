import React from "react";
import PropTypes from "prop-types";
import { InputNumber } from 'antd';

import { rangeSpec } from "../../utils";

function UpDownWidget(props) {
  return <InputNumber style={{ width: '100%' }} {...props} {...rangeSpec(props.schema)} />;
}

if (process.env.NODE_ENV !== "production") {
  UpDownWidget.propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };
}

export default UpDownWidget;
