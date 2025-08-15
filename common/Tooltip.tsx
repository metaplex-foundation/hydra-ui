// https://gourav.io/blog/react-tooltip
import React, { useState, type HTMLProps, type ReactNode, useRef } from "react";
interface TooltipProps {
  children: ReactNode;
  content: string;
}
const Tooltip = (props: React.HTMLProps<HTMLDivElement> & TooltipProps) => {
  const [hover, setHover] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setHover(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHover(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center">
      {hover && (
        <div className="absolute left-0 top-0 mx-auto flex w-full items-center justify-center gap-0 opacity-[0.78] z-999999 [transform:translateY(calc(+100%+10px))]">
          <div className="mx-auto flex flex-col items-center justify-center">
            <div className="whitespace-nowrap rounded-md bg-black p-2 text-[11px] text-white [font-weight:400] [letter-spacing:0] [line-height:13px]">
              {props.content}
            </div>
          </div>
        </div>
      )}
      {props.children}
    </div>
  );
};
export default Tooltip;