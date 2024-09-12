import { ENSName } from "@namehash/ens-utils";

export type ReportURLGenerator = (name: ENSName) => URL;

export function defaultReportURLGenerator(ensName: ENSName): URL {
  return new URL(
    `https://nameguard.io/inspect/${encodeURIComponent(ensName.name)}`,
  );
}

export function getReportURL(name: ENSName, generator?: ReportURLGenerator): URL {
  if (generator) {
    return generator(name);
  } else {
    return defaultReportURLGenerator(name);
  }
}

export function redirectToReport(ensName: ENSName, generator?: ReportURLGenerator) {
  window.location.href = getReportURL(ensName, generator).href;
}
