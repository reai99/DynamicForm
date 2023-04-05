import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { InputNumber } from 'antd';
const AntdInputNumber =  (props) => {

  const { mode, style, onChange, value, defaultValue } = props || {};

  const handleChange = (value) => {
    onChange && onChange(value)
  }

  const generateFieldViewWraper = () => {
    return <div className="field-view-wraper">{ value || defaultValue}</div>
  }

  const aProps = { 
    ..._.omit(props, ['mode' , 'onChange']), 
    style: style || { width: '100%' },
    onChange: handleChange
  };

  return mode === 'edit' ? <InputNumber {...aProps}/>  : generateFieldViewWraper()
}

AntdInputNumber.propTypes = {
  mode: PropTypes.string,
  style: PropTypes.object,
}

AntdInputNumber.defaultProps = {
  mode: 'edit',
  disabled: false,
}

export default AntdInputNumber;