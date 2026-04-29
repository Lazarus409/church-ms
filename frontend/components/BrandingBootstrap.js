"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import { applyBranding, emitBrandingUpdate, loadBranding } from "@/lib/branding";

const brandedRoutes = ["/dashboard", "/members", "/attendance", "/settings"];

export default function BrandingBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !brandedRoutes.some((route) => pathname.startsWith(route))) {
      return;
    }

    let isMounted = true;

    const syncBranding = async () => {
      try {
        const me = await api.get("/auth/me");
        if (!isMounted) {
          return;
        }

        const branding = applyBranding(
          loadBranding(me.data.church_id, {
            brandName: me.data.church_name,
          }),
        );
        localStorage.setItem("church-branding:active", JSON.stringify(branding));
        emitBrandingUpdate(branding);
      } catch {
        // Auth guard handles invalid sessions.
      }
    };

    syncBranding();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return null;
}
