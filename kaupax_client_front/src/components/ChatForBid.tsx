import { getTimeElapsed } from "@/utils/functions";
import { Bid, Message } from "@/utils/types/listing";
import styleUtils from "@/styles/utils.module.css";
import styles from "./ChatForBid.module.css";
import { useState, useRef, Fragment, useCallback, useEffect } from "react";
import { SendIcon } from "@/utils/icons";
import { postReq } from "@/services/util";
import { addMessageToListing } from "@/utils/endpoints";
import { useAuth } from "@/context/auth";
import { useToast } from "@/context/toast";

interface Props {
  bid: Bid;
  refetchListing: () => void;
}

export default function ChatForBid({ bid, refetchListing }: Props) {
  const accessToken = useAuth().accessToken;
  const user = useAuth().user;
  const [messages, setMessages] = useState(bid?.Message as Message[]);
  const messagesRef = useRef((bid?.Message as Message[]) || []);
  const [inputFocused, setInputFocused] = useState(false);
  const inputFocusedRef = useRef(false);
  const [userInput, setUserInput] = useState("");
  const userInputRef = useRef("");
  const toast = useToast();
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  function sendMessage() {
    if (bid && user) {
      if (!userInputRef.current) return null;
      const newMessage = {
        content: userInputRef.current,
        clientId: user.id,
        createdAt: new Date(),
        id: Math.random() * Number.MAX_SAFE_INTEGER,
      };
      setMessages([...messagesRef.current, newMessage]);
      messagesRef.current = [...messagesRef.current, newMessage];
      const promise = postReq({
        token: accessToken as string,
        url: addMessageToListing(bid.id),
        payload: {
          messageData: {
            content: userInputRef.current,
            clientId: user.id,
          },
        },
      });

      refetchListing();

      promise.then((data) => {
        if (data.status !== 200) {
          bid.Message.pop();
          toast.toastProps.openToast({
            message: `Viestin lähettäminen epäonnistui`,
            severity: "success",
          });
        }
      });
      setUserInput("");
      userInputRef.current = "";
      forceUpdate();
    }
  }

  const renderRealtorMessage = (messageContent: string, date: Date) => {
    const dateFmt = new Date(date);
    const timeElapsed = getTimeElapsed(dateFmt);
    return (
      <div className={styles.realtorMessageContainer}>
        <div className={styles.realtorMessage}>
          <span className={styles.message}>{messageContent}</span>
          <div>
            <span className={styleUtils.paragraph}>{timeElapsed}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderUserMessage = (messageContent: string, date: Date) => {
    if (!messageContent) return null;
    const dateFmt = new Date(date);
    const timeElapsed = getTimeElapsed(dateFmt);

    return (
      <div className={styles.userMessageContainer}>
        <div className={styles.userMessage}>
          <span className={styles.message}>{messageContent}</span>
          <div>
            <span className={styleUtils.paragraph}>{timeElapsed}</span>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Enter" && inputFocusedRef.current) {
        sendMessage();
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function initialFocus() {
    if (!inputFocused) {
      setInputFocused(true);
      const messageInput = document.getElementById(
        "message-input"
      ) as HTMLInputElement;

      if (!messageInput) return;

      messageInput.value = "";
    }
    inputFocusedRef.current = true;
  }

  return (
    <div>
      <div>
        {renderRealtorMessage(bid?.message as string, bid?.createdAt as Date)}
      </div>
      <div>
        {messages?.map((item) => {
          if (!item.clientId) {
            return (
              <Fragment key={item.id}>
                {renderRealtorMessage(item.content as string, item.createdAt)}
              </Fragment>
            );
          }
          return (
            <Fragment key={item.id}>
              {renderUserMessage(item.content as string, item.createdAt)}
            </Fragment>
          );
        })}
      </div>
      <div className={styles.inputWrapper} style={{ marginTop: 32 }}>
        <input
          className={styles.sendMessageInput}
          value={inputFocused ? userInput : "Kirjoita viesti..."}
          id={"message-input"}
          onFocus={initialFocus}
          onChange={(e) => {
            setUserInput(e.target.value);
            userInputRef.current = e.target.value;
          }}
          onBlur={() => {
            if (inputFocusedRef.current) {
              inputFocusedRef.current = false;
              setInputFocused(false);
            }
          }}
        />
        <div style={{ cursor: "pointer" }} onClick={sendMessage}>
          <SendIcon fill={"black"} width={"25px"} />
        </div>
      </div>
    </div>
  );
}
