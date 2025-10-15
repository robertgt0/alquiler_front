// components/MakerClusterGroup.tsx
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
  color?: string; // Nuevo parámetro opcional
}

const MarkerClusterGroup = ({ markers, color = "#2563eb" }: MarkerClusterGroupProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const clusterGroup: L.MarkerClusterGroup = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();

        // Color del círculo y texto dinámico
        const size =
          count < 10 ? "small" : count < 50 ? "medium" : "large";

        const html = `
          <div style="
            background-color: ${color};
            color: white;
            border-radius: 50%;
            width: ${size === "small" ? 30 : size === "medium" ? 40 : 50}px;
            height: ${size === "small" ? 30 : size === "medium" ? 40 : 50}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${size === "small" ? 12 : size === "medium" ? 14 : 16}px;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 0 6px rgba(0,0,0,0.3);
          ">
            ${count}
          </div>
        `;

        return L.divIcon({
          html,
          className: "custom-cluster-icon",
          iconSize: L.point(40, 40, true),
        });
      },
    });

    markers.forEach((m) => {
      const marker = L.marker(m.position, { icon: m.icon });
      if (m.popup) marker.bindPopup(m.popup);
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, markers, color]);

  return null;
};

export default MarkerClusterGroup;