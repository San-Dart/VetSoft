import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, RefreshControl, Pressable } from 'react-native';
import axios from 'react-native-axios';
import { Divider, FAB, TextInput, Searchbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BranchFilter from '../components/BranchFilter';
import Accordion from '../components/Accordion';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/core';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Header } from 'react-native-elements';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Pets = ({ route, navigation }) => {
  const isFocused = useIsFocused();

  const [petData, setPetData] = useState([]);

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  // const [ selectedList, setSelectedList ] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [ItemSelected, setItemSelected] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const getSelected = (item) => selectedItems.includes(item.id);
  // const [deleteItems, setDeleteItems] = useState('');
  // const [del, setDel] = useState(false);

  useEffect(() => {
    if (isFocused) {
      petDetail();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      petDetail();
      setRefreshing(false);
    });
  }, []);

  const petDetail = async () => {
    let userClinicId = route.params.userDetails.clinic.id;
    console.log('userClinicId', userClinicId);
    await axios
      .get(`/pet/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {
          let petData = res.data;
          setPetData(petData);
          setFilteredDataSource(res.data);
        }
      })
      .catch((err) => {
        console.log('Error');
      });
  };

  const searchFilterFunction = (text) => {
    const newData = petData.filter((section) => {
      const itemData = `
        ${section.pet_name.toUpperCase()}
        ${section.pet_name.toLowerCase()}
        ${section.pet_owner_id.pet_owner_name.toUpperCase()}
        ${section.pet_owner_id.pet_owner_name.toLowerCase()}
        ${section.pet_owner_id.contact_number.toUpperCase()}
        ${section.pet_owner_id.contact_number.toLowerCase()}
        ${section.pet_type_id.animal_type.toLowerCase()}
        ${section.pet_type_id.animal_type.toUpperCase()}
      `;
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredDataSource(newData);
    setSearch(text);
  };

  const handleOnPress = (item) => {
    // console.log(item);
    if (selectedItems.length) {
      return selectItems(item);
    }
  };

  const deSelectItems = (item) => {
    var index = selectedItems.indexOf(item.id);
    if (index > -1) {
      selectedItems.splice(index, 1);
    }
    var deSelectedItems = selectedItems;
    setSelectedItems([...deSelectedItems]);
  };

  const selectItems = (item) => {
    if (selectedItems.includes(item.id)) {
      const newListItems = selectedItems.filter((listItem) => listItem !== item.id);
      return setSelectedItems([...newListItems]);
    }
    setSelectedItems([...selectedItems, item.id]);
  };

  return (
    <>
      <Header
        statusBarProps={{ barStyle: 'dark-content', backgroundColor: '#f2f4fc' }}
        containerStyle={{
          backgroundColor: '#f2f4fc',
        }}
        placement='right'
        leftComponent={
          <View style={{ backgroundColor: '#006766', borderRadius: 25, padding: 5 }}>
            <MaterialCommunityIcons name='paw' color={'#fff'} size={20} />
          </View>
        }
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
          <View style={{ width: '35%', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name='arrow-back-ios' color={'#000'} size={25} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Pets</Text>
          </View>
          <View style={{ width: '65%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
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
          <View style={{ marginBottom: 80 }}>
            {filteredDataSource.map((item, index) => (
              <>
                <Pressable onPress={() => deSelectItems(item)}>
                  <Accordion
                    renderListContent={renderContent(item, index)}
                    renderAccordianList={renderHeader(item, index)}
                    key={index}
                    data={item}
                    onPress={() => handleOnPress(item)}
                    onLongPress={() => selectItems(item)}
                    item={item}
                  />
                  {selectedItems.includes(item.id) && <View style={styles.overlay} />}
                </Pressable>
              </>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.floatButtons}>
        <View>
          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddPet')}>
            <Text style={{ color: '#fff' }}>+ Add Pet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const renderContent = (item, _) => {
  const navigation = useNavigation();

  const getIndividualPetDetails = (item) => {
    navigation.navigate('AddNewVisitDetails', { petNotification: item.id, navOptionsFromPets: item });
  };

  const getIndividualVisitHistoryDetails = (item) => {
    navigation.navigate('VisitHistory', { petData: item.id });
  };

  const onEdit = (item) => {
    navigation.navigate('EditPet', { petDetails: item });
  };

  const onDelete = async (item) => {
    // console.log('Item', item);
    let newListDel = item;
    await axios
      // .delete(`/breed/${newListDel}`)
      .get(`/pet/${item.id}`)
      .then((res) => {
        if (res.status === 200) {
          console.log('Item', res);
          console.log('Breed deleted');
        } else if (res.status == '222' || res.status == '201') {
          console.log('This record is in use. Cannot be deleted!');
        } else if (res.status == '202') {
          console.log('Default master data cannot be deleted!');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // console.log(item, 'item.age');

  //Accordion Content view
  return (
    <View key={_}>
      {/* <TouchableOpacity style={styles.editPetButton} onPress={() => onEdit(item)}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>Edit Pet</Text>
      </TouchableOpacity> */}
      <View style={styles.accBut}>
        <TouchableOpacity style={styles.petListButton} onPress={() => getIndividualPetDetails(item)}>
          <Text style={styles.accordionButton}>Start Consultation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.petListButton} onPress={() => navigation.navigate('Message')}>
          <Text style={styles.accordionButton}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.petListButton} onPress={() => navigation.navigate('PetDetails', item)}>
          <Text style={styles.accordionButton}>Pet Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.petListButton} onPress={() => getIndividualVisitHistoryDetails(item)}>
          <Text style={styles.accordionButton}>Visit History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.petListDELButton} onPress={() => onDelete(item)}>
          <MaterialIcons name='delete' color={'#fff'} size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const renderHeader = (item, _) => {
  // let colors = ['#fff', '#006766'];
  // let textColor = ['#000', '#fff'];

  //Accordion Header view
  return (
    <View style={styles.header} key={_}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: '#fff',
          paddingHorizontal: 3,
        }}
      >
        {/* For Pet Icon */}
        <View
          style={{
            padding: 5,
            elevation: 1,
            borderRadius: 25,
            width: '15%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {item.pet_type_id.animal_type == 'goat' ? (
            <MaterialCommunityIcons name='sheep' color={'#fff'} size={40} />
          ) : (
            <MaterialCommunityIcons name={item.pet_type_id.animal_type} color={'#fff'} size={40} />
          )}
        </View>

        {/* For Pet Details */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            padding: 10,
            // borderRadius: 10,
            // borderWidth: 0.5,
            // borderColor: '#fff',
            width: '85%',
          }}
        >
          <View style={{ width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                style={{
                  color: '#0e4377',
                  fontWeight: 'bold',
                  fontSize: 17,
                  textAlign: 'left',
                  textTransform: 'capitalize',
                }}
              >
                {item.pet_name} / {item.pet_owner_id.pet_owner_name}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#000',
                  textAlign: 'right',
                  textTransform: 'capitalize',
                }}
              >
                {item.pet_owner_id.contact_number}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 13,
                    textAlign: 'left',
                    textTransform: 'capitalize',
                  }}
                >
                  {item.pet_type_id.animal_type} / {item.breed_id.breed}
                </Text>
                {item.pet_age ? (
                  <Text style={{ color: '#0E9C9B' }}>{item.pet_age}</Text>
                ) : (
                  <Text style={{ color: '#0E9C9B' }}>{'NA'}</Text>
                )}
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: '#000',
                  textAlign: 'right',
                }}
              >
                Last Visited{'\n'}
                {item.last_visit ? (
                  <Text style={{ color: '#0E9C9B' }}>{item.last_visit}</Text>
                ) : (
                  <Text style={{ color: '#0E9C9B' }}>{'NA'}</Text>
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Pets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4fc',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    // backgroundColor: '#F5FCFF',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    // paddingTop: 0,
    backgroundColor: '#fff',
    height: 120,
    width: '100%',
  },
  active: {
    backgroundColor: '#BFD9D9',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    // backgroundColor: '#E5E5FF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  accordionButton: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 2,
  },
  accBut: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // marginTop: 15,
    // marginHorizontal: 2,
  },
  petListButton: {
    backgroundColor: '#1695b5',
    justifyContent: 'center',
    // alignItems: 'center',
    maxWidth: '25%',
    paddingHorizontal: '2%',
    paddingVertical: '3%',
    elevation: 0,
    borderRadius: 5,
  },
  petListDELButton: {
    padding: 10,
    backgroundColor: '#1695b5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  floatButtons: {
    position: 'absolute',
    marginVertical: 20,
    bottom: 0,
    alignSelf: 'center',
  },
  fab: {
    backgroundColor: '#0e4377',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
  },
  // editPetButton: {
  //   padding: 8,
  //   backgroundColor: '#F2AA4CFF',
  //   marginTop: 5,
  //   elevation: 2,
  // },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#28AE7B90',
  },
});
