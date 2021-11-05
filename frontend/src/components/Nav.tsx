import { Button, Image, Typography } from 'antd';
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
  const signOut = () => {
    authContext
      ?.signOutOfApp()
      .then(() => {
        history.replace('/signin');
        console.log('signed out');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <StyledNav>
      <Image width={147} src={logo} preview={false} onClick={handleLogoClick} />
      <Button type="dashed" onClick={signOut}>
        Sign out
      </Button>
      <UserIcon key="3">
        <StyledText>{initials}</StyledText>
      </UserIcon>
    </StyledNav>
  );
};

export default Nav;
