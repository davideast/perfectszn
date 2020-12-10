import { h } from 'preact';
import { PreactProps } from './interfaces';

export interface TopicButtonProps extends PreactProps {
  id: string;
  active?: boolean;
}

export const TopicButton = (props: TopicButtonProps) => {
  const { children, active, id } = props;
  const activeClass = active ? "szn-topic--active": "";
  return (
    <button id={id} class={`szn-topic ${activeClass}`}>
      <span>
        {children}
      </span>
    </button>
  )
};
