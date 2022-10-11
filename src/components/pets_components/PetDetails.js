import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'react-native-axios';
import DatePicker from 'react-native-datepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PageHeader from '../../Header_Component/PageHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDropdown from '../CustomDropdown/CustomDropdown';

const PetDetails = ({ route, navigation }) => {
  const params = route.params;
  console.log('params', params);
  const [formData, setFormData] = useState({
    pet_name: '',
    pet_type_id: '',
    breed_id: '',
    pet_color: '',
    pet_age: '',
    weight: '',
    height: '',
    pet_owner_id: '',
    special_note: '',
    branch_id: '',
    dead_date: '',
  });

  const [breedData, setBreedData] = useState([]);
  const [petOwnersData, setPetOwnersData] = useState([]);
  const [petTypeData, setPetTypeData] = useState([]);
  const [petColorData, setPetColorData] = useState([]);
  const [petOwnerData, setPetOwnerData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [selectedBranchItem, setSelectedBranchItem] = useState(null);

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [requiredField, setRequiredField] = useState(false);

  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState('');
  const [heightUnit, setHeightUnit] = useState('');

  // date picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    setFormData({
      ...formData,
      pet_name: params.pet_name,
      pet_type_id: params.pet_type_id.id,
      breed_id: params.breed_id.id,
      pet_color: params.pet_color,
      pet_age: params.pet_age,
      weight: params.weight,
      height: params.height,
      pet_owner_id: params.pet_owner_id.id,
      special_note: params.special_note,
      branch_id: params.branch_id,
    });
    getPetTypeData();
    getBreedData();
    getPetColorData();
    getOwnerData();
    getBranchData();
  }, []);

  const getPetTypeData = () => {
    let userClinicId = route.params.userDetails.clinic.id;
    let petTypeData = petTypeData;
    petTypeData = [];
    axios
      .get(`animal/clinic/${userClinicId}`)
      .then((res) => {
        console.log('petTypeData', res.data);
        res.data.map((element, index) => {
          petTypeData.push({
            id: element.id,
            animal_type: element.edited_name ? element.edited_name : element.actual_name,
            // title: `${element.animal_type}`,
          });
        });
        setPetTypeData(petTypeData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBreedData = () => {
    let userClinicId = route.params.userDetails.clinic.id;
    // console.log(userClinicId);
    let breedData = breedData;
    breedData = [];
    axios
      .get(`breed/clinic/${userClinicId}`)
      .then((res) => {
        console.log('breedData', res.data);
        res.data.map((element, index) => {
          breedData.push({
            id: element.id,
            breed: element.edited_name ? element.edited_name : element.actual_name,
            // title: `${element.breed}`,
          });
        });
        setBreedData(breedData);
        // console.log(breedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPetColorData = () => {
    let userClinicId = route.params.userDetails.clinic.id;
    let petColorData = petColorData;
    petColorData = [];
    axios
      .get(`color/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          petColorData.push({
            id: element.id,
            // color: element.color,
            color: element.edited_name ? element.edited_name : element.actual_name,
            title: `${element.color}`,
          });
        });
        setPetColorData(petColorData);
        // console.log(petColorData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getOwnerData = async () => {
    let userClinicId = route.params.userDetails.clinic.id;
    let petOwnerData = petOwnerData;
    petOwnerData = [];
    await axios
      .get(`petOwner/clinic/${userClinicId}`)
      .then((res) => {
        console.log('petOwnerData', res.data);
        res.data.map((element, index) => {
          petOwnerData.push({
            id: element.id,
            pet_owner_name: element.pet_owner_name,
          });
        });
        setPetOwnerData(petOwnerData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBranchData = () => {
    let userClinicId = route.params.userDetails.clinic.id;
    console.log(userClinicId);
    let branchData = branchData;
    branchData = [];
    axios
      .get(`/clinic/branch/${userClinicId}`)
      .then((res) => {
        console.log('branch', res.data);
        res.data.map((element, index) => {
          branchData.push({
            id: element.id,
            branch: element.branch,
            title: `${element.branch}`,
          });
        });
        setBranchData(res.data);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePetName = (value) => {
    setFormData({
      ...formData,
      pet_name: value,
    });
  };

  const handlePetType = (value) => {
    setFormData({
      ...formData,
      pet_type_id: value.id,
    });
  };

  const handleBreed = (value) => {
    setFormData({
      ...formData,
      breed_id: value.id,
    });
  };

  const handleColor = (value) => {
    setFormData({
      ...formData,
      pet_color: value.id,
    });
  };

  const handleDob = (value) => {
    console.log(value, 'date');
    setFormData({
      ...formData,
      pet_age: value,
    });
    console.log(formData.pet_age, 'date');
  };

  const handleWeight = (value) => {
    setFormData({
      ...formData,
      weight: value,
    });
  };

  const handleHeight = (value) => {
    setFormData({
      ...formData,
      height: value,
    });
  };

  const handleOwnerName = (value) => {
    setFormData({
      ...formData,
      pet_owner_id: value.id,
    });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onChangeDob = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    setText(fDate);
    handleDob(fDate);
  };

  // for weight
  const handleWeightChange = (value) => {
    setWeightUnit(value.value);
  };
  const handlePetWeightChange = (value) => {
    if (value == '') {
      setWeight(0);
    } else {
      setWeight(parseInt(value));
    }
    WeightSet(value);
  };
  const handlePetWeightincrement = (value) => {
    setWeight((prevweight) => prevweight + 1);
    WeightSet(weight);
  };
  const handlePetWeightdecrement = (value) => {
    setWeight((prevweight) => prevweight - 1);
    WeightSet(weight);
  };
  const WeightSet = (value) => {
    setFormData({
      ...formData,
      weight: value,
    });
  };

  // for Height
  const handleHeightChange = (value) => {
    setHeightUnit(value.value);
  };
  const handlePetHeightChange = (value) => {
    if (value == '') {
      setHeight(0);
    } else {
      setHeight(parseInt(value));
    }
    HeightSet(value);
  };
  const handlePetHeightincrement = (value) => {
    setHeight((prevheight) => prevheight + 1);
    HeightSet(height);
  };
  const handlePetHeightdecrement = (value) => {
    setHeight((prevheight) => prevheight - 1);
    HeightSet(height);
  };
  const HeightSet = (value) => {
    setFormData({
      ...formData,
      height: value,
    });
  };

  const handleSpecialNoteChange = (value) => {
    setFormData({
      ...formData,
      special_note: value,
    });
  };

  const handleRegisteringBranchChange = (value) => {
    setFormData({
      ...formData,
      branch_id: value.id,
    });
  };

  // const handleEmail = (value) => {
  //     setFormData({
  //       ...formData,

  // };

  // const handlePhone = (value) => {
  //     setFormData({
  //       ...formData,

  //     });
  // };

  const onSubmit = () => {
    formData.weight = formData.weight + ' ' + weightUnit;
    formData.height = formData.height + ' ' + heightUnit;

    if (formData.pet_name == '') {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
      setRequiredField(true);
    } else if (formData.pet_owner_id == '') {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
      setRequiredField(true);
    } else if (formData.pet_type_id == '') {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
      setRequiredField(true);
    } else if (formData.breed_id == '') {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
      setRequiredField(true);
    } else {
      // console.log(formData);
      let petId = route.params.id;
      // console.log('paramsss', petId);
      axios
        .put(`pet/update/${petId}`, formData)
        .then((res) => {
          // console.log(res.data);
          if (res.status === 200) {
            // console.log(res.data);
            //  navigation.navigate('');
            setSuccessMsg(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handlegoback = () => {
    setSuccessMsg(false);
    // navigation.navigate('Users');
    navigation.goBack();
  };

  const handleCancel = () => {
    setErrorMsg(false);
  };

  const handleAddNewPetOwner = () => {
    navigation.navigate('AddPetOwner');
  };

  return (
    <>
      <ScrollView>
        <PageHeader header={'Update Pet'} />
        <View style={styles.display}>
          <View style={{ padding: 10, margin: 10, backgroundColor: '#fff', elevation: 5, borderRadius: 10 }}>
            {/* <View style={{ marginHorizontal: 10, alignItems: 'flex-end' }}>
              {show ? (
                <Button
                  title='Edit'
                  buttonStyle={styles.editBtn}
                  onPress={() => setShow(false)}
                  titleStyle={{ color: '#fff' }}
                ></Button>
              ) : (
                <Button
                  title='Cancel'
                  buttonStyle={styles.cancelBtn}
                  // onPress={() => setShow(true)}
                  onPress={() => setShow(true)}
                ></Button>
              )}
            </View> */}

            {/* <View>
              <Text style={{ fontSize: 18, margin: 20 }}>Pet Profile</Text>
            </View> */}

            {/* <View style={styles.parallel}> */}

            <View style={styles.formItem}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.formLabel}>Pet Name</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                placeholder={params.pet_name}
                placeholderStyle={{ color: '#00000070', fontSize: 12 }}
                style={styles.formTextInput}
                onChangeText={(value) => {
                  value && handlePetName(value);
                }}
              ></TextInput>
            </View>

            {/* <View>
              <Text style={styles.heading}>Name :</Text>
              {show ? (
                <Text style={styles.text}>{params.pet_name}</Text>
              ) : (
                <TextInput
                  style={styles.textbox}
                  defaultValue={params.pet_name}
                  onChangeText={(value) => {
                    handlePetName(value);
                  }}
                />
              )}
            </View> */}

            <View style={styles.formItem}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.formLabel}>Pet Owner</Text>
                <Text style={styles.required}>*</Text>
              </View>

              <Dropdown
                search
                searchPlaceholder='Search...'
                placeholder='Select OwnerName'
                style={styles.dropdown}
                data={petOwnerData}
                labelField='pet_owner_name'
                valueField='id'
                placeholderStyle={{ color: '#00000070', fontSize: 12 }}
                // value={params.pet_owner_id.pet_owner_name}
                // defaultValue={params.pet_owner_id.pet_owner_name}
                value={formData && formData.pet_owner_id}
                onChange={(value) => {
                  value && handleOwnerName(value);
                }}
                selectedTextStyle={{ color: '#000', textTransform: 'capitalize' }}
              />
            </View>

            <View style={styles.formItem}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.formLabel}>Animal Type</Text>
                <Text style={styles.required}>*</Text>
              </View>

              <Dropdown
                // defaultValue={params.pet_type_id.animal_type}
                value={formData && formData.pet_type_id}
                style={styles.dropdown}
                search
                searchPlaceholder='Search...'
                placeholder='Select Animal Type'
                placeholderStyle={{ color: '#00000070', fontSize: 12 }}
                data={petTypeData}
                labelField='animal_type'
                valueField='id'
                onChange={(value) => {
                  value && handlePetType(value);
                }}
                selectedTextStyle={{ color: '#000', textTransform: 'capitalize' }}
              />
              {/* )} */}
            </View>

            <View style={styles.formItem}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.formLabel}>Breed</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <Dropdown
                value={formData && formData.breed_id}
                style={styles.dropdown}
                search
                searchPlaceholder='Search...'
                placeholder='Select Breed'
                placeholderStyle={{ color: '#00000070', fontSize: 12 }}
                data={breedData}
                maxHeight={300}
                labelField='breed'
                valueField='id'
                onChange={(value) => {
                  value && handleBreed(value);
                }}
                selectedTextStyle={{ color: '#000', textTransform: 'capitalize' }}
              />
            </View>

            <View style={styles.formItem}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.formLabel}>Color/Coat</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <Dropdown
                style={styles.dropdown}
                placeholder='Select Color'
                search
                searchPlaceholder='Search...'
                data={petColorData}
                maxHeight={300}
                labelField='color'
                placeholderStyle={{ color: '#00000070', fontSize: 12 }}
                valueField='id'
                value={formData && formData.pet_color}
                onChange={(value) => {
                  value && handleColor(value);
                }}
                selectedTextStyle={{ color: '#000', textTransform: 'capitalize' }}
              />
            </View>

            <View style={styles.formItem}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.formLabel}>Date Of Birth</Text>
                <Text style={styles.required}>*</Text>
              </View>

              <TouchableOpacity
                onPress={() => showMode('date')}
                style={{
                  borderWidth: 1,
                  flexDirection: 'row',
                  borderRadius: 10,
                  borderColor: '#d4d2d2',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 10,
                }}
              >
                {text ? (
                  <Text style={{ color: '#000' }}>{text}</Text>
                ) : (
                  <Text style={{ color: '#d4d2d2' }}>{params.pet_age}</Text>
                )}

                <MaterialIcons name='calendar-today' color={'#d4d2d2'} size={20} />
              </TouchableOpacity>
              <View style={styles.formInsideHeadDate}>
                {show && (
                  <DateTimePicker
                    testID='dateTimePicker'
                    value={date}
                    mode={mode}
                    display='default'
                    onChange={onChangeDob}
                    onChangeText={(value) => {
                      handleDob(value);
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Weight</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: '20%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderColor: '#d4d2d2',
                    borderRightWidth: 0,
                    borderWidth: 1,
                    height: 42,
                  }}
                >
                  <TextInput
                    placeholder='0'
                    maxLength={5}
                    keyboardType='number-pad'
                    onChangeText={(value) => handlePetWeightChange(value)}
                  >
                    {weight}
                  </TextInput>
                </View>
                <View
                  style={{
                    width: '10%',
                    justifyContent: 'space-between',
                    borderColor: '#d4d2d2',
                    borderWidth: 1,
                    height: 42,
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#d4d2d2',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity onPress={(value) => handlePetWeightincrement(value)}>
                      <MaterialIcons name='keyboard-arrow-up' color={'#d4d2d2'} size={20} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      borderColor: '#d4d2d2',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity onPress={(value) => handlePetWeightdecrement(value)} disabled={weight == 0}>
                      <MaterialIcons name='keyboard-arrow-down' color={'#d4d2d2'} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ width: '70%' }}>
                  <CustomDropdown
                    onChange={(value) => handleWeightChange(value)}
                    isButton={false}
                    dropdownType={'single'}
                    dropdownLabel={'Kilogram(s)'}
                    autoFocusSearch={false}
                    enableSearch={false}
                    labelField='title'
                    valueField='value'
                    defaultValue={formData && formData.visit_purpose}
                    data={[
                      { id: '1', title: 'kg (KiloGram)', value: 'kg' },
                      { id: '2', title: 'g (Grams)', value: 'g' },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Height</Text>
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    width: '20%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderColor: '#d4d2d2',
                    borderRightWidth: 0,
                    borderWidth: 1,
                  }}
                >
                  <TextInput
                    placeholder='0'
                    maxLength={4}
                    keyboardType='number-pad'
                    onChangeText={(value) => handlePetHeightChange(value)}
                  >
                    {height}
                  </TextInput>
                </View>
                <View
                  style={{
                    width: '10%',
                    justifyContent: 'space-between',
                    borderColor: '#d4d2d2',
                    borderWidth: 1,
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#d4d2d2',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity onPress={(value) => handlePetHeightincrement(value)}>
                      <MaterialIcons name='keyboard-arrow-up' color={'#d4d2d2'} size={20} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      borderColor: '#d4d2d2',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity onPress={(value) => handlePetHeightdecrement(value)} disabled={height == 0}>
                      <MaterialIcons name='keyboard-arrow-down' color={'#d4d2d2'} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ width: '70%' }}>
                  <CustomDropdown
                    onChange={(value) => handleHeightChange(value)}
                    isButton={false}
                    dropdownLabel={'Cm(s)'}
                    dropdownType={'single'}
                    autoFocusSearch={false}
                    enableSearch={false}
                    labelField='title'
                    valueField='value'
                    data={[
                      { id: '1', title: 'cm (Centimeter)', value: 'cm' },
                      { id: '2', title: 'm (Meter)', value: 'm' },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* <View style={styles.parallel}>
              <Text style={styles.heading}>Weight:</Text>
              {show ? (
                <Text style={styles.text}>{params.weight}</Text>
              ) : (
                <TextInput
                  style={styles.textbox}
                  defaultValue={params.weight}
                  onChangeText={(value) => {
                    handleWeight(value);
                  }}
                />
              )}
            </View> */}

            {/* <View style={styles.parallel}>
              <Text style={styles.heading}>Height:</Text>
              {show ? (
                <Text style={styles.text}>{params.height}</Text>
              ) : (
                <TextInput
                  style={styles.textbox}
                  defaultValue={params.height}
                  onChangeText={(value) => {
                    handleHeight(value);
                  }}
                />
              )}
            </View> */}

            {/* <View>
              <View>
                <Text style={{ fontSize: 18, margin: 20 }}>Owner Profile</Text>
              </View>

              <View style={styles.parallel}>
                <Text style={styles.heading}>Owner Name :</Text>
                {show ? (
                  <Text style={styles.text}>{params.pet_owner_id.pet_owner_name}</Text>
                ) : (
                  <Dropdown
                    search
                    searchPlaceholder='Search...'
                    placeholder='Select OwnerName'
                    style={styles.dropdown}
                    data={petOwnerData}
                    labelField='pet_owner_name'
                    valueField='id'
                    placeholderStyle={{ color: '#00000070', fontSize: 12 }}
                    // value={params.pet_owner_id.pet_owner_name}
                    // defaultValue={params.pet_owner_id.pet_owner_name}
                    value={formData && formData.pet_owner_id}
                    onChange={(value) => {
                      value && handleOwnerName(value);
                    }}
                    selectedTextStyle={{ color: '#000', textTransform: 'capitalize' }}
                  />
                )}
              </View>

              <View style={styles.parallel}>
                <Text style={styles.heading}>Email :</Text>
                {show ? (
                  <Text style={styles.text}>{params.pet_owner_id.email}</Text>
                ) : (
                  <TextInput
                    style={styles.textbox}
                    defaultValue={params.pet_owner_id.email}
                    // onChangeText={(value) => {
                    //   handleEmail(value);
                    // }}
                  />
                )}
              </View>

              <View style={styles.parallel}>
                <Text style={styles.heading}>Phone :</Text>
                {show ? (
                  <Text style={styles.text}>{params.pet_owner_id.contact_number}</Text>
                ) : (
                  <TextInput
                    style={styles.textbox}
                    defaultValue={params.pet_owner_id.contact_number}
                    // onChangeText={(value) => {
                    //    handlePhone(value);
                    // }}
                  />
                )}
              </View>
            </View> */}

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Special Note</Text>
              <TextInput
                style={styles.textArea}
                placeholder={params.special_note}
                placeholderTextColor='#d4d2d2'
                numberOfLines={7}
                multiline={true}
                onChangeText={(value) => handleSpecialNoteChange(value)}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Registering Branch</Text>
              <CustomDropdown
                onChange={(value) => {
                  setSelectedBranchItem && handleRegisteringBranchChange(value);
                }}
                isButton={false}
                dropdownType={'single'}
                enableSearch={true}
                labelField='branch'
                valueField='id'
                defaultValue={formData && formData.visit_purpose}
                data={branchData}
                dropdownLabel={'Select Branch'}
              />
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity onPress={onSubmit}>
                <Text style={styles.submit}>Save</Text>
              </TouchableOpacity>
            </View>

            {/* <View style={styles.row}>
            {show ? (
              <Button
                title='Save'
                buttonStyle={styles.btn}
                // onPress={onSubmit}
                // onPress={onDone}
              ></Button>
            ) : (
              <Button
                title='Submit'
                buttonStyle={styles.btn}
                // onPress={() => setShow(true)}
                onPress={onSubmit}
              ></Button>
            )}
          </View> */}
          </View>
        </View>
      </ScrollView>
      <View>
        <>
          {successMsg ? (
            <Portal>
              <Dialog visible={successMsg} onDismiss={handlegoback}>
                <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>User Registered Successfully</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={handlegoback} title='Done' />
                </Dialog.Actions>
              </Dialog>
            </Portal>
          ) : (
            <></>
          )}
          {errorMsg ? (
            <Portal>
              <Dialog visible={errorMsg} onDismiss={handleCancel}>
                <Dialog.Title style={{ color: 'red' }}>Oops!</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Error while registering new User</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={handleCancel} title='Done' />
                </Dialog.Actions>
              </Dialog>
            </Portal>
          ) : (
            <></>
          )}
        </>
      </View>
    </>
  );
};

export default PetDetails;

const styles = StyleSheet.create({
  formItem: {
    marginHorizontal: 10,
    marginVertical: 14,
  },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
  },
  required: {
    color: 'red',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  formTextInput: {
    height: 42,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4d2d2',
    fontSize: 15,
    textTransform: 'capitalize',
    padding: 10,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 15,

    paddingHorizontal: 15,

    borderWidth: 1,
    borderColor: '#d4d2d2',
  },
  datePickerStyle: {
    width: '80%',
  },
  parallel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 15,
    elevation: 3,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  heading: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    color: '#000',
    fontSize: 14,
  },
  display: {
    // marginVertical: 20,
    backgroundColor: '#f2f4fc',
  },
  editBtn: {
    width: 80,
    backgroundColor: '#0E9C9B',
    borderRadius: 20,
  },
  cancelBtn: {
    width: 80,
    backgroundColor: 'red',
    borderRadius: 20,
  },
  textbox: {
    height: 35,
    width: 180,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 1,
  },
  btn: {
    width: '100%',
    backgroundColor: '#006766',
    // marginHorizontal: 10,
    paddingVertical: 20,
  },
  dropdown: {
    padding: 5,
    borderColor: '#d4d2d2',
    borderWidth: 1,
    borderRadius: 10,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerStyle: {
    width: 120,
  },
  formButtons: {
    width: '100%',
  },
  submit: {
    marginTop: 15,
    backgroundColor: '#0e4377',
    alignItems: 'center',
    width: '100%',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    fontWeight: 'bold',
  },
});
