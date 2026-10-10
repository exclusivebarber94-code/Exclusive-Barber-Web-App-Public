import { supabase } from '../lib/supabase';
import type { GalleryItem } from '../types';

export async function getGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as GalleryItem[];
}

export async function uploadGalleryPhoto(file: File): Promise<GalleryItem> {
  const ext = file.name.split('.').pop();
  const fileName = `gallery-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(fileName, file, { upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('gallery').getPublicUrl(fileName);
  const url = data.publicUrl;

  const id = `g-${Date.now()}`;
  const { data: inserted, error } = await supabase
    .from('gallery')
    .insert({ id, url, category: 'Cortes', alt: 'Trabajo Exclusive Barber' })
    .select()
    .single();
  if (error) throw error;
  return inserted as GalleryItem;
}

export async function deleteGalleryPhoto(id: string, url: string): Promise<void> {
  const fileName = url.split('/').pop();
  if (fileName) {
    await supabase.storage.from('gallery').remove([fileName]);
  }
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw error;
}

export async function updateGalleryCategory(id: string, category: string): Promise<void> {
  const { error } = await supabase.from('gallery').update({ category }).eq('id', id);
  if (error) throw error;
}