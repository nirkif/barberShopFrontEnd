import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Register = () => {

    return(
        <View style={styles.container}>
            <Text>register page</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#B430E4',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default Register;