import React, { Component } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
import ajax from '@alipay/ajax';

class AddWord extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {visible: false};
  }

  handleSubmit() {
    console.log(this.props.form.getFieldsValue());
    var form = this.props.form.getFieldsValue();
    if (!form.word || !form.meaning) {
      message.error('请填写必填项！');
      return;
    }
    if (form.word.length > 30
      || form.meaning.length > 200
      || (form.abbr && form.abbr.length > 30)
    ) {
      message.error('长度超过限制！');
      return;
    }
    var self = this;
    ajax({
      url: 'http://localhost:3000/vocabulary', // 此处填入服务器Ajax网址
      type: 'json',
      data: {
        word: form.word,
        definition: form.meaning,
        abbreviation: form.abbr
      },
      method: 'post',
      error: function (err) {
        message.error('添加失败！', err);
      },
      success: function (resp) {
        message.success('添加成功！');
        self.props.refresh();
        self.hideModal();
      }
    })
  }

  showModal() {
    this.setState({visible: true});
  }

  hideModal() {
    this.setState({visible: false});
  }

  render() {
    const { getFieldProps } = this.props.form;

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 10},
    };
    return (
      <div>
        <Button type="primary" onClick={this.showModal.bind(this)}>添加词汇</Button>
        <Modal title="新增词汇" visible={this.state.visible} onOk={this.handleSubmit.bind(this)}
               onCancel={this.hideModal.bind(this)}>
          <Form horizontal form={this.props.form}>
            <FormItem
              {...formItemLayout}
              label="词汇：">
              <Input {...getFieldProps('word', {})} type="text" placeholder="请输入内容" autoComplete="off"/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="简拼：">
              <Input {...getFieldProps('abbr', {})} type="text" placeholder="请输入内容" autoComplete="off"/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="释义：">
              <Input {...getFieldProps('meaning', {})} type="textarea" placeholder="请输入内容" autoComplete="off"/>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
;

AddWord = createForm()(AddWord);

export default AddWord;
