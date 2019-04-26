import React from "react";
import { Button, Icon } from 'antd';

export default function IconButton(props) {
  const { type = "default", icon, className, ...otherProps } = props;
  return (
    <Button
      type={`${type}`}
      className={`${className}`}
      {...otherProps}>
      <Icon type={`${icon}`} />
    </Button>
  );
}
