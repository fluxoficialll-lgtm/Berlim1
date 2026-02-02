import { useState, useEffect } from 'react';
import { Group } from '../../../../types';

export const useGroupIdentity = (group: Group | null) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (group) {
      setGroupName(group.name || '');
      setDescription(group.description || '');
      setCoverImage(group.coverImage);
    }
  }, [group]);

  return {
    state: { groupName, description, coverImage },
    actions: { setGroupName, setDescription, setCoverImage },
    getIdentityPayload: () => ({ name: groupName, description, coverImage })
  };
};