import React, {useState} from 'react';
import {ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import {uploadBarbershopLogo, updateBarbershop} from '@/api/modules/owner';
import {useAlertModal} from '@/components/AlertModal';
import {Screen} from '@/components/Screen';
import {useAuth} from '@/providers/AuthProvider';
import {tokens} from '@/theme';

export function OwnerBarbershopScreen() {
  const {user, refreshUser} = useAuth();
  const showAlert = useAlertModal();
  const [isEditing, setIsEditing] = useState(false);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [pendingLogoUri, setPendingLogoUri] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savingBarbershop, setSavingBarbershop] = useState(false);
  const [showLogoPreview, setShowLogoPreview] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.barbershop?.name || '',
    description: user?.barbershop?.description || '',
    address: user?.barbershop?.address || '',
    phone: user?.barbershop?.phone || '',
    openingTime: user?.barbershop?.opening_time || '09:00',
    closingTime: user?.barbershop?.closing_time || '19:00',
    acceptsOnlineBooking: user?.barbershop?.accepts_online_booking ?? true,
    acceptsWalkIn: user?.barbershop?.accepts_walk_in ?? true,
  });

  const handleSave = async () => {
    setSavingBarbershop(true);
    try {
      await updateBarbershop({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        opening_time: formData.openingTime,
        closing_time: formData.closingTime,
        accepts_online_booking: formData.acceptsOnlineBooking,
        accepts_walk_in: formData.acceptsWalkIn,
      });

      // Atualizar os dados do usuário no contexto
      await refreshUser();

      showAlert({
        title: 'Sucesso',
        message: 'Dados da barbearia atualizados com sucesso!',
        type: 'success',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating barbershop:', error);
      showAlert({
        title: 'Erro',
        message: 'Não foi possível atualizar os dados da barbearia.',
        type: 'error',
      });
    } finally {
      setSavingBarbershop(false);
    }
  };

  const handleChangeLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      showAlert({
        title: 'Permissao necessaria',
        message: 'Autorize o acesso as fotos para atualizar a logo.',
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
    setPendingLogoUri(uri);
    setShowLogoPreview(true);
  };

  const confirmLogoUpload = async () => {
    if (!pendingLogoUri) return;

    setUploadingLogo(true);
    try {
      const response = await uploadBarbershopLogo(pendingLogoUri);
      const uploadedUrl = response?.data?.logo_url || pendingLogoUri;
      setLogoUri(uploadedUrl);
      setShowLogoPreview(false);
      setPendingLogoUri(null);
      showAlert({
        title: 'Logo atualizada',
        message: 'A logo foi enviada com sucesso.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error uploading barbershop logo:', error);
      showAlert({
        title: 'Erro ao enviar',
        message: 'Nao foi possivel atualizar a logo agora.',
        type: 'error',
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {logoUri ? (
              <Image source={{uri: logoUri}} style={styles.logoImage} />
            ) : user?.barbershop?.logo ? (
              <Image source={{uri: user.barbershop.logo}} style={styles.logoImage} />
            ) : (
              <Ionicons name="storefront" size={50} color={tokens.color.brand.primary} />
            )}
          </View>
          <Pressable
            style={styles.changeLogoButton}
            onPress={handleChangeLogo}
            disabled={uploadingLogo}>
            {uploadingLogo ? (
              <ActivityIndicator size="small" color={tokens.color.brand.primary} />
            ) : (
              <Ionicons name="camera" size={18} color={tokens.color.brand.primary} />
            )}
            <Text style={styles.changeLogoText}>
              {uploadingLogo ? 'Enviando...' : 'Alterar logo'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da barbearia</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.name}
              onChangeText={text => setFormData({...formData, name: text})}
              editable={isEditing}
              placeholder="Nome da barbearia"
              placeholderTextColor={tokens.text.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline, !isEditing && styles.inputDisabled]}
              value={formData.description}
              onChangeText={text => setFormData({...formData, description: text})}
              editable={isEditing}
              placeholder="Descreva sua barbearia"
              placeholderTextColor={tokens.text.secondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.address}
              onChangeText={text => setFormData({...formData, address: text})}
              editable={isEditing}
              placeholder="Endereço completo"
              placeholderTextColor={tokens.text.secondary}
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

          <View style={styles.row}>
            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>Abertura</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.openingTime}
                onChangeText={text => setFormData({...formData, openingTime: text})}
                editable={isEditing}
                placeholder="09:00"
                placeholderTextColor={tokens.text.secondary}
              />
            </View>
            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>Fechamento</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.closingTime}
                onChangeText={text => setFormData({...formData, closingTime: text})}
                editable={isEditing}
                placeholder="19:00"
                placeholderTextColor={tokens.text.secondary}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações de agendamento</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="calendar-outline" size={24} color={tokens.text.primary} />
                <View style={styles.switchText}>
                  <Text style={styles.switchLabel}>Agendamento online</Text>
                  <Text style={styles.switchDescription}>
                    Permite que clientes agendem pelo app
                  </Text>
                </View>
              </View>
              <Switch
                value={formData.acceptsOnlineBooking}
                onValueChange={value =>
                  setFormData({...formData, acceptsOnlineBooking: value})
                }
                disabled={!isEditing}
                trackColor={{
                  false: tokens.text.secondary,
                  true: tokens.color.brand.primary,
                }}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="person-outline" size={24} color={tokens.text.primary} />
                <View style={styles.switchText}>
                  <Text style={styles.switchLabel}>Aceita clientes sem hora marcada</Text>
                  <Text style={styles.switchDescription}>
                    Permite agendamento para clientes sem horário previo
                  </Text>
                </View>
              </View>
              <Switch
                value={formData.acceptsWalkIn}
                onValueChange={value => setFormData({...formData, acceptsWalkIn: value})}
                disabled={!isEditing}
                trackColor={{
                  false: tokens.text.secondary,
                  true: tokens.color.brand.primary,
                }}
              />
            </View>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.buttonGroup}>
            <Pressable
              disabled={savingBarbershop}>
              <Text style={styles.buttonSecondaryText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonPrimary, savingBarbershop && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={savingBarbershop}>
              {savingBarbershop ? (
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
            <Text style={styles.buttonPrimaryText}>Editar informações</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Modal de prévia da logo */}
      <Modal visible={showLogoPreview} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Confirmar logo</Text>
            {pendingLogoUri && (
              <Image source={{uri: pendingLogoUri}} style={styles.previewImage} />
            )}
            <View style={styles.previewButtonGroup}>
              <Pressable
                style={[styles.previewButton, styles.previewButtonCancel]}
                onPress={() => {
                  setShowLogoPreview(false);
                  setPendingLogoUri(null);
                }}>
                <Text style={styles.previewButtonCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.previewButton, styles.previewButtonConfirm]}
                onPress={confirmLogoUpload}
                disabled={uploadingLogo}>
                {uploadingLogo ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.previewButtonConfirmText}>Confirmar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>   </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.md,
    gap: tokens.spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: tokens.spacing.sm,
    paddingVertical: tokens.spacing.md,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: tokens.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: tokens.color.brand.primary,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  changeLogoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
  },
  changeLogoText: {
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
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  section: {
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: tokens.typography.size.sm,
    fontWeight: '700',
    color: tokens.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.surface.elevated,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    flex: 1,
  },
  switchText: {
    flex: 1,
  },
  switchLabel: {
    fontSize: tokens.typography.size.md,
    fontWeight: '600',
    color: tokens.text.primary,
  },
  switchDescription: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    marginTop: 2,
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
  buttonSecondaryText: {
    color: tokens.text.primary,
    fontWeight: '700',
    fontSize: tokens.typography.size.md,
  },
  buttonDisabled: {
    opacity: 0.7,
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
});
