import React, {useState, useEffect} from 'react';
import { Text,TextInput,TouchableOpacity,StyleSheet,Modal,Pressable } from 'react-native';
import { backEndURL } from './Entry';
import { LinearGradient } from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף
const Register = (props) => {
    const [username , setUsername] = useState('');
    const [name , setName] = useState('');
    const [password , setPassword] = useState('');
    const [phoneNumber , setPhoneNumber] = useState('');
    const [modalVisibleInputsBlanks,setModalVisibleInputBlanks] = useState(false);
    const [modalVisibleAlreadyExist,setModalVisibleAlreadyExist] = useState(false);
    const [modalVisibleSuccess,setModalVisibleSuccess] = useState(false);
    const [isGood, setIsGood] = useState(false);

    const registerUser = async() => {       // יצירת משתמש
        if((username != '' && username != null) && name != '' && password != '' && phoneNumber != '')
        {
          try
          {
            createAndRedirect() 
          }
          catch(err) 
          {
          setIsGood(false)
          console.error("createAndRedirect Error: ",err);
          console.error("user is not found error");
          }
        if(!isGood)
        {
            setName('')
            setPassword('')
            setPhoneNumber('')
            setIsGood(false)
        }
    }
    else
    {
        setModalVisibleInputBlanks(!modalVisibleInputsBlanks)
    }
    }
    const createAndRedirect = async() => {                     // יצירת משתמש
        try{
          await fetch(backEndURL+'addUser', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
        body: JSON.stringify({
            username: username,
            password: password,
            name: name,
            phoneNumber: phoneNumber
          })}).then((response) => { if(response.status === 404)
                                      {setModalVisibleAlreadyExist(!modalVisibleAlreadyExist)}
                                  else
                                      {setModalVisibleSuccess(!modalVisibleSuccess)}})
          
           
        }
      catch(err) { console.error(err);}
    }
    return(
              <LinearGradient colors={['#1A2980', '#26D0CE']} style={styles.container}>
            <Text style={styles.headerTitle}>Register to Site </Text>
            <Text style={styles.modalTitle}> User name </Text>
            <TextInput
            style={styles.shiftSection}
            keyboardType="default"
            value={username}
            onChangeText={(text) => setUsername(text)}
            />
            <Text style={styles.modalTitle}>Password</Text>
            <TextInput
            secureTextEntry={true}
            style={styles.shiftSection}
            keyboardType="default"
            value={password}
            onChangeText={(text) => setPassword(text)}
            />
            <Text style={styles.modalTitle}>Private Name</Text>
            <TextInput
            style={styles.shiftSection}
            keyboardType="default"
            value={name}
            onChangeText={(text) => setName(text)}
            />
            <Text style={styles.modalTitle}>Phone Number</Text>
            <TextInput
            style={styles.shiftSection}
            keyboardType="decimal-pad"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            />


            <TouchableOpacity onPress={ registerUser } style={styles.modalButton}>   
                <Text style={styles.modalTitle}>Register to site</Text>
            </TouchableOpacity>
    
{/* ****************************                 מודל בדיקת חוסר פלטים           *********************************** */}
            <Modal 
                animationType="fade"
                transparent={true}
                visible={modalVisibleInputsBlanks}
                onRequestClose={() => {
                    setModalVisibleInputBlanks(!modalVisibleInputsBlanks);
                }}
              >
                        <LinearGradient colors={['#26D0CE','#1A2980' ]} style={styles.modalCard}> 
                    <Text style={styles.modalText}>check if all inputs are not blank</Text>
                      <Pressable
                        style={styles.modalCloseButton}
                        onPress={()=> {setModalVisibleInputBlanks(!modalVisibleInputsBlanks)}}>
                        <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                         </Pressable>
                </LinearGradient>
              </Modal>

{/* ****************************                משתמש קיים כבר         *********************************** */}
              <Modal 
                animationType="fade"
                transparent={true}
                visible={modalVisibleAlreadyExist}
                onRequestClose={() => {
                  setModalVisibleAlreadyExist(!modalVisibleAlreadyExist);
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980' ]} style={styles.modalCard}> 
                    <Text style={styles.modalText}>Username already exist </Text>
                    <Pressable
                      style={[styles.modalCloseButton]}
                      onPress={() => setModalVisibleAlreadyExist(!modalVisibleAlreadyExist)}
                    >
                      <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                    </Pressable>

                </LinearGradient>
              </Modal>
{/* ****************************                ברוך הבא          *********************************** */}
                <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisibleSuccess}
                onRequestClose={() => {
                  setModalVisibleSuccess(!modalVisibleSuccess);
                  
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980' ]} style={styles.modalCard}> 
                    <Text style={styles.modalText}>Welcome {username} </Text>

                    <Pressable
                      style={[styles.modalCloseButton]}
                      onPress={() => window.location.reload()+setModalVisibleSuccess(!modalVisibleSuccess)+props.navigation.navigate('Entry')}
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
    fontSize: 40,
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
    width:'35%',
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
  // עיצובים של מודלים בשימוש

  modalCard: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
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
    textAlign: 'center',

  },
    modalNewText: {
      color: 'black',
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
    width: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
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

export default Register;