/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";

/*
  Launch Readiness Removal: NFT Details Page is not ready!

    import Link from "next/link";
*/
import cc from "classcat";
import { ENSName, Normalization } from "@namehash/ens-utils";
import { DomainCardProps } from "../../../../packages/namekit-react/src/components/DomainCard";

interface DisplayedNameProps {
  /*
    The font-size starts at 'maxFontSize' and is reduced until:
    1. The displayed name fits in one line OR
    2. The displayed name font-size reaches 'minFontSize'.
  */
  minFontSize?: number;
  maxFontSize?: number;
  isClickableLink?: boolean;
  fontConfigClasses?: DisplayedNameConfig;
  domainName: ENSName | null; // when null we show the skeleton

  /*
    Used to confirm that a name is unnormalized:
    When DomainCard, the name exists in the blockchain;
    When null, the name doesn't exist in the blockchain;
    When undefined, the DomainCard query was not yet finished.
  */
  domainCard?: DomainCardProps | null;
  /*
    With 'parentReferenceForFontResizing' set, the displayed name font-size keeps decreasing
    until it fits the 'linesToFitDisplayedName' value, stoping the resizing process there then.
  */
  linesToFitDisplayedName?: number;
  /*
    For dinamically updating font-size based on parent width,
    the prop parentReferenceForFontResizing is required.
  */
  parentReferenceForFontResizing?: React.RefObject<HTMLElement>;
  /*
    If the name is too long to fit in 'linesToFitDisplayedName', reaching then the 'minFontSize'
    first, we'll truncated the name using 'lineClampCount' to determine how many lines of text
    to display. Truncated names not necessarely will show ellipsis, it depends on how many
    lines a name uses and how many lines are allowed to be displayed.
  */
  lineClampCount?: LineClampCount;
  onFinishedNameCalculations?: (fontSizeIsCalculated: boolean) => void;
  skeletonClasses?: string;
}

export enum LineClampCount {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
}

export const FontLineHeight = {
  "125": {
    tailwindClass: "leading-[125%]",
    scaleFactor: 1.25,
  },
};

export enum DisplayedNameConfig {
  NFTDetailsPage = "font-bold text-4xl",
  DomainCard = "sm:text-lg font-semibold line-clamp-2",
  AccountPagesTableRow = "sm:text-md inline font-semibold truncate border-b border-black leading-none animated-black-underline",
  UnknownNameModal = "row-span-1 text-gray-500 break-all text-sm",
  NFTAvatar = "drop-shadow-2xl text-base z-40 box-border",
}

/*
  Below constant is important so the different HTML elements
  used for font-size calculation and name displaying don't
  polute user's interface. Below delay guarantees we first
  wait for calculation to finish, for unnecessary
  displayable HTML to be removed from the DOM
  and only then we display the name.
*/
const DELAY_BETWEEN_FONT_SIZE_CALCULATION_AND_NAME_DISPLAYING = 0;

export const DisplayedName = ({
  domainName,
  domainCard,
  minFontSize = 16,
  maxFontSize = 128,
  /*
    Launch Readiness Removal: NFT Details Page is not ready!
      isClickableLink = false,
  */
  onFinishedNameCalculations,
  linesToFitDisplayedName = 2,
  parentReferenceForFontResizing,
  lineClampCount = LineClampCount.Two,
  fontConfigClasses = DisplayedNameConfig.DomainCard,
  skeletonClasses = "w-40 h-3 bg-black bg-opacity-5 rounded",
}: DisplayedNameProps) => {
  const displayedNameRef = useRef<null | HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(maxFontSize);
  const [displayName, setDisplayName] = useState(false);

  /*
    This state determines wether the component should calculate the
    font-size and clamping rules before displaying the name or not.
  */
  const [shouldCalculateBeforeDisplay] = useState<boolean>(
    !!parentReferenceForFontResizing,
  );

  // Used for mobile devices font resizing
  const [previousWindowInnerWidth, setPreviousWindowInnerWidth] = useState<
    number | null
  >(null);
  useEffect(() => {
    if (window) {
      setPreviousWindowInnerWidth(window.innerWidth);
    }
  }, []);

  // Below state is null when text clamping was not yet calculated
  const [shouldClampName, setShouldClampName] = useState<boolean | null>(null);
  const [fontSizeIsCalculated, setFontSizeIsCalculated] =
    useState<boolean>(false);

  // On window resize, we reset the font configuration process
  useEffect(() => {
    window.addEventListener("resize", resetFontConfig);

    return () => {
      window.removeEventListener("resize", resetFontConfig);
    };
  }, [previousWindowInnerWidth]);

  const getNumberOfLinesNameUses = () => {
    if (displayedNameRef.current) {
      const linesOfContent = getLinesOfInterfaceTextContent(
        displayedNameRef.current,
        FontLineHeight[125].scaleFactor,
      );

      return linesOfContent;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setDisplayName(fontSizeIsCalculated);

      // Small delay to avoid layout shift when displaying name
    }, DELAY_BETWEEN_FONT_SIZE_CALCULATION_AND_NAME_DISPLAYING);
  }, [fontSizeIsCalculated]);

  useEffect(() => {
    if (displayName) setNameClamping();
  }, [displayName]);

  const setNameClamping = () => {
    /*
      Below logic says:
      1. If we are trying to fit the displayed name based on its
        parent width and we have finished calculating the font-size OR
      2. We are not calculating the displayed name font-size based on
        its parent width

      AND

      3. Name uses more lines of text than configured lineClampCount specifies
        -> Set 'shouldClampName' to true
    */
    const nameUsesXLinesOfText = getNumberOfLinesNameUses();

    if (nameUsesXLinesOfText) {
      setShouldClampName(nameUsesXLinesOfText > lineClampCount);

      onFinishedNameCalculations?.(displayName);
    }
  };

  const getNameLabels = (name: string) => {
    const labels = name.split(".");

    return {
      labels,
      firstLabel: labels[0],
      rootName: labels.slice(1, labels.length),
    };
  };

  const resetFontConfig = () => {
    /*
      Below condition is to avoid font resizing when
      mobile device user is simply scrolling. In this
      case, the window.innerWidth is not changed. We
      noticed how mobile devices scrolling was causing
      the 'resize' event listener to trigger 'resetFontConfig'
    */
    if (
      previousWindowInnerWidth &&
      window.innerWidth !== previousWindowInnerWidth
    ) {
      setDisplayName(false);
      setShouldClampName(null);
      setFontSizeIsCalculated(false);

      setTimeout(() => {
        /*
          Below const guarantees we'll always set a font size that
          is bigger than the current one, so the font size will always
          be updated, restarting the font size calculation process.
        */
        const max = fontSize === maxFontSize ? fontSize + 1 : maxFontSize;
        setFontSize(max);
      }, DELAY_BETWEEN_FONT_SIZE_CALCULATION_AND_NAME_DISPLAYING);

      setPreviousWindowInnerWidth(window.innerWidth);
    }
  };

  useEffect(() => {
    updateNameDisplayingConfigs();
  }, [fontSize]);

  const updateNameDisplayingConfigs = () => {
    setDisplayName(false);

    if (parentReferenceForFontResizing?.current && displayedNameRef.current) {
      const ensLabelElmHeight =
        parentReferenceForFontResizing?.current?.getBoundingClientRect().height;
      const ensLabelElmWidth =
        parentReferenceForFontResizing?.current?.getBoundingClientRect().width;
      const ensLabelElmScrollWidth =
        parentReferenceForFontResizing?.current?.scrollWidth;

      const copyDoesntFitParentMaxWidth =
        Math.round(ensLabelElmScrollWidth) > Math.round(ensLabelElmWidth);

      const linesOfContent = getNumberOfLinesNameUses();

      if (
        ((linesOfContent &&
          linesOfContent >= linesToFitDisplayedName &&
          linesOfContent !== 1) ||
          copyDoesntFitParentMaxWidth ||
          !ensLabelElmHeight) &&
        fontSize > minFontSize
      ) {
        setFontSize(fontSize - 1);
        setFontSizeIsCalculated(false);
      } else {
        setFontSizeIsCalculated(true);
      }
    } else {
      setNameClamping();
    }
  };

  if (domainName === null) return <div className={skeletonClasses} />;

  const appendedRootName = () => {
    return getNameLabels(domainName.displayName).rootName.map((label) => {
      return <>.{label}</>;
    });
  };

  const displayableName = (
    <div ref={displayedNameRef} className={FontLineHeight[125].tailwindClass}>
      <div
        className={cc([
          "w-full inline break-all max-w-full",
          {
            /*
              Understand 'shouldCalculateBeforeDisplay' being true as:
              1. We are trying to fit the displayed name based on its
                parent width, calculating then the best font-size fit

              AND

              Understand 'shouldCalculateBeforeDisplay' being false as:
              2. We are not calculating the displayed name font-size based on
                its parent width, instead, we are using the fontConfigClasses
                configured font-size to instantly display DisplayedName comp.
            */
            "text-transparent pointer-events-none":
              (shouldCalculateBeforeDisplay &&
                (shouldClampName === null || !displayName)) ||
              !shouldCalculateBeforeDisplay,
            "absolute z-[-1] opacity-0 left-0 invisible":
              (shouldCalculateBeforeDisplay &&
                displayName &&
                shouldClampName !== null) ||
              !shouldCalculateBeforeDisplay,
          },
        ])}
      >
        <p
          className={cc([
            "inline",
            getLineClampClasses(lineClampCount),
            {
              /*
                In order to get the line-clamp to work, we need to set the
                display to -webkit-box, otherwise, line-clamp won't have effect.
                But, in case line-clamp should not be applied, we need to set
                display to inline in order to have ENS name and TLD aligned.
              */
              "!display-box": shouldClampName,
            },
          ])}
        >
          {getNameLabels(domainName.displayName).firstLabel}
          <span
            className={cc([
              "whitespace-nowrap inline",
              { hidden: shouldClampName },
            ])}
          >
            {appendedRootName()}
          </span>
        </p>
      </div>
      <div
        className={cc([
          "w-full break-all max-w-full",
          {
            "inline opacity-100 transition-opacity":
              (shouldCalculateBeforeDisplay &&
                shouldClampName !== null &&
                displayName) ||
              !shouldCalculateBeforeDisplay,
            "absolute z-[-1] opacity-0":
              shouldCalculateBeforeDisplay &&
              (!displayName || shouldClampName === null),
          },
        ])}
      >
        <p
          className={cc([
            "inline",
            getLineClampClasses(lineClampCount),
            {
              /*
                In order to get the line-clamp to work, we need to set the
                display to -webkit-box, otherwise, line-clamp won't have effect.
                But, in case line-clamp should not be applied, we need to set
                display to inline in order to have ENS name and TLD aligned.
              */
              "!display-box": shouldClampName,
            },
          ])}
        >
          {domainName && getNameLabels(domainName.displayName).firstLabel}
          {domainName && (
            <span
              className={cc([
                "whitespace-nowrap inline",
                { hidden: shouldClampName },
              ])}
            >
              {appendedRootName()}
            </span>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div data-testid="domain-name" className="ens-webfont w-full">
      {/*
        Launch Readiness Removal: NFT Details Page is not ready!

          {isClickableLink ? (
            <Link
              style={{
                fontSize: shouldCalculateBeforeDisplay ? fontSize : "",
              }}
              className={cc([
                "w-full break-all",
                {
                  "text-red-800":
                    (!domainName.normalizedName &&
                      domainCard &&
                      domainCard?.nameGuardResult.normalization !==
                        Normalization.Normalized) ||
                    (!domainName.normalizedName && domainCard === null),
                },
                fontConfigClasses,
              ])}
              href={`/name/${domainName.slug}`}
            >
              {displayableName}
            </Link>
          ) : (
      */}
      <div
        className={cc([
          "w-full break-all inline",
          {
            "text-red-800":
              (domainName.normalization !== Normalization.Normalized &&
                domainCard) ||
              (domainName.normalization !== Normalization.Normalized &&
                domainCard === null),
          },
          fontConfigClasses,
        ])}
        style={{
          fontSize: shouldCalculateBeforeDisplay ? fontSize : "",
        }}
      >
        {displayableName}
      </div>
      {/* )} */}
    </div>
  );
};

const getLinesOfInterfaceTextContent = (
  ref: HTMLDivElement,
  lineHeightScaleFactor: number,
): number | null => {
  /*
    Window object must be available for us to
    consult the computed dimensions of the element
  */
  if (!window) return null;

  const ensLabelElmHeight = ref.getBoundingClientRect().height;
  const ensLabelFontLineHeight = Math.round(
    Number(
      window
        .getComputedStyle(ref)
        .getPropertyValue("line-height")
        ?.split("px")[0],
    ) * lineHeightScaleFactor,
  );

  return Math.ceil(ensLabelElmHeight / ensLabelFontLineHeight);
};

const getLineClampClasses = (lineClampCount: LineClampCount) => {
  switch (lineClampCount) {
    case LineClampCount.One:
      return "line-clamp-1 break-all";
    case LineClampCount.Two:
      return "line-clamp-2 break-all";
    case LineClampCount.Three:
      return "line-clamp-3 break-all";
    case LineClampCount.Four:
      return "line-clamp-4 break-all";
  }
};
