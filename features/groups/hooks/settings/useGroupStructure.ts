import { useState, useEffect } from 'react';
import { Group, Channel, SalesSection, GroupLink, ChannelSection } from '../../../../types';

export const useGroupStructure = (group: Group | null) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  // Add: Support for channel sections used in ChannelsEditor
  const [channelSections, setChannelSections] = useState<ChannelSection[]>([]);
  // Rename: isPlatform to isSalesPlatformEnabled for UI consistency
  const [isSalesPlatformEnabled, setIsSalesPlatformEnabled] = useState(false);
  // Rename: sections to salesPlatformSections for UI consistency
  const [salesPlatformSections, setSalesPlatformSections] = useState<SalesSection[]>([]);
  // Add: Missing platform permissions
  const [salesPlatformAllowDownload, setSalesPlatformAllowDownload] = useState(true);
  const [salesPlatformAllowMemberUpload, setSalesPlatformAllowMemberUpload] = useState(false);
  // Add: Group links state missing from form object
  const [links, setLinks] = useState<GroupLink[]>([]);

  useEffect(() => {
    if (group) {
      setChannels(group.channels || []);
      setChannelSections(group.channelSections || []);
      setIsSalesPlatformEnabled(group.isSalesPlatformEnabled || false);
      setSalesPlatformSections(group.salesPlatformSections || []);
      setSalesPlatformAllowDownload(group.salesPlatformAllowDownload ?? true);
      setSalesPlatformAllowMemberUpload(group.salesPlatformAllowMemberUpload ?? false);
      setLinks(group.links || []);
    }
  }, [group]);

  return {
    // Return: Synced field names to fix "Property does not exist on type form" errors
    state: { 
      channels, 
      channelSections,
      isSalesPlatformEnabled, 
      salesPlatformSections,
      salesPlatformAllowDownload,
      salesPlatformAllowMemberUpload,
      links 
    },
    actions: { 
      setChannels, 
      setChannelSections,
      setIsSalesPlatformEnabled, 
      setSalesPlatformSections,
      setSalesPlatformAllowDownload,
      setSalesPlatformAllowMemberUpload,
      setLinks
    },
    getStructurePayload: () => ({
      channels,
      channelSections,
      isSalesPlatformEnabled,
      salesPlatformSections,
      salesPlatformAllowDownload,
      salesPlatformAllowMemberUpload,
      links
    })
  };
};