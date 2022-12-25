import React, {useState, useEffect} from 'react';
import { View,Text,TextInput,Alert,TouchableOpacity,StyleSheet,Modal,Pressable,Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
const backEndURL = 'http://10.0.0.15:5988/';

// import { AutoSizeText, ResizeTextMode } from 'react-native-auto-size-text';

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
    const [barberToGet,setBarberToGet] = useState('')
    const [modalVisibleOpenings,setModalVisibleOpenings] = useState(false)
    const [imageUri,setImageUri] = useState('')

    //  console.log("props: "+JSON.stringify(props))
    //  console.log("barberList: "+JSON.stringify(barberList))
    //  console.log("userObject: ",userObject);
      console.log("props: ", props);
      console.log("myBookings: ",myBookings);
    // console.log("openingsList: "+JSON.stringify(openings))
    useEffect( ()=> {
            console.log("fetching allBarbers");
            fetch(backEndURL+'allBarbers',{
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
         }).then(fetchAvailableOpenings()).then(getMyBooking()).then(allOpenings()).then(fetchUser())},[])
         console.log(myBookings);
    ////////////////////////////////////////////////////////////////////////////////////
//   useEffect( async()=> {
//     try{
//       fetchUser()
//   }catch(err) {
//       console.error("ERROR: ",err);
//       console.error("did not find username in the function findByUserName");
// }},[])

    ////////////////////////////////////////////////////////////////////////////////////
  const fetchUser = async() => {
    await fetch(backEndURL+'findByUserName/'+props.route.params.username,{
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
        fetch(backEndURL+'findAllAvailableOpenings/',{
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
  fetch(backEndURL+'deleteBooking/',{
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
  console.log('fetching mybooking');
    try{
      const data = await fetch(backEndURL+'getMyBooking/'+props.route.params.username,{
                    method: 'GET',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                      }
                    })
      const myRequestedBookings = await data.json();
      setMyBookings(myRequestedBookings)
      console.log("JOBS DONE" + myRequestedBookings);
    }
    catch{console.error('could not get booking :(');}
 }
 /////////////////////////////////////////////////////////////////////////////////////////
 const getBarberOpenings = async() => {
  try{
    console.log("getting barber openings: ",barberToGet)
    const data = await fetch(backEndURL+'getAvailableOpenings/'+barberToGet,{
      method: 'GET',
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*'
        }
      });
      const myRequestedBarberOpenings = await data.json();
      setOpenings(myRequestedBarberOpenings);
  }catch{console.error('error fetching barbers openings');}
 }

 const getBarberOpeningsv2 = async(username) => {
  try{
    console.log("getting barber openings: ",barberToGet)
    const data = await fetch(backEndURL+'getAvailableOpenings/'+username,{
      method: 'GET',
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*'
        }
      });
      const myRequestedBarberOpenings = await data.json();
      setOpenings(myRequestedBarberOpenings);
  }catch{console.error('error fetching barbers openings');}
 }
 /////////////////////////////////////////////////////////////////////////////////////////
 const allOpenings = async() => {
  try{
    const data = await fetch(backEndURL+'allOpenings/',{
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
      await fetch(backEndURL+'setBookingV2', {
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
            <View style={{height:'35%',borderStyle:'solid',borderColor:'black',borderWidth:2,flex:1,width:'100%',backgroundColor:'#6F8992'}}>
            <FlatList    //  flatList to show all barbers 
            data={barberList}//which data to use
            horizontal={true}
            renderItem= {barber => //what will be shown from the item
                        <View style={{borderColor: '#bcbcbc',borderRadius: 10,width:200,padding:15,margin: 5,marginBottom:5,height: 200}}>
                          <TouchableOpacity style={{alignItems:'center'}} onPress={()=>{setBarberToGet(barber.item.username);setModalVisibleOpenings(!modalVisibleOpenings);getBarberOpeningsv2(barber.item.username)}}>
                            <Text  style={{color:'red',fontStyle:'italic',fontSize:30,marginHorizontal:'auto',marginVertical:'auto'}}>{barber.item.name}</Text>
                        <Image
                        style={styles.tinyLogo}
                        source={{uri:barber.item.imageuri}}
                        />
                        {console.log(barber.item.imageuri)}
                        </TouchableOpacity>
                        </View>
            }
            keyExtractor={opening => opening.id}//unique id for the item
            />
            </View>
            <View style={{flexDirection:'row'}}>

            <View style={{height:200,borderStyle:'solid',borderColor:'pink',borderWidth:2,width:400,backgroundColor:'#6F8992'}}>
            <Text>My Bookings</Text>
            <FlatList // flatlist to show booking details
                        horizontal={true}
                        data={myBookings}//which data to use
                        renderItem= {booking => //what will be shown from the item
                                        <View style={{borderStyle:'solid',borderColor:'yellow',borderWidth:2,backgroundColor:'#6F8992',margin:15,width:'90%',borderRadius:15}}>
                                        <TouchableOpacity onPress={()=>setBookingId(booking.item.id)+setOpeningInfo(booking.item.openingInfo)+setModalVisibleDelete(!modalVisibileDelete)}>
                                        <Text style={styles.myButtonText}>{booking.item.openingInfo}</Text>
                                        <Text style={styles.myButtonText}>{booking.item.barberUsername}</Text>
                                        
                                        </TouchableOpacity>
                                        
                                        </View>
                                    }
                        keyExtractor={booking => booking.id}//unique id for the item
                        /> 

            </View>

            
            </View>
            {/* <TouchableOpacity onPress={()=>{}}><Text style={styles.btn}>Delete Booking</Text></TouchableOpacity> */}
            <View style={styles.btn}>          
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


              <Modal animationType="slide"
                transparent={true}
                visible={modalVisibleOpenings}
                onRequestClose={() => {
                  setModalVisibleOpenings(!modalVisibleOpenings);
                }}
              >
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisibleOpenings(!modalVisibleOpenings)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
              <FlatList // flatlist to show available openings
                        data={openings}//which data to use
                        renderItem= {opening => //what will be shown from the item
                                      // <View style={{height:'100%',marginHorizontal:'auto',borderStyle:'solid',borderColor:'red',borderWidth:2,flexDirection:'column'}}>
                                        <TouchableOpacity onPress={()=>setOpeningId(opening.item.id)+setBarberUserName(opening.item.barberUserName)+setModalVisible(!modalVisible)+getBarberOpenings()} style={styles.myButtonContainer}>
                                        <Text style={{color:'black',fontStyle:'italic',fontSize:30,marginHorizontal:'auto',marginVertical:'auto'}}>{opening.item.openingInfo}</Text>
                                        </TouchableOpacity>
                                    }
                        keyExtractor={opening => opening.id}//unique id for the item
                        />
                        
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




              <Modal  // modal to show openings for the barber requested
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
        borderWidth:2
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
        marginBottom:10,
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
        marginBottom:10,
        flexDirection:'column',
        marginLeft:50
      },
      myButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      tinyLogo: {
        width: 50,
        height: 50,
        padding:35
      },
      textWrapper: {
        borderColor: '#bcbcbc',
        borderRadius: 10,
        width: '80%',
        margin: 16,
        height: 200,
        borderWidth: 2,
      },

});

export default Home;