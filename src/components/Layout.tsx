/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import { theme } from '@/theme';
import { Sidebar } from '@/components/Sidebar';

const layoutStyles = css({
  height: '100vh',
  maxHeight: '100dvh',
  overflow: 'hidden',
  backgroundColor: theme.colors.background,
  display: 'flex',
  paddingLeft: theme.spacing(3),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  boxSizing: 'border-box',
});

const mainStyles = css({
  flex: 1,
  minWidth: 320,
  minHeight: 0,
  maxWidth: 2400,
  padding: theme.spacing(4),
  overflow: 'auto',
  boxSizing: 'border-box',
});

export function Layout() {
  return (
    <div css={layoutStyles}>
      <Sidebar />
      <main css={mainStyles}>
        <Outlet />
      </main>
    </div>
  );
}
