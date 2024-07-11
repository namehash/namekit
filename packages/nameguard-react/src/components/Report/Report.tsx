import React, { Fragment, useMemo } from "react";
import useSWR from "swr";
import { type NameGuardReport, nameguard, Rating } from "@namehash/nameguard";
import { parseName } from "@namehash/ens-utils";
import { Toaster } from "sonner";

import { type Settings } from "../../stores/settings";
import {
  type ChatModalState,
  useChatModalStore as defaultUseChatModalStore,
} from "../../stores/chat";
import { FeedbackNotice } from "./FeedbackNotice";
import { ReportFooter } from "./ReportFooter";
import { ChatModal } from "../ChatModal/ChatModal";
import { GraphemeModal } from "../GraphemeModal/GraphemeModal";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { SearchEmptyState } from "../Search/SearchEmptyState";
import { ReportHeader } from "./ReportHeader";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Banner } from "./Banner";
import { CheckResultCard } from "./CheckResultCard";
import { LabelList } from "./LabelList";
import { useGraphemeModalStore } from "../../stores/grapheme";
import { ReportError } from "./ReportError";
import { ExternalLinks } from "../ExternalLinks/ExternalLinks";
import { Share } from "../Share/Share";
import { ratingTextColor } from "../../utils/text";

type ReportProps = {
  data?: NameGuardReport;
  name?: string;
  settings?: Settings;
  useChatModalStore?: () => ChatModalState;
};

export const Report = ({
  data: fallbackData,
  name,
  settings,
  useChatModalStore,
}: ReportProps) => {
  const store = useChatModalStore
    ? useChatModalStore()
    : defaultUseChatModalStore();

  const { isChatModalOpen, openChatModal, closeChatModal } = store;
  const { isGraphemeModalOpen, closeAllGraphemeModals } =
    useGraphemeModalStore();

  const outsideChatClickRef = useOutsideClick(
    store.closeChatModal,
    store.isChatModalOpen,
  );
  const outsideGraphemeClickRef = useOutsideClick(
    closeAllGraphemeModals,
    isGraphemeModalOpen,
  );

  const parsedName = useMemo(() => {
    return parseName(name, settings);
  }, [name, settings]);

  const normalizationUnknown =
    parsedName.outputName.normalization === "unknown" ?? true;

  const showEmptyState = parsedName.outputName.name.length === 0 ?? true;

  const {
    data,
    error: hadLoadingError,
    isLoading,
  } = useSWR<NameGuardReport>(
    fallbackData ? null : parsedName.outputName.name,
    (n: string) => nameguard.inspectName(n),
    {
      fallbackData,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const externalLinks = [
    {
      text: "ENS.domains",
      href: `https://app.ens.domains/${parsedName.outputName.name}`,
    },
    {
      text: "raffy.eth's resolver",
      href: `https://adraffy.github.io/ens-normalize.js/test/resolver.html#${parsedName.outputName.name}`,
    },
    {
      text: "ENS tools",
      href: `https://tools.ens.domains/check/${parsedName.outputName.name}`,
    },
    {
      text: "Etherscan",
      href: `https://etherscan.io/name-lookup-search?id=${parsedName.outputName.name}`,
    },
  ];

  if (showEmptyState)
    return (
      <Fragment>
        <ChatModal
          open={isChatModalOpen}
          onClose={closeChatModal}
          ref={outsideChatClickRef}
        />
        <SearchEmptyState />
      </Fragment>
    );

  return (
    <Fragment>
      <div className="ng-space-y-8 ng-w-full ng-z-30">
        <div className="md:ng-flex md:ng-justify-between ng-relative">
          <ReportHeader />
          <div className="ng-flex-shrink-0 ng-flex ng-items-start ng-space-x-1 ng-absolute md:ng-relative ng-right-0 md:ng-right-auto ng--top-1 md:ng-top-auto">
            <Share name={data?.name} />
            <ExternalLinks title="View name in" links={externalLinks} />
          </div>
        </div>

        {isLoading && !hadLoadingError && normalizationUnknown && (
          <LoadingSkeleton parsedName={parsedName} />
        )}
        {isLoading && !hadLoadingError && !normalizationUnknown && (
          <LoadingSkeleton parsedName={parsedName} />
        )}

        {hadLoadingError && <ReportError />}

        {data && (
          <Fragment>
            <Banner parsedName={parsedName} report={data} />
            <div className="ng-space-y-4 md:ng-space-y-5">
              <p className="ng-text-black ng-font-semibold ng-text-lg ng-leading-6">
                {data?.risk_count} of {data?.checks.length} risks found
              </p>

              <div className="ng-grid md:ng-grid-cols-2 ng-gap-4">
                {data?.checks.map((check, index) => (
                  <CheckResultCard key={index} {...check} />
                ))}
              </div>
            </div>
            <div className="ng-space-y-4 md:ng-space-y-5">
              <p className="ng-text-black ng-font-semibold ng-text-lg ng-leading-6">
                Name inspection
              </p>

              <LabelList items={data.labels} />
            </div>

            <FeedbackNotice onChatClick={openChatModal} />
            <ReportFooter />
          </Fragment>
        )}
      </div>

      <ChatModal
        open={isChatModalOpen}
        onClose={closeChatModal}
        ref={outsideChatClickRef}
      />
      <GraphemeModal ref={outsideGraphemeClickRef} />
      <Toaster
        closeButton
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast:
              "!ng-bg-black !ng-border-black !ng-relative !ng-text-sm !ng-leading-5 !ng-font-medium !ng-px-5",
            title: "!ng-text-white",
            success: `!ng-fill-current !${ratingTextColor(Rating.pass)}`,
            closeButton: "!ng-hidden",
          },
        }}
      />
    </Fragment>
  );
};
