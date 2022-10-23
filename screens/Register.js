import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף
const Register = (props) => {
    var people = [{name:'moshe',phoneNumber:'053-125162'}, {name:'david',phoneNumber:'055-121262'}, {name:'nissim',phoneNumber:'053-7331'}, {name:'menashe',phoneNumber:'053-12365'}]
    console.log('props'+JSON.stringify(props))
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TouchableOpacity onPress={ () => { props.navigation.navigate('Home',{name:'nissim', phoneNumber:'053-226745'} )}} style={styles.buttonStyle}>   
                <Text>Register to site</Text>
            </TouchableOpacity>
        

        <View style={styles.container}>
        <FlatList
                    data={people}//which data to use
                    keyExtractor={man => man.name}//unique id for the item
                    renderItem={manDetails => //what will be shown from the item
                                  <TouchableOpacity onPress={() => {props.navigation.navigate('Profile',{profileDetails: manDetails.item} )}}>
                                  <View style={{backgroundColor:'fff',
                                  width:'100%',
                                  padding:22,
                                  marginBottom:10,
                                  borderRadius:10}}>
                                    <Text>{manDetails.item.name}</Text>
                                  </View>
                    </TouchableOpacity>
                }/>
        </View>


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