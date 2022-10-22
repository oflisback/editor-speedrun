import { FormEvent, useEffect } from 'react';
import { createArticle } from '../../../services/conduit';
import { store } from '../../../state/store';
import { ArticleEditor } from '../../ArticleEditor/ArticleEditor';
import { initializeEditor, startSubmitting, updateErrors } from '../../ArticleEditor/ArticleEditor.slice';

export function NewArticle() {
  useEffect(() => {
    store.dispatch(initializeEditor());
  }, [null]);

  return <ArticleEditor onSubmit={onSubmit} />;
}

async function onSubmit(ev: FormEvent) {
  ev.preventDefault();
  store.dispatch(startSubmitting());
  // e-s-start
  // Nice, you found it and you are ready to start.
  // Go to the implementation of createArticle
  const result = await createArticle(store.getState().editor.article);

  result.match({
    err: (errors) => store.dispatch(updateErrors(errors)),
    ok: ({ slug }) => {
      location.hash = `#/article/${slug}`;
    },
  });
}
