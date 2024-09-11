import { ENSName } from "@namehash/ens-utils";
import { redirectToViewNameReportURL } from "./url";

export type OpenReportHandler = (name: ENSName) => void;

export function defaultOpenReportHandler(name: ENSName) {
  redirectToViewNameReportURL(name);
}

export function openReport(name: ENSName, handler?: OpenReportHandler) {
  if (handler) {
    handler(name);
  } else {
    defaultOpenReportHandler(name);
  }
}
