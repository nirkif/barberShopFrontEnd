import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Home = () => {

    return(
        <View style={styles.container}>
            <Text>Home Page</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#30E4DE',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default Home;