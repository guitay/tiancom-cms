import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber,Popconfirm, DatePicker,Divider, Modal, message } from 'antd';
import CMSStandardTable from '../../components/CMSStandardTable';
import EditModal from '../../components/CmsBackend/SysPara/EditModal';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './ParaManage.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(
		state => ({syspara: state.syspara,})
		)
@Form.create()

export default class ParaManage extends PureComponent {
  state = {
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
    
    console.log('handleSearch action.....');

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue
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
  
  
  handleFormReset = () => {
	    const { form, dispatch } = this.props;
	    form.resetFields();
//	    dispatch({
//	      type: 'syspara/fetch',
//	      payload: {},
//	    });
	  }

  createHandler = (values)=> {
	  const { dispatch, form } = this.props;
	    
    dispatch({
      type: 'syspara/add',
      payload: values,
    });

    dispatch({
      type: 'syspara/fetch',
      payload: values,
    });
  }

  editHandler = (values)=> {
    console.log('editHandler action.....values='+values);
    const { dispatch, form } = this.props;
    
    dispatch({
      type: 'syspara/add',
      payload: values,
    });

    dispatch({
      type: 'syspara/fetch',
      payload: values,
    });
    
    message.success('添加成功');
  }
  
  deleteHandler = (id) => {
    const { dispatch, form } = this.props;
    console.log('deleteHandler action.....');
    dispatch({
      type: 'syspara/remove',
      payload: id,
    });
  }

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="参数名称">
              {getFieldDecorator('csmc')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="参数描述">
              {getFieldDecorator('csms')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
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
	        title: '参数名称',
	        dataIndex: 'csmc',
	        sorter:true
	      },
	      {
		        title: '参数值',
		        dataIndex: 'csz',
		        sorter: false
		      },	
	      {
	        title: '参数描述',
	        dataIndex: 'csms',
	      },
		  {
	        title: '操作',
	        render:(text, record) => (
	                <span className={styles.operation}>
	                  <EditModal record={record} onOk={() => this.editHandler(record)}>
	                    <a>编辑</a>
	                  </EditModal>
	                  <Divider type="vertical" />
	                  <Popconfirm title="确认删除?" onConfirm={() => this.deleteHandler(record.csmc)}>
	                    <a href="#">删除</a>
	                  </Popconfirm>
	                </span>
	              ),
	      },
	    ];

	const { syspara: { loading: sysparaLoading, data } } = this.props;    
    const { selectedRows } = this.state;

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSearchForm()}
            </div>
            <div className={styles.tableListOperator}>
            <EditModal record={{}} onOk={() => this.createHandler()}>
              <Button icon="plus" type="primary">
                新建
              </Button>
            </EditModal>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Button>
	                    批量删除 
	                </Button>
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
      </PageHeaderLayout>
    );
  }
}
