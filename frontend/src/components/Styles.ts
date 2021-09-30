import { Layout } from 'antd';
import styled from 'styled-components';

export const PageLayout = styled(Layout)`
  min-height: 100vh;
`;

interface SpacerProps {
  height?: string;
  width?: string;
}

export const Spacer = styled.div<SpacerProps>`
  width: ${(props) => (props.width ? props.width : 0)};
  height: ${(props) => (props.height ? props.height : 0)};
`;
