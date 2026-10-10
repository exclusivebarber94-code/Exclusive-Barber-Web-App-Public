import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Product[];
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const id = `p-${Date.now()}`;
  const { data, error } = await supabase
    .from('products')
    .insert({ ...product, id })
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const { error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `product-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('products')
    .upload(fileName, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('products').getPublicUrl(fileName);
  return data.publicUrl;
}