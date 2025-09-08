// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { api } from '../api'
import { useNavigate } from 'react-router-dom';

export default function SearchBar(){
  useEffect(()=>{
    function openSearch(){
      const el = document.querySelector('#search-input');
      el && el.focus();
    }
    document.addEventListener('open-search', openSearch);
    return ()=>document.removeEventListener('open-search', openSearch);
  },[]);

  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const nav = useNavigate();

  async function doSearch(e){
    e && e.preventDefault();
    if(!q.trim()) { setResults([]); return; }
    try{
      const r = await api.get(`/tasks/search/find?query=${encodeURIComponent(q)}`);
      setResults(r.data);
    }catch(e){console.error(e)}
  }

  return (
    <div className="relative">
      <form onSubmit={doSearch} className="flex">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tasks..." className="p-2 border rounded-l" />
        <button className="px-3 py-2 border rounded-r">Search</button>
      </form>
      {results.length > 0 && (
        <div className="absolute bg-white border mt-1 w-full max-h-60 overflow-auto z-50">
          {results.map(t => (
            <div key={t._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={()=>nav(`/tasks/${t._id}`)}>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-gray-500">{t.description?.slice(0,80)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
