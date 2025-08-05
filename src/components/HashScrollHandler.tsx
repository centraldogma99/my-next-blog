"use client";

import { scrollToHash } from "@/utils/scrollToElement";
import { useEffect } from "react";

export function HashScrollHandler() {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          scrollToHash(hash);
        }, 100);
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return null;
}