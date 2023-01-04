import React, { useCallback, useEffect, useState } from "react";
import Router from "next/router";
import AppLayout from "../components/AppLayout";
import axios from "axios";
import { END } from "redux-saga";

import { Form, Input, Checkbox, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import useInput from "../hooks/useInput";
import { signUpRequestAction } from "../reducers/user";

import wrapper from "../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

const signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

  useEffect(() => {
    if (me && me.id) {
      Router.replace("/"); // 뒤로가기 했을 때 그 페이지가 나오지 않게 하기 위함
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace("/");
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );
  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);
    dispatch(signUpRequestAction({ email, nickname, password }));
  }, [password, passwordCheck, passwordError, term]);

  return (
    <AppLayout>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input name="user-email" value={email} type="email" onChange={onChangeEmail} required />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input name="nickname" value={nickname} onChange={onChangeNickname} required />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <Input name="password" type="password" value={password} onChange={onChangePassword} required />
        </div>
        <div>
          <label htmlFor="password-check">비밀번호체크</label>
          <br />
          <Input name="passwordCheck" type="password" value={passwordCheck} onChange={onChangePasswordCheck} required />
          {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            위 약관에 동의합니다.
          </Checkbox>
          {termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>
            가입하기
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log("getServerSideProps Start");
  console.log(context);
  const cookie = context.req ? context.req.headers.cookie : "";
  axios.defaults.headers.Cookie = "";
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  // success 까지 기다리기 위해서 하는 조치
  context.store.dispatch(END);
  //store.sagaTask 는 기존에 configStore.js 에서 처리함
  await context.store.sagaTask.toPromise();
});

export default signup;

const ErrorMessage = styled.div`
  color: red;
`;
