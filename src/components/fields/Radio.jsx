import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Radio } from 'antd';

const AntdRadio =  (props) => {

  const { mode, style, onChange, dataSource, value, defaultValue } = props || {};

  const options = useMemo(() => (dataSource || []).map(v => ({ ...v, label: v.name, value: v.code })), [dataSource])

  const handleChange = (e) => {
    onChange && onChange(e)
  }

  const generateFieldViewWraper = () => {
    const val = value || defaultValue;
    return (
      <div className="field-view-wraper">
        {val ? (options.find(v => v.value === val) || {}).label : null }
      </div>
    )
  }

  const aProps = { 
    ..._.omit(props, ['mode', 'options', 'onChange']), 
    style: style || { width: '100%' },
    options,
    onChange: handleChange
  };

  return mode === 'edit' ? <Radio.Group {...aProps}/> : generateFieldViewWraper()
}

AntdRadio.propTypes = {
  mode: PropTypes.string,
  style: PropTypes.object,
}

AntdRadio.defaultProps = {
  mode: 'edit',
  disabled: false,
}

export default AntdRadio;