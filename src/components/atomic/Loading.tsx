import React from "react";

export default function Loading({ className }: { className?: string }) {
  return (
    <div className={`flex flex-row gap-2 ${className}`}>
      <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
      <div className="h-2 w-2 animate-bounce200 rounded-full bg-primary"></div>
      <div className="h-2 w-2 animate-bounce400 rounded-full bg-primary"></div>
    </div>
  );
}
