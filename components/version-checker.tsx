"use client";

import { useEffect } from "react";

export default function VersionChecker() {
    useEffect(() => {
        const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
        const storedVersion = localStorage.getItem('app_version');
        
        if (storedVersion && storedVersion !== currentVersion) {
            localStorage.clear();
            sessionStorage.clear();
            
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
            });
            
            window.location.reload();
        }
        
        localStorage.setItem('app_version', currentVersion);
    }, []);

    return null;
}
