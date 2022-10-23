import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף
const Home = (props) => {
    console.log('props'+JSON.stringify(props))

    fetch('http://147.235.196.240:5988/allUsers',{
          method: 'GET',// denpends upon your call POST or GET
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        })
    .then((response) => response.json())
    .then((responseJson) => {

       console.log(responseJson);

    })
    .catch((error) =>{
        console.error(error);
    });
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Home Page</Text>

            <TouchableOpacity onPress={ () => { props.navigation.navigate('Home')} } style={styles.buttonStyle}>   
                <Text>Register to Site</Text>
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
        color: 'red',
        alignItems:'center',
        justifyContent: 'center',
        fontWeight: 'Bold',
        fontSize: 30,
    }
});

export default Home;