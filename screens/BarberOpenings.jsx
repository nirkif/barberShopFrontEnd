import React, {useState, useEffect} from 'react';
import { View,Text,TextInput,Alert,TouchableOpacity,StyleSheet,Modal,Pressable,Image,ImageBackground } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

const BarberOpenings = (props) => {
    const [allUsers,setAllUsers] = useState([]);
    const [myOpenings, setMyOpenings] = useState([]);
    const [daysOfWeek,setDaysOfWeek ] = useState([]);
    const [userObject, setUserObject] = useState({});
    const [loading, setLoading] = useState(false);
    const [myOpeningsLength, setMyOpeningsLength] = useState(0); 
    const [openingId,setOpeningId] = useState('');
    const [month, setMonth] = useState('');
    const [dayOfMonth, setDayOfMonth] = useState('');
    const [modalVisible,setModalVisible] = useState(false);
    const [modalVisibleSuccess,setModalVisibleSuccess] = useState(false)
    const [modalVisibleAllUsers,setModalVisibleAllUsers] = useState(false)
    const [userID,setUserID] = useState('')
    const [newBarberName,setNewBarberName] = useState('')
    const [modalVisibleMakeBarber,setModalVisibleMakeBarber] = useState(false)
    const [imageURL,setImageURL] = useState('')
    const [barbersBookings,setBarbersBookings] = useState([])
    const [modalDelete,setModalDelete] = useState(false)
    //const backEndURL = 'http://10.0.0.16:5988/';


    // useEffect( ()=> {
    //   setAllUsers([]);
    //       fetch(backEndURL+'allUsers',{ 
    //       method: 'GET',// denpends upon your call POST or GET
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         'Access-Control-Allow-Origin':'*'
    //       }
    //     })
    // .then((response_All_Users) => response_All_Users.json())
    // .then((response_Json_All_Users) => {
    //   setAllUsers(response_Json_All_Users)
    // })
    // .catch((error) =>{
    //     console.error(error);
    // })},[])
    // useEffect( () => {
    //         //  fetch(backEndURL+'findByUserName/'+props.route.params.username,{
    //         //   method: 'GET',// denpends upon your call POST or GET
    //         //   headers: {
    //         //     Accept: 'application/json',
    //         //     'Content-Type': 'application/json',
    //         //     'Access-Control-Allow-Origin':'*'
    //         //   }
    //         // }).then(response => response.json()).then(responseJSON => setUserObject(responseJSON))
    //         console.log("fetching openings for"+props.route.params.username);
        

    //       })

    useEffect(() => {
      console.log('back end url: ',backEndURL)
      fetchMyOpenings();
      fetchAllUsers();
      fetchBarbersBookings();
      // getUpcomingWeekDays();
      console.log('array of the days (getUpcomingWeekDays Function: )',getUpcomingWeekDays());
    },[]);


    useEffect(() => {
      console.log(month, dayOfMonth);
      if(month && dayOfMonth){
        setModalVisible(!modalVisible)
      }
    },[month, dayOfMonth]);

    useEffect(() => {
      if(myOpenings){
        const newDays = getUpcomingWeekDays().filter((dayInWeek)=>{
          var day = dayInWeek.split("-")[0];
          if(day.length < 2){
            day = "0"+day;
          }
          var month = dayInWeek.split("-")[1];
          for( var i = 0 ; i < myOpenings.length; i++){

            if(myOpenings[i].openingInfo.includes(`${month}-${day}`)){
              console.log("this button is going off: ", `${month}-${day}`)
              return false;
            }
          }
          console.log("this button is staying: ", `${month}-${day}`)
          return true;
        });
        setDaysOfWeek(newDays);
      }
      
    },[myOpenings]);

    useEffect(()=>{
      changeImage()
      
    },[imageURL])

    const fetchMyOpenings = async () => {
      setLoading(true)
      const data = await fetch(backEndURL+'getOpenings/'+props.route.params.username,{
                    method: 'GET',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                      }
                    });
                    const myRequestedOpenings = await data.json();
                    setMyOpenings(myRequestedOpenings);
                    console.log(JSON.stringify(myOpenings)[0]);
                    setLoading(false);
                    setMyOpeningsLength(Math.ceil(myOpenings.length / 2))
    }
    const fetchBarbersBookings = async() => {
      const data = await fetch(backEndURL+'getBarberBooking/'+props.route.params.username,{
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
          }
        });
        const myRequestedBarbersBooking = await data.json();
        setBarbersBookings(myRequestedBarbersBooking)
    }


    const fetchAllUsers = async()=>{
      setAllUsers([]);
      fetch(backEndURL+'allUsers',{ 
      method: 'GET',// denpends upon your call POST or GET
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      }
    })
    .then((response_All_Users) => response_All_Users.json())
    .then((response_Json_All_Users) => {
      setAllUsers(response_Json_All_Users)
    })}

    const getUpcomingWeekDays = ()=>{
      var ans = [];
      var day;
      var month;
      var year;
      var formatedDate;
      var today = new Date();
      day = today.getDate();
      month = today.getMonth() + 1;
      year = today.getFullYear();
      formatedDate = `${day}-${month}-${year}`;
      ans.push(formatedDate)
      for(var i = 1 ; i < 7 ; i++){
        var currDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
        day = currDate.getDate();
        month = currDate.getMonth() + 1;
        year = currDate.getFullYear();
        formatedDate = `${day}-${month}-${year}`;

        if(currDate.getDay() == 5 || currDate.getDay() == 6){//if its weekend then skip
          continue;
        }
        else{
          ans.push(formatedDate);
        }
      }
      console.log(ans);
      setDaysOfWeek(ans);
      return ans;
    }

    const deleteOpening = async() => {
      console.log("openingID to delete: ",openingId);
      if(openingId !== ''){
        await fetch(backEndURL+'deleteOpening/',{
        method: 'DELETE',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
          },
          body: JSON.stringify({
            openingId: openingId,
          })
        });
        fetchMyOpenings()
      }
      else{
        console.log("opening id is not defined");
      }
    }
    const createDay = async() => {
      try{
        console.log("sending request with month: ", month, "dayInMonth: ", dayOfMonth)
        await fetch(backEndURL+'addOpeningsV2/',{
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
              userName: props.route.params.username,
              startTime: "9",
              endTime : "17",
              month : month,
              dayOfMonth : dayOfMonth
            })
          });
          console.log("day created successfully for: ",props.route.params.username);
          fetchMyOpenings()
      }
      catch(err){console.error("error creating day");}
    }
  

    
  const addOpening = () => {
    console.log("adding opening ");
        try{
            fetch(backEndURL+'addOpening', {
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

  const addBarber = ()=>{
    try{
      fetch(backEndURL+'addBarberFromUserId', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      },
    body: JSON.stringify({
        id:userID
      })
    }).then((response) => response.json())
    }
  catch(err) { console.error('cannot add barber from user id');}
  }
  const changeImage = () => {
    if(imageURL != null && imageURL.length>6)
    {
      try{
        fetch(backEndURL+'changeProfilePicture',{
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*'
          },
          body: JSON.stringify({
            username: props.route.params.username,
            imageUri: imageURL
          })
        }).then(props.navigation.navigate('Home', {username : props.route.params.username }))

      }
      catch(err){ console.error('cannot change profile picture: ',err)}
    }
  }


    return(
        <View style = {{height: '100%', width: '100%'}}>
          <ImageBackground source={require('../assets/barberShopBarberOpenings.jpg')} resizeMode="cover" style={{flex:1,justifyContent:"center",alignItems:'center'}}>
           <View style={{justifyContent:"center",alignItems:'center',flexDirection:'column',width:'100%',height:'100%',flex:1}}>
           <Text style={{fontStyle:'italic',fontSize:40,alignSelf:'center',color:'#2968C7',fontWeight:'bold',textShadowOffset:{width:2,height:2},textShadowRadius:10,textShadowColor:'#EBFF61'}}>Barbers Options</Text>
            <View style={{flexDirection:'column',width:'100%',height:'100%',flex:1}}>
            <View style = {{height: '100%', width: '100%',backgroundColor: '#B0E0E6',borderWidth:2,borderColor:'black',borderRadius: 12,flex:0.5, flexDirection: 'column', opacity:0.6, paddingHorizontal: 60 ,marginBottom:10}}> 
              <Text style={styles.myButtonText}>My Openings</Text>
                  <FlatList // flatlist to show opening details // blue view that contains my openings
                         contentContainerStyle={{alignSelf: 'flex-start'}}
                         numColumns={1}
                         paddingHorizontal={10}
                         paddingVertical={30}
                         alignSelf={'center'}
                        //  marginLeft={10}
                        //  marginBottom={10}
                         showsVerticalScrollIndicator={true}
                         //showsHorizontalScrollIndicator={false}
                        data={myOpenings}//which data to use
                        renderItem= {opening => //what will be shown from the item
                        <View style={styles.myButtonContainerV2}>
                        <TouchableOpacity onPress={()=>setOpeningId(opening.item.id)+console.log(opening.item.id)+setModalDelete(!modalDelete)}>

                            <Text style={styles.myButtonText}>{opening.item.openingInfo}</Text>

                        </TouchableOpacity>
                        </View>                     
                                    }
                        keyExtractor={opening => opening.id}//unique id for the item
                        />  
              {/* <TouchableOpacity onPress={deleteOpening} style={{elevation: 8,
              backgroundColor: "#ABC0C7",
              borderRadius: 12,
              paddingVertical: 5,
              // paddingHorizontal: 12,
              borderStyle:'solid',
              opacity:0.8,
              // borderWidth:2,
              // marginBottom:10,
              flexDirection:'column',
        //  marginLeft:10
         }}><Text style = {styles.myButtonText}>Delete opening</Text></TouchableOpacity> */}
            </View>
            {/* *********************************************************************************************************** */}

            <View style = {{height: '100%', width: '100%',backgroundColor: 'blue',borderWidth:2,borderColor:'black',borderRadius: 12,flex:0.5,opacity:0.6, paddingHorizontal: 60}}> 
            <Text style={styles.myButtonText}>My Booked haircuts</Text>
                  <FlatList // flatlist to show opening details // blue view that contains my openings
                         contentContainerStyle={{alignSelf: 'flex-start'}}
                         numColumns={1}
                         paddingHorizontal={50}
                         marginLeft={10}
                         marginBottom={10}
                        data={barbersBookings}//which data to use
                        renderItem= {booking => //what will be shown from the item
                        <View style={styles.myButtonContainerV2}>
                            <Text style={styles.myButtonText}>{booking.item.openingInfo}</Text>
                            <Text style={styles.myButtonText}>{booking.item.username}</Text>
                        </View>                     
                                    }
                        keyExtractor={booking => booking.id}//unique id for the item
                        />  
            </View>




            </View>
            <View style={{width: '100%',backgroundColor: '#B0E0E6',borderRadius: 12,flex:0.7,opacity:0.6,alignItems:'center',height:'20%'}}> 
            <TouchableOpacity style={styles.btn} onPress={()=>{ setModalVisibleAllUsers(!modalVisibleAllUsers)} }>
                  <Text style={styles.myButtonText}>add Barber</Text>
                  </TouchableOpacity>
            <TextInput
                style={styles.input}
                keyboardType="default"
                value={imageURL}
                onChangeText={(imageURL) => setImageURL(imageURL)}
                placeholder='Enter url to change profile picture'/>
              <Text style={styles.myButtonText}>Shifts maker</Text>
            <FlatList // dates of upcoming week to create day of work
                        data={daysOfWeek}//which data to use
                        horizontal={true}
                        renderItem= {day=> //what will be shown from the item
                            <TouchableOpacity onPress={() => {
                              //console.log("try to fetch days/months: ", day.item)
                              setMonth(day.item.split("-")[1])
                              setDayOfMonth(day.item.split("-")[0])
                              //console.log("month: ",month,"\nday: ",dayOfMonth)
                              //setModalVisible(!modalVisible)
                            }
                              } style={{borderStyle:'solid',borderColor:'black',borderRadius:12,borderWidth:3,height:90,margin:10}}>
                              {console.log('day.item: ',day.item)}
                            <Text style={styles.myButtonText}>{day.item}</Text>
                            <Text style={styles.myButtonText}>9 - 17</Text>
                            <Text style={styles.myButtonText}>Create shift</Text>
                            </TouchableOpacity>}
                        keyExtractor={(index) => index.toString()}//unique id for the item
                        />  
              </View>
            </View>



            
{/* ************************************************************************************************************* */}
            
                    


{/* ********************************************************************************************* */}

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
                    <Text style={styles.modalText}>date selected: {month}/{dayOfMonth}</Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)+createDay()+setModalVisibleSuccess(!modalVisibleSuccess)}
                    >
                      <Text style={styles.textStyle}>Create Day</Text>
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
{/* ********************************************************************************************* */}
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

{/* ********************************************************************************************* */}

              <Modal
                animationType="slide"
                visible={modalVisibleMakeBarber}
                onRequestClose={() => {
                  setModalVisibleMakeBarber(!modalVisibleMakeBarber);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>add barber {newBarberName} ?</Text>
                    <Text style={styles.modalText}>ID:  {userID}</Text>
                    <TouchableOpacity onPress={ ()=>{ try{setModalVisibleMakeBarber(!modalVisibleMakeBarber)+addBarber()+setModalVisibleSuccess(!modalVisibleSuccess)}catch{console.error('cannot add barber')}}}>
                      <Text style={styles.textStyle}>Add Barber</Text>
                    </TouchableOpacity>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisibleMakeBarber(!modalVisibleMakeBarber)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

{/* ************************************************************************************************************************ */}

              <Modal animationType="slide"
                transparent={true}
                visible={modalVisibleAllUsers}
                onRequestClose={() => {
                  setModalVisibleAllUsers(!modalVisibleAllUsers);
                }}
              >
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisibleAllUsers(!modalVisibleAllUsers)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                    <Text style={{color:'blue',fontStyle:'italic',fontSize:40}}>Add Barber</Text>
                        <FlatList 
                        data={allUsers}
                        renderItem = {user =>   
                        <TouchableOpacity onPress={()=>{console.log(user.item.classType)+setUserID(user.item.id)+setNewBarberName(user.item.username)+setModalVisibleAllUsers(!modalVisibleAllUsers)+setModalVisibleMakeBarber(!modalVisibleMakeBarber)}} style={styles.myButtonContainer}>
                        <Text style={{color:'black',fontStyle:'italic',fontSize:30,marginHorizontal:'auto',marginVertical:'auto'}}>{user.item.username}</Text>
                        </TouchableOpacity>
                        }
                        keyExtractor={user => user.id}
                        />

              </Modal>






              <Modal animationType="slide"
                transparent={true}
                visible={modalDelete}
                onRequestClose={() => {
                  setModalDelete(!modalDelete);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalDelete(!modalDelete)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>

                    <Pressable
                     style={[styles.button, styles.buttonClose]}
                    onPress={() => deleteOpening()+setModalDelete(!modalDelete)+setModalVisibleSuccess(!modalVisibleSuccess)}>
                    <Text style={{color:'black',fontStyle:'italic',fontSize:30,marginHorizontal:'auto',marginVertical:'auto'}}>Delete Opening?</Text>
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
      alignSelf:'center',
      width: '40%',
      height:'10%',
      marginTop: 12,
      alignItems: 'center',
      // paddingVertical: 20,
      borderRadius: 30,
      backgroundColor: '#629BEF',
      },
      row: {
        height: '50%',
        width: '50%',
        backgroundColor: '#B0E0E6',
        borderWidth:2,
        borderColor:'black',
        borderRadius: 12,
        flex:0.5,
        opacity:0.8
      },
      row2: {
        height: '10%',
        width: '58%',
        backgroundColor: '#B0E0E6',
        borderRadius: 12,
        flex:0.3
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
        width: '80%',
        paddingVertical: 20,
        borderRadius: 30,
        paddingHorizontal: 20,
        fontSize: 18,
        backgroundColor: '#FCFCFC',
        alignSelf:'center'
      },

      myButtonContainerV2: {
        elevation: 8,
        backgroundColor: "#ABC0C7",
        borderRadius: 12,
        paddingVertical: 30,
         paddingHorizontal: 12,
        borderStyle:'solid',
        opacity:0.8,
        borderWidth:2,
         marginBottom:10,
        flexDirection:'column',
         marginLeft:10
      },
      myButtonText: {
        fontSize: 18,
        color: "#02468A",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
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
        flexDirection:'row',
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: '#8DCEEF',
        borderRadius: 20
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
        color: "black",
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
        opacity:0.8,
        borderWidth:2,
        marginBottom:10,
        flexDirection:'column'
        
      },


});

export default BarberOpenings;