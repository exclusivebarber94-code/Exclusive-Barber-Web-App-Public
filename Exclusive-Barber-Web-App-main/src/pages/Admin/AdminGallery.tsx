import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Loader2, ImagePlus } from 'lucide-react';
import { getGallery, uploadGalleryPhoto, deleteGalleryPhoto, updateGalleryCategory } from '../../services/gallery';
import type { GalleryItem } from '../../types';

const CATEGORIES = ['Cortes', 'Barba', 'Ambiente', 'Tratamientos'];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getGallery().then(setItems).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) { alert(`${file.name} supera 10MB.`); continue; }
        const newItem = await uploadGalleryPhoto(file);
        setItems((prev) => [...prev, newItem]);
      }
    } catch {
      alert('Error al subir la foto. Intenta de nuevo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm('¿Eliminar esta foto de la galería?')) return;
    setDeletingId(item.id);
    try {
      await deleteGalleryPhoto(item.id, item.url);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      alert('Error al eliminar. Intenta de nuevo.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCategory = async (id: string, category: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, category } : i));
    await updateGalleryCategory(id, category);
  };

  return (
    <div className="space-y-5">
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />

      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-sm">{items.length} fotos en la galería</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-gold px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 disabled:opacity-60"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
          {uploading ? 'Subiendo...' : 'Subir Fotos'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-gold" />
        </div>
      ) : items.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="glass border-2 border-dashed border-white/15 rounded-2xl p-16 text-center cursor-pointer hover:border-gold/40 transition-colors"
        >
          <Upload size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Haz clic para subir fotos a la galería</p>
          <p className="text-zinc-600 text-xs mt-1">JPG, PNG, WEBP — máx 10MB por foto</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square">
              <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <select
                  value={item.category}
                  onChange={(e) => handleCategory(item.id, e.target.value)}
                  className="w-full text-xs px-2 py-1 rounded-lg bg-dark border border-white/20 text-white focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white text-xs transition-colors disabled:opacity-50"
                >
                  {deletingId === item.id
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Trash2 size={12} />}
                  Eliminar
                </button>
              </div>
              <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-black/60 text-zinc-300">
                {item.category}
              </span>
            </div>
          ))}

          {/* Botón agregar más */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center cursor-pointer hover:border-gold/40 transition-colors"
          >
            <ImagePlus size={24} className="text-zinc-600 mb-2" />
            <span className="text-zinc-600 text-xs">Agregar foto</span>
          </div>
        </div>
      )}
    </div>
  );
}