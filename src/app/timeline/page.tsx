"use client";

import React from "react";
import CustomTimeline from "@/components/CustomTimeline";

type Segment = {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  color: string;
  extraInfo?: string;
  enabled?: boolean;
};

export default function TimelinePage() {
  const [segments, setSegments] = React.useState<Segment[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Load segments from localStorage after hydration
    try {
      const raw = localStorage.getItem("timeline:segments");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSegments(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lịch trình đi chơi</h1>
          <p className="text-muted-foreground">With: Ninh Ninh</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          {isLoaded ? (
            <CustomTimeline segments={segments} />
          ) : (
            <p className="text-muted-foreground text-sm">Loading...</p>
          )}
        </div>
      </div>
    </main>
  );
}
