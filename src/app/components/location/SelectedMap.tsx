"use client";
import dynamic from "next/dynamic";

const SelectedMap = dynamic(() => import("./SelectedMap.client"), {
  ssr: false,
});

export default SelectedMap;
