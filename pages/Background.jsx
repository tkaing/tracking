import { useEffect, useState } from "react";
import { Box, Button, HStack, Text } from "native-base";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

import TrackingHelper from "../includes/helpers/TrackingHelper";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async (_taskResponse) => {
    //console.log(_taskResponse);

    const now = new Date();

    const newTime = [now.getHours(), now.getMinutes(), now.getSeconds()].join(
        "."
    );

    const location = await Location.getCurrentPositionAsync({});

    const address = await TrackingHelper.getFormattedAddress(
        location.coords
    );

    console.log('bg', newTime, address);

    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
});

const Background = () => {
    const [status, setStatus] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const watchPosition = async () => {
        const foregroundPermission =
            await Location.requestForegroundPermissionsAsync();

        if (!foregroundPermission.granted) return;

        await Location.requestBackgroundPermissionsAsync();

        TrackingHelper.checkStatusAsync({ setStatus, setIsRegistered });
    };

    useEffect(() => {
        watchPosition();
    }, []);

    return (
        <Box>
            <Box>Background</Box>
            <HStack>
                <Button
                    onPress={() =>
                        TrackingHelper.toggleFetchTask({
                            setStatus,
                            isRegistered,
                            setIsRegistered,
                        })
                    }
                >
                    Start / Stop in background
                </Button>
            </HStack>
            <Text>
                {status && BackgroundFetch.BackgroundFetchStatus[status]}
            </Text>
        </Box>
    );
};

export default Background;
