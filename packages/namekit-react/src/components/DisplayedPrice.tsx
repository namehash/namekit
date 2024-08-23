import { type Price, formattedPrice } from "@namehash/ens-utils";
import React from "react";
import cc from "classcat";
import { Tooltip } from "./Tooltip";

export const PriceDisplaySize = {
  Micro: "nk-text-[12px] md:nk-text-[14px] nk-font-normal",
  Small: "nk-text-[14px] nk-font-semibold",
  Medium: "nk-text-[20px] nk-font-semibold",
  Large: "nk-text-[24px] nk-font-bold",
} as const;
export type PriceDisplaySize =
  (typeof PriceDisplaySize)[keyof typeof PriceDisplaySize];

export interface DisplayedPriceProps {
  /**
   * The price to be displayed
   * @example { currency: Currency.Eth, value: 1000000000000000000n }
   */
  price: Price;
  /**
   * The currency symbol to display alongside the price.
   */
  symbol: React.ReactNode;
  /**
   * The position of the currency symbol relative to the price.
   * Defaults to `CurrencySymbolPosition.Left`.
   *
   * If `CurrencySymbolPosition.Left`, the currency symbol will be displayed to the left of the price.
   * If `CurrencySymbolPosition.Right`, the currency symbol will be displayed to the right of the price.
   */
  // The size of the price display
  displaySize?: PriceDisplaySize;
  /**
   * Whenever below prop is defined, the price will be
   * displayed inside a Tooltip and the below content
   * will be the trigger of this Tooltip displaying.
   */
  tooltipTriggerToDisplayPriceInTooltip?: React.ReactNode;
}

export const DisplayedPrice = ({
  price,
  symbol,
  displaySize = PriceDisplaySize.Small,
  tooltipTriggerToDisplayPriceInTooltip,
}: DisplayedPriceProps) => {
  const displayedPrice = (
    <div
      className={cc([
        "nk-min-w-max nk-inline-flex nk-justify-center nk-items-end nk-tabular-nums nk-leading-none",
        displaySize,
      ])}
    >
      <p className="nk-order-2 nk-leading-none">{formattedPrice({ price })}</p>

      {symbol}
    </div>
  );

  const displayedPriceInATooltip = (
    <div className={cc(["nk-inline-flex nk-items-center", displaySize])}>
      <div className="nk-order-2 nk-leading-none">
        <Tooltip trigger={tooltipTriggerToDisplayPriceInTooltip}>
          <>
            {price ? (
              <div className="nk-bg-gray-900 focus:nk-outline-none nk-relative nk-h-full nk-rounded-md">
                <div className="nk-text-[12px] nk-text-white sm:nk-text-[14px] nk-inline-flex nk-items-center nk-tabular-nums nk-leading-none">
                  <p className="nk-order-2">
                    {formattedPrice({
                      price,
                    })}
                  </p>
                  {symbol}
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        </Tooltip>
      </div>
    </div>
  );

  return tooltipTriggerToDisplayPriceInTooltip
    ? displayedPriceInATooltip
    : displayedPrice;
};
