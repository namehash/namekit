import { Balancer } from "react-wrap-balancer";
import { SectionText } from "../1 - atoms";
import cc from "classcat";
import { Button, Link } from "@namehash/namekit-react";
import { CalendarButton } from "@namehash/internal";

export interface ENSReferralProductProps {
  title: string;
  subtitle: string;
  illustration: React.ReactElement;
  gradient?: React.ReactElement;
  isInverted?: boolean;
  buttonUrl?: string;
  greenLabelText?: string;
  buttonText?: string;
  calendarButtonText?: string;
  showCalendarButton?: boolean;
}

export const ENSReferralProductComponent = ({
  title,
  subtitle,
  illustration,
  gradient,
  isInverted,
  buttonUrl,
  greenLabelText,
  buttonText = "Join the discussion",
  calendarButtonText = "Learn more",
  showCalendarButton = true,
}: ENSReferralProductProps) => {
  return (
    <section
      className={cc([
        "lg:py-5 pt-10 pb-5 w-full flex items-center justify-between",
      ])}
    >
      <div
        className={cc([
          "w-full flex flex-col-reverse gap-5 lg:flex-row items-center",
          {
            "lg:flex-row-reverse": isInverted,
          },
        ])}
      >
        <div className="lg:w-1/2  w-full flex items-start justify-center lg:justify-start">
          <div className="flex-col inline-flex gap-5 lg:max-w-[540px]">
            {greenLabelText && (
              <div className="flex items-center justify-center lg:justify-start">
                <div
                  className="px-4 py-2 bg-green-100 border border-green-100 rounded-full"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <p className="text-sm leading-[18px] font-medium text-green-800 font-variant-normal">
                    {greenLabelText}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-start">
              <h2 className="text-2xl  whitespace-normal  leading-8 lg:text-[48px] lg:leading-10 font-bold lg:text-start text-center">
                {title}
              </h2>
            </div>
            <SectionText className="lg:text-start text-center w-full text-lg leading-7 font-light">
              <Balancer>{subtitle}</Balancer>
            </SectionText>

            <div className="flex w-full md:w-auto gap-3 items-center lg:flex-row flex-col">
              {buttonUrl && (
                <div className="flex justify-center lg:justify-start w-full md:w-auto">
                  <Button
                    className="w-auto items-center justify-center"
                    asChild
                  >
                    <Link href={buttonUrl}>
                      {buttonText} <Link.ExternalIcon />
                    </Link>
                  </Button>
                </div>
              )}

              {showCalendarButton && (
                <CalendarButton
                  variant="ghost"
                  link="namehashlabs/namehashlabs"
                  className="md:w-auto w-full"
                >
                  {calendarButtonText}
                </CalendarButton>
              )}
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 w-full mt-0 relative flex items-center justify-center">
          {gradient}
          {illustration}
        </div>
      </div>
    </section>
  );
};
