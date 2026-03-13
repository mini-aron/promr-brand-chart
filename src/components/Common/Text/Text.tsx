import type { ReactNode } from 'react';
import * as s from './Text.css';

function PageTitle({ title }: { title: string }) {
  return <h1 className={s.pageTitle}>{title}</h1>;
}

function Title({ title }: { title: string }) {
  return <h1 className={s.title}>{title}</h1>;
}

function Subtitle({ subtitle }: { subtitle: string }) {
  return <h2 className={s.subtitle}>{subtitle}</h2>;
}

function PageDesc({ children }: { children: ReactNode }) {
  return <p className={s.pageDesc}>{children}</p>;
}

export { Title, Subtitle, PageTitle, PageDesc };