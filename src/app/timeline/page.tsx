"use client"

import React from "react"
import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineHeader,
  TimelineDate,
  TimelineTitle,
  TimelineIndicator,
  TimelineSeparator,
} from "@/components/ui/timeline"

type EventItem = { id: string; date: string; time?: string; title: string; description?: string }

const SAMPLE_EVENTS: EventItem[] = [
  { id: "1", date: "Mar 15, 2024", time: "09:00", title: "Project Kickoff", description: "Introductions & goals" },
  { id: "2", date: "Mar 22, 2024", time: "10:30", title: "Design Phase", description: "Review designs & feedback" },
  { id: "3", date: "Apr 05, 2024", time: "14:00", title: "Implementation", description: "Start development work" },
  { id: "4", date: "Apr 26, 2024", time: "16:00", title: "Launch", description: "Release & retrospective" },
]

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Invitation Timeline</h1>
          <p className="text-muted-foreground">Public demo timeline</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <Timeline className="relative">
            <TimelineContent className="w-full">
              <div className="relative">
                {SAMPLE_EVENTS.map((ev, idx) => (
                  <TimelineItem key={ev.id} step={idx + 1} className="mb-8 last:mb-0">
                    <div className="absolute left-0 -ml-4 top-1">
                      <TimelineIndicator className="bg-white shadow-sm" />
                      {idx !== SAMPLE_EVENTS.length - 1 && (
                        <TimelineSeparator className="h-full top-6 left-1.5 w-px bg-muted-foreground/10" />
                      )}
                    </div>

                    <div className="pl-8">
                      <TimelineHeader>
                        <TimelineDate asChild>
                          <time>
                            {ev.date}
                            {ev.time ? ` · ${ev.time}` : ""}
                          </time>
                        </TimelineDate>
                      </TimelineHeader>

                      <div className="mt-2">
                        <div className="rounded-lg border border-border bg-card p-4">
                          <TimelineTitle className="text-sm font-semibold">{ev.title}</TimelineTitle>
                          {ev.description && <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>}
                        </div>
                      </div>
                    </div>
                  </TimelineItem>
                ))}
              </div>
            </TimelineContent>
          </Timeline>
        </div>
      </div>
    </main>
  )
}
