import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BookingDetails = () => {

    return(
        <View style={styles.container}>
            <Text>booking details page</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#DDE933',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default BookingDetails;