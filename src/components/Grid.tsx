import { h, FunctionalComponent, Fragment } from 'preact';
import { TopicButton } from './TopicButton';
import { PreactProps, SznCategory } from './interfaces';

interface SznGridProps extends PreactProps {
  categories: SznCategory[];
}

export const SznGrid = ({ categories }: SznGridProps) => {
  const categoryColumns = categories.map(category => {
    return (
      <SznGridCol heading={category.title} topics={category.topics} />
    );
  });
  return (
    <article class="szn-grid">
      {categoryColumns}
    </article>
  );
};

interface SznTopicButtonListProps extends PreactProps {
  topics: any[];
}

const SznTopicButtonList = (props: SznTopicButtonListProps) => {
  const { topics } = props;
  const buttonList = topics.map(topic => {
    return (
      <TopicButton>
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
  heading: string;
  topics: any[];
}

const SznGridCol = (props: SznGridColProps) => {
  const { heading, topics } = props;
  return (
    <section class="szn-grid__col">

      <SznGridColHeading>{heading}</SznGridColHeading>

      <div class="szn-topic-col">
        <SznTopicButtonList topics={topics} />
      </div>

    </section>
  )
};

const SznGridColHeading: FunctionalComponent = ({ children }) => {
  return (
    <div class="szn-heading">$5</div>
  )
};


