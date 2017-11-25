import { querySyspara, removeSyspara,patchSyspara, addSyspara, updateSyspara } from '../services/sysapi';

export default {
  namespace: 'syspara',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(querySyspara, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
        	list:response,
            pagination: {
	            total: response.length,
	            pageSize:10,
	            current: 1,
	        },
        }
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addSyspara, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(updateSyspara, payload);
        yield put({
          type: 'update',
          payload: response,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });

        if (callback) callback();
      },

    *patch({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(patchSyspara, payload);
      yield put({
        type: 'reload',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removeSyspara, payload);
      yield put({
        type: 'reload',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
