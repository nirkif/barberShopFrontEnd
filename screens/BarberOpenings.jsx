import React, {useState, useEffect} from 'react';
import { View,Text,TextInput,TouchableOpacity,StyleSheet,Modal,Pressable,Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import { backEndURL } from './Entry'; 

const BarberOpenings = (props) => {             // יצירת אובייקטים
    const [onlyUsers,setOnlyUsers] = useState([]);
    const [allUsers,setAllUsers] = useState([]);
    const [myOpenings, setMyOpenings] = useState([]);
    const [daysOfWeek,setDaysOfWeek ] = useState([]);
    const [userObject, setUserObject] = useState({});
    const [barbersBookings,setBarbersBookings] = useState([])
    const [openingId,setOpeningId] = useState('');
    const [month, setMonth] = useState('');
    const [dayOfMonth, setDayOfMonth] = useState('');
    const [userID,setUserID] = useState('')
    const [imageURL,setImageURL] = useState('')
    const [newImageURL,setNewImageURL] = useState('')
    const [modalDelete,setModalDelete] = useState(false)
    const [modalDeleteAll,setModalDeleteAll] = useState(false)
    const [modalUserProfile,setModalUserProfile] = useState(false)
    const [modalPicUrl,setModalPicUrl] = useState(false)
    const [modalVisibleSuccess,setModalVisibleSuccess] = useState(false)
    const [modalVisibleAllUsers,setModalVisibleAllUsers] = useState(false)
    const [modalCreateDay,setModalCreateDay] = useState(false);

                                                                                                //USEEFFECT דבר זה גורם לפונקציה להתעדכן בזמן אמת
    useEffect(() => {fetchAllUsers();fetchMyOpenings();  fetchOnlyUsers();fetchBarbersBookings();fetchUser();},[]);  // ייבוא כל המידע הנחוץ 

    useEffect(() => {     
      if(myOpenings){
        const newDays = getUpcomingWeekDays().filter((dayInWeek)=>{   // פונקציה שמקבלת את השבוע הקרוב 
          var day = dayInWeek.split("-")[0];
          if(day.length < 2){                                             // להוספת 0 אם התאריך הוא ספרה1 
            day = "0"+day;
          }
          var month = dayInWeek.split("-")[1];                 
          for( var i = 0 ; i < myOpenings.length; i++){                 // בודק אם אין תורים פנויים ביום כלשהו. אם אין מוסיף אותו לרשימת משמרות, אחרת מדלג על אותו יום

            if(myOpenings[i].openingInfo.includes(`${month}-${day}`)){
              return false;
            }
          }
          return true;
        });
        setDaysOfWeek(newDays);
      }
    },[myOpenings]);

    useEffect(()=>{    // מעדכן בלייב את התמונת פרופיל 
      changeImage()
    },[imageURL])



    const getUpcomingWeekDays = ()=>{       // קבלת כל הימים מהיום עד הסופש הקרוב
      var ans = [];
      var day;
      var month;
      var year;
      var formatedDate;
      var today = new Date();
      day = today.getDate();
      month = today.getMonth() + 1;        // חודשים מתחילים מ0 אז מוסיפים 1 כדי שיציג תאריכים כמו אצלנו
      year = today.getFullYear();
      
      for(var i = 1 ; i < 8 ; i++){                       // מתחיל לבדוק תאריכים מהיום +1 
        var currDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
        day = currDate.getDate();          
        month = currDate.getMonth() + 1;
        year = currDate.getFullYear();
        formatedDate = `${day}-${month}-${year}`;

        if(currDate.getDay() == 5 || currDate.getDay() == 6  ){//אם זה סוף שבוע אז לא מוסיף אותו לרשימת המשמרות
          continue;
        }
        else{
          ans.push(formatedDate);
        }
      }
      setDaysOfWeek(ans);
      return ans;
    }
                                                                                          //בקשות REST
    const fetchMyOpenings = async () => {       //קבלת כל התורים הפנויים של המשתמש 
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
    }
    const fetchBarbersBookings = async() => {   //קבלת כל התורים הקבועים של הספר(משתמש) 
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

    const fetchUser = async() => {                                            // קבלת משתמש
      await fetch(backEndURL+'findByUserName/'+props.route.params.username,{
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        }
      }).then(response => response.json()).then(responseJSON => setUserObject(responseJSON))
    }


    const fetchAllUsers = async() => {                                            // קבלת כל המשתמשים
      await fetch(backEndURL+'allUsers',{
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        }
      }).then(response => response.json()).then(responseJSON => setAllUsers(responseJSON))
    }


    const fetchOnlyUsers = async()=>{      // קבלת כל המשתמשים הרגילים
      setOnlyUsers([]);
      fetch(backEndURL+'onlyUsers',{ 
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      }
    })
    .then((response_Only_Users) => response_Only_Users.json())
    .then((response_Json_Only_Users) => {
      setOnlyUsers(response_Json_Only_Users)
    })}

    

    const deleteOpening = async() => {              // מחיקת תור פנוי
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
    }
    const createDay = async() => {      // יצירת משמרת לספר
      try{
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
          fetchMyOpenings()
      }
      catch(err){console.error("error creating day");}
    }
  


  const addBarber = ()=>{       // הוספת ספר
    if(userID != ''){
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
    }).then((response) => response.json().then(fetchOnlyUsers()))
    }
  catch(err) { console.error('cannot add barber from user id');}
  }}

  const changeImage = async() => {         // שינוי תמונה
    if(imageURL != null && imageURL.length>6)
    {
      try{
         await fetch(backEndURL+'changeProfilePicture',{
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
        })
        fetchUser()
      }
      catch(err){ console.error('cannot change profile picture: ',err)}
    }
  }
  
const deleteAllOpenings = async() => {     // מחיקת כל התורים הפנויים

  try {
    Promise.all(
      myOpenings.map(async (opening) => {           // למחיקת כל התורים צריך לעשות זאת בצורה אסינכרונית כלומר צריך PROMISE
        await fetch(backEndURL+'deleteOpening/', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
          body: JSON.stringify({
            openingId: opening.id,
          })
        });
      })
    ).then(() => {
      // מרענן תורים פנויים אחרי המחיקות
      fetchMyOpenings();
      setModalVisibleSuccess(!modalVisibleSuccess)
    });
  } catch (error) {
    console.error('Error deleting openings:', error);
  }
}
  const isUserOnlyListEmpty = () => {               // פונקציה זאת בודקת אם יש משתמשים רגילים שאפשר להפוך לספרים
    if(onlyUsers.length == 0)
      return <Text style={styles.modalTitle}>No available users</Text>
      else{
          return  <View style={{flex:1}}>
                  <Text style={styles.modalTitle}>Add Barber</Text>
                      <FlatList 
                      style={{flex:1}}
                      data={onlyUsers}
                      renderItem = {user => 
                      <TouchableOpacity onPress={()=>{setUserID(user.item.id)+addBarber()}} style={styles.modalOption}>
                      <Text style={styles.modalText}>{user.item.username}</Text>
                      </TouchableOpacity>
                      }
                      keyExtractor={user => user.id}
                      />
                      </View> 
      }
  }


    return(     
        <LinearGradient 
        colors={['#1A2980', '#26D0CE']} 
        style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Barber Dashboard</Text>
          <TouchableOpacity style={styles.profileButton} onPress={() => {setModalUserProfile(!modalUserProfile)}}>
            <Ionicons name='settings-outline' size={40} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
  
        <View style={styles.contentSection}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>My Openings</Text>
            <FlatList
              horizontal
              data={myOpenings}
              renderItem={({item}) => (
                <TouchableOpacity 
                  style={styles.openingItem}
                  onPress={() => {
                    setOpeningId(item.id);
                    setModalDelete(true);
                  }}
                >
                  <Text style={styles.openingText}>{item.openingInfo}</Text>
                  <Ionicons name="trash" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={true}
            />
          </View>
  
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Booked Haircuts</Text>
            <FlatList
              horizontal
              data={barbersBookings}
              renderItem={({item}) => (
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingText}>{item.openingInfo}</Text>
                  <Text style={styles.bookingSubtext}>{item.username}</Text>
                  <Text style={styles.bookingSubtext}>{item.phoneNumber}</Text>
                 
                </View>
              )}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={true}
            />
          </View>
  
          <View style={styles.shiftSection}>
            <Text style={styles.sectionTitle}>Create Shifts</Text>
            <FlatList
              horizontal
              data={daysOfWeek}
              renderItem={({item}) => (
                <TouchableOpacity 
                  style={styles.shiftDay}
                  onPress={() => {
                    setMonth(item.split("-")[1]);
                    setDayOfMonth(item.split("-")[0]);
                    setModalCreateDay(!modalCreateDay)
                  }}
                >

                  
                  
                  <Text style={styles.shiftDayText}>{item}</Text>
                  <Text style={styles.shiftTimeText}>9 AM - 5 PM</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
  
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={()=>{setModalDeleteAll(!modalDeleteAll)}}
          >
            <Ionicons name="remove-circle" size={24} color="white" />
            <Text style={styles.actionButtonText}>Delete All Openings</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setModalVisibleAllUsers(true)}
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={styles.actionButtonText}>Add Barber</Text>
          </TouchableOpacity>
        </View>

{/* *********************************************************************************************     יצירת משמרת      1    */} 
            
            <Modal
                
                animationType="fade"
                transparent={true}
                visible={modalCreateDay}
                onRequestClose={() => {
                  setModalCreateDay(!modalCreateDay);
                }}
              >
                  <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard}>
                    <Text style={styles.modalTitle}>date selected: {dayOfMonth}/{month}</Text>
                    <Text style={styles.modalTitle}>Appoint shift from 9-5?</Text>
                    <Pressable
                      style={styles.modalButton}
                      onPress={() => setModalCreateDay(!modalCreateDay)+createDay()+setModalVisibleSuccess(!modalVisibleSuccess)}
                    >
                      <Text style={styles.modalText}>Appoint Shift</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setModalCreateDay(!modalCreateDay)}
                      style={styles.modalCloseButton}
                    >
                      <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                    </Pressable>
                </LinearGradient>
              </Modal>
{/* *********************************************************************************************     הצלחה   2      */}
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisibleSuccess}
                onRequestClose={() => {
                  setModalVisibleSuccess(!modalVisibleSuccess);
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Success</Text>
                    <Pressable
                      style={styles.modalCloseButton}
                      onPress={() => setModalVisibleSuccess(!modalVisibleSuccess)}
                    >
                      <Ionicons name='checkmark-circle-outline' style={{fontSize:50,color:'green',}}></Ionicons>
                    </Pressable>
                </LinearGradient>
              </Modal>
{/* *********************************************************************************************   להפוך משתמש לספר  3    */}
              <Modal animationType="fade"
                transparent={true}
                visible={modalVisibleAllUsers}
                onRequestClose={() => {
                  setModalVisibleAllUsers(!modalVisibleAllUsers);
                }}
              >
                  <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard}>
                  {isUserOnlyListEmpty()}
                       <Pressable 
                      onPress={() => setModalVisibleAllUsers(!modalVisibleAllUsers)}
                      style={styles.modalCloseButton}
                    >
                    <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                    </Pressable>
              </LinearGradient>
              </Modal>
{/* *********************************************************************************************  למחוק תור פנוי  4                */}
              <Modal animationType="fade"
                transparent={true}
                visible={modalDelete}
                onRequestClose={() => {
                  setModalDelete(!modalDelete);
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard}>
                  <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                    <Text style={styles.modalTitle}>Delete Opening?</Text>
                  </View >
                  
                  <Pressable
                      style={styles.modalCloseButton}
                      onPress={() => setModalDelete(!modalDelete)}
                    >
                      <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                    </Pressable>
                    <Pressable
                     style={styles.modalCheckButton}
                    onPress={() => deleteOpening()+setModalDelete(!modalDelete)+setModalVisibleSuccess(!modalVisibleSuccess)}>
                    <Ionicons name="trash" style={{fontSize:50,color:'green',}}></Ionicons>
                    </Pressable>
                    
                    </LinearGradient>
              </Modal>
              {/* *********************************************************************************************    5 למחוק את כל התורים הפנויים     */}
                <Modal
                animationType="fade"
                transparent={true}
                visible={modalDeleteAll}
                onRequestClose={() => {
                  setModalDeleteAll(!modalDeleteAll);
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980' ]} style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Delete all Openings? </Text>
                    <Pressable
                      style={styles.modalCloseButton}
                     onPress={()=> {setModalDeleteAll(!modalDeleteAll)}}
                    >
                      <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                    </Pressable>
                    <Pressable
                     style={styles.modalCheckButton}
                    onPress={() => deleteAllOpenings().then(setModalDeleteAll(!modalDeleteAll)).then(setModalVisibleSuccess(!modalVisibleSuccess))}>
                    <Ionicons name="trash" style={{fontSize:50,color:'green',}}></Ionicons>
                    </Pressable>
                </LinearGradient>
              </Modal>
              {/* *********************************************************************************************    6 פרופיל של משתמש    */}
              
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalUserProfile}
                onRequestClose={() => {
                  setModalUserProfile(!modalUserProfile);
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980' ]} style={styles.modalCard}>
                  <View style={{flexDirection:'row'}}>
                  <View style={{flexDirection:'column',alignItems:'flex-start'}}>
                    <Text style={styles.modalTitle}>User name</Text>
                    <Text style={styles.modalText}>{userObject.username}</Text>
                    <Text style={styles.modalTitle}>Phone number</Text>
                    <Text style={styles.modalText}>{userObject.phoneNum}</Text>
                    <Text style={styles.modalTitle}>private name</Text>
                    <Text style={styles.modalText}>{userObject.name}</Text>
                    </View >
                    <View style={{flexDirection:'column-reverse',paddingLeft:100}}>
                      <Pressable
                      style={styles.modalLogo}
                      onPress={()=> {setModalPicUrl(!modalPicUrl)}}>
                      <Image
                        style={styles.openingBarberImage}
                        source={{uri: userObject.imageuri}}
                      />
                      </Pressable>
                    </View>
                    </View>
                    <Pressable
                      style={styles.modalCloseButton}
                     onPress={()=> {setModalUserProfile(!modalUserProfile)}}>
                      <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                    </Pressable>
                </LinearGradient>
              </Modal>
              {/* *********************************************************************************************   7 החלפת תמונה   */}
                
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalPicUrl}
                onRequestClose={() => {
                  setModalPicUrl(!modalPicUrl);
                }}
              >
                <LinearGradient colors={['#26D0CE','#1A2980' ]} style={styles.modalCard}>
                  <Text style={styles.modalTitle}>Please copy the link of the photo. </Text>
                  <Text style={styles.modalTitle}>And copy in the input. </Text>
                <TextInput
                  value={newImageURL}
                  onChangeText={(text) => {setNewImageURL(text)}}
                  keyboardType="default"
                  placeholder='Paste you link here!'
                  style={styles.shiftSection}
                />

                <Pressable
                   style={styles.modalCheckButton}
                   onPress={() => setImageURL(newImageURL) + setModalPicUrl(!modalPicUrl)}>
                  <Ionicons name='checkmark-circle-outline' style={{fontSize:50,color:'green',}}></Ionicons>
                </Pressable>

                <Pressable
                  style={styles.modalCloseButton}
                  onPress={()=> {setModalPicUrl(!modalPicUrl)}}>
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

export default BarberOpenings;