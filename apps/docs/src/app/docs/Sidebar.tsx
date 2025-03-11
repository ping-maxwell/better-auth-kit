"use client";
import { contents } from "@/components/sidebar-content";
import { Sidebar as Sidebar_ } from "@/components/sidebar";

export function Sidebar() {
  return <Sidebar_ contents={contents} levelOfDetailButton />;
}
