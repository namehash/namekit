import React from "react";
import { CheckResultCode } from "@namehash/nameguard";

import PassShieldDesktop from "./PassShieldDesktop";
import WarnShieldDesktop from "./WarnShieldDesktop";
import AlertShieldDesktop from "./AlertShieldDesktop";

interface Props {
  status: CheckResultCode;
}

const Shield = ({ status }: Props) => {
  switch (status) {
    case "alert": {
      return <AlertShieldDesktop />;
    }
    case "pass": {
      return <PassShieldDesktop />;
    }
    case "warn": {
      return <WarnShieldDesktop />;
    }
    default: {
      return null;
    }
  }
};

export default Shield;
