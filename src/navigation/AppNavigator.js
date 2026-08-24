import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimalListScreen from '../screens/AnimalListScreen';
import BottomTabBar from '../components/BottomTabBar';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Adocao"
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Perdidos"
        component={AnimalListScreen}
        initialParams={{ status: 'P' }}
        options={{ title: 'Perdidos', tabBarAccessibilityLabel: 'Perdidos' }}
      />
      <Tab.Screen
        name="Encontrados"
        component={AnimalListScreen}
        initialParams={{ status: 'E' }}
        options={{ title: 'Encontrados', tabBarAccessibilityLabel: 'Encontrados' }}
      />
      <Tab.Screen
        name="Adocao"
        component={AnimalListScreen}
        initialParams={{ status: 'A' }}
        options={{ title: 'Adoção', tabBarAccessibilityLabel: 'Adoção' }}
      />
    </Tab.Navigator>
  );
}
