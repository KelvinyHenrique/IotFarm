import React, {useEffect, useState} from 'react';
import {Image, Switch, Text, View} from 'react-native';
import styles from './styles';
//Import png image from assets folder
import pump from '../../../assets/water-pump.png';

const Device = (props: any) => {
  const parsePumpStatus = (status: string) => {
    if (status === '1') {
      return 'Ligado';
    } else if (status === '0') {
      return 'Desligado';
    } else {
      return 'Offline';
    }
  };

  const [isEnabled, setIsEnabled] = useState(false);
  useEffect(() => {
    setIsEnabled(props.status === '1');
  }, [props.status]);

  const toggleSwitch = () => {
    const mqtt = props.mqtt;
    if (mqtt) {
      mqtt.publish('farmiot/pump/status', isEnabled ? '0' : '1', 0, false);
      console.log('Pump ' + (isEnabled ? 'OFF' : 'ON'));
    }
  };
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <Image source={pump} style={styles.icon} />
        <Text style={styles.text}>{props.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.text}>{parsePumpStatus(props.status)}</Text>
        <Switch
          trackColor={{false: '#EF476F', true: '#0ead69'}}
          thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

export default Device;
