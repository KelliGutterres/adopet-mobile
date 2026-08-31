import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimalDetailScreen from '../screens/AnimalDetailScreen';
import AnimalFormScreen from '../screens/AnimalFormScreen';
import ChooseAnimalStatusScreen from '../screens/ChooseAnimalStatusScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="ChooseAnimalStatus" component={ChooseAnimalStatusScreen} />
      <Stack.Screen name="AnimalForm" component={AnimalFormScreen} />
      <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
