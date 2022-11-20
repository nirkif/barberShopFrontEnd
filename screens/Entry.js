import React, { useState, useEffect } from 'react';
import reactDom from 'react-dom';
import { View,Text,TextInput,Alert,TouchableOpacity,StyleSheet,Modal,Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
//import { AsyncStorage } from 'react-native';
// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף ובנוסף מכיל הרבה ספריות של REACT NATIVE

const Entry = (props) => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [allusers,setAllusers] = useState([]);
    const [isCorrect,setIsCorrect] = useState(false);
    const [modalVisible,setModalVisible] = useState(false)
    const [modalVisibleSuccess,setModalVisibleSuccess] = useState(false)
    useEffect( ()=> {
      //setIsCorrect(false);
      setAllusers(false);
          fetch('http://localhost:5988/allUsers',{ // removed allusers = 
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
    useEffect( ()=> {

      if(isCorrect){
        const redirectedUsername = username;
        setUsername('');
        setPassword('');
        setIsCorrect(false);
        props.navigation.navigate('Home', {username : redirectedUsername })

      }
      else if(isCorrect == false && username != ''){
        setModalVisible(true);
      }
    }, [isCorrect])

// ***************************************************************************

// ***************************************************************************
    const passwordCheck = async() => {

      try{
          fetch('http://localhost:5988/checkPassword', {
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
          setIsCorrect(responseJson)
          // if(isCorrect == false)
          // {
          //   setModalVisible(!modalVisible)
          // }
        })}
      catch(err) { console.error(err);}
    }
// ***************************************************************************

    const login  = () => {
        if(username != '' && password != '')
        {
            allusers.forEach(user => {
              if(user.username == username)
              {
                try{              
                  passwordCheck()
                  setModalVisibleSuccess(!modalVisibleSuccess) 
                }
                catch(err)
                {
                  console.error(err)
                }
              }
              else
              {
                //setModalVisible(true);
                setPassword('');
              }
            });
        }
        else {setModalVisible(true)}
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
            secureTextEntry={true}
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
{/* *********************************************************************************************************** */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>username or password are incorrect</Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

{/* *********************************************************************************************************** */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleSuccess}
                onRequestClose={() => {
                  setModalVisibleSuccess(!modalVisibleSuccess);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Success</Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisibleSuccess(!modalVisibleSuccess)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>


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
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
});

export default Entry;