import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TouchableOpacityBase } from 'react-native';
import { IconButton } from 'react-native-paper';
import axios from 'react-native-axios';
// import { Divider, Badge } from 'react-native-paper';

const VisitHistory = ({ route, navigation }) => {
  const [petData, setPetData] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  let colors = ['#CADEDF', '#16796F'];
  let textColor = ['#000', '#fff'];
  // let textColor = ['#00000080', '#fff'];

  useEffect(() => {
    getVisitHistoryById();
    petDetail();
  }, []);

  const getVisitHistoryById = () => {
    let pet_id = route.params.petData;
    console.log(pet_id);
    axios
      .get(`visitDetail/pet/${pet_id}`)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          console.log(res.data);
          // VisitHistory = res.data;
          setVisitHistory(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const petDetail = async () => {
    let userClinicId = route.params.userDetails.clinic.id;
    console.log('userClinicId', userClinicId);
    await axios
      .get(`/pet/clinic/${userClinicId}`)
      .then((res) => {
        if (res.status === 200) {
          let petData = res.data;
          setPetData(petData);
          console;
          setFilteredDataSource(res.data);
        }
      })
      .catch((err) => {
        console.log('Error');
      });
  };

  const onHistoryClick = (id) => {
    navigation.navigate('VisitHistoryDetails', { visitData: id });
    // console.log(id);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ borderRadius: 10, backgroundColor: '#f2f4fc', margin: 20, paddingHorizontal: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Visit History</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IconButton icon='close' />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {visitHistory.map((element, index) => (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>
                    {element.pet_id.pet_type_id} / {element.pet_id.breed_id}
                  </Text>
                  <Text style={{ color: '#006796', fontWeight: 'bold' }}>{element.pet_id.pet_age}</Text>
                </View>
                {/* {console.log('element', element)} */}

                {/* {element.is_submited === '1' ? (
                  <View style={styles.saved_badge}>
                    <Text style={styles.savedBadge}>Submitted</Text>
                  </View>
                ) : (
                  <View style={styles.draft_badge}>
                    <Text style={styles.draftBadge}>Draft</Text>
                  </View>
                )} */}

                <TouchableOpacity
                  onPress={() => onHistoryClick(element)}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    marginVertical: 10,
                    borderWidth: 1,
                    borderColor: '#00000019',
                  }}
                >
                  <View style={styles.visitHistoryListHead}>
                    <View style={styles.wrapper}>
                      <View style={styles.wrapper_content_left}>
                        <Text
                          style={{
                            textAlign: 'left',
                            color: textColor[index % textColor.length],
                            fontWeight: 'bold',
                          }}
                        >
                          {element.pet_id.pet_name} / {element.owner_name_id.pet_owner_name}
                        </Text>
                        <Text
                          style={{
                            textAlign: 'left',
                            color: textColor[index % textColor.length],
                            fontWeight: 'bold',
                          }}
                        >
                          {element.visit_purpose.visit_purpose}
                        </Text>
                      </View>

                      <View style={styles.wrapper_content_right}>
                        <Text
                          style={{
                            textAlign: 'right',
                            color: textColor[index % textColor.length],
                            fontWeight: 'bold',
                          }}
                        >
                          {element.visit_type.visit_type}
                        </Text>
                        <Text
                          style={{
                            textAlign: 'right',
                            color: textColor[index % textColor.length],
                            fontWeight: 'bold',
                          }}
                        >
                          {element.visited_clinic_id.clinic_name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            ))}
          </ScrollView>

          <View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.submit}>
              <Text style={styles.subText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  submit: {
    padding: 10,
  },
  subText: {
    marginBottom: 10,
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
  visitHistoryListHead: {
    width: '100%',
  },
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  wrapper_content_left: {
    width: '48%',
    height: 70,
    marginRight: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  wrapper_content_right: {
    width: '48%',
    height: 70,
    marginLeft: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  saved_badge: {
    width: 80,
    backgroundColor: '#F2AA4CFF',
    paddingVertical: 8,
    marginLeft: 10,
    position: 'relative',
    top: 15,
    zIndex: 999999999,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  draft_badge: {
    width: 60,
    backgroundColor: 'red',
    paddingVertical: 8,
    marginLeft: 10,
    position: 'relative',
    top: 15,
    zIndex: 999999999,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
  savedBadge: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  draftBadge: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000099',
  },
});

export default VisitHistory;
