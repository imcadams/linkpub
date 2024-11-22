import { useState, useEffect } from 'react';

interface Link {
  id: number;
  title: string;
  url: string;
  position: number;
  clicks: number;
}

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (title: string, url: string) => {
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url }),
      });
      if (!response.ok) throw new Error('Failed to add link');
      await fetchLinks();
    } catch (err) {
      setError('Failed to add link');
    }
  };

  const updateLink = async (id: number, title: string, url: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url }),
      });
      if (!response.ok) throw new Error('Failed to update link');
      await fetchLinks();
    } catch (err) {
      setError('Failed to update link');
    }
  };

  const deleteLink = async (id: number) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete link');
      await fetchLinks();
    } catch (err) {
      setError('Failed to delete link');
    }
  };

  const reorderLinks = async (linkIds: number[]) => {
    try {
      const response = await fetch('/api/links/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds }),
      });
      if (!response.ok) throw new Error('Failed to reorder links');
      await fetchLinks();
    } catch (err) {
      setError('Failed to reorder links');
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return {
    links,
    loading,
    error,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
  };
}
