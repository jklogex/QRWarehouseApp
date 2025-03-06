import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Alert,
  SafeAreaView,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/authContext';
import { logoutUser, getDriversList } from '../../services/firebase';

interface Driver {
  id: string;
  displayName: string;
  email: string;
  status: string;
  lastUpdated?: any;
}

type RootStackParamList = {
  DriverDetails: { driver: Driver };
};

const SupervisorHomeScreen = () => {
  const navigation = useNavigation<any>();
  const { userProfile } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const result = await getDriversList();
      if (result.success) {
        setDrivers(result.drivers as Driver[]);
      } else {
        Alert.alert('Error', 'Failed to load drivers list');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while loading drivers');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
      console.error(error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDrivers();
  };

  const navigateToDriverDetails = (driver: Driver) => {
    navigation.navigate('DriverDetails', { driver });
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDriverCard = ({ item }: { item: Driver }) => {
    const statusColor = item.status === 'cleared' ? '#4CAF50' : '#F44336';
    const statusText = item.status === 'cleared' ? 'Cleared' : 'Not Cleared';
    
    return (
      <TouchableOpacity 
        style={styles.driverCard} 
        onPress={() => navigateToDriverDetails(item)}
      >
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{item.displayName}</Text>
          <Text style={styles.driverEmail}>{item.email}</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userProfile?.displayName}</Text>
        <Text style={styles.subtitle}>Manage driver exit clearances</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search drivers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loaderText}>Loading drivers...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDrivers}
          renderItem={renderDriverCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'No drivers match your search' 
                  : 'No drivers available'}
              </Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Log Out</Text>
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
    padding: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 46,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  driverCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  driverEmail: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SupervisorHomeScreen; 