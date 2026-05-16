'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/app/components/layout/Navbar';
import { Footer } from '@/src/app/components/layout/Footer';
import { GameCard } from '@/src/app/components/ui/GameCard';
import { Button } from '@/src/app/components/ui/Button';
import { ArrowLeft, User, Calendar, Loader2 } from 'lucide-react';
import { createLucideIcon } from 'lucide-react';
import { basketball } from '@lucide/lab';
import { CreateListPopup } from '../../components/ui/ListUI/CreateListPopup';
import { Game, Team } from '@/src/app/types/index'

const BasketballIcon = createLucideIcon('Basketball', basketball);

type ApiList = {
  id: string;
  title: string;
  description?: string;
  is_public: boolean;
  type: string;
  user_id: string;
  created_at: string;
  games: Game[];

  profiles?: {
    id: string;
    username?: string;
    display_name?: string;
  };
};

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;

  const [list, setList] = useState<ApiList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGames, setEditingGames] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    isPublic: true,
  });

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch('/api/users/me');
      if (!res.ok) return;

      const data = await res.json();

      setUserId(data?.id ?? null);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!listId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/lists/${listId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'List not found');
        }
        const data: ApiList = await res.json();
        setList(data);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [listId]);
    const deleteList = async () => {
      try {
        setIsDeleting(true);

        const res = await fetch(`/api/lists/${listId}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete list');

        router.push('/list');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsDeleting(false);
      }
    };
    
    const openEdit = () => {
      if (!list) return;

      setEditForm({
        title: list.title,
        description: list.description || '',
        isPublic: list.is_public,
      });

      setEditingGames(list.games.map(g => g.id));
      setIsEditing(true);
    };
  const updateList = async () => {
    try {
      setIsSaving(true);

      const res = await fetch(`/api/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          is_public: editForm.isPublic,
        }),
      });
      const created: ApiList = await res.json();

      if (editingGames.length > 0) {
        await Promise.all(
          editingGames.map((gameId) =>
            fetch(`/api/lists/${created.id}/games`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ game_id: gameId }),
            }),
          ),
        );
      }
      if (!res.ok) throw new Error('Failed to update list');

      const refreshed = await fetch(`/api/lists/${listId}`);
      const data = await refreshed.json();
      
      setList(data);
      setIsEditing(false);
      setEditingGames([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-bronze animate-spin" />
          <span className="text-white text-xl">Loading…</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {error || 'List not found'}
          </h1>
          <Button onClick={() => router.push('/list')}>Back to Lists</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = !!userId && !!list && userId === list.user_id;
  console.log(userId, list.user_id)
  const games = list.games ?? [];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pb-16">
        {/* Back button */}
        <div className="container-custom mt-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-bronze transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lists
          </button>
        </div>

        {/* List header */}
        <div className="relative overflow-hidden bg-linear-to-r from-amethyst via-plum to-magenta py-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-bronze rounded-full blur-[120px]" />
          </div>

          <div className="container-custom relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <BasketballIcon className="w-8 h-8 text-bronze" />
                  <span className="text-sm text-white/60">Community List</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {list.title}
                </h1>
                {list.description && (
                  <p className="text-white/80 text-lg mb-6">{list.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-bronze" />
                  {list.profiles?.display_name ?? list.profiles?.username ?? 'Community list'}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-bronze" />
                    {new Date(list.created_at).toLocaleDateString()}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs">
                    {games.length} game{games.length !== 1 ? 's' : ''}
                  </span>
                  {!list.is_public && (
                    <span className="px-3 py-1 rounded-full bg-bronze/20 text-bronze text-xs">
                      Private
                    </span>
                  )}
                </div>
                  {isOwner && (
                  <div className="flex gap-3 mt-4">
                    <Button variant="primary" onClick={openEdit}>
                      Edit List
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeleting}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Games grid */}
        <div className="container-custom mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Games in this list
          </h2>

          {games.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <BasketballIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No games yet
              </h3>
              <p className="text-gray-400">
                This list doesn't have any games added yet.
              </p>
            </div>
          )}
        </div>
      </main>
{isEditing && (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
    <div className="bg-[#1a1a2e] p-6 rounded-xl w-full max-w-md border border-white/10">
      
      <h2 className="text-xl text-white mb-4">Edit List</h2>

      <input
        className="w-full p-2 mb-3 rounded bg-white/5 text-white"
        value={editForm.title}
        onChange={(e) =>
          setEditForm({ ...editForm, title: e.target.value })
        }
        placeholder="Title"
      />

      <textarea
        className="w-full p-2 mb-3 rounded bg-white/5 text-white"
        value={editForm.description}
        onChange={(e) =>
          setEditForm({ ...editForm, description: e.target.value })
        }
        placeholder="Description"
      />

      <CreateListPopup
        isOpen={isEditing}
        mode="update"
        onClose={() => setIsEditing(false)}
        newPlaylist={{
          title: editForm.title,
          description: editForm.description,
          isPublic: editForm.isPublic,
        }}
        setNewPlaylist={setEditForm}
        selectedGames={editingGames}
        setSelectedGames={setEditingGames}
        onCreate={updateList}
        isCreating={isSaving}
        createError={error}
      />
      <div className="flex gap-2">
        <Button onClick={updateList} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        <Button variant="ghost" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}
    {showDeleteConfirm && (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
        <div className="bg-[#1a1a2e] p-6 rounded-xl w-full max-w-md border border-white/10">
          
          <h2 className="text-xl text-white mb-2">
            Are you sure?
          </h2>

          <p className="text-gray-400 mb-6">
            This action will permanently delete this list. You can’t undo it.
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={async () => {
                setShowDeleteConfirm(false);
                await deleteList();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </div>
        </div>
      </div>
    )}
      <Footer />
    </div>
  );
}