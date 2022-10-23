import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף
const Profile = (props) => {
    console.log(JSON.stringify(props))
    return(
        <View style={styles.container}>
            <Text>profile page</Text>
            <Text style={styles.title}>Hello {props.route.params.profileDetails.name}!!</Text>
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
      buttonStyle: {
          flex: 0.3,
          color: 'red',
          backgroundColor:'#4343F6',
          alignItems:'center',
          justifyContent: 'center',
          fontWeight: 'Bold',
          borderRadius:10,
          fontSize: 30,
      },
      title: {
          flex: 0.3,
          color: 'red',
          alignItems:'center',
          justifyContent: 'center',
          fontWeight: 'Bold',
          fontSize: 30,
      }
});

export default Profile;