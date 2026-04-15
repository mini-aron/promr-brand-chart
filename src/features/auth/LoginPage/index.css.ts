import { style } from '@vanilla-extract/css';

export const page = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--color-background)',
  padding: 24,
});

export const card = style({
  width: '100%',
  maxWidth: 480,
  padding: 32,
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-md)',
});

export const logo = style({
  display: 'block',
  margin: '0 auto 12px',
  height: 64,
  width: 'auto',
});

export const title = style({
  fontSize: 24,
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: 8,
  textAlign: 'center',
});

export const subtitle = style({
  fontSize: 15,
  color: 'var(--color-text-muted)',
  marginBottom: 24,
  textAlign: 'center',
  lineHeight: 1.5,
});

export const input = style({
  width: '100%',
  padding: '10px 16px',
  fontSize: 15,
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text)',
  boxSizing: 'border-box',
  selectors: {
    '&::placeholder': { color: 'var(--color-text-muted)' },
    '&:focus': {
      outline: 'none',
      borderColor: 'var(--color-primary)',
    },
  },
});

export const label = style({
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  marginBottom: 8,
});

export const error = style({
  fontSize: 14,
  color: 'var(--color-error)',
  marginTop: 8,
});

export const submitButton = style({
  width: '100%',
  padding: 12,
  fontSize: 16,
});

export const link = style({
  display: 'block',
  fontSize: 15,
  color: 'var(--color-primary)',
  textDecoration: 'none',
  marginTop: 20,
  textAlign: 'center',
  selectors: { '&:hover': { textDecoration: 'underline' } },
});
