import { style, globalStyle } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
});
globalStyle(`${page} .page-header`, { flexShrink: 0, marginBottom: 8 });
globalStyle(`${page} .page-header h1`, { margin: 0, fontSize: '1.25rem', fontWeight: 600 });
globalStyle(`${page} .page-header p`, { margin: 0, fontSize: 13, color: 'var(--color-text-muted)' });

export const layoutWrap = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: 16,
  alignItems: 'stretch',
});

export const leftCard = style({
  flex: 1,
  minWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
});

export const listWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 8,
  fontSize: 14,
});
globalStyle(`${listWrap} table`, { minWidth: 560 });
globalStyle(`${listWrap} th, ${listWrap} td`, { padding: 8, borderRight: 'none' });
globalStyle(`${listWrap} th`, { fontSize: 13 });

export const rightPanel = style({
  width: 320,
  flexShrink: 0,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 16,
  boxShadow: 'var(--shadow-sm)',
  alignSelf: 'flex-start',
});

export const sectionTitle = style({ fontSize: 16, marginBottom: 8 });
export const sectionDesc = style({ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 });
export const addButtonFull = style({ width: '100%' });

export const inviteCodeBox = style({
  padding: 12,
  backgroundColor: 'var(--color-background)',
  borderRadius: 'var(--radius-md)',
  marginBottom: 12,
});
export const inviteCodeLabel = style({ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 });
export const inviteCode = style({ fontSize: 16, fontWeight: 600, letterSpacing: 1 });

export const inviteActions = style({ display: 'flex', flexDirection: 'column', gap: 8 });
export const actionButton = style({ display: 'flex', alignItems: 'center', gap: 6 });
export const mailRow = style({ display: 'flex', gap: 8, alignItems: 'center' });
export const emailInput = style({
  flex: 1,
  minWidth: 0,
  padding: '8px 10px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
});
globalStyle(`${emailInput}:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});
export const mailButton = style({ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 });
export const resetLink = style({ marginTop: 12, width: '100%' });

const statusBase = style({
  display: 'inline-block',
  padding: '4px 8px',
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 'var(--radius-sm)',
});
export const statusPending = style([
  statusBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
    color: 'var(--color-primary)',
  },
]);
export const statusAccepted = style([
  statusBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-success) 10%, transparent)',
    color: 'var(--color-success)',
  },
]);
