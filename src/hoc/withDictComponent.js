import React, { Component } from 'react';
import _ from 'lodash';

function withDictComponent(WrappedComponent, { isSearch } = {}) {
  class WithDictComponent extends Component {

    state = {
      options: [],
      translateDataSource: [],
    }
    
    componentDidMount(){
      const { dataSource, dictId, value, defaultValue, fetch } = this.props;
      if(isSearch) {
      // 翻译逻辑
      }else if(_.isArray(dataSource)){
        this.fetchData(null, dataSource)
      }else {
        this.fetchData(dictId)
      }
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
    getData = (params = {}, props = this.props) => {
      const { dictId, fetch, extraPrams, onLoaded } = props;

      if(!_.isFunction(fetch)) return Promise.reject('The search type fetch must be a Promise');

      return fetch({ dictId, ...params, ...extraPrams }).then(res => {
        const result = _.isFunction(onLoaded) ? onLoaded(res) : res;
        this.setState({
          options: this.pretreatment(result, props)
        })
      })
    }

    handleClearOptions = () => {
      this.setState({ options: [] })
    }

    render() {
      const { options, translateDataSource } = this.state;
      const props = {
        ..._.omit(this.props, ['fieldType', 'dictId', 'dataSource', 'fetch', 'onLoaded', 'pretreatment']),
        options,
        getData: this.getData,
        translateDataSource,
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