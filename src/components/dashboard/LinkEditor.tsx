'use client';

import { useState } from 'react';

interface LinkEditorProps {
  onSubmit: (title: string, url: string) => Promise<void>;
  initialTitle?: string;
  initialUrl?: string;
  isEditing?: boolean;
}

export default function LinkEditor({
  onSubmit,
  initialTitle = '',
  initialUrl = '',
  isEditing = false,
}: LinkEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Basic validation
      if (!title.trim() || !url.trim()) {
        setError('Title and URL are required');
        return;
      }

      // Basic URL validation
      try {
        new URL(url);
      } catch {
        setError('Please enter a valid URL');
        return;
      }

      await onSubmit(title, url);
      if (!isEditing) {
        setTitle('');
        setUrl('');
      }
    } catch (err) {
      setError('Failed to save link');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter link title"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://example.com"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isEditing ? 'Save Changes' : 'Add Link'}
      </button>
    </form>
  );
}
