import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { 
  FIELD_TYPE_INPUT,
  FIELD_TYPE_TEXTAREA,
  FIELD_TYPE_INT,
  FIELD_TYPE_FLOAT,
  FIELD_TYPE_SELECT,
  FIELD_TYPE_MULTI_SELECT,
  FIELD_TYPE_TAG_SELECT,
  FIELD_TYPE_SEARCH,
  FIELD_TYPE_MULTI_SEARCH,
  FIELD_TYPE_DATE,
  FIELD_TYPE_RANGE,
  FIELD_TYPE_FIELD_GROUP,
  FIELD_TYPE_SWITCH,
  FIELD_TYPE_RADIO,
  FIELD_TYPE_CHECKBOX,
  FIELD_TYPE_COMPONENT,
  IS_FIELD_TYPE_TEXT_MAP,
  IS_FIELD_TYPE_NUMBER_MAP,
} from '~/constant/fieldType';
import {
  FieldInput,
  FieldInputNumber,
  FieldSelect,
  FieldSearch,
  DatePicker,
  RangePicker,
  FieldsGroup,
  FieldSwitch,
  FieldRadio,
  FieldCheckbox,
  FieldComponent,
} from '~/components/fields';

export default class FieldRender extends Component {

  get commonProps(){
    return _.omit(this.props, ['fieldType', 'isRequired', 'rules'])
  }

  transformsToVerificationRule = () => {
    const { rules, fieldType } = this.props;
    const verificationRule = {};
    (rules || []).forEach(rule => {
      if(typeof rule.max === 'number' && rule.type === 'number' && IS_FIELD_TYPE_NUMBER_MAP[fieldType]) verificationRule.max = rule.max;
      if(typeof rule.min === 'number' && rule.type === 'number' && IS_FIELD_TYPE_NUMBER_MAP[fieldType]) verificationRule.min = rule.min;
      if(typeof rule.max === 'number' && IS_FIELD_TYPE_TEXT_MAP[fieldType]) verificationRule.maxLength = rule.max;
    });
    return verificationRule
  }

  // 文本输入框（大文本）
  generateInput = (isMuti = false) => {
    const props = {
      ...this.transformsToVerificationRule(),
      ...this.commonProps,
      isMutiple: isMuti
    }
    return <FieldInput {...props}/>
  }

  // 数字输入框（整数、小数）
  generateInputNumber = (isInt = false) => {
    const props = {
      ...this.transformsToVerificationRule(),
      ...this.commonProps,
      precision: isInt ? 0 : undefined,
    }
    return <FieldInputNumber {...props}/>
  }

  // 下拉选择类型
  generateSelect = ({ mode } = {}) => {
    const props = {
      ...this.commonProps,
      selectMode: mode,
    }
    return <FieldSelect {...props}/>
  }

  // 下拉搜索
  generateSearch = ({ mode } = {}) => {
    const props = {
      ...this.commonProps,
      selectMode: mode,
    }
    return <FieldSearch {...props}/>
  }

  // 时间选择
  generateDatePicker = () => {
    const props = {
      ...this.commonProps,
    }
    return <DatePicker {...props}/>
  }

  // 日期选择
  generateRangePicker = () =>{
    const props = {
      ...this.commonProps,
    }
    return <RangePicker {...props}/>
  }

  // 开关
  generateFieldSwitch = () => {
    const props = {
      ...this.commonProps,
    }
    return <FieldSwitch {...props}/>
  }

  // 单选框
  generateFieldRadio = () => {
    const props = {
      ...this.commonProps,
    }
    return <FieldRadio {...props}/>
  }

  // 复选框
  generateFieldCheckbox = () => {
    const props = {
      ...this.commonProps,
    }
    return <FieldCheckbox {...props}/>
  }

  // 字段组
  generateFieldGroup = () => {
    const { isRequired } = this.props;
    const props = {
      ...this.commonProps,
      isRequired,
    }
    return <FieldsGroup {...props}/>
  }

  // 自定义组件
  generateFieldComponent = () => {
    const props = {
      ...this.commonProps,
    }
    return <FieldComponent {...props}/>
  }

  generateFieldRender = () => {
    const { fieldType } = this.props;
    switch(fieldType){
      case FIELD_TYPE_INPUT: 
        return this.generateInput();
      case FIELD_TYPE_TEXTAREA:
        return this.generateInput(true);
        case FIELD_TYPE_INT: 
        return this.generateInputNumber(true);
      case FIELD_TYPE_FLOAT:
        return this.generateInputNumber();
      case FIELD_TYPE_SELECT:
        return this.generateSelect();
      case FIELD_TYPE_MULTI_SELECT:
        return this.generateSelect({ mode: 'multiple' });
      case FIELD_TYPE_TAG_SELECT:
        return this.generateSelect({ mode: 'tags' });
      case FIELD_TYPE_SEARCH:
        return this.generateSearch();
      case FIELD_TYPE_MULTI_SEARCH:
        return this.generateSearch({ mode: 'multiple' }); 
      case FIELD_TYPE_DATE:
        return this.generateDatePicker()
      case FIELD_TYPE_RANGE:
        return this.generateRangePicker()
      case FIELD_TYPE_FIELD_GROUP:
        return this.generateFieldGroup()
      case FIELD_TYPE_SWITCH:
        return this.generateFieldSwitch()
      case FIELD_TYPE_RADIO:
        return this.generateFieldRadio()
      case FIELD_TYPE_CHECKBOX:
        return this.generateFieldCheckbox()
      case FIELD_TYPE_COMPONENT:
        return this.generateFieldComponent()
      default:
        return this.generateInput()
    }
  }
  
  render() {
    return this.generateFieldRender()
  }
  
}

FieldRender.propTypes = {
  mode: PropTypes.string,
}

FieldRender.defaultProps = {
  mode: 'edit',
}