import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Entry = () => {

    return(
        <View style={styles.container}>
            <Text>entry page</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#30E448',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default Entry;