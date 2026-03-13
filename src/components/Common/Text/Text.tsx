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

export { Title, Subtitle, PageTitle };