"use client";

import { useEffect, useState } from "react";

export default function MapComponent({ orders }: { orders: any[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) {
    return <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl"></div>;
  }

  return (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-2xl text-gray-400 font-medium">
      Map feature requires leaflet
    </div>
  );
}
