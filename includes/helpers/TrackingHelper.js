import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";

const test = () => {
    /*
    const apiUrl =
        "https://api.trello.com/1/cards/62f0cfc64b22b051226115a0?key=9f55e83f338ebe875f5c39febcbec717&token=0036ed61600aeb1b7bbb2c80fadd3e42f54faaa742a873866e53d4900a46c7be";

    await fetch(apiUrl, {
        body: JSON.stringify({ name: newData }),
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    });
    */
};
const toggleFetchTask = async ({
    setStatus,
    isRegistered,
    setIsRegistered,
}) => {
    if (isRegistered) {
        console.log("Unregister");
        await unregisterBackgroundFetchAsync();
        //await stopBackgroundUpdate();
    } else {
        console.log("Register");
        await registerBackgroundFetchAsync();
        //await startBackgroundUpdate();
    }

    checkStatusAsync({ setStatus, setIsRegistered });
};
const checkStatusAsync = async ({ setStatus, setIsRegistered }) => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
        LOCATION_TASK_NAME
    );
    setStatus(status);
    setIsRegistered(isRegistered);
};

// Tracking in foreground
const stopForegroundUpdate = (foregroundSubscription) => {
    foregroundSubscription?.remove();
};
const startForegroundUpdate = async (
    foregroundSubscription,
    setForegroundSubscription
) => {
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync();
    if (!granted) {
        console.log("location tracking denied");
        return;
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove();

    // Start watching position in real-time
    const newForegroundSubscription = await Location.watchPositionAsync(
        {
            // For better logs, we set the accuracy to the most sensitive option
            accuracy: Location.Accuracy.BestForNavigation,
        },
        (location) => {
            console.log("foreground coords: ", location.coords);
        }
    );

    setForegroundSubscription(newForegroundSubscription);
};

// Tracking in background
const registerBackgroundFetchAsync = async () => {
    return BackgroundFetch.registerTaskAsync(LOCATION_TASK_NAME, {
        // common rules
        minimumInterval: 10,
        // android only
        startOnBoot: true,
        stopOnTerminate: false,
    });
};
const unregisterBackgroundFetchAsync = async () => {
    return BackgroundFetch.unregisterTaskAsync(LOCATION_TASK_NAME);
};

// Format location address
const getFormattedAddress = async (coords) => {
    const myApiKey = "AIzaSyAAV6KZgTfG14bEy7e4fFQOFBM3oROumxc";

    const response = await fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            coords.latitude +
            "," +
            coords.longitude +
            "&key=" +
            myApiKey
    );

    const responseJson = await response.json();

    const results = responseJson.results;

    return results.length > 0
        ? results[0].formatted_address
        : "address not found.";
};

const TrackingHelper = {
    toggleFetchTask,
    checkStatusAsync,
    getFormattedAddress,
    stopForegroundUpdate,
    startForegroundUpdate,
};

export default TrackingHelper;
