import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimalFormScreen from '../screens/AnimalFormScreen';
import ChooseAnimalStatusScreen from '../screens/ChooseAnimalStatusScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="ChooseAnimalStatus" component={ChooseAnimalStatusScreen} />
      <Stack.Screen name="AnimalForm" component={AnimalFormScreen} />
    </Stack.Navigator>
  );
}
