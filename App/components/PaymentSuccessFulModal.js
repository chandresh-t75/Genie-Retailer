import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PaymentSuccessFulModal = ({ isVisible, setIsVisible }) => {


    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isVisible}
            // onRequestClose={() => setIsVisible(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.popup}>
                        <MaterialIcons name="check-circle" size={64} color="white" />
                        <Text style={styles.popupText}>Payment Done Successfully!</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 30,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    popup: {
        backgroundColor: '#4CAF50',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // For iOS shadow
        shadowOpacity: 0.8, // For iOS shadow
        shadowRadius: 2, // For iOS shadow
        width: '80%',
        height: 300,
    },
    popupText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        fontFamily: "Poppins-ExtraBold",
        textAlign: "center"
    },
});

export default PaymentSuccessFulModal;
