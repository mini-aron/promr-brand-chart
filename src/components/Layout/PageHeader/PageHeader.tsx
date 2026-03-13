import type { ReactNode } from 'react';
import { PageTitle } from '@/components/Common/Text';
import * as s from './PageHeader.css';

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className={s.pageHeader}>
      <PageTitle title={title} />
      {description != null && <p className={s.pageHeaderDesc}>{description}</p>}
    </header>
  );
}
