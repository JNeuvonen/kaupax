import { useAuth } from "@/context/auth";
import { getTimeElapsed } from "@/utils/functions";
import { Apartment, Message } from "@/utils/types/apartment";
import styles from "./messages.module.css";
import styleUtils from "@/styles/utils.module.css";
import { SendIcon } from "@/utils/icons";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { postReq } from "@/services/util";
import { addMessageToListing } from "@/services/endpoints";
import { useToast } from "@/context/toast";

interface Props {
  apartment: Apartment;
  setNewTabItems: (newTabItems: Apartment) => void;
}

export default function Messages({ apartment, setNewTabItems }: Props) {
  const accessToken = useAuth().accessToken;
  const user = useAuth().user;
  const userBid = apartment.Bid.find((bid) => bid.realtorId === user?.id);
  const [messages, setMessages] = useState(userBid?.Message as Message[]);
  const messagesRef = useRef((userBid?.Message as Message[]) || []);
  const [inputFocused, setInputFocused] = useState(false);
  const inputFocusedRef = useRef(false);
  const [userInput, setUserInput] = useState("");
  const userInputRef = useRef("");
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const toast = useToast();

  function sendMessage() {
    const bid = apartment.Bid.find((bid) => bid.realtorId === user?.id);
    if (bid && user) {
      if (!userInputRef.current) return null;
      const newMessage = {
        content: userInputRef.current,
        realtorId: user.id,
        createdAt: new Date(),
        id: Math.random() * Number.MAX_SAFE_INTEGER,
      };
      setMessages([...messagesRef.current, newMessage]);
      messagesRef.current = [...messagesRef.current, newMessage];
      bid.Message = [...bid.Message, newMessage];

      setNewTabItems(apartment);
      const promise = postReq({
        token: accessToken as string,
        url: addMessageToListing(bid.id),
        payload: {
          messageData: {
            content: userInputRef.current,
            realtorId: user.id,
          },
        },
      });

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

  const renderListerMessage = (messageContent: string, date: Date) => {
    const dateFmt = new Date(date);
    const timeElapsed = getTimeElapsed(dateFmt);
    return (
      <div className={styles.listerMessageContainer}>
        <div className={styles.listerMessage}>
          <span className={styles.message}>{messageContent}</span>
          <div>
            <span className={styleUtils.paragraph}>{timeElapsed}</span>
          </div>
        </div>
      </div>
    );
  };

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

  if (!userBid) {
    return (
      <div className={styles.container}>
        Et voi lähettää viestiä ennen kuin olet tehnyt tarjouksen kohteeseen.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div>
        {renderUserMessage(
          userBid?.message as string,
          userBid?.createdAt as Date
        )}
      </div>
      <div>
        {messages?.map((item) => {
          if (!item.realtorId) {
            return (
              <Fragment key={item.id}>
                {renderListerMessage(item.content as string, item.createdAt)}
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
          value={userInput}
          id={"message-input"}
          onFocus={initialFocus}
          onChange={(e) => {
            setUserInput(e.target.value);
            userInputRef.current = e.target.value;
          }}
        />
        <div style={{ cursor: "pointer" }} onClick={sendMessage}>
          <SendIcon fill={"black"} width={"25px"} />
        </div>
      </div>
    </div>
  );
}
