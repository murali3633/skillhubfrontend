import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import './MobileVideoPage.css';

const MobileVideoPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get video data from location state
  const { 
    videoUrl, 
    videoTitle, 
    moduleIndex, 
    videoIndex, 
    course,
    moduleData 
  } = location.state || {};

  const [currentVideo, setCurrentVideo] = useState({
    url: videoUrl,
    title: videoTitle,
    moduleIndex,
    videoIndex
  });

  // Get all videos from the course for navigation
  const [allVideos, setAllVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    if (course && course.syllabus) {
      // Flatten all videos from all modules
      const videos = [];
      course.syllabus.forEach((module, modIndex) => {
        if (module.youtubeLinks && module.youtubeLinks.length > 0) {
          module.youtubeLinks.forEach((videoUrl, vidIndex) => {
            videos.push({
              url: videoUrl,
              title: `Module ${modIndex + 1} - Video ${vidIndex + 1}`,
              moduleIndex: modIndex,
              videoIndex: vidIndex,
              moduleData: module
            });
          });
        }
      });
      setAllVideos(videos);

      // Find current video index in flattened array
      const currentIndex = videos.findIndex(
        video => video.moduleIndex === moduleIndex && video.videoIndex === videoIndex
      );
      setCurrentVideoIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [course, moduleIndex, videoIndex]);

  const goToPreviousVideo = () => {
    if (currentVideoIndex > 0) {
      const prevVideo = allVideos[currentVideoIndex - 1];
      setCurrentVideo(prevVideo);
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const goToNextVideo = () => {
    if (currentVideoIndex < allVideos.length - 1) {
      const nextVideo = allVideos[currentVideoIndex + 1];
      setCurrentVideo(nextVideo);
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const goBack = () => {
    navigate(`/course-learning/${courseId}`);
  };

  if (!videoUrl || !course) {
    return (
      <div className="mobile-video-error">
        <div className="error-content">
          <h2>Video Not Found</h2>
          <p>The requested video could not be loaded.</p>
          <button onClick={goBack} className="back-btn">
            ← Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-video-page">
      {/* Header */}
      <div className="mobile-video-header">
        <button onClick={goBack} className="back-button">
          <span className="back-icon">←</span>
          <span className="back-text">Back</span>
        </button>
        <div className="video-info-header">
          <h1 className="course-title">{course.title}</h1>
          <p className="video-title-header">{currentVideo.title}</p>
        </div>
      </div>

      {/* Video Player */}
      <div className="mobile-video-container">
        <VideoPlayer 
          videoUrl={currentVideo.url}
          title={currentVideo.title}
          isMobile={true}
        />
      </div>

      {/* Video Description */}
      <div className="mobile-video-description">
        <div className="video-meta">
          <h2>{currentVideo.title}</h2>
          <p className="video-progress">
            Video {currentVideoIndex + 1} of {allVideos.length}
          </p>
        </div>
        
        {moduleData && moduleData.description && (
          <div className="module-description">
            <h3>About this Module</h3>
            <p>{moduleData.description}</p>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="mobile-video-controls">
        <button 
          onClick={goToPreviousVideo}
          disabled={currentVideoIndex === 0}
          className="nav-btn prev-btn"
        >
          <span className="nav-icon">←</span>
          <span className="nav-text">Previous</span>
        </button>

        <div className="video-counter">
          {currentVideoIndex + 1} / {allVideos.length}
        </div>

        <button 
          onClick={goToNextVideo}
          disabled={currentVideoIndex === allVideos.length - 1}
          className="nav-btn next-btn"
        >
          <span className="nav-text">Next</span>
          <span className="nav-icon">→</span>
        </button>
      </div>

      {/* Module Files (if any) */}
      {moduleData && moduleData.fileUploads && moduleData.fileUploads.length > 0 && (
        <div className="mobile-video-files">
          <h3>📄 Course Materials</h3>
          <div className="files-list">
            {moduleData.fileUploads.map((file, index) => (
              <div key={index} className="file-item">
                <span className="file-icon">📄</span>
                <span className="file-name">{file.fileName}</span>
                <a 
                  href={file.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="download-btn"
                  download={file.fileName}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileVideoPage;
