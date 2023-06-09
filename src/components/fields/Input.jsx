import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input } from 'antd';

const { TextArea } = Input;

const AntdInput =  (props) => {

  const { mode, isMutiple, style, placeholder, onChange, value, defaultValue, viewRender } = props || {};
  
  const Element = isMutiple ? TextArea : Input;

  const handleChange = (e) => {
    const value = e.currentTarget.value;
    onChange && onChange(value)
  }

  const generateFieldViewWraper = () => {
    const viewVal = value || defaultValue;
    return <div className="field-view-wraper">{ viewRender ? viewRender(viewVal, viewVal) : viewVal }</div>
  }

  const aProps = { 
    ..._.omit(props, ['mode', 'isMutiple', 'onChange', 'viewRender']), 
    placeholder: placeholder || '请输入',
    style: style || { width: '100%', minWidth: 80 },
    onChange: handleChange
  };
  
  return mode ==='edit' ? <Element {...aProps}/> : generateFieldViewWraper();
}

AntdInput.propTypes = {
  mode: PropTypes.string,
  style: PropTypes.object,
  isMutiple: PropTypes.bool,
}

AntdInput.defaultProps = {
  mode: 'edit',
  disabled: false,
  isMutiple: false,
}

export default AntdInput;