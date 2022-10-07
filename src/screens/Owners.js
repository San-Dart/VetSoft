import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, RefreshControl, Pressable } from 'react-native';
import axios from 'react-native-axios';
import { Divider, FAB, Searchbar, TextInput } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/core';
import { Header } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BranchFilter from '../components/BranchFilter';
import Accordion from '../components/Accordion';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Owners = ({ route, element, navigation }) => {
  let colors = ['#fff', '#006766'];
  let textColor = ['#000', '#ffffff80'];
  let valueColor = ['#000', '#fff'];

  const isFocused = useIsFocused();

  const [refreshing, setRefreshing] = useState(false);

  const [petOwnerData, setPetOwnerData] = useState([]);
  const [petOwnerDetail, setPetOwnerDetail] = useState([]);

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [Petlength, setPetlength] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getOwnerData();
      //petsOfOwnerDetail();
    }
  }, [isFocused]);

  const getOwnerData = async () => {
    let userClinicId = route.params.userDetails.clinic.id;
    console.log('UserClinicId', userClinicId);
    await axios
      .get(`petOwner/clinic/${userClinicId}`)
      .then((res) => {
        if (res.status === 200) {
          console.log('data', res.data);
          setPetOwnerData(res.data);
          setFilteredDataSource(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1200).then(() => {
      setRefreshing(false);
      getOwnerData();
    });
  }, []);

  const searchFilterFunction = (text) => {
    const newData = petOwnerData.filter((element) => {
      const itemData = `${element.pet_owner_name.toUpperCase()}
          ${element.pet_owner_name.toLowerCase()}
          ${element.contact_number.toUpperCase()}
          ${element.contact_number.toLowerCase()}
          `;
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredDataSource(newData);
    setSearch(text);
  };

  // const getSelected = element => selectedItems.includes(element.id);
  const handleOnPress = (element) => {
    // console.log(element.id);
    console.log('filteredDataSource', filteredDataSource);
    if (selectedItems.length) {
      return selectItems(element);
    }

    navigation.navigate('PetOwnerDetail', { petOwnerId: element });
  };

  const deSelectItems = (element) => {
    console.log(element);
    const index = selectedItems.indexOf(element.id);
    if (index > -1) {
      selectedItems.splice(index, 1);
    }
    var deSelectItems = selectedItems;
    setSelectedItems([...deSelectItems]);
  };

  const selectItems = (element) => {
    if (selectedItems.includes(element.id)) {
      const newListItems = selectedItems.filter((listItem) => listItem !== element.id);
      return setSelectedItems([...newListItems]);
    }
    setSelectedItems([...selectedItems, element.id]);
    // console.log('selectedItems', selectedItems);
  };

  return (
    <>
      {/* <Header
        statusBarProps={{ barStyle: 'dark-content', backgroundColor: '#f2f4fc' }}
        containerStyle={{
          backgroundColor: '#f2f4fc',
        }}
        placement='right'
        leftComponent={<MaterialIcons name='logo' color={'#000'} size={25} />}
        centerComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <MaterialIcons name='home' color={'#000'} size={25} />
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity>
            <MaterialIcons name='menu' color={'#000'} size={25} />
          </TouchableOpacity>
        }
      />
      <View style={{ flex: 1 }} key='pet_owner'>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // marginHorizontal: 10,
            justifyContent: 'space-between',
            backgroundColor: '#fff',
          }}
        >
          <View style={{ width: '20%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '2%' }}>
            <MaterialIcons
              name='arrow-back-ios'
              color={'#000'}
              size={25}
              onPress={() => navigation.navigate('Dashboard')}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Pet Owners</Text>
          </View>
          <View style={{ width: '70%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <Searchbar
              placeholder='Search'
              placeholderTextColor={'#00000040'}
              onChangeText={(text) => searchFilterFunction(text)}
              value={search}
              color={'#2f2f7e'}
              style={{
                backgroundColor: '#fff',
                borderRadius: 5,
                fontSize: 12,
                width: '60%',
                elevation: 2,
                borderColor: '#d4d2d2',
              }}
              // icon={null}
              // searchicon={true}
              icon={({ size, color }) => <MaterialIcons name='search' size={24} />}
              iconColor={'#2f2f7e'}
            />

            <BranchFilter userData={route.params.userDetails} />
          </View>
        </View> */}
      <Header
        statusBarProps={{ barStyle: 'dark-content', backgroundColor: '#f2f4fc' }}
        containerStyle={{
          backgroundColor: '#f2f4fc',
        }}
        placement='right'
        leftComponent={<MaterialIcons name='logo' color={'#000'} size={25} />}
        centerComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <MaterialIcons name='home' color={'#000'} size={25} />
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity>
            <MaterialIcons name='menu' color={'#000'} size={25} />
          </TouchableOpacity>
        }
      />
      <View style={styles.container} key='pet_1'>
        <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: '40%', flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name='arrow-back-ios' color={'#000'} size={25} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Pets Owners</Text>
          </View>
          <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Searchbar
              placeholder='Search'
              placeholderTextColor={'#00000040'}
              onChangeText={(text) => searchFilterFunction(text)}
              value={search}
              color={'#2f2f7e'}
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                height: 40,
                fontSize: 10,
                width: '75%',
              }}
              icon={null}
              iconColor={'#2f2f7e'}
              // textAlign={'center'}
            />
            <BranchFilter userData={route.params.userDetails} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={{ marginTop: '2%', width: '96%', alignSelf: 'center' }}>
            {filteredDataSource.map((element, index) => (
              <>
                <Pressable onPress={() => deSelectItems(element)}>
                  <TouchableOpacity
                    onPress={() => handleOnPress(element)}
                    key={element.id}
                    style={{
                      marginHorizontal: 10,
                      marginBottom: 20,
                    }}
                    onLongPress={() => selectItems(element)}
                  >
                    <View
                      style={{
                        zIndex: 0,
                        backgroundColor: '#fff',
                        marginBottom: 5,
                        padding: 10,
                        shadowColor: '#bebebe',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 10,
                        borderRadius: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginVertical: 12,
                        }}
                      >
                        <Text
                          style={{
                            color: '#000',
                            textAlign: 'left',
                            fontWeight: 'bold',
                          }}
                        >
                          {element.pet_owner_name}
                        </Text>
                        <Text
                          style={{
                            color: '#000',
                            textAlign: 'right',
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: '#000',
                            }}
                          >
                            Ph-no-
                          </Text>{' '}
                          {element.contact_number}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginVertical: 12,
                        }}
                      >
                        <Text
                          style={{
                            color: '#000',
                            textAlign: 'left',
                          }}
                        >
                          {Petlength}
                        </Text>
                        <Text
                          style={{
                            color: '#000',
                            textAlign: 'right',
                          }}
                        >
                          {element.email}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {selectedItems.includes(element.id) && <View style={styles.overlay} />}
                </Pressable>
              </>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.floatButtons}>
        <View>
          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddPetOwner')}>
            <Text style={{ color: '#fff' }}>+ Add Pet Owners</Text>
          </TouchableOpacity>
          {/* <FAB style={styles.fab} medium icon='plus' color='#fff' onPress={() => navigation.navigate('AddPetOwner')} /> */}
        </View>

        {/* <View>
          <FAB style={styles.fab} medium icon='home' color='#fff' onPress={() => navigation.navigate('Dashboard')} />
        </View> */}

        {/* <View>
          <FAB style={styles.fab} medium icon='delete' color='#fff' onPress={() => console.log('Pressed')} />
        </View> */}
      </View>
    </>
  );
};

export default Owners;

const styles = StyleSheet.create({
  floatButtons: {
    position: 'absolute',
    marginVertical: 20,
    bottom: 0,
    alignSelf: 'center',
  },
  fab: {
    backgroundColor: '#0e4377',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 5,
  },
  textInputStyle: {
    height: 60,
    // borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    // borderColor: '#009688',
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#28AE7B90',
  },
});
