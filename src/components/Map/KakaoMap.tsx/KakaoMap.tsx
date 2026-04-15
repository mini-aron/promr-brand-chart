'use client';

import { useEffect } from 'react';
import { Map, MapMarker, useMap, useKakaoLoader } from 'react-kakao-maps-sdk';
import { createMarkerImageOption } from './KakaoMapConfig';

export interface MarkerPosition {
  lat: number;
  lng: number;
}

export interface MapMarkerItem {
  id: string;
  lat: number;
  lng: number;
  color?: string;
}

export interface FixedMarkerOption {
  position: MarkerPosition;
  content?: React.ReactNode;
}

export interface KakaoMapProps {
  center?: MarkerPosition;
  width?: string;
  height?: string;
  markers?: MapMarkerItem[];
  fixedMarker?: FixedMarkerOption;
  onMarkerClick?: (markerId: string, position: MarkerPosition) => void;
  focusedMarkerId?: string | null;
  centerOnFocusedMarker?: boolean;
  focusedMarkerZoomLevel?: number;
}

function ZoomController({
  focusedMarkerId,
  markers,
  zoomLevel,
  enabled,
}: {
  focusedMarkerId: string | null | undefined;
  markers: MapMarkerItem[] | undefined;
  zoomLevel: number | undefined;
  enabled: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!enabled || !focusedMarkerId || !markers?.length) return;
    const marker = markers.find((m) => m.id === focusedMarkerId);
    if (!marker) return;

    const kakao = (
      window as unknown as {
        kakao?: { maps: { LatLng: new (lat: number, lng: number) => unknown } };
      }
    ).kakao;
    if (!kakao) return;
    const latlng = new kakao.maps.LatLng(marker.lat, marker.lng);
    map.setCenter(latlng as never);
    map.setLevel(zoomLevel ?? 3, { animate: true });
  }, [enabled, focusedMarkerId, markers, zoomLevel, map]);

  return null;
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export function KakaoMap({
  center = DEFAULT_CENTER,
  width = '100%',
  height = '400px',
  markers = [],
  onMarkerClick,
  focusedMarkerId,
  centerOnFocusedMarker = true,
  focusedMarkerZoomLevel = 3,
}: KakaoMapProps) {
  const appkey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? '';
  const [loading, error] = useKakaoLoader({ appkey });

  if (loading) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-muted)',
          fontSize: 14,
        }}
      >
        지도 로딩 중...
      </div>
    );
  }

  if (error || !appkey) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-muted)',
          fontSize: 14,
        }}
      >
        지도를 불러올 수 없습니다. (Kakao Map API 키 확인)
      </div>
    );
  }

  return (
    <Map center={center} style={{ width, height }} level={8}>
      <ZoomController
        focusedMarkerId={focusedMarkerId}
        markers={markers}
        zoomLevel={focusedMarkerZoomLevel}
        enabled={centerOnFocusedMarker}
      />
      {markers.map((marker) => (
        <MapMarker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          image={createMarkerImageOption(marker.color)}
          onClick={() => onMarkerClick?.(marker.id, { lat: marker.lat, lng: marker.lng })}
        />
      ))}
    </Map>
  );
}
