"use client";

import * as React from "react";
import Image from "next/image";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type SegmentProps = {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  color: string;
  extraInfo?: string;
  image?: string;
  enabled?: boolean;
};

interface CustomTimelineProps {
  segments: SegmentProps[];
}

function formatDate(timestamp: string): { date: string; time: string } {
  const d = new Date(timestamp);
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

export default function CustomTimeline({ segments }: CustomTimelineProps) {
  const visible = segments.filter((s) => s.enabled !== false);

  if (visible.length === 0) {
    return <p className="text-muted-foreground text-sm">No segments yet</p>;
  }

  return (
    <Timeline defaultValue={visible.length}>
      {visible.map((segment, index) => {
        const { date, time } = formatDate(segment.timestamp);
        return (
          <TimelineItem key={segment.id} step={index + 1}>
            <TimelineHeader>
              <TimelineSeparator style={{ background: segment.color }} />
              <TimelineDate>
                <div>
                  <div>{date}</div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      marginTop: "0.25rem",
                    }}
                  >
                    {time}
                  </div>
                </div>
              </TimelineDate>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="cursor-pointer flex-1">
                    <TimelineTitle>{segment.title}</TimelineTitle>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent side="bottom" align="start" className="w-64">
                  <div className="space-y-3">
                    {segment.image && (
                      <div className="relative w-full h-40 overflow-hidden rounded-lg">
                        <Image
                          src={segment.image}
                          alt={segment.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    {segment.extraInfo && (
                      <div className="text-sm">
                        <p className="font-medium mb-2">Additional Info:</p>
                        <p className="text-muted-foreground">
                          {segment.extraInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
              <TimelineIndicator
                style={{
                  borderColor: segment.color,
                  boxShadow: `0 0 12px ${segment.color}33`,
                }}
              />
            </TimelineHeader>
            <TimelineContent>{segment.description}</TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
