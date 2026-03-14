"use client";

import * as React from "react";
import { useState, useCallback, startTransition } from "react";

import CustomTimeline from "@/components/CustomTimeline";
import Accordion, { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type Segment = {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  color: string;
  extraInfo?: string;
  image?: string;
  enabled?: boolean;
  collapsed?: boolean;
};

export default function Page() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [segments, setSegments] = useState<Segment[]>([]);

  React.useEffect(() => {
    // Try load from localStorage first
    try {
      const raw = localStorage.getItem("timeline:segments");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSegments(parsed);
          return;
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    if (segments.length === 0) {
      setSegments([
        {
          id: "s-1",
          timestamp: new Date().toISOString().slice(0, 16),
          title: "Welcome",
          description: "Initial invite and welcome message.",
          color: "#7c3aed",
          image: "/cgv.jpg",
          extraInfo: "Location: Main Hall\nDress code: Smart casual",
          enabled: true,
          collapsed: false,
        },
        {
          id: "s-2",
          timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24)
            .toISOString()
            .slice(0, 16),
          title: "Meet & Greet",
          description: "Casual meet and greet with snacks.",
          color: "#06b6d4",
          image: "/hu_tieu.jpg",
          extraInfo: "Hosts: Alice & Bob\nParking available",
          enabled: true,
          collapsed: false,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage whenever segments change
  React.useEffect(() => {
    try {
      localStorage.setItem("timeline:segments", JSON.stringify(segments));
    } catch (e) {
      // ignore
    }
  }, [segments]);

  const updateSegment = useCallback((id: string, patch: Partial<Segment>) => {
    startTransition(() => {
      setSegments((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      );
    });
  }, []);

  const addSegment = useCallback(() => {
    const id = `s-${Date.now()}`;
    setSegments((prev) => [
      ...prev,
      {
        id,
        timestamp: new Date().toISOString().slice(0, 16),
        title: "New",
        description: "",
        color: "#ef4444",
        enabled: true,
        collapsed: false,
      },
    ]);
  }, []);

  const removeSegment = useCallback((id: string) => {
    setSegments((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const exportJSON = useCallback(() => {
    const data = JSON.stringify(segments, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `timeline-segments-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [segments]);

  if (!mounted)
    return <div className="container mx-auto py-10 px-6">Loading editor…</div>;

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="mb-6 text-2xl font-semibold">Timeline Editor</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <div className="space-y-4">
            <Accordion>
              {segments.map((s, idx) => (
                <AccordionItem
                  key={s.id}
                  title={
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ background: s.color }}
                      />
                      <span>Segment {idx + 1}</span>
                    </div>
                  }
                  open={!s.collapsed}
                  onOpenChange={(open) =>
                    updateSegment(s.id, { collapsed: !open })
                  }
                >
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!!s.enabled}
                          onChange={(e) =>
                            updateSegment(s.id, { enabled: e.target.checked })
                          }
                        />
                        Enabled
                      </label>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSegment(s.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    <label className="text-xs text-muted-foreground">
                      Timestamp
                    </label>
                    <input
                      type="datetime-local"
                      value={s.timestamp}
                      onChange={(e) =>
                        updateSegment(s.id, { timestamp: e.target.value })
                      }
                      className="rounded border px-2 py-1"
                    />

                    <label className="text-xs text-muted-foreground">
                      Title
                    </label>
                    <input
                      value={s.title}
                      onChange={(e) =>
                        updateSegment(s.id, { title: e.target.value })
                      }
                      className="rounded border px-2 py-1"
                    />

                    <label className="text-xs text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={s.description}
                      onChange={(e) =>
                        updateSegment(s.id, { description: e.target.value })
                      }
                      rows={3}
                      className="rounded border px-2 py-1"
                    />

                    {/* thumbnails are handled internally; external URL removed */}

                    <label className="text-xs text-muted-foreground">
                      Image URL (from public folder)
                    </label>
                    <input
                      type="text"
                      placeholder="/cgv.jpg"
                      value={s.image || ""}
                      onChange={(e) =>
                        updateSegment(s.id, { image: e.target.value })
                      }
                      className="rounded border px-2 py-1 text-sm"
                    />
                    <div className="text-xs text-muted-foreground">
                      Available: /cgv.jpg, /hu_tieu.jpg, /bread_factory.jpg,
                      /trien_lam.png, /khu-ky-tu-xa-my-dinh-_2.jpg
                    </div>

                    <label className="text-xs text-muted-foreground">
                      Extra info
                    </label>
                    <textarea
                      value={s.extraInfo || ""}
                      onChange={(e) =>
                        updateSegment(s.id, { extraInfo: e.target.value })
                      }
                      rows={2}
                      className="rounded border px-2 py-1"
                    />

                    <label className="text-xs text-muted-foreground">
                      Color
                    </label>
                    <input
                      type="color"
                      value={s.color}
                      onChange={(e) =>
                        updateSegment(s.id, { color: e.target.value })
                      }
                      className="h-10 w-16 rounded border p-1"
                    />
                  </div>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="flex gap-2">
              <button
                className="rounded bg-primary px-3 py-2 text-white"
                onClick={addSegment}
              >
                Add segment
              </button>
              <button className="rounded border px-3 py-2" onClick={exportJSON}>
                Export JSON
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium">Preview</h2>
            <CustomTimeline segments={segments} />
          </div>
        </div>
      </div>
    </div>
  );
}
