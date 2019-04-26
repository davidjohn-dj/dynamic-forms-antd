import React from "react";
import { Row, Col, Icon, Button } from 'antd';
import IconButton from "./IconButton";

export default function AddButton({ className, onClick, disabled }) {
  return (
    <Row>
      <Col className={`${className}`} span={4}>
        <IconButton
          // tyCole="info"
          icon="plus"
          tabIndex="0"
          onClick={onClick}
          disabled={disabled}
        />
      </Col>
    </Row>
  );
}
