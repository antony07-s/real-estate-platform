"use client";

import { useEffect } from "react";

const APP_NAME = "RealEstate Platform";

export default function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [title]);
}
