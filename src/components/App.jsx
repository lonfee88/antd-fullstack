import React, { Component, PropTypes } from 'react';
import MainLayout from '../layouts/MainLayout/MainLayout';
import { Row, Col } from 'antd';
import { Form, Select, Input, Button } from 'antd';
import {Table} from 'antd';
import AddWord from '../components/AddWord';
import ajax from '@alipay/ajax';
import { message, Popconfirm } from 'antd';
import SearchInput from '../components/SearchInput';

class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      data: null
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
    var search = this.props.form.getFieldsValue();
    let originData;
    if (!this.state.originData) {
      originData = this.state.data;
    } else {
      originData = this.state.originData;
    }
    if (key === undefined) {
      this.setState({
        data: originData,
        originData: originData
      });
      return;
    }
    var result = originData;
    result = originData.filter(function (record) {
      let field;
      if (search.field === '简拼') {
        field = 'abbreviation';
      } else if (search.field === '释义') {
        field = 'definition';
      } else {
        field = 'word';
      }
      return record[field].indexOf(key) >= 0;
    });
    console.log(result);
    this.setState({
      data: result,
      originData: originData
    });
  }

  handleDelete(word) {
    console.log('Word: ', word);

    let self = this;

    function refresh() {
      let self = this;
      ajax({
        url: 'http://localhost:3000/vocabulary',
        method: 'get',
        success: function (resp) {
          self.setState({
            data: resp,
            originData: resp
          });
        }
      });
    }

    ajax({
      url: 'http://localhost:3000/vocabulary/' + word, // 此处填入服务器Ajax网址
      type: 'json',
      method: 'delete',
      error: function (err) {
        message.error('删除失败！', err);
      },
      success: function (resp) {
        message.success('删除成功！');
        refresh.call(self)
      }
    })
  }

  cancel() {
    message.error('点击了取消');
  }

  refresh() {
    let self = this;
    ajax({
      url: 'http://localhost:3000/vocabulary',
      method: 'get',
      success: function (resp) {
        console.log('refresh:'+resp);
        self.setState({
          data: resp,
          originData: resp
        });
      }
    })
  }

  componentDidMount() {
    this.refresh();
  }

  handleSearch(key) {
    console.log('收到表单值：', key);
    let originData;
    if (!this.state.originData) {
      originData = this.state.data;
    } else {
      originData = this.state.originData;
    }
    if (key === undefined) {
      this.setState({
        data: originData,
        originData: originData
      });
      return;
    }
    var result = this.state.originData;
    result = result.filter(function (record) {
      let field;

      if(record['abbreviation'].indexOf(key) >= 0)
        return true;
      if(record['definition'].indexOf(key) >= 0)
        return true;
      if(record['word'].indexOf(key) >= 0)
        return true;
      return false;
    });
    console.log(result);
    this.setState({
      data: result,
      originData: originData
    });
  }

  render() {
    const { getFieldProps } = this.props.form;

    let self = this;

    const columns = [{
      title: '词汇',
      dataIndex: 'word',
    }, {
      title: '简拼',
      dataIndex: 'abbreviation',
    }, {
      title: '释义',
      dataIndex: 'definition',
    }, {
      title: '操作',
      key: 'operation',
      render(text, record) {
        return <span>
                <Popconfirm title="操作确认" onConfirm={self.handleDelete.bind(self, record.id)} onCancel={self.cancel}>
                  <a href="#">删除</a>
                </Popconfirm>
        </span>
      }
    }];

    const data = [{
      id: 1,
      word: 'equity',
      abbreviation: 'equity',
      definition: '股权众筹'
    }, {
      id: 2,
      word: 'message',
      abbreviation: 'msg',
      definition: '消息'
    }, {
      id: 3,
      word: 'application',
      abbreviation: 'app',
      definition: '应用'
    }, {
      id: 4,
      word: 'infomation',
      abbreviation: 'info',
      definition: '信息'
    }];

    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
      },
      onSelectAll(selected, selectedRows, changeRows) {
        console.log(selected, selectedRows, changeRows);
      }
    };

    const pagination = {
      total: data.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      },
      onChange(current) {
        console.log('Current: ', current);
      },
    };

    let wordTable;
    if (this.state.data === null) {
      wordTable = '';
    } else {
      wordTable = <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={this.state.data}
        rowSelection={rowSelection}
        bordered
        pagination={pagination}
        />;
    }

    return (
      <MainLayout>
        <div>
          <Row type="flex" justify="center">
            <Col span="8">
              <SearchInput placeholder="请输入搜索内容" style={{ width: 200 }} handleSearch={this.handleSearch.bind(self)}/>
            </Col>
            <Col span="8" style={{textAlign: 'right'}}>
              <AddWord refresh={this.refresh.bind(self)}/>
            </Col>
          </Row>
          <Row type="flex" justify="center" style={{marginTop: 30}}>
            <Col span="16">
              {wordTable}
            </Col>
          </Row>
        </div>
      </MainLayout>
    )
  }
}

App = Form.create()(App);

export default App;
