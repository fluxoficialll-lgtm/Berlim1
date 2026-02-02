
import React from 'react';
import { Group, Channel } from '../../../../types';
import { ChannelSectionTitle } from './ChannelSectionTitle';
import { ChannelItem } from './ChannelItem';
import { EmptyChannelsState } from './EmptyChannelsState';

interface ChannelListRendererProps {
    group: Group;
    isAdmin: boolean;
    onChannelClick: (id: string) => void;
}

export const ChannelListRenderer: React.FC<ChannelListRendererProps> = ({ group, isAdmin, onChannelClick }) => {
    const getChannelObj = (cid: string): Channel | undefined => {
        if (cid === 'general') return { id: 'general', name: 'Geral', onlyAdminsPost: false, type: 'text' };
        return (group.channels || []).find(c => c.id === cid);
    };

    const hasSections = group.channelSections && group.channelSections.length > 0;

    if (hasSections) {
        return (
            <div className="space-y-4">
                {group.channelSections!.map(section => (
                    <div key={section.id} className="animate-fade-in">
                        <ChannelSectionTitle title={section.title} />
                        <div className="space-y-3">
                            {(section.channelIds || []).map(cid => {
                                const c = getChannelObj(cid);
                                if (!c) return null;
                                return (
                                    <ChannelItem 
                                        key={c.id}
                                        id={c.id}
                                        groupId={group.id}
                                        name={c.name}
                                        icon="fa-hashtag"
                                        isPrivate={c.onlyAdminsPost}
                                        onClick={() => onChannelClick(c.id)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <ChannelSectionTitle title="Discussões" />
            <div className="space-y-3">
                <ChannelItem 
                    id="general" 
                    groupId={group.id} 
                    name="Geral" 
                    icon="fa-hashtag" 
                    onClick={() => onChannelClick('general')} 
                />
                {(group.channels || []).map(c => (
                    <ChannelItem 
                        key={c.id}
                        id={c.id}
                        groupId={group.id}
                        name={c.name}
                        icon="fa-hashtag"
                        isPrivate={c.onlyAdminsPost}
                        onClick={() => onChannelClick(c.id)}
                    />
                ))}
                
                {(!group.channels || group.channels.length === 0) && !isAdmin && (
                    <EmptyChannelsState />
                )}
            </div>
        </div>
    );
};
