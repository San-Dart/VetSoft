import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
// import { Button } from "react-native-elements";
import axios from 'react-native-axios';
import { Dialog, Portal, Paragraph, Button } from 'react-native-paper';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import PhoneInput from 'react-native-phone-number-input';

const AddPetOwner = ({ route, navigation }) => {
  const phoneInput = React.useRef(null);
  const [formData, setFormData] = useState({
    pet_owner_name: '',
    contact_number: '',
    email: '',
    address: '',
    country: 'IN',
    state: '',
    branch_id: '',
    clinic_id: '',
  });

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [branchData, setBranchData] = useState([]);
  const [clinicData, setClinicData] = useState([]);

  const [country_data, set_country_data] = useState([]);
  const [selected_country_code, set_selected_country_code] = useState('');

  const [state_data, set_state_data] = useState([]);
  const [selected_state_code, set_selected_state_code] = useState('');

  useEffect(() => {
    getBranchData();
    getClinicData();
    getCountry();
    getSate();
  }, []);

  const getCountry = () => {
    let countryData = require('../../country.json');
    let country = country;
    country = [];
    countryData.map((elements, index) => {
      country.push({
        // id: index,
        isoCode: elements.isoCode,
        phonecode: elements.phonecode,
        name: elements.name,
        flag: elements.flag,
        label: elements.name + '' + elements.flag,
      });
      set_country_data(country);
    });
  };

  const getSate = () => {
    let stateData = require('../../state.json');
    let state = state;
    state = [];
    // stateData.filter((elements) => elements.countryCode !== 'IN')
    stateData.map((element, index) => {
      state.push({
        // id: index,
        isoCode: element.isoCode,
        countryCode: element.countryCode,
        name: element.name,
        label: element.name,
      });
      let filteredState = state.filter((elements) => elements.countryCode !== 'IN');
      set_state_data(filteredState);
      // console.log("ssssssssss", state);
    });
  };

  const getClinicData = () => {
    let clinicData = clinicData;
    clinicData = [];
    axios
      .get(`/clinic`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          clinicData.push({
            id: element.id,
            clinic: element.clinic_name,
            title: `${element.clinic_name}`,
          });
        });
        setClinicData(clinicData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBranchData = () => {
    let userClinicId = route.params.userDetails.clinic.id;
    let branchData = branchData;
    branchData = [];
    axios
      .get(`/clinic/branch/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          branchData.push({
            id: element.id,
            branch: element.branch,
            title: `${element.branch}`,
          });
        });
        setBranchData(branchData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleName = (value) => {
    setFormData({
      ...formData,
      pet_owner_name: value,
    });
  };

  const handlePhoneNumber = (value) => {
    // console.log(value);
    setFormData({
      ...formData,
      contact_number: value,
    });
  };

  const handleEmail = (value) => {
    setFormData({
      ...formData,
      email: value,
    });
  };

  const handleAddress = (value) => {
    setFormData({
      ...formData,
      address: value,
    });
  };
  const handleBranch = (value) => {
    setFormData({
      ...formData,
      branch_id: value.id,
    });
  };

  const handleClinic = (value) => {
    setFormData({
      ...formData,
      clinic_id: value.id,
    });
  };

  const handleCountryChange = (value) => {
    set_selected_country_code(value.isoCode);
    // console.log(value.isoCode);
    setFormData({
      ...formData,
      country: value.isoCode,
    });
  };

  const handleStateChange = (value) => {
    set_selected_state_code(value.isoCode);
    // console.log(value.isoCode);
    setFormData({
      ...formData,
      state: value.isoCode,
    });
  };

  const onSubmit = async () => {
    console.log(formData);
    await axios
      .post(`petOwner`, formData)
      .then((res) => {
        if (res.status == '200') {
          // navigation.navigate('petSubmitPage')
          console.log('Pet Owner Registered Successfully');
          setSuccessMsg(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg(true);
      });
  };

  const handlegoback = () => {
    setSuccessMsg(false);
    navigation.goBack();
  };

  const handleCancel = () => {
    setErrorMsg(false);
  };

  return (
    <ScrollView>
      <View style={styles.formcontainer}>
        <View style={{ marginHorizontal: '6%' }}>
          <Text style={styles.text}>Owner Name * </Text>
          <TextInput
            style={styles.textInput}
            // placeholder="Enter Name"
            onChangeText={(value) => handleName(value)}
            placeholderTextColor={'#00000060'}
          ></TextInput>

          <Text style={styles.text}>Mobile Number * </Text>
          <PhoneInput
            ref={phoneInput}
            // defaultValue={contact_number}
            onChangeFormattedText={(value) => {
              handlePhoneNumber(value);
            }}
            defaultCode='IN'
            layout='first'
            containerStyle={{
              borderColor: '#d4d2d2',
              borderWidth: 1,
              borderRadius: 5,
              backgroundColor: '#e6e3e1',
            }}
            textContainerStyle={{ backgroundColor: '#fff' }}
            placeholder='Phone Number'
            // phoneInputContainer={true}
            // withShadow
          />

          {/* <Text style={styles.text}>Mobile Number * </Text>
        <TextInput
          style={styles.textInput}
          keyboardType='number-pad'
          // placeholder="Enter Phone Number"
          onChangeText={(value) => handlePhoneNumber(value)}
          placeholderTextColor={'#00000060'}
        ></TextInput> */}
          <Text style={styles.text}>Email Id </Text>
          <TextInput
            style={styles.textInput}
            placeholder='Type Email ID'
            onChangeText={(value) => handleEmail(value)}
            placeholderTextColor={'#00000060'}
          ></TextInput>
          <Text style={styles.text}>Address * </Text>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={5}
            // placeholder="Enter Address"
            onChangeText={(value) => handleAddress(value)}
            placeholderTextColor={'#00000060'}
          ></TextInput>

          <View>
            <Text style={styles.text}>Country *</Text>
            <CustomDropdown
              // handleAddEvent={handleAddNewVisitPurpose}

              onChange={(value) => {
                value && handleCountryChange(value);
              }}
              // buttonLabel={"Eg: kg / g"}
              isButton={false}
              dropdownType={'single'}
              autoFocusSearch={true}
              enableSearch={true}
              labelField='label'
              valueField='isoCode'
              // defaultValue={formData && formData.visit_purpose}
              data={country_data}
            />
          </View>

          <View>
            <Text style={styles.text}>State</Text>
            <CustomDropdown
              dropdownLabel={'Select a State'}
              // handleAddEvent={handleAddNewVisitPurpose}
              onChange={(value) => {
                value && handleStateChange(value);
              }}
              // buttonLabel={"Eg: kg / g"}
              isButton={false}
              dropdownType={'single'}
              autoFocusSearch={true}
              enableSearch={true}
              labelField='label'
              valueField='isoCode'
              // defaultValue={formData && formData.visit_purpose}
              data={state_data}
            />
          </View>

          <View>
            <Text style={styles.text}>City</Text>
            <CustomDropdown
              dropdownLabel={'Select a city'}
              // handleAddEvent={handleAddNewVisitPurpose}
              onChange={(value) => {
                // value && handleStateChange(value);
                console.log(value);
              }}
              // buttonLabel={"Eg: kg / g"}
              isButton={false}
              dropdownType={'single'}
              autoFocusSearch={true}
              enableSearch={true}
              labelField='label'
              // valueField='isoCode'
              // defaultValue={formData && formData.visit_purpose}
              data={state_data}
            />
            {/* <Dropdown
              style={styles.region}
              // placeholder='Select...'
              maxHeight={300}
              disable
              search={true}
              placeholder='Select a City'
              data={country_data}
              labelField='label'
              valueField='isoCode'
              value={country_data}
              // item={weightUnit}
              searchPlaceholder='search...'
              selectedTextStyle={{
                color: '#006766',
              }}
              inputSearchStyle={{
                backgroundColor: '#fff',
                borderRadius: 10,
              }}
              placeholderStyle={{
                color: '#bebebe',
                fontSize: 16,
              }}
              onChange={(value) => console.log(value)}
            /> */}
          </View>

          <View>
            <Text style={styles.text}>Zip Code </Text>
            <TextInput
              style={styles.textInput}
              keyboardType='number-pad'
              placeholder='Type Zip Code'
              onChangeText={(value) => console.log('ZipCode')}
              placeholderTextColor={'#00000060'}
            ></TextInput>
          </View>

          <View>
            <Text style={styles.text}>Registering Branch: </Text>
            <CustomDropdown
              dropdownLabel={'Select Branch'}
              style={styles.region}
              // handleAddEvent={handleAddNewVisitPurpose}
              onChange={(value) => {
                value && handleBranch(value);
              }}
              // buttonLabel={"Eg: kg / g"}
              isButton={false}
              dropdownType={'single'}
              autoFocusSearch={false}
              enableSearch={true}
              labelField='branch'
              valueField='id'
              // defaultValue={formData && formData.visit_purpose}
              data={branchData}
            />
          </View>

          {/* <View>
          <Text style={styles.text}>* Clinic: </Text>
          <CustomDropdown
              // handleAddEvent={handleAddNewVisitPurpose}
              onChange={(value) => {
                value && handleClinic(value);
              }}
              // buttonLabel={"Eg: kg / g"}
              isButton={false}
              dropdownType={"single"}
              autoFocusSearch={false}
              enableSearch={true}
              labelField='clinic'
              valueField='id'
              // defaultValue={formData && formData.visit_purpose}
              data={clinicData}
          />
        </View> */}

          <View style={{ marginTop: '10%', marginBottom: '5%' }}>
            <TouchableOpacity onPress={onSubmit} style={styles.submit}>
              <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <>
          {successMsg ? (
            <Portal>
              <Dialog visible={successMsg} onDismiss={handlegoback}>
                <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>New Pet Owner has Registered Successfully</Paragraph>
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
                <Dialog.Title style={{ color: 'red' }}>Oops!</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Error while registering new Pet Owner</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={handleCancel}>Done</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          ) : (
            <></>
          )}
        </>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    // marginVertical: 10,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 14,
  },
  textInput: {
    // marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#d4d2d2',
    // padding: 10,
    // backgroundColor: '#fff',
    // borderRadius: 5,
    // elevation: 2,
    // height: 50,
  },
  textArea: {
    // marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#d4d2d2',
    // padding: 10,
    // borderColor: '#d4d2d2',
    // backgroundColor: '#fff',
    // borderRadius: 5,
    // elevation: 2,
  },
  submit: {
    backgroundColor: '#0e4377',
    borderRadius: 5,
    padding: 20,
  },
  dropdown: {
    // marginVertical: 5,
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#0E9C9B15',
    borderWidth: 0.5,
    // borderColor: '#006766',
    borderColor: '#d4d2d2',
  },
  region: {
    // backgroundColor: '#0E9C9B15',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    // borderColor: '#006766',
    borderColor: '#d4d2d2',
  },
  formcontainer: {
    margin: '5%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default AddPetOwner;
