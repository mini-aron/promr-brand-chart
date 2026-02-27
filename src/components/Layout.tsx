/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import { theme } from '@/theme';
import { Flex } from '@/components/Common/Flex';
import { Sidebar } from '@/components/Sidebar';

const layoutWrap = css({
  height: '100vh',
  maxHeight: '100dvh',
  overflow: 'hidden',
  backgroundColor: theme.colors.background,
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
    <Flex direction="row" gap={0} alignItems="stretch" css={layoutWrap}>
      <Sidebar />
      <main css={mainStyles}>
        <Outlet />
      </main>
    </Flex>
  );
}
