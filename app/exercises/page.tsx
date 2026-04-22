'use client';
import { useState, useMemo } from 'react';
import { exercises } from '@/lib/exercises';
import { useAuth } from '@/lib/auth-context';
import { Search, Filter, Heart, Play, X, ChevronDown, Flame, Clock, Dumbbell } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const equipmentList = ['All', 'Barbell', 'Dumbbells', 'Cable Machine', 'Machine', 'Pull-up Bar', 'Dip Bar', 'None'];

export default function ExercisesPage() {
  const { user, userData, updateUserData } = useAuth();
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [equipment, setEquipment] = useState('All');
  const [selected, setSelected] = useState<typeof exercises[0] | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return exercises.filter(ex => {
      const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(search.toLowerCase());
      const matchMuscle = muscle === 'All' || ex.muscleGroup === muscle;
      const matchDiff = difficulty === 'All' || ex.difficulty === difficulty;
      const matchEq = equipment === 'All' || ex.equipment === equipment;
      return matchSearch && matchMuscle && matchDiff && matchEq;
    });
  }, [search, muscle, difficulty, equipment]);

  const isFavorite = (id: string) => userData?.favorites?.includes(id) || false;

  const toggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return toast.error('Login to save exercises');
    const ref = doc(db, 'users', user.uid);
    if (isFavorite(id)) {
      await updateDoc(ref, { favorites: arrayRemove(id) });
      updateUserData({ favorites: (userData?.favorites || []).filter(f => f !== id) });
      toast.success('Removed from saved');
    } else {
      await updateDoc(ref, { favorites: arrayUnion(id) });
      updateUserData({ favorites: [...(userData?.favorites || []), id] });
      toast.success('Saved! ❤️');
    }
  };

  const diffColor = (d: string) => {
    if (d === 'Beginner') return 'badge-beginner';
    if (d === 'Intermediate') return 'badge-intermediate';
    return 'badge-advanced';
  };

  return (
    <div className="min-h-screen pt-16 bg-gym-black">
      {/* Header */}
      <div className="border-b border-gym-border bg-gym-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            Exercise <span className="text-neon-green">Library</span>
          </h1>
          <p className="text-gray-500">Master every movement with HD video guidance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exercises..."
              className="w-full bg-gym-card border border-gym-border rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/40"
            />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gym-border bg-gym-card hover:border-gray-600 transition-all text-sm text-gray-300"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Dropdowns */}
        {filtersOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 bg-gym-card rounded-xl border border-gym-border">
            {[
              { label: 'Muscle Group', value: muscle, set: setMuscle, options: muscleGroups },
              { label: 'Difficulty', value: difficulty, set: setDifficulty, options: difficulties },
              { label: 'Equipment', value: equipment, set: setEquipment, options: equipmentList },
            ].map(filter => (
              <div key={filter.label}>
                <label className="block text-xs text-gray-500 mb-1.5">{filter.label}</label>
                <select
                  value={filter.value}
                  onChange={e => filter.set(e.target.value)}
                  className="w-full bg-gym-dark border border-gym-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-green/40"
                >
                  {filter.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Muscle Group Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {muscleGroups.map(g => (
            <button
              key={g}
              onClick={() => setMuscle(g)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                muscle === g
                  ? 'bg-neon-green text-black'
                  : 'bg-gym-card border border-gym-border text-gray-400 hover:border-gray-500'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-6">{filtered.length} exercises found</p>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(ex => (
            <div
              key={ex.id}
              onClick={() => setSelected(ex)}
              className="neon-card rounded-2xl overflow-hidden cursor-pointer group hover:border-neon-green/30 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden">
                <img
                  src={ex.thumbnail}
                  alt={ex.name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x176/1A1A1A/39FF14?text=GymBuddy'; }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-neon-green flex items-center justify-center">
                    <Play className="w-5 h-5 text-black fill-black" />
                  </div>
                </div>
                {/* Favorite button */}
                <button
                  onClick={e => toggleFavorite(ex.id, e)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                    isFavorite(ex.id)
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'bg-black/50 text-gray-400 hover:text-pink-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(ex.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm leading-tight">{ex.name}</h3>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded font-medium ${diffColor(ex.difficulty)}`}>
                    {ex.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ex.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{ex.muscleGroup}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ex.duration}</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{ex.calories} cal</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Dumbbell className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No exercises found</p>
            <button onClick={() => { setSearch(''); setMuscle('All'); setDifficulty('All'); setEquipment('All'); }}
              className="text-neon-green text-sm hover:underline mt-2">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Exercise Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="bg-gym-dark border border-gym-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>

            {/* Close button */}
            <div className="flex items-center justify-between p-5 border-b border-gym-border">
              <div>
                <h2 className="text-xl font-black">{selected.name}</h2>
                <p className="text-sm text-gray-500">{selected.nameUrdu}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {/* Video */}
              <div className="video-wrapper mb-6">
                <iframe
                  src={`https://www.youtube.com/embed/${selected.youtubeId}?rel=0&modestbranding=1`}
                  title={selected.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Sets', value: selected.sets },
                  { label: 'Reps', value: selected.reps },
                  { label: 'Duration', value: selected.duration },
                  { label: 'Calories', value: `${selected.calories}` },
                ].map(s => (
                  <div key={s.label} className="bg-gym-card rounded-xl p-3 text-center">
                    <div className="text-neon-green font-bold text-sm">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${diffColor(selected.difficulty)}`}>{selected.difficulty}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-gym-card border border-gym-border text-gray-300">{selected.muscleGroup}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-gym-card border border-gym-border text-gray-300">{selected.equipment}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-gym-card border border-gym-border text-gray-300">{selected.bodyPart}</span>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{selected.description}</p>

              {/* Instructions */}
              <h3 className="font-bold mb-3">Instructions</h3>
              <div className="space-y-3">
                {selected.instructions.map((inst, i) => (
                  <div key={i} className="flex gap-3 bg-gym-card rounded-xl p-3">
                    <span className="w-6 h-6 rounded-full bg-neon-green/20 text-neon-green text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-300">{inst}</p>
                  </div>
                ))}
              </div>

              {/* Urdu description */}
              <div className="mt-6 p-4 bg-gym-card rounded-xl border border-gym-border" dir="rtl">
                <p className="text-xs text-gray-500 mb-1 text-right">اردو</p>
                <p className="text-sm text-gray-300 text-right leading-relaxed">{selected.descriptionUrdu}</p>
              </div>

              {/* Save button */}
              <button
                onClick={e => toggleFavorite(selected.id, e)}
                className={`mt-5 w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isFavorite(selected.id)
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                    : 'border border-gym-border hover:bg-white/5 text-gray-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite(selected.id) ? 'fill-current' : ''}`} />
                {isFavorite(selected.id) ? 'Saved to Favorites' : 'Save Exercise'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
