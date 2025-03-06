import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import { getUserProfile } from '../../services/firebase';

interface DriverData {
  userId: string;
  name: string;
  role: string;
  status: string;
  timestamp: string;
}

const ScanQRCodeScreen = () => {
  const navigation = useNavigation();
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState<any>(null);

  const handleBarCodeRead = async ({ data }: { data: string }) => {
    if (!scanning) return;
    
    try {
      setScanning(false);
      setLoading(true);
      
      // Parse QR code data
      const parsedData: DriverData = JSON.parse(data);
      setScannedData(parsedData);
      
      // Verify with database
      if (parsedData.userId) {
        const result = await getUserProfile(parsedData.userId);
        if (result.success) {
          setVerifiedData(result.profile);
        } else {
          Alert.alert('Verification Failed', 'Could not verify driver information');
        }
      }
    } catch (error) {
      Alert.alert('Invalid QR Code', 'The scanned QR code is not valid');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setScannedData(null);
    setVerifiedData(null);
  };

  const getStatusColor = (status: string) => {
    return status === 'cleared' ? '#4CAF50' : '#F44336';
  };

  const getStatusText = (status: string) => {
    return status === 'cleared' ? 'Cleared for Exit' : 'Not Cleared for Exit';
  };

  const renderResultModal = () => {
    if (!scannedData) return null;
    
    // Check if the QR data matches the database data
    const isVerified = verifiedData && verifiedData.status === scannedData.status;
    const statusToShow = verifiedData ? verifiedData.status : scannedData.status;
    
    return (
      <Modal
        visible={!scanning}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Verifying driver information...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>Scan Result</Text>
                
                <View style={styles.driverInfoContainer}>
                  <Text style={styles.driverName}>{scannedData.name}</Text>
                  <Text style={styles.driverRole}>{scannedData.role.toUpperCase()}</Text>
                </View>
                
                <View 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(statusToShow) }
                  ]}
                >
                  <Text style={styles.statusText}>{getStatusText(statusToShow)}</Text>
                </View>
                
                {!isVerified && verifiedData && (
                  <View style={styles.warningContainer}>
                    <Text style={styles.warningText}>
                      Warning: QR code data does not match database records!
                    </Text>
                  </View>
                )}
                
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Driver ID:</Text>
                  <Text style={styles.infoValue}>{scannedData.userId}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Timestamp:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(scannedData.timestamp).toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={resetScanner}
                  >
                    <Text style={styles.closeButtonText}>Scan Another Code</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={styles.backButtonText}>Return to Dashboard</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={scanning ? handleBarCodeRead : undefined}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera to scan QR codes',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scannerFrame} />
          
          <Text style={styles.instructions}>
            Position the QR code within the frame to scan
          </Text>
        </View>
      </RNCamera>
      
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      
      {renderResultModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 32,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  driverInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  driverName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  driverRole: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 24,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFEEBA',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 24,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ScanQRCodeScreen; 