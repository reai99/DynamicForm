import React, { useRef, useState } from "react";
import DynamicFormRender from '~/components/DynamicFormRender';
import DynamicFieldRender from "~/components/DynamicFieldRender";
import { Form, Button, Input } from 'antd';
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
} from '~/constant/fieldType';

import jsonp from 'fetch-jsonp';

const DATASOURCE = [{ code: '1', name: '1111'}, { code: '2', name: '2222'}];

const UNIT_DATA = [{ code: '1', name: 'cm'}, { code: '2', name: 'm'}]

const SEARCH_DATA = [
  { code: '1', name: '测试11'},
  { code: '2', name: '测试12'},
  { code: '3', name: '测试13'},
  { code: '4', name: '测试14'},
  { code: '5', name: '测试15'},
]

const defaultValue = {
  field1: '1233',
  field2: 222.332,
  field3: '1',
  field33: ['1', '2'],
  field4: 123431,
  field5: '1',
  field6: ['1', '2'],
  field7: 1680019200000,
  field8: [1677945600000, 1682092799000],
  field9: 'sadas撒大嫂大嫂立刻接受对方离开家大嫂开了房间的索科洛夫就流口水的肌肤立刻大嫂减肥了看时间都浪费空间上的六块腹肌大嫂六块腹肌了',
  field11: true,
  field12: '1',
  field13: ['1', '2'],
  field14: '啦啦啦',
  component: {field1: '123', field2: '2', field6: ['4'] }
}

const TestDynamicFormRender = (props) => {

  const [mode, setMode]= useState('edit');

  const initialValues = useRef(defaultValue)

  const [form] = Form.useForm();

  const fetchData = (params) => {
    const { name, code } = params || {}
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = SEARCH_DATA.filter(item => {
          if(name) return item.name.indexOf(name) > -1;
          if(code) {
            const codes = typeof code === 'string' ? code.split(',') : code;
            return codes.includes(item.code)
          }
        })
        resolve(list)
      }, 1000)
    });
  }

  const handleFetchLoaded = (res) => {
    return res
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
        // onLoaded: handleFetchLoaded,
      },
      {
        title: '下拉多选搜索',
        name: 'field6',
        fieldType: FIELD_TYPE_MULTI_SEARCH,
        fetch: fetchData,
        // onLoaded: handleFetchLoaded,
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

  const fieldProps = {
    fieldType: FIELD_TYPE_MULTI_SELECT,
    id: 'ceshi1',
    mode: 'hover',
    size: 'default',
    value: ['1'],
    dataSource: DATASOURCE, 
    style: { width: 200 },
    placeholder: '请输入',
    rules: [
      { required: true, message: '字段不能为空' }
    ],
    tipType: 'tooltip',
    errorTipConfig: {},
    onFieldChange: (fieldConfig) => {
      console.log(fieldConfig)
    }
    
  }

  return (
    <>
      <div>
        <DynamicFormRender {...formProps}/>
        <div style={{ padding: '10px 0'}}>
          <Button onClick={handleChangeMode}>切换模式</Button>
          <Button style={{ marginLeft: '10px' }} onClick={handleSubmit}>提交</Button>
          <Button style={{ marginLeft: '10px' }} onClick={handleReset}>重置</Button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <DynamicFieldRender {...fieldProps}/>
      </div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </>
  )
}

export default TestDynamicFormRender;