import React from "react";

interface DebugPanelProps {
  setIsConnected: (value: boolean) => void;
  setSignedIn: (value: boolean) => void;
  setPhase: (value: number) => void;
  setAccountPhase: (value: number) => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  setIsConnected,
  setSignedIn,
  setPhase,
  setAccountPhase,
}) => {
  const panelStyle = {
    position: "fixed" as const,
    top: "10px", // Temporarily move to top-left
    left: "10px",
    background: "#222",
    color: "#fff",
    padding: "10px", // Slightly increased for better visibility
    borderRadius: "4px",
    fontSize: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    border: "1px solid red", // Add a red border for visibility
  };

  const buttonStyle = {
    margin: "2px",
    padding: "2px 5px",
    fontSize: "10px",
    background: "#555",
    color: "#fff",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
  };

  const sectionStyle = {
    marginBottom: "5px",
  };

  const headingStyle = {
    fontSize: "10px",
    margin: "2px 0",
    color: "#ccc",
  };

  return (
    <div style={panelStyle}>
      <div style={sectionStyle}>
        <p style={headingStyle}>Connection</p>
        <button style={buttonStyle} onClick={() => setIsConnected(true)}>
          Connected
        </button>
        <button style={buttonStyle} onClick={() => setIsConnected(false)}>
          Disconnected
        </button>
      </div>
      <div style={sectionStyle}>
        <p style={headingStyle}>Authentication</p>
        <button style={buttonStyle} onClick={() => setSignedIn(true)}>
          Signed In
        </button>
        <button style={buttonStyle} onClick={() => setSignedIn(false)}>
          Signed Out
        </button>
      </div>
      <div style={sectionStyle}>
        <p style={headingStyle}>Donation Phase</p>
        {[0, 1, 2, 3, 4].map((value) => (
          <button
            key={value}
            style={buttonStyle}
            onClick={() => setPhase(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div style={sectionStyle}>
        <p style={headingStyle}>Account Phase</p>
        {[0, 1, 2, 3, 4].map((value) => (
          <button
            key={value}
            style={buttonStyle}
            onClick={() => setAccountPhase(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DebugPanel;
