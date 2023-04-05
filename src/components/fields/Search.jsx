import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Select, Spin } from 'antd';
import withDictComponent from '~/hoc/withDictComponent';


const AntdSearch = (props) => {

  const { mode, selectMode, style, placeholder, onChange, getData, clearOptions, isClearOptionsAfterSelect = false, translateDataSource } = props;

  const [value, setValue] = useState();
  const [fetching, setFetching] = useState(false);

  const isMultiple = useMemo(() => selectMode === 'multiple', [mode])

  const getProps = () => {
    return _.omit(props, ['getData','clearOptions', 'isClearOptionsAfterSelect', 'selectMode', 'translateDataSource' ])
  }

  const getStyle = () => {
    return { width: '100%', minWidth: '100px', ...style }
  }

  const handleSelect = () => {
    isClearOptionsAfterSelect && clearOptions();
  }

  const handleChange = (val) => {
    const realValue =  val && ( isMultiple ? (val || []).map(({ value }) => value) : val.value);
    setValue(val);
    onChange && onChange(realValue)
  }

  const handleSearch = _.debounce((name) => {
    if(_.isEmpty(name)) {
      clearOptions();
      setFetching(false);
    }else {
      setFetching(true);
      getData({ name }).then(() => {
        setFetching(false);
      })
    }
  }, 350);

  const generateFieldViewWraper = () => {
    return  (
      <div className="field-view-wraper">{translateDataSource.join(';')}</div>
    )
  }

  const aProps = {
    allowClear: true,
    showSearch: true,
    showArrow: false,
    filterOption: false,
    ...getProps(),
    value,
    labelInValue: true,
    placeholder: placeholder || '关键字查询',
    onSelect: handleSelect,
    onSearch: handleSearch,
    onChange: handleChange,
    notFoundContent: fetching ? <Spin size="small" /> : null,
    style: getStyle(),
    mode: selectMode,
  }

  return mode === 'edit' ? <Select {...aProps}/> : generateFieldViewWraper()
}


export default withDictComponent(AntdSearch, { isSearch: true });