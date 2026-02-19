import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {AxiosError, isAxiosError} from 'axios';

import {Screen} from '@/components/Screen';
import {useAuth} from '@/providers/AuthProvider';
import {tokens} from '@/theme';

export function LoginScreen() {
  const {signIn} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Informe e-mail e senha para continuar.');
      return;
    }

    try {
      setSubmitting(true);
      await signIn({email: email.trim(), password});
    } catch (error) {
      if (!isAxiosError(error)) {
        const fallbackMessage =
          error instanceof Error ? error.message : 'Erro inesperado ao autenticar.';

        Alert.alert('Falha no login', fallbackMessage);
        return;
      }

      const axiosError = error as AxiosError<{message?: string}>;
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      if (status === 401 || status === 422) {
        Alert.alert(
          'Falha no login',
          message ?? 'E-mail ou senha inválidos. Verifique as credenciais e tente novamente.',
        );
        return;
      }

      if (axiosError.code === 'ECONNABORTED' || !axiosError.response) {
        Alert.alert(
          'Sem conexão',
          'Não foi possível conectar ao servidor. Verifique se a API está rodando e tente novamente.',
        );
        return;
      }

      Alert.alert('Falha no login', message ?? 'Erro inesperado ao autenticar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen loading={submitting}>
      <View style={styles.container}>
        <Text style={styles.brand}>Teu Barbeiro</Text>
        <Text style={styles.subtitle}>Faça login para acessar seu painel mobile.</Text>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="E-mail"
            placeholderTextColor={tokens.text.muted}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={tokens.text.muted}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: tokens.spacing.xl,
  },
  brand: {
    color: tokens.text.primary,
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: tokens.text.secondary,
    fontSize: tokens.typography.size.md,
  },
  form: {
    gap: tokens.spacing.md,
  },
  input: {
    backgroundColor: tokens.surface.elevated,
    borderColor: tokens.border.default,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    color: tokens.text.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  button: {
    backgroundColor: tokens.color.brand.primary,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  buttonText: {
    color: tokens.text.onBrand,
    fontWeight: '700',
    fontSize: tokens.typography.size.md,
  },
});
