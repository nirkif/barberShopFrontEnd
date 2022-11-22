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
    const [modalVisible,setModalVisible] = useState(false);
    const [modalVisibleSuccess,setModalVisibleSuccess] = useState(false)
    const [modalVisibileDelete,setModalVisibleDelete] = useState(false)
    const [barberUserName,setBarberUserName] = useState('')
    const [openingId,setOpeningId] = useState('')
    const [openingToBook,setOpeningToBook] = useState({})
    const [myBookings, setMyBookings] = useState([])
    const [allOpeningsObjects, setallOpeningsObjects] = useState([])
    const [openingInfo,setOpeningInfo] = useState([])
    const [bookingId,setBookingId] = useState('')

    //  console.log("props: "+JSON.stringify(props))
    //  console.log("barberList: "+JSON.stringify(barberList))
    //  console.log("userObject: ",userObject);
      console.log("props: ", props);
      console.log("myBookings: ",myBookings);
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
         setBarberList(responseJson)
         })},[])
      //////////////////////////////////////////////
      useEffect( ()=> {
        fetchAvailableOpenings()
        getMyBooking()
        allOpenings()
        },[])
      

    ////////////////////////////////////////////////////////////////////////////////////
  useEffect( async()=> {
    try{
      fetchUser()
  }catch(err) {
      console.error("ERROR: ",err);
      console.error("did not find username in the function findByUserName");
}},[])


    ////////////////////////////////////////////////////////////////////////////////////
  const fetchUser = async() => {
    await fetch('http://localhost:5988/findByUserName/'+props.route.params.username,{
      method: 'GET',// denpends upon your call POST or GET
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      }
    }).then(response => response.json()).then(responseJSON => setUserObject(responseJSON))
    isBarber()
  }
      ////////////////////////////////////////////////////////////////////////////////////
 const fetchAvailableOpenings = () => {
  console.log("fetching Available Openings");
        fetch('http://localhost:5988/findAllAvailableOpenings/',{
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
  })
 }
////////////////////////////////////////////////////////////////////////////////////
const deleteBooking = () => {
  fetch('http://localhost:5988/deleteBooking/',{
        method: 'DELETE',// denpends upon your call POST or GET
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
          bookingId : bookingId
      })
      })
        .then(() => {
            fetchAvailableOpenings()
            getMyBooking()
  })
  .catch((error) =>{
      console.error(error);
  })
}
    ////////////////////////////////////////////////////////////////////////////////////
  const isBarber = () => {
    if(userObject.classType != 'User')
    {
      return  <TouchableOpacity onPress={ () => { props.navigation.navigate('barberOpenings', {username : props.route.params.username })} } >   
              <Text>Barber Options</Text>
              </TouchableOpacity>
    }
    else{
      return null;
    }
  }
      ////////////////////////////////////////////////////////////////////////////////////
  const getOpening = async() => {
    for(let openingObject of openings)
    {
      if(openingObject.id == openingId)
      {
        console.log(openingObject);
        setOpeningToBook(openingObject)
        setModalVisible(!modalVisible)
      }
    }
    return null;
  }
      ////////////////////////////////////////////////////////////////////////////////////
 const getMyBooking = async() => {
  try{
    const data = await fetch('http://localhost:5988/getMyBooking/'+props.route.params.username,{
                  method: 'GET',
                  headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin':'*'
                    }
                  });
    const myRequestedBookings = await data.json();
    console.log('dataJSON: ',myRequestedBookings);
    console.log(myRequestedBookings)
    setMyBookings(myRequestedBookings)
    console.log("JOBS DONE");
  }
  catch{console.error('could not get booking :(');}
 }
 /////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////
 const allOpenings = async() => {
  try{
    const data = await fetch('http://localhost:5988/allOpenings/',{
                  method: 'GET',
                  headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin':'*'
                    }
                  });
    const myRequestedAllOpenings = await data.json();
    console.log('dataJSON: ',myRequestedAllOpenings);
    setallOpeningsObjects(myRequestedAllOpenings)
  }
  catch{console.error('could not fetch all openings :(');}
 }
    ////////////////////////////////////////////////////////////////////////////////////
  const setBooking = async() => {
    console.log("booking created: ",props.route.params.username," ",barberUserName," ",openingId);
    try{
      await fetch('http://localhost:5988/setBookingV2', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin':'*'
            },
    body: JSON.stringify({
        username: props.route.params.username,
        barberUsername: barberUserName,
        openingId : openingId,
        openingInfo : openingInfo
      })
    }),
    setModalVisibleSuccess(!modalVisibleSuccess),
    fetchAvailableOpenings()
    getMyBooking()
    }
  catch(err) { console.error('catch Error: ',err);}

  }
   
    return(
        <View style={{height:'100%',marginHorizontal:'auto',borderStyle:'solid',borderColor:'green',borderWidth:2,flex:1,width:'100%',backgroundColor:'#6F8992'}}>
            <View>
            
            <Text style={styles.context}>Hello {props.route.params.username}</Text>

            <Text style={styles.context}>new openings</Text>
            </View>
            <View style={{height:'20%',borderStyle:'solid',borderColor:'black',borderWidth:2,flex:1,width:'80%',backgroundColor:'#6F8992'}}>
            <FlatList    //  flatList to show all barbers 
            data={barberList}//which data to use
            horizontal={true}
            renderItem= {barber => //what will be shown from the item
                        <View style={{height:'100',marginRight:'15px',flex:0.4,width:'500px',flexDirection:'column',alignContent:'center'}}>
                        <Text style={{color:'red',fontStyle:'italic',fontSize:'50px',marginHorizontal:'auto',marginVertical:'auto'}}>{barber.item.name}</Text>
                        <FlatList // flatlist to show opening details
                        data={openings}//which data to use
                        renderItem= {opening => //what will be shown from the item
                                      // <View style={{height:'100%',marginHorizontal:'auto',borderStyle:'solid',borderColor:'red',borderWidth:2,flexDirection:'column'}}>
                                        <TouchableOpacity onPress={()=>setOpeningId(opening.item.id)+setBarberUserName(opening.item.barberUserName)+getOpening()} style={styles.myButtonContainer}>
                                        <Text style={{color:'black',fontStyle:'italic',fontSize:'30px',marginHorizontal:'auto',marginVertical:'auto'}}>{opening.item.openingInfo}</Text>
                                        </TouchableOpacity>
                                    }
                        keyExtractor={opening => opening.id}//unique id for the item
                        />
                        </View>
            }
            keyExtractor={opening => opening.id}//unique id for the item
            />
            </View >
            <View style={styles.container}>
            <Text>My Bookings</Text>
            <FlatList // flatlist to show booking details
                        data={myBookings}//which data to use
                        renderItem= {booking => //what will be shown from the item

                                        <View style={styles.btn}>
                                        <TouchableOpacity onPress={()=>setBookingId(booking.item.id)+setOpeningInfo(booking.item.openingInfo)}>
                                        <Text style={styles.btnText}>{booking.item.openingInfo}</Text>
                                        <Text style={styles.btnText}>{booking.item.barberUsername}</Text>
                                        
                                        </TouchableOpacity>
                                        </View>

                                    }
                        keyExtractor={booking => booking.id}//unique id for the item
                        /> 
                        
            </View>
            <TouchableOpacity onPress={()=>{setModalVisibleDelete(!modalVisibileDelete)}}><Text style={styles.btn}>Delete Booking</Text></TouchableOpacity>
            <View >          
              {isBarber()}
            </View>
            







            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibileDelete}
                onRequestClose={() => {
                  setModalVisibleDelete(!modalVisibileDelete);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>are you sure you want to delete booking? </Text>
                    <Text>{openingInfo}</Text>

                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={()=>{deleteBooking(bookingId)+setModalVisibleDelete(!modalVisibileDelete)+setModalVisibleSuccess(!modalVisibleSuccess)+getMyBooking()}}
                    >
                      <Text style={styles.textStyle}>Delete</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisibleDelete(!modalVisibileDelete)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>















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
                    <Text style={styles.modalText}>are you sure you want to appoint</Text>
                    <Text> {openingToBook.openingInfo}</Text>

                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)+setBooking()}
                    >
                      <Text style={styles.textStyle}>appoint</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>




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
        borderStyle:'solid',
        borderColor:'blue',
        backgroundColor: '#F7567C',
        borderWidth:'2'
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
      myButtonContainer: {
        elevation: 8,
        backgroundColor: "#ABC0C7",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderStyle:'solid',
        opacity:'70%',
        borderWidth:2,
        marginBottom:'10px',
        flexDirection:'column'
        
      },
      myButtonContainerV2: {
        elevation: 8,
        backgroundColor: "#ABC0C7",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderStyle:'solid',
        opacity:'70%',
        borderWidth:2,
        marginBottom:'10px',
        flexDirection:'column',
        marginLeft:'50px'
      },
      myButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
});

export default Home;