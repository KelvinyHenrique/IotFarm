import MQTT, {IMqttClient, QoS} from 'sp-react-native-mqtt';
import {IMqttClientOptions} from './types';

//Create interface for message
interface IMessage {
  data: string;
  qos: QoS;
  retain: boolean;
  topic: string;
}

export default class MqttService {
  public messages: IMessage[];

  constructor() {
    this.messages = [];
  }

  private options: IMqttClientOptions;
  private client: IMqttClient;

  public async connect(options: IMqttClientOptions) {
    this.options = options;
    this.client = await MQTT.createClient(this.options);
    this.client.connect();
    this.client.on('message', this.messageHandler);
    this.client.on('connect', this.connectHandler);
    this.client.on('error', this.errorHandler);
  }

  public connectHandler() {
    console.log('Connected');
  }
  public errorHandler(err: any) {
    console.log('Error', err);
  }
  public disconnectHandler() {
    console.log('Disconnected');
  }

  public publish(topic: string, message: string, qos: QoS, retain: boolean) {
    this.client.publish(topic, message, qos, retain);
  }

  public subscribe(topic: string, qos: QoS) {
    this.client.subscribe(topic, qos);
  }
  public messageHandler(msg: IMessage) {
    console.log(this.messages);
    /*  const {messages} = this.state;
    let newmessages = [...messages, msg];
    this.setState(newmessages);
    console.log('Message', newmessages); */
  }
}
