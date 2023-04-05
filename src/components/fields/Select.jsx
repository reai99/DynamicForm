import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import withDictComponent from '~/hoc/withDictComponent';


const AntdSelect = (props) => {
  const { mode, selectMode, style, placeholder, value , defaultValue, options } = props;

  const getProps = () => {
    return _.omit(props, ['getData', 'clearOptions', 'selectMode', 'translateDataSource'])
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

    if(_.isEmpty(val)) return ;

    const valArr = ({ tags: 1, multiple: 1})[selectMode] ? val : [val];
    return (
      <div className="field-view-wraper">
        {valArr.map(code => {
          const target = options.find(v => v.value === code) || {};
          return target.label
        }).join(';')}
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