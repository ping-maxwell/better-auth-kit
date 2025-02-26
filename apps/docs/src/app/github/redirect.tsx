"use client";

import { useEffect } from "react";

export default function Redirect() {
  useEffect(() => {
    window.location.href = "https://github.com/ping-maxwell/better-auth-kit";
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      You're being redirected... If you do not get redirected, click{" "}
      <a href="https://github.com/ping-maxwell/better-auth-kit">here</a>
    </div>
  );
}
