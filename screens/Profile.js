import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף
const Profile = (props) => {

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