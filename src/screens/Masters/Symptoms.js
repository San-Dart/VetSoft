import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    FlatList,
    Pressable,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    ScrollView,
} from 'react-native';
import axios from 'react-native-axios';
import { Divider, FAB, Searchbar ,Button,Dialog, Portal, Paragraph} from 'react-native-paper';
import
MaterialCommunityIcons
    from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from "@react-navigation/native";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const ListItem = ({ item, selected, onPress, onLongPress }) => (
    <>
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.listItem}
        >
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 50, padding: 10, elevation: 2 }}>
                    <MaterialCommunityIcons
                        name="paw"
                        color={'#006766'}
                        size={30}
                    />
                </View>

                <View style={{ backgroundColor: '#fff', marginVertical: 5, padding: 15, borderRadius: 14, elevation: 2, width: '80%' }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.symptom_name}</Text>
                </View>
                {selected && <View style={styles.overlay} />}
            </View>
        </TouchableOpacity>
    </>
);

const Symptom = ({ route, navigation }) => {

    const [refreshing, setRefreshing] = useState(false);

    //searchbar 
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);

    const [data, setData] = useState([]);
    const [SymptomData, setSymptomData] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);

    const [successMsg, setSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [infoMsg, setinfoMsg] = useState(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){
            getSymptomData();
        }
    }, [isFocused])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        getSymptomData();
        setSelectedItems([]);
    }, []);

    const getSymptomData = () => {
        let userClinicId = route.params.userDetails.clinic.id
        let SymptomData = SymptomData;
        SymptomData = [];
        axios.get(`symptom/clinic/${userClinicId}`).then(
            res => {
                // console.log(res.data);
                res.data.map((element, index) => {
                    SymptomData.push({
                        id: element.id,
                        // symptom_name: element.symptom_name,
                        symptom_name: element.edited_name ? element.edited_name : element.actual_name,
                        title: `${element.symptom_name}`
                    }); 
                });
                setSymptomData(SymptomData);
                setFilteredDataSource(SymptomData);
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }

    const handleOnPress = (SymptomData) => {
        if (selectedItems.length) {
            return selectItems(SymptomData);
        }
        // here you can add you code what do you want if user just do single tap
        // console.log('selectItems', SymptomData);
        navigation.navigate('EditSymptom', { SymptomData: SymptomData });
    };

    const getSelected = SymptomData => selectedItems.includes(SymptomData.id);

    const deSelectItems = () => {
        setSelectedItems([]);
        // console.log(setSelectedItems);
    };

    const selectItems = (item) => {
        if (selectedItems.includes(item.id)) {
            const newListItems = selectedItems.filter(
                listItem => listItem !== item.id,
            );
            return setSelectedItems([...newListItems]);

        }
        setSelectedItems([...selectedItems, item.id]);
        // console.log('selectedItems', selectedItems);
    };

    const onDelete = async () => {
        let newListDel = selectedItems[0];
        console.log(newListDel);
        await axios.delete(`/symptom/${newListDel}`).then(
            res=>{
                // console.log(res.data);
                if (res.status === 200) {
                    console.log('Symptom deleted');
                    onRefresh();
                    setSuccessMsg(true);
                }
                else if (res.status == "222" || res.status == "201") {
                    console.log('This record is in use. Cannot be deleted!');
                    setErrorMsg(true);
                } 
                else if (res.status == "202") {
                    console.log('Default master data cannot be deleted!');
                    setinfoMsg(true);
                }
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }
    const searchFilterFunction = (text) => {
        const newData = SymptomData.filter(item => {
            const itemData = `${item.symptom_name}   
          ${item.symptom_name}`;

            const textData = text.toLowerCase();

            return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
    };

    const handlegoback = () => {
        setSuccessMsg(false);
    }
    
    const handleCancel = () => {
        setErrorMsg(false);
    }
    
    const handleWarning = () => {
    setinfoMsg(false);
    }
    return (
        <>
            <View style={{ marginTop: 10 }}>
                <Searchbar
                    placeholder="Search By Symptoms"
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                    style={{ borderRadius: 40, margin: 10, backgroundColor: '#fff'}}
                    autoCorrect={false}
                    iconColor='#000'
                    placeholderTextColor={'#00000070'}
                    color={'#000'}
                />
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Pressable onPress={deSelectItems} style={{ flex: 1, marginBottom: 70 }}>
                    <FlatList
                        data={filteredDataSource}
                        renderItem={({ item }) => (
                            <>
                                <ListItem
                                    onPress={() => handleOnPress(item)}
                                    onLongPress={() => selectItems(item)}
                                    selected={getSelected(item)}
                                    item={item}
                                />
                            </>
                        )}
                        keyExtractor={item => item.id}
                    />
                </Pressable>
            </ScrollView>

        <View>
          <>
          {successMsg ?
                <Portal>
                  <Dialog visible={successMsg} onDismiss={handlegoback}>
                      <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>Symptom has been deleted!</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handlegoback}>Done</Button>
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
              {errorMsg ?
                <Portal>
                  <Dialog visible={errorMsg} onDismiss={handleCancel}>
                      <Dialog.Title style={{ color: 'red' }}>Error</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>This record is in use. Cannot be deleted!</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handleCancel}>Done</Button>
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
              {infoMsg ?
                <Portal>
                  <Dialog visible={infoMsg} onDismiss={handleWarning}>
                      <Dialog.Title style={{ color: 'red' }}>Info</Dialog.Title>
                      <Dialog.Content>
                          <Paragraph>Default master data cannot be deleted!</Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={handleWarning}>Done</Button>
                      </Dialog.Actions>
                  </Dialog>
                </Portal>
                : <></>
              }
          </>
        </View>

            <View style={styles.container}>
                <View>
                    <FAB
                        style={styles.fab}
                        medium
                        icon="plus"
                        color='#fff'
                        onPress={() => navigation.navigate('AddSymptom')}
                    />
                </View>

                <View>
                    <FAB
                        style={styles.fab}
                        medium
                        icon="home"
                        color='#fff'
                        onPress={() => navigation.navigate('Dashboard')}
                    />
                </View>

                <View>
                    <FAB
                        style={styles.fab}
                        medium
                        icon="delete"
                        color='#fff'
                        onPress={onDelete}
                    />
                </View>
            </View>
        </>
    );
};


export default Symptom;

const styles = StyleSheet.create({

    listItem: {
        marginBottom: 10,
        borderRadius: 5,
        overflow: 'hidden',
        marginHorizontal: 10,
        marginVertical: 5,
    },

    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#28AE7B90',
    },

    container: {
        position: 'absolute',
        marginVertical: 20,
        right: 0,
        bottom: 0,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10
    },

    fab: {
        backgroundColor: '#006766',

    },
});
