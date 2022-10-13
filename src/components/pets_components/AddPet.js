import React, { useState, Fragment, useEffect, memo, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Switch } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'react-native-axios';
import { useIsFocused } from '@react-navigation/core';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from 'react-native-elements';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PageHeader from '../../Header_Component/PageHeader';

const AddPet = memo(({ route, navigation }) => {
  const scrollRef = useRef();

  const [formData, setFormData] = useState({
    pet_name: '',
    pet_owner_id: '',
    branch_id: '',
    pet_type_id: '',
    breed_id: '',
    pet_age: '',
    pet_color: '',
    weight: '',
    height: '',
    status: true,
    dead_date: '',
    comment: '',
    special_note: '',
    clinic: route.params.userDetails.clinic.id,
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [requiredField, setRequiredField] = useState(false);

  // form dropdown input handling

  const [petOwnersData, setPetOwnersData] = useState([]);

  const [petTypeData, setPetTypeData] = useState([]);
  // const [selectedPetTypeItem, setSelectedPetTypeItem] = useState(null);

  const [breedData, setBreedData] = useState([]);
  // const [selectedBreedItem, setSelectedBreedItem] = useState(null);

  const [petColorData, setPetColorData] = useState([]);

  const [branchData, setBranchData] = useState([]);
  const [selectedBranchItem, setSelectedBranchItem] = useState(null);

  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState('');
  const [heightUnit, setHeightUnit] = useState('');

  // End of form dropdown input handling

  // switch

  const [isActive, setIsActive] = useState(false);
  const [isDead, setIsDead] = useState(false);

  // End of switch

  // date picker
  const [date, setDate] = useState(new Date());
  const [deadDate, setDeadDate] = useState(new Date());

  const [mode, setMode] = useState('date');
  const [deadMode, setDeadMode] = useState('date');

  const [show, setShow] = useState(false);
  const [deadShow, setDeadShow] = useState(false);

  const [text, setText] = useState('');
  const [deadText, setDeadText] = useState('No Date Selected');
  // End of date picker

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getPetOwnersData();
      getPetTypeData();
      getBreedData();
      getPetColorData();
      getBranchData();
    }
  }, [isFocused]);

  const getPetOwnersData = () => {
    let petOwnersData = petOwnersData;
    petOwnersData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    // console.log(userClinicId);
    axios
      .get(`petOwner/clinic/${userClinicId}`)
      .then((res) => {
        console.log('petowner', res.data);
        res.data.map((element, index) => {
          petOwnersData.push({
            id: element.id,
            pet_owner_name: element.pet_owner_name,
            label: element.pet_owner_name,
            title: `${element.pet_owner_name} (${element.contact_number})`,
          });
        });
        setPetOwnersData(petOwnersData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPetTypeData = () => {
    let petTypeData = petTypeData;
    petTypeData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    axios
      .get(`animal/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          petTypeData.push({
            id: element.id,
            // animal_type: element.animal_type,
            animal_type: element.edited_name ? element.edited_name : element.actual_name,
            label: element.edited_name ? element.edited_name : element.actual_name,
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
    let breedData = breedData;
    breedData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    axios
      .get(`breed/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          breedData.push({
            id: element.id,
            // breed: element.breed,
            breed: element.edited_name ? element.edited_name : element.actual_name,
            label: element.edited_name ? element.edited_name : element.actual_name,
            // title: `${element.breed}`,
          });
        });
        setBreedData(breedData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPetColorData = () => {
    let petColorData = petColorData;
    petColorData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    axios
      .get(`color/clinic/${userClinicId}`)
      .then((res) => {
        console.log('colordata', res.data);
        res.data.map((element, index) => {
          petColorData.push({
            id: element.id,
            // pet_color: element.pet_color,
            pet_color: element.edited_name ? element.edited_name : element.actual_name,
            label: element.edited_name ? element.edited_name : element.actual_name,
            // title: `${element.pet_color}`,
          });
        });
        setPetColorData(petColorData);
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

  const onChangeDob = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    setText(fDate);
    handleBirthDateChange(fDate);
  };

  const onChangeDeath = (event, selectedDate) => {
    const currentDeadDate = selectedDate || date;
    setDeadShow(Platform.OS === 'ios');
    setDeadDate(currentDeadDate);

    let deathDate = new Date(currentDeadDate);
    let dDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    setDeadText(dDate);
    // console.log(dDate)
  };

  const showDeadMode = (currentDeadMode) => {
    setDeadShow(true);
    setDeadMode(currentDeadMode);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onToggleActive = () => setIsActive(!isActive);

  const onToggleDead = (value) => {
    setIsDead(value);
  };

  // form values handling

  const handlePetNameChange = (value) => {
    setFormData({
      ...formData,
      pet_name: value,
    });
  };

  const handlePetOwnerChange = (value) => {
    setFormData({
      ...formData,
      pet_owner_id: value.id,
    });
  };

  const handlePetTypeChange = (value) => {
    setFormData({
      ...formData,
      pet_type_id: value.id,
    });
  };

  const handleBreedChange = (value) => {
    setFormData({
      ...formData,
      breed_id: value.id,
    });
  };

  const handlePetColorChange = (value) => {
    setFormData({
      ...formData,
      pet_color: value.id,
    });
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

  const handleBirthDateChange = (value) => {
    setFormData({
      ...formData,
      pet_age: value,
    });
  };

  const handleDeathDateChange = (value) => {
    setFormData({
      ...formData,
      dead_date: value,
    });
  };

  const handleSpecialNoteChange = (value) => {
    setFormData({
      ...formData,
      special_note: value,
    });
  };

  const handleCommentChange = (value) => {
    setFormData({
      ...formData,
      comment: value,
    });
  };

  const handleRegisteringBranchChange = (value) => {
    setFormData({
      ...formData,
      branch_id: value.id,
    });
  };

  const addBranchDrop = () => {
    navigation.navigate('Dashboard');
  };

  const handleAddNewPetOwner = () => {
    // console.log("handleAddNewPetOwner");
    navigation.navigate('AddPetOwner');
  };

  const handleAddNewAnimalType = () => {
    // console.log("handleAddNewAnimalType");
    navigation.navigate('AddAnimal');
  };

  const handleAddNewBreed = () => {
    // console.log("handleAddNewBreed");
    navigation.navigate('AddBreed');
  };

  const handleAddNewColor = () => {
    // console.log("handleAddNewColor");
    navigation.navigate('AddColor');
  };

  const handleSubmit = () => {
    // let data = formData;
    formData.weight = formData.weight + ' ' + weightUnit;
    formData.height = formData.height + ' ' + heightUnit;
    console.log(formData);
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
      axios
        .post('/pet', formData)
        .then((res) => {
          console.log('Registered Data', res.data);
          if (res.status == '200') {
            // console.log("Registered Data", res.data);
            if (route.params.fromVisits) {
              navigation.goBack();
            } else {
              navigation.navigate('petSubmitPage', { registeredPetData: res.data.registeredPetData });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // console.log(formData.pet_age, 'formdata.age');
  // console.log(formData.height, 'formdata.height');
  console.log(formData.weight, 'formdata.weight');

  return (
    <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
      <PageHeader header={'Create a new pet'} />
      <View style={{ backgroundColor: '#f2f4fc' }}>
        <View style={styles.container}>
          <View style={styles.formcontainer}>
            <View style={styles.formItem}>
              {requiredField ? (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Pet Name</Text>
                  <Text style={styles.required}>* Required</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Pet Name</Text>
                  <Text style={styles.required}>*</Text>
                </View>
              )}

              <TextInput
                placeholder=''
                style={styles.formTextInput}
                onChangeText={(value) => {
                  value && handlePetNameChange(value);
                }}
              ></TextInput>
            </View>

            <View style={styles.formItem}>
              {requiredField ? (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Pet Owner</Text>
                  <Text style={styles.required}>* Required</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Pet Owner</Text>
                  <Text style={styles.required}>*</Text>
                </View>
              )}

              {/* Custom Dropdown */}
              <CustomDropdown
                handleAddEvent={handleAddNewPetOwner}
                onChange={handlePetOwnerChange}
                buttonLabel={'Add New Pet Owner'}
                dropdownLabel={'Select a pet Owner'}
                // defaultValue={5}
                data={petOwnersData}
              />
            </View>

            <View style={styles.formItem}>
              {requiredField ? (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Animal Type</Text>
                  <Text style={styles.required}>* Required</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Animal Type</Text>
                  <Text style={styles.required}>*</Text>
                </View>
              )}

              {/* Custom Dropdown */}
              <CustomDropdown
                handleAddEvent={handleAddNewAnimalType}
                onChange={handlePetTypeChange}
                buttonLabel={'Add New Animal Type'}
                dropdownLabel={'Select a pet Type'}
                // defaultValue={5}
                data={petTypeData}
              />
            </View>
            <View style={styles.formItem}>
              {requiredField ? (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Breed</Text>
                  <Text style={styles.required}>* Required</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Breed</Text>
                  <Text style={styles.required}>*</Text>
                </View>
              )}

              {/* Custom Dropdown */}
              <CustomDropdown
                handleAddEvent={handleAddNewBreed}
                onChange={handleBreedChange}
                buttonLabel={'Add New Breed'}
                dropdownLabel={'Select a Breed '}
                // defaultValue={5}
                data={breedData}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Color/Coat:</Text>

              {/* Custom Dropdown */}
              <CustomDropdown
                handleAddEvent={handleAddNewColor}
                onChange={handlePetColorChange}
                buttonLabel={'Add New Coloraturas'}
                dropdownLabel={'Select a Color'}
                // defaultValue={5}
                data={petColorData}
              />
            </View>

            <View style={styles.formItem}>
              {requiredField ? (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Date Of Birth</Text>
                  <Text style={styles.required}>* Required</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.formLabel}>Date Of Birth</Text>
                  <Text style={styles.required}>*</Text>
                </View>
              )}
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
                {/* <View style={{ borderRadius: 10 }}> */}
                {text ? (
                  <Text style={{ color: '#000' }}>{text}</Text>
                ) : (
                  <Text style={{ color: '#d4d2d2' }}>Select date</Text>
                )}
                {/* </View> */}
                {/* <View style={{ borderRadius: 10 }}> */}
                <MaterialIcons name='calendar-today' color={'#d4d2d2'} size={20} />
                {/* </View> */}
              </TouchableOpacity>
              <View style={styles.formInsideHeadDate}>
                {/* <Text style={styles.pickedDate}>{text}</Text> */}
                {/* <View style={{ marginTop: 20 }}> */}
                {/* <Button
                  title='Click Here to Select Date of Birth'
                  titleStyle={{ fontSize: 14 }}
                  onPress={() => showMode('date')}
                  buttonStyle={styles.dateButton}
                ></Button> */}
                {/* </View> */}
                {show && (
                  <DateTimePicker
                    testID='dateTimePicker'
                    value={date}
                    mode={mode}
                    display='default'
                    onChange={onChangeDob}
                    onChangeText={(value) => {
                      handleBirthDateChange(value);
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
                    // style={styles.formTextInputWeight}
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

            {/* <View style={styles.formInsideWeight}>
              <TextInput
              placeholder='weight'
              style={styles.formTextInputWeight}
              keyboardType='number-pad'
              onChangeText={(value) => handlePetWeightChange(value)}
              ></TextInput>

              <CustomDropdown
              // handleAddEvent={handleAddNewVisitPurpose}
              onChange={(value) => handleWeightChange(value)}
              // buttonLabel={"Eg: kg / g"}
              isButton={false}
              dropdownType={'single'}
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
            </View> */}

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
                    style={styles.formTextInputWeight}
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
                    // handleAddEvent={handleAddNewVisitPurpose}
                    onChange={(value) => handleHeightChange(value)}
                    // buttonLabel={"Eg: cm / m"}
                    isButton={false}
                    dropdownLabel={'Cm(s)'}
                    dropdownType={'single'}
                    autoFocusSearch={false}
                    enableSearch={false}
                    labelField='title'
                    valueField='value'
                    // defaultValue={formData && formData.visit_purpose}
                    data={[
                      { id: '1', title: 'cm (Centimeter)', value: 'cm' },
                      { id: '2', title: 'm (Meter)', value: 'm' },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* <View style={styles.formItem}>
            <Text style={styles.formLabel}>Height:</Text>
            <View style={styles.formInsideWeight}>
            <TextInput
            placeholder='height'
            style={styles.formTextInputWeight}
            keyboardType='number-pad'
            onChangeText={(value) => handlePetHeightChange(value)}
            ></TextInput>

            <CustomDropdown
            // handleAddEvent={handleAddNewVisitPurpose}
            onChange={(value) => handleHeightChange(value)}
            // buttonLabel={"Eg: cm / m"}
            isButton={false}
            dropdownType={'single'}
            autoFocusSearch={false}
            enableSearch={false}
            labelField='title'
            valueField='value'
            // defaultValue={formData && formData.visit_purpose}
            data={[
              { id: '1', title: 'cm (Centimeter)', value: 'cm' },
              { id: '2', title: 'm (Meter)', value: 'm' },
            ]}
            />
            </View>
          </View> */}

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Special Note</Text>
              <TextInput
                style={styles.textArea}
                placeholder='Anything like conical illness or 2 headed or 3 fingers etc'
                placeholderTextColor='#d4d2d2'
                numberOfLines={7}
                multiline={true}
                onChangeText={(value) => handleSpecialNoteChange(value)}
              />
            </View>

            {/* <View style={styles.formItem}>
            <View style={styles.formInsideSwitchHead}>
            <View style={styles.formInsideSwitch}>
            <Text style={styles.formLabel}>Active:</Text>
            <Switch value={isActive} onValueChange={onToggleActive} />
          </View> */}

            {/* <View style={styles.formInsideSwitch}>
                <Text style={styles.formLabel}>Is Dead:</Text>
                <Switch value={isDead} onValueChange={onToggleDead} />
                </View>
                </View>
                {isDead ? (
                  <View>
                  <Text style={styles.formLabel}>Date Of Death:</Text>
                  <View style={styles.formInsideDeathDate}>
                  <View style={styles.pickedDateContainer}>
                  <Text style={styles.pickedDeadDate}>{deadText}</Text>
                  </View>
                  <View style={{ marginTop: 20 }}>
                  <Button
                  title='Click Here to Select Dead Date'
                  buttonStyle={{ backgroundColor: '#0E9C9B' }}
                  onPress={() => showDeadMode('deadDate')}
                  titleStyle={{ fontSize: 14 }}
                  />
                  </View>
                  {deadShow && (
                    <DateTimePicker
                    testID='dateTimePicker'
                    value={deadDate}
                    mode={deadMode}
                    display='default'
                    onChange={onChangeDeath}
                    onChangeText={(value) => {
                      value && handleDeathDateChange(value);
                    }}
                    />
                    )}
                    </View>
                    </View>
                    ) : (
                      <></>
                      )}
                    </View> */}

            {/* <View style={styles.formItem}>
            <Text style={styles.formLabel}>Comment:</Text>
            <TextInput
            style={styles.textArea}
            placeholder='Diagnosis Notes here ...'
            placeholderTextColor='grey'
            numberOfLines={7}
            multiline={true}
            onChangeText={(value) => handleCommentChange(value)}
            />
          </View> */}

            <View style={styles.formItem}>
              <Text style={styles.formLabel}>Registering Branch</Text>
              <CustomDropdown
                // handleAddEvent={handleAddNewVisitPurpose}
                onChange={(value) => {
                  setSelectedBranchItem && handleRegisteringBranchChange(value);
                }}
                // buttonLabel={"Eg: kg / g"}
                isButton={false}
                dropdownType={'single'}
                // autoFocusSearch={false}
                enableSearch={true}
                labelField='branch'
                valueField='id'
                defaultValue={formData && formData.visit_purpose}
                data={branchData}
                dropdownLabel={'Select Branch'}
              />
            </View>

            <View>
              <TouchableOpacity
                onPress={handleSubmit}
                // onPress={() => navigation.navigate('SubmitNewVisitForm')}
              >
                <Text
                  style={{
                    marginVertical: 10,
                    backgroundColor: '#0e4377',
                    alignItems: 'center',
                    width: '100%',
                    color: '#fff',
                    textAlign: 'center',
                    paddingVertical: 15,
                    borderRadius: 10,
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
});

export default AddPet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f2f4fc',
    margin: '5%',
  },
  form: {
    margin: 20,
  },
  formcontainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    elevation: 5,
  },
  formItem: {
    marginVertical: 14,
    marginHorizontal: 10,
  },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 15,
    // height: 100,
    paddingHorizontal: 15,
    // elevation: 2,
    borderWidth: 1,
    borderColor: '#d4d2d2',
  },
  formTextInput: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    // elevation: 2,
    borderWidth: 1,
    borderColor: '#d4d2d2',
    // width: 100
  },
  formTextInputWeight: {
    // backgroundColor: '#fff',
    // padding: 10,
    // borderRadius: 20,
    // elevation: 2,
    // borderWidth: 1,
    // borderColor: '#BFD9D9',
    // width: 150,
  },
  formInsideHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  formInside: {
    width: '30%',
  },
  formInsideWeight: {
    // width: "100%",
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  formInsideSwitchHead: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  formInsideHeadDate: {
    marginHorizontal: 10,
  },
  pickedDate: {
    backgroundColor: '#fff',
    padding: 14,
    textAlign: 'center',
    borderRadius: 10,
  },
  pickedDeadDate: {
    backgroundColor: '#fff',
    padding: 14,
    textAlign: 'center',
    borderRadius: 10,
  },
  dateButton: {
    backgroundColor: '#0E9C9B',
    width: '100%',
  },
  miniDropdown: {
    marginRight: 16,
    marginVertical: 7,
    height: 35,
    width: 140,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#BFD9D9',
  },
  megaDropdown: {
    marginRight: 16,
    marginVertical: 7,
    height: 35,
    width: '100%',
    padding: 20,
    backgroundColor: '#BFD9D9',
    borderRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#BFD9D9',
  },
  required: {
    color: 'red',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
