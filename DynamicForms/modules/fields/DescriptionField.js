import React from "react";
import PropTypes from "prop-types";
import FormStyle from '../../../NewProject/formStyle';

function DescriptionField(props) {
  const { id, description } = props;
  if (typeof description === "string") {
    return (
      <FormStyle>
        <span id={id} className="field-description">
          {description}
        </span>
      </FormStyle>
    );
  } else {
    return (
      <FormStyle>
        <div id={id} className="field-description">
          {description}
        </div>
      </FormStyle>
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  DescriptionField.propTypes = {
    id: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  };
}

export default DescriptionField;
