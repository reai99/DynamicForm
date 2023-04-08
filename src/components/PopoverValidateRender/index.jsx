import React, { Component } from "react";
import _ from 'lodash';
import { Popover } from "antd";

import './index.less';

export default class PopoverValidate extends Component {

  generateContent = () => {
    const { errors } = this.props;
    return (errors || []).map(msg => <div className="field-tooltip-error">{msg}</div>)
  }

  getPopoverProps = () => {
    const { title, visible } = this.props;
    return {
      ..._.omit(this.props, ['visible', 'errors']),
      open: visible || false,
      title: title || '校验结果：',
      content: this.generateContent(),
      getPopupContainer: (dom) => dom || document.body,
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div ref={e => this.popoverContainerRef = e}>
        <Popover {...this.getPopoverProps()}>
          {children}
        </Popover>
      </div>
    )
  }
}