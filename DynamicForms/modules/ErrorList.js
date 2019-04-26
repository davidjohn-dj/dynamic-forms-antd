import React from "react";
import { Alert } from 'antd';

export default function ErrorList(props) {
  const { errors } = props;
  return (
    <span>
      <h3 style={{ margin: '16px 0', color: '#f5222d' }}>Error!</h3>
      {errors.map((error, i) => {
        return (
          <Alert
            key={i}
            style={{ margin: '5px 0' }}
            message={error.stack}
            type="error"
            showIcon
            closable
          />
        );
      })}
    </span>
  );
}
