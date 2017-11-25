import { stringify } from 'qs';
import request from '../utils/request';


export async function querySyspara(params) {
	var aaa = request('/syspara/query?'+stringify(params));
	return aaa; 
}

export async function removeSyspara(csmc) {
	console.log('delete csmc:'+csmc);
  return request('/syspara/remove/'+csmc, {
    method: 'POST',
    body: {
      ...csmc,
      method: 'delete',
    },
  });
}

export async function patchSyspara(id) {
  return request('/syspara/load/${id}', {
    method: 'patch',
    body: {
    	...id,
    	method:'load',
    },
  });
}

export async function addSyspara(params) {

	console.log('save params:'+params);
  return request('/syspara/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'add',
    },
  });
}

export async function updateSyspara(params) {

	console.log('update params:'+params);
  return request('/syspara/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'add',
    },
  });
}
