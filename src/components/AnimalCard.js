import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, statusTheme } from '../theme/colors';
import {
  labelCidade,
  labelEspecie,
  labelPorte,
  labelStatus,
  labelTutorAdocao,
  linhaCaracteristicas,
  tituloCard,
} from '../services/animalLabels';
import { ChevronIcon, InfoIcon, MapPinIcon } from './ListIcons';
import AnimalPhoto from './AnimalPhoto';

function Chip({ label, backgroundColor, color }) {
  if (!label) {
    return null;
  }
  return (
    <View style={[styles.chip, { backgroundColor }]}>
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
}

export default function AnimalCard({ animal, onPress, showNome = false, showStatus = false }) {
  const status = animal.status === 'A' || animal.status === 'P' ? animal.status : 'E';
  const theme = statusTheme[status];
  const isAdocao = status === 'A';
  const nome = (animal.nome || '').trim();
  const title = showNome ? nome || tituloCard(animal) : tituloCard(animal);
  const contextLine = isAdocao ? labelTutorAdocao(animal) : labelCidade(animal.cidade);
  const traits = isAdocao ? linhaCaracteristicas(animal) : '';
  const especie = labelEspecie(animal.especie);
  const porte = labelPorte(animal.porte);
  const situacao = showStatus ? labelStatus(animal.status) : '';
  const accessibilityLabel = [title, situacao, contextLine, traits, especie, porte]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Ver detalhes"
      android_ripple={{ color: colors.border }}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <AnimalPhoto uri={animal.urlImagem} nome={animal.nome} theme={theme} size={72} borderRadius={12} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {contextLine ? (
          <View style={styles.meta}>
            <MapPinIcon color={colors.muted} size={14} />
            <Text style={styles.metaText} numberOfLines={1}>
              {contextLine}
            </Text>
          </View>
        ) : null}
        {traits ? (
          <View style={styles.meta}>
            <InfoIcon color={colors.muted} size={14} />
            <Text style={styles.metaText} numberOfLines={1}>
              {traits}
            </Text>
          </View>
        ) : null}
        <View style={styles.chips}>
          {situacao ? (
            <Chip label={situacao} backgroundColor={theme.chipBg} color={theme.chipText} />
          ) : null}
          <Chip label={especie} backgroundColor={theme.chipBg} color={theme.chipText} />
          <Chip label={porte} backgroundColor={colors.chipPorteBg} color={colors.chipPorteText} />
        </View>
      </View>
      <View style={styles.chevron} accessibilityElementsHidden>
        <ChevronIcon />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    paddingLeft: 4,
  },
});
