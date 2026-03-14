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
  image?: string;
  enabled?: boolean;
};

export default function TimelinePage() {
  const [segments, setSegments] = React.useState<Segment[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadSegments = async () => {
      try {
        // Try to load from API (Supabase)
        const response = await fetch("/api/segments");
        if (response.ok) {
          const data = await response.json();
          
          // If it's an array of collections, get the most recent one
          if (Array.isArray(data) && data.length > 0) {
            const collection = data[0]; // Most recent first
            if (collection.segments && Array.isArray(collection.segments)) {
              setSegments(collection.segments);
              setIsLoaded(true);
              return;
            }
          }
        }
      } catch (e) {
        // API call failed, fall back to localStorage
      }

      // Fall back to localStorage
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
    };

    loadSegments();
  }, []);

  return (
    <main className="relative min-h-screen bg-background text-foreground p-8 overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10">
        <style>{`
          @keyframes float1 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-30px) translateX(20px); }
          }
          @keyframes float2 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(20px) translateX(-30px); }
          }
          @keyframes float3 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-25px) translateX(-25px); }
          }
          @keyframes gradientShift {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .blob1 {
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(147, 112, 219, 0.4), transparent);
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            filter: blur(40px);
            animation: float1 8s ease-in-out infinite;
            top: -100px;
            left: -100px;
          }
          .blob2 {
            position: absolute;
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            filter: blur(40px);
            animation: float2 10s ease-in-out infinite;
            bottom: -100px;
            right: -100px;
          }
          .blob3 {
            position: absolute;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(34, 197, 94, 0.3), transparent);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            filter: blur(40px);
            animation: float3 12s ease-in-out infinite;
            top: 50%;
            right: 10%;
          }
          .gradient-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(15, 23, 42, 0.3) 100%);
            pointer-events: none;
          }
        `}</style>
        <div className="blob1"></div>
        <div className="blob2"></div>
        <div className="blob3"></div>
        <div className="gradient-overlay"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lịch trình đi chơi</h1>
          <p className="text-muted-foreground">With: Ninh Ninh</p>
        </div>

        <div className="rounded-lg border border-border bg-card/80 backdrop-blur-sm p-6 shadow-2xl">
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
