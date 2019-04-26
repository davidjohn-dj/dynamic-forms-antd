import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import moment from 'moment';

function DateTimeWidget(props) {
  const {
    value,
    schema, uiSchema, formData, onChange, onBlur, ...otherProps
  } = props;
  const valueProps = { value: (value ? moment(value) : null) };
  return (
    <DatePicker
      style={{ width: '100%' }}
      placeholder="Select Date and Time"
      format="YYYY-MM-DD HH:mm:ss"
      showTime
      {...valueProps}
      onChange={(e) => {
        onChange(e ? moment(e).format("YYYY-MM-DD HH:mm:ss") : null);
      }}
      onBlur={(e) => {
        onBlur(e ? moment(e).format("YYYY-MM-DD HH:mm:ss") : null);
      }}
      onOk={(value) => {
        onChange(value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : null);
      }}
    />
  );
}

if (process.env.NODE_ENV !== "production") {
  DateTimeWidget.propTypes = {
    value: PropTypes.string,
  };
}

export default DateTimeWidget;
