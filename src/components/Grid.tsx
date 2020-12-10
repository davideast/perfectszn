import { h, Fragment } from 'preact';
import { TopicButton } from './TopicButton';
import { PreactProps, SznCategory } from './interfaces';

interface SznGridProps extends PreactProps {
  categories: SznCategory[];
}

export const SznGrid = ({ categories }: SznGridProps) => {
  const categoryColumns = categories.map(category => {
    return (
      <SznGridCol category={category} />
    );
  });
  return (
    <article class="szn-grid">
      {categoryColumns}
    </article>
  );
};

interface SznTopicButtonListProps extends PreactProps {
  category: SznCategory;
}

const SznTopicButtonList = (props: SznTopicButtonListProps) => {
  const { category } = props;
  const buttonList = category.topics.map(topic => {
    return (
      <TopicButton id={topic.id} categoryId={category.id}>
        {topic.text}
      </TopicButton>
    );
  });
  return (
    <Fragment>
      {buttonList}
    </Fragment>
  );
}

interface SznGridColProps extends PreactProps {
  category: SznCategory;
}

const SznGridCol = (props: SznGridColProps) => {
  const { id, title } = props.category;
  return (
    <section class="szn-grid__col">

      <SznGridColHeading id={id}>{title}</SznGridColHeading>

      <div class="szn-topic-col">
        <SznTopicButtonList category={props.category} />
      </div>

    </section>
  )
};

interface SznGridColHeadingProps extends PreactProps {
  id: string;
}

const SznGridColHeading = ({ children, id }: SznGridColHeadingProps) => {
  return (
    <div id={id} class="szn-heading">{children}</div>
  )
};
