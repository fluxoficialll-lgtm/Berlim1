
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { AuthError, UserProfile } from '../types';
import { db } from '@/database';
import { ImageCropModal } from '../components/ui/ImageCropModal';

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<UserProfile>({
      name: '',
      nickname: '',
      bio: '',
      website: '', 
      isPrivate: false,
      photoUrl: undefined,
      cpf: '',
      phone: ''
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  // Crop states
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [rawImage, setRawImage] = useState<string>('');

  useEffect(() => {
      const user = authService.getCurrentUser();
      if (!user) {
          navigate('/');
          return;
      }

      if (user.profile) {
          setFormData({
              name: user.profile.name || '',
              nickname: user.profile.nickname || '',
              bio: user.profile.bio || '',
              website: user.profile.website || '',
              isPrivate: user.profile.isPrivate || false,
              photoUrl: user.profile.photoUrl,
              cpf: user.profile.cpf || '',
              phone: user.profile.phone || ''
          });
          if (user.profile.photoUrl) {
              setImagePreview(user.profile.photoUrl);
          }
      }
      setFetching(false);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      
      if (name === 'name') {
          const cleanValue = value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
          setFormData(prev => ({ ...prev, [name]: cleanValue }));
          setUsernameError('');
      } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleTogglePrivacy = () => {
      setFormData(prev => ({ ...prev, isPrivate: !prev.isPrivate }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              setRawImage(ev.target?.result as string);
              setIsCropOpen(true);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleCroppedImage = (croppedBase64: string) => {
    setImagePreview(croppedBase64);
    fetch(croppedBase64)
      .then(res => res.blob())
      .then(blob => {
          const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setUsernameError('');

      if (!formData.name.trim()) {
          setUsernameError('Nome de usuário é obrigatório');
          return;
      }

      setLoading(true);
      const currentUser = authService.getCurrentUser();
      const email = currentUser?.email;

      try {
          if (email && currentUser) {
              let finalPhotoUrl = formData.photoUrl;

              if (selectedFile) {
                  finalPhotoUrl = await postService.uploadMedia(selectedFile, 'avatars');
              }

              const updatedProfile = { ...formData, photoUrl: finalPhotoUrl };

              await authService.completeProfile(email, updatedProfile);
              
              // Sincronização de metadados em posts
              const newHandle = `@${formData.name}`;
              const allPosts = db.posts.getAll();
              
              allPosts.forEach(post => {
                  let postChanged = false;
                  if (post.authorId === currentUser.id) {
                      if (post.username !== newHandle) {
                          post.username = newHandle;
                          postChanged = true;
                      }
                      if (finalPhotoUrl && post.avatar !== finalPhotoUrl) {
                          post.avatar = finalPhotoUrl;
                          postChanged = true;
                      }
                  }
                  if (postChanged) db.posts.update(post);
              });

              alert('Perfil atualizado com sucesso!');
              // Correção de Navegação: Usa replace para limpar o formulário do histórico
              navigate('/profile', { replace: true });
          }
      } catch (err: any) {
          if (err.message === AuthError.NAME_TAKEN) {
              setUsernameError('Este nome de usuário já está em uso.');
          } else {
              setError(err.message || 'Erro ao atualizar perfil.');
          }
      } finally {
          setLoading(false);
      }
  };

  const handleBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
      } else {
          navigate('/profile');
      }
  };

  if (fetching) return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-x-hidden">
      <style>{`
        header { display:flex; align-items:center; justify-content:space-between; padding:16px; background: #0c0f14; position:fixed; width:100%; top:0; z-index:10; border-bottom:1px solid rgba(255,255,255,0.1); height: 65px; }
        header .back-btn { background:none; border:none; color:#fff; font-size:24px; cursor:pointer; padding-right: 15px; }
        main { padding-top: 85px; padding-bottom: 40px; width: 100%; max-width: 600px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        .avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; }
        .avatar-wrapper { position: relative; width: 100px; height: 100px; border-radius: 50%; cursor: pointer; }
        .avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid #00c2ff; }
        .edit-icon { position: absolute; bottom: 0; right: 0; background: #00c2ff; color: #000; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #0c0f14; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 13px; color: #aaa; margin-bottom: 8px; }
        .input-group input, .input-group textarea { width: 100%; padding: 14px 15px; background: #1a1e26; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 16px; outline: none; }
        .save-btn { width: 100%; padding: 16px; background: #00c2ff; color: #000; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; }
      `}</style>
      <header>
        <button onClick={handleBack} className="back-btn"><i className="fa-solid fa-arrow-left"></i></button>
        <h1>Editar Perfil</h1>
        <div style={{width: '24px'}}></div>
      </header>
      <main>
        <div className="avatar-section">
            <div className="avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? <img src={imagePreview} className="avatar-img" /> : <div className="avatar-img bg-gray-700 flex items-center justify-center"><i className="fa-solid fa-user text-4xl"></i></div>}
                <div className="edit-icon"><i className="fa-solid fa-camera"></i></div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" hidden />
        </div>
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Apelido</label>
                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />
            </div>
            <div className="input-group">
                <label>Nome de Usuário (@)</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
            </div>
            <div className="input-group">
                <label>Biografia</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</button>
        </form>
      </main>
      <ImageCropModal isOpen={isCropOpen} imageSrc={rawImage} onClose={() => setIsCropOpen(false)} onSave={handleCroppedImage} />
    </div>
  );
};
