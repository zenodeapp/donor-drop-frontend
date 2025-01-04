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
import { convertToHex } from "../../../helpers/web3";
import styles from "../../../styles/ascii.module.scss";
import { bech32m } from "bech32";

export default function AsciiToHex() {
  const { notify } = useNotification();
  const [ascii, setAscii] = useState("");
  const [hex, setHex] = useState("");

  const validateNamadaAddress = (input: string) => {
    const match = input.match(/^tnam1[A-Za-z0-9]{40}$/);

    if (match) {
      const address = match[0];

      try {
        const decoded = bech32m.decode(address);
        if (decoded.prefix === "tnam") {
          return address;
        }
      } catch (e) {
        return "";
      }
    }
    return "";
  };

  const handleInputChange = (value: string) => {
    const lcValue = value.toLowerCase();
    setAscii(lcValue);
    const validAddress = validateNamadaAddress(lcValue);
    if (validAddress) {
      setHex(convertToHex(validAddress));
    } else {
      setHex("");
    }
  };

  return (
    <div className={styles.asciiConverter}>
      <div>
        <label htmlFor='ascii'>
          TNAM address
          <input
            id='ascii'
            type='text'
            value={ascii}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder='Enter your address here...'
            maxLength={45}
            autoComplete='off'
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
            placeholder='Type a valid address in the TNAM address-field.'
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
        >
          <FaCopy />
        </button>
      </div>
    </div>
  );
}
