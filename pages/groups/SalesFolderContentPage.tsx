import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../../services/groupService';
import { postService } from '../../services/postService';
import { authService } from '../../services/authService';
import { Group, SalesFolder, Infoproduct } from '../../types';

// Subcomponentes
import { FolderContentHeader } from '../../features/groups/components/platform/FolderContentHeader';
import { InfoproductCard } from '../../features/groups/components/platform/InfoproductCard';
import { EmptyFolderState } from '../../features/groups/components/platform/EmptyFolderState';
import { InfoproductPreviewModal } from '../../features/groups/components/platform/InfoproductPreviewModal';
import { AddFileSophisticatedButton } from '../../features/groups/components/platform/AddFileSophisticatedButton';
import { UploadProgressCard } from '../../features/groups/components/platform/UploadProgressCard';

export const SalesFolderContentPage: React.FC = () => {
    const navigate = useNavigate();
    const { groupId, folderId } = useParams<{ groupId: string, folderId: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [folder, setFolder] = useState<SalesFolder | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Estados de Upload
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadCurrentItem, setUploadCurrentItem] = useState(0);
    const [uploadTotalItems, setUploadTotalItems] = useState(0);

    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (groupId && folderId) {
            const foundGroup = groupService.getGroupById(groupId);
            if (foundGroup) {
                setGroup(foundGroup);
                
                const currentUserId = authService.getCurrentUserId();
                const isOwner = foundGroup.creatorId === currentUserId;
                const isAdmin = foundGroup.adminIds?.includes(currentUserId || '') || false;
                setIsOwnerOrAdmin(isOwner || isAdmin);

                let foundFolder: SalesFolder | null = null;
                foundGroup.salesPlatformSections?.forEach(sec => {
                    const f = sec.folders.find(fold => fold.id === folderId);
                    if (f) foundFolder = f;
                });
                
                if (foundFolder && (!foundFolder.items || foundFolder.items.length === 0)) {
                    foundFolder.items = [];
                }
                setFolder(foundFolder);
            }
            setLoading(false);
        }
    }, [groupId, folderId]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !group || !folder) return;

        // Fix: Explicitly cast fileArray as File[] to avoid 'unknown' type errors when accessing properties like size or name
        const fileArray = Array.from(files) as File[];
        setIsUploading(true);
        setUploadTotalItems(fileArray.length);
        setUploadCurrentItem(0);
        setUploadProgress(0);

        const newItems: Infoproduct[] = [];

        for (let i = 0; i < fileArray.length; i++) {
            // Fix: Explicitly typing file as File
            const file: File = fileArray[i];
            setUploadCurrentItem(i + 1);
            setUploadProgress(Math.round(((i) / fileArray.length) * 100));

            try {
                // Fix: Properties size and name are now accessible as file is correctly typed
                const fileUrl = await postService.uploadMedia(file, 'infoproducts');
                const sizeStr = formatFileSize(file.size);
                const extension = file.name.split('.').pop()?.toLowerCase() || 'file';
                
                let type: 'image' | 'video' | 'file' = 'file';
                if (file.type.startsWith('image/')) type = 'image';
                else if (file.type.startsWith('video/')) type = 'video';

                const newItem: Infoproduct = {
                    id: `item_${Date.now()}_${i}`,
                    title: file.name.split('.')[0],
                    type: type,
                    fileType: extension as any,
                    url: fileUrl,
                    allowDownload: true, 
                    size: sizeStr
                };
                newItems.push(newItem);
                setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100));
            } catch (error) {
                console.error("Erro ao subir arquivo:", file.name, error);
            }
        }

        if (newItems.length > 0) {
            const updatedGroup = { ...group };
            updatedGroup.salesPlatformSections?.forEach(sec => {
                const f = sec.folders.find(fold => fold.id === folderId);
                if (f) {
                    f.items = [...(f.items || []), ...newItems];
                    f.itemsCount = f.items.length;
                    setFolder({ ...f });
                }
            });

            await groupService.updateGroup(updatedGroup);
            setGroup(updatedGroup);
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Pequeno delay para o usuário ver o 100%
        setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
        }, 1000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff]"></i>
            </div>
        );
    }

    const allowDownload = folder?.allowDownload ?? group?.salesPlatformAllowDownload ?? true;
    const allowMemberUpload = folder?.allowMemberUpload ?? group?.salesPlatformAllowMemberUpload ?? false;
    const canUpload = isOwnerOrAdmin || allowMemberUpload;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <FolderContentHeader 
                onBack={() => navigate(-1)} 
                folderName={folder?.name} 
            />

            <main className="flex-1 p-5 overflow-y-auto no-scrollbar pb-32">
                <div className="grid gap-3 max-w-[600px] mx-auto w-full">
                    {folder?.items && folder.items.length > 0 ? (
                        folder.items.map((item, index) => (
                            <InfoproductCard 
                                key={item.id} 
                                item={item} 
                                globalAllowDownload={allowDownload}
                                onPreview={() => setPreviewIndex(index)}
                            />
                        ))
                    ) : (
                        <EmptyFolderState />
                    )}
                </div>
            </main>

            {canUpload && (
                <>
                    <UploadProgressCard 
                        progress={uploadProgress}
                        current={uploadCurrentItem}
                        total={uploadTotalItems}
                        isVisible={isUploading}
                    />
                    
                    <AddFileSophisticatedButton 
                        onClick={() => fileInputRef.current?.click()}
                        isLoading={isUploading}
                    />
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        multiple
                        className="hidden" 
                    />
                </>
            )}

            <InfoproductPreviewModal 
                items={folder?.items || []}
                initialIndex={previewIndex}
                onClose={() => setPreviewIndex(null)}
            />

            <div className="text-center opacity-10 text-[8px] uppercase font-black tracking-[3px] mb-8">
                Flux Content Delivery v1.1
            </div>
        </div>
    );
};