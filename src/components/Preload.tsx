import { Fragment, h } from 'preact';

interface PreloadProp {
  path: string;
  type: string;
};

export const Preload = (files: PreloadProp[]) => {
  const linkRels = files.map(({ path, type}) => <link rel="preload" href={path} as={type} />)
  return (
    <Fragment>
      {linkRels}
    </Fragment>
  );
};
