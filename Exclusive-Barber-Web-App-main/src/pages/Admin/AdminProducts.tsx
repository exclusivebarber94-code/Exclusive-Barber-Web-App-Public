import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Package, ImagePlus } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../../services/products';
import { formatCOP } from '../../data';
import type { Product } from '../../types';

interface ProductForm {
  name: string;
  brand: string;
  price: string;
  description: string;
  category: string;
  image: string;
}

const emptyForm: ProductForm = { name: '', brand: '', price: '', description: '', category: 'Styling', image: '' };
const CATEGORIES = ['Styling', 'Barba', 'Cuidado', 'Tratamientos', 'Accesorios'];

export default function AdminProducts() {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProducts().then(setList).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditTarget(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({ name: p.name, brand: p.brand, price: String(p.price), description: p.description, category: p.category, image: p.image });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('La imagen no puede superar 10MB.'); return; }
    setUploadingImg(true);
    try {
      const url = await uploadProductImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch {
      alert('Error al subir la imagen.');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setList((prev) => prev.filter((p) => p.id !== id));
    } catch { alert('Error al eliminar.'); }
    finally { setDeletingId(null); }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) { alert('Nombre y precio son requeridos.'); return; }
    setSaving(true);
    try {
      const data = { name: form.name, brand: form.brand, price: Number(form.price), description: form.description, category: form.category, image: form.image };
      if (editTarget) {
        await updateProduct(editTarget.id, data);
        setList((prev) => prev.map((p) => p.id === editTarget.id ? { ...p, ...data } : p));
      } else {
        const newP = await createProduct(data);
        setList((prev) => [...prev, newP]);
      }
      setShowModal(false);
    } catch { alert('Error al guardar.'); }
    finally { setSaving(false); }
  };

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-gold/50 transition-colors';

  return (
    <div className="space-y-5">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-sm">{list.length} productos</p>
        <button onClick={openAdd} className="btn-gold px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5">
          <Plus size={15} /> Agregar Producto
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-gold" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {list.map((product) => (
            <div key={product.id} className="glass rounded-2xl overflow-hidden border border-white/8 group">
              <div className="relative h-48 overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <Package size={40} className="text-zinc-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full glass border border-white/20 text-zinc-300">{product.category}</span>
              </div>
              <div className="p-5">
                <p className="text-zinc-500 text-xs mb-1">{product.brand}</p>
                <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-zinc-500 text-xs mb-4 leading-relaxed line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold gold-text">{formatCOP(product.price)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(product)} className="p-2 glass border border-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(product.id, product.name)} disabled={deletingId === product.id} className="p-2 glass border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-40">
                      {deletingId === product.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center">
                  <Package size={15} className="text-gold" />
                </div>
                <h2 className="font-semibold text-white">{editTarget ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg glass border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"><X size={14} /></button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
              {/* Imagen */}
              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">Imagen del producto</label>
                <div className="flex gap-3 items-center">
                  {form.image ? (
                    <img src={form.image} alt="preview" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Package size={20} className="text-zinc-600" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImg}
                    className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-zinc-400 hover:text-white text-sm transition-colors disabled:opacity-50"
                  >
                    {uploadingImg ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                    {uploadingImg ? 'Subiendo...' : 'Subir imagen'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">Nombre</label>
                <input className={inputClass} placeholder="Ej: Cera Nishman Gold" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">Marca</label>
                <input className={inputClass} placeholder="Ej: Nishman" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">Precio (COP)</label>
                <input className={inputClass} type="number" placeholder="Ej: 35000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">Categoría</label>
                <select className={inputClass + ' bg-transparent cursor-pointer'} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c} className="bg-dark">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1.5 block">Descripción</label>
                <textarea className={inputClass + ' resize-none'} rows={3} placeholder="Describe el producto..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/8 flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 glass border border-white/10 rounded-xl text-zinc-400 hover:text-white text-sm transition-all">Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editTarget ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}