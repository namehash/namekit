import { useState, createContext } from "react";
import { useCookies } from "react-cookie";

export const PREFERRED_SUFIX_KEY = "PREFERRED_SUFIX";

export const Sufixes = {
  ETH: ".eth",
  BOX: ".box",
} as const;

export type Sufixes = (typeof Sufixes)[keyof typeof Sufixes];

export const DEFAULT_SUFIX = Sufixes.ETH;

export const PreferredSufixContext = createContext({
  preferredSufix: DEFAULT_SUFIX as Sufixes,
  updatePreferredSufix: (_: Sufixes) => {},
});

export const PreferredSufixProvider = ({ children }: any) => {
  const [cookies, setCookie] = useCookies([PREFERRED_SUFIX_KEY]);

  const updatePreferredSufix = (sufix: Sufixes) => {
    setCookie(PREFERRED_SUFIX_KEY, sufix, { path: "/" });
    setPreferredSufix({
      ...preferredSufix,
      preferredSufix: sufix,
    });
  };

  const [preferredSufix, setPreferredSufix] = useState({
    preferredSufix: cookies[PREFERRED_SUFIX_KEY]
      ? (cookies[PREFERRED_SUFIX_KEY] as Sufixes)
      : DEFAULT_SUFIX,
    updatePreferredSufix: updatePreferredSufix,
  });

  return (
    <PreferredSufixContext.Provider value={preferredSufix}>
      {children}
    </PreferredSufixContext.Provider>
  );
};
