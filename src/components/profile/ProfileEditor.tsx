'use client';

import { useState, useRef } from 'react';
import { useProfile } from '@/hooks/useProfile';
import Image from 'next/image';

const ACCENT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
];

export default function ProfileEditor() {
  const { profile, loading, error, updateProfile } = useProfile();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleColorSelect = async (color: string) => {
    setSelectedColor(color);
    const formData = new FormData();
    formData.append('accentColor', color);
    
    try {
      setUpdating(true);
      await updateProfile(formData);
    } catch (err) {
      setUpdateError('Failed to update color');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUpdating(true);
      await updateProfile(formData);
    } catch (err) {
      setUpdateError('Failed to update avatar');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      {/* Avatar Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24">
            {profile?.avatarPath ? (
              <Image
                src={profile.avatarPath}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-2xl">
                  {profile?.username?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={updating}
          >
            Change Picture
          </button>
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Accent Color</h3>
        <div className="grid grid-cols-8 gap-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 ${
                color === profile?.accentColor
                  ? 'border-black'
                  : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <p className="mt-1 text-gray-900">{profile?.username}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1 text-gray-900">{profile?.email}</p>
        </div>
      </div>

      {updateError && (
        <p className="mt-4 text-red-600">{updateError}</p>
      )}
    </div>
  );
}
