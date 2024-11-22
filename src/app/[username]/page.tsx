'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface ProfileData {
  profile: {
    username: string;
    accentColor: string;
    avatarPath: string | null;
  };
  links: {
    id: number;
    title: string;
    url: string;
    clicks: number;
  }[];
}

export default function PublicProfile() {
  const params = useParams();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${params.username}`);
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Profile not found' : 'Failed to load profile');
        }
        const profileData = await response.json();
        setData(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.username]);

  const handleLinkClick = async (linkId: number) => {
    try {
      await fetch(`/api/links/${linkId}/click`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { profile, links } = data;
  const buttonStyle = {
    backgroundColor: profile.accentColor || '#000000',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          <div className="mb-4 relative mx-auto">
            {profile.avatarPath ? (
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
                <Image
                  src={profile.avatarPath}
                  alt={profile.username}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            ) : (
              <div 
                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto"
                style={{ backgroundColor: profile.accentColor + '40' }}
              >
                <span className="text-2xl font-bold" style={{ color: profile.accentColor }}>
                  {profile.username[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">@{profile.username}</h1>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id)}
              className="block w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{
                borderColor: profile.accentColor,
                borderWidth: '2px',
              }}
            >
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900">{link.title}</h2>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          Powered by LinkPub
        </div>
      </div>
    </div>
  );
}
