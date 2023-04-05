import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Space, Form } from 'antd';
import FieldRender from '~/components/FieldRender';

const FieldsGroup = (props) => {

  const { id, mode, size, groupFields, onChange, style, value: originValue, defalutValue, isRequired: isAllRequired } = props;

  useEffect(() => {
    const val = originValue || defalutValue || {};
    setValue(val);
  }, [originValue, defalutValue])
  
  const [ value, setValue ] = useState({});

  const getFieldRequired = (isRequired) => {
    return (isRequired === '1' || isAllRequired === '1' ) && (isAllRequired === '1' && !_.isEmpty(value)) && mode === 'edit';
  }

  const getFieldRules = (field, required) => {
    const { rules = [], title } = field;
    if(required && !rules.find(v => v.required)) {
      return rules.concat({ required: true , message: `${title || ''}字段必填`});
    }
    return rules;
  }

  const getFormItemProps = (field) => {
    return {
      name: [id, field.name],
      noStyle: true,
      rules: getFieldRules(field, getFieldRequired(field.isRequired)),
    }
  }

  const handleChange = (val, key) => {
    let valueList = _.cloneDeep(value);
    valueList[key] = val;
    setValue(valueList);
    onChange && onChange(_.isEmpty(valueList) ? undefined : valueList)
  }

  const generateGroupFieldsRender = () => {
    return (groupFields || []).map((field, index) => {
      const fieldName = field.name || `group_${index}`;
      const fieldProps = {
        mode,
        ...field,
        size: field.size || size,
        disabled: field.isEditable === '1',
        value: value[fieldName],
        onChange: (val) => handleChange(val, fieldName)
      }
      return (
        <Form.Item key={fieldName} {...getFormItemProps(field)}>
          <FieldRender  {...fieldProps}/>
        </Form.Item>
        )
    })
  }

  return (
    <Space.Compact style={style} size={size} block>
     {generateGroupFieldsRender()}
    </Space.Compact>
  )
}


export default FieldsGroup;