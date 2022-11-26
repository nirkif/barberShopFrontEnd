import React, {useState, useEffect} from 'react';
import { View,Text,TextInput,Alert,TouchableOpacity,StyleSheet,Modal,Pressable } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

const BarberOpenings = (props) => {
    
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



    // useEffect( () => {
    //         //  fetch('http://localhost:5988/findByUserName/'+props.route.params.username,{
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
            fetchMyOpenings();
            getUpcomingWeekDays();
            console.log(getUpcomingWeekDays());
          },[]);

    const fetchMyOpenings = async () => {
      setLoading(true)
      const data = await fetch('http://localhost:5988/getOpenings/'+props.route.params.username,{
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


    const getUpcomingWeekDays = ()=>{
      var ans = [];
      var day;
      var month;
      var year;
      var formatedDate;
      var today = new Date();
      day = today.getDate();
      month = today.getMonth();
      year = today.getFullYear();
      formatedDate = `${day}-${month}-${year}`;
      ans.push(formatedDate)
      for(var i = 1 ; i < 7 ; i++){
        var currDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
        day = currDate.getDate();
        month = currDate.getMonth();
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
        await fetch('http://localhost:5988/deleteOpening/',{
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
        await fetch('http://localhost:5988/addOpenings/',{
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



    return(
        <View style={styles.container}>
            <View style = {styles.row}> 
            <Text style={styles.myButtonText}>My Openings</Text>
                  <FlatList // flatlist to show opening details // blue view that contains my openings
                         contentContainerStyle={{alignSelf: 'flex-start'}}
                         numColumns={4}
                         paddingHorizontal={50}
                         marginLeft={10}
                         marginBottom={10}
                         //showsVerticalScrollIndicator={false}
                         //showsHorizontalScrollIndicator={false}
                        data={myOpenings}//which data to use
                        renderItem= {opening => //what will be shown from the item
                        <View style={styles.myButtonContainerV2}>
                        <TouchableOpacity onPress={()=>setOpeningId(opening.item.id)+console.log(opening.item.id)}>

                            <Text style={styles.myButtonText}>{opening.item.openingInfo}</Text>

                        </TouchableOpacity>
                        </View>                     
                                    }
                        keyExtractor={opening => opening.id}//unique id for the item
                        />  
            <TouchableOpacity onPress={deleteOpening} style={styles.myButtonContainerV2}><Text style = {styles.myButtonText}>Delete opening</Text></TouchableOpacity>
            </View>
            <View style={styles.row2}>
              <Text style={styles.myButtonText}>Shifts maker</Text>
            <FlatList // dates of upcoming week to create day of work
                        
                        data={daysOfWeek}//which data to use
                        horizontal={true}
                        renderItem= {newOpening => //what will be shown from the item
                            <TouchableOpacity onPress={() => {
                              setMonth(newOpening.item.substring(3,5))
                              setDayOfMonth(newOpening.item.substring(0,2))
                              console.log("month: ",month,"\nday: ",dayOfMonth)
                              setModalVisible(!modalVisible)}
                              } style={{borderStyle:'solid',borderColor:'black',borderRadius:12,borderWidth:3,height:90,margin:10}}>
                            <Text style={styles.myButtonText}>{newOpening.item}</Text>
                            <Text style={styles.myButtonText}>9 - 17</Text>
                            <Text style={styles.myButtonText}>Create shift</Text>
                            </TouchableOpacity>}
                        keyExtractor={(index) => index.toString()}//unique id for the item
                        />  
            </View>                        












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





        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        width: '25%',
        marginTop: 10,
        marginLeft: 4,
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 30,
        backgroundColor: '#F7567C',
        flex:1
      },
      row: {
        height: '100%',
        width: '50%',
        backgroundColor: '#B0E0E6',
        borderRadius: 12,
        marginBottom:20,
        flex:0.5
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
        width: '100%',
        paddingVertical: 20,
        borderRadius: 30,
        paddingHorizontal: 20,
        fontSize: 18,
        backgroundColor: '#FCFCFC',
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
        marginLeft:'10px'
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


});

export default BarberOpenings;