import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

const TOTAL_WEEKS = 80 * 52;

export default function LifeGrid({ weeksLived, theme, shape, group }) {
    const dots = useMemo(() => {
        const arr = [];
        
        for (let i = 0; i < TOTAL_WEEKS; i++) {
            let isLived = i < weeksLived;
            let isCurrent = i === weeksLived;
            
            let dotStyle = [styles.dot];
            
            if (shape === 'square') {
                dotStyle.push({ borderRadius: 0 });
            } else if (shape === 'rounded') {
                dotStyle.push({ borderRadius: 1 });
            }
            
            if (theme === 'white') {
                if (isCurrent) dotStyle.push(styles.currentWhite);
                else if (isLived) dotStyle.push(styles.livedWhite);
                else dotStyle.push(styles.futureWhite);
            } else {
                if (isCurrent) dotStyle.push(styles.currentBlack);
                else if (isLived) dotStyle.push(styles.livedBlack);
                else dotStyle.push(styles.futureBlack);
            }
            
            if (group === 'decades' && i > 0 && i % 520 === 0) {
                // To group by decades, add top margin to the first dot of the new decade
                // React Native wrapping requires breaking lines cleanly or adding margin.
                // If container width is exact, adding margin bottom to the whole row is hard without wrapping the row.
                // We can add margin top to the current dot, but we'd need to do it for the whole row of 52 dots.
                const rowInDecade = Math.floor((i % 520) / 52);
                if (rowInDecade === 0) {
                    dotStyle.push({ marginTop: 8 });
                }
            }
            
            arr.push(<View key={i} style={dotStyle} />);
        }
        return arr;
    }, [weeksLived, theme, shape, group]);

    return (
        <View style={styles.gridContainer}>
            {dots}
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 20,
        gap: 3,
        width: '100%',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
    },
    livedBlack: { backgroundColor: '#ffffff', shadowColor: '#fff', shadowOpacity: 0.8, shadowRadius: 2, shadowOffset: {width: 0, height: 0} },
    livedWhite: { backgroundColor: '#000000' },
    currentBlack: { backgroundColor: '#ffd700', shadowColor: '#ffd700', shadowOpacity: 1, shadowRadius: 6, shadowOffset: {width: 0, height: 0}, transform: [{ scale: 1.8 }], zIndex: 10 },
    currentWhite: { backgroundColor: '#ff3366', shadowColor: '#ff3366', shadowOpacity: 1, shadowRadius: 6, shadowOffset: {width: 0, height: 0}, transform: [{ scale: 1.8 }], zIndex: 10 },
    futureBlack: { backgroundColor: '#333333' },
    futureWhite: { backgroundColor: '#cccccc' },
});
