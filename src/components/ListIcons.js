import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

const STROKE = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function BellIcon({ color = colors.surface, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
      <Path d="M13.7 21a2 2 0 0 1-3.4 0" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function SearchIcon({ color = colors.icon, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M20 20l-3.5-3.5" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function FunnelIcon({ color = colors.text, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M4 5h16l-6.5 8v5l-3 1.5v-6.5L4 5z" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function CameraIcon({ color = colors.text, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        d="M4 8h3.2l1.4-2.2A2 2 0 0 1 10.3 5h3.4a2 2 0 0 1 1.7.8L16.8 8H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
      <Circle cx="12" cy="14" r="3.2" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function MapPinIcon({ color = colors.muted, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
      <Circle cx="12" cy="10" r="2.2" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function InfoIcon({ color = colors.muted, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M12 11v6M12 8h.01" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function ChevronIcon({ color = colors.placeholder, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2} {...STROKE} />
    </Svg>
  );
}

export function PlusIcon({ color = colors.surface, size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.4} {...STROKE} />
    </Svg>
  );
}

export function LostTabIcon({ color = colors.muted, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M20 20l-3.2-3.2" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function FoundTabIcon({ color = colors.muted, size = 22 }) {
  return <MapPinIcon color={color} size={size} />;
}

export function HeartIcon({ color = colors.muted, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        d="M19.5 12.6L12 20l-7.5-7.4a5 5 0 0 1 7.1-7.1L12 6l.4-.5a5 5 0 0 1 7.1 7.1z"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
    </Svg>
  );
}

export function ProfileTabIcon({ color = colors.muted, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}
