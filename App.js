  
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASdxOI9f5r_fctr2sMB_9snt-gmLXuqs4",
    authDomain: "final-2ed81.firebaseapp.com",
    databaseURL: "https://final-2ed81.firebaseio.com",
    projectId: "final-2ed81",
    storageBucket: "final-2ed81.appspot.com",
    messagingSenderId: "684197441189",
    appId: "1:684197441189:web:4b25308b6dde2d1a70a74c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const storageRef = storage.ref();

const { height, width } = Dimensions.get('window');
const maskRowHeight = Math.round((height - 300) / 20);
const maskColWidth = (width - 300) / 2;

export default class App extends React.Component {

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    //uploadImage: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  takePicture = async () => {
    await this.camera.takePictureAsync({ skipProcessing: true }).then((data) => {
      this.uploadImage(data.uri, "test-image")
        .then(() => {
          console.log("Success");
          console.log(data);
          alert("Upload Success!");
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
      this.setState({
          takeImageText: "PICTURE TAKEN",
          photo: data.uri
      })
    })
  }
  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child("images/"+ imageName);
    return ref.put(blob);
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          <View style= {styles.navigationStyle}>
            <Text>Navigation Bar</Text>
          </View>
          <Camera
            ref={ref => { this.camera = ref; }}
            style={styles.cameraStyle} 
            type={this.state.type}
            autoFocus={Camera.Constants.AutoFocus.on}
            >
            <View style={styles.maskOutter}>
              <View style={[{ flex: maskRowHeight  }, styles.maskRow]} />
              <View style={[{ flex: 30 }, styles.maskCenter]}>
                <View style={[{ width: maskColWidth }]} />
                <View style={styles.maskInner} />
                <View style={[{ width: maskColWidth }]} />
              </View>
              <View style={[{ flex: maskRowHeight }, styles.maskRow]} />
            </View>
            <TouchableOpacity
              onPress={this.takePicture.bind(this)}
              style= {styles.btnTakePicture} >
            </TouchableOpacity>
          </Camera>
          <View style= {styles.footer}>
            <Text>footer</Text>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraStyle: {
    flex: 0.85,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navigationStyle: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  btnTakePicture: {
    height: 70,
    width: 70,
    borderColor: 'black',
    borderRadius: 35,
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: 'red',
    marginBottom: 10,
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    width: 300,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 3,
  },
  maskFrame: {
    
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: { flexDirection: 'row' },
});