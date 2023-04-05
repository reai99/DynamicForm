import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayJs from 'dayjs';
import { DatePicker } from 'antd';

const AntdDatePicker = (props) => {

  const { mode, dateMode, style, placeholder, onChange, defalutValue, value: originValue, format } = props;

  useEffect(() => {
    const val = originValue || defalutValue;
    if(({ sting: 1, number: 1})[typeof val]) {
      setValue(val)
    }
  }, [originValue, defalutValue])

  const [value, setValue] = useState();

  const getProps = () => {
    return _.omit(props, ['mode'])
  }

  const getStyle = () => {
    return { width: '100%', minWidth: 120, ...style }
  }

  const handleChange = (val) => {
    const value = val ? dayJs(val).valueOf() : undefined;
    setValue(value);
    onChange && onChange(value)
  }

  const generateFieldViewWraper = () => {
    return  (
      <div className="field-view-wraper">{dayJs(value).format(format || 'YYYY-MM-DD')}</div>
    )
  }
  
  const aProps = {
    ...getProps(),
    value: value && dayJs(value),
    mode: dateMode,
    placeholder: placeholder || '请选择',
    locale,
    style: getStyle(),
    onChange: handleChange
  }

  return mode === 'edit' ? <DatePicker {...aProps}/>  : generateFieldViewWraper()
}


export default AntdDatePicker;