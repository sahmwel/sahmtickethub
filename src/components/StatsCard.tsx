'use client';

import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  color?: string; // Tailwind gradient or text color
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, color = "from-purple-600 to-pink-600", icon }: StatsCardProps) {
  return (
    <div className={`bg-gradient-to-r ${color} rounded-3xl p-8 text-white shadow-2xl hover:scale-105 transition transform flex items-center gap-4`}>
      {icon && <div className="text-4xl">{icon}</div>}
      <div>
        <h3 className="text-5xl font-black">{value}</h3>
        <p className="text-xl mt-2">{title}</p>
      </div>
    </div>
  );
}
