import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Checkbox } from 'antd';

const AntdCheckBox =  (props) => {

  const { mode, style, dataSource, onChange, value, defaultValue, viewRender } = props || {};

  const options = useMemo(() => (dataSource || []).map(v => ({ ...v, label: v.name, value: v.code })), [dataSource])

  const handleChange = (e) => {
    onChange && onChange(e)
  }

  const generateFieldViewWraper = () => {
    const valArr = value || defaultValue;
    const viewVal = _.isArray(valArr) ? valArr.map(code => (options.find(v => v.value === code) || {}).label).join(';') : null;
    return (
      <div className="field-view-wraper">
        {viewRender ? viewRender(viewVal, valArr, options) : viewVal }
      </div>
    )
    return
  }  

  const aProps = { 
    ..._.omit(props, ['mode', 'options', 'onChange', 'dataSource', 'viewRender']), 
    style: style || { width: '100%' },
    options,
    onChange: handleChange,
  };

  return mode === 'edit' ? <Checkbox.Group {...aProps}/> : generateFieldViewWraper()
}

AntdCheckBox.propTypes = {
  mode: PropTypes.string,
  style: PropTypes.object,
}

AntdCheckBox.defaultProps = {
  mode: 'edit',
  disabled: false,
}

export default AntdCheckBox;