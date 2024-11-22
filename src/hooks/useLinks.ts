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
      const response = await fetch('/api/links', {
        credentials: 'include'
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch links');
      }
      const data = await response.json();
      setLinks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching links:', err);
      setError(err instanceof Error ? err.message : 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (title: string, url: string) => {
    try {
      console.log('Adding link:', { title, url }); // Debug log
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title, url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add link');
      }

      await fetchLinks(); // Refresh the links list
      return true;
    } catch (err) {
      console.error('Error adding link:', err); // Debug log
      throw err;
    }
  };

  const updateLink = async (id: number, title: string, url: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update link');
      }

      await fetchLinks();
    } catch (err) {
      console.error('Error updating link:', err);
      throw err;
    }
  };

  const deleteLink = async (id: number) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete link');
      }

      await fetchLinks();
    } catch (err) {
      console.error('Error deleting link:', err);
      throw err;
    }
  };

  const reorderLinks = async (linkIds: number[]) => {
    try {
      const response = await fetch('/api/links/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkIds }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reorder links');
      }

      await fetchLinks();
    } catch (err) {
      console.error('Error reordering links:', err);
      throw err;
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
