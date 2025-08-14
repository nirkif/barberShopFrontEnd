import React, {useState, useEffect} from 'react';
import { reloadAsync } from 'expo-updates';
import { View,Text,TextInput,TouchableOpacity,StyleSheet,Modal,Pressable,Image,Platform } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { backEndURL } from './Entry';
import { LinearGradient } from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף
const ManagerOptions = (props) => {
    const [womenHairCutPrice,setWomenHairCutPrice] = useState();
    const [womenHairDyePrice,setWomenHairDyePrice] = useState();
    const [menHairCutPrice,setMenHairCutPrice] = useState();
    const [tmpWomenHairDyePrice,setTmpWomenHairDyePrice] = useState();
    const [tmpWomenHairCutPrice,setTmpWomenHairCutPrice] = useState();
    const [tmpMenHairCutPrice,SetTmpMenHairCutPrice] = useState();
    const [barberList , setBarberList] = useState([]);
    const [onlyUsers,setOnlyUsers] = useState([]);
     const [allBookings,setAllBookings] = useState([])
    const [allItems,setAllItems] = useState([])
    const [profit,SetProfit] = useState('')
    const [monthlyProfit,setMonthlyProfit]= useState('')
    const [dailyProfit,setDailyProfit]= useState('')
    const [itemId,setItemId] = useState('')
    const [item,setItem] = useState({name: '',price: 0,quantity: 0,supplier: '',lastUpdated: ''})
    const [itemName,setItemName] = useState('')
    const [itemSupplier,setItemSupplier] = useState('')
    const [itemPrice,setItemPrice] = useState('')
    const [itemQuantity,setItemQuantity] = useState('')
    const [pricesToString,setPricesToString] = useState('No Data');
    const [userID,setUserID] = useState('')
    const [userToDeleteID,setUserToDelete] = useState('');
    const [notEmptyString,setNotEmptyString] = useState(false)
    const [newItemQuantity,setNewItemQuantity] = useState(0);



    const [modalPricesChangeSuccess,setModalPricesChangeSuccess] = useState(false);
    const [modalSuccess,setModalSuccess] = useState(false);
    const [modalChangePrice,setModalChangePrice] = useState(false);
    const [modalVisibleAllUsers,setModalVisibleAllUsers] = useState(false);
    const [modalVisibleAllBarbers,setModalVisibleAllBarbers] = useState(false);
    const [modalTryAgain,setModalTryAgain] = useState(false);
    const [modalStatisics,setModalStatistics] = useState(false);
    const [modalItems,setModalItems] = useState(false);
    const [modalItemInfo,setModalItemInfo] = useState(false);
    const [modalCreateItem,setModalCreateItem] = useState(false);
    const [modalUpdateQuantity,setModalUpdateQuantity] = useState(false);

    // ***********************************************************************************************************************************************************************
    const dataNotEmpty = () => {                                  // בדוק אם המשתנים של האובייקט לא UNDIFNED
      if(itemName && itemSupplier && itemPrice && itemQuantity)
      {
        setNotEmptyString(true)
        setModalSuccess(!modalSuccess)
      }
       setModalTryAgain(!modalTryAgain)
    }
     // ***********************************************************************************************************************************************************************
    const setItemAndGoToModal = async(id) => {   // מעביר אותך למודאל של פרטי המוצר
      
      try{
        setItemId(id);
         const newItem = await getItemById(id);
         setModalItemInfo(!modalItemInfo)
      }catch(err){return err}
         
        
      }
// ***********************************************************************************************************************************************************************
      const newItemAndRefresh = async()=>  // מייצר מכשיר 
      {
        try{
        dataNotEmpty()
        if(notEmptyString)
          {
        newItem()
        setModalCreateItem(!modalCreateItem)
      }
      {return err;}
        }catch(err){return err}
      }
 // ***********************************************************************************************************************************************************************
     const newItem = async() => {      // יצירת משמרת לספר
          try{
            const response = await fetch(backEndURL+'newItem/',{
              method: 'POST',
              headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin':'*'
                },
                body: JSON.stringify({
                  name: itemName,
                  supplier: itemSupplier,
                  price : itemPrice,
                  quantity : itemQuantity
                })
              })
              const responseJSON = await response.json();
              setItemName(''),
              setItemSupplier(''),
              setItemPrice(''),
              setItemQuantity('')
              setAllItems(responseJSON)
              return responseJSON
          }
          catch(err){console.error("error creating new item");}
        }
      // ***********************************************************************************************************************************************************************
      const deleteItem = async(itemId) => { // מוחק מוצר ספציפי לפי ID
        try{
        const response = await fetch(backEndURL+'DeleteItemByID/'+item.id,{
        method:'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
        }
        
      })
        const responseJSON = await response.json();
        setAllItems(responseJSON)
        return responseJSON
        }catch(err){return err}
      }   
      // ***********************************************************************************************************************************************************************
      const getItemById = async(id) => { // מקבל מוצר ספציפי לפי ID
        try{
        const response = await fetch(backEndURL+'getItemByID/'+itemId,{
        method:'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
        }
        
      })
        const responseJSON = await response.json();
        setItem(responseJSON)
        return responseJSON
        }
      catch(err){return err}
      
    }

    // ***********************************************************************************************************************************************************************
    const getAllItems = async() => { // קבלת כל הפריטים
      await fetch(backEndURL+'getAllItems',{
        method:'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
        }
      }).then((response) => response.json()).then((responseJSON) => {setAllItems(responseJSON)})
    }
    // ***********************************************************************************************************************************************************************
    const getAllBookings = async() => { // קבלת כל התורים התפוסים
      await fetch(backEndURL+'getAllBookings',{
        method:'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
        }
      }).then((response) => response.json()).then((responseJSON) => {setAllBookings(responseJSON)})
    }

    
    // ***********************************************************************************************************************************************************************
    const fetchBarbers = async() => {                 //קבלת כל הספרים
        await fetch(backEndURL+'allBarbers',{
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          }
        }).then((response) => response.json()).then((responseJson) => {setBarberList(responseJson.filter(barber => barber.username != props.route.params.username)) })}
    // ***********************************************************************************************************************************************************************
    const getProfit = async() => { // קבלת רווח כללי
        try{
        const data = await fetch(backEndURL+'getProfit/',{
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
          }
        });
        const updatedProfit = await data.json();
        
        SetProfit(updatedProfit);
        }
        catch(err){return err;}
    }
    // ***********************************************************************************************************************************************************************
   
    const getMonthlyProfit = async() => { // קבלת רווח חודשי
        try{
        const data = await fetch(backEndURL+'getMonthlyProfit/',{
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
          }
        });
        const updatedProfit = await data.json();
        
        setMonthlyProfit(updatedProfit);
        }
        catch(err){return err;}
    }
    // ***********************************************************************************************************************************************************************

     const getDailyProfit = async() => { // קבלת רווח יומי
        try{
        const data = await fetch(backEndURL+'getDailyProfit/',{
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
          }
        });
        const updatedProfit = await data.json();
        
        setDailyProfit(updatedProfit);
        }
        catch(err){return err;}
    }
    // ***********************************************************************************************************************************************************************
    const getDatedPrices = async() =>{ // קבלת המחירים העדכניים
        try{
        const data = await fetch(backEndURL+'allPriceObject',{
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
          }
        });
        const PriceObjectArray = await data.json();
        if(PriceObjectArray && PriceObjectArray.length > 0)
        {
        setPricesToString(PriceObjectArray[0]);
        }
        else{
            setPricesToString('No Data');
            getDatedPrices();
        }
        
        }
        catch(err){return err;}
    }
    // ***********************************************************************************************************************************************************************
    const updateItemQuantity = () => { // עדכון כמות של פריט
      try{
          
          fetch(backEndURL+'updateItemQuantityByID', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
        body: JSON.stringify({
            id:itemId,
            quantity:newItemQuantity
          })
        }).then((response) => response.json()).then((responseJSON) => {setAllItems(responseJSON)})
        }
      catch(err) { console.error(err);}
    }
    // ***********************************************************************************************************************************************************************
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
        }).then((response) => response.json().then(fetchOnlyUsers())).then(fetchBarbers()).then(setModalSuccess(!modalSuccess))
        }
      catch(err) { console.error(err);}
      }}
    // ***********************************************************************************************************************************************************************
      const addUserFromBarberId = ()=>{       // החזרת ספר ללקוח
        if(userToDeleteID != ''){
        try{
          
           fetch(backEndURL+'addUserFromBarberId', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
          },
        body: JSON.stringify({
            id:userToDeleteID
          })
        }).then((response) => response.json().then(fetchBarbers()))
        if(response.json() === null)
        {
          addUserFromBarberId
        }
        else{
          setModalSuccess(!modalSuccess)
        }
        }
      catch(err) { setModalTryAgain(!modalTryAgain);}
      }}

      
    // ***********************************************************************************************************************************************************************
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
    // ***********************************************************************************************************************************************************************
          const isUserOnlyListEmpty = () => {               // פונקציה זאת בודקת אם יש משתמשים רגילים שאפשר להפוך לספרים
              if(onlyUsers.length == 0)
                return <Text style={styles.modalTitle}>No available users</Text>
                else{
                    return   <View style={styles.bookingListContainer}>
                            <Text style={styles.modalTitle}>Add Barber</Text>
                            <View style={styles.tableHeaderRow}>
                                          <View style={styles.customerNameColumn}>
                                            <Text style={styles.columnHeaderText}>username</Text>
                                          </View>
                                          <View style={styles.barberNameColumn}>
                                            <Text style={styles.columnHeaderText}>name</Text>
                                          </View>
                                          <View style={styles.priceDisplayColumn}>
                                            <Text style={styles.columnHeaderText}>phone</Text>
                                            <Text style={styles.columnHeaderText}>number</Text>
                                          </View>
                                        </View>
                              

                                <FlatList 
                                data={onlyUsers}
                                renderItem = {user => 
                                <TouchableOpacity onPress={()=>{setUserID(user.item.id)+addBarber()}}>
                                <View style={styles.bookingDataRow}>
                                <View style={styles.customerNameColumn}>
                                  <Text style={styles.modalText1}>{user.item.username}</Text>
                                </View>
                                <View style={styles.barberNameColumn}>
                                  <Text style={styles.modalText1}>{user.item.name}</Text>
                                </View>
                                <View style={styles.priceDisplayColumn}>
                                  <Text style={styles.modalText3}>{user.item.phoneNum}</Text>
                                </View>
                              </View>
                                </TouchableOpacity>
                                }
                                keyExtractor={user => user.id}
                                />
                                </View> 
                }
            }
                // ***********************************************************************************************************************************************************************
             const isBarberOnlyListEmpty = () => {               // פונקציה זאת בודקת אם יש משתמשים מסוג ספר שאפשר להפוך למשתמש
              if(barberList.length == 0)
                return <Text style={styles.modalTitle}>No available users</Text>
                else{
                    return  <View style={styles.bookingListContainer}>
                            <Text style={styles.modalTitle}>Remove Barber</Text>
                            <View style={styles.tableHeaderRow}>
                                          <View style={styles.customerNameColumn}>
                                            <Text style={styles.columnHeaderText}>username</Text>
                                          </View>
                                          <View style={styles.barberNameColumn}>
                                            <Text style={styles.columnHeaderText}>name</Text>
                                          </View>
                                          <View style={styles.priceDisplayColumn}>
                                            <Text style={styles.columnHeaderText}>phone</Text>
                                            <Text style={styles.columnHeaderText}>number</Text>
                                          </View>
                                        </View>
                                <FlatList 
                                data={barberList}
                                renderItem = {user => 
                                <TouchableOpacity onPress={()=>{setUserToDelete(user.item.id)+addUserFromBarberId()}}>
                                <View style={styles.bookingDataRow}>
                                <View style={styles.customerNameColumn}>
                                  <Text style={styles.modalText1}>{user.item.username}</Text>
                                </View>
                                <View style={styles.barberNameColumn}>
                                  <Text style={styles.modalText1}>{user.item.name}</Text>
                                </View>
                                <View style={styles.priceDisplayColumn}>
                                  <Text style={styles.modalText3}>{user.item.phoneNum}</Text>
                                </View>
                              </View>
                                </TouchableOpacity>
                                }
                                keyExtractor={user => user.id}
                                />

                                </View> 
                }
            }
    // ***********************************************************************************************************************************************************************
    const changeWomanHairCutPrice = async() => { // שינוי של מחיר
        try{
        const response = await fetch(backEndURL+'changeWomanHairCutPrice', {
                    method: 'PUT',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                    },
                    body: JSON.stringify({
                      womanHairCutPrice:parseInt(womenHairCutPrice)
                    })})
                    if(response.ok){
                      await getDatedPrices();
                    }
                    else{
                      console.error('failed to update Price')                      
                    }

        }catch(err){return err}
    }
    // ***********************************************************************************************************************************************************************
    const changeWomanHairDyePrice = async() => {// שינוי של מחיר
        try{
        const response = await fetch(backEndURL+'changeWomanHairDyePrice', {
                    method: 'PUT',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                    },
                body: JSON.stringify({
                    womanHairDyePrice:parseInt(womenHairDyePrice)
                    })});
                    if(response.ok){
                      await getDatedPrices();
                    }
                    else{
                      console.error('failed to update Price')                      
                    }

        }catch(err){return err}
    }
    // ***********************************************************************************************************************************************************************
        const changeMenHairCutPrice = async() => {// שינוי של מחיר
        try{
        const response = await fetch(backEndURL+'changeMenHairCutPrice', {
                    method: 'PUT',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                    },
                body: JSON.stringify({
                    menHairCutPrice:parseInt(menHairCutPrice)
                    })})
                    if(response.ok){
                      await getDatedPrices();
                    }
                    else{
                      console.error('failed to update Price')                      
                    }

        }catch(err){return err}
    }
      const isBookingToday = (bookingDateTime) => {
      const bookingDate = bookingDateTime.split('T')[0];
      const todayDate = new Date().toISOString().split('T')[0];
        return bookingDate === todayDate;
      };
      const isBookingOutdated = (bookingDateTime) => {
      const bookingDate = new Date(bookingDateTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
        return bookingDate < today;
      };
      

        // ***********************************************************************************************************************************************************************
        useEffect(() => {
          getDatedPrices(),fetchOnlyUsers(),getProfit(),fetchBarbers(),getAllBookings(),getMonthlyProfit(),getDailyProfit(),getAllItems()
        },[])


    
    return(
              <LinearGradient colors={['#1A2980', '#26D0CE']} style={styles.container}>
            <Text style={styles.headerTitle}>Manager Options </Text>
            <Text style={styles.modalTitle}> {props.route.params.username} </Text>
            <View style={{flexDirection:'column',alignItems:'center'}}>
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity
            onPress={()=> {setModalChangePrice(!modalChangePrice);}}>
            <View style={styles.buttonCard}>
            <Text style={styles.modalTitle}>change prices</Text>
            </View >
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=> {setModalStatistics(!modalStatisics)}}>
            <View style={styles.buttonCard}>
            <Text style={styles.modalTitle}>Statistics</Text>
            </View >
            </TouchableOpacity>
            </View>



            <View  style={styles.sectionCard}>
                <Text style={styles.modalTitle}>Remove/Add Barber</Text>
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity 
                        style={styles.buttonCard} 
                        onPress={() => setModalVisibleAllUsers(true)}
                      >
                        <Text style={styles.gains}>Add</Text>
                        <Ionicons name='md-add-circle-outline' style={{fontSize:50,color:'white',}}></Ionicons>
                      </TouchableOpacity>

            
                  <TouchableOpacity 
                  onPress={() => {setModalVisibleAllBarbers(true)}}
                  style={styles.buttonCard}
                  >
                    <Text style={styles.gains}>Remove</Text>
                  <Ionicons name='md-remove-circle-outline' style={{fontSize:50,color:'white',}}></Ionicons>
                  </TouchableOpacity>
                  </View>
            </View>
            <View>
                      <TouchableOpacity 
                        style={styles.buttonCard} 
                        onPress={() => setModalItems(true)}
                      >
                        <Text style={styles.gains}>Inventory</Text>
                        <Ionicons name='md-add-circle-outline' style={{fontSize:50,color:'white',}}></Ionicons>
                      </TouchableOpacity>
            </View>
            </View>
{/*     // *********************************************************************************************************************************************************************** */}
            <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalChangePrice}
                            onRequestClose={() => {
                              setModalChangePrice(!modalChangePrice);
                            }}
                          >
                            <LinearGradient colors={['#26D0CE','#1A2980' ]} style={styles.bookingListContainer}>
                                <View style={styles.sectionCard}>
                                    <Text style={styles.modalTitle}>Change Prices</Text>

                                    <View style={{flexDirection:'column'}}>
                                        <View style={{flexDirection:'row',alignSelf:'center'}}>
                                                <TextInput
                                                style={styles.shiftSection}
                                                keyboardType="numeric"
                                                value={tmpWomenHairCutPrice}
                                                placeholder='Women hair cut'
                                                onChangeText={(text) => setTmpWomenHairCutPrice(text)}
                                                />
                                        <Pressable 
                                            onPress={() => {setWomenHairCutPrice(tmpWomenHairCutPrice);changeWomanHairCutPrice().then(getDatedPrices())}}
                                            style={styles.modalCloseButton}
                                            >
                                            <Ionicons name='checkbox' style={{fontSize:50,color:'white',}}></Ionicons>
                                            </Pressable>
                                        </View>
                                        <View style={{flexDirection:'row',alignSelf:'center'}}>
                                            <TextInput
                                            style={styles.shiftSection}
                                            keyboardType="numeric"
                                            value={tmpWomenHairDyePrice}
                                            placeholder='Women hair Dye'
                                            onChangeText={(text) => setTmpWomenHairDyePrice(text)}
                                            />
                                    <Pressable 
                                    onPress={() => {setWomenHairDyePrice(tmpWomenHairDyePrice);changeWomanHairDyePrice().then(getDatedPrices())}}
                                    style={styles.modalCloseButton}
                                    >
                                    <Ionicons name='checkbox' style={{fontSize:50,color:'white',}}></Ionicons>
                                    </Pressable>
                                        </View>
                                        <View style={{flexDirection:'row',alignSelf:'center'}}>
                                             <TextInput
                                            style={styles.shiftSection}
                                            keyboardType="numeric"
                                            value={tmpMenHairCutPrice}
                                            placeholder='Men hair cut'
                                            onChangeText={(text) => SetTmpMenHairCutPrice(text)}
                                            />
                                            <Pressable 
                                            onPress={() => {setMenHairCutPrice(tmpMenHairCutPrice)+changeMenHairCutPrice().then(getDatedPrices())}}
                                            style={styles.modalCloseButton}
                                            >
                                            <Ionicons name='checkbox' style={{fontSize:50,color:'white',}}></Ionicons>
                                            </Pressable>
                                        </View>
                                        </View>
                                    </View>      

                                    {pricesToString.lastUpdated != undefined && pricesToString.menHairCutPrice != undefined && pricesToString.womanHairCutPrice != undefined && pricesToString.womanHairDyePrice != undefined && (
                                        <View style={styles.sectionCardColored}>
                                        <Text style = {styles.modalText1}>Last updated:</Text>
                                        <Text style = {styles.modalText1}>{pricesToString.lastUpdated.toString().split('.')[0].replace('T','   ')}</Text>
                                        <View style={{flexDirection:'row'}}>
                                        <View >
                                        <Text style={styles.modalText2}>{pricesToString.womanHairCutPrice.toString()}$</Text>
                                        <Text style={styles.modalText2}>{pricesToString.womanHairDyePrice.toString()}$</Text>
                                         <Text style={styles.modalText2}>{pricesToString.menHairCutPrice.toString()}$</Text>
                                        </View>
                                        <View style = {{alignItems:'center'}}>
                                            <Text style={styles.modalText1}>Women haircut price:</Text>
                                            <Text style={styles.modalText1}>Women hairdye price:</Text>
                                            <Text style={styles.modalText1}>Men haircut price:</Text>
                                        </View>
                                        
                                    </View>
                                    </View> 
                                  )}
                                  

                                    <View style={{flexDirection:'row',alignSelf:'flex-start'}}>
                                   <TouchableOpacity
                                  style={styles.modalCloseButton}
                                 onPress={()=> {setModalChangePrice(!modalChangePrice)}}>
                                  <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                                </TouchableOpacity>
                                </View>
                                <View>

                                </View>

                            </LinearGradient>
                          </Modal>
{/*     // *********************************************************************************************************************************************************************** */}
                          <Modal 
                            animationType="fade"
                            transparent={true}
                            visible={modalPricesChangeSuccess}
                            onRequestClose={() => {
                            setModalPricesChangeSuccess(!modalPricesChangeSuccess);
                            }}
                        >
                          {pricesToString.lastUpdated != undefined && pricesToString.menHairCutPrice != undefined && pricesToString.womanHairCutPrice != undefined && pricesToString.womanHairDyePrice != undefined &&
                            (<LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard2}>
                                                <Text style={styles.modalTitle}>Success</Text>
                                                <Text style = {styles.modalText1}>{pricesToString.lastUpdated.toString().split('.')[0].replace('T','   ')}</Text>
                                                <Text style={styles.modalText1}>Prices changed successfully update may require refreshing</Text>
                                                <Pressable
                                                style={styles.modalCloseButton}
                                                onPress={() => setModalPricesChangeSuccess(!modalPricesChangeSuccess)}
                                                >
                                                <Ionicons name='checkmark-circle-outline' style={{fontSize:50,color:'green',}}></Ionicons>
                                                </Pressable>
                            </LinearGradient>)}
                        </Modal>
                         
{/*     // *********************************************************************************************************************************************************************** */}
                        <Modal 
                            animationType="fade"
                            transparent={true}
                            visible={modalSuccess}
                            onRequestClose={() => {
                            setModalSuccess(!modalSuccess);
                            }}
                        >
                          {pricesToString.lastUpdated != undefined && pricesToString.menHairCutPrice != undefined && pricesToString.womanHairCutPrice != undefined && pricesToString.womanHairDyePrice != undefined &&
                            (<LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard2}>
                                                <Text style={styles.modalTitle}>Success</Text>
                                                <Text style = {styles.modalText1}>{pricesToString.lastUpdated.toString().split('.')[0].replace('T','   ')}</Text>
                                                <Text style={styles.modalText1}>Operation done successfully</Text>
                                                <Pressable
                                                style={styles.modalCloseButton}
                                                onPress={() => setModalSuccess(!modalSuccess)}
                                                >
                                                <Ionicons name='checkmark-circle-outline' style={{fontSize:50,color:'green',}}></Ionicons>
                                                </Pressable>
                            </LinearGradient>)}
                        </Modal>
{/*     // *********************************************************************************************************************************************************************** */}
                        <Modal animationType="fade"
                        transparent={true}
                        visible={modalVisibleAllBarbers}
                        onRequestClose={() => {
                          setModalVisibleAllBarbers(!modalVisibleAllBarbers);
                        }}
                      >
                          <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.bookingListContainer}>
                          {isBarberOnlyListEmpty()}
                                <Pressable 
                              onPress={() => setModalVisibleAllBarbers(!modalVisibleAllBarbers)}
                              style={styles.modalCloseButton}
                            >
                            <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                            </Pressable>
                      </LinearGradient>
                      </Modal>
{/* // *********************************************************************************************************************************************************************** */}
                                       <Modal animationType="fade"
                                        transparent={true}
                                        visible={modalVisibleAllUsers}
                                        onRequestClose={() => {
                                          setModalVisibleAllUsers(!modalVisibleAllUsers);
                                        }}
                                      >
                                          <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.bookingListContainer}>
                                          {isUserOnlyListEmpty()}
                                               <TouchableOpacity 
                                              onPress={() => setModalVisibleAllUsers(!modalVisibleAllUsers)}
                                              style={styles.modalCloseButton}
                                            >
                                            <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',}}></Ionicons>
                                            </TouchableOpacity>
                                      </LinearGradient>
                                      </Modal>
                                      {/* // *********************************************************************************************************************************************************************** */}
                                       <Modal animationType="fade"
                                        transparent={true}
                                        visible={modalTryAgain}
                                        onRequestClose={() => {
                                          setModalTryAgain(!modalTryAgain);
                                        }}
                                      >
                                          <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard2}>
                                                <Text style={styles.modalTitle}>Try again</Text>
                                                <Text style={styles.modalText1}>Operation could not finish</Text>
                                                <TouchableOpacity
                                                style={styles.modalCloseButton}
                                                onPress={() => setModalTryAgain(!modalTryAgain)}
                                                >
                                                <Ionicons name='checkmark-circle-outline' style={{fontSize:50,color:'green',}}></Ionicons>
                                                </TouchableOpacity>
                                              </LinearGradient>
                                      </Modal>
     {/*     // *********************************************************************************************************************************************************************** */}
                                 <Modal animationType="fade"
                                        transparent={true}
                                        visible={modalStatisics}
                                        onRequestClose={() => {
                                          setModalStatistics(!modalStatisics);
                                        }}
                                      >
                                        <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.bookingListContainer}>
                                        <View style={styles.bookingListContainer}>
                                         <View style ={{marginTop:15}}>
                                            <Text style={styles.gains}> Total Money Gained: {profit}$</Text>
                                            <Text style={styles.gains}> Monthly Money Gained: {monthlyProfit}$</Text>
                                            <Text style={styles.gains}> Daily Money Gained: {dailyProfit}$</Text>
                                        </View>
                                        <View style={styles.tableHeaderRow}>
                                          <View style={styles.customerNameColumn}>
                                            <Text style={styles.columnHeaderText}>Customer</Text>
                                          </View>
                                          <View style={styles.barberNameColumn}>
                                            <Text style={styles.columnHeaderText}>Barber</Text>
                                          </View>
                                          <View style={styles.priceDisplayColumn}>
                                            <Text style={styles.columnHeaderText}>Price</Text>
                                          </View>
                                          <View style={styles.priceDisplayColumn}>
                                            <Text style={styles.columnHeaderText}>Date</Text>
                                          </View>
                                        </View>
                                        <View style={styles.flatListContainer}>
                                        <FlatList
                                          data={allBookings.slice().reverse()}
                                          horizontal={false}
                                          scrollEnabled={true}
                                          showsVerticalScrollIndicator={true}
                                          style={styles.bookingScrollableList}
                                          renderItem={({ item: booking }) => {
                                            const isTodaysBooking = isBookingToday(booking.endTime);
                                            const isOutdatedBooking = isBookingOutdated(booking.endTime);
                                            
                                            return (
                                              <View style={[
                                                styles.bookingDataRow,
                                                isTodaysBooking && styles.todayHighlightedRow,
                                                isOutdatedBooking && !isTodaysBooking && styles.outdatedHighlightedRow
                                              ]}>
                                                <View style={styles.customerNameColumn}>
                                                  <Text style={[
                                                    styles.customerUsernameText,
                                                    isTodaysBooking && styles.todayHighlightedText,
                                                    isOutdatedBooking && !isTodaysBooking && styles.outdatedHighlightedText
                                                  ]}>
                                                    {booking.username}
                                                  </Text>
                                                </View>
                                                <View style={styles.barberNameColumn}>
                                                  <Text style={[
                                                    styles.barberUsernameText,
                                                    isTodaysBooking && styles.todayHighlightedText,
                                                    isOutdatedBooking && !isTodaysBooking && styles.outdatedHighlightedText
                                                  ]}>
                                                    {booking.barberUsername}
                                                  </Text>
                                                </View>
                                                <View style={styles.priceDisplayColumn}>
                                                  <Text style={[
                                                    styles.priceAmountText,
                                                    isTodaysBooking && styles.todayHighlightedText,
                                                    isOutdatedBooking && !isTodaysBooking && styles.outdatedHighlightedText
                                                  ]}>
                                                    {booking.price}
                                                  </Text>
                                                </View>
                                                <View style={styles.priceDisplayColumn}>
                                                  <Text style={[
                                                    styles.Date,
                                                    isTodaysBooking && styles.todayHighlightedText,
                                                    isOutdatedBooking && !isTodaysBooking && styles.outdatedHighlightedText
                                                  ]}>
                                                    {booking.endTime.replace('T', '\n').substring(0, 16)}
                                                  </Text>
                                                </View>
                                              </View>
                                            );
                                          }}
                                          keyExtractor={booking => booking.id}
                                        />
                                        <TouchableOpacity
                                                style={styles.modalCloseButton}
                                                onPress={() => setModalStatistics(!modalStatisics)}
                                                >
                                                <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red',alignSelf:'flex-start',padding:10}}></Ionicons>
                                                </TouchableOpacity>
                                        
                                        </View>
                                        </View>
                                        
                                              </LinearGradient>
                                      </Modal>
{/* ************************************************************************************************************************************************************* */}
                                      <Modal animationType="fade"
                                        transparent={true}
                                        visible={modalItems}
                                        onRequestClose={() => {
                                          setModalItems(!modalItems);
                                        }}
                                      >
                                          <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.bookingListContainer}>
                                                <Text style={styles.modalTitle}>Inventory</Text>
                                                <View>
                                                  <View style={styles.tableHeaderRow}>
                                                    <View style={styles.customerNameColumn}>
                                                      <Text style={styles.columnHeaderText}>Name</Text>
                                                    </View>
                                                    <View style={styles.barberNameColumn}>
                                                      <Text style={styles.columnHeaderText}>Price</Text>
                                                    </View>
                                                    <View style={styles.priceDisplayColumn}>
                                                      <Text style={styles.columnHeaderText}>Available</Text>
                                                    </View>
                                                  </View>
                                                  <FlatList 
                                                    data={allItems}
                                                    renderItem = {({item}) => 
                                                      <TouchableOpacity onPress={() => { setItemId(item.id);
                                                                                          setItemAndGoToModal(item.id);}}>
                                                    <View style={styles.bookingDataRow}>
                                                    <View style={styles.customerNameColumn}>
                                                      <Text style={styles.modalText1}>{item.name}</Text>
                                                    </View>
                                                    <View style={styles.priceDisplayColumn}>
                                                      <Text style={styles.modalText1}>{item.price}$</Text>
                                                    </View>
                                                    <View style={styles.priceDisplayColumn}>
                                                      <Text style={styles.modalText1}>{item.quantity}</Text>
                                                    </View>
                                                  </View>
                                                  </TouchableOpacity>
                                                    }
                                                    keyExtractor={item => item.id}
                                                    />
                                                <View style={{flexDirection:'row',alignSelf:'center',marginTop:10}}>
                                                <TouchableOpacity
                                                style={styles.modalCloseButton}
                                                onPress={() => setModalItems(!modalItems)}
                                                >
                                                <Ionicons name='close-circle-outline' style={{fontSize:50,color:'red'}}></Ionicons>
                                                <Text style={styles.modalText1}>Exit</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                style={styles.modalCloseButton}
                                                onPress={() => setModalCreateItem(!modalCreateItem)}
                                                >
                                                <Ionicons name='add-circle-outline' style={{fontSize:50,color:'green',}}></Ionicons>
                                                <Text style={styles.modalText1}>Add</Text>
                                                <Text style={styles.modalText1}>Item</Text>
                                                </TouchableOpacity>
                                                </View>
                                                

                                                </View>
                                              </LinearGradient>
                                      </Modal>
{/* ************************************************************************************************************************************************************* */}
                                      <Modal animationType="fade"
                                        transparent={true}
                                        visible={modalItemInfo}
                                        onRequestClose={() => {
                                          setModalItemInfo(!modalItemInfo);
                                        }}
                                      >
                                              <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard2}>
                                                    <Text style={styles.modalTitle}>Item information</Text>
                                                    
                                                      
                                                    
                                                    <View style={{padding:15,alignItems:'flex-end'}}>
                                                      {item !== null ? (
                                                          <View>
                                                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8,alignSelf:'flex-end'}}>
                                                              <Text style={styles.modalText1}>Name: {item.name}</Text>
                                                            </View>
                                                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8,alignSelf:'flex-end'}}>
                                                              <Text style={styles.modalText1}>Available: {item.quantity || 'N/A'}</Text>
                                                            </View>
                                                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8,alignSelf:'flex-end'}}>
                                                              <Text style={styles.modalText1}>Price: {item.price || 0}$</Text>
                                                            </View>
                                                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8,alignSelf:'flex-end'}}>
                                                              <Text style={styles.modalText1}>Supplier: {item.supplier || 'N/A'}</Text>
                                                            </View>
                                                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8,alignSelf:'flex-end'}}>
                                                              <Text style={styles.modalText1}>
                                                                Last updated: {item.lastUpdated ? item.lastUpdated.substring(0,10).replaceAll('-','/') : 'N/A'}
                                                              </Text>
                                                            </View>
                                                          </View>
                                                        ) : (
                                                          <View style={{alignItems: 'center', padding: 20}}>
                                                            <Text style={styles.modalText1}>Loading item details...</Text>
                                                          </View>
                                                        )}
                                                      </View>
                                                      <View style = {{flexDirection:'row',alignItems:'center'}}>
                                                      <View style = {styles.buttonCard}>
                                                      
                                                      <TouchableOpacity
                                                    style={styles.modalCloseButton}
                                                    onPress={() => {deleteItem().then(setModalItemInfo(!modalItemInfo))}}>
                                                    <Ionicons name='trash' style={{fontSize:50,color:'red',}}></Ionicons>
                                                    <Text style={styles.modalText1}>Delete Item</Text>
                                                    </TouchableOpacity>
                                                    </View>
                                                    
                                                    <TouchableOpacity
                                                    style={styles.modalCloseButton}
                                                    onPress={() => setModalItemInfo(!modalItemInfo)}>
                                                      <View style = {styles.buttonCard}>
                                                    <Ionicons name='exit' style={{fontSize:50,color:'grey',}}></Ionicons>
                                                    <Text style={styles.modalText1}>Exit </Text>
                                                    </View>
                                                    </TouchableOpacity>

                                                    
                                                    </View>
                                                    <View style={{flexDirection:'row'}}> 
                                                      <View style={{flex:1}}>
                                                    <TextInput
                                                    style={styles.shiftSection}
                                                    keyboardType="default"
                                                    value={newItemQuantity.toString()}
                                                    placeholder='Quantity'
                                                    onChangeText={(text) => setNewItemQuantity(text)}
                                                    />
                                                      </View>
                                                    <TouchableOpacity
                                                    style={styles.modalCloseButton}
                                                    onPress={() => updateItemQuantity()}>
                                                      <View style = {styles.buttonCard}>
                                                    <Ionicons name='cog' style={{fontSize:50,color:'yellow',}}></Ionicons>
                                                    <Text style={styles.modalText1}>Change</Text>
                                                    <Text style={styles.modalText1}>Quantity </Text>
                                                    </View>
                                                    </TouchableOpacity>
                                                    </View>
                                                  </LinearGradient>
                                          </Modal>
                                            <Modal animationType="fade"
                                            transparent={true}
                                            visible={modalCreateItem}
                                            onRequestClose={() => {
                                              setModalCreateItem(!modalCreateItem);
                                            }}
                                          >
                                          <LinearGradient colors={['#26D0CE','#1A2980']} style={styles.modalCard2}>
                                            <Text style = {styles.modalTitle}> Add new Item</Text>
                                            <Text style={styles.modalText1}>Item Name: </Text>
                                                        <TextInput
                                                        style={styles.shiftSection}
                                                        keyboardType="default"
                                                        value={itemName}
                                                        onChangeText={(text) => setItemName(text)}
                                                        />
                                            <Text style={styles.modalText1}>Supplier: </Text>
                                                        <TextInput
                                                        style={styles.shiftSection}
                                                        keyboardType="default"
                                                        value={itemSupplier}
                                                        onChangeText={(text) => setItemSupplier(text)}
                                                        />
                                            <Text style={styles.modalText1}>Price: </Text>
                                                        <TextInput
                                                        style={styles.shiftSection}
                                                        keyboardType="default"
                                                        value={itemPrice}
                                                        onChangeText={(text) => setItemPrice(text)}
                                                        />
                                          <Text style={styles.modalText1}>quantity</Text>

                                                      <TextInput
                                                      style={styles.shiftSection}
                                                      keyboardType="default"
                                                      value={itemQuantity}
                                                      onChangeText={(text) => setItemQuantity(text)}
                                                      />
                                                      <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
                                                        <TouchableOpacity
                                                          style={styles.modalCloseButton}
                                                          onPress={() => setModalCreateItem(!modalCreateItem)}>
                                                          <Ionicons name='exit' style={{fontSize:50,color:'grey',}}></Ionicons>
                                                          <Text style={styles.modalText1}>Exit </Text>
                                                          </TouchableOpacity>

                                                           <TouchableOpacity
                                                            style={styles.modalCloseButton}
                                                            onPress={() => newItemAndRefresh()}>
                                                            <Ionicons name='add-circle-outline' style={{fontSize:50,color:'green',}}></Ionicons>
                                                            <Text style={styles.modalText1}>Create Item </Text>
                                                            </TouchableOpacity>
                                                      </View>
                                         
                                          </LinearGradient>
                                      </Modal>
            </LinearGradient>
            

    )//________________________________________________________________________________________________________________________________________________________//

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf:'center',
    alignContent:'center',
    width:Platform.OS === 'web' ?'100%' : '70%',
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf:'center'
  },
  shiftSection: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    marginBottom:20,
    padding: 15,
    width:Platform.OS === 'web' ?'35%' : '70%',
    alignSelf:'center'
  },

  sectionCard: {
      borderRadius: 15,
      padding: 15,
      margin:30,
      marginBottom: 15,
      width:'80%',
      alignItems:'center'
    },
    sectionCardColored: {
      backgroundColor:'rgba(255,255,255,0.2)',
      borderColor:'rgba(5, 0, 0, 1)',
      borderRadius: 15,
      padding: 15,
      margin:30,
      marginBottom: 15,
      width:'80%',
      alignItems:'center'
    },

  buttonCard: {
  backgroundColor: '#166ca5ff',
  borderRadius: 16,
  padding: 20,
  margin: 5,
  marginBottom: 15,
  alignItems: 'center',
  alignContent:'center',
  alignSelf:'center',
  borderWidth: 1,
  borderColor: '#000000ff',
  shadowColor: '#000000ff',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 8,
},
    sectionTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
bookingListContainer: {
    flex: 1,
  },
  
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  
  columnHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  
  priceDisplayColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  barberNameColumn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  customerNameColumn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  bookingDataRow: {
    flexDirection: 'row',
    backgroundColor: '#166ca5ff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  
  priceAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
  },
  gains: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffffff',
    textAlign: 'center',
  },
    Date: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
    margin:5,
  },
  
  barberUsernameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    textAlign: 'center',
  },
  
  customerUsernameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d4ed8',
    textAlign: 'center',
  },
  
  bookingScrollableList: {
    paddingBottom: 20,
  },
  todayHighlightedRow: {
    backgroundColor: '#dbeafe',
    borderLeftWidth: 5,
    borderLeftColor: '#2563eb', 
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  todayHighlightedText: {
    fontWeight: '700',
    color: '#1d4ed8',
  },
  
  outdatedHighlightedRow: {
    backgroundColor: '#dcfce7',
    borderLeftWidth: 5,
    borderLeftColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  outdatedHighlightedText: {
    fontWeight: '700',
    color: '#15803d',
  },
  
  Date: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },

  // עיצובים של מודלים בשימוש **************************************************************************************************

  modalCard: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    borderColor:'black',
    borderWidth:2,
    padding: 30,
    marginTop:70,
    width:Platform.OS === 'web' ? '50%' : '90%',
    height:Platform.OS === 'web' ?'50%' : '90%',
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
  modalCard2:{
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    borderColor:'black',
    borderWidth:2,
    padding: 30,
    marginTop:70,
    width:Platform.OS === 'web' ? '50%' : '90%',
    height:Platform.OS === 'web' ?'50%' : 'auto',
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
  modalCard3:{
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    borderColor:'black',
    borderWidth:2,
    padding: 30,
    marginTop:70,
    width:Platform.OS === 'web' ? '50%' : '90%',
    height:Platform.OS === 'web' ?'50%' : '50%',
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
    flex:0.9
  },
  

  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',

  },
  modalText1: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
  modalText3: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center'
  },
  modalText2: {
    color: 'rgba(0, 255, 55, 1)',
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
  modalCloseButton: {
    bottom: 10,
    right: 10,
    padding: 10,
    marginBottom:5,
    alignItems:'center'
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

});

export default ManagerOptions;