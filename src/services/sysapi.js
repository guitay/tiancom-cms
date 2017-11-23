import { stringify } from 'qs';
import request from '../utils/request';


export async function querySyspara(params) {
  return request(`/api/syspara?${stringify(params)}`);
}

export async function removeSyspara(params) {
  return request('/api/syspara', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addSyspara(params) {
  return request('/api/syspara', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

