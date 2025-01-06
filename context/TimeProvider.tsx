import React from "react";

type ITimeContext = {
  currentTimePerMin?: number;
};
const TimeContext = React.createContext<ITimeContext | undefined>(undefined);

function TimeProvider({ children }: { children: React.ReactNode }) {
  const [currentTimePerMin, setCurrentTimePerMin] = React.useState<
    number | undefined
  >(undefined);

  React.useEffect(() => {
    setCurrentTimePerMin(Date.now());

    const interval = setInterval(() => {
      setCurrentTimePerMin(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
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
