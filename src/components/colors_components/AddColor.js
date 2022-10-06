import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import axios from 'react-native-axios';
import PageHeader from '../../Header_Component/PageHeader';

const AddColor = ({ navigation }) => {
  const [formData, setFormData] = useState({
    color: '',
  });

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [warningMsg, setWarningMsg] = useState(false);
  // const isFocused = useIsFocused();

  const handleColourNameChange = (value) => {
    setFormData({
      ...formData,
      color: value,
    });
  };

  const handleSubmit = async () => {
    await axios
      .post(`/color`, formData)
      .then((res) => {
        console.log('gfty', res.data);
        if (res.status == '200') {
          // navigation.navigate('petSubmitPage')
          console.log('Color Registered Successfully');
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

  const handlegoback = () => {
    setSuccessMsg(false);
    navigation.goBack();
  };

  const handleCancel = () => {
    setErrorMsg(false);
  };

  const handleWarning = () => {
    setWarningMsg(false);
  };
  return (
    <>
      <PageHeader header={'Create a New Color'} />
      <View style={{ backgroundColor: '#f2f4fc', flex: 1 }}>
        <View style={styles.container}>
          {/* <View
        style={{
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      > */}
          <View>
            {/* <View style={styles.formItem}> */}
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.heading}>Color Name</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              // placeholder='Red-Brown and White'
              style={styles.formTextInput}
              onChangeText={(value) => {
                value && handleColourNameChange(value);
              }}
            ></TextInput>
            {/* </View> */}

            <View>
              <>
                {successMsg ? (
                  <Portal>
                    <Dialog visible={successMsg} onDismiss={handlegoback}>
                      <Dialog.Title style={{ color: '#00A300' }}>Success</Dialog.Title>
                      <Dialog.Content>
                        <Paragraph>New Color has been Succesfully added</Paragraph>
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
                        <Paragraph>Error while adding a new color</Paragraph>
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
          </View>

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
                  marginTop: 10,
                  fontWeight: 'bold',
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default AddColor;

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  container: { margin: '5%', padding: '5%', backgroundColor: '#fff', borderRadius: 15, elevation: 5 },
  heading: {
    fontWeight: 'bold',
  },
  required: {
    color: 'red',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  // formItem: {
  //   marginVertical: 14,
  //   marginHorizontal: 10,
  // },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
    marginHorizontal: 10,
    marginVertical: 10,
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
});
