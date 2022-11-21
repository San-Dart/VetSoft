import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import axios from 'react-native-axios';
import { useIsFocused } from '@react-navigation/core';
import { Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import PageHeader from '../../Header_Component/PageHeader';

const AddBreed = ({ route, navigation }) => {
  const [formData, setFormData] = useState({
    breed: '',
    animal_type: '',
  });

  //dropdown
  const [petTypeData, setPetTypeData] = useState([]);

  const isFocused = useIsFocused();

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [warningMsg, setWarningMsg] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getPetTypeData();
    }
  }, [isFocused]);

  const getPetTypeData = () => {
    let userClinicId = route.params.userDetails.clinic.id;
    let petTypeData = petTypeData;
    petTypeData = [];
    axios
      .get(`animal/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          petTypeData.push({
            id: element.id,
            animal_type: element.edited_name ? element.edited_name : element.actual_name,
            label: element.edited_name ? element.edited_name : element.actual_name,
          });
        });
        setPetTypeData(petTypeData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePetNameChange = (value) => {
    console.log('Pet', value);
    setFormData({
      ...formData,
      breed: value,
    });
  };

  const handlePetTypeChange = (value) => {
    console.log(value);
    setFormData({
      ...formData,
      animal_type: value.id,
    });
  };

  const handleSubmit = async () => {
    console.log(formData);
    await axios
      .post('/breed', formData)
      .then((res) => {
        if (res.status == '200') {
          // navigation.navigate('PetSubmitPage')
          console.log('Breed Registered Successfully');
          setSuccessMsg(true);
        } else if (res.status == '210') {
          console.log('Record already exists.');
          setWarningMsg(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg(true);
      });
  };
  const handleAddNewAnimal = () => {
    console.log('handleAddNewBreed');
    navigation.navigate('AddAnimal');
  };

  const handlegoback = () => {
    setSuccessMsg(false);
    navigation.goBack();
  };

  const handleCancel = () => {
    setErrorMsg(false);
  };

  const handleAdd = () => {
    console.log('On Click');
  };

  const handleWarning = () => {
    setWarningMsg(false);
  };

  return (
    <>
      <PageHeader header={'Create a New Breed'} />
      <View style={{ backgroundColor: '#f2f4fc', flex: 1 }}>
        <View style={styles.container}>
          {/* <View
        style={{
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      > */}
          {/* <View style={{ marginHorizontal: 10 }}> */}
          {/* <View style={styles.formItem}> */}
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.heading}>Breed</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            // placeholder='Ex: Labrador Retriever'
            style={styles.formTextInput}
            onChangeText={(value) => {
              value && handlePetNameChange(value);
            }}
          ></TextInput>
          {/* </View> */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>Associated Animal</Text>

            {/* Custom Dropdown */}
            <View style={{ borderWidth: 1, borderRadius: 15, borderColor: '#d4d2d2' }}>
              <CustomDropdown
                handleAddEvent={handleAddNewAnimal}
                onChange={handlePetTypeChange}
                buttonLabel={'Add New Pet'}
                dropdownLabel={'Select Animal Type'}
                // defaultValue={5}
                data={petTypeData}
              />
            </View>
          </View>

          <View>
            <>
              {successMsg ? (
                <Portal>
                  <Dialog visible={successMsg} onDismiss={handlegoback}>
                    <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                    <Dialog.Content>
                      <Paragraph>New Breed has been Succesfully added</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={handlegoback}>Done</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              ) : (
                <></>
              )}
              {errorMsg ? (
                <Portal>
                  <Dialog visible={errorMsg} onDismiss={handleCancel}>
                    <Dialog.Title style={{ color: '#FF0000' }}>Oops!</Dialog.Title>
                    <Dialog.Content>
                      <Paragraph>Error while registering new breed</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={handleCancel}>Done</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              ) : (
                <></>
              )}
              {warningMsg ? (
                <Portal>
                  <Dialog visible={warningMsg} onDismiss={handleWarning}>
                    <Dialog.Title style={{ color: '#FF0000' }}>Warning!</Dialog.Title>
                    <Dialog.Content>
                      <Paragraph>Record already exists</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={handleWarning}>Done</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              ) : (
                <></>
              )}
            </>
          </View>
          {/* </View> */}
          <View>
            <TouchableOpacity
              onPress={handleSubmit}
              // onPress={() => navigation.navigate('SubmitNewVisitForm')}
            >
              <Text
                style={{
                  backgroundColor: '#0e4377',
                  alignItems: 'center',
                  color: '#fff',
                  textAlign: 'center',
                  paddingVertical: 15,
                  borderRadius: 15,
                  marginTop: 20,
                  fontWeight: 'bold',
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </View>
      </View>
    </>
  );
};

export default AddBreed;

const styles = StyleSheet.create({
  container: { margin: '5%', padding: '5%', backgroundColor: '#fff', borderRadius: 15, elevation: 5 },
  heading: {
    fontWeight: 'bold',
  },
  required: {
    color: 'red',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '100%'
  },
  dropdownInput: {
    width: '100%',
    padding: 10,
    marginBottom: 1,
    color: '#000',
    backgroundColor: '#e1e9f2',
  },
  inputText: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  formItem: {
    marginVertical: 14,
    // marginHorizontal: 10,
  },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
  },
  formTextInput: {
    borderRadius: 15,
    height: 45,
    padding: 10,
    // marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    // elevation: 2,
    borderWidth: 1,
    borderColor: '#d4d2d2',
  },
  formTextInputInside: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    // marginHorizontal: '5%',
    borderRadius: 20,
  },
  submit: {
    marginHorizontal: 16,
    marginVertical: 10,
    height: 40,
  },
});
