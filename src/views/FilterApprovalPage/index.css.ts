import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const deadlineInline = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});
export const deadlineLabel = style({ fontSize: 14, fontWeight: 500 });
export const deadlineSelectWrap = style({ minWidth: 80 });

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

export const filterRowStyles = style({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: 8,
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 8,
  backgroundColor: 'var(--color-background)',
  borderBottom: '1px solid var(--color-border)',
});
export const filterArea = style({ flex: 1, display: 'flex', gap: 8, alignItems: 'center' });
globalStyle(`${filterRowStyles} > *`, { flexShrink: 0 });

export const listWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 8,
  fontSize: 14,
});
globalStyle(`${listWrap} table`, { minWidth: 680 });
globalStyle(`${listWrap} th, ${listWrap} td`, { padding: 8, borderRight: 'none' });
globalStyle(`${listWrap} th`, { fontSize: 13 });

export const rightPanel = style({
  width: 360,
  flexShrink: 0,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 16,
  boxShadow: 'var(--shadow-sm)',
  alignSelf: 'flex-start',
});

export const formField = style({ marginBottom: 12 });
globalStyle(`${formField} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 13,
  fontWeight: 600,
});
globalStyle(`${formField} input, ${formField} select`, {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 10px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
});
globalStyle(`${formField} input:focus, ${formField} select:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});

export const statusCellBase = style({
  display: 'block',
  margin: -8,
  padding: 8,
  minHeight: '100%',
  boxSizing: 'content-box',
  fontSize: 12,
  fontWeight: 600,
});
export const statusCellPending = style([
  statusCellBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
    color: 'var(--color-primary)',
  },
]);
export const statusCellApproved = style([
  statusCellBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-success) 6%, transparent)',
    color: 'var(--color-success)',
  },
]);
export const statusCellRejected = style([
  statusCellBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-error) 6%, transparent)',
    color: 'var(--color-error)',
  },
]);

export const btnGroup = style({ display: 'flex', gap: 4 });

export const sectionTitle = style({ fontSize: 16, marginBottom: 12 });
export const detailHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
});
globalStyle(`${detailHeader} ${sectionTitle}`, { marginBottom: 0 });
export const addButtonFull = style({ width: '100%' });

export const rowSelected = style({
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
});

export const detailSection = style({ marginBottom: 16 });
export const detailLabel = style({ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 });
export const detailValue = style({ fontSize: 14, fontWeight: 500 });

/* 가능품목/불가품목 지정 */
export const productListSection = style({ marginBottom: 16 });
export const productListTitle = style({ fontSize: 13, fontWeight: 600, marginBottom: 8 });
export const productSearchWrap = style({ marginBottom: 8 });
export const productSearchResults = style({
  maxHeight: 120,
  overflowY: 'auto',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  marginBottom: 8,
  fontSize: 12,
});
export const productSearchResultRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 8px',
  borderBottom: '1px solid var(--color-border)',
  gap: 8,
});
globalStyle(`${productSearchResultRow}:last-child`, { borderBottom: 'none' });
export const productSearchResultText = style({ flex: 1, minWidth: 0 });
export const productTableWrap = style({
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  marginBottom: 8,
  fontSize: 12,
});
globalStyle(`${productTableWrap} table`, { width: '100%', borderCollapse: 'collapse' });
globalStyle(`${productTableWrap} th, ${productTableWrap} td`, { padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' });
globalStyle(`${productTableWrap} tr:last-child td`, { borderBottom: 'none' });
globalStyle(`${productTableWrap} th`, { backgroundColor: 'var(--color-background)', fontWeight: 600, fontSize: 11 });
export const productListBtnGroup = style({ display: 'flex', gap: 6, flexWrap: 'wrap' });
export const productRowDeleteBtn = style({ flexShrink: 0, padding: '2px 6px', fontSize: 11 });

