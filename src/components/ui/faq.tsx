import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <>
      <h2 className="pt-7   tracking-widest">FAQ</h2>

      <h1 className="py-2 text-sm font-bold  tracking-widest">
        Why do I have to wait?
      </h1>
      <p className="font-light text-sm my-4">
        You are getting a 100% custom virtual version of your avatar. Created
        from our Tailor DAO.
      </p>
      <h1 className="py-2 text-sm font-bold  tracking-widest">
        What if issues occur?
      </h1>
      <p className="font-light text-sm my-4">
        We will be in touch via email if there are issues with your assets.
      </p>
      {/* <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Why do I have to wait?</AccordionTrigger>
          <AccordionContent>
            You are getting a 100% custom virtual version of your avatar.
            Created from our Tailor DAO.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What if issues occur?</AccordionTrigger>
          <AccordionContent>
            We will be in touch via email if there are issues with your assets.
          </AccordionContent>
        </AccordionItem>
      </Accordion> */}
    </>
  );
}
