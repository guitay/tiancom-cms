import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber,Popconfirm, DatePicker,Divider, Modal, message } from 'antd';
import CMSStandardTable from '../../components/CMSStandardTable';
import EditModal from '../../components/CmsBackend/SysPara/EditModal';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Paramanage.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(
		state => ({syspara: state.syspara,})
		)
@Form.create()

export default class Paramanage extends PureComponent {
  state = {
    addInputValue: {},
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    fields: {
      csmc: {
        value: 'benjycui',
      },
      csz: {
    	  value: 'benjycui',
      },
      csms: {
        value: 'benjycui',
      } 
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'syspara/fetch',
      payload:{},//需要传递的信息
    }); //触发Action的dispatch函数
  }
  
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'syspara/fetch',
      payload: params,
    });
  }

 
  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'syspara/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'syspara/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAddInput = (e) => {
	// this.state.addInputValue = {e.target.name:e.target.value};
	// var obj = {e.target.value:e.target.value};
	// var obj = new Object();
	// obj[e.target.name]=e.target.value;
	// var copy = Object.assign(this.state.addInputValue,obj);
	// console.log(copy);
	
 //    this.setState({
 //      addInputValue: copy ,
 //    });
  }
  
  handleLoad = (key) => {
	console.log(this.state);
	console.log("load KEY = "+ key);  
	const newData = [...this.state.data];
	console.log("load newData = "+ newData);  
	
    const target = newData.filter(item => key === item.key)[0];
    console.log("handleLoad--->"+target);
    this.setState({modalVisible: true,formValues: target });

  }
  
  handleFormChange = (changedFields) => {
      this.setState({
        fields: { ...this.state.fields, ...changedFields },
      });
    }

  handleDelete= (key) => {
	  
	const newData = [...this.state.data];
    const target = newData.filter(item => key === item.csmc)[0];
    console.log("handleLoad--->"+target);
    this.setState({modalVisible: true,formValues: target });
    
  }
  
  
  handleAdd = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      console.log('editFormValues-->'+values);
      
      this.setState({
        formValues: values,
      });

    this.props.dispatch({
      type: 'syspara/add',
      payload: {
        description: this.state.formValues,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
    });
  }

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="参数名称">
              {getFieldDecorator('csmc_c')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="参数描述">
              {getFieldDecorator('csms_c')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
         
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
	const fields = this.state.fields;
	const columns = [
	      {
	        title: '代码名称',
	        dataIndex: 'dmmc',
	        sorter:true
	      },
	      {
	        title: '代码描述',
	        dataIndex: 'dmms',
	      },
	      {
	        title: '代码值',
	        dataIndex: 'dmz',
	        sorter: false
	      },
		  {
	        title: '操作',
	        render: (text,record) => (
	          <div>
	            <a onClick={() => this.handleLoad(record.dmmc)}>编辑</a>
	            <Divider type="vertical" />
	            <a onClick={() => this.handleDelete(record.dmmc)}>删除</a>
	            
	            <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.dmmc)}>
	              <a href="#">删除</a>
	            </Popconfirm>
	            
	          </div>
	        ),
	      },
	    ];

	const { syspara: { loading: sysparaLoading, data } } = this.props;    
    const { selectedRows, modalVisible, addInputValue } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    
   

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSearchForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>

            <CMSStandardTable
              selectedRows={selectedRows}
              loading={sysparaLoading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <EditModal/>
      </PageHeaderLayout>
    );
  }
}
