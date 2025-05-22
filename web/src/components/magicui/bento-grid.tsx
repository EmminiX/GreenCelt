import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background?: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn("grid w-full auto-rows-auto grid-cols-1 md:grid-cols-2 gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-background/75 backdrop-blur-sm [box-shadow:0_0_0_1px_rgba(255,255,255,.2),0_2px_4px_rgba(0,0,0,.1),0_12px_24px_rgba(0,0,0,.1)]",
      // dark styles
      "dark:bg-background/75 transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff3f_inset] dark:[border:1px_solid_rgba(255,255,255,.2)]",
      className,
    )}
    {...props}
  >
    {background && <div>{background}</div>}
    <a
      className="z-10 flex transform-gpu flex-col gap-1 p-4 sm:p-6 transition-all duration-300 group-hover:-translate-y-2"
      href={href}
      target="_blank"
    >
      <Icon className="h-10 w-10 sm:h-12 sm:w-12 origin-left transform-gpu text-white transition-all duration-300 ease-in-out group-hover:scale-90" />
      <h3 className="text-lg sm:text-xl font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] mt-2">
        {name}
      </h3>
      <p className="text-sm sm:text-base max-w-lg text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] line-clamp-none mb-10">{description}</p>
    </a>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-3 sm:p-4 mb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto text-white bg-white/10 hover:bg-white/20 text-xs sm:text-sm">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-3 w-3 sm:h-4 sm:w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-white/[.05] group-hover:dark:bg-white/[.05]" />
  </div>
);

export { BentoCard, BentoGrid };
