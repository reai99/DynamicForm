# DynamicForm

基于webapck5、react、antd5搭建的动态配置表单组件，支持编辑和视图模式

## 构建和发布

#### 安装依赖
npm i

#### 运行项目 
npm run start

#### 打包 
npm run build

#### 发布
npm run release


## 基本使用

#### 支持类型（FORM_FIELD_TYPE）

引入方式

``` javascript
import { FORM_FIELD_TYPE } from 'antd-dynamic-form-render';
```
基本配置

| 类型    | 字段 
|------ |-----------
|普通文本 | FIELD_TYPE_INPUT
|大文本 | FIELD_TYPE_TEXTAREA
|数字（整数）| FIELD_TYPE_INT
|数字（浮点）| FIELD_TYPE_FLOAT
|下拉单选 | FIELD_TYPE_SELECT
|下拉多选 | FIELD_TYPE_MULTI_SELECT
|下拉Tag选择 | FIELD_TYPE_TAG_SELECT
|下拉单选搜索 | FIELD_TYPE_SEARCH
|下拉多选搜索 | FIELD_TYPE_MULTI_SEARCH
|下拉数形单选 | FIELD_TYPE_TREE_SELECT
|下拉数形多选 | FIELD_TYPE_MULTI_TREE_SELECT
|日期 | FIELD_TYPE_DATE
|日期区间 | FIELD_TYPE_RANGE
|开关 | FIELD_TYPE_SWITCH
|单选框 | FIELD_TYPE_RADIO
|复选框 | FIELD_TYPE_CHECKBOX
|组合组件 | FIELD_TYPE_FIELD_GROUP
|自定义组件 | FIELD_TYPE_COMPONENT


#### 表单项组件（FormFieldRender）

引入方式

``` javascript
import { FormFieldRender } from 'antd-dynamic-form-render';
```
基本配置

| 参数 | 描述
|------ | ------
|mode | 字段模式，可选值可为edit、view，默认edit
|fieldType | 字段类型，可选择为FORM_FIELD_TYPE支持类型
|rules | 规则字段，数字类型rules可以转换为antd属性
|... | 其他prop参考antd各个表单组件配置


#### 动态表单组件（DynamicFormRender）
引入方式

``` javascript
import { DynamicFormRender } from 'antd-dynamic-form-render';

```
基本配置

| 参数 | 描述
|------ | ------
|mode | 字段模式，可选值可为edit、view
|form | antd的form实例
|size | 字段尺寸大小，可选small、default、large
|layoutType | 布局方式，顺序布局normal、栅格布局layout， 默认layout
|rowCount | 一行显示的字段个数，默认为3
|initialValues | 表单初始值
|formLayout | 自定义表单布局，否则默认通过 layoutType和rowCount值进行生成
|formItemProps | 其他antd的Form.item的配置
|formList | 配置表单项字段，具体参考formList配置
|... | 其他prop参考antd的Form配置


formList配置

| 参数 | 描述
|------- | --------
|title | 字段名称
|name | 字段编码
|fieldType | 字段类型
|rules | 校验规则，参考antd的表单rules配置
|isEnabled | 字段是否使能，字符串0或1，0表示不使能，1表示使能， 默认使能
|isEditable | 字段是否可编辑，字符串0或1，0表示不可编辑，1表示可编辑，默认可编辑
|isRequired | 字段是否可必填，字符串0或1，0表示不必填，1表示必填，默认不必填
|isRowAlone | 字段是否可单行展示，字符串0或1，1表示单行展示
|dataSource | 数据源字段，针对部分字段类型有效
|fetch | 搜索类型字段必填，自定义搜索接口
|onLoaded | 数据源字段加载数据回调
|groupFields | 只针对字段组字段类型有效，数组类型，配置参考formList配置
|component | 只针对自定义组件字段类型有效，可自定义表单项组件
|... | 其他prop参考antd各个表单组件配置


## 参考案例
```javascript
import React, { useRef, useState } from "react";
import { Form, Button, Input } from 'antd';
import jsonp from 'fetch-jsonp';
import qs from 'qs';

import { FORM_FIELD_TYPE, DynamicFormRender } from 'antd-dynamic-form-render'

const { 
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
} = FORM_FIELD_TYPE;

const DATASOURCE = [{ code: '1', name: '1111'}, { code: '2', name: '2222'}];

const UNIT_DATA = [{ code: '1', name: 'cm'}, { code: '2', name: 'm'}];

const defaultValue = {
  field1: '1233',
  field2: 222.332,
  field3: '1',
  field33: ['1', '2'],
  field4: 123431,
  field5: '114311.8010847826',
  field6: ['114311.8010847826'],
  field7: 1680019200000,
  field8: [1677945600000, 1682092799000],
  field9: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
  field11: true,
  field12: '1',
  field13: ['1', '2'],
  field14: '啦啦啦',
  component: {field1: '123', field2: '2' }
}


const TestDynamicFormRender = (props) => {

  const [mode, setMode]= useState('view');

  const initialValues = useRef(defaultValue)

  const [form] = Form.useForm();

  const fetchData = (params) => {
    const { name } = params || {}
    return jsonp(`https://suggest.taobao.com/sug?code='utf-8'&q=${name}`).then((response: any) => response.json())
  }

  const handleFetchLoaded = (res) => {
    return (res.result || []).map(v => ({ code: v[1], name: v[0]}))
  }

  const handleSubmit = () => {
    form.validateFields().then(values =>{
      console.log(values)
    })
  }

  const handleReset = () => {
    form.resetFields();
  }

  const handleChangeMode = () => {
    setMode(mode === 'edit' ? 'view' : 'edit')
  }

  const generateComponent = (props) => {
    const aProps = _.omit(props, ['mode', 'component'])
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input {...aProps}/>
        <a style={{ marginLeft: '10px' }}>link</a>
      </div>
    )
  }
  
  const formProps = {
    form,
    mode: mode,
    initialValues: initialValues.current,
    size: 'small',
    // layout: 'vertical',
    // formLayout: { labelCol: { span: 3 }, wrapperCol: { span: 12 } },
    layoutType: 'normal',
    rowCount: 4,
    formList: [
      {
        title: '文本',
        name: 'field1',
        fieldType: FIELD_TYPE_INPUT,
        rules: [
          { max: 5, message: '最大长度为5' },
        ],
      },
      {
        title: '浮点数字',
        name: 'field2',
        rules: [
          { max: 100, type: 'number', message: '最大值为100' },
          { min: 10,  type: 'number', message: '最小值为10' },
        ],
        // isRequired: '1',
        fieldType: FIELD_TYPE_FLOAT,
      },
      {
        title: '下拉单选',
        name: 'field3',
        // isRequired: '1',
        fieldType: FIELD_TYPE_SELECT,
        dataSource: [...DATASOURCE],
      },
      {
        title: '下拉多选',
        name: 'field33',
        isRequired: '1',
        fieldType: FIELD_TYPE_MULTI_SELECT,
        dataSource: [...DATASOURCE],
      },
      {
        title: '整数',
        name: 'field4',
        fieldType: FIELD_TYPE_INT,
      },
      {
        title: '下拉单选搜索',
        name: 'field5',
        fieldType: FIELD_TYPE_SEARCH,
        isClearOptionsAfterSelect: true,
        fetch: fetchData,
        onLoaded: handleFetchLoaded,
      },
      {
        title: '下拉多选搜索',
        name: 'field6',
        fieldType: FIELD_TYPE_MULTI_SEARCH,
        fetch: fetchData,
        onLoaded: handleFetchLoaded,
      },
      {
        title: '日期',
        name: 'field7',
        fieldType: FIELD_TYPE_DATE,
      },
      {
        title: '日期区间',
        name: 'field8',
        fieldType: FIELD_TYPE_RANGE,
      },
      {
        title: '大文本',
        name: 'field9',
        fieldType: FIELD_TYPE_TEXTAREA,
      },
      {
        title: '开关',
        name: 'field11',
        fieldType: FIELD_TYPE_SWITCH,
      },
      {
        title: '单选框',
        name: 'field12',
        fieldType: FIELD_TYPE_RADIO,
        dataSource: [...DATASOURCE],
      },
      {
        title: '复选框',
        name: 'field13',
        fieldType: FIELD_TYPE_CHECKBOX,
        dataSource: [...DATASOURCE],
      },
      {
        title: '自定义组件',
        name: 'field14',
        fieldType: FIELD_TYPE_COMPONENT,
        isRequired: '1',
        component: generateComponent,
      },
      {
        title: '组合组件',
        name: 'component',
        fieldType: FIELD_TYPE_FIELD_GROUP,
        isRowAlone: '1',
        isRequired: '1',
        style: { maxWidth: '400px' },
        groupFields: [
          {
            name: 'field1',
            title: '数字',
            fieldType: FIELD_TYPE_INT,
            // isRequired: '1',
          },
          {
            name: 'field2',
            title: '单位',
            // allowClear: false,
            fieldType: FIELD_TYPE_SELECT,
            dataSource: [...UNIT_DATA],
            // isRequired: '1',
          },
          {
            title: '下拉多选搜索',
            name: 'field6',
            fieldType: FIELD_TYPE_MULTI_SEARCH,
            fetch: fetchData,
            onLoaded: handleFetchLoaded,
          },
        ]
      },
    ]
  }
  return (
    <>
      <DynamicFormRender {...formProps}/>
      <div style={{ padding: '10px 0'}}>
        <Button onClick={handleChangeMode}>切换模式</Button>
        <Button style={{ marginLeft: '10px' }} onClick={handleSubmit}>提交</Button>
        <Button style={{ marginLeft: '10px' }} onClick={handleReset}>重置</Button>
      </div>
    </>
  )
}

export default TestDynamicFormRender;
```






