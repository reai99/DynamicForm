import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayJs from 'dayjs';
import { DatePicker } from 'antd';


const { RangePicker } = DatePicker;

const AntdRangePicker = (props) => {

  const { mode, dateMode, style, onChange, defalutValue, value: originValue, format, viewRender } = props;

  useEffect(() => {
    const val = originValue || defalutValue;
    if (val instanceof Array) {
      setValue(val)
    }
  }, [])

  const [value, setValue] = useState();

  const getProps = () => {
    return _.omit(props, ['mode', 'viewRender'])
  }

  const getStyle = () => {
    return { width: '100%', minWidth: 200, ...style }
  }

  const transformStartDate = (value) => {
    if (!value) return null;
    return dayJs(dayJs(value).format("YYYY-MM-DD 00:00:00")).valueOf();
  }

  const transformEndDate = (value) => {
    if (!value) return null;
    return dayJs(dayJs(value).format("YYYY-MM-DD 23:59:59")).valueOf();
  }

  const handleChange = (val) => {
    const value = _.isArray(val) ? [transformStartDate(val[0]), transformEndDate(val[1])] : undefined;
    setValue(value);
    onChange && onChange(value);
  }

  const generateDateView = (date) => {
    return date && dayJs(date).format(format || 'YYYY-MM-DD')
  }

  const generateFieldViewWraper = () => {
    const viewVal = (value || []).map(date => generateDateView(date)).join('~');
    return (
      <div className="field-view-wraper">
        { viewRender ? viewRender(viewVal, value) : viewVal }
      </div>
    )
  }

  const aProps = {
    ...getProps(),
    value: value && [dayJs(value[0]), dayJs(value[1])],
    locale,
    mode: dateMode,
    style: getStyle(),
    onChange: handleChange
  }

  return mode === 'edit' ? <RangePicker {...aProps} /> : generateFieldViewWraper()
}


export default AntdRangePicker;