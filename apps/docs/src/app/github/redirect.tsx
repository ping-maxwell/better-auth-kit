"use client";

import { useEffect } from "react";

export default function Redirect() {
  useEffect(() => {
    window.location.href = "https://github.com/ping-maxwell/better-auth-kit";
  });

  return <a href="https://github.com/ping-maxwell/better-auth-kit">GitHub</a>;
}
