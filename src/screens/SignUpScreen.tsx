import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthInput, AuthLayout, Checkbox, PillButton, SocialSignIn, SwitchPrompt } from '@/components/auth';
import { AppText } from '@/components/ui';
import { signIn } from '@/data/authStore';
import { updateProfile } from '@/data/profileStore';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD = 8;

type Errors = Partial<Record<'name' | 'email' | 'password' | 'confirm' | 'consent', string>>;

function validate(name: string, email: string, password: string, confirm: string, agreed: boolean): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = 'Enter your name.';
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (password.length < MIN_PASSWORD) errors.password = `Use at least ${MIN_PASSWORD} characters.`;
  if (confirm !== password) errors.confirm = 'Passwords don’t match.';
  if (!agreed) errors.consent = 'Please accept the terms to continue.';
  return errors;
}

// TODO: Google/Apple sign-in and the Terms/Privacy pages once auth and legal copy exist.
const notAvailableYet = () => {};

export function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  // Errors only appear after the first attempt, then update as the user fixes them.
  const [attempted, setAttempted] = useState(false);
  const errors = attempted ? validate(name, email, password, confirm, agreed) : {};

  const createAccount = () => {
    setAttempted(true);
    if (Object.keys(validate(name, email, password, confirm, agreed)).length > 0) return;
    updateProfile({ name: name.trim(), email: email.trim() });
    // Signing in unlocks the app; the protected routes then move to the dashboard.
    signIn();
  };

  return (
    <AuthLayout title="Your journey starts here." subtitle="A calmer way to spend, save, and grow." gap={30}>
      <View style={styles.form}>
        <View style={styles.fields}>
          <AuthInput
            label="Full name"
            icon="authUser"
            placeholder="What should we call you?"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            textContentType="name"
            autoCapitalize="words"
            error={errors.name}
          />
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
            placeholder="Create a password"
            password
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
            textContentType="newPassword"
            error={errors.password}
          />
          <AuthInput
            label="Confirm Password"
            icon="authLock"
            placeholder="Confirm password"
            password
            value={confirm}
            onChangeText={setConfirm}
            autoComplete="new-password"
            textContentType="newPassword"
            error={errors.confirm}
          />
        </View>

        <View style={styles.submit}>
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            accessibilityLabel="I agree to Talli’s Terms of Service and Privacy Policy"
            gap={8}>
            <AppText variant="consent" color="textSecondary" style={styles.consentText}>
              {'I agree to Talli’s '}
              <AppText variant="consentLink" color="brand" onPress={notAvailableYet}>
                Terms of Service
              </AppText>
              {' and '}
              <AppText variant="consentLink" color="brand" onPress={notAvailableYet}>
                Privacy Policy.
              </AppText>
            </AppText>
          </Checkbox>
          {errors.consent ? (
            <AppText variant="captionSm" color="danger" accessibilityLiveRegion="polite">
              {errors.consent}
            </AppText>
          ) : null}
          <PillButton label="Create account" onPress={createAccount} />
        </View>
      </View>

      <SocialSignIn variant="sign-up" onPressGoogle={notAvailableYet} onPressApple={notAvailableYet} />

      <SwitchPrompt prompt="Already have an account?" action="Log in" onPress={() => router.replace('/log-in')} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 36,
  },
  fields: {
    gap: 12,
  },
  submit: {
    gap: 10,
  },
  consentText: {
    flex: 1,
  },
});
