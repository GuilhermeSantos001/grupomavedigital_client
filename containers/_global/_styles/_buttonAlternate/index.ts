import Styled from '@emotion/styled';

import { Button } from 'antd';

export const ButtonAlternateStyled = Styled(Button)`
  background-color: white;
  border-color: white;
  color: rgb(10, 27, 43);
  width: 100%;

  &:hover,
  &:focus {
    background-color: rgb(255, 183, 0);
    border-color: rgb(255, 183, 0);
    color: rgb(10, 27, 43);
  }
`;

export default ButtonAlternateStyled;
