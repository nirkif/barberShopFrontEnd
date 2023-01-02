import React, {useState, useEffect} from 'react';
import { View,Text,TextInput,Alert,TouchableOpacity,StyleSheet,Modal,Pressable,ImageBackground } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף
const Register = (props) => {
    const [username , setUsername] = useState('');
    const [redirectedUsername,setRedirectedUserName] = useState('');
    const [name , setName] = useState('');
    const [password , setPassword] = useState('');
    const [phoneNumber , setPhoneNumber] = useState('');
    const [modalVisibleInputsBlanks,setModalVisibleInputBlanks] = useState(false);
    const [modalVisibleAlreadyExist,setModalVisibleAlreadyExist] = useState(false);
    const [modalVisibleSuccess,setModalVisibleSuccess] = useState(false);
    const [isGood, setIsGood] = useState('');
    const [isGoodUserName, setIsGoodUserName] = useState('');
    const backEndURL = 'http://10.0.0.13:5988/';




    console.log('props',JSON.stringify(props))
    // console.log("is good is: ",JSON.stringify(isGood));
    // console.log("is good length : ",JSON.stringify(isGood).length);
    // console.log("isGood is equals : ",JSON.stringify(isGood).length == 0);
    // console.log("is good username : ",isGoodUserName);
    const registerUser = async() => {
      console.log("starting registerUser");
        if(username != '' && name != '' && password != '' && phoneNumber != '')
        {
          console.log("username != '' && name != '' && password != '' && phoneNumber != ''  == ",username != '' && name != '' && password != '' && phoneNumber != '');
            try{
              await fetch(backEndURL+'findByUserName/'+username,{
                    method: 'GET',// denpends upon your call POST or GET
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin':'*'
                    }
                  }).then(response => response.json()).then(responseJSON => setIsGood(responseJSON)).then(console.log(responseJSON))
        }catch(err) {
            setIsGood('')
            console.log("did not find username in the function findByUserName");
            console.error("ERROR: ",err);
            console.error("user is not found error");
        }

        console.log("condition: ",JSON.stringify(isGood) !== "");
        if(JSON.stringify(isGood).length > 2)
        {
          console.log("starting if");
            setModalVisibleAlreadyExist(!modalVisibleAlreadyExist)
            setUsername('')
            setName('')
            setPassword('')
            setPhoneNumber('')
            setIsGood('')
        }
        else
        {
            console.log("starting else");
            setRedirectedUserName(username)
            createAndRedirect()
        }
        console.log("done with if/else");
    }
    else
    {
        setModalVisibleInputBlanks(!modalVisibleInputsBlanks)
    }
    }
    const createAndRedirect = () => {
      console.log("starting createAndRedirect");
        try{
          fetch(backEndURL+'addUser', {
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
          })
        }).then((response) => response.json())
            setModalVisibleSuccess(!modalVisibleSuccess)
            console.log("routing to Home");
            props.navigation.navigate('Home', {username : redirectedUsername })
          

        }
      catch(err) { console.error(err);}
    }
    return(
        <View >
          <ImageBackground source={require('../assets/barberShopPageCover.jpg')} resizeMode="cover" style={{height:'100%'}}>
            <Text style={styles.title}>Register to Site</Text>
            <Text style={styles.textStyle}> User name</Text>
            <TextInput
            style={styles.input}
            keyboardType="default"
            value={username}
            onChangeText={(text) => setUsername(text.toLowerCase())}
            />
            <Text style={styles.textStyle}>Password</Text>
            <TextInput
            secureTextEntry={true}
            style={styles.input}
            keyboardType="default"
            value={password}
            onChangeText={(text) => setPassword(text)}
            />
            <Text style={styles.textStyle}>Private Name</Text>
            <TextInput
            style={styles.input}
            keyboardType="default"
            value={name}
            onChangeText={(text) => setName(text)}
            />
            <Text style={styles.textStyle}>Phone Number</Text>
            <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            />


            <TouchableOpacity onPress={ registerUser } style={styles.btnSecondery}>   
                <Text>Register to site</Text>
            </TouchableOpacity>
    
























            <Modal // modal build
                animationType="slide"
                transparent={true}
                visible={modalVisibleInputsBlanks}
                onRequestClose={() => {
                    setModalVisibleInputBlanks(!modalVisibleInputsBlanks);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>check if all inputs are not blank</Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisibleInputBlanks(!modalVisibleInputsBlanks)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              {/*  diffrent modals for diffrent text inputs */}
              <Modal // modal build
                animationType="slide"
                transparent={true}
                visible={modalVisibleAlreadyExist}
                onRequestClose={() => {
                  setModalVisibleAlreadyExist(!modalVisibleAlreadyExist);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Username already exist </Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisibleAlreadyExist(!modalVisibleAlreadyExist)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

                {/*  diffrent modals for diffrent text inputs */}
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
                    <Text style={styles.modalText}>Hello {username} </Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisibleSuccess(!modalVisibleSuccess)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              </ImageBackground>
        </View>
       
    )

}

const styles = StyleSheet.create({
    btn: {
        width: '100%',
        marginTop: 12,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 30,
        backgroundColor: '#F7567C',
      },
      btnSecondery: {
        width: '100%',
        marginTop: 12,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 30,
        backgroundColor: '#8DCEEF',
      },
      context: {
        textAlign: 'center',
        fontSize: 18,
        color: '#000000',
        fontWeight: '400',
      },
      title: {
        fontSize: 28,
        color: 'teal',
        fontWeight: '800',
        alignSelf:'center'
      },
      btnText: {
        fontSize: 18,
        color: '#000000',
        fontWeight: '700',
      },
      input: {
        marginBottom: 20,
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
        color: "#207FDE",
        fontSize:20,
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
});

export default Register;