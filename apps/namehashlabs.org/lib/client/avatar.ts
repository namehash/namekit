type QueryParams = {
  avatarQueries: AvatarQueryModel[];
  logLevel?: LogLevel;
};

export type AvatarQueryModel = () => Promise<Response | null>;

export enum LogLevel {
  INFO = "info",
  ERROR = "error",
  INFO_AND_ERROR = "info_and_error",
}
export const getDynamicENSAvatarCallback = async (ensName: string) => {
  return fetch(`https://metadata.ens.domains/mainnet/avatar/${ensName}`)
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        throw new Error(`Failed to fetch ENS avatar for ${ensName}`);
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const queryMultipleEndpointsToGetAvatar = async ({
  avatarQueries,
  logLevel,
}: QueryParams): Promise<Response | null> => {
  let queryCallbackIndex = 0;
  let successfulQueryRes: Response | null = null;
  while (
    successfulQueryRes === null &&
    queryCallbackIndex < avatarQueries.length
  ) {
    if (logLevel === LogLevel.INFO || logLevel === LogLevel.INFO_AND_ERROR) {
      console.log("Fetching ", avatarQueries[queryCallbackIndex]);
    }

    try {
      successfulQueryRes = await avatarQueries[queryCallbackIndex]();
    } catch (error) {
      if (logLevel === LogLevel.ERROR || logLevel === LogLevel.INFO_AND_ERROR) {
        console.error(
          "Failed to query ",
          avatarQueries[queryCallbackIndex],
          ", trying next one"
        );
      }
    }

    queryCallbackIndex++;
  }

  if (successfulQueryRes) {
    if (logLevel === LogLevel.INFO || logLevel === LogLevel.INFO_AND_ERROR) {
      console.log(
        "Successfully queried ",
        avatarQueries[queryCallbackIndex],
        ", response: ",
        successfulQueryRes
      );
    }
  } else {
    if (logLevel === LogLevel.INFO || logLevel === LogLevel.INFO_AND_ERROR) {
      console.error("Failed to query all of the provided avatar endpoints");
    }
  }

  return successfulQueryRes;
};
