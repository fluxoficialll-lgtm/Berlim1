import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import { Post, User } from '../types';
import { FeedSearchHeader } from '../components/feed/search/FeedSearchHeader';
import { FeedSearchFilters } from '../components/feed/search/FeedSearchFilters';
import { FeedSearchResults } from '../components/feed/search/FeedSearchResults';

export type FeedSearchFilter = 'relevant' | 'recent';
export type SearchTab = 'posts' | 'users';

export const FeedSearch: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<SearchTab>('posts');
    const [filter, setFilter] = useState<FeedSearchFilter>('relevant');
    
    const [postResults, setPostResults] = useState<Post[]>([]);
    const [userResults, setUserResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    
    const currentUser = authService.getCurrentUser();

    const handleSearch = useCallback(async (query: string, tab: SearchTab) => {
        if (!query.trim()) {
            setPostResults([]);
            setUserResults([]);
            return;
        }
        
        setLoading(true);
        try {
            if (tab === 'posts') {
                const data = await postService.searchPosts(query);
                setPostResults(data);
            } else {
                const data = await authService.searchUsers(query);
                setUserResults(data);
            }
        } catch (e) {
            console.error("Search error", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => handleSearch(searchTerm, activeTab), 400);
        return () => clearTimeout(timeout);
    }, [searchTerm, activeTab, handleSearch]);

    const sortedPosts = useMemo(() => {
        const list = [...postResults];
        if (filter === 'recent') {
            return list.sort((a, b) => b.timestamp - a.timestamp);
        }
        return list.sort((a, b) => {
            const scoreA = (a.likes || 0) + (a.comments || 0) * 2 + (a.views || 0) / 10;
            const scoreB = (b.likes || 0) + (b.comments || 0) * 2 + (b.views || 0) / 10;
            return scoreB - scoreA;
        });
    }, [postResults, filter]);

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/feed');
        }
    };

    return (
        <div className="h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <FeedSearchHeader 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onBack={handleBack}
                loading={loading}
            />
            
            <FeedSearchFilters 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeFilter={filter}
                onFilterChange={setFilter}
                show={searchTerm.trim().length > 0}
            />

            <main className="flex-1 overflow-y-auto no-scrollbar">
                <FeedSearchResults 
                    activeTab={activeTab}
                    postResults={sortedPosts}
                    userResults={userResults}
                    loading={loading}
                    searchTerm={searchTerm}
                    currentUser={currentUser}
                />
            </main>
        </div>
    );
};