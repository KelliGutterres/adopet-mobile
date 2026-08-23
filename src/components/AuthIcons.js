import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

const STROKE = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function MailIcon({ color = colors.icon, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M3 7l9 6 9-6" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function LockIcon({ color = colors.icon, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function EyeIcon({ color = colors.icon, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function EyeOffIcon({ color = colors.icon, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M3 3l18 18" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path
        d="M10.6 10.6a3 3 0 0 0 4.2 4.2"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
      <Path
        d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.2 3.8"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
      <Path
        d="M6.1 6.1A18 18 0 0 0 2 12s3.5 7 10 7a10.4 10.4 0 0 0 4.4-.9"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
    </Svg>
  );
}

export function UserIcon({ color = colors.icon, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path
        d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
    </Svg>
  );
}

export function PhoneIcon({ color = colors.icon, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.7a2 2 0 0 1 1.7 2z"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
    </Svg>
  );
}

export function MapPinIcon({ color = colors.icon, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
      <Circle cx="12" cy="10" r="2.5" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function UserPlusIcon({ color = colors.surface, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M19 8v6M22 11h-6" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function LogInIcon({ color = colors.surface, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M10 17l5-5-5-5" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M15 12H3" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}
