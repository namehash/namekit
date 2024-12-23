/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import lodash from "lodash";
import cc from "classcat";

interface ArrowNavigationBarProps {
  centerID?: string;
  skeletonMarkup: JSX.Element;
  barContentMarkup: JSX.Element;
}

enum ScrollDirection {
  LEFT,
  RIGHT,
}

interface ShowNavButtons {
  left: boolean;
  right: boolean;
}

/*
  Below number represents X in the following logic: Once
  user clicks some navigation arrow, we scroll the bar Y pixels
  - X pixels to the right or left. We always scroll a bit less than
  the full width of the scroller element. This results in users
  seeing a part of the navigation bar that was already being
  seen before. This is a good UX practice to avoid users
  getting lost when seeing the new visible content 👨🏼‍💻
*/
const VISIBLE_SCROLLER_WIDTH_AFTER_NAVIGATOR_CLICK = 75;

/*
  After the user uses navigation buttons to scroll
  the 'barContentMarkup' scroller, we need to wait a while
  so the DOM updates its properties. Later, we calculate
  if we need to display the navigation buttons or not.
*/
const DELAY_FOR_DOM_PROPERTY_UPDATE = 2000;

export const ArrowNavigationBar = ({
  centerID,
  skeletonMarkup,
  barContentMarkup,
}: ArrowNavigationBarProps) => {
  const navigationBarWrapper = useRef<HTMLDivElement | undefined>(undefined);

  const [showNavButtons, setShowNavButtons] = useState<
    ShowNavButtons | undefined
  >(undefined);

  useEffect(() => {
    setDisplayOfInfiniteShadowsAndNavigationButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationBarWrapper]);

  useEffect(() => {
    if (window) {
      window.addEventListener(
        "resize",
        lodash.debounce(setDisplayOfInfiniteShadowsAndNavigationButtons, 100),
      );
    }

    const instantSearchWrapper = document.getElementById("scrollable-elm");

    if (instantSearchWrapper) {
      instantSearchWrapper.addEventListener(
        "scroll",
        lodash.debounce(setDisplayOfInfiniteShadowsAndNavigationButtons, 100),
      );
    }

    if (navigationBarWrapper.current) {
      navigationBarWrapper.current.addEventListener(
        "scroll",
        lodash.debounce(setDisplayOfInfiniteShadowsAndNavigationButtons, 100),
      );
    }

    return () => {
      window.removeEventListener(
        "resize",
        lodash.debounce(setDisplayOfInfiniteShadowsAndNavigationButtons, 100),
      );

      instantSearchWrapper?.removeEventListener(
        "scroll",
        lodash.debounce(setDisplayOfInfiniteShadowsAndNavigationButtons, 100),
      );

      navigationBarWrapper.current?.removeEventListener(
        "scroll",
        lodash.debounce(setDisplayOfInfiniteShadowsAndNavigationButtons, 100),
      );
    };
  }, []);

  const scrollQuickJumpScrollerTo = (scrollDirection: ScrollDirection) => {
    if (navigationBarWrapper.current) {
      const amountToScroll =
        navigationBarWrapper.current.clientWidth -
        VISIBLE_SCROLLER_WIDTH_AFTER_NAVIGATOR_CLICK;

      navigationBarWrapper.current.scroll({
        behavior: "smooth",
        left:
          scrollDirection === ScrollDirection.LEFT
            ? navigationBarWrapper.current.scrollLeft - amountToScroll
            : navigationBarWrapper.current.scrollLeft + amountToScroll,
      });

      setTimeout(
        setDisplayOfInfiniteShadowsAndNavigationButtons,
        DELAY_FOR_DOM_PROPERTY_UPDATE,
      );
    }
  };

  const setDisplayOfInfiniteShadowsAndNavigationButtons = () => {
    let showLeft, showRight;

    if (navigationBarWrapper.current) {
      const needsNavigationArrows =
        navigationBarWrapper.current?.scrollWidth >
        navigationBarWrapper.current?.clientWidth;

      const userScrolledToRight =
        navigationBarWrapper.current?.scrollLeft > 0 && needsNavigationArrows;
      showLeft = userScrolledToRight;
      const scrolledToTheFartest =
        Math.floor(
          navigationBarWrapper.current?.scrollLeft +
            navigationBarWrapper.current?.clientWidth,
        ) === Math.floor(navigationBarWrapper.current?.scrollWidth);

      showRight = !scrolledToTheFartest && needsNavigationArrows;

      setShowNavButtons({
        left: showLeft,
        right: showRight,
      });
    }
  };

  useEffect(() => {
    if (centerID) {
      const centerElement = document.querySelector(
        '[data-navigation-item="' + centerID + '"]',
      ) as HTMLElement;

      if (centerElement && navigationBarWrapper.current) {
        navigationBarWrapper.current.scrollTo({
          behavior: "smooth",
          left: centerElement.offsetLeft - 80,
        });

        setTimeout(
          setDisplayOfInfiniteShadowsAndNavigationButtons,
          DELAY_FOR_DOM_PROPERTY_UPDATE,
        );
      }
    }
  }, [centerID]);

  return (
    <div
      className={`relative flex ${showNavButtons !== undefined ? "space-x-1 z-20" : null}`}
    >
      <div
        className={cc([
          "z-20 opacity-0 transition",
          {
            "!opacity-100": showNavButtons?.left,
          },
        ])}
      >
        <div className="pointer-events-none flex items-center absolute top-0 w-20 h-full z-20 rotate-180 transform bg-gradient-white-to-transparent transition"></div>
        <button
          className="border-transparent border-2 -mt-0.5 hover:border-gray-200 hover:bg-gray-100 rounded-full p-1.5 opacity-100 transition absolute top-1 z-30"
          onClick={() => scrollQuickJumpScrollerTo(ScrollDirection.LEFT)}
        >
          <ChevronLeftIcon className="w-4 h-4 text-black font-black" />
        </button>
      </div>
      <div
        ref={navigationBarWrapper}
        className="z-10 w-full scrollbar-hide overflow-x-scroll"
      >
        {/*
          'showNavButtons' 'left' or 'right' properties are updated
          based on 'navigationBarWrapper' HTML DOM element. Once quick jump
          pills are loaded we put the 'barContentMarkup' invisibly into the
          DOM in order to calculate the need of displaying navigation buttons
          or not, based on the width the 'barContentMarkup' used. While we are
          doings these calcs, 'skeletonMarkup' is visible in the Ui. Once we have
          this state calculated, we display the scroller with out without nav
          arrows. Later, only the action of scrolling, which is user
          triggered, will make changes to 'showNavButtons'.
        */}
        {showNavButtons === undefined && skeletonMarkup}
        {
          <div
            className={`${showNavButtons === undefined ? "opacity-0" : null}`}
          >
            {barContentMarkup}
          </div>
        }
      </div>
      <div
        className={cc([
          "z-20 opacity-0 transition",
          {
            "!opacity-100": showNavButtons?.right,
          },
        ])}
      >
        <div className="pointer-events-none flex items-center absolute right-0 top-0 w-20 h-full z-20 bg-gradient-white-to-transparent transition"></div>
        <button
          onClick={() => scrollQuickJumpScrollerTo(ScrollDirection.RIGHT)}
          className="border-transparent border-2 -mt-0.5 hover:border-gray-200 hover:bg-gray-100 rounded-full p-1.5 opacity-100 transition absolute right-0 top-1 z-30"
        >
          <ChevronRightIcon className="w-4 h-4 text-black font-black" />
        </button>
      </div>
    </div>
  );
};
