import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

// props - מידע זמני שפועל בזמן הפעלה ששומר ומבעביר מידע מדף לדף



//need barbers list , openings , and bookings
// onClick on barber -> opened flatlist with openings onClick opening -> pop up yes/no -> set to booking
// flat list showing all bookings


//
const Home = (props) => {
    const [barberList , setBarberList] = useState([])
    useEffect( ()=> {
        const barberList = fetch('http://localhost:5988/allUsers',{
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
  
      })
      .catch((error) =>{
          console.error(error);
      })},[])

   
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Home Page</Text>

            <TouchableOpacity onPress={ () => { props.navigation.navigate('Profile')} } style={styles.buttonStyle}>   
                <Text>Register to Site</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {console.log(barberList)}}><Text>click</Text></TouchableOpacity>


            <FlatList
                    data={barberList}//which data to use
                    keyExtractor={barber => barber.username}//unique id for the item
                    renderItem={barberDetails => //what will be shown from the item
                    // <TouchableOpacity onPress={() => {props.navigation.navigate('Profile',{barberDetails: barberDetails.item} )}}>
                                  <View style={{backgroundColor:'fff',
                                  width:'100%',
                                  padding:22,
                                  marginBottom:10,
                                  borderRadius:10}}>
                                  </View>
              //      </TouchableOpacity>
                }/>

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#30E4DE',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonStyle: {
        flex: 0.3,
        color: 'red',
        backgroundColor:'#4343F6',
        alignItems:'center',
        justifyContent: 'center',
        fontWeight: 'Bold',
        fontSize: 30,
    },
    title: {
        flex: 0.3,
        color: 'red',
        alignItems:'center',
        justifyContent: 'center',
        fontWeight: 'Bold',
        fontSize: 30,
    }
});

export default Home;