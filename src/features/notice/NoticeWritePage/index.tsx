'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { page } from '@/style/PageStyles.css';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Column } from '@/shared/components/ui/Flex';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import type { NoticeDetail, NoticeScope } from '@/types';
import * as s from '../EditNoticePage/index.css';
import * as detail from '../NoticeDetailPage/index.css';
import * as mdEditor from './noticeMdEditor.css';

const MDEditorLazy = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => <div className={mdEditor.loading}>에디터를 불러오는 중…</div>,
});

function stripFullscreenCommand(cmd: { name?: string; keyCommand?: string }) {
  if (cmd.name === 'fullscreen' || cmd.keyCommand === 'fullscreen') return false;
  return cmd;
}

export type NoticeWritePageProps = {
  listPath: string;
  /** 신규 작성 시에만 전달. 수정은 URL `id`로 기존 공지를 불러옴 */
  noticeScope?: NoticeScope;
};

export function NoticeWritePage({ listPath, noticeScope }: NoticeWritePageProps) {
  const router = useRouter();
  const params = useParams();
  const { currentPharmaId, userRole } = useApp();
  const pharmas = useDemoPlayStore((st) => st.pharmas);
  const noticeDetails = useDemoPlayStore((st) => st.noticeDetails);
  const addNoticeEntry = useDemoPlayStore((st) => st.addNoticeEntry);
  const updateNoticeEntry = useDemoPlayStore((st) => st.updateNoticeEntry);

  const isCreate = noticeScope !== undefined;
  const id = params?.id as string | undefined;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notice, setNotice] = useState<NoticeDetail | null>(null);

  useEffect(() => {
    if (isCreate || !id) return;
    const found = noticeDetails.find((n) => n.id === id);
    if (found) {
      setNotice(found);
      setTitle(found.title);
      setContent(found.content);
    } else {
      setNotice(null);
    }
  }, [isCreate, id, noticeDetails]);

  const canEditThis = useMemo(() => {
    if (isCreate || !notice) return false;
    if (userRole === 'corporation') return false;
    if (notice.noticeScope === 'system') return userRole === 'admin';
    if (notice.noticeScope === 'pharma') {
      return userRole === 'pharma' && notice.pharmaId === currentPharmaId;
    }
    return false;
  }, [isCreate, notice, userRole, currentPharmaId]);

  const editState = useMemo(() => {
    if (isCreate) return null;
    if (!id) {
      return {
        blocked: true as const,
        description: '잘못된 경로입니다.',
        actionHref: listPath,
        actionLabel: '목록으로',
      };
    }
    if (!notice) {
      return {
        blocked: true as const,
        description: '공지를 찾을 수 없습니다.',
        actionHref: listPath,
        actionLabel: '목록으로',
      };
    }
    if (!canEditThis) {
      return {
        blocked: true as const,
        description: '수정 권한이 없습니다.',
        actionHref: `${listPath}/${id}`,
        actionLabel: '상세로',
      };
    }
    return { blocked: false as const, notice };
  }, [isCreate, id, notice, canEditThis, listPath]);

  const handleSave = useCallback(() => {
    const t = title.trim();
    if (!t) return;
    if (isCreate) {
      const author =
        noticeScope === 'system'
          ? '관리자'
          : (pharmas.find((p) => p.id === currentPharmaId)?.name ?? '제약사');
      const newId = addNoticeEntry({
        title: t,
        content: content.trim(),
        author,
        noticeScope: noticeScope!,
        ...(noticeScope === 'pharma' ? { pharmaId: currentPharmaId } : {}),
      });
      router.push(`${listPath}/${newId}`);
      return;
    }
    if (!id || !notice) return;
    updateNoticeEntry(id, { title: t, content: content.trim() });
    router.push(`${listPath}/${id}`);
  }, [
    isCreate,
    title,
    content,
    noticeScope,
    pharmas,
    currentPharmaId,
    addNoticeEntry,
    id,
    notice,
    updateNoticeEntry,
    router,
    listPath,
  ]);

  const handleBack = useCallback(() => {
    if (!isCreate && id) {
      router.push(`${listPath}/${id}`);
      return;
    }
    router.push(listPath);
  }, [isCreate, listPath, router, id]);

  if (!isCreate) {
    if (!editState) return null;
    if (editState.blocked) {
      return (
        <div className={clsx(page, mdEditor.noticeWriteRoot)}>
          <PageHeader title="공지사항" description={editState.description} />
          <Button variant="ghost" onClick={() => router.push(editState.actionHref)}>
            {editState.actionLabel}
          </Button>
        </div>
      );
    }
  }

  if (!isCreate && !notice) return null;

  const scopeForBadge = isCreate ? noticeScope! : notice!.noticeScope;
  const scopeLabel = scopeForBadge === 'system' ? '시스템 공지' : '제약사 공지';

  const canSubmit = title.trim().length > 0;

  return (
    <div className={clsx(page, mdEditor.noticeWriteRoot)}>
      <PageHeader title="공지사항 작성" />
      <Column className={mdEditor.noticeWriteCard}>
        <div className={mdEditor.noticeWriteHeader}>
          <button
            type="button"
            className={mdEditor.noticeWriteBack}
            onClick={handleBack}
            aria-label={isCreate ? '목록으로 돌아가기' : '상세로 돌아가기'}
          >
            <ArrowLeft size={18} strokeWidth={2} aria-hidden />
            {isCreate ? '목록으로' : '상세로'}
          </button>
          <div className={mdEditor.noticeWriteMetaRow}>
            <span
              className={clsx(
                detail.detailBadge,
                scopeForBadge === 'system' ? detail.detailBadgeSystem : detail.detailBadgePharma,
              )}
            >
              {scopeLabel}
            </span>
          </div>
          <Input
            size="large"
            className={mdEditor.noticeWriteTitleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="제목"
          />
        </div>

        <div className={mdEditor.noticeWriteContentSection}>
          <div className={mdEditor.wrap} data-color-mode="light">
            <div className={mdEditor.editorShell}>
              <MDEditorLazy
                value={content}
                onChange={(v) => setContent(v ?? '')}
                preview="live"
                visibleDragbar={false}
                height={420}
                commandsFilter={stripFullscreenCommand}
                textareaProps={{ 'aria-label': '본문 마크다운' }}
              />
            </div>
          </div>
          <div className={s.actionRow}>
            <Button variant="ghost" type="button" onClick={handleBack}>
              취소
            </Button>
            <Button variant="primary" type="button" onClick={handleSave} disabled={!canSubmit}>
              {isCreate ? '등록' : '저장'}
            </Button>
          </div>
        </div>
      </Column>
    </div>
  );
}
