import { ADDITIONAL_PROPERTY_FLAG } from "../../utils";
import IconButton from "../IconButton";
import React from "react";
import PropTypes from "prop-types";
import * as types from "../../types";
import { Input, Icon, Row, Col } from 'antd';
import IntlMessages from 'Utils/IntlMessages';

import {
  isMultiSelect,
  isSelect,
  retrieveSchema,
  toIdSchema,
  getDefaultRegistry,
  mergeObjects,
  getUiOptions,
  isFilesArray,
  deepEquals,
  getSchemaType,
} from "../../utils";
import UnsupportedField from "./UnsupportedField";

const COMPONENT_TYPES = {
  array: "ArrayField",
  boolean: "BooleanField",
  integer: "NumberField",
  number: "NumberField",
  object: "ObjectField",
  string: "StringField"
};

function getFieldComponent(schema, uiSchema, idSchema, fields) {
  const field = uiSchema["ui:field"];
  if (typeof field === "function") {
    return field;
  }
  if (typeof field === "string" && field in fields) {
    return fields[field];
  }

  const componentName = COMPONENT_TYPES[getSchemaType(schema)];

  // If the type is not defined and the schema uses 'anyOf' or 'oneOf', don't
  // render a field and let the MultiSchemaField component handle the form display
  if (!componentName && (schema.anyOf || schema.oneOf)) {
    return () => null;
  }

  return componentName in fields
    ? fields[componentName]
    : () => {
      return (
        <UnsupportedField
          schema={schema}
          idSchema={idSchema}
          reason={`Unknown field type ${schema.type}`}
        />
      );
    };
}

function Label(props) {
  const { label, required, id } = props;
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return (
    <div className="ant-form-item-label" style={{ lineHeight: '20.9999px' }}>
      <label className={required ? `ant-form-item-required` : ''} htmlFor={id}>
        <IntlMessages id={label} />
      </label>
    </div>
  );
}

function LabelInput(props) {
  const { id, label, onChange } = props;
  return (
    <Input
      id={id}
      onBlur={event => onChange(event.target.value)}
      defaultValue={label}
    />
  );
}

function Help(props) {
  const { help } = props;
  if (!help) {
    // See #312: Ensure compatibility with old versions of React.
    return <div className="ant-form-explain" />;
  }
  return <div className="ant-form-explain">{help}</div>;
}

function ErrorList(props) {
  const { errors = [] } = props;
  if (!errors) {
    // See #312: Ensure compatibility with old versions of React.
    return <div className="ant-form-explain" />;
  }
  return errors
    .filter(elem => !!elem)
    .map((error, index) => {
      return (
        <div className="ant-form-explain" key={index}>
          {error}
        </div>
      );
    });
}

function DefaultTemplate(props) {
  const {
    id,
    classNames,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
    onKeyChange,
    onDropPropertyClick,
  } = props;
  if (hidden) {
    return <div className="hidden">{children}</div>;
  }

  const additional = props.schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);
  const keyLabel = `${label} Key`;

  return (
    <div className={`${classNames}`}>
      {additional && (
        <div className="ant-col-xs-5">
          <div className="ant-row ant-form-item ant-form-item-with-help">
            <Label label={keyLabel} required={required} id={`${id}-key`} />
            <LabelInput
              label={label}
              required={required}
              id={`${id}-key`}
              onChange={onKeyChange}
            />
          </div>
        </div>
      )}

      {displayLabel &&
        <Label label={label} required={required} id={id} />
      }
      <div className={additional ? "ant-form-item-control-wrapper ant-col-xs-15" : "ant-form-item-control-wrapper"}>
        {children &&
          <div className={`ant-form-item-control ${errors.props.errors ? (errors.props.errors.length > 0 ? `has-feedback has-error` : '') : ''}`}>
            <span className="ant-form-item-children" style={{ display: 'inline-block', width: '100%' }}>
              {children}
              {errors.props.errors !== undefined ?
                errors.props.errors.length > 0 ? <div className="ant-form-item-children-icon">
                  <Icon type="close-circle" theme="filled"></Icon>
                </div> : null : null
              }
              {displayLabel && description ? description : null}
            </span>
            {help.props.help ? help : errors}
          </div>
        }
      </div>
      {additional && (
        <div className="ant-col-xs-4">
          <IconButton
            type="danger"
            icon="delete"
            tabIndex="-1"
            style={{ border: "0" }}
            disabled={props.disabled || props.readonly}
            onClick={onDropPropertyClick(props.label)}
          />
        </div>
      )}
    </div>
  );
}
if (process.env.NODE_ENV !== "production") {
  DefaultTemplate.propTypes = {
    id: PropTypes.string,
    classNames: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node.isRequired,
    errors: PropTypes.element,
    rawErrors: PropTypes.arrayOf(PropTypes.string),
    help: PropTypes.element,
    rawHelp: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    description: PropTypes.element,
    rawDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    hidden: PropTypes.bool,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    displayLabel: PropTypes.bool,
    fields: PropTypes.object,
    formContext: PropTypes.object,
  };
}

DefaultTemplate.defaultProps = {
  hidden: false,
  readonly: false,
  required: false,
  displayLabel: true,
};

function SchemaFieldRender(props) {
  const {
    uiSchema,
    formData,
    errorSchema,
    idPrefix,
    name,
    onKeyChange,
    onDropPropertyClick,
    required,
    registry = getDefaultRegistry(),
  } = props;
  const {
    definitions,
    fields,
    formContext,
    FieldTemplate = DefaultTemplate,
  } = registry;
  let idSchema = props.idSchema;
  const schema = retrieveSchema(props.schema, definitions, formData);
  idSchema = mergeObjects(
    toIdSchema(schema, null, definitions, formData, idPrefix),
    idSchema
  );
  const FieldComponent = getFieldComponent(schema, uiSchema, idSchema, fields);
  const { DescriptionField } = fields;
  const disabled = Boolean(props.disabled || uiSchema["ui:disabled"]);
  const readonly = Boolean(props.readonly || uiSchema["ui:readonly"]);
  const autofocus = Boolean(props.autofocus || uiSchema["ui:autofocus"]);

  if (Object.keys(schema).length === 0) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }

  const uiOptions = getUiOptions(uiSchema);
  let { label: displayLabel = true } = uiOptions;
  if (schema.type === "array") {
    displayLabel =
      isMultiSelect(schema, definitions) ||
      isFilesArray(schema, uiSchema, definitions);
  }
  if (schema.type === "object") {
    displayLabel = false;
  }
  if (schema.type === "boolean" && !uiSchema["ui:widget"]) {
    displayLabel = false;
  }
  if (uiSchema["ui:field"]) {
    displayLabel = false;
  }

  const { __errors, ...fieldErrorSchema } = errorSchema;

  // See #439: uiSchema: Don't pass consumed class names to child modules
  const field = (
    <FieldComponent
      {...props}
      idSchema={idSchema}
      schema={schema}
      uiSchema={{ ...uiSchema, classNames: undefined }}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      errorSchema={fieldErrorSchema}
      formContext={formContext}
      rawErrors={__errors}
    />
  );

  const { type } = schema;
  const id = idSchema.$id;
  const label =
    uiSchema["ui:title"] || props.schema.title || schema.title || name;
  const description =
    uiSchema["ui:description"] ||
    props.schema.description ||
    schema.description;
  const errors = __errors;
  const help = uiSchema["ui:help"];
  const hidden = uiSchema["ui:widget"] === "hidden";
  const classNames = [
    // `ant-form-item`,
    "field",
    `field-${type}`,
    errors && errors.length > 0 ? "ant-form-item-with-help" : "",
    uiSchema.classNames,
  ]
    .join(" ")
    .trim();

  const fieldProps = {
    description: (
      <DescriptionField
        id={id + "__description"}
        description={description}
        formContext={formContext}
      />
    ),
    rawDescription: description,
    help: <Help help={help} />,
    rawHelp: typeof help === "string" ? help : undefined,
    errors: <ErrorList errors={errors} />,
    rawErrors: errors,
    id,
    label,
    hidden,
    onKeyChange,
    onDropPropertyClick,
    required,
    disabled,
    readonly,
    displayLabel,
    classNames,
    formContext,
    fields,
    schema,
    uiSchema,
  };

  const _AnyOfField = registry.fields.AnyOfField;
  const _OneOfField = registry.fields.OneOfField;

  return (
    <FieldTemplate {...fieldProps}>
      {field}

      {/*
        If the schema `anyOf` or 'oneOf' can be rendered as a select control, don't
        render the selection and let `StringField` component handle
        rendering
      */}
      {schema.anyOf && !isSelect(schema) && (
        <_AnyOfField
          disabled={disabled}
          errorSchema={errorSchema}
          formData={formData}
          idPrefix={idPrefix}
          idSchema={idSchema}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          options={schema.anyOf}
          baseType={schema.type}
          registry={registry}
          safeRenderCompletion={props.safeRenderCompletion}
          uiSchema={uiSchema}
        />
      )}

      {schema.oneOf && !isSelect(schema) && (
        <_OneOfField
          disabled={disabled}
          errorSchema={errorSchema}
          formData={formData}
          idPrefix={idPrefix}
          idSchema={idSchema}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          options={schema.oneOf}
          baseType={schema.type}
          registry={registry}
          safeRenderCompletion={props.safeRenderCompletion}
          uiSchema={uiSchema}
        />
      )}
    </FieldTemplate>
  );
}

class SchemaField extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // if schemas are equal idSchemas will be equal as well,
    // so it is not necessary to compare
    return !deepEquals(
      { ...this.props, idSchema: undefined },
      { ...nextProps, idSchema: undefined }
    );
  }

  render() {
    return SchemaFieldRender(this.props);
  }
}

SchemaField.defaultProps = {
  uiSchema: {},
  errorSchema: {},
  idSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SchemaField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    formData: PropTypes.any,
    errorSchema: PropTypes.object,
    registry: types.registry.isRequired,
  };
}

export default SchemaField;
