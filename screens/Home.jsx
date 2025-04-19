import React, {useState, useEffect} from 'react';
import { View,Text,TouchableOpacity,StyleSheet,Modal,Pressable,Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { backEndURL } from './Entry';
import { LinearGradient } from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף

const Home = (props) => {
    const [barberList , setBarberList] = useState([]);
    const [openings , setOpenings] = useState([]);
    const [userObject, setUserObject] = useState({})
    const [barberUserName,setBarberUserName] = useState('')
    const [openingId,setOpeningId] = useState('')
    const [openingToBook,setOpeningToBook] = useState({})
    const [myBookings, setMyBookings] = useState([])
    const [allOpeningsObjects, setallOpeningsObjects] = useState([])
    const [openingInfo,setOpeningInfo] = useState([])
    const [bookingId,setBookingId] = useState('')
    const [barberToGet,setBarberToGet] = useState('')

    
    
    const [modalVisible,setModalVisible] = useState(false);
    const [modalVisibleSuccess,setModalVisibleSuccess] = useState(false)
    const [modalVisibileDelete,setModalVisibleDelete] = useState(false)
    const [modalVisibleOpenings,setModalVisibleOpenings] = useState(false)
    const [modalVisibleBookingFail,setModalVisibleBookingFail] = useState(false)

    useEffect( ()=> {  
         /////////////////////////////////////////////////////////////////////// קריאה לקבלת כל המשתמשים וטיפול בעדכון דף
            fetchBarbers().then(deleteOutDatedOpenings()).then(fetchAvailableOpenings()).then(fetchUser()).then(allOpenings()).then(getMyBooking())},[])
         
            

    ////////////////////////////////////////////////////////////////////////////////////
  const fetchUser = async() => {                                            // קבלת משתמש
    await fetch(backEndURL+'findByUserName/'+props.route.params.username,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      }
    }).then(response => response.json()).then(responseJSON => setUserObject(responseJSON))
    
    isBarber()
  }
   /////////////////////////////////////////////////////////////////////////////////////////
   const fetchBarbers = async() => {                           //קבלת כל הספרים
    await fetch(backEndURL+'allBarbers',{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      }
    }).then((response) => response.json()).then((responseJson) => {setBarberList(responseJson.filter(barber => barber.username != props.route.params.username)) })}
  /////////////////////////////////////////////////////////////////////////////////////////
  const deleteOutDatedOpenings = async() => {                   // מחיקת תורים ישנים
    await fetch(backEndURL+'deleteOutDatedOpenings/',{
      method: 'DELETE',   
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*'
        },
        
      }).then(fetchAvailableOpenings())
  }
  //////////////////////////////////////////////////////////////////////////////////////////
  
 const fetchAvailableOpenings = () => {                   // קבלת תורים פנויים
        fetch(backEndURL+'findAllAvailableOpenings/',{
        method: 'GET',
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
const deleteBooking = () => {  // מחיקת תור פנוי   
    fetch(backEndURL+'deleteBooking/',{
      method: 'DELETE',
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
  const isBarber = () => {                        // האם משתמש הוא ספר
    if(userObject.classType != 'User' && userObject.classType != 'undefined' && userObject.classType != 'null')
    {
      return  <TouchableOpacity style={styles.actionButton} onPress={ () => { props.navigation.navigate('barberOpenings', {username : props.route.params.username })} } >   
              <Ionicons name="chevron-back-circle-outline" size={30} color="white"></Ionicons>
              <Text style={styles.headerTitle} >Barber Options</Text>
              </TouchableOpacity>

    }
    else{
      return null;
    }
  }




 const getMyBooking = async() => {              // קבלת כל התורים הקבועים לאותו ספר

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
    }
    catch{console.error('could not get booking :(');}
 }
 /////////////////////////////////////////////////////////////////////////////////////////
 const getBarberOpenings = async() => {       //  קבלת תורים פנויים של ספר בלי קלט
  try{
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
 /////////////////////////////////////////////////////////////////////////////////////////
 const getBarberOpeningsv2 = async(username) => { // קבלת תורים פנויים של ספר עם קלט
  try{
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
 const allOpenings = async() => {                       // קבלת כל התורים הפנויים
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
    setallOpeningsObjects(myRequestedAllOpenings)
    
  }
  catch{console.error('could not fetch all openings :(');}
 }
    ////////////////////////////////////////////////////////////////////////////////////
  const setBookingMen = async( bookingType ) => {       // קביעת תור של גבר כלומר תור 1
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
        openingInfo : openingInfo,
        haircutType : bookingType
      })
    }),
    setModalVisibleSuccess(!modalVisibleSuccess),
    fetchAvailableOpenings(),
    getMyBooking()

    }
  catch(err) { console.error('catch Error: ',err);}
  }
 /////////////////////////////////////////////////////////////////////////////////////////
  const setBookingOther = async( bookingType ) => {       // קביעת תור של אישה כלומר בודקים תור קדימה אם אפשר לקבוע תור זה
    console.log("this is women booking")
    for (let i = 0; i < allOpeningsObjects.length-1; i++) {
      if(allOpeningsObjects[i+2] != undefined )
      {
        
        if(openingId === allOpeningsObjects[i].id)
        {
          if(allOpeningsObjects[i].availability == true && allOpeningsObjects[i+1].availability && allOpeningsObjects[i].endTime == allOpeningsObjects[i+1].startTime)
          {
            setBookingMen(bookingType) 
            break;
          }
          else {
            setModalVisibleBookingFail(!modalVisibleBookingFail);
            break;
          }
        }
      }
      else{
        setModalVisibleBookingFail(!modalVisibleBookingFail);
        
      }}
  }















    return(
                <LinearGradient colors={['#1A2980', '#26D0CE']} style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Hello {props.route.params.username}</Text>
              </View>
              <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Available Barbers</Text>
              </View>
              <View style={styles.shiftSection}>
              <FlatList
                data={barberList}
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                renderItem={({ item: barber }) => (
                  <View >
                    <TouchableOpacity 
                      onPress={() => {
                        setBarberToGet(barber.username);
                        setModalVisibleOpenings(!modalVisibleOpenings);
                        getBarberOpeningsv2(barber.username);
                      }}>
                        <View style={styles.shiftDay}>
                      <Image
                        style={styles.openingBarberImage}
                        source={{uri: barber.imageuri}}
                      />
                      <Text style={styles.bookingText}>{barber.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={barber => barber.id}
              />
              </View>
                            <Text style={styles.headerTitle}>My Bookings</Text>


                  {/*                          רשימת תורים שנקבעו ע"י המשתמש                    */}

                <View style={styles.shiftSection}>
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}
                    data={myBookings}
                    renderItem={({ item: booking }) => (
                      <View style={styles.bookingItem}>
                        <TouchableOpacity 
                          style={{alignItems: 'center'}} 
                          onPress={() => {
                            setBookingId(booking.id);
                            setOpeningInfo(booking.openingInfo);
                            setModalVisibleDelete(!modalVisibileDelete);
                          }}
                        >
                          <View>
                          <Text style={styles.bookingText}>Barber: {booking.barberUsername}</Text>
                          <Text style={styles.bookingText}>Date: {booking.openingInfo}</Text>
                          <Text style={styles.bookingText}>Price {booking.price}$</Text>

                          </View>
                        </TouchableOpacity>
                      </View>
                    )}keyExtractor={booking => booking.id}
                  />
                </View> 
                {isBarber()}      



                {/* ****************************                מחיקת תור שנקבע                *********************************** */}
              <Modal 
              animationType="fade"
              transparent={true}
              visible={modalVisibileDelete}
              onRequestClose={() => {
                setModalVisibleDelete(!modalVisibileDelete);
              }}
            >
                <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard}>
                <Text style={styles.modalTitle}>delete booking? </Text>
                    <Text style={styles.modalTitle}>{openingInfo}</Text>

                    <Pressable
                      style={styles.modalButton}
                      onPress={()=>{deleteBooking(bookingId)+setModalVisibleDelete(!modalVisibileDelete)+setModalVisibleSuccess(!modalVisibleSuccess)+getMyBooking()}}
                    >
                      <Ionicons name='trash-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                    </Pressable>
                  <Pressable
                    onPress={() => setModalVisibleDelete(!modalVisibileDelete)}
                    style={styles.modalCloseButton}
                  >
                    <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                  </Pressable>
              </LinearGradient>
            </Modal>

{/* ****************************                מודל הצגת תורים פנויים של ספר ספציפי               *********************************** */}

              <Modal animationType="fade"           
                transparent={true}
                visible={modalVisibleOpenings}
                onRequestClose={() => {
                  setModalVisibleOpenings(!modalVisibleOpenings);
                }}
              >

                    <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard}>
                    <View style={{flexDirection:'row'}}>
                    <Text style={styles.modalTitle}>Available Openings</Text>
                    </View>
                      <View style={{width:'100%',flex:1}}>
                    <FlatList
                      data={openings}            
                      style={{showsHorizontalScrollIndicator:'true'}}
                      renderItem={({ item: opening }) => (
                        <TouchableOpacity
                          onPress={() => {
                            setOpeningId(opening.id);
                            setBarberUserName(opening.barberUserName);
                            setModalVisible(!modalVisible);
                            getBarberOpenings();
                          }} 
                          style={styles.openingItem}
                        >
                          <Text style={styles.openingText}>{opening.openingInfo}</Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={opening => opening.id}
                    />
                    </View>
                    <View style={{flexDirection:'row',marginLeft:250,marginTop:10,alignItems:'flex-start'}}>
                    <Pressable onPress={() => setModalVisibleOpenings(!modalVisibleOpenings)}>
                     <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red'}}></Ionicons>
                    </Pressable>
                    </View>
                  </LinearGradient>  
              </Modal>
{/* ****************************                 מודל לקביעת סוג תור            *********************************** */}
              <Modal                     
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
              >
                <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Type of Haircut</Text>
                    <Text style={styles.modalText}>{openingToBook.openingInfo}</Text>
                    <View>
                    <Pressable
                        style={styles.openingItem}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          setBookingMen('MenHairCut');
                        }}
                      >
                        <Text style={styles.textStyle}>Men Haircut</Text>
                      </Pressable>
                      <Pressable
                        style={styles.openingItem}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          setBookingOther('WomenHairCut');
                        }}
                      >
                        <Text style={styles.textStyle}>Women Haircut</Text>
                      </Pressable>
                      <Pressable
                        style={styles.openingItem}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          setBookingOther('WomenHairDye');
                        }}
                      >
                        <Text style={styles.textStyle}>Women Hair Dye</Text>
                      </Pressable>
                      <Pressable onPress={() => setModalVisible(!modalVisible)}>
                        <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',marginLeft:200}}></Ionicons>
                      </Pressable>
                    </View>
                </LinearGradient>
              </Modal>
{/* ****************************                 הצלחה           *********************************** */}
              <Modal 
                animationType="fade"
                transparent={true}
                visible={modalVisibleSuccess}
                onRequestClose={() => {
                  setModalVisibleSuccess(!modalVisibleSuccess);
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard2}>
                                    <Text style={styles.modalTitle}>Success</Text>
                                    <Pressable
                                      style={styles.modalCloseButton}
                                      onPress={() => setModalVisibleSuccess(!modalVisibleSuccess)}
                                    >
                                      <Ionicons name='checkmark-circle-outline' style={{fontSize:50,color:'green',}}></Ionicons>
                                    </Pressable>
                </LinearGradient>
              </Modal>
{/* ****************************                 לא אפשרי לקבוע תור בגלל זמן תור          *********************************** */}
              <Modal 
                animationType="fade"
                transparent={true}
                visible={modalVisibleBookingFail}
                onRequestClose={() => {
                  setModalVisibleBookingFail(!modalVisibleBookingFail);
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Cant appoint booking!</Text>
                    <Text style={styles.modalTitle}>not enough time for this meeting</Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisibleBookingFail(!modalVisibleBookingFail)}>
                        <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',marginLeft:200}}></Ionicons>
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
    headerTitle: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom:'2px'
    },
    profileButton: {
      padding: 10,
    },
    contentSection: {
      flex: 0.5,
    },
    sectionCard: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      marginHorizontal:15
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
      padding: 20,
      marginLeft: 15,
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
      marginBottom:'15px'
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
      width: '25%',

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
      backgroundColor: 'rgba(255,255,255,0.2)',
      flex:0.5,
      borderRadius: 15,
      borderColor:'black',
      borderWidth:10,
      padding: 15,
      marginHorizontal:15,
      marginTop:100,
      justifyContent:'flex-start',
      alignSelf: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      paddingBottom:15
    },
    modalCard2: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      flexBasis:'auto',
      flexDirection:'row',
      width:'30%',
      borderRadius: 15,
      borderColor:'black',
      borderWidth:10,
      padding: 15,
      marginHorizontal:15,
      marginTop:100,
      alignItems:'center',
      alignSelf: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      paddingBottom:15
    },
    barberCard: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 15,
      borderColor:'black',
      borderWidth:2,
      padding: 15,
      marginHorizontal:15,
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
      alignItems: 'center'
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


export default Home;