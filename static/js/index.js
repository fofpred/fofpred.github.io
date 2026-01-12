window.HELP_IMPROVE_VIDEOJS = false;


// Video autoplay management using Intersection Observer
// Plays videos only when visible, pauses when scrolled out of view
// This improves performance and battery life, especially on mobile
function initVideoAutoplay() {
  const videos = document.querySelectorAll('video[autoplay]');
  
  if (!videos.length) return;
  
  // Remove autoplay attribute to manually control playback
  videos.forEach(video => {
    video.removeAttribute('autoplay');
    video.pause();
  });
  
  const observerOptions = {
    root: null,
    rootMargin: '50px', // Start loading slightly before visible
    threshold: 0.25 // Play when 25% visible
  };
  
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // Video is visible - play it
        video.play().catch(() => {
          // Autoplay was prevented (rare with muted videos)
          // Could add a play button overlay here if needed
        });
      } else {
        // Video is not visible - pause it
        video.pause();
      }
    });
  }, observerOptions);
  
  videos.forEach(video => {
    videoObserver.observe(video);
  });
}


// Lightbox functionality
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  // Get all gallery images
  const galleryImages = document.querySelectorAll('.pair-item img');

  // Open lightbox on image click
  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      const caption = img.closest('.pair-item').querySelector('.prompt-text');
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox on close button click
  lightboxClose.addEventListener('click', closeLightbox);

  // Close lightbox on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}


// Image Pair Gallery Navigation
function initFlowGallery() {
  const pairs = document.querySelectorAll('.image-pair');
  const dots = document.querySelectorAll('.gallery-dots .dot');
  const prevBtn = document.getElementById('prevPair');
  const nextBtn = document.getElementById('nextPair');
  
  if (pairs.length === 0) return;
  
  let currentPair = 1;
  const totalPairs = pairs.length;

  function showPair(pairNum) {
    // Hide all pairs
    pairs.forEach(pair => {
      pair.style.display = 'none';
    });
    
    // Show the selected pair
    const activePair = document.querySelector(`.image-pair[data-pair="${pairNum}"]`);
    if (activePair) {
      activePair.style.display = 'block';
    }
    
    // Update dots
    dots.forEach(dot => {
      dot.classList.remove('active');
      if (parseInt(dot.dataset.pair) === pairNum) {
        dot.classList.add('active');
      }
    });
    
    currentPair = pairNum;
  }

  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let newPair = currentPair - 1;
      if (newPair < 1) newPair = totalPairs;
      showPair(newPair);
    });
  }

  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let newPair = currentPair + 1;
      if (newPair > totalPairs) newPair = 1;
      showPair(newPair);
    });
  }

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const pairNum = parseInt(dot.dataset.pair);
      showPair(pairNum);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      let newPair = currentPair - 1;
      if (newPair < 1) newPair = totalPairs;
      showPair(newPair);
    } else if (e.key === 'ArrowRight') {
      let newPair = currentPair + 1;
      if (newPair > totalPairs) newPair = 1;
      showPair(newPair);
    }
  });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    bulmaSlider.attach();

    // Initialize flow gallery navigation
    initFlowGallery();

    // Initialize lightbox
    initLightbox();

    // Initialize video autoplay with Intersection Observer
    initVideoAutoplay();

})
