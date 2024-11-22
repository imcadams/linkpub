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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
        <LinkList
          links={links}
          onDelete={deleteLink}
          onEdit={(id) => setEditingLink(id)}
          onReorder={reorderLinks}
        />
      </div>
    </div>
  );
}
