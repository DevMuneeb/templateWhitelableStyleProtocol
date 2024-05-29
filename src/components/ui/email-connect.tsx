"use client";
import React from "react";
import Image from "next/image";
import EmailAuthForm from "@/shared/Auth/email-connect-form";
import { useConfig } from "@/app/providers/ConfigContext";

export function EmailConnect() {
  const envConfig = useConfig();

  return (
    <div className="min-h-screen w-full rounded-md  relative flex flex-col items-center justify-center antialiased">
      <div className="sm:max-w-md md:max-w-xs mt-3 p-4 ">
        <div className="w-full aspect-squareflex items-center justify-center ">
          <div className="relative z-10 py-1 flex flex-col items-center justify-center">
            <img
              src={envConfig.logo || process.env.NEXT_PUBLIC_LOGO || ""}
              alt="logo"
              width="80"
              height="80"
            />
          </div>
          <div>
            <p
              className={`text-md my-4`}
              style={{ color: envConfig.labelColor }}
            >
              {envConfig.slogan || process.env.NEXT_PUBLIC_SLOGAN || ""}
            </p>
          </div>
          <div className="relative z-10">
            <EmailAuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
