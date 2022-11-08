import React, {useState, useEffect} from 'react';
import { View,Text,TextInput,Alert,TouchableOpacity,StyleSheet,Modal,Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף



//need barbers list , openings , and bookings
// onClick on barber -> opened flatlist with openings onClick opening -> pop up yes/no -> set to booking
// flat list showing all bookings


//
const Home = (props) => {
    const [barberList , setBarberList] = useState([]);
    const [openings , setOpenings] = useState([]);
    const [userObject, setUserObject] = useState({})
    const [startTime, setStartTime] = useState(0);
    //const [modalVisible,setModalVisible] = useState(true);


     console.log("props: "+JSON.stringify(props))
     console.log("barberList: "+JSON.stringify(barberList))
     console.log("userObject: ",userObject);
     console.log("is user is a braber: ", (userObject.classType != 'User'));
    // console.log("openingsList: "+JSON.stringify(openings))
    useEffect( ()=> {
            console.log("fetching allBarbers");
            fetch('http://localhost:5988/allBarbers',{
            method: 'GET',// denpends upon your call POST or GET
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin':'*'
            }
          })
      .then((response) => response.json())
      .then((responseJson) => {
         setBarberList(responseJson)})},[])
      //////////////////////////////////////////////
      useEffect( ()=> {
        console.log("fetching allOpenings");
        fetch('http://localhost:5988/allOpenings/',{
        method: 'GET',// denpends upon your call POST or GET
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
            setOpenings(responseJson)
  })
  .catch((error) =>{
      console.error(error);
  })},[])

    ////////////////////////////////////////////////////////////////////////////////////
  useEffect( async()=> {
    try{
      await fetch('http://localhost:5988/findByUserName/'+props.route.params.username,{
            method: 'GET',// denpends upon your call POST or GET
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin':'*'
            }
          }).then(response => response.json()).then(responseJSON => setUserObject(responseJSON))
  }catch(err) {
      console.error("ERROR: ",err);
      console.error("did not find username in the function findByUserName");
}},[])
    ////////////////////////////////////////////////////////////////////////////////////
  const addOpening = () => {
    console.log("adding opening ");
        try{
            fetch('http://localhost:5988/addOpening', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin':'*'
            },
          body: JSON.stringify({
              userName: props.route.params.username,
              startTime: startTime
            })
          }).then((response) => response.json())
          }
        catch(err) { console.error(err);}
    
  }
  const work = () => {
    console.log("this is working");
    //<TouchableOpacity onPress={ () => { props.navigation.navigate('Profile')} } style={styles.btn}>   
    // <TouchableOpacity onPress={addOpening} style={styles.btn}>// key to add new openings
    // <Text style = {styles.title}>addOpening </Text>
    // <Text style={styles.title}>Home Page</Text>
    // <Text style={styles.title}>Hello {props.route.params.username}</Text>
    // </TouchableOpacity>
  }
   
    return(
        <View style={styles.container}>
            <View>
            
            <Text style={styles.context}>Hello {props.route.params.username}</Text>

            <Text style={styles.context}>new openings</Text>
            </View>
            <View style={styles.backgroundColor}>
            <FlatList    //  flatList to show all barbers
            data={barberList}//which data to use
            renderItem= {barber => //what will be shown from the item
                        <View style={styles.btn}>
                        <Text style={styles.btnText}>{barber.item.name}</Text>
                        <FlatList // flatlist to show opening details
                        data={openings}//which data to use
                        renderItem= {opening => //what will be shown from the item
                                      <View style={styles.btnSecondery}>
                                        <Text style={styles.btnText}>{opening.item.openingInfo}</Text>
                                      </View>
                                    }
                        keyExtractor={opening => opening.id}//unique id for the item
                        />
                        </View>
            }
            keyExtractor={opening => opening.id}//unique id for the item
            />
            </View>
            <View>
              {/* style={!this.state.username || !this.state.password ? styles.disabled : styles.buttonWrapper} */}
              <TouchableOpacity onPress={addOpening} style={startTime != 0 && (userObject.classType != 'User') ? styles.disabled : !styles.disabled}>
              <Text style = {styles.title}>addOpening </Text>
              </TouchableOpacity>
            </View>

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

export default Home;