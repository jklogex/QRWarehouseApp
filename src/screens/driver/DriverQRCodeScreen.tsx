import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../services/authContext';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.7;

const DriverQRCodeScreen = () => {
  const navigation = useNavigation();
  const { user, userProfile } = useAuth();
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (user && userProfile) {
      // Create QR code data with driver information and status
      const qrData = {
        userId: user.uid,
        name: userProfile.displayName,
        role: userProfile.role,
        status: userProfile.status || 'not_cleared',
        timestamp: new Date().toISOString(),
      };
      
      setQrValue(JSON.stringify(qrData));
    }
  }, [user, userProfile]);

  const getStatusColor = () => {
    if (userProfile?.status === 'cleared') {
      return '#4CAF50'; // Green
    }
    return '#F44336'; // Red
  };

  const getStatusText = () => {
    if (userProfile?.status === 'cleared') {
      return 'Cleared for Exit';
    }
    return 'Not Cleared for Exit';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Exit QR Code</Text>
        
        <View style={styles.qrContainer}>
          {qrValue ? (
            <QRCode
              value={qrValue}
              size={QR_SIZE}
              color="#000"
              backgroundColor="#fff"
            />
          ) : (
            <View style={[styles.qrPlaceholder, { width: QR_SIZE, height: QR_SIZE }]} />
          )}
        </View>
        
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor() }
          ]}
        >
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        
        <Text style={styles.instructions}>
          Present this QR code to the security personnel at the exit gate for scanning
        </Text>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 32,
  },
  qrPlaceholder: {
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 32,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverQRCodeScreen; 