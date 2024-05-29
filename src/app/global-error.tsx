"use client";
import Router from "next/router";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Oops, something went wrong!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We apologize for the inconvenience. Please try refreshing the
                page.
              </p>
              <Button className="w-full" onClick={reset}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
