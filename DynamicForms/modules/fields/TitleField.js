import React from "react";
import PropTypes from "prop-types";
import { Row } from 'antd';

const REQUIRED_FIELD_SYMBOL = "*";

function TitleField(props) {
  const { id, title, required } = props;
  return (
    <Row>
      <legend id={id}>
        {title}
        {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
      </legend>
    </Row>
  );
}

if (process.env.NODE_ENV !== "production") {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
  };
}

export default TitleField;
