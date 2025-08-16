import React, { useState, useEffect, useContext } from 'react';
import { FaStar, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import UseAxios from '../../Hooks/UseAxios';
import UseAuth from '../../Hooks/UseAuth';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../Theme/ThemeProvider';

const ReviewSection = () => {
  const { user } = UseAuth();
  const axiosSecure = UseAxios();
  const { theme } = useContext(ThemeContext);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ title: '', content: '', rating: 5 });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const [fetching, setFetching] = useState(true); // spinner state

  const placeholderAvatar = 'https://i.pravatar.cc/100?img=10';
  const COLLAPSE_COUNT = 6;

  // fetch reviews
  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      try {
        setFetching(true);
        const res = await axiosSecure.get('/reviews');
        if (mounted) setReviews(res.data || []);
      } catch (err) {
        console.error('fetch reviews error', err);
      } finally {
        if (mounted) setFetching(false);
      }
    };
    fetchReviews();
    return () => { mounted = false; };
  }, [axiosSecure]);

  const total = reviews.length;
  const avgRating = total ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / total).toFixed(1) : '0.0';

  const sorted = [...reviews].sort((a, b) => {
    if (a._id && b._id) {
      try { return b._id.toString().localeCompare(a._id.toString()); } catch { }
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleAddReview = async () => {
    if (!newReview.title?.trim() || !newReview.content?.trim()) {
      return Swal.fire({ icon: 'warning', title: 'Oops!', text: 'Title and review content are required.' });
    }
    if (newReview.content.length > 500) {
      return Swal.fire({ icon: 'warning', title: 'Too long', text: 'Review must be 500 characters or less.' });
    }

    const payload = {
      title: newReview.title.trim(),
      content: newReview.content.trim(),
      rating: newReview.rating || 5,
      name: user?.displayName || 'Anonymous',
      photo: user?.photoURL,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    try {
      setLoading(true);
      const res = await axiosSecure.post('/reviews', payload);
      const created = res.data || { ...payload, _id: Date.now().toString() };
      setReviews(prev => [created, ...prev]);
      setNewReview({ title: '', content: '', rating: 5 });
      setHoverRating(0);
      Swal.fire({ icon: 'success', title: 'Thanks!', text: 'Your review was submitted.', timer: 1400, showConfirmButton: false });
    } catch (err) {
      console.error('submit review error', err);
      Swal.fire({ icon: 'error', title: 'Failed', text: 'Could not submit review. Try again.' });
    } finally { setLoading(false); }
  };

  const toggleExpanded = (id) => {
    setExpandedIds(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const fadeInUpVariant = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const visibleReviews = showAll ? sorted : sorted.slice(0, COLLAPSE_COUNT - 1);

  // theme based classes
  const sectionBg = theme === 'dark' ? 'bg-black text-gray-200' : 'bg-gray-50 text-gray-800';
  const cardBg = theme === 'dark' ? 'bg-gray-950 text-gray-200 shadow-gray-700' : 'bg-white text-gray-800 shadow-md';
  const inputBg = theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <section className={`${sectionBg} py-16 px-5`}>
      <div className="max-w-7xl mx-auto px-12">
        {/* header */}
        <div className="text-center mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-red-500">User Feedback</h3>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">What People Are Saying</h2>
          <div className="mt-3 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-500">{avgRating}</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className={i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-400'} />
                ))}
              </div>
            </div>
            <div className="text-sm">{total} review{total !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* loading spinner */}
        {fetching ? (
          <div className="flex justify-center items-center py-10 col-span-full">
            <div className="w-10 h-10 border-4 border-red-500 border-dashed rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-500">Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-10 col-span-full">
            No reviews yet. Be the first to leave a review!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
            {/* Add Review Form */}
            <motion.div
              key="form-card"
              variants={fadeInUpVariant}
              initial="hidden"
              whileInView="visible"
              className={`${cardBg} rounded-2xl p-6 border-t-4 border-red-500 flex flex-col justify-between overflow-hidden min-h-[18rem]`}
            >
              <div>
                <h4 className="text-lg font-semibold mb-2">Share Your Experience</h4>
                <input
                  type="text"
                  placeholder="Title (e.g., Great service!)"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full mb-2 p-2 rounded focus:outline-none ${inputBg}`}
                />
                <textarea
                  placeholder="Write your review..."
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  className={`w-full mb-2 p-2 rounded resize-none h-18 focus:outline-none ${inputBg}`}
                  maxLength={500}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const rIdx = i + 1;
                      const filled = hoverRating ? rIdx <= hoverRating : rIdx <= newReview.rating;
                      return (
                        <FaStar
                          key={i}
                          size={18}
                          className={`cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                          onMouseEnter={() => setHoverRating(rIdx)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setNewReview(prev => ({ ...prev, rating: rIdx }))}
                        />
                      );
                    })}
                    <span className="text-xs text-gray-400 ml-2">({newReview.rating})</span>
                  </div>
                  <div className="text-xs text-gray-400">{newReview.content.length}/500</div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-400">Preview</div>
                  <div className={`px-3 py-1 rounded text-sm shadow ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>
                    {newReview.title || 'Title preview'}
                  </div>
                </div>
                <button
                  onClick={handleAddReview}
                  disabled={loading}
                  className={`px-4 py-2 rounded font-semibold text-white transition ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </motion.div>

            {/* Render reviews */}
            {visibleReviews.map((review, idx) => {
              const id = review._id || idx;
              const isExpanded = expandedIds.has(id);
              const content = review.content || '';
              const short = content.length > 120 ? content.slice(0, 120) + '...' : content;
              const avatar = review.photo || placeholderAvatar;

              return (
                <motion.div
                  key={id}
                  variants={fadeInUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: idx * 0.04 }}
                  className={`${cardBg} rounded-2xl p-5 border-t-4 border-red-500 flex flex-col justify-between overflow-hidden min-h-[18rem]`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.photo || avatar}
                          alt={review.name || 'avatar'}
                          className="w-11 h-11 rounded-full object-cover border"
                          style={{ borderColor: '#f87171' }}
                        />
                        <div>
                          <div className="text-sm font-medium">{review.name || 'Anonymous'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar key={i} className={i < (review.rating || 0) ? 'text-yellow-400' : 'text-gray-400'} />
                        ))}
                      </div>
                    </div>
                    <hr className={`border-t mt-2 mb-3 ${borderColor}`} />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mt-3">{review.title}</h4>
                    <p className="text-sm mt-2">
                      “ {isExpanded ? content : short} ”
                    </p>
                    {content.length > 120 && (
                      <button onClick={() => toggleExpanded(id)} className="mt-2 text-xs text-blue-500 hover:underline">
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-end mt-3 text-xs gap-2 text-red-500">
                    <FaCalendarAlt />
                    <span>{review.date}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Show more / Show less */}
        {!fetching && sorted.length > (COLLAPSE_COUNT - 1) && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowAll(prev => !prev)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition ${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800'}`}
            >
              {showAll ? 'Show less' : `Show more (${sorted.length - (COLLAPSE_COUNT - 1)} more)`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
