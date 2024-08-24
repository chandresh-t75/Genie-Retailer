import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react';

import DocumentIcon from '../assets/DocumentIcon.svg';

const ErrorModal = ({ errorModal, setErrorModal ,maxSize}) => {
    console.log(errorModal);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={errorModal}
            onRequestClose={() => {
                setErrorModal(!errorModal);
            }}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
                    <DocumentIcon width={71} height={98} />
                    <Text style={{ marginTop: 25, alignItems: 'center', fontSize: 14, color: '#2e2c43', fontFamily: 'Poppins-Bold' }}>Document size limit</Text>
                    <Text style={{ alignItems: 'center', fontSize: 14, textAlign: 'center', color: '#E76063', fontFamily: 'Poppins-Regular' }}>You can upload documents up to <Text style={{ fontFamily: 'Poppins-Bold' }}>{maxSize}MB</Text>  in size</Text>
                    <TouchableOpacity onPress={() => { setErrorModal(false) }}>
                        <Text style={{ marginTop: 20, alignItems: 'center', fontSize: 16, color: '#fb8c00', fontFamily: 'Poppins-Bold' }}>Continue</Text>
                    </TouchableOpacity>


                </View>

            </View>
        </Modal>
    )
}

export default ErrorModal