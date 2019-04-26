import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

function selectValue(value, selected, all) {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
}

function deselectValue(value, selected) {
  return selected.filter(v => v !== value);
}

const checkboxStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

function CheckboxesWidget(props) {
  const { id, disabled, options, value, autofocus, readonly, onChange } = props;
  const { enumOptions, enumDisabled, inline } = options;
  return (
    <CheckboxGroup id={id}>
      {enumOptions.map((option, index) => {
        const checked = value.indexOf(option.value) !== -1;
        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) != -1;
        const disabledCls =
          disabled || itemDisabled || readonly ? "disabled" : "";

        return inline ? (
          <Checkbox
            id={`${id}_${index}`}
            key={index}
            className={`${disabledCls}`}
            checked={checked}
            disabled={disabled || itemDisabled || readonly}
            autoFocus={autofocus && index === 0}
            onChange={event => {
              const all = enumOptions.map(({ value }) => value);
              if (event.target.checked) {
                onChange(selectValue(option.value, value, all));
              } else {
                onChange(deselectValue(option.value, value));
              }
            }}
          >
            {option.label}
          </Checkbox>
        ) : (
            <Checkbox
              key={index}
              style={checkboxStyle}
              id={`${id}_${index}`}
              className={`${disabledCls}`}
              checked={checked}
              disabled={disabled || itemDisabled || readonly}
              autoFocus={autofocus && index === 0}
              onChange={event => {
                const all = enumOptions.map(({ value }) => value);
                if (event.target.checked) {
                  onChange(selectValue(option.value, value, all));
                } else {
                  onChange(deselectValue(option.value, value));
                }
              }}
            >
              {option.label}
            </Checkbox>
          );
      })}
    </CheckboxGroup>
  );
}

CheckboxesWidget.defaultProps = {
  autofocus: false,
  options: {
    inline: false,
  },
};

if (process.env.NODE_ENV !== "production") {
  CheckboxesWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
      inline: PropTypes.bool,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxesWidget;
