import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const OrderConfirmationModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="mt-4 mx-0 min-w-full flex flex-col items-center">
          <Button className="w-2/3" type="submit">
            PROCEED
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>THANK YOU FOR THE ORDER.</DialogTitle>
          <DialogDescription>The process can take up to 92h.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="items-center gap-4">
            <h6 className="font-medium">
              You will receive the usable version of your asset on your wallet
              automatically or send to your email.
            </h6>

            <h2 className="pt-7 text-base font-bold">FAQ</h2>
            <Accordion type="single" collapsible className="w-full">
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
                  We will be in touch via email if there are issues with your
                  assets.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button className="w-full" type="button">
              CLOSE
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationModal;
