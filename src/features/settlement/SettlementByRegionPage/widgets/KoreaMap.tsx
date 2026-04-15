'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { theme } from '@/theme';
import { REGION_NAMES, type RegionStat } from '@/hooks/useSettlementByRegion';

export type GradientMode = 'amount' | 'quantity';

interface KoreaMapProps {
  regionStats: RegionStat[];
  selectedRegionCode: string | null;
  onRegionSelect: (code: string | null) => void;
  hoveredRegionCode: string | null;
  onRegionHover: (code: string | null) => void;
  gradientMode?: GradientMode;
  gradientEnabled?: boolean;
}

const SVG_URL = '/maps/south-korea.svg';
const HOVER_FILL = 'var(--color-primary)';
const SELECTED_FILL = 'url(#korea-map-selected-stripes)';
const STRIPE_PATTERN_ID = 'korea-map-selected-stripes';
const GRADIENT_LOW = '#e0e7ff';
const GRADIENT_HIGH = '#3b82f6';
const DEFAULT_FILL = 'var(--color-surface)';

interface TooltipState {
  x: number;
  y: number;
  visible: boolean;
  regionName: string;
}

export function KoreaMap({
  regionStats,
  selectedRegionCode,
  onRegionSelect,
  hoveredRegionCode,
  onRegionHover,
  gradientMode = 'amount',
  gradientEnabled = true,
}: KoreaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const callbacksRef = useRef({ onRegionHover, onRegionSelect });
  const stateRef = useRef({ selectedRegionCode, regionStats, gradientMode, gradientEnabled });
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    visible: false,
    regionName: '',
  });
  callbacksRef.current = { onRegionHover, onRegionSelect };
  stateRef.current = { selectedRegionCode, regionStats, gradientMode, gradientEnabled };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let svgEl: SVGSVGElement | null = null;

    fetch(SVG_URL)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        svgEl = doc.querySelector('svg');
        if (!svgEl || !container) return;

        svgEl.setAttribute('width', '100%');
        svgEl.setAttribute('height', '100%');
        svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svgEl.style.display = 'block';
        svgEl.style.pointerEvents = 'auto';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
          <pattern id="${STRIPE_PATTERN_ID}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="var(--color-primary-hover)"/>
            <rect x="0" y="0" width="6" height="2" fill="rgba(255,255,255,0.55)"/>
            <rect x="0" y="3" width="6" height="2" fill="rgba(255,255,255,0.55)"/>
          </pattern>
        `;
        svgEl.insertBefore(defs, svgEl.firstChild);

        const polygonsGroup = svgEl.querySelector('#polygons');
        if (polygonsGroup) {
          const cx = 308.55 + 342.91 / 2;
          const cy = 19.9 + 473.2 / 2;
          polygonsGroup.setAttribute('transform', `rotate(10, ${cx}, ${cy})`);
        }

        container.innerHTML = '';
        container.appendChild(svgEl);
        svgRef.current = svgEl;

        const paths = svgEl.querySelectorAll('path[id^="KR-"]');

        const getFillColor = (code: string, isHover: boolean, isSelected: boolean) => {
          if (isSelected) return SELECTED_FILL;
          if (isHover) return HOVER_FILL;
          const {
            regionStats: stats,
            gradientEnabled: enabled,
            gradientMode: mode,
          } = stateRef.current;
          if (!enabled) return DEFAULT_FILL;
          const stat = stats.find((r) => r.regionCode === code);
          const value = mode === 'amount' ? (stat?.amount ?? 0) : (stat?.quantity ?? 0);
          const values = stats
            .map((r) => (mode === 'amount' ? r.amount : r.quantity))
            .filter((v) => v > 0);
          if (values.length === 0) return GRADIENT_LOW;
          const min = Math.min(...values);
          const max = Math.max(...values);
          const scale = d3
            .scaleLinear<string>()
            .domain([min, max])
            .range([GRADIENT_LOW, GRADIENT_HIGH])
            .clamp(true);
          return scale(value);
        };

        const applyStyle = (path: Element, code: string, isHover: boolean, isSelected: boolean) => {
          const fill = getFillColor(code, isHover, isSelected);
          d3.select(path)
            .style('fill', fill)
            .style('cursor', 'pointer')
            .style('pointer-events', 'auto')
            .style('transition', 'fill 0.15s ease');
        };

        paths.forEach((path) => {
          const code = path.getAttribute('id') ?? '';
          const title = path.getAttribute('title') ?? code;

          const updateTitle = () => {
            const { regionStats: stats } = stateRef.current;
            const amount = stats.find((r) => r.regionCode === code)?.amount ?? 0;
            path.setAttribute('title', `${title} - ${amount.toLocaleString('ko-KR')}원`);
          };
          updateTitle();

          const regionName = REGION_NAMES[code] ?? path.getAttribute('title') ?? code;

          d3.select(path)
            .on('mouseenter', function (event: MouseEvent) {
              const { selectedRegionCode: sel } = stateRef.current;
              callbacksRef.current.onRegionHover(code);
              applyStyle(path, code, true, code === sel);
              setTooltip({ x: event.clientX, y: event.clientY, visible: true, regionName });
            })
            .on('mousemove', function (event: MouseEvent) {
              setTooltip((prev) =>
                prev.visible ? { ...prev, x: event.clientX, y: event.clientY } : prev,
              );
            })
            .on('mouseleave', function () {
              const { selectedRegionCode: sel } = stateRef.current;
              callbacksRef.current.onRegionHover(null);
              applyStyle(path, code, false, code === sel);
              setTooltip((prev) => ({ ...prev, visible: false }));
            })
            .on('click', () => {
              const { selectedRegionCode: sel } = stateRef.current;
              callbacksRef.current.onRegionSelect(sel === code ? null : code);
            });

          applyStyle(path, code, false, code === stateRef.current.selectedRegionCode);
        });
      })
      .catch(console.error);

    return () => {
      if (container && svgEl && container.contains(svgEl)) {
        container.removeChild(svgEl);
      }
      svgRef.current = null;
    };
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const getValue = (r: RegionStat) => (gradientMode === 'amount' ? r.amount : r.quantity);
    const values = regionStats.map(getValue).filter((v) => v > 0);
    const min = values.length > 0 ? Math.min(...values) : 0;
    const max = values.length > 0 ? Math.max(...values) : 1;
    const colorScale = d3
      .scaleLinear<string>()
      .domain([min, max])
      .range([GRADIENT_LOW, GRADIENT_HIGH])
      .clamp(true);

    const paths = svg.querySelectorAll('path[id^="KR-"]');
    paths.forEach((path) => {
      const code = path.getAttribute('id') ?? '';
      const regionName = path.getAttribute('title')?.split(' - ')[0] ?? code;
      const stat = regionStats.find((r) => r.regionCode === code);
      const amount = stat?.amount ?? 0;
      path.setAttribute('title', `${regionName} - ${amount.toLocaleString('ko-KR')}원`);

      const isHover = code === hoveredRegionCode;
      const isSelected = code === selectedRegionCode;
      const fill = isSelected
        ? SELECTED_FILL
        : isHover
          ? HOVER_FILL
          : gradientEnabled
            ? colorScale(
                getValue(stat ?? { regionCode: code, regionName: '', amount: 0, quantity: 0 }),
              )
            : DEFAULT_FILL;
      d3.select(path).style('fill', fill);
    });
  }, [hoveredRegionCode, selectedRegionCode, regionStats, gradientMode, gradientEnabled]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background)',
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {tooltip.visible && (
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(12px, 12px)',
            padding: '6px 10px',
            backgroundColor: 'var(--color-surface-elevated, #1a1a1a)',
            color: 'var(--color-text-primary, #fff)',
            fontSize: 14,
            fontWeight: 500,
            borderRadius: theme.radius.sm,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
            zIndex: 1000,
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.regionName}
        </div>
      )}
    </div>
  );
}
