import Svg, { Circle, Defs, G, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

/** Defineciler amblemi: antik sikke üzerinde büyüteç. */
export function LogoMark({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="coin" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F5D27A" />
          <Stop offset="0.55" stopColor="#D4A24C" />
          <Stop offset="1" stopColor="#8A6424" />
        </LinearGradient>
      </Defs>
      <Circle cx="44" cy="44" r="36" fill="url(#coin)" />
      <Circle cx="44" cy="44" r="30" fill="none" stroke="#7A5418" strokeWidth="1.6" strokeDasharray="2 3" />
      {/* Sikke üzerindeki antik profil */}
      <Path
        d="M36 26c8-3 16 2 17 10 1 4-1 6 2 9 2 2-1 3-2 4 1 1 1 3-1 4 1 2-1 4-4 4h-5c-2 0-3 2-3 5H30c1-4 2-7 0-11-4-7-3-21 6-25z"
        fill="#7A5418"
        opacity="0.85"
      />
      <G>
        <Circle cx="66" cy="66" r="16" fill="#14100C" fillOpacity="0.35" stroke="#F3E9DA" strokeWidth="5" />
        <Path d="M78 78l14 14" stroke="#F3E9DA" strokeWidth="8" strokeLinecap="round" />
      </G>
    </Svg>
  );
}

export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size * 6} height={size * 1.3} viewBox="0 0 300 64">
      <SvgText x="0" y="46" fontSize="44" fontWeight="700" fill="#F0C870" fontFamily="serif" letterSpacing="1">
        Defineciler
      </SvgText>
    </Svg>
  );
}
