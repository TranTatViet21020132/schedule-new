"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type AccordionItemProps = {
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
};

export function AccordionItem({
  id,
  open,
  onOpenChange,
  className,
  title,
  children,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(open ?? true);

  React.useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  }, [open]);

  function toggle() {
    setIsOpen((v) => {
      const next = !v;
      onOpenChange?.(next);
      return next;
    });
  }

  return (
    <div
      data-slot="accordion-item"
      className={cn("border rounded-md", className)}
      id={id}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={toggle}
        className="w-full px-4 py-2 text-left flex items-center justify-between"
      >
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">
          {isOpen ? "-" : "+"}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
}

export default Accordion;
