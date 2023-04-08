import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { InputNumber } from 'antd';
const AntdInputNumber =  (props) => {

  const { mode, style, onChange, value, defaultValue, viewRender } = props || {};

  const handleChange = (value) => {
    onChange && onChange(value)
  }

  const generateFieldViewWraper = () => {
    const viewVal = value || defaultValue;
    return <div className="field-view-wraper">{ viewRender ? viewRender(viewVal, viewVal) : viewVal }</div>
  }

  const aProps = { 
    ..._.omit(props, ['mode' , 'onChange', 'viewRender']), 
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