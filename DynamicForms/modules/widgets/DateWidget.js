import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import moment from 'moment';

function DateWidget(props) {
  const {
    value,
    schema, uiSchema, formData, onChange, onBlur, ...otherProps
  } = props;
  const valueProps = { value: (value ? moment(value) : undefined) };

  return (
    <DatePicker
      {...valueProps}
      style={{ width: '100%' }}
      format="YYYY-MM-DD"
      placeholder="Select Date"
      onChange={value => onChange(value.format("YYYY-MM-DD") || undefined)}
    />
  );
}

if (process.env.NODE_ENV !== "production") {
  DateWidget.propTypes = {
    value: PropTypes.string,
  };
}

export default DateWidget;
