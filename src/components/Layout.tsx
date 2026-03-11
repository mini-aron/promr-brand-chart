'use client';
import { Flex } from '@/components/Common/Flex';
import { Sidebar } from '@/components/Sidebar';
import * as s from './Layout.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="row" gap={0} alignItems="stretch" className={s.layoutWrap}>
      <Sidebar />
      <main className={s.main}>{children}</main>
    </Flex>
  );
}
