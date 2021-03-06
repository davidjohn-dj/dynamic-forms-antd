import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from 'antd';
import DescriptionField from "../fields/DescriptionField.js";

function CheckboxWidget(props) {
  const {
    schema,
    id,
    value,
    required,
    disabled,
    readonly,
    label,
    autofocus,
    onBlur,
    onFocus,
    onChange,
  } = props;
  return (
    <div className={`checkbox ${disabled || readonly ? "disabled" : ""}`}>
      {schema.description && (
        <DescriptionField description={schema.description} />
      )}
      <Checkbox
        id={id}
        checked={typeof value === "undefined" ? false : value}
        required={required}
        disabled={disabled || readonly}
        autoFocus={autofocus}
        onChange={event => onChange(event.target.checked)}
        onBlur={onBlur && (event => onBlur(id, event.target.checked))}
        onFocus={onFocus && (event => onFocus(id, event.target.checked))}
      >
        {label}
      </Checkbox>
    </div>
  );
}

CheckboxWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  CheckboxWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxWidget;
