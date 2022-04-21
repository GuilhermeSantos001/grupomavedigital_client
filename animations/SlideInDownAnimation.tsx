import styled, { css, keyframes } from 'styled-components';
import { slideInDown } from 'react-animations';

import { AnimationDurationType } from '@/types/AnimationDurationType';

const SlideAnimation = keyframes`${slideInDown}`;

const SlideAnimationDiv = styled('div') <{ duration: AnimationDurationType }>`
  ${props => props.duration && css`
    animation: ${props.duration} ${SlideAnimation};
  `}
`;

export type Props = {
  duration: AnimationDurationType;
  children: React.ReactNode;
}

export function SlideInDownDiv(props: Props) {
  return (
    <SlideAnimationDiv duration={props.duration}>
      {props.children}
    </SlideAnimationDiv>
  )
}