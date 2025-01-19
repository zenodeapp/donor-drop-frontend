import { useState } from "react";
import { copyToClipboard } from "../../../helpers/interaction";
import {
  FaCheck,
  FaClipboard,
  FaCopy,
  FaExclamation,
  FaTimes,
} from "react-icons/fa";
import { useNotification } from "../../../context/NotificationProvider";
import { convertToHex, validateNamadaAddress } from "../../../helpers/web3";
import styles from "../../../styles/ascii.module.scss";

export default function AsciiToHex({
  onFocus,
  tabIndex,
  setAllowNext,
}: {
  onFocus: React.FocusEventHandler;
  tabIndex?: number;
  setAllowNext: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { notify } = useNotification();
  const [ascii, setAscii] = useState("");
  const [hex, setHex] = useState("");

  const handleInputChange = (value: string) => {
    const lcValue = value.toLowerCase();
    setAscii(lcValue);
    const validAddress = validateNamadaAddress(lcValue);
    if (validAddress) {
      setAllowNext(true);
      setHex(convertToHex(validAddress));
    } else {
      setAllowNext(false);
      setHex("");
    }
  };

  return (
    <div className={styles.asciiConverter}>
      <div>
        <label htmlFor='ascii'>
          Transparent address
          <input
            id='ascii'
            type='text'
            value={ascii}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder='Enter your address here...'
            maxLength={45}
            autoComplete='off'
            onFocus={onFocus}
            tabIndex={tabIndex}
          />
        </label>
        <div className={styles.statusIcon}>
          {hex ? (
            <FaCheck className={styles.validIcon} />
          ) : (
            ascii && <FaTimes className={styles.invalidIcon} />
          )}
        </div>
      </div>
      <div className={styles.hexWrapper}>
        <label htmlFor='hex'>
          Hex value
          <input
            id='hex'
            type='text'
            value={hex}
            readOnly
            placeholder='Type a valid address in the field above.'
            onFocus={onFocus}
            tabIndex={tabIndex}
          />
        </label>
        <button
          onClick={() => {
            if (!hex) {
              notify({
                type: "error",
                message: "No valid hex value to copy!",
                options: {
                  duration: 4000,
                  Icon: FaExclamation,
                },
              });
              return;
            }
            copyToClipboard(
              hex,
              () => {
                notify({
                  type: "success",
                  message: "Copied hex value to clipboard!",
                  options: {
                    duration: 4000,
                    Icon: FaClipboard,
                  },
                });
              },
              () => {
                notify({
                  type: "error",
                  message: "Failed to copy hex value to clipboard!",
                  options: {
                    duration: 4000,
                    Icon: FaExclamation,
                  },
                });
              }
            );
          }}
          onFocus={onFocus}
          tabIndex={tabIndex}
        >
          <FaCopy />
        </button>
      </div>
    </div>
  );
}
