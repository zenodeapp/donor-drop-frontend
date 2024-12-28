import React, { useState } from "react";
import { useDonation } from "../../../context/DonationProvider";
import { useTheme } from "../../../context/ThemeProvider";
import styles from "../../../styles/donation-message.module.scss"; // Import the CSS module
import { useNotification } from "../../../context/NotificationProvider";
import { IoMdWarning } from "react-icons/io";

// A simple profanity filter (you can replace this with a library like "bad-words")
const profanityFilter = (message: string) => {
  const profanityList = ["badword1", "badword2", "badword3"]; // Add more words as needed
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
  const { isConnected, setShowApp } = useTheme();
  const { notify } = useNotification();

  const handleSubmit = async () => {
    if (isConnected) {
      setSending(1);
      if (message.trim().length > 200) {
        notify({
          type: "error",
          message: "Message exceeds 200 characters.",
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
      setShowApp(false);
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        id='donationMessage'
        value={message}
        maxLength={200}
        placeholder='Write your message here (max 200 characters)'
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
