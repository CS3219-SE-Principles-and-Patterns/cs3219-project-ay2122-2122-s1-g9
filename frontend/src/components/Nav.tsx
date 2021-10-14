import { Image, Typography } from 'antd';
import React from 'react';
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

const Nav: React.FC = function () {
  const authContext = useAuth();

  const displayName = authContext?.user?.displayName;
  let initials = '';

  if (displayName != null) {
    initials = displayName
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2);
  }

  return (
    <StyledNav>
      <Image width={147} src={logo} preview={false} />
      <UserIcon key="3">
        <StyledText>{initials}</StyledText>
      </UserIcon>
    </StyledNav>
  );
};

export default Nav;
