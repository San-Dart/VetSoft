import React, { useState, useEffect } from 'react';
import { Button, TextInput, Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Divider, Switch, Dialog, Portal, Paragraph } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import axios from 'react-native-axios';
// import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { MultiSelect } from 'react-native-element-dropdown';
import { useIsFocused } from '@react-navigation/core';
import { Header } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { color } from 'react-native-elements/dist/helpers';

const AddNewVisitDetails = ({ route, navigation }) => {
  const [formData, setFormData] = useState({
    pet_id: '',
    owner_name_id: '',
    visited_date: '',
    visit_purpose: '',
    visited_clinic_id: '',
    doctor_name: '',
    symptoms_data: [],
    injections_data: [],
    disease: '',
    weight: '',
    branch_id: '',
    diagnosis_note: '',
    doctor_note: '',
    prescription_id: '',
    visit_type: '',
    client_access_disease: false,
    client_access_symptom: false,
    vaccine: '',
    client_access_injection_data: false,
    is_submited: false,
    isPrescriptionEdited: false,
  });

  const isFocused = useIsFocused();

  const [weight, setWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState('');

  const [clientAccess, setClientAccess] = useState(isSwitchOnSymptoms);
  const [clientAccessDisease, setClientAccessDisease] = useState(isSwitchOnDisease);
  const [clientAccessInjection, setClientAccessInjection] = useState(isSwitchOnInjection);

  const units = [
    { label: 'Kilogram', value: 'kg', id: 1 },
    { label: 'Gram(g)', value: 'g', id: 2 },
  ];

  const [selectedItem, setSelectedItem] = useState(null);

  const [afterSubmit, setAfterSubmit] = useState(false);

  const [individualPetData, setIndividualPetData] = useState({});

  // form dropdown input handling
  const [files, setFiles] = useState([]);

  const [visitPurposeData, setVisitPurposeData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [visitTypeData, setVisitTypeData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [vaccinationData, setVaccinationData] = useState(false);
  const [vaccineData, setVaccineData] = useState([]);

  const [medicineData, setMedicineData] = useState([]);

  const [symptomsData, setSymptomsData] = useState([]);

  const [isSwitchOnDisease, setIsSwitchOnDisease] = useState(false);
  const [isSwitchOnSymptoms, setIsSwitchOnSymptoms] = useState(false);
  const [isSwitchOnInjection, setIsSwitchOnInjection] = useState(false);

  const [newPrescMedicineData, setNewPrescMedicineData] = useState([]);
  const [newPrescData, setNewPrescData] = useState([]);

  // const [branchData, setBranchData] = useState([]);
  const [selectedBranchItem, setSelectedBranchItem] = useState(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // date picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  const onChangeDob = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    setText(fDate);
  };

  const handleBirthDateChange = (value) => {
    alert(value);
    setFormData({
      ...formData,
      visited_date: date,
    });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  useEffect(() => {
    if (isFocused) {
      getPetDetailsById();
      getVisitPurposeData();
      getDiseaseData();
      getPrescriptionData();
      getVisitTypeData();
      getBranchData();
      getVaccineData();
      getSymptomsData();
      getMedicineData();
    }
  }, [isFocused]);

  useEffect(() => {
    let date = new Date();
    let newDate = date.toISOString().split('T')[0];
    if (route.params.petData) {
      setFormData({
        ...formData,
        pet_id: route.params.navOptionsFromAddPet.id,
        owner_name_id: route.params.navOptionsFromAddPet.pet_owner_id.id,
        visited_clinic_id: route.params.navOptionsFromAddPet.clinic,
        visited_date: newDate,
      });
      // setAnimalType(route.params.navOptionsFromAddPet.pet_type_id.animal_type);
      // setBreed(route.params.navOptionsFromAddPet.breed_id.breed);
    }
  }, [route.params.petData]);

  useEffect(() => {
    let date = new Date();
    let newDate = date.toISOString().split('T')[0];
    if (route.params.petNotification) {
      setFormData({
        ...formData,
        pet_id: route.params.navOptionsFromPets.id,
        owner_name_id: route.params.navOptionsFromPets.pet_owner_id.id,
        visited_clinic_id: route.params.navOptionsFromPets.clinic,
        visited_date: newDate,
      });
      // setAnimalType(individualPetData && individualPetData.actual_animal_type);
      // setBreed(individualPetData && individualPetData.actual_breed);
    }
  }, [route.params.petNotification]);

  useEffect(() => {
    let date = new Date();
    let newDate = date.toISOString().split('T')[0];
    if (route.params.navOptionsFromAddVisit) {
      setFormData({
        ...formData,
        pet_id: route.params.navOptionsFromAddVisit.id,
        owner_name_id: route.params.navOptionsFromAddVisit.pet_owner_id.id,
        visited_clinic_id: route.params.navOptionsFromAddVisit.clinic,
        visited_date: newDate,
      });
      // setAnimalType(individualPetData && individualPetData.actual_animal_type);
      // setBreed(individualPetData && individualPetData.actual_breed);
    }
  }, [route.params.navOptionsFromAddVisit]);

  useEffect(() => {
    if (route.params.navOptionsFromPets) {
      let splitText2 = route.params.navOptionsFromPets.pet_name;
      splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

      let splitText1 = route.params.navOptionsFromPets.pet_owner_id.pet_owner_name;
      splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

      navigation.setOptions({ title: `${splitText1} / ${splitText2}` });
    }
  }, [route.params.navOptionsFromPets]);

  useEffect(() => {
    if (route.params.navOptionsFromAddPet) {
      let splitText2 = route.params.navOptionsFromAddPet.pet_name;
      splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

      let splitText1 = route.params.navOptionsFromAddPet.pet_owner_id.pet_owner_name;
      splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

      navigation.setOptions({ title: `${splitText1} / ${splitText2}` });
    }
  }, [route.params.navOptionsFromAddPet]);

  useEffect(() => {
    if (route.params.navOptionsFromAddVisit) {
      let splitText2 = route.params.navOptionsFromAddVisit.pet_name;
      splitText2 = splitText2.charAt(0).toUpperCase() + splitText2.slice(1);

      let splitText1 = route.params.navOptionsFromAddVisit.pet_owner_id.pet_owner_name;
      splitText1 = splitText1.charAt(0).toUpperCase() + splitText1.slice(1);

      navigation.setOptions({ title: `${splitText1} / ${splitText2}` });
    }
  }, [route.params.navOptionsFromAddVisit]);

  // console.log("formData", formData);

  const getPetDetailsById = () => {
    if (route.params.petNotification) {
      axios
        .get(`pet/${route.params.petNotification}`)
        .then((res) => {
          // console.log("vaccinedata",res.data);
          if (res.status === 200) {
            // console.log(res.data);
            setIndividualPetData(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (route.params.petData) {
      axios
        .get(`pet/${route.params.petData}`)
        .then((res) => {
          // console.log("vaccinedata",res.data);
          if (res.status === 200) {
            // console.log(res.data);
            setIndividualPetData(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (route.params.petId) {
      axios
        .get(`pet/${route.params.petId}`)
        .then((res) => {
          // console.log("vaccinedata",res.data);
          if (res.status === 200) {
            // console.log(res.data);
            setIndividualPetData(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getVaccineData = () => {
    let vaccineData = vaccineData;
    vaccineData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    axios
      .get(`/injection/clinic/${userClinicId}`)
      .then((res) => {
        // console.log("vaccinedata",res.data);
        res.data.map((element, index) => {
          vaccineData.push({
            id: element.id,
            medicine_name: element.medicine_name,
            label: element.medicine_name,
            title: `${element.vaccine_name}`,
          });
        });
        setVaccineData(vaccineData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getVisitPurposeData = () => {
    let visitPurposeData = visitPurposeData;
    visitPurposeData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    axios
      .get(`/visitPurpose/clinic/${userClinicId}`)
      .then((res) => {
        // console.log(res.data);
        res.data.map((element, index) => {
          visitPurposeData.push({
            id: element.id,
            visit_purpose: element.edited_name ? element.edited_name : element.actual_name,
            label: element.edited_name ? element.edited_name : element.actual_name,
            title: `${element.visit_purpose}`,
          });
        });
        setVisitPurposeData(visitPurposeData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDiseaseData = () => {
    let diseaseData = diseaseData;
    diseaseData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    axios
      .get(`/disease/clinic/${userClinicId}`)
      .then((res) => {
        // console.log("Disease", res.data);
        res.data.map((element, index) => {
          diseaseData.push({
            id: element.id,
            // disease: element.edited_name ? element.edited_name : element.actual_name,
            label: element.edited_name ? element.edited_name : element.actual_name,
            title: `${element.disease}`,
          });
        });
        setDiseaseData(diseaseData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMedicineData = () => {
    let medicineData = medicineData;
    medicineData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    axios
      .get(`/medicine/clinic/${userClinicId}`)
      .then((res) => {
        // console.log("Medicine Data", res.data);
        res.data.map((element, index) => {
          medicineData.push({
            id: element.id,
            // template_name: element.template_name,
            label: element.medicine_name,
            title: `${element.medicine_name}`,
          });
        });
        setMedicineData(medicineData);
        // console.log("test", prescriptionData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPrescriptionData = () => {
    let prescriptionData = prescriptionData;
    prescriptionData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    axios
      .get(`/prescription-template/clinic/${userClinicId}`)
      .then((res) => {
        // console.log("prescriptionData", res.data);
        res.data.map((element, index) => {
          prescriptionData.push({
            id: element.id,
            label: element.template_name,
            title: `${element.template_name}`,
          });
        });
        setPrescriptionData(prescriptionData);
        // console.log("test", prescriptionData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getVisitTypeData = () => {
    let visitTypeData = visitTypeData;
    visitTypeData = [];
    let userClinicId = route.params.userDetails.clinic.id;
    axios
      .get(`/visitType/clinic/${userClinicId}`)
      .then((res) => {
        // console.log("visitssssssssss", res.data);
        res.data.map((element, index) => {
          visitTypeData.push({
            id: element.id,
            label: element.edited_name ? element.edited_name : element.actual_name,
            title: `${element.visit_type}`,
          });
          // console.log("teteteteteteetetete", res.data);
        });
        setVisitTypeData(visitTypeData);
        // console.log("test", visitTypeData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBranchData = () => {
    let branchData = branchData;
    branchData = [];
    axios
      .get(`/clinic/branch/${route.params.userDetails.clinic.id}`)
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

  const getSymptomsData = () => {
    let symptomsData = symptomsData;
    symptomsData = [];
    axios
      .get(`/symptom`)
      .then((res) => {
        // console.log("symptom", res.data);
        res.data.map((element, index) => {
          symptomsData.push({
            id: element.id,
            // symptom_name: element.symptom_name,
            label: element.symptom_name,
            title: `${element.symptom_name}`,
          });
        });
        setSymptomsData(symptomsData);
        // console.log(petOwnersData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleVisitPurposeChange = (value) => {
    if (value.visit_purpose == 'Vaccination') {
      setVaccinationData(true);
    } else {
      setVaccinationData(false);
    }
    setFormData({
      ...formData,
      visit_purpose: value.id,
    });
  };

  const handleDiseaseChange = (value) => {
    setFormData({
      ...formData,
      disease: value.id,
    });
  };

  const handleMedicineChange = (value) => {
    setFormData({
      ...formData,
      prescription_id: value.id,
    });
  };

  const handlePrescriptionChange = (value) => {
    getPrescriptionData();
    setFormData({
      ...formData,
      prescription_id: value.id,
    });
  };

  const handleVisitTypeChange = (value) => {
    console.log(value);
    setFormData({
      ...formData,
      visit_type: value.id,
    });
  };

  // const handleBranchChange = (value) => {
  //   setFormData({
  //     ...formData,
  //     branch_id: value.id,
  //   });
  // };

  const handleRegisteringBranchChange = (value) => {
    setFormData({
      ...formData,
      branch_id: value.id,
    });
  };

  const handleDiagnosisNoteChange = (value) => {
    setFormData({
      ...formData,
      diagnosis_note: value,
    });
  };

  const handleDoctorsNoteChange = (value) => {
    setFormData({
      ...formData,
      doctor_note: value,
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
    console.log(formData.weight, 'weii');
    setFormData({
      ...formData,
      weight: value,
    });
  };

  const handleVaccineChange = (value) => {
    setFormData({
      ...formData,
      vaccine: value.vaccine_name,
    });
  };

  const handleSymptomsChange = (item) => {
    setFormData({
      ...formData,
      symptoms_data: item,
    });
  };

  const getPrescriptionTemplateData = (data, index) => {
    // console.log("getPrescriptionTemplateData", data);
    setNewPrescData(data);
    let addPrescData = JSON.parse(data.prescriptionTemplate.medicine);
    // console.log("getPrescriptionTemplateData", addPrescData);
    setNewPrescMedicineData(addPrescData);
  };

  // console.log(formData);
  const handleAddNewVisitPurpose = () => {
    navigation.navigate('AddVisitPurpose');
  };

  const handleAddNewVaccineChange = () => {
    navigation.navigate('AddVaccine');
  };

  const handleAddNewDisease = () => {
    navigation.navigate('AddDisease');
  };

  const handleAddNewMedicine = () => {
    navigation.navigate('AddMedicine');
  };

  const handleAddNewPrescription = () => {
    navigation.navigate('AddPrescriptionTemplate', { getPrescriptionTemplateData: getPrescriptionTemplateData });
  };

  const handleAddNewVisitType = () => {
    navigation.navigate('AddVisitType');
  };

  const onToggleSwitch1 = (value) => {
    setClientAccess(value);
    setIsSwitchOnSymptoms(value);
    setFormData({
      ...formData,
      client_access_symptom: value,
    });
  };

  const onToggleSwitchDisease = (value) => {
    // console.log(!isSwitchOnDisease);
    setClientAccessDisease(value);
    setIsSwitchOnDisease(value);
    setFormData({
      ...formData,
      client_access_disease: value,
    });
  };

  const onToggleSwitchInjectionData = (value) => {
    // console.log(!isSwitchOnInjection);
    setClientAccessInjection(value);
    setIsSwitchOnInjection(value);
    setFormData({
      ...formData,
      client_access_injection_data: value,
    });
  };

  // const onHandleSubmit = () => {
  //   let data = formData;
  //   data.is_submited = true;
  //   data.weight = formData.weight + ' ' + weightUnit;
  //   data.symptoms_data = formData.symptoms_data && formData.symptoms_data.toString();
  //   data.injections_data = formData.injections_data && formData.injections_data.toString();
  //   axios
  //     .post(`/visitDetail`, data)
  //     .then((res) => {
  //       // console.log(res.data);
  //       if (res.status == '200') {
  //         console.log('Successfully added new visit');
  //         // navigation.navigate('SubmitNewVisitForm', {visitId: res.data.visit_id});
  //         submitRoute(res.data.visit_id);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       // setErrorMsg(true);
  //     });
  // };

  const onSave = () => {
    let data = formData;
    data.is_submited = false;
    data.weight = formData.weight + ' ' + weightUnit;
    data.symptoms_data = formData.symptoms_data && formData.symptoms_data.toString();
    data.injections_data = formData.injections_data && formData.injections_data.toString();
    axios
      .post(`/visitDetail`, data)
      .then((res) => {
        console.log(res.data);
        if (res.status == '200') {
          submitMethod(res.data.visit_id);
          // setSuccessMsg(true);
          console.log('Successfully saved');
          navigation.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg(true);
      });
  };

  const submitRoute = (value) => {
    if (route.params.petData) {
      submitMethod(value);
      navigation.navigate('SubmitNewVisitForm', { visitId: value });
    } else if (route.params.petNotification) {
      submitMethod(value);
      navigation.navigate('SubmitNewVisitForm', { visitIdFromPet: value });
    } else if (route.params.petId) {
      submitMethod(value);
      navigation.navigate('SubmitNewVisitForm', { visitIdFromVisits: value });
    }
  };

  const submitMethod = async (value) => {
    // console.log('value', value);
    let fileData = new FormData();
    fileData.append('visit_id', value);
    fileData.append('clinic_id', formData.visited_clinic_id);
    for (var i = 0; i < files.length; i++) {
      fileData.append('files[]', files[i]);
    }
    console.log('fileData', fileData);
    await axios
      .post(`/visitDetail/uploadFilesMobile`, fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log('error', res);
      });
    // navigation.goBack();
  };

  const handlegoback = () => {
    setSavedSuccessMsg(false);
    navigation.navigate('Visits');
  };

  const updateFileQueue = (value) => {
    console.log('In Visit Screen', value);
    setFiles(value);
  };

  // console.log(individualPetData);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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

      <View style={{ backgroundColor: '#f2f4fc' }}>
        <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name='arrow-back-ios' color={'#000'} size={20} />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Start Consultation</Text>
          </View>

          <View style={{ width: '40%' }}>
            <TouchableOpacity
              onPress={() => showMode('date')}
              style={{
                flexDirection: 'row',
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#d4d2d2',
                height: 40,
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}
            >
              <View>
                {text ? (
                  <Text style={{ color: '#000' }}>{text}</Text>
                ) : (
                  <Text style={{ color: '#d4d2d2' }}>Select date</Text>
                )}
              </View>
              <View>
                <MaterialIcons name='calendar-today' color={'#d4d2d2'} size={20} />
              </View>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID='dateTimePicker'
                value={date}
                mode={mode}
                display='default'
                onChange={onChangeDob}
                onChangeText={(value) => {
                  value && handleBirthDateChange(value);
                }}
              />
            )}
          </View>
        </View>
        <View
          style={{
            width: '50%',
            marginHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{individualPetData.pet_age}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 12 }}>Last visit: </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{formData.visited_date}</Text>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: '#f2f4fc' }}>
        <View style={styles.container}>
          {/* <View style={styles.topVisitDetail}>
            <View style={styles.topLeft}>
              <Text style={{ color: '#000', fontWeight: 'bold', textTransform: 'capitalize' }}>
                {individualPetData.actual_animal_type} / {individualPetData.actual_breed}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Visited Date:</Text>
                {route.params.navOptionsFromPets ? (
                  <Text style={{ color: '#000', marginLeft: 5 }}>{route.params.navOptionsFromPets.last_visit}</Text>
                ) : (
                  <></>
                )}
                {route.params.navOptionsFromAddPet ? (
                  <Text style={{ color: '#000', marginLeft: 5 }}>{route.params.navOptionsFromAddPet.last_visit}</Text>
                ) : (
                  <></>
                )}
                {route.params.navOptionsFromAddVisit ? (
                  <Text style={{ color: '#000', marginLeft: 5 }}>{route.params.navOptionsFromAddVisit.last_visit}</Text>
                ) : (
                  <></>
                )}
              </View>
            </View> */}

          {/* <View style={styles.datePicker}>
            <MaterialCommunityIcons name='calendar-edit' color={'#006766'} size={35} />
            <DatePicker
              style={styles.datePickerStyle}
              date={new Date()} // Initial date from state
              mode='date' // The enum of date, datetime and time
              placeholder='select date'
              minDate={new Date()}
              placeholderStyle={{ color: '#000' }}
              format='YYYY-MM-DD'
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              customStyles={{
                dateIcon: {
                  display: 'none',
                },
              }}
              onDateChange={(date) => {
                // console.log("value", value);
                setFormData({
                  ...formData,
                  visited_date: date,
                });
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                borderColor: '#eeee',
              }}
              searchContainerStyle={{
                borderBottomColor: '#eeee',
              }}
            />
          </View> */}
          {/* </View> */}
          {/*
          <Divider /> */}

          <View style={styles.form}>
            <View>
              {/* Visit Purpose */}
              <View style={styles.formItem} key={'edit_v_2'}>
                <Text style={styles.formLabel}>Visit Purpose</Text>

                {/* Custom Dropdown */}
                <CustomDropdown
                  handleAddEvent={handleAddNewVisitPurpose}
                  onChange={handleVisitPurposeChange}
                  buttonLabel={'Add new visit purpose'}
                  isButton={true}
                  dropdownType={'single'}
                  autoFocusSearch={false}
                  enableSearch={false}
                  defaultValue={formData && formData.visit_purpose}
                  data={visitPurposeData}
                  dropdownLabel={'General Checkup'}
                />
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

              {/* <Text style={styles.formLabel}>Weight:</Text>
                <View style={styles.weightComp}>
                  <TextInput
                    placeholder='weight'
                    style={styles.formTextInput}
                    keyboardType='number-pad'
                    onChangeText={(value) => handlePetWeightChange(value)}
                  ></TextInput>
                  <Dropdown
                    style={styles.dropdownWeight}
                    // placeholder='Select...'
                    maxHeight={120}
                    data={units}
                    labelField='label'
                    valueField='value'
                    value={'kg'}
                    // item={weightUnit}
                    searchPlaceholder='search...'
                    selectedTextStyle={{
                      color: '#00000080',
                    }}
                    placeholderStyle={{
                      color: '#bebebe',
                      fontSize: 16,
                    }}
                    onChange={(value) => {
                      value && handleWeightChange(value);
                    }}
                  />
                </View> */}

              {vaccinationData ? (
                <View style={styles.formItemVaccine}>
                  <Text style={styles.formLabel}>Medications:</Text>

                  <CustomDropdown
                    handleAddEvent={handleAddNewVaccineChange}
                    onChange={(value) => handleVaccineChange(value)}
                    buttonLabel={'Add new vaccine'}
                    data={vaccineData}
                  />
                </View>
              ) : (
                <></>
              )}

              {/* Diagnosis Note */}
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Diagnosis Note</Text>
                <TextInput
                  style={styles.textArea}
                  // placeholder='Diagnosis Notes here ...'
                  placeholderTextColor='grey'
                  numberOfLines={10}
                  multiline={true}
                  onChangeText={(value) => handleDiagnosisNoteChange(value)}
                />
              </View>

              {/* Doctor's Note */}
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Doctor's Note</Text>
                <TextInput
                  style={styles.textArea}
                  // placeholder="Doctor's Notes here ..."
                  placeholderTextColor='grey'
                  numberOfLines={10}
                  multiline={true}
                  onChangeText={(value) => handleDoctorsNoteChange(value)}
                />
              </View>

              {/* Symptoms */}
              <View style={styles.formItem}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Symptoms</Text>

                  {clientAccess ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        backgroundColor: 'green',
                        width: 180,
                        alignItems: 'center',
                        borderRadius: 30,
                        height: 30,
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        Client Access ON
                        {/* <Text style={{ color: '#fff', fontWeight: 'bold' }}>ON</Text> */}
                      </Text>
                      <Switch
                        value={isSwitchOnSymptoms}
                        onValueChange={(value) => onToggleSwitch1(value)}
                        trackColor={'#d4d2d2 '}
                        thumbColor={'#fff'}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        backgroundColor: 'red',
                        width: 180,
                        alignItems: 'center',
                        borderRadius: 30,
                        height: 30,
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        Client Access OFF
                        {/* <Text style={{ color: '#fff', fontWeight: 'bold' }}>OFF</Text> */}
                      </Text>
                      <Switch
                        value={isSwitchOnSymptoms}
                        onValueChange={(value) => onToggleSwitch1(value)}
                        trackColor={'#d4d2d2 '}
                        thumbColor={'#fff'}
                      />
                    </View>
                  )}

                  {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      backgroundColor: 'red',
                      width: 180,
                      alignItems: 'center',
                      borderRadius: 30,
                      height: 30,
                      paddingHorizontal: 4,
                    }}
                  >
                    {clientAccess ? (
                      <>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                          Client Access ON

                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                          Client Access OFF

                        </Text>
                      </>
                    )}
                    <Switch
                      value={isSwitchOnSymptoms}
                      onValueChange={(value) => onToggleSwitch1(value)}
                       trackColor={'#d4d2d2 '}
                      thumbColor={'#fff'}
                    />
                  </View> */}
                </View>

                <CustomDropdown
                  // handleAddEvent={handleSymptomsChange}
                  onChange={handleSymptomsChange}
                  buttonLabel={'Add new symptoms'}
                  defaultValue={formData.symptoms_data}
                  enableSearch={false}
                  dropdownType={'multiple'}
                  dropdownLabel={'Select Symptoms'}
                  data={symptomsData}
                  labelField='label'
                  valueField='id'
                />
              </View>

              {/* Disease */}
              <View style={styles.formItem}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Confirmatory Diagnosis</Text>

                  {clientAccessDisease ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        backgroundColor: 'green',
                        width: 180,
                        alignItems: 'center',
                        borderRadius: 30,
                        height: 30,
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        Client Access ON
                        {/* <Text style={{ color: '#fff', fontWeight: 'bold' }}>ON</Text> */}
                      </Text>
                      <Switch
                        value={isSwitchOnDisease}
                        onValueChange={(value) => onToggleSwitchDisease(value)}
                        trackColor={'#d4d2d2 '}
                        thumbColor={'#fff'}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        backgroundColor: 'red',
                        width: 180,
                        alignItems: 'center',
                        borderRadius: 30,
                        height: 30,
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        Client Access OFF
                        {/* <Text style={{ color: '#fff', fontWeight: 'bold' }}>OFF</Text> */}
                      </Text>
                      <Switch
                        value={isSwitchOnDisease}
                        onValueChange={(value) => onToggleSwitchDisease(value)}
                        trackColor={'#d4d2d2 '}
                        thumbColor={'#fff'}
                      />
                    </View>
                  )}
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      backgroundColor: '#BFD9D970',
                      width: 180,
                      alignItems: 'center',
                      borderRadius: 30,
                      height: 30,
                      paddingHorizontal: 4,
                    }}
                  >
                    {clientAccessDisease ? (
                      <>
                        <Text style={{ color: '#006766', fontWeight: 'bold' }}>
                          Client Access <Text style={{ color: '#006766', fontWeight: 'bold' }}>ON</Text>
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ color: '#00000080', fontWeight: 'bold' }}>
                          Client Access <Text style={{ color: '#000', fontWeight: 'bold' }}>OFF</Text>
                        </Text>
                      </>
                    )}
                    <Switch
                      value={isSwitchOnDisease}
                      onValueChange={(value) => onToggleSwitchDisease(value)}
                      // style={{marginTop:-12}}
                      trackColor={{ false: '#00000080', true: '#0E9C9B70' }}
                      thumbColor={'#0E9C9B'}
                    />
                  </View> */}
                </View>

                {/* Custom Dropdown */}
                <CustomDropdown
                  handleAddEvent={handleAddNewDisease}
                  onChange={handleDiseaseChange}
                  buttonLabel={'Add new disease'}
                  dropdownLabel={'Select Diagnosis'}
                  // defaultValue={5}
                  data={diseaseData}
                />
              </View>

              <View style={styles.formItem}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Medications</Text>
                  {clientAccessInjection ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        backgroundColor: 'green',
                        width: 180,
                        alignItems: 'center',
                        borderRadius: 30,
                        height: 30,
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        Client Access ON
                        {/* <Text style={{ color: '#fff', fontWeight: 'bold' }}>ON</Text> */}
                      </Text>
                      <Switch
                        value={isSwitchOnInjection}
                        onValueChange={(value) => onToggleSwitchInjectionData(value)}
                        trackColor={'#d4d2d2 '}
                        thumbColor={'#fff'}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        backgroundColor: 'red',
                        width: 180,
                        alignItems: 'center',
                        borderRadius: 30,
                        height: 30,
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        Client Access OFF
                        {/* <Text style={{ color: '#fff', fontWeight: 'bold' }}>OFF</Text> */}
                      </Text>
                      <Switch
                        value={isSwitchOnInjection}
                        onValueChange={(value) => onToggleSwitchInjectionData(value)}
                        trackColor={'#d4d2d2 '}
                        thumbColor={'#fff'}
                      />
                    </View>
                  )}
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      backgroundColor: '#BFD9D970',
                      width: 180,
                      alignItems: 'center',
                      borderRadius: 30,
                      height: 30,
                      paddingHorizontal: 4,
                    }}
                  >
                    {clientAccessInjection ? (
                      <>
                        <Text style={{ color: '#006766', fontWeight: 'bold' }}>
                          Client Access <Text style={{ color: '#006766', fontWeight: 'bold' }}>ON</Text>
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ color: '#00000080', fontWeight: 'bold' }}>
                          Client Access <Text style={{ color: '#000', fontWeight: 'bold' }}>OFF</Text>
                        </Text>
                      </>
                    )}
                    <Switch
                      value={isSwitchOnInjection}
                      onValueChange={(value) => onToggleSwitchInjectionData(value)}
                      // style={{marginTop:-12}}
                      trackColor={{ false: '#00000080', true: '#0E9C9B70' }}
                      thumbColor={'#0E9C9B'}
                    />
                  </View> */}
                </View>
                <CustomDropdown
                  // handleAddEvent={handleAddNewVaccine}
                  onChange={handleVaccineChange}
                  buttonLabel={'Add new vaccine'}
                  defaultValue={formData && formData.injections_data}
                  enableSearch={false}
                  dropdownType={'multiple'}
                  dropdownLabel={'Select Medications'}
                  data={vaccineData}
                  labelField='label'
                  valueField='id'
                />
              </View>

              {/* Documents */}
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Documents</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: '#d4d2d2',
                      padding: 10,
                      width: '80%',
                      // textAlign: 'center',
                      color: '#d4d2d2',
                    }}
                  >
                    click to Upload icon to add
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: '#d4d2d2',
                      backgroundColor: '#0e4377',
                      width: '15%',
                      padding: 2,
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      navigation.navigate('DocumentUpload', { updateFileQueue: updateFileQueue, files: files })
                    }
                  >
                    <MaterialCommunityIcons name='upload' color={'#fff'} size={35} />
                    {/* <Text
                      style={{
                        textAlign: 'center',
                        padding: 14,
                        backgroundColor: '#006766',
                        color: '#fff',
                        borderRadius: 12,
                      }}
                    >
                      Upload a file/image
                    </Text> */}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Prescription */}
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Prescription</Text>
                <CustomDropdown
                  handleAddEvent={handleAddNewPrescription}
                  onChange={handlePrescriptionChange}
                  buttonLabel={'Add new prescription'}
                  dropdownLabel={'Select prescription'}
                  // defaultValue={5}
                  data={prescriptionData}
                />
                {/* {newPrescData.map((ele, index) => { */}
                {newPrescData && newPrescData.prescriptionTemplate ? (
                  <>
                    <TouchableOpacity
                      style={styles.editPrescOnVisits}
                      onPress={() =>
                        navigation.navigate('EditPrescriptionTemplate', {
                          dataTemp: newPrescData.prescriptionTemplate,
                          updateMedicineToVisits: updateMedicineToVisits,
                        })
                      }
                    >
                      <Text style={{ color: '#000', textAlign: 'center', fontWeight: 'bold' }}>
                        {newPrescData.prescriptionTemplate && newPrescData.prescriptionTemplate.template_name}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <></>
                )}

                {/* })} */}
              </View>

              {/* Visit Type */}
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Visit Type</Text>
                {/* Custom Dropdown */}
                <CustomDropdown
                  handleAddEvent={handleAddNewVisitType}
                  onChange={handleVisitTypeChange}
                  buttonLabel={'Add new visittype'}
                  dropdownLabel={'Select Visit Type'}
                  // defaultValue={5}
                  data={visitTypeData}
                />
              </View>

              {/* Branch */}
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Branch</Text>
                <CustomDropdown
                  onChange={(value) => {
                    setSelectedBranchItem && handleRegisteringBranchChange(value);
                  }}
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
                {/* <Dropdown
                  style={{
                    width: '100%',
                    padding: 5,
                    borderRadius: 5,
                    // backgroundColor: '#0E9C9B20',
                    // elevation: 2,
                  }}
                  placeholder='Select or add a Branch'
                  maxHeight={170}
                  data={branchData}
                  labelField='branch'
                  valueField='id'
                  value={branchData}
                  onChange={(value) => {
                    value && handleBranchChange(value);
                  }}
                  search={true}
                  searchPlaceholder='search...'
                  selectedTextStyle={{
                    color: '#00000080',
                  }}
                  placeholderStyle={{
                    color: '#00000080',
                    fontSize: 16,
                  }}
                /> */}
              </View>
            </View>
            {/* {afterSubmit?<SubmitNewVisitForm/>:<></>} */}
          </View>
          <View style={styles.formButtons}>
            {/* <TouchableOpacity onPress={onHandleSubmit} style={{ width: '50%' }}>
              <Text
                style={{
                  backgroundColor: '#006766',
                  alignItems: 'center',
                  color: '#fff',
                  textAlign: 'center',
                  paddingVertical: 20,
                  fontWeight: 'bold',
                }}
              >
                Submit
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={onSave}>
              <Text style={styles.submit}>Save</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{ width: '25%', borderLeftWidth: 1, borderColor: '#fff' }}>
              <Text style={styles.submit}>History</Text>
            </TouchableOpacity> */}
          </View>
          {savedSuccessMsg ? (
            <Portal>
              <Dialog visible={savedSuccessMsg} onDismiss={handlegoback}>
                <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>visit details submitted successfully</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={handlegoback} title='Done' />
                </Dialog.Actions>
              </Dialog>
            </Portal>
          ) : (
            <></>
          )}
          {/* {savedErrorMsg ?
                <Portal>
                <Dialog visible={savedErrorMsg} onDismiss={handleCancel}>
                <Dialog.Title style={{ color: '#66ee' }}>Oops!</Dialog.Title>
                <Dialog.Content>
                <Paragraph>visit details updates saved as `Drafts`</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                <Button onPress={handleCancel} title="Done"/>
                </Dialog.Actions>
                </Dialog>
                </Portal>
                : <></>
              } */}
        </View>
      </View>
    </ScrollView>
  );
};

export default AddNewVisitDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '5%',
    padding: '5%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  topVisitDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0E9C9B20',
    padding: 10,
    height: 120,
  },
  topLeft: {
    flexDirection: 'column',
    height: 95,
    justifyContent: 'space-between',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerStyle: {
    width: 120,
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
  },
  form: {
    // margin: 12,
  },
  formItem: {
    marginBottom: 15,
  },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d4d2d2',
    borderRadius: 10,
    height: 100,
    padding: 15,
    backgroundColor: '#fff',
  },
  formButtons: {
    // flexDirection: 'row',
    width: '100%',
    // alignItems: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownWeight: {
    width: '65%',
    padding: 5,
    backgroundColor: '#0E9C9B20',
    borderRadius: 5,
  },
  weightComp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formTextInput: {
    width: '30%',
    backgroundColor: '#fff',
    elevation: 2,
    textAlign: 'center',
    borderRadius: 10,
  },

  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#006766',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
    color: '#fff',
  },
  editPrescOnVisits: {
    backgroundColor: '#F2AA4CFF',
    width: 120,
    overflow: 'hidden',
    elevation: 2,
    paddingVertical: 10,
    marginTop: 10,
  },
});
