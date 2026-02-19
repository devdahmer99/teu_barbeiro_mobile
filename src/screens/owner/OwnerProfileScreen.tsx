import React, {useState} from 'react';
import {ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import {uploadProfilePhoto, updateProfile} from '@/api/modules/client';
import {useAlertModal} from '@/components/AlertModal';
import {Screen} from '@/components/Screen';
import {useAuth} from '@/providers/AuthProvider';
import {tokens} from '@/theme';

export function OwnerProfileScreen() {
  const {user, refreshUser} = useAuth();
  const showAlert = useAlertModal();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [pendingAvatarUri, setPendingAvatarUri] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || user?.phone_number || '',
    address: user?.address || '',
  });

  const handleSave = async () => {
    setSavingProfile(true);
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      // Atualizar os dados do usuário no contexto
      await refreshUser();

      showAlert({
        title: 'Sucesso',
        message: 'Perfil atualizado com sucesso!',
        type: 'success',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert({
        title: 'Erro',
        message: 'Não foi possível atualizar seu perfil.',
        type: 'error',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangeAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      showAlert({
        title: 'Permissao necessaria',
        message: 'Autorize o acesso as fotos para atualizar o perfil.',
        type: 'warning',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]?.uri) {
      return;
    }

    const uri = result.assets[0].uri;
    setPendingAvatarUri(uri);
    setShowAvatarPreview(true);
  };

  const confirmAvatarUpload = async () => {
    if (!pendingAvatarUri) return;

    setUploadingAvatar(true);
    try {
      const response = await uploadProfilePhoto(pendingAvatarUri);
      const uploadedUrl = response?.data?.avatar_url || pendingAvatarUri;
      setAvatarUri(uploadedUrl);
      setShowAvatarPreview(false);
      setPendingAvatarUri(null);
      showAlert({
        title: 'Foto atualizada',
        message: 'Sua foto de perfil foi enviada com sucesso.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      showAlert({
        title: 'Erro ao enviar',
        message: 'Nao foi possivel atualizar sua foto agora.',
        type: 'error',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarLarge}>
            {avatarUri ? (
              <Image source={{uri: avatarUri}} style={styles.avatarImage} />
            ) : user?.avatar ? (
              <Image source={{uri: user.avatar}} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={60} color={tokens.text.primary} />
            )}
          </View>
          <Pressable
            style={styles.changeAvatarButton}
            onPress={handleChangeAvatar}
            disabled={uploadingAvatar}>
            {uploadingAvatar ? (
              <ActivityIndicator size="small" color={tokens.color.brand.primary} />
            ) : (
              <Ionicons name="camera" size={20} color={tokens.color.brand.primary} />
            )}
            <Text style={styles.changeAvatarText}>
              {uploadingAvatar ? 'Enviando...' : 'Alterar foto'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.name}
              onChangeText={text => setFormData({...formData, name: text})}
              editable={isEditing}
              placeholder="Digite seu nome"
              placeholderTextColor={tokens.text.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.email}
              onChangeText={text => setFormData({...formData, email: text})}
              editable={isEditing}
              placeholder="Digite seu e-mail"
              placeholderTextColor={tokens.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.phone}
              onChangeText={text => setFormData({...formData, phone: text})}
              editable={isEditing}
              placeholder="(00) 00000-0000"
              placeholderTextColor={tokens.text.secondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.address}
              onChangeText={text => setFormData({...formData, address: text})}
              editable={isEditing}
              placeholder="Digite seu endereço"
              placeholderTextColor={tokens.text.secondary}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {isEditing ? (
          <View style={styles.buttonGroup}>
            <Pressable
              disabled={savingProfile}>
              <Text style={styles.buttonSecondaryText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonPrimary, savingProfile && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={savingProfile}>
              {savingProfile ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonPrimaryText}>Salvar</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => setIsEditing(true)}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.buttonPrimaryText}>Editar perfil</Text>
          </Pressable>
        )}

      </ScrollView>

      {/* Modal de prévia da foto */}
      <Modal visible={showAvatarPreview} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Confirmar foto</Text>
            {pendingAvatarUri && (
              <Image source={{uri: pendingAvatarUri}} style={styles.previewImage} />
            )}
            <View style={styles.previewButtonGroup}>
              <Pressable
                style={[styles.previewButton, styles.previewButtonCancel]}
                onPress={() => {
                  setShowAvatarPreview(false);
                  setPendingAvatarUri(null);
                }}>
                <Text style={styles.previewButtonCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.previewButton, styles.previewButtonConfirm]}
                onPress={confirmAvatarUpload}
                disabled={uploadingAvatar}>
                {uploadingAvatar ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.previewButtonConfirmText}>Confirmar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.md,
    gap: tokens.spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    gap: tokens.spacing.md,
    paddingVertical: tokens.spacing.lg,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: tokens.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: tokens.color.brand.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  changeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.surface.elevated,
  },
  changeAvatarText: {
    color: tokens.color.brand.primary,
    fontWeight: '600',
    fontSize: tokens.typography.size.sm,
  },
  form: {
    gap: tokens.spacing.md,
  },
  inputGroup: {
    gap: tokens.spacing.xs,
  },
  label: {
    fontSize: tokens.typography.size.sm,
    fontWeight: '600',
    color: tokens.text.primary,
  },
  input: {
    backgroundColor: tokens.surface.elevated,
    borderWidth: 1,
    borderColor: tokens.border.default,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    fontSize: tokens.typography.size.md,
    color: tokens.text.primary,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.xs,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: tokens.color.brand.primary,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: tokens.typography.size.md,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: tokens.surface.elevated,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonSecondaryText: {
    color: tokens.text.primary,
    fontWeight: '700',
    fontSize: tokens.typography.size.md,
  },
  dangerZone: {
    marginTop: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  dangerTitle: {
    fontSize: tokens.typography.size.sm,
    fontWeight: '700',
    color: tokens.color.state.error,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.state.error,
  },
  dangerButtonText: {
    color: tokens.color.state.error,
    fontWeight: '600',
    fontSize: tokens.typography.size.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.md,
  },
  previewContainer: {
    backgroundColor: tokens.surface.base,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  previewTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: tokens.radius.md,
  },
  previewButtonGroup: {
    width: '100%',
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  previewButton: {
    flex: 1,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewButtonCancel: {
    backgroundColor: tokens.surface.elevated,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  previewButtonCancelText: {
    color: tokens.text.primary,
    fontWeight: '700',
    fontSize: tokens.typography.size.md,
  },
  previewButtonConfirm: {
    backgroundColor: tokens.color.brand.primary,
  },
  previewButtonConfirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: tokens.typography.size.md,
  },
