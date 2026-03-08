import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { salesService } from '@/services/salesService';
import type { OrderLocation } from '@/types';
import { Spinner } from '../ui/spinner';

// Fix leaflet's default icon paths when bundling with Vite
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const center: [number, number] = [20, 0];

function MapAutoFit({ points }: { points: OrderLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude] as [number, number]));
    map.fitBounds(bounds.pad(0.2), { maxZoom: 6, padding: [40, 40] });
  }, [map, points]);

  return null;
}

const createMarkerIcon = (count: number, demo = false) => {
  if (!demo && count <= 1) {
    return new L.Icon.Default();
  }

  const size = Math.max(30, Math.min(60, 18 + count * 2));
  const baseColor = demo ? 'bg-slate-600/80' : 'bg-red-600';
  const textColor = demo ? 'text-white/90' : 'text-white';

  return L.divIcon({
    html: `<div class="flex items-center justify-center rounded-full ${baseColor} ${textColor} text-[11px] font-semibold shadow-lg" style="width: ${size}px; height: ${size}px; line-height: ${size}px;">${demo ? 'Demo' : count}</div>`,
    className: demo ? 'order-locator demo' : 'order-locator',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size / 2],
  });
};

const DEMO_LOCATIONS: OrderLocation[] = [
  {
    city: 'New York',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.006,
    count: 1,
    demo: true,
    orders: [
      {
        customerName: 'Demo Customer',
        product: 'Sample Product',
        date: new Date().toISOString(),
      },
    ],
  },
  {
    city: 'London',
    country: 'UK',
    latitude: 51.5072,
    longitude: -0.1276,
    count: 1,
    demo: true,
    orders: [
      {
        customerName: 'Demo Customer',
        product: 'Sample Product',
        date: new Date().toISOString(),
      },
    ],
  },
  {
    city: 'Berlin',
    country: 'Germany',
    latitude: 52.52,
    longitude: 13.405,
    count: 1,
    demo: true,
    orders: [
      {
        customerName: 'Demo Customer',
        product: 'Sample Product',
        date: new Date().toISOString(),
      },
    ],
  },
  {
    city: 'Dubai',
    country: 'UAE',
    latitude: 25.2048,
    longitude: 55.2708,
    count: 1,
    demo: true,
    orders: [
      {
        customerName: 'Demo Customer',
        product: 'Sample Product',
        date: new Date().toISOString(),
      },
    ],
  },
  {
    city: 'Lahore',
    country: 'Pakistan',
    latitude: 31.5204,
    longitude: 74.3587,
    count: 1,
    demo: true,
    orders: [
      {
        customerName: 'Demo Customer',
        product: 'Sample Product',
        date: new Date().toISOString(),
      },
    ],
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    latitude: 35.6895,
    longitude: 139.6917,
    count: 1,
    demo: true,
    orders: [
      {
        customerName: 'Demo Customer',
        product: 'Sample Product',
        date: new Date().toISOString(),
      },
    ],
  },
];

const GlobalOrdersMap: React.FC = () => {
  const [locations, setLocations] = useState<OrderLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await salesService.getOrderLocations();
        if (!canceled) {
          setLocations((res.data && res.data.length > 0) ? res.data : DEMO_LOCATIONS);
        }
      } catch (err: any) {
        if (!canceled) {
          setError(err?.response?.data?.error || 'Failed to load order locations');
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    load();

    const interval = window.setInterval(() => {
      load();
    }, 30000); // refresh every 30s

    return () => {
      canceled = true;
      window.clearInterval(interval);
    };
  }, []);

  const markers = useMemo(() => {
    return locations.filter((loc) => typeof loc.latitude === 'number' && typeof loc.longitude === 'number');
  }, [locations]);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Global Customer Orders Map</h2>
          <p className="text-sm text-muted-foreground">
            Visualize where orders are coming from across the globe.
          </p>
        </div>
        {loading && <Spinner />}
      </div>

      <div className="relative h-[420px] w-full rounded-lg border border-border overflow-hidden">
        <MapContainer
          center={center}
          zoom={2}
          scrollWheelZoom
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapAutoFit points={markers} />
          {markers.map((loc) => (
            <Marker
              key={`${loc.latitude}-${loc.longitude}-${loc.city}-${loc.country}`}
              position={[loc.latitude, loc.longitude]}
              icon={createMarkerIcon(loc.count, Boolean(loc.demo))}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  {loc.demo ? (
                    <div className="space-y-1 text-sm">
                      <div className="font-semibold">Demo customer location</div>
                      <div className="text-muted-foreground text-xs">
                        {loc.city}, {loc.country}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-semibold">{loc.city}, {loc.country}</div>
                      <div className="text-muted-foreground text-xs">
                        {loc.count} order{loc.count === 1 ? '' : 's'}
                      </div>
                      <div className="pt-1">
                        {loc.orders.slice(0, 3).map((order, idx) => (
                          <div key={idx} className="border-t border-border pt-1">
                            <div className="font-medium">{order.customerName || 'Customer'}</div>
                            <div className="text-xs text-muted-foreground">{order.product}</div>
                            <div className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</div>
                          </div>
                        ))}
                        {loc.count > 3 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            +{loc.count - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>


        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 px-4">
            <div className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive shadow">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalOrdersMap;
