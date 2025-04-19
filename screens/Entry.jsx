import React, { useState, useEffect } from 'react';
import { View,Text,TextInput,Alert,TouchableOpacity,StyleSheet,Modal,Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף ובנוסף מכיל הרבה ספריות של REACT NATIVE
export const backEndURL = 'http://192.168.7.16:5988/';

const Entry = (props) => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [allusers,setAllusers] = useState([]);
    const [isCorrect,setIsCorrect] = useState(false);
    const [modalVisibleIncorrect,setModalVisibleIncorrect] = useState(false)
    const [modalVisibleInputsBlanks,setModalVisibleInputBlanks] = useState(false);
    useEffect( ()=> {     // קבלת כל המשתמשים
          fetch(backEndURL+'allUsers',{
          method: 'GET',
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
    useEffect( ()=> {     // העברה לדף הבית

      if(isCorrect){
        const redirectedUsername = username;
        props.navigation.navigate('Home', {username : redirectedUsername })
        setUsername('');
        setPassword('');
        setIsCorrect(false); // מחזירים אותו למצב הקודם כדי למנוע בעיית

        
      }
    }, [isCorrect])

// ***************************************************************************
    const passwordCheck = async() => {    // בדיקת סיסמה תקינה
      try{
          await fetch(backEndURL+'checkPassword', { // נשלח גוף בקשה כדי לקבל אישור אם סיסמה תקינה
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
          setIsCorrect(responseJson) // קיבוע משתנה לסוג הבוליאני שהתקבל מהבקשה ונותן גישה למעבר דף הבית אם הוא TRUE
          
          if(responseJson == false || username == "" || password == "") // בדיקה אם המשתמש באמת תקין בנוסף שאין שום ערכים רקים
          {
            setModalVisibleIncorrect(!modalVisibleIncorrect);
            setPassword('');
          }
        })}
      catch(err) { console.error(err);setModalVisibleIncorrect(!modalVisibleIncorrect);}
    }
// ***************************************************************************

    const login  = async() => {                            // כניסה למשתמש
        
        if(username != '' && password != '')
        {

            for(let i=0;i<allusers.length;i++)
            {
              if(allusers[i].username == username) // אם המשתמש קיים בודק אם הסיסמה תקינה
              {
                try{
                  passwordCheck()
                }
                catch(err)
                {
                  console.error(err)
                }
                
                return
              }
              else if(allusers[i].username != username) // במקרה והמשתמש לא קיים במערכת
              {
                setPassword('');
              }
            }
            setModalVisibleIncorrect(!modalVisibleIncorrect)
            }
        
        else // במקרה והמשתמש לא רשם שם משתמש או סיסמה
        {
          setModalVisibleInputBlanks(!modalVisibleInputsBlanks) 
        }
    }
// ***************************************************************************

    

    
    return(
<LinearGradient 
        colors={['#1A2980', '#26D0CE']} 
        style={styles.container}
      >        
            <Text style={{fontStyle:'italic',fontSize:50,alignSelf:'center',color:'#2968C7',fontWeight:'bold',textShadowOffset:{width:2,height:2},textShadowRadius:10,textShadowColor:'#EBFF61'}}>Welcome to</Text>
            <Text style={{fontStyle:'italic',fontSize:50,alignSelf:'center',color:'#2968C7',fontWeight:'bold',textShadowOffset:{width:2,height:2},textShadowRadius:10,textShadowColor:'#EBFF61'}}>BarberShop</Text>



            <Text style={styles.modalTitle}>
            Username
            </Text>

            <TextInput
            style={styles.shiftSection}
            keyboardType="default"
            value={username}
            onChangeText={(text) => setUsername(text)}
            />
            <Text style={styles.modalTitle}>
            Password
            </Text>
            <TextInput
            secureTextEntry={true}
            style={styles.shiftSection}
            keyboardType="default"
            value={password}
            onChangeText={(text) => setPassword(text)}
            />
                  <TouchableOpacity onPress={login} style={styles.modalButton}>
                  <Text style={styles.modalTitle}>Login</Text>
                  </TouchableOpacity>
            



            <TouchableOpacity onPress={ () => { props.navigation.navigate('Register')} } style={styles.modalButton}>   
                <Text style={styles.modalTitle}>Register to Site</Text>
            </TouchableOpacity>
            <View>
{/* ***********************************************************************************************************  1    משתמש או סיסמה לא נכונה    */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisibleIncorrect}
                onRequestClose={() => {
                  setModalVisibleIncorrect(!modalVisibleIncorrect);
                }}
              >
                    <LinearGradient colors={['#26D0CE','#1A2980' ]} style={styles.modalCard}>
                    <Text style={styles.modalTitle}>username or password are incorrect</Text>
                    <Pressable
                      style={styles.modalCloseButton}
                     onPress={()=> setModalVisibleIncorrect(!modalVisibleIncorrect)}
                    >
                      <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                    </Pressable>
                    </LinearGradient>
              </Modal>

{/* *********************************************************************************************************** 2     חסר משתמש או סיסמה    */}
            </View>
            <Modal 
                animationType="fade"
                transparent={true}
                visible={modalVisibleInputsBlanks}
                onRequestClose={() => {
                    setModalVisibleInputBlanks(!modalVisibleInputsBlanks);
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980' ]} style={styles.modalCard}>
                    <Text style={styles.modalTitle}>check if all inputs are not blank</Text>
                    <Pressable
                      style={styles.modalCloseButton}
                     onPress={()=> setModalVisibleInputBlanks(!modalVisibleInputsBlanks)}
                    >
                      <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                    </Pressable>
                    </LinearGradient>
              </Modal>
        </LinearGradient>
       
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerTitle: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
    profileButton: {
      padding: 10,
    },
    contentSection: {
      flex: 1,
    },
    sectionCard: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
    },
    sectionTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    openingItem: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginRight: 10,
      marginBottom:10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    openingText: {
      color: '#1A2980',
      marginRight: 10,
    },
    bookingItem: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginRight: 10,
    },
    bookingText: {
      color: '#1A2980',
      fontWeight: 'bold',
    },
    bookingSubtext: {
      color: '#26D0CE',
    },
    shiftSection: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 15,
      padding: 15,
      width:500,
      alignSelf:'center'
    },
    shiftDay: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginRight: 10,
      alignItems: 'center',
    },
    shiftDayText: {
      color: '#1A2980',
      fontWeight: 'bold',
    },
    shiftTimeText: {
      color: '#26D0CE',
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    actionButton: {
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 10,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      width: '48%',
    },
    actionButtonText: {
      color: 'white',
      marginLeft: 10,
    },
    headerContainer1: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      color:'white'
    },
    modalCard: {
      backgroundColor: 'rgba(255,255,255,0.3)', 
      borderRadius: 10,
      borderColor:'black',
      borderWidth:2,
      padding: 30,
      marginTop:150,
      width: '50%',
      height:'50%',
      alignSelf: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalTitle: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center'
    },
    modalOption: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalText: {
      color: 'black', 
      fontSize: 18,
      textAlign: 'center'
    },
    modalButton: {
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 10,
      padding: 15,
      marginTop: 10,
      width: '50%',
      alignItems: 'center',
      alignSelf:'center'
    },
    modalButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold'
    },
    modalCloseButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      padding: 10
    },
    modalCheckButton: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      padding: 10
    },
    modalLogo: {
      position: 'absolute',
      top: 12,
      right: 10,
      padding: 10
    },
    openingBarberImage: {
      width: 50,
      height: 50,
      borderRadius: 70,
    },


});

export default Entry;