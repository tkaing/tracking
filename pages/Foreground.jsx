import { useEffect } from "react";
import { Box } from "native-base";
import * as Location from "expo-location";
import TrackingHelper from "../includes/helpers/TrackingHelper";

let locationSubscrition = null;

const Foreground = () => {
    const watchPosition = async () => {
        const foregroundPermission =
            await Location.requestForegroundPermissionsAsync();

        if (foregroundPermission.granted) {
            locationSubscrition = Location.watchPositionAsync(
                {
                    // Tracking options
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10,
                },
                (location) => {
                    TrackingHelper.getFormattedAddress(location.coords).then(
                        (address) => console.log('fg', address)
                    );
                }
            );
        }
    };

    useEffect(() => {
        watchPosition();
    }, []);

    return <Box>Foreground</Box>;
};

export default Foreground;
