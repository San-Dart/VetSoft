import React, { useState, useEffect } from 'react';
import {
  Pressable,
  FlatList,
  TextInput,
  Button,
  Image,
  View,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { IconButton, Divider, Switch } from 'react-native-paper';
import { Camera } from 'expo-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Gallery from 'react-native-image-gallery';
import axios from 'react-native-axios';
import { CheckBox, Header } from 'react-native-elements';

const CameraModule = (props) => {
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={true}
      onRequestClose={() => {
        props.setModalVisible();
      }}
    >
      <Camera
        style={{ flex: 1 }}
        ratio='16:9'
        flashMode={Camera.Constants.FlashMode.off}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'flex-end',
          }}
        >
          <View style={styles.camDef}>
            <Button
              icon='close'
              style={{ marginLeft: 12 }}
              mode='outlined'
              color='black'
              onPress={() => {
                props.setModalVisible();
              }}
              title='close'
            ></Button>
            <TouchableOpacity
              onPress={async () => {
                if (cameraRef) {
                  let photo = await cameraRef.takePictureAsync();
                  props.setImage(photo);
                  props.setModalVisible();
                }
              }}
            >
              <View style={styles.camMod}>
                <View style={styles.camMod_mod}></View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </Modal>
  );
};

const DocumentUpload = ({ route, navigation }) => {
  // const [init, setInit] = useState(false);
  const [files, setFiles] = useState([]);
  // const [TEST, setTest] = useState([]);

  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [camera, setShowCamera] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const [primaryData, setPrimaryData] = useState([]);

  const [clientAccessDocument, setClientAccessDocument] = useState(false);
  const [clientAccessImage, setClientAccessImage] = useState(false);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (route.params.existingFiles) {
      setPrimaryData(route.params.existingFiles);
    }
    console.log('console', route.params.existingFiles);
  }, [route.params.existingFiles]);

  //

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });
    // console.log(result);
    let fileuri = result.uri;
    let filename = result.uri.split('/').pop();
    const extArr = /\.(\w+)$/.exec(filename);
    const type = getMimeType(extArr[1]);
    // console.log(extArr);
    if (!result.cancelled) {
      setFiles([
        ...files,
        {
          name: filename,
          extArr,
          type,
          uri: fileuri,
        },
      ]);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });
    // console.log(result);
    let fileuri = result.uri;
    let filename = result.uri.split('/').pop();
    const extArr = /\.(\w+)$/.exec(filename);
    const type = getMimeType(extArr[1]);
    // console.log(extArr);
    if (!result.cancelled) {
      setFiles([
        ...files,
        {
          name: filename,
          extArr,
          type,
          uri: fileuri,
        },
      ]);
    }
  };

  // console.log("files", files);

  const getMimeType = (ext) => {
    // mime type mapping for few of the sample file types
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
        return 'image/jpeg';
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
    }
  };

  const onClientAccessChangeDocument = (value) => {
    setClientAccessDocument(value);
  };

  const onClientAccessChangeImage = (value) => {
    setClientAccessImage(!clientAccessImage);
  };

  const uploadImage = () => {
    // console.log(TEST);
    route.params.updateFileQueue(files);
    navigation.goBack({ files: files });
  };

  const handleCamMod = (result) => {
    setImage(result.uri);
    setImageInfo(result.type);
  };

  const handleFileNameOld = (value, id) => {
    console.log('value', value);
    // console.log("id", id);
    if (id) {
      console.log('id', id);
      let fileName = value;
      axios
        .put(`upload-files/rename/${id}`, { fileName: fileName })
        .then((res) => {
          console.log('id', res.data);
          return null;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // const handleFileNameOld = (value, id) => {
  //   // if (file.id) {
  //   //   let fileName = e.target.value;
  //   //   axios.put(`upload-files/rename/${file.id}`, { "fileName": fileName }).then(
  //   //       res => {
  //   //           return null;
  //   //       }
  //   //   ).catch(err => {
  //   //       console.log(err);
  //   //   });
  //   // }
  //   console.log("value", value);
  //   console.log("id", id);
  // }

  // const handleClientAccessOld = (e, file) => {
  //   if (file.id) {
  //       console.log(e.target.checked);
  //       let client_access = e.target.checked;
  //       axios.put(`upload-files/clientAccess/${file.id}`, { "client_access": client_access }).then(
  //           res => {
  //               return null;
  //           }
  //       ).catch(err => {
  //           console.log(err);
  //       });
  //   }
  // }

  const onDelete = (item) => {
    var index = files.indexOf(item);
    if (index > -1) {
      files.splice(index, 1);
    }
    var deletedItems = files;
    setFiles([...deletedItems]);
  };

  return (
    <View style={styles.container}>
      <View style={{ borderRadius: 10, backgroundColor: '#fff', margin: 20, padding: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 0.5,
            borderColor: '#00000099',
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Add Documents</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconButton icon='close' />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 10 }}>
          <IconButton style={styles.icons_s} icon='image' color='#fff' size={40} onPress={pickImage} multiple />

          <IconButton
            style={styles.icons_s}
            icon='camera'
            color='#fff'
            size={40}
            onPress={() => {
              setShowCamera(true);
            }}
          />

          <IconButton style={styles.icons_s} icon='file' color='#fff' size={40} onPress={pickDocument} />
        </View>

        {/* <Divider /> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 5,
            padding: 5,
            alignItems: 'center',
          }}
        >
          <View style={{ width: '15%', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>Type</Text>
          </View>
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>Document Name</Text>
          </View>
          <View style={{ width: '20%', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>client Access</Text>
          </View>
          <View style={{ width: '15%', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>Delete</Text>
          </View>
        </View>

        {/* {document_file} */}

        <ScrollView style={{ height: 200 }}>
          {primaryData &&
            primaryData.map((item, index) => (
              <View key={'file_' + index}>
                {/* Files */}
                <View style={styles.file_content}>
                  {item.type == 'application/pdf' ? (
                    <View style={styles.file_cnt_a}>
                      <View style={styles.file_cnt_a_a}>
                        <View style={styles.file_cnt_b_a}>
                          <MaterialCommunityIcons name='file-pdf-outline' color={'#006766'} size={80} />
                        </View>
                        <View style={styles.rightCont}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.itemName} ellipsizeMode='middle' numberOfLines={1}>
                              {item.name}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <TouchableOpacity onPress={() => console.log('upload')} style={styles.upldBtn}>
                                <MaterialCommunityIcons name='download' color={'#006766'} size={16} />
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => console.log('delete')} style={styles.delBtn}>
                                <MaterialCommunityIcons name='delete' color={'#006766'} size={16} />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <TextInput
                            style={styles.file_name_input}
                            placeholder='Enter Custom Name'
                            placeholderTextColor={'#bebebe'}
                            defaultValue={primaryData && primaryData[index].custom_name}
                            onChangeText={(value) => handleFileNameOld(value, item.id)}
                          />
                          <View style={styles.switch}>
                            {clientAccessDocument ? (
                              <>
                                <Text style={styles.switch_text}>Client Access ON</Text>
                              </>
                            ) : (
                              <>
                                <Text style={styles.switch_text_2}>Client Access OFF</Text>
                              </>
                            )}
                            <Switch
                              value={clientAccessDocument}
                              onValueChange={(value) => onClientAccessChangeDocument(value)}
                              // style={{marginTop:-12}}
                              trackColor={{ false: '#00000080', true: '#0E9C9B70' }}
                              thumbColor={'#0E9C9B'}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>

                {/* Image */}
                <View style={styles.file_content}>
                  {item.type == 'image/jpeg' || item.type == 'image/png' ? (
                    <View style={styles.file_cnt_a}>
                      <View style={styles.file_cnt_a_a}>
                        <View style={styles.file_cnt_b_a}>
                          <Image source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} />
                        </View>

                        <View style={styles.rightCont}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.itemName} ellipsizeMode='middle' numberOfLines={1}>
                              {item.name}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <TouchableOpacity onPress={() => console.log('upload')} style={styles.upldBtn}>
                                <MaterialCommunityIcons name='download' color={'#006766'} size={16} />
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => console.log('delete')} style={styles.delBtn}>
                                <MaterialCommunityIcons name='delete' color={'#006766'} size={16} />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <TextInput
                            style={styles.file_name_input}
                            placeholder='Enter Custom Name'
                            placeholderTextColor={'#bebebe'}
                            defaultValue={primaryData && primaryData[index].custom_name}
                            onChangeText={(value) => handleFileNameOld(value, item.id, index)}
                          />

                          <View style={styles.switch}>
                            {clientAccessImage ? (
                              <>
                                <Text style={styles.switch_text}>Client Access ON</Text>
                              </>
                            ) : (
                              <>
                                <Text style={styles.switch_text_2}>Client Access OFF</Text>
                              </>
                            )}
                            <Switch
                              value={clientAccessImage}
                              onValueChange={(value) => onClientAccessChangeImage(value)}
                              // style={{marginTop:-12}}
                              trackColor={{ false: '#00000080', true: '#0E9C9B70' }}
                              thumbColor={'#0E9C9B'}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            ))}

          {files &&
            files.map((item, index) => (
              <View key={'file_' + index}>
                {/* Files */}
                <View style={styles.file_content}>
                  {item.type == 'application/pdf' ? (
                    <View style={styles.file_cnt_a}>
                      <View style={styles.file_cnt_a_a}>
                        <View style={styles.file_cnt_b_a}>
                          <MaterialCommunityIcons name='file-pdf-outline' color={'#006766'} size={80} />
                        </View>
                        <View style={styles.rightCont}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.itemName} ellipsizeMode='middle' numberOfLines={1}>
                              {item.name}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <TouchableOpacity onPress={() => console.log('upload')} style={styles.upldBtn}>
                                <MaterialCommunityIcons name='download' color={'#006766'} size={16} />
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => console.log('delete')} style={styles.delBtn}>
                                <MaterialCommunityIcons name='delete' color={'#006766'} size={16} />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <TextInput
                            style={styles.file_name_input}
                            placeholder='Enter Custom Name'
                            placeholderTextColor={'#bebebe'}
                            onChangeText={(value) => handleFileNameOld(value, item.id)}
                          />
                          <View style={styles.switch}>
                            {clientAccessDocument ? (
                              <>
                                <Text style={styles.switch_text}>Client Access ON</Text>
                              </>
                            ) : (
                              <>
                                <Text style={styles.switch_text_2}>Client Access OFF</Text>
                              </>
                            )}
                            <Switch
                              value={clientAccessDocument}
                              onValueChange={(value) => onClientAccessChangeDocument(value)}
                              // style={{marginTop:-12}}
                              trackColor={{ false: '#00000080', true: '#0E9C9B70' }}
                              thumbColor={'#0E9C9B'}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>

                {/* Image */}
                <View>
                  {item.type == 'image/jpeg' || item.type == 'image/png' ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ width: '15%' }}>
                        <Image source={{ uri: item.uri }} style={{ width: '100%', height: 50 }} />
                      </View>
                      <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text> {item.name}</Text>
                      </View>
                      <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckBox
                          checked={clientAccessImage}
                          onPress={(value) => onClientAccessChangeImage(value)}
                          checkedColor={'#0e4377'}
                        />
                      </View>
                      <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => onDelete(item)}>
                          <MaterialCommunityIcons name='delete' color={'#bebebe'} size={40} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <></>
                    // <View style={styles.file_cnt_a}>
                    //   <View style={styles.file_cnt_a_a}>
                    //     <View style={styles.file_cnt_b_a}>
                    //       <Image source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} />
                    //     </View>

                    //     <View style={styles.rightCont}>
                    //       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    //         <Text style={styles.itemName} ellipsizeMode='middle' numberOfLines={1}>
                    //           {item.name}
                    //         </Text>
                    //         <View style={{ flexDirection: 'row' }}>
                    //           <TouchableOpacity onPress={() => console.log('upload')} style={styles.upldBtn}>
                    //             <MaterialCommunityIcons name='download' color={'#006766'} size={16} />
                    //           </TouchableOpacity>

                    //           <TouchableOpacity onPress={() => console.log('delete')} style={styles.delBtn}>
                    //             <MaterialCommunityIcons name='delete' color={'#006766'} size={16} />
                    //           </TouchableOpacity>
                    //         </View>
                    //       </View>
                    //       <TextInput
                    //         style={styles.file_name_input}
                    //         placeholder='Enter Custom Name'
                    //         placeholderTextColor={'#bebebe'}
                    //         onChangeText={(value) => handleFileNameOld(value, item.id)}
                    //       />

                    //       <View style={styles.switch}>
                    //         {clientAccessImage ? (
                    //           <>
                    //             <Text style={styles.switch_text}>Client Access ON</Text>
                    //           </>
                    //         ) : (
                    //           <>
                    //             <Text style={styles.switch_text_2}>Client Access OFF</Text>
                    //           </>
                    //         )}
                    //         <Switch
                    //           value={clientAccessImage}
                    //           onValueChange={(value) => onClientAccessChangeImage(value)}
                    //           // style={{marginTop:-12}}
                    //           trackColor={{ false: '#00000080', true: '#0E9C9B70' }}
                    //           thumbColor={'#0E9C9B'}
                    //         />
                    //       </View>
                    //     </View>
                    //   </View>
                    // </View>
                  )}
                </View>
              </View>
            ))}
        </ScrollView>

        <View>
          <TouchableOpacity onPress={uploadImage} style={styles.submit}>
            <Text style={styles.subText}>Done</Text>
          </TouchableOpacity>
        </View>

        {camera && (
          <CameraModule
            showModal={camera}
            setModalVisible={() => setShowCamera(false)}
            setImage={(result) => handleCamMod(result)}
          />
        )}
      </View>
    </View>
  );
};

export default DocumentUpload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000099',
  },
  submitButtonFile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submit: {
    padding: 10,
    // backgroundColor: '#006766',
    // width: '100%',
  },
  icons_s: {
    backgroundColor: '#000',
  },
  file_content: {
    marginBottom: 10,
  },
  file_cnt_a: {
    backgroundColor: '#fff',
    elevation: 5,
    marginHorizontal: 5,
  },
  file_cnt_a_a: {
    // padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    alignItems: 'center',
  },
  file_cnt_b_a: {
    elevation: 2,
    backgroundColor: '#fff',
    width: '30%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  file_cnt_b_b: {
    width: '53%',
  },
  file_cnt_b_b_text: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00000090',
  },
  file_cnt_b_c: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    width: '15%',
  },
  upldBtn: {
    marginRight: 8,
    backgroundColor: '#BFD9D9',
    elevation: 5,
    borderRadius: 5,
    padding: 2,
  },
  delBtn: {
    // marginRight: 10,
    backgroundColor: '#BFD9D9',
    elevation: 5,
    borderRadius: 5,
    padding: 2,
  },
  file_name_input: {
    marginVertical: 6,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#BFD9D9',
    height: 25,
    color: '#006766',
    fontWeight: 'bold',
  },
  switch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: 180,
    alignItems: 'center',
    height: 30,
    // paddingHorizontal: 4,
    width: '100%',
  },
  subText: {
    marginVertical: 10,
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
  switch_text: {
    color: '#006766',
    fontWeight: 'bold',
    fontSize: 11,
  },
  switch_text_2: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 11,
  },
  itemName: {
    // textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
    width: 150,
  },
  camMod: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'white',
    height: 50,
    width: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  camMod_mod: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'white',
    height: 40,
    width: 40,
    backgroundColor: 'white',
  },
  camDef: {
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightCont: { width: '68%', padding: 5 },
});
