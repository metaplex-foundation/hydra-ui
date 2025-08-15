"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarContextValue { open: boolean; setOpen: (o: boolean) => void }
const SidebarContext = React.createContext<SidebarContextValue | null>(null);
export function useSidebar() { const ctx = React.useContext(SidebarContext); if(!ctx) throw new Error("useSidebar must be used within SidebarProvider"); return ctx }

export const SidebarProvider: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const [open, setOpen] = React.useState(true);
  return <SidebarContext.Provider value={{ open, setOpen }}><div className="flex w-full" style={style}>{children}</div></SidebarContext.Provider>;
};

export const Sidebar: React.FC<React.HTMLAttributes<HTMLDivElement> & { collapsible?: "offcanvas" | "none"; variant?: string }> = ({ className, children }) => {
  const { open } = useSidebar();
  return <aside className={cn("border-r bg-background/40 backdrop-blur-sm flex flex-col transition-all duration-200", open ? "w-64" : "w-14", className)}>{children}</aside>;
};
export const SidebarInset: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children }) => <div className={cn("flex-1 flex flex-col", className)}>{children}</div>;
export const SidebarHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => <div className={cn("p-3", className)} {...props} />;
export const SidebarFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => <div className={cn("mt-auto p-3", className)} {...props} />;
export const SidebarContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => <div className={cn("flex-1 overflow-y-auto px-2 py-2 space-y-4", className)} {...props} />;
export const SidebarMenu: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ className, ...props }) => <ul className={cn("flex flex-col gap-1", className)} {...props} />;
export const SidebarMenuItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({ className, ...props }) => <li className={cn("list-none", className)} {...props} />;
export const SidebarMenuButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }> = ({ className, children, asChild, ...props }) => { const Comp: any = asChild ? "span" : "button"; return <Comp className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent focus:outline-none", className)} {...props}>{children}</Comp> };
export const SidebarTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => { const { open, setOpen } = useSidebar(); return <button type="button" aria-label="Toggle sidebar" onClick={()=>setOpen(!open)} className={cn("rounded-md border px-2 py-1 text-xs font-medium hover:bg-accent", className)} {...props}>{open ? "←" : "→"}</button>; };
