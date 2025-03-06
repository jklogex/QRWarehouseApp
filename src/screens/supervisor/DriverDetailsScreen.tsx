import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { updateDriverStatus } from '../../services/firebase';

interface Driver {
  id: string;
  displayName: string;
  email: string;
  status: string;
  lastUpdated?: any;
}

type ParamList = {
  DriverDetails: {
    driver: Driver;
  };
};

const DriverDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'DriverDetails'>>();
  const { driver } = route.params;
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(driver.status);

  const handleUpdateStatus = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      return;
    }

    setLoading(true);
    try {
      const result = await updateDriverStatus(driver.id, newStatus);
      
      if (result.success) {
        setCurrentStatus(newStatus);
        Alert.alert(
          'Status Updated', 
          `${driver.displayName} is now ${newStatus === 'cleared' ? 'cleared for exit' : 'not cleared for exit'}`
        );
      } else {
        Alert.alert('Error', 'Failed to update driver status');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating status');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'cleared' ? '#4CAF50' : '#F44336';
  };

  const getStatusText = (status: string) => {
    return status === 'cleared' ? 'Cleared for Exit' : 'Not Cleared for Exit';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.driverName}>{driver.displayName}</Text>
          <Text style={styles.driverEmail}>{driver.email}</Text>
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <View 
            style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(currentStatus) }
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(currentStatus)}</Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <Text style={styles.actionDescription}>
            Change the driver's exit clearance status. This will update their QR code in real-time.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.clearButton,
                loading && styles.disabledButton
              ]}
              onPress={() => handleUpdateStatus('cleared')}
              disabled={loading || currentStatus === 'cleared'}
            >
              {loading && currentStatus !== 'cleared' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Mark as Cleared</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.notClearButton,
                loading && styles.disabledButton
              ]}
              onPress={() => handleUpdateStatus('not_cleared')}
              disabled={loading || currentStatus === 'not_cleared'}
            >
              {loading && currentStatus !== 'not_cleared' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Mark as Not Cleared</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Information</Text>
          <Text style={styles.infoText}>
            • Clearing a driver allows them to exit the warehouse{'\n'}
            • The driver's QR code will update immediately{'\n'}
            • Security personnel will scan the QR code at the exit{'\n'}
            • You can change the status at any time
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Return to Drivers List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  driverName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  driverEmail: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  statusSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    backgroundColor: '#4CAF50',
  },
  notClearButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 80,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 22,
  },
  backButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverDetailsScreen; 