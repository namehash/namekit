"use client";

import React, { createContext, useContext, useState } from "react";

type ChatContextType = {
  chatOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatModal = (): ChatContextType => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatModalProvider");
  }

  return context;
};

export const ChatModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chatOpen, setChatOpen] = useState(false);

  const openModal = () => setChatOpen(true);
  const closeModal = () => setChatOpen(false);

  return (
    <ChatContext.Provider value={{ chatOpen, openModal, closeModal }}>
      {children}
    </ChatContext.Provider>
  );
};
