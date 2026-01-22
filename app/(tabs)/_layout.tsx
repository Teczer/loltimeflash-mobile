import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Label>Solo</Label>
        {Platform.select({
          ios: <Icon sf={{ default: 'bolt', selected: 'bolt.fill' }} />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name="flash-on" />} />,
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="multiplayer">
        <Label>Multi</Label>
        {Platform.select({
          ios: <Icon sf={{ default: 'person.2', selected: 'person.2.fill' }} />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name="people" />} />,
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="lanegap">
        <Label>LaneGap</Label>
        {Platform.select({
          ios: <Icon sf={{ default: 'books.vertical', selected: 'books.vertical.fill' }} />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name="library-books" />} />,
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
