import * as services from '@/services';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const myData = yield call(services.getMe);
      if (!myData) {
        return;
      }

      yield put({
        type: 'saveCurrentUser',
        payload: myData,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
};
export default UserModel;
