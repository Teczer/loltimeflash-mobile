import { memo } from 'react';
import { View, ImageSourcePropType } from 'react-native';

import { getRemainingTime } from '../hooks/use-flash-cooldown.hook';
import type { ILeagueRole, ISummonerData } from '../types/game.types';
import { ITEM_ICONS } from '../constants/game.constants';

import { FlashButton } from './flash-button.component';
import { ItemToggle } from './item-toggle.component';
import { TimerControls } from './timer-controls.component';

// Role icon mapping
const ROLE_ICONS: Record<string, ImageSourcePropType> = {
  toprole: require('@/assets/images/roles/toprole-icon.png'),
  junglerole: require('@/assets/images/roles/junglerole-icon.png'),
  midrole: require('@/assets/images/roles/midrole-icon.png'),
  adcrole: require('@/assets/images/roles/adcrole-icon.png'),
  supportrole: require('@/assets/images/roles/supportrole-icon.png'),
};

interface IRoleCardProps {
  role: ILeagueRole;
  data: ISummonerData;
  onFlashPress: () => void;
  onToggleBoots: () => void;
  onToggleRune: () => void;
  onAdjustTimer?: (seconds: number) => void;
}

const RoleCardComponent = (props: IRoleCardProps) => {
  const {
    role,
    data,
    onFlashPress,
    onToggleBoots,
    onToggleRune,
    onAdjustTimer,
  } = props;

  const remainingSeconds = getRemainingTime(data.isFlashed);
  const isOnCooldown = remainingSeconds > 0;

  // Get icon source - use champion icon if available, otherwise role icon
  const iconSource = data.champion?.championIconUrl
    ? { uri: data.champion.championIconUrl }
    : ROLE_ICONS[role.icon];

  return (
    <View className="items-center gap-3 py-2">
      {/* Items (Cosmic Insight + Lucidity Boots) */}
      <View className="flex-row items-center gap-6">
        <ItemToggle
          itemName="Cosmic Insight"
          iconUrl={ITEM_ICONS.cosmicInsight}
          isActive={data.cosmicInsight}
          onPress={onToggleRune}
        />

        <ItemToggle
          itemName="Lucidity Boots"
          iconUrl={ITEM_ICONS.lucidityBoots}
          isActive={data.lucidityBoots}
          onPress={onToggleBoots}
        />
      </View>

      {/* Flash Button */}
      <FlashButton
        role={role.name}
        iconSource={iconSource}
        cooldown={data.isFlashed}
        onPress={onFlashPress}
        summonerName={data.champion?.summonerName}
      />

      {/* Timer Controls (+/-2s buttons) */}
      {onAdjustTimer && (
        <TimerControls
          isOnCooldown={isOnCooldown}
          onAdjust={onAdjustTimer}
        />
      )}
    </View>
  );
};

export const RoleCard = memo(RoleCardComponent, (prev, next) => {
  return (
    prev.role.name === next.role.name &&
    prev.role.icon === next.role.icon &&
    prev.data.isFlashed === next.data.isFlashed &&
    prev.data.lucidityBoots === next.data.lucidityBoots &&
    prev.data.cosmicInsight === next.data.cosmicInsight &&
    prev.data.champion?.championIconUrl === next.data.champion?.championIconUrl &&
    prev.data.champion?.summonerName === next.data.champion?.summonerName
  );
});
