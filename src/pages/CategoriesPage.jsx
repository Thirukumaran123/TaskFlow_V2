import React, { useState } from 'react';
import { FolderKanban, Plus, Tag, Check, CheckCircle2 } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';

export default function CategoriesPage() {
  const { tasks, categories, addCategory, openCreateModal } = useTasks();

  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      id: newCatName.trim(),
      name: newCatName.trim(),
      color: newCatColor
    });

    setNewCatName('');
  };

  const getCategoryStats = (catName) => {
    const catTasks = tasks.filter(t => (t.category || 'Other') === catName);
    const completed = catTasks.filter(t => t.status === 'completed').length;
    const total = catTasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { catTasks, completed, total, percent };
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title">
            <FolderKanban size={26} color="var(--accent-color)" />
            <span>Categories</span>
          </div>
          <span className="page-subtitle">
            Organize tasks by context, domain, and workstreams
          </span>
        </div>

        <button onClick={() => openCreateModal()} className="btn btn-primary">
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {categories.map(cat => {
          const { completed, total, percent } = getCategoryStats(cat.name);
          const isSelected = selectedCategory === cat.name;

          return (
            <div
              key={cat.id}
              className="card"
              onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
              style={{
                cursor: 'pointer',
                padding: '1.2rem',
                border: isSelected ? `2px solid ${cat.color || 'var(--accent-color)'}` : '1px solid var(--border-color)',
                backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: cat.color || '#6366f1'
                    }}
                  />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {cat.name}
                  </h4>
                </div>
                <span className="badge-count">{total} tasks</span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden', margin: '0.5rem 0' }}>
                <div
                  style={{
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: cat.color || '#6366f1',
                    borderRadius: '3px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{completed} completed</span>
                <span>{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Category Box */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
          Create New Category
        </h4>
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category name (e.g. Finance, Fitness, Startup)..."
            className="form-control"
            style={{ maxWidth: '300px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Color:</span>
            <input
              type="color"
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
              style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            <Plus size={15} />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Tasks in selected category or all categories */}
      {selectedCategory && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Tasks in "{selectedCategory}"
            </h3>
            <button
              onClick={() => openCreateModal({ category: selectedCategory })}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} />
              <span>Add to {selectedCategory}</span>
            </button>
          </div>

          {getCategoryStats(selectedCategory).catTasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No tasks found in this category.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {getCategoryStats(selectedCategory).catTasks.map(t => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
