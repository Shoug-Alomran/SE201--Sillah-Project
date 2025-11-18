import React, { useState } from 'react';
import { BookOpen, Search, Clock, CheckCircle, Star } from 'lucide-react';

// Mock Data
const mockContent = [
  {
    id: 1,
    title: 'Understanding Sickle Cell Disease',
    summary: 'Learn about the genetic causes, symptoms, and management of sickle cell disease in families.',
    category: 'Sickle Cell Disease',
    reading_time: 8,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Genetic Screening: What You Need to Know',
    summary: 'Comprehensive guide to genetic screening tests, their importance, and what to expect during the process.',
    category: 'Genetic Screening',
    reading_time: 6,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Heart Health and Hereditary Conditions',
    summary: 'Explore how genetic factors influence cardiovascular health and preventive measures for your family.',
    category: 'Heart Health',
    reading_time: 7,
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=800&h=400&fit=crop'
  },
  {
    id: 4,
    title: 'Prevention Strategies for Genetic Diseases',
    summary: 'Evidence-based strategies to reduce risk and promote health in families with genetic predispositions.',
    category: 'Prevention',
    reading_time: 5,
    is_featured: false,
    image_url: null
  },
  {
    id: 5,
    title: 'Family Planning and Genetic Counseling',
    summary: 'Important considerations for family planning when genetic conditions are present in your family history.',
    category: 'Family Planning',
    reading_time: 10,
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop'
  },
  {
    id: 6,
    title: 'Early Detection Saves Lives',
    summary: 'The critical role of early screening and detection in managing hereditary health conditions.',
    category: 'Prevention',
    reading_time: 4,
    is_featured: false,
    image_url: null
  }
];

export default function AwarenessHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['Sickle Cell Disease', 'Genetic Screening', 'Heart Health', 'Prevention', 'Family Planning'];

  const filteredContent = mockContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredContent = mockContent.filter(c => c.is_featured);

  const getCategoryColor = (category) => {
    const colors = {
      'Sickle Cell Disease': 'bg-red-100 text-red-800 border-red-200',
      'Genetic Screening': 'bg-purple-100 text-purple-800 border-purple-200',
      'Heart Health': 'bg-pink-100 text-pink-800 border-pink-200',
      'Prevention': 'bg-green-100 text-green-800 border-green-200',
      'Family Planning': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="awareness-hub-page">
      <div className="awareness-hub-container">
        {/* Header */}
        <div className="awareness-hub-header">
          <h1 className="awareness-hub-title">
            <BookOpen className="title-icon" />
            Awareness Hub
          </h1>
          <p className="awareness-hub-subtitle">Learn about hereditary health and prevention</p>
        </div>

        {/* Preventive Checklist */}
        <div className="preventive-checklist-card">
          <h2 className="checklist-title">Your Preventive Health Checklist</h2>
          <div className="checklist-items">
            <div className="checklist-item completed">
              <CheckCircle className="checklist-icon" />
              <span>Add family members to your health tree</span>
            </div>
            <div className="checklist-item">
              <div className="checklist-checkbox"></div>
              <span>Schedule your first screening appointment</span>
            </div>
            <div className="checklist-item">
              <div className="checklist-checkbox"></div>
              <span>Read one educational article</span>
            </div>
            <div className="checklist-item">
              <div className="checklist-checkbox"></div>
              <span>Share with family members</span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="search-filter-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Topics
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Content */}
        {featuredContent.length > 0 && selectedCategory === 'all' && !searchTerm && (
          <div className="featured-section">
            <h2 className="section-title">
              <Star className="star-icon" />
              Featured Articles
            </h2>
            <div className="featured-grid">
              {featuredContent.map(item => (
                <div key={item.id} className="featured-card">
                  {item.image_url && (
                    <div className="card-image">
                      <img src={item.image_url} alt={item.title} />
                    </div>
                  )}
                  <div className="card-header">
                    <div className="card-header-content">
                      <h3 className="card-title">{item.title}</h3>
                      <span className={`category-badge ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-summary">{item.summary}</p>
                    <div className="card-footer">
                      {item.reading_time && (
                        <div className="reading-time">
                          <Clock className="clock-icon" />
                          <span>{item.reading_time} min read</span>
                        </div>
                      )}
                      <button className="read-more-btn-outline">Read More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Content */}
        {filteredContent.length > 0 ? (
          <div className="all-content-section">
            <h2 className="section-title">
              {selectedCategory === 'all' ? 'All Articles' : selectedCategory}
            </h2>
            <div className="content-grid">
              {filteredContent.map((item) => (
                <div key={item.id} className="content-card">
                  {item.image_url && (
                    <div className="card-image-small">
                      <img src={item.image_url} alt={item.title} />
                    </div>
                  )}
                  <div className="card-content">
                    <span className={`category-badge ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <h3 className="card-title-small">{item.title}</h3>
                    <p className="card-summary-small">{item.summary}</p>
                  </div>
                  <div className="card-footer-compact">
                    {item.reading_time && (
                      <div className="reading-time-small">
                        <Clock className="clock-icon-small" />
                        <span>{item.reading_time} min</span>
                      </div>
                    )}
                    <button className="read-more-btn-text">Read More →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <BookOpen className="empty-icon" />
            <h3 className="empty-title">No Content Found</h3>
            <p className="empty-text">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Educational content will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}