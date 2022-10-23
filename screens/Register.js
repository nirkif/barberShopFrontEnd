import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity } from 'react-native';
// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף
const Register = (props) => {
    console.log('props'+JSON.stringify(props))
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TouchableOpacity onPress={ () => { props.navigation.navigate('Home',{name:'nissim', phoneNumber:'053-226745'} )}} style={styles.buttonStyle}>   
                <Text>Register to site</Text>
            </TouchableOpacity>
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
          fontSize: 30,
      },
      title: {
          flex: 0.3,
          color: 'blue',
          alignItems:'center',
          justifyContent: 'center',
          fontWeight: 'Bold',
          fontSize: 30,
      },
});

export default Register;