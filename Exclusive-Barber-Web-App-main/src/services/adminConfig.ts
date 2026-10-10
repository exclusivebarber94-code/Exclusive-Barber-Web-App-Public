import { supabase } from '../lib/supabase';

export async function getAdminPassword(): Promise<string> {
  const { data, error } = await supabase
    .from('admin_config')
    .select('value')
    .eq('key', 'admin_password')
    .single();
  if (error) return 'Admin2026';
  return data.value;
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  await supabase
    .from('admin_config')
    .update({ value: newPassword, updated_at: new Date().toISOString() })
    .eq('key', 'admin_password');
}

export async function getBannerConfig(): Promise<{ url: string; active: boolean }> {
  const { data } = await supabase
    .from('admin_config')
    .select('key, value')
    .in('key', ['banner_url', 'banner_active']);

  const url = data?.find((r: any) => r.key === 'banner_url')?.value ?? '';
  const active = data?.find((r: any) => r.key === 'banner_active')?.value === 'true';
  return { url, active };
}

export async function updateBannerConfig(url: string, active: boolean): Promise<void> {
  const now = new Date().toISOString();
  await supabase.from('admin_config').upsert([
    { key: 'banner_url', value: url, updated_at: now },
    { key: 'banner_active', value: String(active), updated_at: now },
  ], { onConflict: 'key' });
}

export async function uploadBannerImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `banner.${ext}`;
  const { error } = await supabase.storage
    .from('gallery')
    .upload(fileName, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('gallery').getPublicUrl(fileName);
  return `${data.publicUrl}?t=${Date.now()}`;
}