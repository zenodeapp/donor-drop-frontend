import React, { useState } from "react";
import { useDonation } from "../../../context/DonationProvider";
import { useTheme } from "../../../context/ThemeProvider";
import styles from "../../../styles/donation-message.module.scss";
import { useNotification } from "../../../context/NotificationProvider";
import { IoMdWarning } from "react-icons/io";

// TODO: profanity filter
const profanityFilter = (message: string) => {
  const profanityList = ["badword1", "badword2", "badword3"];
  const regex = new RegExp(profanityList.join("|"), "gi");
  return message.replace(regex, "[censored]");
};

const DonationMessage = ({
  setSending,
}: {
  setSending: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useDonation();
  const { isConnected, smoothShowApp } = useTheme();
  const { notify } = useNotification();

  const handleSubmit = async () => {
    if (isConnected) {
      setSending(1);
      if (message.trim().length > 100) {
        notify({
          type: "error",
          message: "Message exceeds 100 characters.",
          options: {
            id: "message",
            Icon: IoMdWarning,
            duration: 5000,
          },
        });
        return;
      }
      if (message.trim().length === 0) {
        notify({
          type: "error",
          message: "Message cannot be empty.",
          options: {
            id: "message",
            Icon: IoMdWarning,
            duration: 5000,
          },
        });
        return;
      }

      const sanitizedMessage = profanityFilter(message);
      const result = await sendMessage(sanitizedMessage);
      if (result) {
        setMessage("");
        setSending(3);
      } else {
        setSending(2);
      }
    } else {
      smoothShowApp(false);
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        id='donationMessage'
        value={message}
        maxLength={100}
        placeholder='Write your message here (max. 100 characters)'
        onChange={(e) => setMessage(e.target.value)}
        className={styles.textarea}
      ></textarea>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleSubmit}
          className={`${styles.button} ${
            isConnected && !message && styles.disabled
          }`}
          disabled={isConnected && !message}
        >
          {isConnected ? "Sign and Send" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default DonationMessage;
