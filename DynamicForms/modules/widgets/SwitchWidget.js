import React from "react";
import PropTypes from "prop-types";
import { Switch } from 'antd';
import DescriptionField from "../fields/DescriptionField.js";

function SwitchWidget(props) {
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
    <div className={`switch ${disabled || readonly ? "disabled" : ""}`}>
      {schema.description && (
        <DescriptionField description={schema.description} />
      )}
      <Switch
        checkedChildren="YES" unCheckedChildren="NO"
        id={id}
        defaultChecked={typeof value === "undefined" ? false : value}
        required={required}
        disabled={disabled || readonly}
        autoFocus={autofocus}
        onChange={(checked, event) => onChange(checked)}
        onBlur={onBlur && (event => onBlur(id, event.target.checked))}
        onFocus={onFocus && (event => onFocus(id, event.target.checked))}
      >
        {label}
      </Switch>
    </div>
  );
}

SwitchWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SwitchWidget.propTypes = {
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

export default SwitchWidget;
