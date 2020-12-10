import { h } from 'preact';
import { PreactProps } from './interfaces';

export interface TopicButtonProps extends PreactProps {
  active?: boolean;
}

export const TopicButton = (props: TopicButtonProps) => {
  const { children, active } = props;
  const activeClass = active ? "szn-topic--active": "";
  return (
    <button class={`szn-topic ${activeClass}`}>
      <span>
        {children}
      </span>
    </button>
  )
};
