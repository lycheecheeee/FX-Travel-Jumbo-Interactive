// FX Travel Jumbo - Dynamic i18n Translation System
// No hardcoded translations - all content is dynamically managed

class I18nManager {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = {};
    this.observers = [];
    this.storageKey = 'i18n-preferred-language';
    
    // Auto-initialize
    this.init();
  }
  
  /**
   * Detect user's preferred language
   */
  detectLanguage() {
    // 1. Check localStorage first
    const saved = localStorage.getItem(this.storageKey);
    if (saved && this.isValidLang(saved)) {
      return saved;
    }
    
    // 2. Check browser language
    const browserLang = navigator.language || navigator.userLanguage || 'zh-TW';
    const normalized = this.normalizeLang(browserLang);
    
    return normalized;
  }
  
  /**
   * Normalize language code
   */
  normalizeLang(lang) {
    const langMap = {
      'zh-TW': 'zh-TW',
      'zh-HK': 'zh-TW',
      'zh-MO': 'zh-TW',
      'zh-CN': 'zh-CN',
      'zh-SG': 'zh-CN',
      'en-US': 'en',
      'en-GB': 'en',
      'en-AU': 'en',
      'en-CA': 'en',
      'ja-JP': 'ja',
      'ko-KR': 'ko'
    };
    
    return langMap[lang] || langMap[lang.substring(0, 2)] || 'zh-TW';
  }
  
  /**
   * Validate language code
   */
  isValidLang(lang) {
    const supportedLangs = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko'];
    return supportedLangs.includes(lang);
  }
  
  /**
   * Initialize i18n system
   */
  async init() {
    // Load translations from JSON file
    await this.loadTranslationsFromJSON();
    
    // Set initial language
    this.setLanguage(this.currentLang, false);
    
    // Setup event listeners
    this.setupEventListeners();
    
    console.log(`[i18n] Initialized with language: ${this.currentLang}`);
  }
  
  /**
   * Load translations from translations.json
   */
  async loadTranslationsFromJSON() {
    try {
      const response = await fetch('./translations.json');
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.status}`);
      }
      const data = await response.json();
      
      // Merge all language translations
      Object.keys(data).forEach(lang => {
        if (!this.translations[lang]) {
          this.translations[lang] = {};
        }
        Object.assign(this.translations[lang], data[lang]);
      });
      
      console.log('[i18n] Translations loaded successfully');
    } catch (error) {
      console.error('[i18n] Failed to load translations:', error);
    }
  }
  
  /**
   * Setup DOM event listeners
   */
  setupEventListeners() {
    // Language switcher buttons
    document.addEventListener('click', (e) => {
      const langBtn = e.target.closest('[data-lang]');
      if (langBtn) {
        e.preventDefault();
        e.stopPropagation();
        const lang = langBtn.getAttribute('data-lang');
        if (lang && this.isValidLang(lang)) {
          this.setLanguage(lang);
          this.closeDropdown();
        }
      }
    });
    
    // Language toggle dropdown
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langToggle && langDropdown) {
      langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.style.display = 
          langDropdown.style.display === 'none' || !langDropdown.style.display 
            ? 'block' 
            : 'none';
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
          langDropdown.style.display = 'none';
        }
      });
    }
  }
  
  /**
   * Close language dropdown
   */
  closeDropdown() {
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) {
      dropdown.style.display = 'none';
    }
  }
  
  /**
   * Set current language and update UI
   */
  setLanguage(lang, save = true) {
    if (!this.isValidLang(lang)) {
      console.warn(`[i18n] Invalid language: ${lang}, falling back to zh-TW`);
      lang = 'zh-TW';
    }
    
    this.currentLang = lang;
    document.documentElement.lang = lang;
    
    // Save preference
    if (save) {
      localStorage.setItem(this.storageKey, lang);
    }
    
    // Update all translatable elements
    this.updatePageContent();
    
    // Notify observers
    this.notifyObservers(lang);
    
    console.log(`[i18n] Language changed to: ${lang}`);
  }
  
  /**
   * Update all page content based on current language
   */
  updatePageContent() {
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      
      if (translation) {
        // Support HTML content (e.g., <br> tags)
        if (translation.includes('<')) {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.getTranslation(key);
      if (translation) {
        el.placeholder = translation;
      }
    });
    
    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const translation = this.getTranslation(key);
      if (translation) {
        el.setAttribute('aria-label', translation);
      }
    });
    
    // Update active state on language buttons
    this.updateLanguageButtons();
  }
  
  /**
   * Get translation for a key
   * Falls back to key itself if not found (allows dynamic content)
   */
  getTranslation(key) {
    // Check if we have loaded translations for this language
    if (this.translations[this.currentLang]?.[key]) {
      return this.translations[this.currentLang][key];
    }
    
    // Return key as fallback (for dynamic content without pre-defined translations)
    return null;
  }
  
  /**
   * Update language button styles
   */
  updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      const isActive = btnLang === this.currentLang;
      
      if (isActive) {
        btn.style.background = 'rgba(123,47,190,0.3)';
        btn.style.borderColor = 'rgba(123,47,190,0.6)';
        btn.style.color = 'white';
        btn.style.fontWeight = '700';
      } else {
        btn.style.background = 'transparent';
        btn.style.borderColor = 'rgba(255,255,255,0.2)';
        btn.style.color = 'rgba(255,255,255,0.6)';
        btn.style.fontWeight = '500';
      }
    });
  }
  
  /**
   * Load translations from external source (API, JSON file, etc.)
   */
  async loadTranslations(source, lang) {
    try {
      let data;
      
      if (typeof source === 'string') {
        // Load from URL
        const response = await fetch(source);
        data = await response.json();
      } else {
        // Direct object
        data = source;
      }
      
      if (!this.translations[lang]) {
        this.translations[lang] = {};
      }
      
      // Merge translations
      Object.assign(this.translations[lang], data);
      
      // Update UI if this is the current language
      if (lang === this.currentLang) {
        this.updatePageContent();
      }
      
      console.log(`[i18n] Loaded translations for: ${lang}`);
      return true;
    } catch (error) {
      console.error(`[i18n] Failed to load translations:`, error);
      return false;
    }
  }
  
  /**
   * Add translation observer (for reactive updates)
   */
  addObserver(callback) {
    if (typeof callback === 'function') {
      this.observers.push(callback);
    }
  }
  
  /**
   * Notify all observers of language change
   */
  notifyObservers(lang) {
    this.observers.forEach(callback => {
      try {
        callback(lang);
      } catch (error) {
        console.error('[i18n] Observer error:', error);
      }
    });
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    }));
  }
  
  /**
   * Get current language
   */
  getCurrentLang() {
    return this.currentLang;
  }
  
  /**
   * Get all supported languages
   */
  getSupportedLangs() {
    return ['zh-TW', 'zh-CN', 'en', 'ja', 'ko'];
  }
}

// Create global instance
window.i18n = new I18nManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18nManager;
}
