import { useEffect, useRef, useState } from "react";
import { NativeBaseProvider } from "native-base";
import * as SecureStore from "expo-secure-store";
import { AppState } from "react-native";
import Routes from "./components/Routes";

const COORDS_KEY = "coords";

export default function App() {
    const appState = useRef(AppState.currentState);

    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const showLastCoords = async () => {
        const lastCoords = await SecureStore.getItemAsync(COORDS_KEY);
        console.log("Last coords dt ->", lastCoords);
    };

    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("App has come to the foreground!");
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log("AppState", appState.current);
    };

    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            _handleAppStateChange
        );
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (appStateVisible === "active") {
            showLastCoords();
        }
        if (appStateVisible === "background") {
			const currentDate = new Date();
            console.log(
                "Last unmount dt ->",
                `${
                    currentDate.getHours() +
                    "." +
                    currentDate.getMinutes() +
                    "." +
                    currentDate.getSeconds()
                }`
            );
        }
    }, [appStateVisible]);

    return (
        <NativeBaseProvider>
            <Routes />
        </NativeBaseProvider>
    );
}
