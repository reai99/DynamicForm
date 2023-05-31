import React, { Component } from "react";
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import _ from 'lodash';
import FieldRender from "../FieldRender";
import Validate from '../ValidateRender';

import './index.less';

const { Item: FormItem } = Form;

export default class DynamicFieldRender extends Component {

  isCellFocus = false; // 是否聚焦
  formRef = null;

  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }

  state = {
    hoverShowEdit: false,
    validateErrors: [],
    isError: false,
  }

  validateField = () => {
    return this.formRef.validateFields([this.props.id]);
  }

  get initialValues() {
    const { id, value, defaultValue } = this.props;
    return {
      [id]: value || defaultValue
    }
  }

  get isHoverMode() {
    const { mode } = this.props;
    return mode === 'hover';
  }

  get containerProps() {
    const { containerProps, size = 'default', style } = this.props;
    return {
      className: classnames(
        'dynamic-field-render',
        `dynamic-field-${size}`,
        {
          'dynamic-field-hover': this.isHoverMode,
          'dynamic-field-error': this.state.isError,
        }
      ),
      style,
      ...containerProps,
      ref: e => this.editFieldRef = e,
      onMouseDown: this.handleMouseDown
    }
  }

  get computedMode() {
    const { hoverShowEdit } = this.state;
    return this.isHoverMode ? (hoverShowEdit ? 'edit' : 'view') : this.props.mode
  }

  get formItemProps() {
    const { id, rules } = this.props;
    return {
      name: id,
      noStyle: true,
      rules,
    }
  }

  get isShowErrorTips() {
    const { isFocusShowErrorTips } = this.props;
    const { isError } = this.state;
    return (isFocusShowErrorTips ? this.isCellFocus : true) && isError;
    
  }

  get errorTipProps() {
    const { errorTipConfig, tipType: cTipType } = this.props;
    const { validateErrors } = this.state;
    const { tipType } = errorTipConfig || {};
    return {
      ...errorTipConfig,
      visible: this.isShowErrorTips,
      errors: validateErrors,
      placement: 'topLeft',
      tipType: cTipType || tipType || 'tooltip',
    }
  }

  handleClearStatus = (isClearError = true) => {
    window.onmousedown = null;
    this.mouseDownFlag = false;
    const state = { hoverShowEdit: false };
    if(isClearError) {
      state.validateErrors = [];
      state.isError = false;
    }
    this.setState(state)
  }

  handleMouseDown = async (e) => {
    e.stopPropagation();
    if (!this.mouseDownFlag) {
      this.mouseDownFlag = true;
      this.isCellFocus = true;
      this.setState({ hoverShowEdit: true });
      window.onmousedown && window.onmousedown(e, true);
      window.onmousedown = (e, status) => this.handleLeaveOutEdit(e, status);
    }
  };

  handleLeaveOutEdit = (e, status) => {
    e.stopPropagation();

    const { isError } = this.state;
    // 当前点击  e.target -> 指向上一个点击dom
    if (!this.editFieldRef || !this.editFieldRef.contains(e.target)) {
      this.isCellFocus = false;
      if(!isError) {
        this.handleClearStatus(true);
      } else if(!this.isShowErrorTips) {
        this.handleClearStatus(false);
      }
    }
    if (status) {
      window.onmousedown = null;
    }
  };

  hanleFieldsChange = _.debounce((changedFields) => {
    const { onFieldChange } = this.props;
    const { errors = [] } = changedFields[0] || {};
    onFieldChange && onFieldChange(changedFields[0]);
    this.setState({
      validateErrors: errors,
      isError: !!errors.length,
    })
  }, 100);

  generateMark = () => {
    const isRequired = (this.props.rules || []).find(v => v.required)
    return (
      isRequired ? (<mark>*</mark>) : null
    )
  }

  generateViewRender = (viewVal) => {
    const { placeholder } = this.props;
    return (!viewVal || (typeof viewVal === 'function' && _.isEmpty(viewVal))) ? <div className="dynamic-field-placeholder">{placeholder}</div> : viewVal;
  }

  generateFormRender = () => {
    const props = {
      ..._.omit(this.props, ['onFieldChange', 'errorTipConfig', 'tipType', 'isFocusShowErrorTips']),
      autoFocus: true,
      mode: this.computedMode,
      viewRender: this.generateViewRender,
    }
    return (
      <Form ref={e => this.formRef = e} component={false} onFieldsChange={this.hanleFieldsChange} initialValues={this.initialValues}>
        <FormItem {...this.formItemProps}>
          <FieldRender {...props} />
        </FormItem>
      </Form>
    )
  }

  render() {
    return (
      <Validate {...this.errorTipProps}>
        <div {...this.containerProps}>
          {this.generateFormRender()}
          {this.generateMark()}
        </div>
      </Validate>
    )
  }

  static propTypes = {
    mode: PropTypes.string.isRequired,
    id: PropTypes.string,
    size: PropTypes.oneOf(['large', 'default', 'size']),
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    rules: PropTypes.array,
    style: PropTypes.object,
    isFocusShowErrorTips: PropTypes.bool,
    onFieldChange: PropTypes.func,
    errorTipConfig: PropTypes.object,
    tipType: PropTypes.oneOf(['popover', 'tooltip']),
    containerProps: PropTypes.object,
    onRef: PropTypes.func,
  }
  static defaultProps = {
    mode: 'view',
    size: 'default',
    style: {},
    isFocusShowErrorTips: true,
    errorTipConfig: {},
    tipType: 'tooltip',
    containerProps: {},

  }
}