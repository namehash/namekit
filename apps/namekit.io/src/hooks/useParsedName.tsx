import { strHasMinENSnameLength } from "../lib/shared/registration-utils";
import { type DomainName, parseName } from "../lib/shared/parse-name";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useUrlParsedName = () => {
  const router = useRouter();
  const [parsedName, setUrlParsedName] = useState<DomainName>();

  /*
    Manually update parsed name when user look for [labelhash..].eth name format,
    but API returns the real name.
  */
  const updateParsedName = (name: DomainName) => {
    if (router.query.name !== name.slug) {
      setUrlParsedName(name);
      router.replace({
        query: { ...router.query, name: name.slug },
      });
    }
  };

  useEffect(() => {
    const healUrl = () => {
      if (router.query.name && typeof router.query.name === "string") {
        if (!strHasMinENSnameLength(router.query.name)) return;

        try {
          const queryParsedName = parseName(router.query.name as string);
          if (router.query.name !== queryParsedName.slug) {
            router.replace({
              query: { ...router.query, name: queryParsedName.slug },
            });
          }
          return queryParsedName;
        } catch (e) {
          console.error(e);
          router.push("/404");
        }
      }
    };
    const parsedName = healUrl();
    setUrlParsedName(parsedName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.name]);

  return { parsedName, updateParsedName };
};
