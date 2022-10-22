import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Profile = () => {

    return(
        <View style={styles.container}>
            <Text>profile page</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#529DD0',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default Profile;