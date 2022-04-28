import styled, { css, keyframes } from 'styled-components';
import { bounceIn } from 'react-animations';

import { AnimationDurationType } from '@/types/AnimationDurationType';

const BounceAnimation = keyframes`${bounceIn}`;

const BounceAnimationDiv = styled('div') <{ duration: AnimationDurationType }>`
  ${props => props.duration && css`
    animation: ${props.duration} ${BounceAnimation};
  `}
`;

export type Props = {
  duration: AnimationDurationType;
  children: React.ReactNode;
}

export function BounceInDiv(props: Props) {
  return (
    <BounceAnimationDiv duration={props.duration}>
      {props.children}
    </BounceAnimationDiv>
  )
}