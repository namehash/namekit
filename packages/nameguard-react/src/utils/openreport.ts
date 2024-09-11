import { ENSName } from "@namehash/ens-utils";
import { redirectToReport, ReportURLGenerator } from "./url";

export type OpenReportHandler = (name: ENSName, generator?: ReportURLGenerator) => void;

export function defaultOpenReportHandler(name: ENSName, generator?: ReportURLGenerator): void {
  redirectToReport(name, generator);
}

export function openReport(name: ENSName, handler?: OpenReportHandler, generator?: ReportURLGenerator): void {
  if (handler) {
    handler(name, generator);
  } else {
    defaultOpenReportHandler(name, generator);
  }
}
