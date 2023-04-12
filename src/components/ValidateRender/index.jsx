import React, { Component } from "react";
import _ from 'lodash';
import { Popover, Tooltip } from "antd";

import './index.less';

const TIPS_TYPE = {
  popover: Popover,
  tooltip: Tooltip
}

export default class PopoverValidate extends Component {

  getDiffModeProps = () => {
    const { title, tipType } = this.props;
    switch(tipType) {
      case 'tooltip': 
        return {
          title: this.generateContent()
        }
      case 'popover': 
        return {
          title: title || '校验结果：',
          content: this.generateContent(),
        }
      default :
      return {};
    }
  }

  generateContent = () => {
    const { errors } = this.props;
    return (errors || []).map(msg => <div className="field-tooltip-error">{msg}</div>)
  }


  getProps = () => {
    const { visible, tipType } = this.props;
    return {
      ..._.omit(this.props, ['visible', 'errors', 'tipType']),
      open: visible || false,
      ...this.getDiffModeProps(),
    }
  }

  render() {
    const { children, tipType } = this.props;
    const Element = TIPS_TYPE[tipType] || null;
    return (
      Element ? <Element {...this.getProps()}>{ children }</Element> : children
    )
  }
}