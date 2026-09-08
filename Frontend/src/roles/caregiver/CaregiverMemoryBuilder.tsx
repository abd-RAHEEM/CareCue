import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Package,
  Music,
  ShieldAlert,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Briefcase,
  Heart
} from 'lucide-react';
import { useStore } from '../../store/store';
import type { MemoryPerson, MemoryPlace, MemoryObject, MemorySong, PhotoAlbumEntry } from '../../types';

export const CaregiverMemoryBuilder: React.FC = () => {
  const session = useStore(s => s.session);
  const patients = useStore(s => s.patients);
  const updateMemoryGraph = useStore(s => s.updateMemoryGraph);

  const patientId = session.patientId || Object.keys(patients)[0];
  const patient = patients[patientId];

  const [activeTab, setActiveTab] = useState<'people' | 'places' | 'objects' | 'songs' | 'avoid' | 'photos'>('people');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New item draft states
  const [newPerson, setNewPerson] = useState({ name: '', relation: '', description: '' });
  const [newPlace, setNewPlace] = useState({ name: '', description: '' });
  const [newObject, setNewObject] = useState({ name: '', usualLocation: '' });
  const [newSong, setNewSong] = useState({ title: '', artist: '', language: 'Assamese' });
  const [newAvoidTopic, setNewAvoidTopic] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800">No Patient Selected</h2>
      </div>
    );
  }

  const memoryGraph = patient.memoryGraph;

  const triggerSaveNotification = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Add handlers
  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.name.trim()) return;

    const person: MemoryPerson = {
      id: `p-${Date.now()}`,
      name: newPerson.name.trim(),
      relation: newPerson.relation.trim(),
      description: newPerson.description.trim()
    };

    updateMemoryGraph(patient.id, {
      people: [...memoryGraph.people, person]
    });
    setNewPerson({ name: '', relation: '', description: '' });
    triggerSaveNotification();
  };

  const handleRemovePerson = (id: string) => {
    updateMemoryGraph(patient.id, {
      people: memoryGraph.people.filter(p => p.id !== id)
    });
    triggerSaveNotification();
  };

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlace.name.trim()) return;

    const place: MemoryPlace = {
      id: `pl-${Date.now()}`,
      name: newPlace.name.trim(),
      description: newPlace.description.trim()
    };

    updateMemoryGraph(patient.id, {
      places: [...memoryGraph.places, place]
    });
    setNewPlace({ name: '', description: '' });
    triggerSaveNotification();
  };

  const handleRemovePlace = (id: string) => {
    updateMemoryGraph(patient.id, {
      places: memoryGraph.places.filter(p => p.id !== id)
    });
    triggerSaveNotification();
  };

  const handleAddObject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObject.name.trim()) return;

    const obj: MemoryObject = {
      id: `obj-${Date.now()}`,
      name: newObject.name.trim(),
      usualLocation: newObject.usualLocation.trim()
    };

    updateMemoryGraph(patient.id, {
      objects: [...memoryGraph.objects, obj]
    });
    setNewObject({ name: '', usualLocation: '' });
    triggerSaveNotification();
  };

  const handleRemoveObject = (id: string) => {
    updateMemoryGraph(patient.id, {
      objects: memoryGraph.objects.filter(o => o.id !== id)
    });
    triggerSaveNotification();
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.title.trim()) return;

    const song: MemorySong = {
      id: `s-${Date.now()}`,
      title: newSong.title.trim(),
      artist: newSong.artist.trim(),
      language: newSong.language.trim()
    };

    updateMemoryGraph(patient.id, {
      songs: [...memoryGraph.songs, song]
    });
    setNewSong({ title: '', artist: '', language: 'Assamese' });
    triggerSaveNotification();
  };

  const handleRemoveSong = (id: string) => {
    updateMemoryGraph(patient.id, {
      songs: memoryGraph.songs.filter(s => s.id !== id)
    });
    triggerSaveNotification();
  };

  const handleAddAvoidTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAvoidTopic.trim()) return;

    updateMemoryGraph(patient.id, {
      topicsToAvoid: [...memoryGraph.topicsToAvoid, newAvoidTopic.trim()]
    });
    setNewAvoidTopic('');
    triggerSaveNotification();
  };

  const handleRemoveAvoidTopic = (topic: string) => {
    updateMemoryGraph(patient.id, {
      topicsToAvoid: memoryGraph.topicsToAvoid.filter(t => t !== topic)
    });
    triggerSaveNotification();
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoCaption.trim()) return;

    const photo: PhotoAlbumEntry = {
      id: `photo-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80',
      caption: newPhotoCaption.trim(),
      peopleIds: memoryGraph.people.slice(0, 2).map(p => p.id),
      date: new Date().toISOString().split('T')[0]
    };

    updateMemoryGraph(patient.id, {
      photoAlbum: [...memoryGraph.photoAlbum, photo]
    });
    setNewPhotoCaption('');
    triggerSaveNotification();
  };

  const handleRemovePhoto = (id: string) => {
    updateMemoryGraph(patient.id, {
      photoAlbum: memoryGraph.photoAlbum.filter(p => p.id !== id)
    });
    triggerSaveNotification();
  };

  const tabs = [
    { id: 'people', label: 'People & Family', icon: Users, count: memoryGraph.people.length },
    { id: 'places', label: 'Places', icon: MapPin, count: memoryGraph.places.length },
    { id: 'objects', label: 'Everyday Objects', icon: Package, count: memoryGraph.objects.length },
    { id: 'songs', label: 'Favorite Songs', icon: Music, count: memoryGraph.songs.length },
    { id: 'photos', label: 'Photo Album', icon: ImageIcon, count: memoryGraph.photoAlbum.length },
    { id: 'avoid', label: 'Topics to Avoid', icon: ShieldAlert, count: memoryGraph.topicsToAvoid.length }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Personal Memory Graph</h1>
          <p className="text-gray-500 text-sm mt-1">
            Build and curate personal anchors for {patient.name}. Used for games, voice cues, and chat engine responses.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-sm font-semibold border border-emerald-200 animate-fade-in">
            <CheckCircle size={16} /> Saved to Memory Graph
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Item List */}
        <div className="lg:col-span-2 space-y-4">
          {/* People */}
          {activeTab === 'people' && (
            <div className="space-y-3">
              {memoryGraph.people.map(person => (
                <div key={person.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-lg flex items-center justify-center shrink-0">
                      {person.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-base">{person.name}</h3>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-lg font-semibold">
                          {person.relation}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{person.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePerson(person.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Remove Person"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Places */}
          {activeTab === 'places' && (
            <div className="space-y-3">
              {memoryGraph.places.map(place => (
                <div key={place.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{place.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{place.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePlace(place.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Remove Place"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Objects */}
          {activeTab === 'objects' && (
            <div className="space-y-3">
              {memoryGraph.objects.map(obj => (
                <div key={obj.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Package size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{obj.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        <span className="font-medium text-gray-700">Location:</span> {obj.usualLocation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveObject(obj.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Remove Object"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Songs */}
          {activeTab === 'songs' && (
            <div className="space-y-3">
              {memoryGraph.songs.map(song => (
                <div key={song.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Music size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{song.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {song.artist && `Artist: ${song.artist} • `}
                        {song.language && `Language: ${song.language}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSong(song.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Remove Song"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Photo Album */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {memoryGraph.photoAlbum.map(photo => (
                <div key={photo.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                  <div className="h-36 rounded-xl bg-gray-100 overflow-hidden relative group">
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{photo.caption}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{photo.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Topics to Avoid */}
          {activeTab === 'avoid' && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
                <ShieldAlert size={20} className="text-rose-600" />
                Sensitive Topics Guardrail
              </div>
              <p className="text-xs text-rose-800">
                CareCue's assistant and activity prompts will strictly avoid mentioning or asking about these subjects to prevent disorientation or emotional distress.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {memoryGraph.topicsToAvoid.map(topic => (
                  <span
                    key={topic}
                    className="bg-white text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                  >
                    {topic}
                    <button
                      onClick={() => handleRemoveAvoidTopic(topic)}
                      className="text-rose-400 hover:text-rose-700 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Add New Form */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Add to Memory Graph</h2>
          <p className="text-xs text-gray-500 mb-4">
            {activeTab === 'people' && 'Add a family member, caregiver, or friend.'}
            {activeTab === 'places' && 'Add a memorable hometown, village, or residence.'}
            {activeTab === 'objects' && 'Record everyday items to aid daily search cues.'}
            {activeTab === 'songs' && 'Add calming and familiar music or hymns.'}
            {activeTab === 'photos' && 'Upload/link a photograph for memory albums.'}
            {activeTab === 'avoid' && 'Add topics that induce stress or anxiety.'}
          </p>

          {/* Add Person Form */}
          {activeTab === 'people' && (
            <form onSubmit={handleAddPerson} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minoti Saikia"
                  value={newPerson.name}
                  onChange={e => setNewPerson({ ...newPerson, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Relationship</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eldest Daughter"
                  value={newPerson.relation}
                  onChange={e => setNewPerson({ ...newPerson, relation: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Key Memory / Clue</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Lives in Guwahati, brings pitha on Bihu"
                  value={newPerson.description}
                  onChange={e => setNewPerson({ ...newPerson, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <Plus size={16} /> Add Person
              </button>
            </form>
          )}

          {/* Add Place Form */}
          {activeTab === 'places' && (
            <form onSubmit={handleAddPlace} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Place Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jorhat Family Tea Estate"
                  value={newPlace.name}
                  onChange={e => setNewPlace({ ...newPlace, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Significance / Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Lived here between 1970 and 1995"
                  value={newPlace.description}
                  onChange={e => setNewPlace({ ...newPlace, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-600/20"
              >
                <Plus size={16} /> Add Place
              </button>
            </form>
          )}

          {/* Add Object Form */}
          {activeTab === 'objects' && (
            <form onSubmit={handleAddObject} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Object Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gold Rimmed Reading Glasses"
                  value={newObject.name}
                  onChange={e => setNewObject({ ...newObject, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Usual Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Teak nightstand beside bed"
                  value={newObject.usualLocation}
                  onChange={e => setNewObject({ ...newObject, usualLocation: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-600/20"
              >
                <Plus size={16} /> Add Object
              </button>
            </form>
          )}

          {/* Add Song Form */}
          {activeTab === 'songs' && (
            <form onSubmit={handleAddSong} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Song Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manuhe Manuhor Babe"
                  value={newSong.title}
                  onChange={e => setNewSong({ ...newSong, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Artist / Composer</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Bhupen Hazarika"
                  value={newSong.artist}
                  onChange={e => setNewSong({ ...newSong, artist: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Language</label>
                <input
                  type="text"
                  value={newSong.language}
                  onChange={e => setNewSong({ ...newSong, language: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-600/20"
              >
                <Plus size={16} /> Add Song
              </button>
            </form>
          )}

          {/* Add Photo Form */}
          {activeTab === 'photos' && (
            <form onSubmit={handleAddPhoto} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Photo Caption</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celebrating Bihu with grand-daughter"
                  value={newPhotoCaption}
                  onChange={e => setNewPhotoCaption(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="p-3 border border-dashed rounded-xl bg-gray-50 text-center text-xs text-gray-500">
                Mock photo placeholder linked
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <Plus size={16} /> Add Photo
              </button>
            </form>
          )}

          {/* Add Avoid Topic Form */}
          {activeTab === 'avoid' && (
            <form onSubmit={handleAddAvoidTopic} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Sensitive Topic / Trigger</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1980 floods, hospital stays"
                  value={newAvoidTopic}
                  onChange={e => setNewAvoidTopic(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-600/20"
              >
                <Plus size={16} /> Add Guardrail Topic
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
