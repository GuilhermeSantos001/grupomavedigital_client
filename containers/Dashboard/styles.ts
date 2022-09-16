import { Card } from 'antd';
import Styled from '@emotion/styled';

export const CardStyled = Styled(Card)`
  border-left: 3px solid #ffb700;
  border-radius: 5%;

  .ant-card-head {
    background-color: #ffb700;
  }

  .ant-card-body {
    background-color: #171717;
    color: #ffb700;
    font-weight: bold;
  }
`;
