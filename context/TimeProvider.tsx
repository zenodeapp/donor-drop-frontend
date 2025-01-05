import React from "react";

type ITimeContext = {
  currentTimePerMin: Date;
};
const TimeContext = React.createContext<ITimeContext | undefined>(undefined);

function TimeProvider({ children }: { children: React.ReactNode }) {
  const [currentTimePerMin, setCurrentTimePerMin] = React.useState(new Date());

  React.useEffect(() => {
    setInterval(() => {
      setCurrentTimePerMin(new Date());
    }, 60000); // Update every minute

    // return () => clearInterval(interval);
  }, []);

  return (
    <TimeContext.Provider value={{ currentTimePerMin }}>
      {children}
    </TimeContext.Provider>
  );
}

const useTime = () => {
  const context = React.useContext(TimeContext);
  if (context === undefined)
    throw new Error("useTime must be used within the TimeProvider.");

  return context;
};

export { useTime };
export default TimeProvider;
