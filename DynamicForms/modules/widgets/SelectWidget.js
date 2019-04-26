import React from "react";
import PropTypes from "prop-types";
import { Select } from 'antd';
import { asNumber, guessType } from "../../utils";

const nums = new Set(["number", "integer"]);
const Option = Select.Option;

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue(schema, value) {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;
  if (value === "") {
    return undefined;
  } else if (type === "array" && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every(x => guessType(x) === "number")) {
      return asNumber(value);
    } else if (schema.enum.every(x => guessType(x) === "boolean")) {
      return value === "true";
    }
  }

  return value;
}

function getValue(value) {
  return value;
}

function SelectWidget(props) {
  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    placeholder
  } = props;
  const { enumOptions, enumDisabled } = options;
  const emptyValue = multiple ? [] : "";
  return (
    <Select
      placeholder={placeholder}
      id={id}
      showSearch
      labelInValue
      optionFilterProp="children"
      style={{ minWidth: '100%' }}
      multiple={multiple}
      value={typeof value === "undefined" ? { key: emptyValue } : { key: value.key }}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onBlur={
        onBlur &&
        (event => {
          const newValue = getValue(event);
          onBlur(id, processValue(schema, newValue));
        })
      }
      onFocus={
        onFocus &&
        (event => {
          const newValue = getValue(event);
          onFocus(id, processValue(schema, newValue));
        })
      }
      onChange={event => {
        const newValue = getValue(event);
        onChange(processValue(schema, newValue));
      }}>
      {/* {!multiple && schema.default === undefined && (
        <Option value="">{placeholder}</Option>
      )} */}
      {enumOptions.map(({ value, label }, i) => {
        const disabled = enumDisabled && enumDisabled.indexOf(value) != -1;
        // for (let i in value) {
        //   if (value.hasOwnProperty(i))
        //     console.log(value[i]);
        // }
        return (
          <Option key={typeof (value) === 'object' ? value.id : i}
            value={typeof (value) === 'object' ? `${value.id}` : value}
            disabled={disabled}>
            {typeof (value) === 'object' ? `${value.name}` : label}
          </Option>
        );
      })}
    </Select>
  );
}

SelectWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default SelectWidget;
