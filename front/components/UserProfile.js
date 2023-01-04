import { Avatar, Button, Card } from "antd";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user";

const UserProfile = () => {
  const { me } = useSelector((state) => state.user);
  const { logOutLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction);
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {me.Posts?.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {me.Followings?.length}
        </div>,
        <div key="follower">
          팔로워
          <br />
          {me.Followers?.length}
        </div>,
      ]}
    >
      <Card.Meta avatar={<Avatar>{me.nickname}</Avatar>} title={me.nickname} />
      <Button onClick={onLogout} loading={logOutLoading}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
