"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Router from "next/router";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Oops, something went wrong!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <Button className="w-full" onClick={reset}>
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}
