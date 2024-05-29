/** @format */
"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { navigate } from "@/actions";
import { ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useConfig } from "@/app/providers/ConfigContext";

export function MainNav() {
  const envConfig = useConfig();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<any>({
    id: 1,
    title: envConfig.navTitle || process.env.NEXT_PUBLIC_TITLE,
    path: "/dashboard",
  });
  const invite_code = searchParams.get("invite_code");
  // const pages = [
  //   {
  //     id: 0,
  //     title: "NEO TOKYO ACCESS",
  //     path: "/dashboard",
  //   },
  //   // {
  //   //   id: 1,
  //   //   title: "MVP 2.0 (PUBLIC BETA)",
  //   //   path: "/mvp/dashboard",
  //   // },
  // ];

  // const handleSwitch = (page: { id: number; title: string; path: string }) => {
  //   setSelected(page);
  //   invite_code
  //     ? navigate(`${page.path}?invite_code=${invite_code}`)
  //     : navigate(`${page.path}`);
  //   localStorage.setItem("styleSelectedPage", JSON.stringify(page));
  // };

  // const authToken: string =
  //   (typeof window !== "undefined" ? localStorage.getItem("authToken") : "") ||
  //   "";

  // useEffect(() => {
  //   if (pathname !== "/") {
  //     setTimeout(() => {
  //       const styleSelectedPage = localStorage.getItem("styleSelectedPage");
  //       if (styleSelectedPage) {
  //         setSelected(JSON.parse(styleSelectedPage));
  //       }
  //     }, 1000);
  //   } else {
  //     setSelected({
  //       id: 1,
  //       title: "NEO TOKYO ACCESS",
  //       path: "/dashboard",
  //     });
  //   }
  // }, [pathname]);

  return (
    <div className="mr-4 hidden md:flex">
      <span className="hidden tracking-wide sm:inline-block">
        {/* <DropdownMenu> */}
        <div className="flex flex-row w-full cursor-pointer">
          <div
            className={`text-md tracking-widest font-normal`}
            style={{ color: envConfig.labelColor }}
          >
            $STYLE: {selected.title}{" "}
          </div>
          {/* <DropdownMenuTrigger asChild>
              <div className="ml-1 flex flex-row w-full">
                <div className="text-md tracking-widest">{` ${selected.title}`}</div>
                <ChevronDown className="h-5 w-5 ml-2" />
              </div>
            </DropdownMenuTrigger> */}
        </div>
        {/* <DropdownMenuContent className="tracking-widest sm:max-w-40 lg:min-w-64 border-0 shadow-none">
            {pages.map((page, idx) => (
              <DropdownMenuItem
                onClick={() => {
                  if (authToken) {
                    handleSwitch(page);
                  }
                }}
                key={idx}
                className={`border-0 tracking-widest text-md ${
                  page.id === selected.id && "font-semibold"
                }`}
              >
                {page.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent> */}
        {/* </DropdownMenu> */}
      </span>
    </div>
  );
}
