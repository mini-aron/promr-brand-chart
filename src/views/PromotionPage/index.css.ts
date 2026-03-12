import { style, globalStyle } from '@vanilla-extract/css';

export const page = style({
  minHeight: '100vh',
  backgroundColor: 'var(--color-background)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const header = style({
  width: '100%',
  maxWidth: 1100,
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
});

export const logo = style({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
});

export const logoImg = style({
  display: 'block',
  height: 48,
  width: 'auto',
});

export const hero = style({
  flex: 1,
  width: '100%',
  maxWidth: 1100,
  padding: '40px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
});

export const heroTitle = style({
  fontSize: 48,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: 'var(--color-text)',
  marginBottom: 16,
  lineHeight: 1.15,
});

export const heroDesc = style({
  fontSize: 20,
  color: 'var(--color-text-muted)',
  marginBottom: 20,
  maxWidth: 640,
  lineHeight: 1.7,
});

export const ctaButton = style({
  padding: '12px 24px',
  fontSize: 17,
  fontWeight: 600,
  marginBottom: 48,
});

export const sectionTitle = style({
  fontSize: 24,
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: 24,
});

export const features = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 20,
  width: '100%',
  maxWidth: 1100,
  marginBottom: 48,
});

export const featureCard = style({
  padding: 24,
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-sm)',
  textAlign: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s',
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-md)',
    },
  },
});

globalStyle(`${featureCard} svg`, {
  fontSize: 44,
  color: 'var(--color-primary)',
  marginBottom: 12,
});
globalStyle(`${featureCard} h3`, {
  fontSize: 18,
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: 8,
});
globalStyle(`${featureCard} p`, {
  fontSize: 15,
  color: 'var(--color-text-muted)',
  lineHeight: 1.6,
});

export const benefitsSection = style({
  width: '100%',
  maxWidth: 1100,
  padding: '32px 24px',
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  marginBottom: 40,
});

export const benefitsSectionTitle = style({
  fontSize: 24,
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: 16,
});

export const benefitsList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 16,
  listStyle: 'none',
  padding: 0,
  margin: 0,
});
export const benefitsItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  fontSize: 15,
  color: 'var(--color-text)',
  lineHeight: 1.6,
});

globalStyle(`${benefitsItem} svg`, {
  flexShrink: 0,
  marginTop: 2,
  color: 'var(--color-success)',
  fontSize: 20,
});

export const bottomCta = style({
  textAlign: 'center',
  padding: 32,
});

globalStyle(`${bottomCta} p`, {
  fontSize: 18,
  color: 'var(--color-text-muted)',
  marginBottom: 16,
});

export const headerLoginButton = style({
  padding: '8px 16px',
  fontSize: 15,
});
