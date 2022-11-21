import React from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Header } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PageHeader = (props) => {
  const navigation = useNavigation();

  return (
    <>
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
      <View style={{ backgroundColor: '#f2f4fc', paddingTop: 10 }}>
        <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name='arrow-back-ios' color={'#000'} size={25} />
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{props.header}</Text>
        </View>
      </View>
    </>
  );
};

export default PageHeader;
