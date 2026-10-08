import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AuthInput, AuthLayout, Checkbox, PillButton, SocialSignIn, SwitchPrompt } from '@/components/auth';
import { AppText } from '@/components/ui';
import { signIn } from '@/data/authStore';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type Errors = Partial<Record<'email' | 'password', string>>;

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
}

// TODO: password reset and Google/Apple sign-in once a real auth backend exists.
const notAvailableYet = () => {};

export function LogInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [attempted, setAttempted] = useState(false);
  const errors = attempted ? validate(email, password) : {};

  // Demo only: any well-formed email and password signs in; there is no account check yet.
  const logIn = () => {
    setAttempted(true);
    if (Object.keys(validate(email, password)).length > 0) return;
    signIn();
  };

  return (
    <AuthLayout title="Welcome back." subtitle="Let’s pick up your money story." gap={40} paddingTop={12}>
      <View style={styles.form}>
        <View style={styles.fields}>
          <AuthInput
            label="Email address"
            icon="authMail"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />
          <AuthInput
            label="Password"
            icon="authLock"
            placeholder="Enter your password"
            password
            value={password}
            onChangeText={setPassword}
            autoComplete="current-password"
            textContentType="password"
            error={errors.password}
          />
        </View>

        <View style={styles.preferences}>
          <Checkbox checked={remember} onChange={setRemember} accessibilityLabel="Remember me" gap={7} align="center">
            <AppText variant="caption">Remember me</AppText>
          </Checkbox>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={notAvailableYet}>
            <AppText variant="labelSemibold" color="brand">
              Forgot password?
            </AppText>
          </Pressable>
        </View>

        <PillButton label="Log in" onPress={logIn} />
      </View>

      <SocialSignIn variant="log-in" onPressGoogle={notAvailableYet} onPressApple={notAvailableYet} />

      <SwitchPrompt prompt="New to Talli?" action="Create an account" onPress={() => router.replace('/sign-up')} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  fields: {
    gap: 14,
  },
  preferences: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
