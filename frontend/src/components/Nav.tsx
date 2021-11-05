import { ExclamationCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Image, Menu, Modal, Typography } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../hooks/auth';
import logo from '../resources/logo.svg';

const { Text } = Typography;

const StyledNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #d9d9d9;
  background: ${(props) => props.theme.colors.white};
`;

const UserIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  width: 38px;
  border-radius: 8px;
  background: #1890ff;
  text-transform: uppercase;
`;

const StyledText = styled(Text)`
  color: ${(props) => props.theme.colors.white};
  font-weight: 500;
`;

interface Props {
  handleLogoClick?: () => void;
}

const { confirm } = Modal;

const Nav: React.FC<Props> = function (props) {
  const { handleLogoClick } = props;
  const authContext = useAuth();
  const history = useHistory();

  const displayName = authContext?.user?.displayName;
  let initials = '';

  if (displayName != null) {
    initials = displayName
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2);
  }

  // const signOut = () => {
  //   authContext
  //     ?.signOutOfApp()
  //     .then(() => {
  //       history.replace('/signin');
  //       console.log('signed out');
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const showConfirm = () => {
    confirm({
      title: 'Not so fast...',
      icon: <ExclamationCircleOutlined />,
      content: <p>Are you sure you want to sign out?</p>,
      onOk() {
        return authContext
          ?.signOutOfApp()
          .then(() => {
            history.replace('/signin');
            console.log('signed out');
          })
          .catch((error) => {
            console.error(error);
          });
      },
    });
  };

  const signoutMenu = (
    <Menu onClick={showConfirm}>
      <Menu.Item key="signout" icon={<LogoutOutlined />}>
        Sign out
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledNav>
      <Image width={147} src={logo} preview={false} onClick={handleLogoClick} />
      <Dropdown overlay={signoutMenu} trigger={['click']}>
        <UserIcon key="3">
          <StyledText>{initials}</StyledText>
        </UserIcon>
      </Dropdown>
    </StyledNav>
  );
};

export default Nav;
