import React, { useState } from "react";
import { useDonation } from "../../../context/DonationProvider";
import { useTheme } from "../../../context/ThemeProvider";
import styles from "../../../styles/donation-message.module.scss";
import { useNotification } from "../../../context/NotificationProvider";
import { IoMdWarning } from "react-icons/io";
import asciiStyles from "../../../styles/ascii.module.scss";
import { validateNamadaAddress } from "../../../helpers/web3";
import { FaCheck, FaTimes } from "react-icons/fa";

const DonationAddress = ({
  setSending,
  onFocus,
  tabIndex,
}: {
  setSending: React.Dispatch<React.SetStateAction<number>>;
  onFocus: React.FocusEventHandler;
  tabIndex?: number;
}) => {
  const [address, setAddress] = useState("");
  const { sendAddress } = useDonation();
  const { isConnected, smoothShowApp } = useTheme();
  const { notify } = useNotification();
  const [valid, setValid] = useState(false);

  const handleSubmit = async () => {
    if (isConnected) {
      const validatedAddress = validateNamadaAddress(address);

      if (validatedAddress.trim().length === 0) {
        notify({
          type: "error",
          message: "Transparent address isn't valid!",
          options: {
            id: "message",
            Icon: IoMdWarning,
            duration: 5000,
          },
        });
        setValid(false);
        return;
      } else {
        setValid(true);
      }

      setSending(1);

      const result = await sendAddress(validatedAddress);
      if (result === undefined || result.error) {
        setSending(2);
      } else {
        if (result) {
          setAddress("");
          setSending(3);
        } else {
          setSending(2);
        }
      }
    } else {
      smoothShowApp(false);
    }
  };

  const handleInputChange = (value: string) => {
    const lcValue = value.toLowerCase();
    setAddress(lcValue);
    const validAddress = validateNamadaAddress(lcValue);
    if (validAddress) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* <input
        id='donationAddress'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.textarea}
      /> */}
      <div className={asciiStyles.asciiConverter}>
        <div>
          <label htmlFor='ascii2'>
            Transparent address
            <input
              id='donationAddress'
              type='text'
              value={address}
              onChange={(e) => handleInputChange(e.target.value)}
              // onChange={(e) => () => {
              //   setAddress(e.target.value);
              // }}
              placeholder='Enter your transparent address here...'
              maxLength={45}
              autoComplete='off'
              onFocus={onFocus}
              tabIndex={tabIndex}
            />
          </label>
          <div className={asciiStyles.statusIcon}>
            {valid ? (
              <FaCheck className={asciiStyles.validIcon} />
            ) : (
              address && <FaTimes className={asciiStyles.invalidIcon} />
            )}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            onClick={handleSubmit}
            className={`${styles.button} ${
              isConnected && !address && styles.disabled
            }`}
            disabled={isConnected && !address}
            onFocus={onFocus}
            tabIndex={tabIndex}
          >
            {isConnected ? "Sign and Send" : "Connect Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationAddress;
