import React, { Component, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Switch } from 'react-native-paper';
import PageHeader from '../../Header_Component/PageHeader';

const petSubmitPage = ({ navigation, route }) => {
  const [isSwitchOn1, setIsSwitchOn1] = React.useState(true);
  const onToggleSwitch1 = () => setIsSwitchOn1(!isSwitchOn1);

  const [isSwitchOn2, setIsSwitchOn2] = React.useState(true);
  const onToggleSwitch2 = () => setIsSwitchOn2(!isSwitchOn2);

  const [isSwitchOn3, setIsSwitchOn3] = React.useState(true);
  const onToggleSwitch3 = () => setIsSwitchOn3(!isSwitchOn3);

  // console.log(route.params.formData);

  const onNavigateConsult = () => {
    navigation.navigate('AddNewVisitDetails', {
      petData: route.params.registeredPetData.id,
      navOptionsFromAddPet: route.params.registeredPetData,
    });
  };

  const onNavigatePet = () => {
    navigation.navigate('Pets');
  };

  return (
    <>
      <PageHeader header={'Registration Completed'} />
      <View style={{ flex: 1, backgroundColor: '#f2f4fc', padding: 20 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#f2f4fc',
            borderRadius: 10,
            backgroundColor: '#fff',
            paddingVertical: 20,
            elevation: 10,
          }}
        >
          <View
            style={{
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: '#28AE7B', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
              The new Pet {route.params.registeredPetData.pet_name} has been registered successfully!
            </Text>
            {/* <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginVertical: 30 }}>
            The New Pet <Text style={{ color: '#66ee' }}>{route.params.registeredPetData.pet_name}</Text> Has Been
            Registered Successfully!!
          </Text> */}
            <View style={{ width: '100%', marginVertical: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Send Welcome Message?</Text>
                <Switch
                  value={isSwitchOn1}
                  onValueChange={onToggleSwitch1}
                  trackColor={{ false: '#bebebe', true: '#28AE7B70' }}
                  thumbColor={'#28AE7B'}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Whatsapp</Text>
                <Switch
                  value={isSwitchOn2}
                  onValueChange={onToggleSwitch2}
                  trackColor={{ false: '#bebebe', true: '#28AE7B70' }}
                  thumbColor={'#28AE7B'}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Email</Text>
                </View>
                <Switch
                  value={isSwitchOn3}
                  onValueChange={onToggleSwitch3}
                  trackColor={{ false: '#bebebe', true: '#28AE7B70' }}
                  thumbColor={'#28AE7B'}
                />
              </View>
              <Text style={{ width: '80%' }}>
                App messages are sent by default if send welcome message is toggled on.
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 10, width: '100%', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>What would you like to do Next?</Text>

            <View style={{ width: '100%' }}>
              <TouchableOpacity onPress={onNavigateConsult} style={styles.submit}>
                <Text style={styles.subText}>Start Consultation</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: '100%' }}>
              <TouchableOpacity onPress={onNavigatePet} style={styles.submit}>
                <Text style={styles.subText}>Not Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default petSubmitPage;

const styles = StyleSheet.create({
  submit: {
    padding: 10,
  },
  subText: {
    backgroundColor: '#0e4377',
    alignItems: 'center',
    width: '100%',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
