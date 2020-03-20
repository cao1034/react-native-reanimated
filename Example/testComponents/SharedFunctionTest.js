import React from 'react';
import Animated, { useSharedValue, useWorklet } from 'react-native-reanimated';
import { View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

const SharedFunctionTest = () => {
    
    const startTime = useSharedValue(0);
    const isStarted = useSharedValue(0);
    const viewWidth = useSharedValue(0);
    const duration = useSharedValue(5000);

    const fun = useSharedValue(
        function(progress, viewWidth) {
            'worklet';
            viewWidth.set(progress * 100);
        }
    );
    
    const worklet = useWorklet(function(startTime, isStarted, viewWidth, fun, duration) {
        'worklet';
        const now = Date.now();
        if (isStarted.value === 0) {
            isStarted.set(1);
            startTime.set(now);
        }

        this.log("fun id " + fun.id.toString());

        const deltaTime = now - startTime.value;
        const progress = deltaTime / duration.value;

        if (deltaTime > duration.value) {
            return true;
        }

        fun(progress, viewWidth);
        
    }, [startTime, isStarted, viewWidth, fun, duration]);

    worklet();

    return (
        <View>
            <PanGestureHandler
                onHandlerStateChange={worklet}
                onGestureEvent={worklet}
            >
                <Animated.View
                    style={{
                        width: viewWidth,
                        height: 100,
                        backgroundColor: 'green',
                    }}
                />
            </PanGestureHandler>
        </View>
    )
}

export default SharedFunctionTest;