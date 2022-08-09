import { useState } from "react";
import { Center, HStack, Switch, Text } from "native-base";

import Background from "../pages/Background";
import Foreground from "../pages/Foreground";

const Routes = () => {
    const [isBackground, setIsBackground] = useState(false);

    return (
        <Center pt={20}>
            <HStack width={130} height={20} justifyContent='space-between' alignItems='center'>
                <Text>{isBackground ? 'Background' : 'Foreground'}</Text>
                <Switch isChecked={isBackground} onToggle={() => setIsBackground(prev => !prev)}  />
            </HStack>
            {isBackground && <Background />}
            {!isBackground && <Foreground />}
        </Center>
    );
};

export default Routes;