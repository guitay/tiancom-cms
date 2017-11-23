import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { csmc, csz, csms } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="编辑-系统参数"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
	          <FormItem label="参数名称" 
	  	      	labelCol={{ span: 5 }}
	  	      	wrapperCol={{ span: 15 }}>
	  	        {getFieldDecorator('csmc', {
                  initialValue: csmc,
                })(
	  	          <Input placeholder="请输入参数名称" />
	  	        )}
	  	      </FormItem>
	  	
	  	      <FormItem label="参数值" 
	  	      	labelCol={{ span: 5 }}
	  	      	wrapperCol={{ span: 15 }}>
	  	        {getFieldDecorator('csz', {
                  initialValue: csz,
                })(
	  	          <Input placeholder="请输入参数值" />
	  	        )}
	  	      </FormItem>
	  	
	  	      <FormItem label="参数描述" 
	  	      	labelCol={{ span: 5 }}
	  	      	wrapperCol={{ span: 15 }}>
	  	        {getFieldDecorator('csms', {
                  initialValue: csms,
                })(
	  	          <Input placeholder="请输入参数描述" />
	  	        )}
	  	      </FormItem>
          </Form>
        </Modal>
        <pre className="language-bash">
	        {JSON.stringify(fields, null, 2)}
	      </pre>
	       
      </span>
    );
  }
}

export default Form.create()(EditModal);
