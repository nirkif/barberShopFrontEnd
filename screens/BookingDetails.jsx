import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף
const BookingDetails = (props) => {

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