import { LogoutOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import React from 'react';
import { useSelector, useDispatch } from 'umi';
import { hooks } from '@/utils';
import HeaderDropdown from '../HeaderDropdown';
import ChangePwdModal from './ChangePwdModal';
import ProfileModal from './ProfileModal';
import styles from './index.less';

function AvatarDropdown() {
  const currentUser = useSelector((s) => s.user.currentUser);
  const dispatch = useDispatch();
  const changePwdModalState = hooks.useModal();
  const profileModalState = hooks.useModal();

  const onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
      return;
    }

    if (key === 'password') {
      changePwdModalState.show();
      return;
    }

    if (key === 'profile') {
      profileModalState.show();
    }
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  return currentUser?.id ? (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
      <ChangePwdModal
        visible={changePwdModalState.visible}
        onCancel={() => changePwdModalState.hide()}
      />
      <ProfileModal
        currentUser={currentUser}
        visible={profileModalState.visible}
        onCancel={() => profileModalState.hide()}
        onSuccess={() =>
          dispatch({
            type: 'user/fetchCurrent',
          })
        }
      />
    </>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
}

export default AvatarDropdown;
