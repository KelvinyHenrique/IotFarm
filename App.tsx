import React, {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import MQTT, {IMqttClient, QoS} from 'sp-react-native-mqtt';
import {IMqttClientOptions} from './src/service/types';
import Device from './src/components/device';

interface IMessage {
  data: string;
  qos: QoS;
  retain: boolean;
  topic: string;
}

interface PumpStatus {
  status: string;
  timestamp: string;
}

const App = () => {
  const options: IMqttClientOptions = {
    clientId: `farmiot-${Math.random().toString(16)}`,
    uri: 'mqtt://broker.emqx.io:1883',
    automaticReconnect: true,
  };

  const [mqttClient, setMqttClient] = useState<IMqttClient>();
  const [mqttStatus, setMqttStatus] = useState<boolean>(false);
  const [pumpStatus, setPumpStatus] = useState<PumpStatus>({
    status: 'unknown',
    timestamp: 'unknown',
  });

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (mqttStatus) {
      subscribe('farmiot/pump/status', 0);
      publish('farmiot/pump/status/retrieve', '1', 0, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mqttStatus]);

  const connect = async () => {
    let client: IMqttClient = await MQTT.createClient(options);
    client.connect();
    client.on('message', messageHandler);
    client.on('connect', connectHandler);
    client.on('error', errorHandler);
    client.on('closed', disconnectHandler);
    setMqttClient(client);
  };

  const connectHandler = () => {
    setMqttStatus(true);
    console.log('Connected');
  };
  const disconnectHandler = () => {
    setMqttStatus(false);
    console.log('Disconnected');
  };
  const errorHandler = (err: any) => {
    setMqttStatus(false);
    console.log('Error', err);
  };

  const messageHandler = (msg: IMessage) => {
    if (msg.topic === 'farmiot/pump/status') {
      setPumpStatus({
        status: msg.data,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const publish = (
    topic: string,
    message: string,
    qos: QoS,
    retain: boolean,
  ) => {
    mqttClient?.publish(topic, message, qos, retain);
  };
  const subscribe = (topic: string, qos: QoS) => {
    mqttClient?.subscribe(topic, qos);
  };

  return (
    <SafeAreaView>
      <View
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          paddingTop: 10,
          justifyContent: 'center',
        }}>
        <Device
          name="Bomba de Água"
          status={pumpStatus.status}
          mqtt={mqttClient}
        />
      </View>
    </SafeAreaView>
  );
};

export default App;
