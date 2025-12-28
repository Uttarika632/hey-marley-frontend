// ===== Global Onboarding State =====
window.HM_ONBOARDING = {
  full_name: "",
  age: "",
  city: "",
  country: "",
  school_type: "",
  grade: "",
  interests: [],
  goals: [],
  emotional_needs: [],
  short_term_goal: "",
  target_date: "",
  photo_url: ""
};

// ===== Screen Navigation =====
const screenOrder = [
  'onboarding-1',
  'onboarding-2',
  'onboarding-3',
  'onboarding-4',
  'onboarding-5',
  'onboarding-6',
  'onboarding-7',
  'home',
  'rapid-fire',
  'rapid-fire-complete',
  'word-bomb',
  'word-bomb-complete',
  'deep-dive',
  'deep-dive-complete',
  'analysis',
  'action-plan',
  'global-peer-screen'
];

const screenTitles = {
  'onboarding-1': 'Welcome',
  'onboarding-2': 'School Life',
  'onboarding-3': 'Interests',
  'onboarding-4': 'Goals',
  'onboarding-5': 'Challenges',
  'onboarding-6': 'Your Goal',
  'onboarding-7': 'Review',
  'home': 'Profile',
  'rapid-fire': 'Rapid Fire',
  'rapid-fire-complete': 'Complete',
  'word-bomb': 'Word Connector',
  'word-bomb-complete': 'Complete',
  'deep-dive': 'Deep Dive',
  'deep-dive-complete': 'Complete',
  'analysis': 'Skill Profile',
  'action-plan': 'Action Plan',
  'global-peer-screen': 'Global Peers'
};

let currentScreenIndex = 0;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const screen = document.getElementById(id);
  screen.style.display = 'block';
  screen.classList.add('active');
  
  // Update current index
  currentScreenIndex = screenOrder.indexOf(id);
  
  // Update navigation
  updateNavigation();
  
  // Load user profile when navigating to home
  if (id === 'home') {
    loadUserProfile();
  }
}

function updateNavigation() {
  const backBtn = document.getElementById('nav-back');
  const forwardBtn = document.getElementById('nav-forward');
  const navTitle = document.getElementById('nav-title');
  
  // Update title
  const currentId = screenOrder[currentScreenIndex];
  navTitle.textContent = screenTitles[currentId] || 'Hey Marley';
  
  // Update back button
  backBtn.disabled = currentScreenIndex === 0;
  
  // Update forward button (only enable if user has visited that screen)
  forwardBtn.disabled = currentScreenIndex >= screenOrder.length - 1;
}

function navigateBack() {
  if (currentScreenIndex > 0) {
    const prevScreen = screenOrder[currentScreenIndex - 1];
    showScreen(prevScreen);
  }
}

function navigateForward() {
  if (currentScreenIndex < screenOrder.length - 1) {
    const nextScreen = screenOrder[currentScreenIndex + 1];
    showScreen(nextScreen);
  }
}

// ===== Onboarding Functions =====

// Navigate between onboarding screens
function goToOnboarding(screenNum) {
  // Update review if going to screen 7
  if (screenNum === 7) {
    populateReview();
  }
  showScreen(`onboarding-${screenNum}`);
}

// Screen 1: Basic Info Validation
function validateOnboarding1() {
  const fullName = document.getElementById('ob-fullname').value.trim();
  const age = document.getElementById('ob-age').value;
  const city = document.getElementById('ob-city').value.trim();
  const country = document.getElementById('ob-country').value;
  
  // Update state
  window.HM_ONBOARDING.full_name = fullName;
  window.HM_ONBOARDING.age = age;
  window.HM_ONBOARDING.city = city;
  window.HM_ONBOARDING.country = country;
  
  // Enable/disable next button
  const nextBtn = document.getElementById('ob1-next');
  nextBtn.disabled = !(fullName && age && city && country);
}

// Screen 2: Single chip selection (school type, grade)
function selectChip(chip, field) {
  const group = chip.parentElement;
  
  // Deselect all chips in this group
  group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  
  // Select this chip
  chip.classList.add('selected');
  
  // Update state
  window.HM_ONBOARDING[field] = chip.dataset.value;
  
  // Validate screen 2
  validateOnboarding2();
}

function validateOnboarding2() {
  const schoolType = window.HM_ONBOARDING.school_type;
  const grade = window.HM_ONBOARDING.grade;
  
  const nextBtn = document.getElementById('ob2-next');
  nextBtn.disabled = !(schoolType && grade);
}

// Screen 3, 4, 5: Multi-chip selection
function toggleMultiChip(chip, field) {
  const value = chip.dataset.value;
  const arr = window.HM_ONBOARDING[field];
  
  // Check limits for interests (3-5) and goals (2-3)
  const limits = {
    interests: { min: 3, max: 5 },
    goals: { min: 2, max: 3 },
    emotional_needs: { min: 0, max: 99 }
  };
  
  const limit = limits[field];
  
  if (chip.classList.contains('selected')) {
    // Deselect
    chip.classList.remove('selected');
    const idx = arr.indexOf(value);
    if (idx > -1) arr.splice(idx, 1);
  } else {
    // Check if at max
    if (arr.length >= limit.max) {
      return; // Can't select more
    }
    chip.classList.add('selected');
    arr.push(value);
  }
  
  // Update counter and button state
  if (field === 'interests') {
    updateCounter('interests-counter', arr.length, limit.max);
    const nextBtn = document.getElementById('ob3-next');
    nextBtn.disabled = arr.length < limit.min || arr.length > limit.max;
  } else if (field === 'goals') {
    updateCounter('goals-counter', arr.length, limit.max);
    const nextBtn = document.getElementById('ob4-next');
    nextBtn.disabled = arr.length < limit.min || arr.length > limit.max;
  }
}

function updateCounter(elementId, current, max) {
  const counter = document.getElementById(elementId);
  if (counter) {
    counter.textContent = `${current} of ${max} selected`;
  }
}

// Screen 6: Short-term goal validation
function validateOnboarding6() {
  const goalText = document.getElementById('ob-goal-text').value.trim();
  const targetDate = document.getElementById('ob-target-date').value;
  
  // Update char counter
  const charCounter = document.getElementById('goal-char-counter');
  if (charCounter) {
    charCounter.textContent = `${goalText.length}/150`;
  }
  
  // Update state
  window.HM_ONBOARDING.short_term_goal = goalText;
  window.HM_ONBOARDING.target_date = targetDate;
  
  // Enable/disable next button
  const nextBtn = document.getElementById('ob6-next');
  nextBtn.disabled = !(goalText && targetDate);
}

// Initialize date picker with default value (30 days from now)
function initOnboarding() {
  const dateInput = document.getElementById('ob-target-date');
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    dateInput.value = today.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }
}

// Screen 7: Populate review
function populateReview() {
  const ob = window.HM_ONBOARDING;
  
  // About You
  document.getElementById('review-name').textContent = ob.full_name || '—';
  document.getElementById('review-age').textContent = ob.age ? `${ob.age} years old` : '—';
  document.getElementById('review-location').textContent = 
    ob.city && ob.country ? `${ob.city}, ${ob.country}` : '—';
  
  // School
  document.getElementById('review-school-type').textContent = ob.school_type || '—';
  document.getElementById('review-grade').textContent = ob.grade ? `Grade ${ob.grade}` : '—';
  
  // Interests
  const interestsEl = document.getElementById('review-interests');
  if (ob.interests.length > 0) {
    interestsEl.innerHTML = ob.interests.map(i => 
      `<span class="review-chip">${i}</span>`
    ).join('');
  } else {
    interestsEl.textContent = '—';
  }
  
  // Goals
  const goalsEl = document.getElementById('review-goals');
  if (ob.goals.length > 0) {
    goalsEl.innerHTML = ob.goals.map(g => 
      `<span class="review-chip">${g}</span>`
    ).join('');
  } else {
    goalsEl.textContent = '—';
  }
  
  // Emotional Needs
  const emotionalEl = document.getElementById('review-emotional');
  if (ob.emotional_needs.length > 0) {
    emotionalEl.innerHTML = ob.emotional_needs.map(e => 
      `<span class="review-chip">${e}</span>`
    ).join('');
  } else {
    emotionalEl.innerHTML = '<span class="review-chip">None selected</span>';
  }
  
  // Short-term goal
  document.getElementById('review-goal-text').textContent = 
    ob.short_term_goal || '—';
  document.getElementById('review-target-date').textContent = 
    ob.target_date ? formatDate(ob.target_date) : '—';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Save profile and begin (called from Review screen)
async function saveProfileAndBegin() {
  completeOnboarding();
}

function completeOnboarding() {
  try {
    // Save to localStorage
    localStorage.setItem("hm_user_profile", JSON.stringify(window.HM_ONBOARDING));
    
    console.log('Profile saved:', window.HM_ONBOARDING);
    
    // Navigate to profile screen
    showScreen("home");
    
    // Load the profile data into the Profile screen
    loadUserProfile();
    
  } catch (err) {
    console.error('Error saving profile:', err);
    showScreen("home");
  }
}

// Check if user has already completed onboarding
function checkOnboardingStatus() {
  const savedProfile = localStorage.getItem("hm_user_profile");
  if (savedProfile) {
    try {
      window.HM_ONBOARDING = JSON.parse(savedProfile);
      return true; // Already completed
    } catch (e) {
      return false;
    }
  }
  return false;
}

// Photo upload handler
function initPhotoUpload() {
  const photoInput = document.getElementById("photo-input");
  if (photoInput) {
    photoInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function () {
        const base64 = reader.result;
        window.HM_ONBOARDING.photo_url = base64;
        
        // Replace placeholder with actual image
        const previewContainer = document.getElementById("onboarding-photo-preview");
        if (previewContainer) {
          // Check if it's a placeholder div or already an img
          if (previewContainer.tagName === 'DIV') {
            // Create img element to replace placeholder
            const img = document.createElement('img');
            img.id = 'onboarding-photo-preview';
            img.src = base64;
            img.className = 'profile-photo-preview';
            previewContainer.parentNode.replaceChild(img, previewContainer);
          } else {
            previewContainer.src = base64;
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }
}

// Load user profile into the Profile screen AND populate HM_ONBOARDING
function loadUserProfile() {
  const saved = localStorage.getItem("hm_user_profile");
  if (!saved) return;

  try {
    const profile = JSON.parse(saved);

    // IMPORTANT: Populate HM_ONBOARDING for personalization features
    window.HM_ONBOARDING = {
      full_name: profile.full_name || "",
      age: profile.age || "",
      city: profile.city || "",
      country: profile.country || "",
      school_type: profile.school_type || "",
      grade: profile.grade || "",
      interests: profile.interests || [],
      goals: profile.goals || [],
      emotional_needs: profile.emotional_needs || [],
      short_term_goal: profile.short_term_goal || "",
      target_date: profile.target_date || "",
      photo_url: profile.photo_url || ""
    };
    console.log('HM_ONBOARDING populated from localStorage:', window.HM_ONBOARDING);

    // Update photo
    const photoEl = document.querySelector("#home .profile-photo");
    if (profile.photo_url && photoEl) {
      photoEl.src = profile.photo_url;
    }

    // Update name
    const nameEl = document.querySelector("#home .profile-name");
    if (nameEl) {
      nameEl.textContent = profile.full_name || "Your Name";
    }

    // Update location
    const taglineEl = document.querySelector("#home .profile-tagline");
    if (taglineEl) {
      const city = profile.city || "City";
      const country = profile.country || "Country";
      taglineEl.textContent = `${city}, ${country}`;
    }

    // Update About tab - School info
    const schoolInfoEl = document.querySelector("#panel-about .info-row:nth-child(1) .info-value");
    if (schoolInfoEl) {
      const schoolType = profile.school_type || "—";
      const grade = profile.grade || "—";
      schoolInfoEl.textContent = `${schoolType} (Grade ${grade})`;
    }

    // Update About tab - Interests
    const interestsEl = document.querySelector("#panel-about .info-row:nth-child(2) .info-value");
    if (interestsEl && profile.interests && profile.interests.length > 0) {
      interestsEl.textContent = profile.interests.join(", ");
    }

    console.log('User profile loaded into Profile screen');
  } catch (err) {
    console.error('Error loading user profile:', err);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initOnboarding();
  initPhotoUpload();
  
  // Always start with onboarding welcome screen
  // To skip onboarding for returning users, uncomment the check below:
  // if (checkOnboardingStatus()) {
  //   showScreen('home');
  //   loadUserProfile();
  // } else {
  //   showScreen('onboarding-1');
  // }
  
  // For now, always show welcome screen
  showScreen('onboarding-1');
});

// Function to reset onboarding (for testing)
function resetOnboarding() {
  localStorage.removeItem("hm_user_profile");
  window.HM_ONBOARDING = {
    full_name: "",
    age: "",
    city: "",
    country: "",
    school_type: "",
    grade: "",
    interests: [],
    goals: [],
    emotional_needs: [],
    short_term_goal: "",
    target_date: "",
    photo_url: ""
  };
  showScreen('onboarding-1');
}

// ===== Coach Text-to-Speech =====
function coachSpeak(text, onDone) {
  // Fallback timeout in case speech doesn't complete (10 seconds max)
  let callbackFired = false;
  const fallbackTimeout = setTimeout(() => {
    if (!callbackFired && onDone) {
      console.log('coachSpeak fallback: enabling mic after timeout');
      callbackFired = true;
      onDone();
    }
  }, 10000);

  try {
  const utter = new SpeechSynthesisUtterance(text);
  let voices = speechSynthesis.getVoices();

  if (!voices.length) {
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
    };
  }

  // Use faster US English female voice
  let preferred =
    voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("female")) ||
    voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("samantha")) ||
    voices.find(v => v.lang === "en-US");

  utter.voice = preferred || voices[0];
  utter.pitch = 1.0;
  utter.rate = 1.3;
    
    utter.onend = () => {
      if (!callbackFired && onDone) {
        clearTimeout(fallbackTimeout);
        callbackFired = true;
        onDone();
      }
    };
    
    utter.onerror = () => {
      if (!callbackFired && onDone) {
        clearTimeout(fallbackTimeout);
        callbackFired = true;
        console.log('coachSpeak error: enabling mic');
        onDone();
      }
    };
    
  speechSynthesis.speak(utter);
  } catch (err) {
    console.error('coachSpeak failed:', err);
    if (!callbackFired && onDone) {
      clearTimeout(fallbackTimeout);
      callbackFired = true;
      onDone();
    }
  }
}

// ===== Rapid Fire Challenge =====
const API_BASE_URL = 'hey-marley-backend-production.up.railway.app';  // Change to your deployed URL in production

// Global session results for the full assessment
window.HM_RESULTS = {
  rapid_fire: null,
  word_bomb: null,
  deep_dive: null,
  // Individual feedback from each challenge (for skill profile)
  rapid_fire_feedback: null,
  word_bomb_feedback: null,
  deep_dive_feedback: null,
  // Final skill profile
  skill_profile: null,
  evaluation: null,  // Legacy - kept for backwards compatibility
};

let rapidFireTimer = null;
let rapidFireRunning = false;
let rapidFirePromptIndex = 0;
let mediaRecorder = null;
let audioChunks = [];

// Personalized prompts loaded from backend (fallback if API fails)
let rapidFirePrompts = [
  "Something I enjoy about my daily routine is…",
  "One thing I find interesting about my city is…",
  "A hobby that makes me happy is…"
];

// Fetch personalized Rapid Fire prompts from backend
async function fetchPersonalizedPrompts() {
  const onboarding = window.HM_ONBOARDING || {};
  
  // Separate academic and personal interests
  const academicInterestOptions = ["International Relations", "History & Politics", "Science / STEM", "Climate", "Economics", "Psychology"];
  const personalInterestOptions = ["Sports", "Gaming", "Music", "Anime", "Fashion", "Social Media", "Debate Team", "Drama / Theatre"];
  
  const academicInterests = (onboarding.interests || []).filter(i => academicInterestOptions.includes(i));
  const personalInterests = (onboarding.interests || []).filter(i => personalInterestOptions.includes(i));
  
  const payload = {
    age: onboarding.age || "15",
    city: onboarding.city || "",
    country: onboarding.country || "",
    academic_interests: academicInterests,
    personal_interests: personalInterests,
    communication_goals: onboarding.goals || [],
    emotional_needs: onboarding.emotional_needs || [],
    short_term_goal: onboarding.short_term_goal || ""
  };
  
  console.log('Fetching personalized Rapid Fire prompts with:', payload);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/rapid-fire/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error('Failed to fetch prompts:', response.status);
      return false;
    }
    
    const data = await response.json();
    console.log('Received personalized prompts:', data.prompts);
    
    if (data.prompts && data.prompts.length === 3) {
      rapidFirePrompts = data.prompts;
      return true;
    }
  } catch (err) {
    console.error('Error fetching personalized prompts:', err);
  }
  
  return false;
}

// Called when "Get Started" is clicked - fetches prompts then navigates
async function startPersonalizedSession() {
  const btn = document.querySelector('.btn-get-started');
  const originalText = btn.textContent;
  
  // Show loading state
  btn.textContent = 'Personalizing...';
  btn.disabled = true;
  
  // Fetch personalized prompts
  await fetchPersonalizedPrompts();
  
  // Reset button state
  btn.textContent = originalText;
  btn.disabled = false;
  
  // Navigate to Rapid Fire screen with personalized prompts ready
  showScreen('rapid-fire');
  
  // Update the prompt display immediately
  const promptEl = document.getElementById('rapid-fire-prompt');
  if (promptEl && rapidFirePrompts.length > 0) {
    promptEl.textContent = `"${rapidFirePrompts[0]}"`;
  }
}

async function startRapidFire() {
  if (rapidFireRunning) return;
  
  const micBtn = document.getElementById('rapid-fire-mic');
  
  // Request microphone permission
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = async () => {
      // Stop all audio tracks
      stream.getTracks().forEach(track => track.stop());
      
      // Process the recording
      await processRecording();
    };
    
    // Start recording
    mediaRecorder.start();
    
  } catch (err) {
    console.error('Microphone access denied:', err);
    alert('Please allow microphone access to use this feature.');
    micBtn.querySelector('.mic-label').textContent = 'Tap to Start';
    return;
  }
  
  rapidFireRunning = true;
  rapidFirePromptIndex = 0;
  
  const waveform = document.getElementById('rapid-fire-waveform');
  const timerEl = document.getElementById('rapid-fire-timer');
  const promptEl = document.getElementById('rapid-fire-prompt');
  
  micBtn.classList.add('recording');
  micBtn.querySelector('.mic-label').textContent = 'Recording...';
  waveform.classList.add('active');
  
  let timeLeft = 30;
  timerEl.textContent = timeLeft;
  
  // Set first prompt (already personalized from startPersonalizedSession)
  promptEl.textContent = `"${rapidFirePrompts[rapidFirePromptIndex]}"`;
  
  rapidFireTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    
    // Change prompt every 10 seconds
    if (timeLeft === 20 || timeLeft === 10) {
      rapidFirePromptIndex = (rapidFirePromptIndex + 1) % rapidFirePrompts.length;
      promptEl.textContent = `"${rapidFirePrompts[rapidFirePromptIndex]}"`;
      promptEl.style.animation = 'none';
      promptEl.offsetHeight;
      promptEl.style.animation = 'wordPop 0.3s ease';
    }
    
    if (timeLeft <= 0) {
      clearInterval(rapidFireTimer);
      endRapidFire();
    }
  }, 1000);
}

function endRapidFire() {
  rapidFireRunning = false;
  
  const micBtn = document.getElementById('rapid-fire-mic');
  const waveform = document.getElementById('rapid-fire-waveform');
  
  micBtn.classList.remove('recording');
  micBtn.querySelector('.mic-label').textContent = 'Processing...';
  waveform.classList.remove('active');
  
  // Stop the media recorder (triggers onstop -> processRecording)
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

// Retry Rapid Fire with fresh personalized prompts
async function retryRapidFire() {
  // Reset state
  rapidFireRunning = false;
  rapidFirePromptIndex = 0;
  audioChunks = [];
  
  // Reset UI elements
  const micBtn = document.getElementById('rapid-fire-mic');
  const timerEl = document.getElementById('rapid-fire-timer');
  const promptEl = document.getElementById('rapid-fire-prompt');
  
  if (micBtn) {
    micBtn.classList.remove('recording');
    micBtn.querySelector('.mic-label').textContent = 'Loading...';
  }
  if (timerEl) timerEl.textContent = '30';
  if (promptEl) promptEl.textContent = '"Getting new prompts..."';
  
  // Navigate to Rapid Fire screen first
  showScreen('rapid-fire');
  
  // Fetch fresh personalized prompts
  await fetchPersonalizedPrompts();
  
  // Update prompt display with new prompts
  if (promptEl && rapidFirePrompts.length > 0) {
    promptEl.textContent = `"${rapidFirePrompts[0]}"`;
  }
  
  // Reset mic button
  if (micBtn) {
    micBtn.querySelector('.mic-label').textContent = 'Tap to Start';
  }
  
  console.log('Rapid Fire reset with new prompts:', rapidFirePrompts);
}

async function processRecording() {
  console.log('processRecording called, audioChunks:', audioChunks.length);
  
  try {
    // Create audio blob
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    console.log('Audio blob size:', audioBlob.size);
    
    // Step 1: Send to STT endpoint
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    
    console.log('Calling STT API...');
    const sttResponse = await fetch(`${API_BASE_URL}/stt`, {
      method: 'POST',
      body: formData
    });
    
    console.log('STT response status:', sttResponse.status);
    if (!sttResponse.ok) throw new Error('Transcription failed: ' + sttResponse.status);
    
    const sttData = await sttResponse.json();
    const transcript = sttData.transcript;
    console.log('Transcript received:', transcript);

    // Store Rapid Fire transcript in global session state
    window.HM_RESULTS.rapid_fire = transcript;
    
    // Step 2: Get Rapid Fire feedback from Marley
    console.log('Calling rapid-fire-feedback API...');
    const feedbackResponse = await fetch(`${API_BASE_URL}/rapid-fire-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: transcript })
    });
    
    console.log('Feedback response status:', feedbackResponse.status);
    if (!feedbackResponse.ok) throw new Error('Feedback failed: ' + feedbackResponse.status);
    
    const feedbackData = await feedbackResponse.json();
    console.log('Feedback received:', feedbackData.feedback);
    
    // Store feedback for skill profile generation
    window.HM_RESULTS.rapid_fire_feedback = feedbackData.feedback;
    
    // Step 3: Show completion screen with feedback
    showCompletionWithFeedback(transcript, feedbackData.feedback);
    
  } catch (error) {
    console.error('Error processing recording:', error);
    // Show completion screen even if there's an error
    showCompletionWithFeedback('', 'Great effort! Keep practicing! 🔥');
  }
}

function showCompletionWithFeedback(transcript, feedback) {
  console.log('showCompletionWithFeedback called with:', { transcript, feedback });
  
  // Update the completion screen with Marley's feedback
  const feedbackContainer = document.getElementById('marley-feedback');
  
  if (feedbackContainer) {
    console.log('Found feedback container, updating...');
    
    // Try to parse structured JSON feedback from the new template
    let feedbackHTML = '';
    try {
      const parsed = typeof feedback === 'string' ? JSON.parse(feedback) : feedback;
      
      // Map fluency levels to emojis
      const levelEmoji = {
        'Smooth Start': '🚀',
        'Getting There': '💪',
        'Needs Warm-Up': '🔥'
      };
      
      const emoji = levelEmoji[parsed.fluency_level] || '✨';
      
      feedbackHTML = `
        <div class="marley-says structured-feedback">
          <p class="feedback-label">Marley says:</p>
          <div class="fluency-badge ${parsed.fluency_level.toLowerCase().replace(/\s+/g, '-')}">
            ${emoji} ${parsed.fluency_level}
          </div>
          <ul class="observations-list">
            ${parsed.observations.map(obs => `<li>${obs}</li>`).join('')}
          </ul>
          <p class="retry-tip">💡 ${parsed.retry_tip}</p>
        </div>
      `;
    } catch (e) {
      // Fallback for plain text feedback
      console.log('Feedback is not JSON, displaying as plain text');
      feedbackHTML = `
    <div class="marley-says">
      <p class="feedback-label">Marley says:</p>
      <p class="feedback-text">${feedback}</p>
    </div>
  `;
    }
    
    feedbackContainer.innerHTML = feedbackHTML;
    
    // Show the feedback container (remove inline display:none)
    feedbackContainer.style.display = 'block';
    feedbackContainer.style.cssText = 'display: block !important;';
    console.log('Feedback container display set to:', feedbackContainer.style.display);
  } else {
    console.error('Feedback container not found!');
  }
  
  showScreen('rapid-fire-complete');
}

// ===== Word Bomb Challenge =====
let wordBombTimer = null;
let wordCycleTimer = null;
let wordBombRunning = false;
let wordBombMediaRecorder = null;
let wordBombAudioChunks = [];
let wordBombWordsShown = [];

// Personalized words loaded from backend (fallback if API fails)
let wordBombWords = ["SCHOOL", "MUSIC", "ADVENTURE", "FRIENDS", "MORNING", "DREAM"];

// Fetch personalized Word Bomb words from backend
async function fetchPersonalizedWordBombWords() {
  const onboarding = window.HM_ONBOARDING || {};
  
  // Separate academic and personal interests
  const academicInterestOptions = ["International Relations", "History & Politics", "Science / STEM", "Climate", "Economics", "Psychology"];
  const personalInterestOptions = ["Sports", "Gaming", "Music", "Anime", "Fashion", "Social Media", "Debate Team", "Drama / Theatre"];
  
  const academicInterests = (onboarding.interests || []).filter(i => academicInterestOptions.includes(i));
  const personalInterests = (onboarding.interests || []).filter(i => personalInterestOptions.includes(i));
  
  const payload = {
    age: onboarding.age || "15",
    city: onboarding.city || "",
    country: onboarding.country || "",
    academic_interests: academicInterests,
    personal_interests: personalInterests,
    communication_goals: onboarding.goals || [],
    emotional_needs: onboarding.emotional_needs || [],
    short_term_goal: onboarding.short_term_goal || ""
  };
  
  console.log('Fetching personalized Word Bomb words with:', payload);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/word-bomb/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error('Failed to fetch Word Bomb words:', response.status);
      return false;
    }
    
    const data = await response.json();
    console.log('Received personalized Word Bomb words:', data.words);
    
    if (data.words && data.words.length === 6) {
      wordBombWords = data.words.map(w => w.toUpperCase());
      return true;
    }
  } catch (err) {
    console.error('Error fetching personalized Word Bomb words:', err);
  }
  
  return false;
}

// Called when "Continue to Word Bomb" is clicked
async function startPersonalizedWordBomb() {
  const btn = document.querySelector('.completion-buttons .btn.primary');
  if (btn) {
    btn.textContent = 'Loading words...';
    btn.disabled = true;
  }
  
  // Fetch personalized words
  await fetchPersonalizedWordBombWords();
  
  // Reset button
  if (btn) {
    btn.textContent = 'Continue to Word Connector →';
    btn.disabled = false;
  }
  
  // Navigate to Word Bomb screen with personalized words ready
  showScreen('word-bomb');
  
  // Update the first word display
  const wordEl = document.getElementById('current-word');
  if (wordEl && wordBombWords.length > 0) {
    wordEl.textContent = wordBombWords[0];
  }
}

// Retry Word Bomb with the same words (no regeneration per spec)
function retryWordBomb() {
  // Reset state
  wordBombRunning = false;
  wordBombAudioChunks = [];
  wordBombWordsShown = [];
  
  // Reset UI elements
  const micBtn = document.getElementById('word-bomb-mic');
  const timerEl = document.getElementById('word-bomb-timer');
  const wordEl = document.getElementById('current-word');
  
  if (micBtn) {
    micBtn.classList.remove('recording');
    micBtn.querySelector('.mic-label').textContent = 'Tap to Start';
  }
  if (timerEl) timerEl.textContent = '60';
  if (wordEl && wordBombWords.length > 0) {
    wordEl.textContent = wordBombWords[0];
  }
  
  // Navigate back to Word Bomb screen
  showScreen('word-bomb');
  
  console.log('Word Bomb reset for retry with same words:', wordBombWords);
}

async function startWordBomb() {
  if (wordBombRunning) return;
  
  // Request microphone permission
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    wordBombMediaRecorder = new MediaRecorder(stream);
    wordBombAudioChunks = [];
    wordBombWordsShown = [wordBombWords[0]]; // Start with first word
    
    wordBombMediaRecorder.ondataavailable = (event) => {
      wordBombAudioChunks.push(event.data);
    };
    
    wordBombMediaRecorder.onstop = async () => {
      stream.getTracks().forEach(track => track.stop());
      await processWordBombRecording();
    };
    
    wordBombMediaRecorder.start();
    
  } catch (err) {
    console.error('Microphone access denied:', err);
    alert('Please allow microphone access to use this feature.');
    return;
  }
  
  wordBombRunning = true;
  
  const micBtn = document.getElementById('word-bomb-mic');
  const waveform = document.getElementById('word-bomb-waveform');
  const timerEl = document.getElementById('word-bomb-timer');
  const wordEl = document.getElementById('current-word');
  
  micBtn.classList.add('recording');
  micBtn.querySelector('.mic-label').textContent = 'Recording...';
  waveform.classList.add('active');
  
  let timeLeft = 60;
  timerEl.textContent = timeLeft;
  
  // Main timer
  wordBombTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(wordBombTimer);
      clearInterval(wordCycleTimer);
      endWordBomb();
    }
  }, 1000);
  
  // Word cycle every 10 seconds
  let wordIndex = 0;
  wordCycleTimer = setInterval(() => {
    wordIndex = (wordIndex + 1) % wordBombWords.length;
    wordEl.textContent = wordBombWords[wordIndex];
    wordBombWordsShown.push(wordBombWords[wordIndex]); // Track shown words
    wordEl.style.animation = 'none';
    wordEl.offsetHeight;
    wordEl.style.animation = 'wordPop 0.3s ease';
  }, 10000);
}

function endWordBomb() {
  wordBombRunning = false;
  
  const micBtn = document.getElementById('word-bomb-mic');
  const waveform = document.getElementById('word-bomb-waveform');
  
  micBtn.classList.remove('recording');
  micBtn.querySelector('.mic-label').textContent = 'Processing...';
  waveform.classList.remove('active');
  
  if (wordBombMediaRecorder && wordBombMediaRecorder.state !== 'inactive') {
    wordBombMediaRecorder.stop();
  }
}

async function processWordBombRecording() {
  console.log('Processing Word Bomb recording...');
  
  try {
    const audioBlob = new Blob(wordBombAudioChunks, { type: 'audio/webm' });
    console.log('Word Bomb audio blob size:', audioBlob.size);
    
    // Step 1: Transcribe with STT
    const formData = new FormData();
    formData.append('file', audioBlob, 'word-bomb-recording.webm');
    
    console.log('Calling STT API for Word Bomb...');
    const sttResponse = await fetch(`${API_BASE_URL}/stt`, {
      method: 'POST',
      body: formData
    });
    
    if (!sttResponse.ok) throw new Error('Transcription failed');
    
    const sttData = await sttResponse.json();
    const transcript = sttData.transcript;
    console.log('Word Bomb transcript:', transcript);

    // Store Word Bomb transcript in global session state
    window.HM_RESULTS.word_bomb = transcript;
    
    // Step 2: Get Word Bomb feedback
    console.log('Calling Word Bomb feedback API...');
    const feedbackResponse = await fetch(`${API_BASE_URL}/api/word-bomb-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        transcript: transcript,
        words: wordBombWordsShown
      })
    });
    
    if (!feedbackResponse.ok) throw new Error('Feedback failed');
    
    const feedbackData = await feedbackResponse.json();
    console.log('Word Bomb feedback:', feedbackData.feedback);
    
    // Store feedback for skill profile generation
    window.HM_RESULTS.word_bomb_feedback = feedbackData.feedback;
    
    showWordBombCompletionWithFeedback(transcript, feedbackData.feedback);
    
  } catch (error) {
    console.error('Error processing Word Bomb recording:', error);
    showWordBombCompletionWithFeedback('', 'Amazing effort on the Word Connector! You kept going strong! 💪');
  }
}

function showWordBombCompletionWithFeedback(transcript, feedback) {
  console.log('Showing Word Bomb completion with feedback');
  
  const feedbackContainer = document.getElementById('word-bomb-marley-feedback');
  
  if (feedbackContainer) {
    // Try to parse structured JSON feedback
    let feedbackHTML = '';
    try {
      const parsed = typeof feedback === 'string' ? JSON.parse(feedback) : feedback;
      
      // Map performance levels to emojis
      const levelEmoji = {
        'Quick Connector': '⚡',
        'Finding the Flow': '🌊',
        'Still Warming Up': '🔥'
      };
      
      const emoji = levelEmoji[parsed.performance_level] || '✨';
      
      feedbackHTML = `
        <div class="marley-says structured-feedback">
          <p class="feedback-label">Marley says:</p>
          <div class="fluency-badge ${parsed.performance_level.toLowerCase().replace(/\s+/g, '-')}">
            ${emoji} ${parsed.performance_level}
          </div>
          <ul class="observations-list">
            ${parsed.observations.map(obs => `<li>${obs}</li>`).join('')}
          </ul>
          <p class="retry-tip">💡 ${parsed.retry_tip}</p>
        </div>
      `;
    } catch (e) {
      // Fallback for plain text feedback
      console.log('Word Bomb feedback is not JSON, displaying as plain text');
      feedbackHTML = `
        <div class="marley-says">
          <p class="feedback-label">Marley says:</p>
          <p class="feedback-text">${feedback}</p>
        </div>
      `;
    }
    
    feedbackContainer.innerHTML = feedbackHTML;
    feedbackContainer.style.cssText = 'display: block !important;';
  }
  
    showScreen('word-bomb-complete');
}

// ===== Deep Dive Challenge =====
let deepDiveSessionId = null;
let deepDiveMediaRecorder = null;
let deepDiveAudioChunks = [];
let deepDiveTurn = 0;
let deepDiveStream = null;   // Reuse mic stream — no repeated prompts
let currentDeepDiveQuestion = ""; // Track current question for turns

// Deep Dive state for tracking conversation
window.DEEP_DIVE = {
  topic: "",
  turns: [],
  evaluation: null
};

// ==============================
// 1. Request Mic Permission ONCE
// ==============================
async function ensureMicAccess() {
  if (deepDiveStream) return deepDiveStream;

  try {
    deepDiveStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone access granted.");
    return deepDiveStream;
  } catch (err) {
    console.error("Microphone access denied:", err);
    alert("Please allow microphone access to use Deep Dive.");
    throw err;
  }
}

// ==============================
// 2. Start Personalized Deep Dive (called from Word Connector completion)
// ==============================
async function startPersonalizedDeepDive() {
  const btn = document.querySelector('#word-bomb-complete .completion-buttons .btn.primary');
  if (btn) {
    btn.textContent = 'Loading topic...';
    btn.disabled = true;
  }

  // Reset Deep Dive state
  window.DEEP_DIVE = {
    topic: "",
    turns: [],
    evaluation: null
  };
  deepDiveTurn = 0;
  
  // Build profile payload
  const onboarding = window.HM_ONBOARDING || {};
  const academicInterestOptions = ["International Relations", "History & Politics", "Science / STEM", "Climate", "Economics", "Psychology"];
  const personalInterestOptions = ["Sports", "Gaming", "Music", "Anime", "Fashion", "Social Media", "Debate Team", "Drama / Theatre"];
  
  const academicInterests = (onboarding.interests || []).filter(i => academicInterestOptions.includes(i));
  const personalInterests = (onboarding.interests || []).filter(i => personalInterestOptions.includes(i));

  const payload = {
    age: onboarding.age || "15",
    city: onboarding.city || "",
    country: onboarding.country || "",
    academic_interests: academicInterests,
    personal_interests: personalInterests,
    communication_goals: onboarding.goals || [],
    emotional_needs: onboarding.emotional_needs || [],
    short_term_goal: onboarding.short_term_goal || ""
  };

  console.log('Starting personalized Deep Dive with:', payload);

  try {
    await ensureMicAccess();

    const response = await fetch(`${API_BASE_URL}/api/deep-dive/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Failed to start Deep Dive");

    const data = await response.json();
    deepDiveSessionId = data.session_id;
    window.DEEP_DIVE.topic = data.topic;
    currentDeepDiveQuestion = data.opening_question;

    console.log('Deep Dive started:', { topic: data.topic, question: data.opening_question });

    // Reset button
    if (btn) {
      btn.textContent = 'Continue to Deep Dive →';
      btn.disabled = false;
    }

    // Navigate to Deep Dive screen
    showScreen('deep-dive');

    // Clear chat and show opening question
  const chatArea = document.getElementById('chat-area');
  chatArea.innerHTML = '';
    showCoachMessage(data.opening_question);

  } catch (error) {
    console.error("Error starting Deep Dive:", error);
    
    if (btn) {
      btn.textContent = 'Continue to Deep Dive →';
      btn.disabled = false;
    }

    // Fallback
    window.DEEP_DIVE.topic = "Expressing Your Ideas";
    currentDeepDiveQuestion = "What's something you wish more people understood about your generation?";
    
    showScreen('deep-dive');
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = '';
    showCoachMessage(currentDeepDiveQuestion);
  }
}

// Legacy start function (for backwards compatibility)
async function startDeepDive() {
  await startPersonalizedDeepDive();
}

// ==============================
// 3. Record User Response
// ==============================
async function recordDeepDiveResponse() {
  const micBtn = document.getElementById('deep-dive-mic');
  const waveform = document.getElementById('deep-dive-waveform');

  micBtn.disabled = true;
  micBtn.classList.add('recording');
  waveform.classList.add('active');

  try {
    const stream = await ensureMicAccess();
    deepDiveMediaRecorder = new MediaRecorder(stream);
    deepDiveAudioChunks = [];

    deepDiveMediaRecorder.ondataavailable = (event) => {
      deepDiveAudioChunks.push(event.data);
    };

    deepDiveMediaRecorder.onstop = async () => {
      await processDeepDiveRecording();
    };

    deepDiveMediaRecorder.start();

    // Auto-stop after 20 seconds
  setTimeout(() => {
      if (deepDiveMediaRecorder.state === "recording") {
        deepDiveMediaRecorder.stop();
      }
    }, 20000);

  } catch (err) {
    console.error("Recording error:", err);
    alert("Unable to record audio.");
  }
}

function stopDeepDiveRecording() {
  if (deepDiveMediaRecorder && deepDiveMediaRecorder.state === 'recording') {
    deepDiveMediaRecorder.stop();
  }
}

// ==============================
// 4. Process: Whisper → Backend
// ==============================
async function processDeepDiveRecording() {
  const chatArea = document.getElementById('chat-area');
  const micBtn = document.getElementById('deep-dive-mic');
  const waveform = document.getElementById('deep-dive-waveform');

  micBtn.classList.remove('recording');
  waveform.classList.remove('active');

  try {
    // Create final audio blob
    const audioBlob = new Blob(deepDiveAudioChunks, { type: "audio/webm" });

    // --- Step 1: Whisper STT ---
    const formData = new FormData();
    formData.append("file", audioBlob, "deepdive.webm");

    const sttResponse = await fetch(`${API_BASE_URL}/stt`, {
      method: "POST",
      body: formData
    });

    const sttData = await sttResponse.json();
    const transcript = sttData.transcript;

    // Store this turn in DEEP_DIVE state
    window.DEEP_DIVE.turns.push({
      question: currentDeepDiveQuestion,
      answer: transcript
    });
    deepDiveTurn++;

    console.log('Deep Dive turn recorded:', { turn: deepDiveTurn, question: currentDeepDiveQuestion, answer: transcript });

    // Show user message
    const userBubble = createChatBubble(transcript, "user");
    chatArea.appendChild(userBubble);
    scrollChatToBottom();

    // Typing indicator for Marley
  const typingIndicator = createTypingIndicator();
  chatArea.appendChild(typingIndicator);
  scrollChatToBottom();
  
    // --- Step 2: Send to backend for follow-up or completion ---
    const answerResponse = await fetch(`${API_BASE_URL}/api/deep-dive/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: deepDiveSessionId,
        answer: transcript
      })
    });

    const answerData = await answerResponse.json();

    typingIndicator.remove();
    
    if (answerData.is_complete) {
      // Deep Dive conversation is complete - evaluate it
      console.log('Deep Dive complete, evaluating...');
      
      // Show transition message
      showCoachMessage("Great conversation! Let me reflect on what you shared...", false);
      
      // Call evaluate endpoint
      await evaluateDeepDive();
      
      } else {
      // Show next question and enable mic for next turn
      currentDeepDiveQuestion = answerData.message;
      showCoachMessage(answerData.message, true);  // Enable mic for next recording
    }

  } catch (error) {
    console.error("Deep Dive error:", error);
    showCoachMessage("I'm thinking… can you share a bit more about that?");
  }
}

// ==============================
// 5. Evaluate Deep Dive
// ==============================
async function evaluateDeepDive() {
  try {
    console.log('Evaluating Deep Dive:', window.DEEP_DIVE);

    const response = await fetch(`${API_BASE_URL}/api/deep-dive/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: window.DEEP_DIVE.topic,
        turns: window.DEEP_DIVE.turns
      })
    });

    if (!response.ok) throw new Error("Evaluation failed");

    const data = await response.json();
    console.log('Deep Dive evaluation:', data.feedback);

    // Store evaluation
    window.DEEP_DIVE.evaluation = data.feedback;
    
    // Store feedback for skill profile generation
    window.HM_RESULTS.deep_dive_feedback = data.feedback;

    // Also store for full session (combined transcript of all answers)
    const fullTranscript = window.DEEP_DIVE.turns.map(t => t.answer).join(" ");
    window.HM_RESULTS.deep_dive = fullTranscript;

    // Show completion screen with feedback
    showDeepDiveCompletionWithFeedback(data.feedback);

  } catch (error) {
    console.error("Error evaluating Deep Dive:", error);
    // Show completion screen with fallback
    showDeepDiveCompletionWithFeedback('{"performance_level": "Developing Ideas", "observations": ["You shared your thoughts openly.", "Keep practicing to build more depth."], "retry_tip": "Try adding more examples to support your ideas."}');
  }
}

// ==============================
// 6. Show Deep Dive Completion
// ==============================
function showDeepDiveCompletionWithFeedback(feedback) {
  console.log('Showing Deep Dive completion with feedback');

  const feedbackContainer = document.getElementById('deep-dive-marley-feedback');

  if (feedbackContainer) {
    let feedbackHTML = '';
    try {
      const parsed = typeof feedback === 'string' ? JSON.parse(feedback) : feedback;

      // Map performance levels to emojis
      const levelEmoji = {
        'Clear Thinker': '💡',
        'Developing Ideas': '🌱',
        'Needs More Structure': '🔧'
      };

      const emoji = levelEmoji[parsed.performance_level] || '✨';

      feedbackHTML = `
        <div class="marley-says structured-feedback">
          <p class="feedback-label">Marley says:</p>
          <div class="fluency-badge ${parsed.performance_level.toLowerCase().replace(/\s+/g, '-')}">
            ${emoji} ${parsed.performance_level}
          </div>
          <ul class="observations-list">
            ${parsed.observations.map(obs => `<li>${obs}</li>`).join('')}
          </ul>
          <p class="retry-tip">💡 ${parsed.retry_tip}</p>
        </div>
      `;
    } catch (e) {
      console.log('Deep Dive feedback is not JSON, displaying as plain text');
      feedbackHTML = `
        <div class="marley-says">
          <p class="feedback-label">Marley says:</p>
          <p class="feedback-text">${feedback}</p>
        </div>
      `;
    }

    feedbackContainer.innerHTML = feedbackHTML;
    feedbackContainer.style.cssText = 'display: block !important;';
  }

  showScreen('deep-dive-complete');
}

// ==============================
// 7. Retry Deep Dive
// ==============================
function retryDeepDive() {
  // Reset state but keep the same topic
  const savedTopic = window.DEEP_DIVE.topic;
  
  window.DEEP_DIVE = {
    topic: savedTopic,
    turns: [],
    evaluation: null
  };
  deepDiveTurn = 0;

  // Navigate back to Deep Dive
  showScreen('deep-dive');

  // Clear chat and show a new opening based on same topic
  const chatArea = document.getElementById('chat-area');
  chatArea.innerHTML = '';

  // Generate a simple retry question based on topic
  const retryQuestion = `Let's try again! Tell me more about ${savedTopic}. What's your main thought on this?`;
  currentDeepDiveQuestion = retryQuestion;
  
  showCoachMessage(retryQuestion);

  console.log('Deep Dive retry started with topic:', savedTopic);
}

// ==============================
// 8. Finish and Show Results
// ==============================
async function finishAndShowResults() {
  // Show loading state
  const btn = document.querySelector('#deep-dive-complete .completion-buttons .btn.primary');
  if (btn) {
    btn.textContent = 'Analyzing...';
    btn.disabled = true;
  }

  // If we have all three feedbacks, generate skill profile
  if (
    window.HM_RESULTS.rapid_fire_feedback &&
    window.HM_RESULTS.word_bomb_feedback &&
    window.HM_RESULTS.deep_dive_feedback
  ) {
    try {
      await generateSkillProfile();
      renderSkillProfile();
    } catch (error) {
      console.error('Error generating skill profile:', error);
    }
  }

  if (btn) {
    btn.textContent = 'View My Results →';
    btn.disabled = false;
  }

  showScreen('analysis');
}

// ==============================
// 9. Generate Skill Profile from all feedbacks
// ==============================
async function generateSkillProfile() {
  console.log('Generating skill profile...');

  const payload = {
    rapid_fire_feedback: window.HM_RESULTS.rapid_fire_feedback || "",
    word_bomb_feedback: window.HM_RESULTS.word_bomb_feedback || "",
    deep_dive_feedback: window.HM_RESULTS.deep_dive_feedback || ""
  };

  console.log('Skill profile payload:', payload);

  try {
    const res = await fetch(`${API_BASE_URL}/api/skill-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Skill profile generation failed: ${res.status}`);
    }

    const data = await res.json();
    console.log('Skill profile response:', data);

    // Parse the skill profile JSON
    try {
      window.HM_RESULTS.skill_profile = JSON.parse(data.skill_profile);
    } catch (parseErr) {
      window.HM_RESULTS.skill_profile = data.skill_profile;
    }

    console.log('Parsed skill profile:', window.HM_RESULTS.skill_profile);

  } catch (err) {
    console.error('Error generating skill profile:', err);
    // Set a fallback skill profile
    window.HM_RESULTS.skill_profile = {
      skill_profile: {
        clarity_and_fluency: {
          score: 3,
          level: "Developing",
          description: "You're making good progress with your speaking fluency!"
        },
        structure_and_reasoning: {
          score: 3,
          level: "Developing",
          description: "Your ideas are taking shape nicely!"
        },
        vocabulary_and_language_use: {
          score: 3,
          level: "Developing",
          description: "You're using language effectively!"
        }
      },
      overall_summary: "Great job completing all three challenges! Keep practicing to improve your communication skills.",
      next_focus: "Try adding more examples to support your ideas."
    };
  }
}

// ==============================
// Helper UI functions
// ==============================

function showCoachMessage(message, enableMic = true) {
  const chatArea = document.getElementById('chat-area');
  const micBtn = document.getElementById('deep-dive-mic');

  const coachBubble = createChatBubble(message, "coach");
  chatArea.appendChild(coachBubble);
  scrollChatToBottom();

  // Speak the coach message
  coachSpeak(message, () => {
    if (enableMic && micBtn) {
      micBtn.disabled = false; // Enable for next turn
    }
  });
}

function createChatBubble(text, type) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  return bubble;
}

function createTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  return indicator;
}

function scrollChatToBottom() {
  const chatArea = document.getElementById('chat-area');
  chatArea.scrollTop = chatArea.scrollHeight;
}

// ===== Complete Session Evaluation =====
async function submitCompleteSession() {
  try {
    const payload = {
      rapid_fire: window.HM_RESULTS.rapid_fire,
      word_bomb: window.HM_RESULTS.word_bomb,
      deep_dive: window.HM_RESULTS.deep_dive,
    };

    console.log('Submitting complete session:', payload);

    const res = await fetch(`${API_BASE_URL}/api/complete-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Complete session failed: ${res.status}`);
    }

    const data = await res.json();
    console.log('Evaluation response:', data);
    
    // Backend returns evaluation as a JSON string - parse it
    try {
      window.HM_RESULTS.evaluation = JSON.parse(data.evaluation);
    } catch (parseErr) {
      // If it's already an object, use it directly
      window.HM_RESULTS.evaluation = data.evaluation;
    }
    
    console.log('Parsed evaluation:', window.HM_RESULTS.evaluation);

    // Render the skill profile with actual data
    renderSkillProfile();
    
  } catch (err) {
    console.error('Error submitting complete session:', err);
    // Set a fallback evaluation so the page still shows something
    window.HM_RESULTS.evaluation = {
      analyzing: { score: 3, explanation: "We couldn't fully analyze your session, but you showed good effort!" },
      organizing: { score: 3, explanation: "Your ideas had structure. Keep practicing!" },
      producing_text: { score: 3, explanation: "You expressed yourself well. Great job!" },
      using_language: { score: 3, explanation: "Your language use was solid. Keep it up!" },
      overall_summary: "Great job completing all three challenges! Keep practicing to improve your communication skills."
    };
    renderSkillProfile();
  }
}

// Update Skill Profile screen from skill profile JSON
function renderSkillProfile() {
  console.log('renderSkillProfile called');
  const profileData = window.HM_RESULTS.skill_profile;
  console.log('Skill profile data:', profileData);
  
  if (!profileData) {
    console.error('No skill profile data available!');
    return;
  }

  // Get the skill_profile object (handle both nested and flat structures)
  const skills = profileData.skill_profile || profileData;

  // Helper function to render a skill card
  function renderSkillCard(skillKey, elementPrefix) {
    const skill = skills[skillKey];
    console.log(`Rendering ${skillKey}:`, skill);
    
    if (!skill) {
      console.warn(`No data for ${skillKey}`);
      return;
    }

    const score = skill.score || 3;
    const percent = Math.round((score / 5) * 100);
    const level = skill.level || "Developing";
    const description = skill.description || "";

    // Update level badge
    const levelEl = document.getElementById(`${elementPrefix}-level`);
    if (levelEl) levelEl.textContent = level;

    // Update progress bar
    const barEl = document.getElementById(`${elementPrefix}-bar`);
    if (barEl) barEl.style.width = `${percent}%`;

    // Update description
    const descEl = document.getElementById(`${elementPrefix}-description`);
    if (descEl) descEl.textContent = description;

    // Update stars
    const starsEl = document.getElementById(`${elementPrefix}-stars`);
    if (starsEl) {
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star ${i <= score ? 'filled' : ''}">★</span>`;
      }
      starsEl.innerHTML = starsHtml;
    }

    console.log(`Rendered ${skillKey}: score=${score}, level=${level}`);
  }

  // Render each skill card
  renderSkillCard('clarity_and_fluency', 'clarity');
  renderSkillCard('structure_and_reasoning', 'structure');
  renderSkillCard('vocabulary_and_language_use', 'vocabulary');

  // Update overall summary
  const overallEl = document.getElementById('overall-summary');
  if (overallEl && profileData.overall_summary) {
    overallEl.textContent = profileData.overall_summary;
  }

  // Update next focus
  const nextFocusEl = document.getElementById('next-focus');
  if (nextFocusEl && profileData.next_focus) {
    nextFocusEl.textContent = profileData.next_focus;
  }
  
  console.log('Skill profile rendering complete');
}

// ===== Action Plan =====
async function loadAndShowActionPlan() {
  // Show the action plan screen immediately with loading state
  showScreen('action-plan');
  
  // Check if we have skill profile data
  if (!window.HM_RESULTS.skill_profile) {
    console.error('No skill profile data available for action plan');
    renderDefaultActionPlan();
    return;
  }
  
  // Check if we already have the action plan
  if (window.HM_RESULTS.action_plan) {
    renderActionPlan(window.HM_RESULTS.action_plan);
    return;
  }
  
  try {
    console.log('Fetching personalized action plan v2...');
    
    // Get student goal and target date from onboarding
    const onboarding = window.HM_ONBOARDING || {};
    const studentGoal = onboarding.short_term_goal || "Improve my communication skills";
    const targetDate = onboarding.target_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get skill profile
    const skillProfile = window.HM_RESULTS.skill_profile.skill_profile || window.HM_RESULTS.skill_profile;
    
    const res = await fetch(`${API_BASE_URL}/api/action-plan-v2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_goal: studentGoal,
        target_date: targetDate,
        skill_profile: JSON.stringify(skillProfile)
      })
    });
    
    if (!res.ok) {
      throw new Error(`Action plan failed: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Action plan v2 response:', data);
    
    // Parse the action plan JSON
    try {
      window.HM_RESULTS.action_plan = JSON.parse(data.action_plan);
    } catch (parseErr) {
      window.HM_RESULTS.action_plan = data.action_plan;
    }
    
    console.log('Parsed action plan:', window.HM_RESULTS.action_plan);
    renderActionPlan(window.HM_RESULTS.action_plan);
    
  } catch (err) {
    console.error('Error fetching action plan:', err);
    renderDefaultActionPlan();
  }
}

function renderActionPlan(plan) {
  console.log('Rendering action plan:', plan);
  
  // Skill focus emoji mapping
  const skillEmojis = {
    'clarity_and_fluency': '💬',
    'structure_and_reasoning': '🧠',
    'vocabulary_and_language_use': '📚'
  };
  
  // Update target and date
  const targetEl = document.getElementById('action-plan-target');
  const dateEl = document.getElementById('action-plan-date');
  
  if (targetEl && plan.target) {
    targetEl.textContent = plan.target;
  }
  if (dateEl && plan.event_date) {
    // Format date nicely
    const date = new Date(plan.event_date);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    dateEl.textContent = date.toLocaleDateString('en-US', options);
  }
  
  // Render weeks
  if (plan.weeks && Array.isArray(plan.weeks)) {
    plan.weeks.forEach((week, index) => {
      const weekNum = index + 1;
      const weekFocus = document.getElementById(`week${weekNum}-focus`);
      const weekMissions = document.getElementById(`week${weekNum}-missions`);
      
      if (weekFocus && week.theme) {
        weekFocus.textContent = week.theme;
      }
      
      if (weekMissions && week.missions && Array.isArray(week.missions)) {
        weekMissions.innerHTML = week.missions.map(mission => {
          const emoji = skillEmojis[mission.skill_focus] || '🎯';
          const title = mission.title || mission;
          const desc = mission.description || '';
          
          if (typeof mission === 'string') {
            return `<li><span class="task-icon">🎯</span> ${mission}</li>`;
          }
          
          return `
            <li class="mission-item">
              <span class="task-icon">${emoji}</span>
              <div class="mission-content">
                <strong>${title}</strong>
                <span class="mission-desc">${desc}</span>
              </div>
            </li>
          `;
        }).join('');
      }
    });
  } else {
    // Fallback for old format (week_1, week_2, week_3)
    renderLegacyActionPlan(plan);
  }
  
  console.log('Action plan rendering complete');
}

function renderLegacyActionPlan(plan) {
  // Support for old action plan format
  const taskIcons = ['🎯', '🎤', '📚', '💬', '✨'];
  
  // Week 1
  if (plan.week_1) {
    const week1Focus = document.getElementById('week1-focus');
    const week1Missions = document.getElementById('week1-missions');
    
    if (week1Focus) week1Focus.textContent = `Mission: ${plan.week_1.focus}`;
    if (week1Missions && plan.week_1.missions) {
      week1Missions.innerHTML = plan.week_1.missions.map((mission, i) => 
        `<li><span class="task-icon">${taskIcons[i % taskIcons.length]}</span> ${mission}</li>`
      ).join('');
    }
  }
  
  // Week 2
  if (plan.week_2) {
    const week2Focus = document.getElementById('week2-focus');
    const week2Missions = document.getElementById('week2-missions');
    
    if (week2Focus) week2Focus.textContent = `Mission: ${plan.week_2.focus}`;
    if (week2Missions && plan.week_2.missions) {
      week2Missions.innerHTML = plan.week_2.missions.map((mission, i) => 
        `<li><span class="task-icon">${taskIcons[i % taskIcons.length]}</span> ${mission}</li>`
      ).join('');
    }
  }
  
  // Week 3
  if (plan.week_3) {
    const week3Focus = document.getElementById('week3-focus');
    const week3Missions = document.getElementById('week3-missions');
    
    if (week3Focus) week3Focus.textContent = `Mission: ${plan.week_3.focus}`;
    if (week3Missions && plan.week_3.missions) {
      week3Missions.innerHTML = plan.week_3.missions.map((mission, i) => 
        `<li><span class="task-icon">${taskIcons[i % taskIcons.length]}</span> ${mission}</li>`
      ).join('');
    }
  }
}

function renderDefaultActionPlan() {
  // Fallback plan if API fails
  const defaultPlan = {
    week_1: {
      focus: "Foundation Building",
      missions: [
        "Practice speaking for 30 seconds without pausing",
        "Learn 5 new vocabulary words related to global issues",
        "Record yourself explaining a simple topic",
        "Listen to a Model UN speech and note 3 techniques",
        "Complete a Rapid Fire challenge daily"
      ]
    },
    week_2: {
      focus: "Structure & Organization",
      missions: [
        "Use the PEEL framework in your responses",
        "Practice transitions between ideas",
        "Build a 1-minute structured argument",
        "Complete a Deep Dive conversation",
        "Add evidence to support your claims"
      ]
    },
    week_3: {
      focus: "Delivery & Confidence",
      missions: [
        "Record a full 2-minute speech",
        "Practice varying your pace and tone",
        "Respond to surprise questions confidently",
        "Run a mock debate with a friend",
        "Reflect on your progress and celebrate wins"
      ]
    }
  };
  
  renderActionPlan(defaultPlan);
}

// ===== Restart Assessment =====
function restartAssessment() {
  // Reset all states
  rapidFireRunning = false;
  wordBombRunning = false;
  deepDiveTurn = 0;
  
  // Clear any running timers
  if (rapidFireTimer) clearInterval(rapidFireTimer);
  if (wordBombTimer) clearInterval(wordBombTimer);
  if (wordCycleTimer) clearInterval(wordCycleTimer);
  
  // Reset UI elements
  document.getElementById('rapid-fire-timer').textContent = '30';
  document.getElementById('word-bomb-timer').textContent = '60';
  document.getElementById('current-word').textContent = 'DIWALI';
  document.getElementById('rapid-fire-prompt').textContent = '"Autos are such a big part of my city because…"';
  
  // Reset mic buttons
  const rapidFireMic = document.getElementById('rapid-fire-mic');
  rapidFireMic.classList.remove('recording');
  rapidFireMic.querySelector('.mic-label').textContent = 'Tap to Start';
  
  const wordBombMic = document.getElementById('word-bomb-mic');
  wordBombMic.classList.remove('recording');
  wordBombMic.querySelector('.mic-label').textContent = 'Tap to Start';
  
  // Reset waveforms
  document.querySelectorAll('.waveform').forEach(w => w.classList.remove('active'));
  
  // Clear chat area
  document.getElementById('chat-area').innerHTML = '';
  
  // Go back to home
  showScreen('home');
}

// ===== Profile Tab Navigation =====
function initProfileTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Remove active from all panels
      panels.forEach(p => p.classList.remove('active'));
      
      // Add active to clicked tab
      tab.classList.add('active');
      
      // Add active to target panel
      const targetPanel = document.getElementById('panel-' + targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  updateNavigation();
  
  // Initialize profile tabs
  initProfileTabs();
  
  // Preload voices for TTS
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.addEventListener('voiceschanged', () => {
      speechSynthesis.getVoices();
    });
  }
  
  // Add word pop animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes wordPop {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
});

