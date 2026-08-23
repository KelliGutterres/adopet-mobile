import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { EyeIcon, EyeOffIcon, LockIcon } from './AuthIcons';

export default function PasswordField({
  label = 'Senha',
  value,
  onChangeText,
  placeholder = 'Digite sua senha',
  autoComplete = 'password',
  textContentType = 'password',
}) {
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible ? 'Ocultar senha' : 'Mostrar senha';

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <View style={styles.iconLeft}>
          <LockIcon />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          accessibilityLabel={label}
          style={styles.input}
        />
        <Pressable
          onPress={() => setVisible((current) => !current)}
          accessibilityLabel={toggleLabel}
          hitSlop={8}
          style={styles.toggle}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  iconLeft: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 12,
    paddingLeft: 44,
    paddingRight: 44,
  },
  toggle: {
    position: 'absolute',
    right: 10,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
