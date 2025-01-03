import dynamic from "next/dynamic";
import { useTheme } from "../../context/ThemeProvider";
import { getClassNameByStyle } from "../../helpers/layout";
import inputStyle from "../../styles/input.module.scss";

const App = dynamic(() => import("./App"));

const AppScreen = () => {
  const { showApp, appScreenLoaded } = useTheme();

  return (
    <>
      {(showApp || appScreenLoaded) && (
        <div
          className={getClassNameByStyle(
            inputStyle,
            `app${showApp ? " active" : ""}`
          )}
        >
          <App />
        </div>
      )}
    </>
  );
};

export default AppScreen;
