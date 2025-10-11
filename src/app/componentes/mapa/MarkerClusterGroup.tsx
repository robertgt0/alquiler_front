// components/MakerCluster.tsx

"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useMap } from "react-leaflet";

interface MarkerClusterGroupProps {
  markers: {
    id: string | number;
    position: [number, number];
    popup?: string;
    icon?: L.DivIcon | L.Icon;
  }[];
}

const MarkerClusterGroup = ({ markers }: MarkerClusterGroupProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const clusterGroup: L.MarkerClusterGroup = (L as any).markerClusterGroup();

    markers.forEach((m) => {
      const marker = L.marker(m.position, { icon: m.icon });
      if (m.popup) marker.bindPopup(m.popup);
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, markers]);

  return null;
};

export default MarkerClusterGroup;
