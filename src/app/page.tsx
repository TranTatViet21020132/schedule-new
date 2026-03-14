"use client";

import React from "react";
import Component from "@/components/comp-532";

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Invitation Timeline (Sample)</h1>
          <p className="text-muted-foreground">Using component: comp-532</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <Component />
        </div>
      </div>
    </main>
  );
}
