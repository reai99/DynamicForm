import React, { Component } from "react";
import classnames from 'classnames';
import { Form } from 'antd';
import _ from 'lodash';
import FieldRender from "../FieldRender";
import PopoverValidate from '../PopoverValidateRender';

import './index.less';

const { Item: FormItem } = Form;

export default class DynamicFieldRender extends Component {

  state = {
    hoverShowEdit: false,
    validateErrors: [],
    isError: false,
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
      ...(
        this.isHoverMode ?
          {
            ref: e => this.editFieldRef = e,
            onMouseDown: this.handleMouseDown
          } :
          {}
      )
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

  get popoverProps() {
    const { popoverProps, isValidateTip = true } = this.props;
    const { validateErrors, isError } = this.state;
    return {
      ...popoverProps,
      visible: isError && isValidateTip,
      errors: validateErrors,
      placement: 'topLeft',
    }
  }

  handleClearStatus = () => {
    this.setState({
      hoverShowEdit: false,
      validateErrors: [],
      isError: false,
    })
  }

  handleMouseDown = async (e) => {
    e.stopPropagation();
    if (!this.mouseDownFlag) {
      this.setState({ hoverShowEdit: true });
      window.onmousedown && window.onmousedown(e, true);
      window.onmousedown = (e, status) => this.handleLeaveOutEdit(e, status);
      this.mouseDownFlag = true;
    }
  };

  handleLeaveOutEdit = (e, status) => {
    e.stopPropagation();

    const { isError } = this.state;

    if(isError) return;

    // 当前点击  e.target -> 指向上一个点击dom
    if (!this.editFieldRef || !this.editFieldRef.contains(e.target)) {
      window.onmousedown = null;
      this.mouseDownFlag = false;
      this.handleClearStatus();
    }
    if (status) {
      window.onmousedown = null;
    }
  };

  hanleFieldsChange = _.debounce((changedFields) => {
    const { errors = [] } = changedFields[0] || {};
    this.setState({
      validateErrors: errors,
      isError: errors.length,
    })
  }, 100);

  generateViewRender = (viewVal) => {
    const { placeholder } = this.props;
    return (!viewVal || (typeof viewVal === 'function' && _.isEmpty(viewVal))) ? <div className="dynamic-field-placeholder">{placeholder}</div> : viewVal;
  }

  generateFormRender = () => {
    const props = {
      ...this.props,
      mode: this.computedMode,
      viewRender: this.generateViewRender,
    }
    return (
      <Form onFieldsChange={this.hanleFieldsChange} initialValues={this.initialValues}>
        <FormItem {...this.formItemProps}>
          <FieldRender {...props} />
        </FormItem>
      </Form>
    )
  }

  render() {
    return (
      <PopoverValidate {...this.popoverProps}>
        <div {...this.containerProps}>
          {this.generateFormRender()}
        </div>
      </PopoverValidate>
    )
  }
}