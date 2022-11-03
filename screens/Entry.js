import React, { useState, useEffect } from 'react';
import reactDom from 'react-dom';
import { View,Text,TextInput,Alert,TouchableOpacity,StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
//import { AsyncStorage } from 'react-native';
// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף ובנוסף מכיל הרבה ספריות של REACT NATIVE

const Entry = (props) => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [allusers,setAllusers] = useState([]);
    const [isCorrect,setIsCorrect] = useState(false);
    useEffect( ()=> {
      //setIsCorrect(false);
      const allusers = fetch('http://localhost:5988/allUsers',{
          method: 'GET',// denpends upon your call POST or GET
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          }
        })
    .then((response_All_Users) => response_All_Users.json())
    .then((response_Json_All_Users) => {
      setAllusers(response_Json_All_Users)

    })
    .catch((error) =>{
        console.error(error);
    })},[])

// ***************************************************************************

// ***************************************************************************
    const passwordCheck = async() => {

      try{
          await fetch('http://localhost:5988/checkPassword', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            username: username,
            password: password
          })
        }).then((response) => response.json())
        .then((responseJson) => {
          console.log("responseJson: "+responseJson);
          setIsCorrect(responseJson)
          console.log("isCorrect: "+isCorrect);
        })}
      catch(err) { console.error(err);}
    }
// ***************************************************************************

    const login  = () => {
      console.log("starting login function");
      //console.log(JSON.stringify(props)+"\n\n\n")
      console.log("comparing: "+username+" and "+password+"are not blank");
        if(username != '' && password != '')
        {
          console.log("foreach on allusers:");
            allusers.forEach(user => {
              console.log("comparing: "+user.username+"(user in allusers) and "+username+"(username read from input)");
              if(user.username == username)
              {
                console.log("(user.username == username) = true");
                try{
                  
                  passwordCheck()
                  if(isCorrect)
                    {
                      console.log("isCorrect is true");
                      props.navigation.navigate('Home', {username : username })
                    }
                    else{
                      console.log("isCorrect is false");
                    }
                  
                }
                catch(err)
                {
                  console.log("ERROR:");
                  console.error(err)
                }

              }
              else
              {
                console.log("account not found");
              }
            });
        }
        else { Alert.alert('username or password cannot be blank.')}
        console.log("________________________________________________")
    }
// ***************************************************************************

    

    
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.title}>BarberBook</Text>

            <Text style={styles.context}>
            Please enter your name and phone number to enter application.
            </Text>

            <Text style={styles.context}>
            Username
            </Text>

            <TextInput
            style={styles.input}
            keyboardType="default"
            value={username}
            onChangeText={(text) => setUsername(text)}
            />
            <Text style={styles.context}>
            Password
            </Text>
            <TextInput
            style={styles.input}
            keyboardType="default"
            value={password}
            onChangeText={(text) => setPassword(text)}
            />
                  <TouchableOpacity onPress={login} style={styles.btn}>
                  <Text style={styles.btnText}>Login</Text>
                  </TouchableOpacity>
            



            <TouchableOpacity onPress={ () => { props.navigation.navigate('Register')} } style={styles.btn}>   
                <Text>Register to Site</Text>
            </TouchableOpacity>
            <View>

            {/* <FlatList
                    data={allusers}//which data to use
                    keyExtractor={user => user.username}//unique id for the item
                    renderItem={userDetails => //what will be shown from the item
                                  <View style={{
                                  
                                  backgroundColor:'fff',
                                  width:'100%',
                                  padding:22,
                                  marginBottom:10,
                                  borderRadius:10}}>
                                    <Text>{userDetails.item.username}</Text>
                                  </View>
                }/> */}

            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    btn: {
        width: '100%',
        marginTop: 12,
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 30,
        backgroundColor: '#F7567C',
      },
      context: {
        textAlign: 'center',
        fontSize: 18,
        color: '#000000',
        fontWeight: '400',
      },
      title: {
        fontSize: 28,
        color: '#2F4F4F',
        fontWeight: '800',
      },
      btnText: {
        fontSize: 18,
        color: '#000000',
        fontWeight: '700',
      },
      input: {
        marginTop: 20,
        width: '100%',
        paddingVertical: 20,
        borderRadius: 30,
        paddingHorizontal: 20,
        fontSize: 18,
        backgroundColor: '#FCFCFC',
      },
      container: {
        flex: 1,
        backgroundColor: '#EEE8AA',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
      },
});

export default Entry;