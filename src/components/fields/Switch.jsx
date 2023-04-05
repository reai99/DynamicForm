import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Switch } from 'antd';


const AntdSwitch =  (props) => {

  const { mode, style, onChange, checkedChildren, unCheckedChildren, value, defaultValue } = props || {};

  const checkedChildrenName = useMemo(() => checkedChildren || '是', [checkedChildren]);

  const unCheckedChildrenName = useMemo(() => unCheckedChildren || '否', [checkedChildren])

  const handleChange = (checked) => {
    onChange && onChange(checked)
  }

  const generateFieldViewWraper = () => {
    const val = value || defaultValue;
    return (
      <div className="field-view-wraper">
        { val ? checkedChildrenName : unCheckedChildrenName }
      </div>
    )
  }

  const aProps = { 
    ..._.omit(props, ['mode', 'onChange']), 
    checkedChildren: checkedChildrenName,
    unCheckedChildren: unCheckedChildrenName,
    checked: value,
    style,
    onChange: handleChange
  };

  return mode === 'edit' ? <Switch {...aProps}/> : generateFieldViewWraper()
}

AntdSwitch.propTypes = {
  mode: PropTypes.string,
  style: PropTypes.object,
}

AntdSwitch.defaultProps = {
  mode: 'edit',
  disabled: false,
}

export default AntdSwitch;