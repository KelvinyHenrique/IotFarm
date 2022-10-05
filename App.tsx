import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, Text} from 'react-native';
import MQTT, {IMqttClient, QoS} from 'sp-react-native-mqtt';
import {IMqttClientOptions} from './src/service/types';

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
    clientId: 'dafksdfjsdk',
    uri: 'mqtt://broker.emqx.io:1883',
  };

  const [mqttClient, setMqttClient] = useState<IMqttClient>();
  const [pumpStatus, setPumpStatus] = useState<PumpStatus>({
    status: 'unknown',
    timestamp: 'unknown',
  });

  const connect = async () => {
    const client: IMqttClient = await MQTT.createClient(options);
    client.connect();
    client.on('message', messageHandler);
    client.on('connect', connectHandler);
    client.on('error', errorHandler);
    client.on('closed', disconnectHandler);
    setMqttClient(client);
  };

  const connectHandler = () => {
    console.log('Connected');
  };
  const disconnectHandler = () => {
    console.log('Disconnected');
  };
  const errorHandler = (err: any) => {
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
      <Text>Hello World</Text>
      <Button title="Connect" onPress={() => connect()} />
      <Button
        title="Publish"
        onPress={() =>
          publish('farmiot/pump/logs', 'Hello from phone', 0, false)
        }
      />
      <Button
        title="Subscribe"
        onPress={() => subscribe('farmiot/pump/status', 0)}
      />
      <Text>{pumpStatus.status}</Text>
    </SafeAreaView>
  );
};

export default App;
