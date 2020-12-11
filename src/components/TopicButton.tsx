import { h } from "preact";
import { PreactProps } from "./interfaces";

export interface TopicButtonProps extends PreactProps {
  id: string;
  active?: boolean;
  categoryId: string;
  categoryValue: number;
}

export const TopicButton = (props: TopicButtonProps) => {
  const { children, active, id, categoryId, categoryValue } = props;
  const activeClass = active ? "szn-topic--active" : "";
  return (
    <button
      id={id}
      class={`szn-topic ${activeClass}`}
      data-category={categoryId}
      data-cost={categoryValue}
    >
      {children}
    </button>
  );
};
