import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, LogBox } from 'react-native';
import { AuthContext } from '../components/Context';
import { SectionGrid } from 'react-native-super-grid';
import axios from 'react-native-axios';
import { Header } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { color } from 'react-native-elements/dist/helpers';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function Dashboard({ route, navigation }) {
  const [count, setCount] = useState();

  const [petCount, setPetCount] = useState('');
  const [visitsCount, setVisitsCount] = useState('');
  const [usersCount, setUsersCount] = useState('');

  const [items, setItems] = useState([
    { name: 'PETS', color: '#1a895e', value1: '100', icon: 'dog', route: () => navigation.navigate('Pets') },
    {
      name: 'OWNERS',
      color: '#db8020',
      value1: '14',
      icon: 'account',
      route: () => navigation.navigate('Owners'),
    },
    {
      name: 'Appointments',
      color: '#1695b5',
      heading1: 'Today',
      heading2: 'Tomorrow',
      value1: '10',
      value2: '05',
      icon: 'calendar-month',
      route: () => navigation.navigate('Appointments'),
    },
    {
      name: 'Visits',
      color: '#3171d6',
      heading1: 'Total',
      heading2: 'Today',
      value1: '2500',
      value2: '15',
      heading3: 'New -',
      value3: '12',
      icon: 'fridge-variant',
      route: () => navigation.navigate('Visits'),
    },
    {
      name: 'Masters',
      color: '#5d5dd6',
      icon: 'layers-triple',
      description: 'Manage Breeds, Colors, Visit types, etc',
      route: () => navigation.navigate('Masters'),
    },
    {
      name: 'Templates',
      color: '#097bc3',
      icon: 'view-dashboard',
      description: 'Manage Prescription & Message Templates',
      route: () => navigation.navigate('Templates'),
    },
    {
      name: 'Users',
      color: '#1da095',
      heading1: 'Total Users',
      value1: '12',
      icon: 'account-group',
      route: () => navigation.navigate('Users'),
    },
    {
      name: 'Settings',
      color: '#7aa338',
      icon: 'cog',
      description: 'Manage all your Settings',
      route: () => navigation.navigate('Settings'),
    },
    {
      name: 'Subscription & Billing',
      color: '#b23a84',
      icon: 'script-text-outline',
      // value1: 'Total Users: 12',
      route: () => navigation.navigate('SubscriptionAndBilling'),
    },
    {
      // name: 'Whatsapp and Storage Credits',
      color: '#8346b1',
      Whatsapp: 'Whatsapp credits left',
      storageCredits: 'Storage space left',
      Whatsappvalue: '2500',
      storageCreditsvalue: '15',
      route: () => navigation.navigate('LeftCredits'),
    },
  ]);

  useEffect(() => {
    getPetCount();
    // getAppointmentCount();
    getVisitsCount();
    getUsersCount();
  }, []);

  const getPetCount = async () => {
    let userClinicId = route.params.userDetails.clinic.id;
    await axios
      .get(`/pet/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          setPetCount(res.data.length);
          console.log('setPetCount', res.data.length);
        }
      })
      .catch((err) => {
        console.log('Error');
      });
  };

  // const getAppointmentCount = () => {

  // }

  const getVisitsCount = async () => {
    let userClinicId = route.params.userDetails.clinic.id;
    await axios
      .get(`/visitDetail/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          setVisitsCount(res.data.length);
          console.log('setVisitsCount', res.data.length);
        }
      })
      .catch((err) => {
        console.log('Error');
      });
  };

  const getUsersCount = async () => {
    let userClinicId = route.params.userDetails.clinic.id;
    await axios
      .get(`/user/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          setUsersCount(res.data.length);
          console.log('setUsersCount', res.data.length);
        }
      })
      .catch((err) => {
        console.log('Error');
      });
  };

  return (
    <View style={styles.container}>
      <Header
        placement='left'
        statusBarProps={{ barStyle: 'dark-content', backgroundColor: '#f2f4fc' }}
        leftComponent={
          <View>
            <View style={{ backgroundColor: '#006766', borderRadius: 25, padding: 5, alignItems: 'center' }}>
              <MaterialCommunityIcons name='paw' color={'#fff'} size={20} />
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 15 }}>Dashboard</Text>
          </View>
        }
        rightComponent={<MaterialIcons name='menu' color={'#000'} size={25} />}
        containerStyle={{
          backgroundColor: '#f2f4fc',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionGrid
          staticDimension={390}
          spacing={10}
          sections={[
            {
              data: items.slice(0, 11),
            },
          ]}
          style={styles.gridView}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={item.route} key={'grid_' + index}>
              <View style={[styles.itemContainer, { backgroundColor: item.color }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.itemName}>{item.name}</Text>

                  <MaterialCommunityIcons name={item.icon} color={'#fff'} size={20} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 5 }}>
                  <View>
                    <Text style={styles.itemheading}>{item.heading1}</Text>
                    <Text style={styles.itemCode}>{item.value1}</Text>
                  </View>
                  <View>
                    <Text style={styles.itemheading}>{item.heading2}</Text>
                    <Text style={styles.itemCode}>{item.value2}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>{item.heading3}</Text>
                  <Text style={{ color: '#fff', fontSize: 12 }}>{item.value3}</Text>
                </View>

                <View
                  style={{
                    position: 'absolute',
                    margin: 10,
                    height: '100%',
                    width: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.description}</Text>
                </View>

                <View
                  style={{
                    position: 'absolute',
                    margin: 10,
                    height: '100%',
                    width: '100%',
                    flexDirection: 'row',
                  }}
                >
                  <View style={{ width: '50%' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 30 }}>{item.Whatsappvalue}</Text>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>{item.Whatsapp}</Text>
                  </View>
                  <View style={{ width: '50%' }}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 30 }}>{item.storageCreditsvalue}</Text>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>{item.storageCredits}</Text>
                  </View>
                </View>

                {/* <Text style={styles.itemCode}>
                  {item.value1}
                  {'\n'}
                  {item.value2}
                </Text> */}
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4fc',
    alignItems: 'center',
  },

  gridView: {
    flex: 1,
  },

  itemContainer: {
    padding: 10,
    // justifyContent: 'space-between',
    // alignItems: 'center',
    borderRadius: 5,
    height: 120,
    marginVertical: 5,
    elevation: 5,
  },

  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    // marginHorizontal: 5,
    // textAlign: 'center',
    width: '65%',
  },

  itemCode: {
    // fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    // paddingHorizontal: 15,
    // paddingVertical: 5,
    // textAlign: 'center',
  },
  itemheading: {
    color: '#fff',
    fontSize: 15,
  },
});
