import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import withDictComponent from '~/hoc/withDictComponent';


const AntdSelect = (props) => {
  const { mode, selectMode, style, placeholder, value , defaultValue, options, viewRender } = props;

  const getProps = () => {
    return _.omit(props, ['getData', 'clearOptions', 'selectMode', 'originSearchValue', 'viewRender'])
  }

  const getStyle = () => {
    return { width: '100%', minWidth: '100px', ...style }
  }

  const handleFilterOption = (input, option) => {
    const { label, description } = option;
    const inputText = (input || '').toLowerCase();
    return ((label || '').toLowerCase()).includes(inputText) || ((description || '')).toLowerCase().includes(inputText);
  }

  const generateFieldViewWraper = () => {
    const val = value || defaultValue;

    if(_.isEmpty(val)) return viewRender ? viewRender() : null;

    const valArr = ({ tags: 1, multiple: 1})[selectMode] ? val : [val];
    
    const viewVal = valArr.map(code => {
      const target = options.find(v => v.value === code) || {};
      return target.label
    }).join(';');

    return (
      <div className="field-view-wraper">
        { viewRender ? viewRender(viewVal, valArr) : viewVal }
      </div>
    )
  }
  
  const aProps = {
    allowClear: true,
    showSearch: true,
    optionFilterProp: 'label',
    ...getProps(),
    placeholder: placeholder || '请选择',
    filterOption: handleFilterOption,
    style: getStyle(),
    mode: selectMode,
  }

  return  mode === 'edit' ?  <Select {...aProps}/> : generateFieldViewWraper()
}


export default withDictComponent(AntdSelect);