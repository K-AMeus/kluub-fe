import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './authentication/AuthContext';
import Footer from './shared/Footer';

interface EventItem {
    id: string;
    name: string;
}

interface LikedEventsResponse {
    events: EventItem[];
    currentPage: number;
    totalPages: number;
}

function getColorFromString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.abs(hash % 360);
    return `hsl(${color}, 70%, 50%)`;
}

function getInitials(email?: string | null): string {
    return email ? email.charAt(0).toUpperCase() : '';
}

const Profile: FC = () => {
    const { user } = useAuth();
    const [likedEvents, setLikedEvents] = useState<EventItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchLikedEvents = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                const idToken = await user.getIdToken();
                const response = await axios.get<LikedEventsResponse>(
                    'https://partynbackend-production.up.railway.app/events/liked?page=0&size=20',
                    { headers: { Authorization: `Bearer ${idToken}` } }
                );

                if (response.data && response.data.events) {
                    setLikedEvents(response.data.events);
                    setCurrentPage(response.data.currentPage || 0);
                    setTotalPages(response.data.totalPages || 0);
                } else {
                    setLikedEvents([]);
                    setError('Unexpected response format from server.');
                }
            } catch (err) {
                console.error('Error fetching liked events:', err);
                setError('Failed to fetch liked events. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLikedEvents();
    }, [user]);

    const handlePageChange = async (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;

        setIsLoading(true);
        try {
            const idToken = user ? await user.getIdToken() : '';
            const response = await axios.get<LikedEventsResponse>(
                `https://partynbackend-production.up.railway.app/events/liked?page=${newPage}&size=20`,
                { headers: { Authorization: `Bearer ${idToken}` } }
            );

            if (response.data && response.data.events) {
                setLikedEvents(response.data.events);
                setCurrentPage(response.data.currentPage || 0);
                setTotalPages(response.data.totalPages || 0);
            } else {
                setLikedEvents([]);
                setError('Unexpected response format from server.');
            }
        } catch (err) {
            console.error('Error fetching liked events:', err);
            setError('Failed to fetch liked events. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <p className="text-white">Please log in.</p>;
    }

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center sm:py-12 z-10">
            <div className="area">
                <ul className="circles">
                </ul>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center text-white">
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-24 w-24 rounded-full mb-4"
                    />
                ) : (
                    <div
                        className="h-24 w-24 rounded-full flex items-center justify-center text-white text-3xl mb-4"
                        style={{ backgroundColor: getColorFromString(user.email || '') }}
                    >
                        {getInitials(user.email)}
                    </div>
                )}
                <h2 className="text-2xl font-semibold">{user.displayName || user.email}</h2>
                <h3 className="mt-4">Liked Events</h3>
                {isLoading ? (
                    <p className="mt-2">Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : likedEvents.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                        {likedEvents.map((event) => (
                            <li key={event.id} className="bg-gray-800 p-2 rounded">
                                {event.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4">No liked events</p>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex space-x-2 mt-4">
                        {currentPage > 0 && (
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-3 py-1 bg-gray-700 rounded"
                            >
                                Previous
                            </button>
                        )}
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === index ? 'bg-blue-500' : 'bg-gray-700'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        {currentPage < totalPages - 1 && (
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-3 py-1 bg-gray-700 rounded"
                            >
                                Next
                            </button>
                        )}
                    </div>
                )}
                <p className="text-gray-400 mt-4">{user.email}</p>
            </div>

            <div className="absolute bottom-0 left-0 w-full z-50">
                <Footer />
            </div>
        </div>
    );
};

export default Profile;
