'use client';

import '@uiw/react-markdown-preview/markdown.css';

import MDEditor from '@uiw/react-md-editor';
import * as styles from './MarkdownPreview.css';

export type MarkdownPreviewProps = {
  source: string;
};

export function MarkdownPreview({ source }: MarkdownPreviewProps) {
  return (
    <div className={styles.root} data-color-mode="light">
      <MDEditor.Markdown source={source} />
    </div>
  );
}
