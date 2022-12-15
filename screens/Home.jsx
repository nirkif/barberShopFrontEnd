import React, {useState, useEffect} from 'react';
import { View,Text,TextInput,Alert,TouchableOpacity,StyleSheet,Modal,Pressable,Image,ImageBackground,ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף


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
    const [loading,setLoading] = useState(false)
    const backEndURL = 'http://localhost:5988/'
    useEffect( async()=> {
            console.log("fetching allBarbers");
            setLoading(true);
            await fetch(backEndURL+'allBarbers',{
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
         }).then(fetchAvailableOpenings()).then(getMyBooking()).then(allOpenings()).then(fetchUser()).then(setLoading(false))},[])
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
              <Text style={styles.btnText}>Barber Options</Text>
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

        <View style={{height:'100%',marginHorizontal:'auto',borderWidth:2,flex:1,width:'100%'}}>
          <ImageBackground source={require('../assets/barberShopPageCover.jpg')} resizeMode="cover" style={{flex:1,justifyContent:"center"}}>
          <Text style={{fontStyle:'italic',fontSize:50,alignSelf:'center',color:'#2968C7',fontWeight:'bold',textShadowOffset:{width:2,height:2},textShadowRadius:10,textShadowColor:'#EBFF61'}}>Hello {props.route.params.username}</Text>
          <Text style={{fontStyle:'italic',fontSize:40,alignSelf:'center',color:'#2968C7',fontWeight:'bold',textShadowOffset:{width:2,height:2},textShadowRadius:10,textShadowColor:'#EBFF61'}}>new openings</Text>
            <View style={{height:'25%',flex:0.8,width:'100%',justifyContent:'space-between'}}>
              {
                loading ? <React.Fragment><ActivityIndicator color="#F7567C" size="large"></ActivityIndicator></React.Fragment> : 
              
            <FlatList    //  flatList to show all barbers 
            data={barberList}//which data to use
            horizontal={true}
            renderItem= {barber => //what will be shown from the item
                        <View style={{borderRadius: 50,width: '500px',margin: 20,height: 200,backgroundColor:'white',alignSelf:'flex-start',flex:1,opacity:0.8}}>
                          <ImageBackground source={require('../assets/scissorLogo.png')} resizeMode="contain" style={{flex:1,justifyContent:"center"}}>
                          <TouchableOpacity style={{alignContent:'flex-start',flexDirection:'row',padding:20,height:'100%'}} onPress={()=>{setBarberToGet(barber.item.username);setModalVisibleOpenings(!modalVisibleOpenings);getBarberOpeningsv2(barber.item.username)}}>
                            <View style={{flex:1}}>
                            <Text style={{fontStyle:'italic',fontSize:scale(15),alignSelf:'center',color:'#2968C7',fontWeight:'bold'}}>{barber.item.name}</Text>
                            </View>
                            <View style={{flex:0.3}}>
                            <Image
                        resizeMode='contain'
                        style={styles.tinyLogo}
                        source={{uri:barber.item.imageuri}}
                        />
                            </View>
                        </TouchableOpacity>
                        </ImageBackground>
                        </View>
            }
            keyExtractor={opening => opening.id}//unique id for the item
            />
            }
            </View>
          
            <View style={{flexDirection:'row'}}>

            <View style={{height:'100%',borderStyle:'solid',borderColor:'pink',borderWidth:2,width:'80%',flex:1}}>
            <Text style={{fontStyle:'italic',fontSize:20,alignSelf:'center',color:'#2968C7',fontWeight:'bold',textShadowOffset:{width:2,height:2},textShadowRadius:10,textShadowColor:'#EBFF61'}}>My Bookings</Text>
            <FlatList // flatlist to show booking details
                        horizontal={true}
                        data={myBookings}//which data to use
                        renderItem= {booking => //what will be shown from the item
                                  <View style={{flex:1,margin:10,height:175,width:175,justifyContent:"center",borderRadius:20,borderWidth:1}}>
                                        <ImageBackground source={require('../assets/bookingsLogo.png')} resizeMode="contain" >
                                        <TouchableOpacity onPress={()=>setBookingId(booking.item.id)+setOpeningInfo(booking.item.openingInfo)+setModalVisibleDelete(!modalVisibileDelete)}>
                                        <Text style={{fontStyle:'italic',fontSize:scale(10),alignSelf:'center',color:'#2968C7',fontFamily:'italic',fontWeight:'bold',marginBottom:'45%'}}>{booking.item.openingInfo}</Text>
                                        <Text style={{fontStyle:'italic',fontSize:scale(12),alignSelf:'center',color:'#2968C7',fontFamily:'italic',fontWeight:'bold'}}>{booking.item.barberUsername}</Text>
                                        </TouchableOpacity>
                                        </ImageBackground>
                                  </View>
                                    }
                        keyExtractor={booking => booking.id}//unique id for the item
                        /> 

            </View>

            
            </View>
            {/* <TouchableOpacity onPress={()=>{}}><Text style={styles.btn}>Delete Booking</Text></TouchableOpacity> */}
            <View style={styles.btnv2}>          
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
                                        <Text style={{color:'black',fontStyle:'italic',fontSize:'30px',marginHorizontal:'auto',marginVertical:'auto'}}>{opening.item.openingInfo}</Text>
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
        borderStyle:'solid',
        borderColor:'blue',
        backgroundColor: '#F7567C',
        borderWidth:'2'
      },
      btnv2: {
        alignSelf:'center',
        width: '25%',
        marginTop: 12,
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 30,
        backgroundColor: '#629BEF',
      },
      btnText: {
        fontSize: 18,
        color: '#000000',
        fontWeight: '700',
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
      },
      tinyLogo: {
        width: 100,
        height: 100,
        borderRadius:1000
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