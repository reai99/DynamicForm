import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FieldRender from '~/components/FieldRender';
import { Form, Row, Col } from 'antd';

import './index.less';

const DynamicFormRender = (props) => {

  const { form, mode, size, className, formList, rowCount, layoutType = 'layout', formLayout, initialValues = {} } = props;

  const formRef =  form || (Form.useForm())[0];

  const getFormProps = () => {
    const formProps =  _.omit(props, ['form', 'formList', 'rowCount', 'layoutType']);
    return { ...formProps, className: `dynamic-form-render ${className || ''}`}
  }

  const getFormLayout = (count, field) => {

    if(formLayout) return formLayout;

    const computedDçivisor = getFieldIsRowAlone(field) ? count : 1;

    if(layoutType === 'normal') {
      return { labelCol: { flex: 'none' }, wrapperCol: { flex: 'auto' } }
    }
    
    switch(count) {
      case 2: {
        const labelCol = 6 / computedDçivisor;
        return { labelCol: { span: labelCol }, wrapperCol: { span: 24 - labelCol } }
      } 
      case 3: {
        const labelCol = 9 / computedDçivisor;
        return { labelCol: { span: labelCol }, wrapperCol: { span: 24 - labelCol } }
      }
      case 4: {
        const labelCol = 8 / computedDçivisor;
        return { labelCol: { span: labelCol }, wrapperCol: { span: 24 - labelCol } }
      }
      default: {
        const labelCol = 9 / computedDçivisor;
        return { labelCol: { span: labelCol }, wrapperCol: { span: 24 - labelCol } }
      }
    }
  }

  const getFieldRequired = (field) => {
    return field.isRequired === '1' && mode === 'edit';
  }

  const getFieldIsRowAlone = (field) => {
    return field.isRowAlone === '1' || field.isRowAlone === true;
  }

  const formatFormList = (formList) => {
    const itemList = _.cloneDeep(formList);
    const result = [];
    let group = [];
    
    while(itemList.length > 0){
      const item = itemList.shift();
      group.push(item);
      if(group.length === rowCount) {
        result.push([...group]);
        group = [];
      } 
    }

    if(group.length) result.push([...group]);

    return result;
  }

  const getFieldRules = (field, required) => {
    const { rules = [], title } = field;
    if(required && !rules.find(v => v.required)) {
      return rules.concat({ required: true , message: `${title || ''}字段必填`});
    }
    return mode === 'edit' ? rules : [];
  }

  const generateFieldRender = (attrList) => {
    return attrList.filter(v => v.isEnabled !== '0' ).map((field, index) => {
      const required = getFieldRequired(field);
      const rules = getFieldRules(field, required);
      const formItemProps = {
        ...getFormLayout(rowCount, field),
        ...field.formItemProps,
        label: field.title,
        required, 
        disabled: field.isEditable === '1',
        name: field.name,
        rules,
      }
      const fieldProps = { 
        ..._.omit(field, ['title', 'name', 'isEditable']), 
        mode, 
        size: field.size || size,
        rules,
      };
      const colSpan = getFieldIsRowAlone(field) ?  24 : Math.floor(24 / rowCount);

      return (
        <Col className={`form-field-item-${layoutType}`}  span={colSpan} key={index}>
          <Form.Item {...formItemProps} key={field.title}>
            <FieldRender {...fieldProps }/>
          </Form.Item>
        </Col>
      )
    })
  }

  const generateFormFieldsRender = () => {
    const itemList = formatFormList(formList);
    return itemList.map((row, index) => {
      return <Row key={index}>{generateFieldRender(row)}</Row>
    })
  }

  return (
    <Form {...getFormProps()} form={formRef} >
      {generateFormFieldsRender()}
    </Form>
  )
}

DynamicFormRender.propTypes = {
  mode: PropTypes.string,
  formList: PropTypes.array,
  rowCount: PropTypes.number,
}

DynamicFormRender.defaultProps = {
  mode: 'edit',
  formList: [],
  rowCount: 3,
}

export default DynamicFormRender;
