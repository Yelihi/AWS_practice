import { all, fork, takeLatest, put, delay, call } from "redux-saga/effects";
import axios from "axios";

import {
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
} from "../reducers/user";

function loadUserAPI(data) {
  return axios.get(`/user/${data}`);
}

function* loadUser(action) {
  // post 해줘야 하니 action.data 를 넘겨야 한다
  try {
    console.log("saga logIn");
    const result = yield call(loadUserAPI, action.data); // call 은 동기고 fork 는 비동기다. 그러니깐 call 을 해야지 위 axios 결과값을 기다린다.
    console.log(result);
    yield put({
      // put = dispatch
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data,
    });
  }
}

function loadMyInfoAPI() {
  return axios.get("/user");
}

function* loadMyInfo() {
  // post 해줘야 하니 action.data 를 넘겨야 한다
  try {
    console.log("saga logIn");
    const result = yield call(loadMyInfoAPI); // call 은 동기고 fork 는 비동기다. 그러니깐 call 을 해야지 위 axios 결과값을 기다린다.
    console.log(result);
    yield put({
      // put = dispatch
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

function logInAPI(data) {
  return axios.post("/user/login", data);
}

function* logIn(action) {
  // post 해줘야 하니 action.data 를 넘겨야 한다
  try {
    console.log("saga logIn");
    const result = yield call(logInAPI, action.data); // call 은 동기고 fork 는 비동기다. 그러니깐 call 을 해야지 위 axios 결과값을 기다린다.
    console.log(result);
    yield put({
      // put = dispatch
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post("/user/logout");
}

function* logOut() {
  try {
    console.log("saga logout");
    const result = yield call(logOutAPI); // call 은 동기고 fork 는 비동기다. 그러니깐 call 을 해야지 위 axios 결과값을 기다린다.
    console.log(result);
    yield put({
      // put = dispatch
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post("/user", data);
}

function* signUp(action) {
  try {
    console.log("saga signup");
    const result = yield call(signUpAPI, action.data); // call 은 동기고 fork 는 비동기다. 그러니깐 call 을 해야지 위 axios 결과값을 기다린다.
    console.log(result);
    yield put({
      // put = dispatch
      type: SIGN_UP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err.response.data);
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.patch(`user/${data}/follow`);
}

function* follow(action) {
  try {
    console.log("saga follow");
    const result = yield call(followAPI, action.data); // call 은 동기고 fork 는 비동기다. 그러니깐 call 을 해야지 위 axios 결과값을 기다린다.
    yield put({
      // put = dispatch
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unFollowAPI(data) {
  return axios.delete(`user/${data}/follow`);
}

function* unFollow(action) {
  try {
    console.log("saga unfollow");
    const result = yield call(unFollowAPI, action.data); // call 은 동기고 fork 는 비동기다. 그러니깐 call 을 해야지 위 axios 결과값을 기다린다.
    yield put({
      // put = dispatch
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function changeNicknameAPI(data) {
  return axios.patch("/user/nickname", { nickname: data });
}

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      // put = dispatch
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowingsAPI(data) {
  return axios.get("/user/followings", data);
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);
    yield put({
      // put = dispatch
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowersAPI(data) {
  return axios.get("/user/followers", data);
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);
    yield put({
      // put = dispatch
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data,
    });
  }
}

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      // put = dispatch
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser); // login action 실행될 때까지 기다리겠다.
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo); // login action 실행될 때까지 기다리겠다.
}

function* watchLogIn() {
  // 이벤트리스너 같은것
  yield takeLatest(LOG_IN_REQUEST, logIn); // login action 실행될 때까지 기다리겠다.
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnFollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unFollow);
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadMyInfo),
    fork(watchLoadUser),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnFollow),
    fork(watchChangeNickname),
    fork(watchLoadFollowings),
    fork(watchLoadFollowers),
    fork(watchRemoveFollower),
  ]);
}
