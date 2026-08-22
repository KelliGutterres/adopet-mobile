import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

export default function PawLogo({ size = 72, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityElementsHidden>
      <Path
        fill={color}
        d="M32 8c-11.6 0-21 9.2-21 22.4 0 9.6 6.4 16.8 21 24.6 14.6-7.8 21-15 21-24.6C53 17.2 43.6 8 32 8z"
      />
      <Circle cx="20" cy="18" r="5.2" fill={color} />
      <Circle cx="32" cy="12" r="5.4" fill={color} />
      <Circle cx="44" cy="18" r="5.2" fill={color} />
      <Circle cx="14.5" cy="30" r="4.6" fill={color} />
      <Circle cx="49.5" cy="30" r="4.6" fill={color} />
      <Path
        fill="#F5F3FF"
        d="M24.2 36.2c2.4-4.6 7.2-6.4 11.8-3.2 1.6 1.1 2.6 2.6 3.2 4.2.4-1.8 1.6-3.4 3.4-4.2 3.8-1.6 7.4.8 8.2 4.6.4 2-0.2 4-1.8 5.4-2.2 1.8-5.2 1.6-7.2.2-1 .8-2.2 1.4-3.6 1.6v3.2c0 1.2-.8 2.2-2 2.4h-.4c-1.2-.2-2-1.2-2-2.4v-3.4c-2.2-.6-4-2-5.2-3.8-1.6 1.4-4 1.6-5.8.2-2.4-1.8-2.8-5.4-.8-7.6z"
      />
    </Svg>
  );
}
