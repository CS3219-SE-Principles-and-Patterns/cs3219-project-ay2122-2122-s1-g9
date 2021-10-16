import { Layout } from 'antd';
import styled from 'styled-components';

export const TwoColLayout = styled(Layout)`
  flex-grow: 1;
  width: 100%;

  > :last-child {
    flex-grow: 1;
  }
`;

interface SpacerProps {
  $height?: string;
  $width?: string;
}

export const Spacer = styled.div<SpacerProps>`
  width: ${(props) => props.$width ?? 0};
  height: ${(props) => props.$height ?? 0};
`;
