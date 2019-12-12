import * as React from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Toolbar from './toolbar.component';
import Gallery from './gallery.component';
import React, { useState, useEffect } from 'react';

import styles from './styles';

const CameraPage = () => {
    camera = null;
    let [captures, setCaptures] = useState([]);
    let [flashMode, setFlashModeH] = useState(Camera.Constants.FlashMode.off);
    let [capturing, setCapturing] = useState(null);
    let [cameraType, setCameraTypeH] = useState(Camera.Constants.Type.back);
    let [hasCameraPermission, sethasCameraPermission] = useState(null);

    setFlashMode = (flashMode) => setFlashModeH(flashMode);
    setCameraType = (cameraType) => setCameraTypeH(cameraType);
    handleCaptureIn = () => setCapturing(true);

    handleCaptureOut = () => {
        if (capturing)
            this.camera.stopRecording();
    };

    handleShortCapture = async () => {
        const photoData = await this.camera.takePictureAsync();
        setCapturing(false);
        setCaptures([photoData, ...this.state.captures]);
    };

    handleLongCapture = async () => {
        const videoData = await this.camera.recordAsync();
        setCapturing(false);
        setCaptures([videoData, ...this.state.captures])
    };

    async componentDidMount() {
        console.disableYellowBox = true;
        
        useEffect(async () =>  {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

        sethasCameraPermission(hasCameraPermission);
    }, []);

    render() {
        const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;


        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        }

        return (
            <React.Fragment>
            <View>
                <Camera
                    type={cameraType}
                    flashMode={flashMode}
                    style={styles.preview}
                    ref={camera => this.camera = camera}
                />
            </View>
                 {captures.length > 0 && <Gallery captures={captures}/>}
                <Toolbar 
                    capturing={capturing}
                    flashMode={flashMode}
                    cameraType={cameraType}
                    setFlashMode={this.setFlashMode}
                    setCameraType={this.setCameraType}
                    onCaptureIn={this.handleCaptureIn}
                    onCaptureOut={this.handleCaptureOut}
                    onLongCapture={this.handleLongCapture}
                    onShortCapture={this.handleShortCapture}
                />
        </React.Fragment>
            
        );
    };
};