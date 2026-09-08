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

export function ChevronLeftIcon({ color = colors.surface, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2} {...STROKE} />
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

export function SimilarityTabIcon({ color = colors.muted, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Circle cx="9" cy="12" r="5.2" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Circle cx="15" cy="12" r="5.2" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function PencilIcon({ color = colors.surface, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        d="M12.5 6.5l5 5M4 20l1.2-4.2L16.7 4.3a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 1 0 2.8L8.2 18.8 4 20z"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
    </Svg>
  );
}

export function TrashIcon({ color = colors.danger, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M4 7h16" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M10 11v6M14 11v6" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function LogoutIcon({ color = colors.danger, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M10 17l5-5-5-5" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M15 12H4" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path d="M20 4v16" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function WhatsAppIcon({ color = '#25D366', size = 22 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessible={false}
      accessibilityElementsHidden
    >
      <Path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        fill={color}
      />
    </Svg>
  );
}
