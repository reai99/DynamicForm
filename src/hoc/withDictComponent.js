import React, { Component } from 'react';
import _ from 'lodash';

function withDictComponent(WrappedComponent, { isSearch } = {}) {
  class WithDictComponent extends Component {

    originSearchValue = undefined;

    state = {
      options: [],
    }
    
    componentDidMount(){
      const { dataSource } = this.props;
      if(isSearch) {
      // 翻译逻辑
      if(this.value) {
        this.getData({ [this.codeName]: this.value }, this.props, true);
      }
      }else if(_.isArray(dataSource)){
        this.fetchData(null, dataSource)
      }else {
        this.fetchData(dictId)
      }
    }

    get value() {
      const { value, defaultValue } = this.props;
      const originVal = value || defaultValue;
      return typeof originVal === 'string' ? [originVal] : (originVal || [])
    }

    get codeName(){
      const { codeName } = this.props;
      return codeName || 'code';
    }

    get labelName(){
      const { labelName } = this.props;
      return labelName || 'name';
    }

    // 预处理
    pretreatment = (dataSource = [], props = this.props) => {
      const { pretreatment } = props;
      let options = [...dataSource];
      if(_.isFunction(pretreatment)) {
        options = pretreatment(options)
      }
      return options.map(item => ({ ...item, label: item[this.labelName], value: item[this.codeName]}));
    }

    fetchData = (dictId, dataSource, props = this.props) => {
      if(dictId) {
        this.fetchDict(dictId, props)
      }else {
        this.setState({
          options: this.pretreatment(dataSource, props)
        })
      }
    }

    fetchDict = async (dictId, props) => {
      const { fetch, extraPrams } = this.props;
      // 写通用字典接口业务逻辑

    } 

    // 搜索类型获取数据
    getData = (params = {}, props = this.props, isTranslate = false) => {
      const { dictId, fetch, extraPrams, onLoaded } = props;

      if(!_.isFunction(fetch)) return Promise.reject('The search type fetch must be a Promise');

      return fetch({ dictId, ...params, ...extraPrams }).then(res => {
        const result = _.isFunction(onLoaded) ? onLoaded(res) : res;
        const options = this.pretreatment(result, props);
        
        //翻译search类型值
        if(isTranslate) {
          this.originSearchValue = options.filter(v => this.value.includes(v.value));
        }

        this.setState({
          options: isTranslate ? [] : options
        })
      })
    }

    handleClearOptions = () => {
      this.setState({ options: [] })
    }

    render() {
      const { options } = this.state;
      const props = {
        ..._.omit(this.props, ['fieldType', 'dictId', 'dataSource', 'fetch', 'onLoaded', 'pretreatment']),
        options,
        originSearchValue: this.originSearchValue,
        getData: this.getData,
        clearOptions: this.handleClearOptions
      }
      return <WrappedComponent {...props}/>
    }
  }

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  WithDictComponent.displayName = `withDictComponent(${wrappedComponentName})`;

  return WithDictComponent;
}

export default withDictComponent;