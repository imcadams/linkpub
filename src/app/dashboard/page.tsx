'use client';

import { useState } from 'react';
import LinkEditor from '@/components/dashboard/LinkEditor';
import LinkList from '@/components/dashboard/LinkList';
import { useLinks } from '@/hooks/useLinks';

export default function Dashboard() {
  const {
    links,
    loading,
    error,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
  } = useLinks();

  const [editingLink, setEditingLink] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Your Links</h1>
      
      <div className="mb-8">
        <LinkEditor
          onSubmit={addLink}
          isEditing={false}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Links</h2>
        
        {error ? (
          <div className="text-red-600 p-4 bg-red-50 rounded">
            Error: {error}
          </div>
        ) : links.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            You haven't added any links yet. Add your first link above!
          </div>
        ) : (
          <LinkList
            links={links}
            onDelete={deleteLink}
            onEdit={(id) => setEditingLink(id)}
            onReorder={reorderLinks}
          />
        )}
      </div>
    </div>
  );
}
