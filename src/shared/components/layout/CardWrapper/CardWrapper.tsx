import { clsx } from 'clsx';
import * as s from './CardWrapper.css';

type CardWrapperProps = {
  children: React.ReactNode;
  title?: string;
  /** `title`과 함께 쓰면 헤더 우측(예: 전체 보기 링크) */
  headerRight?: React.ReactNode;
  /** `title`에 대응하는 `id`(섹션 `aria-labelledby`용) */
  titleId?: string;
  footer?: React.ReactNode;
  padding?: s.CardWrapperPadding;
  fill?: boolean;
  /** 하단 바깥 여백 제거 — 대시보드 그리드 등 */
  flush?: boolean;
  className?: string;
};

export default function CardWrapper({
  children,
  title,
  headerRight,
  titleId,
  footer,
  padding = 16,
  fill = false,
  flush = false,
  className,
}: CardWrapperProps) {
  return (
    <div
      className={clsx(
        s.cardWrapper,
        fill && s.cardWrapperFill,
        flush && s.cardWrapperFlush,
        className,
      )}
    >
      {title ? (
        <div className={s.header}>
          <h2 className={s.title} id={titleId}>
            {title}
          </h2>
          {headerRight ? <div className={s.headerRight}>{headerRight}</div> : null}
        </div>
      ) : null}
      <div className={clsx(s.content[padding], fill && s.contentFill)}>{children}</div>
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  );
}
