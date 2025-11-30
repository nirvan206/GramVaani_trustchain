import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Site Name
      siteName: 'GramVaani',
      
      // Navigation
      home: 'Home',
      about: 'About',
      loans: 'Loans',
      savings: 'Savings',
      trustScore: 'Trust Score',
      profile: 'Profile',
      logout: 'Logout',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      submit: 'Submit',
      edit: 'Edit',
      save: 'Save',
      delete: 'Delete',
      view: 'View',
      search: 'Search',
    },
  },
  hi: {
    translation: {
      // Site Name
      siteName: 'ग्रामवाणी',
      
      // Navigation
      home: 'होम',
      about: 'हमारे बारे में',
      loans: 'ऋण',
      savings: 'बचत',
      trustScore: 'विश्वास स्कोर',
      profile: 'प्रोफ़ाइल',
      logout: 'लॉग आउट',
      
      // Common
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      submit: 'जमा करें',
      edit: 'संपादित करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      view: 'देखें',
      search: 'खोजें',
    },
  },
  bn: {
    translation: {
      // Site Name
      siteName: 'গ্রামবাণী',
      
      // Navigation
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      loans: 'ঋণ',
      savings: 'সঞ্চয়',
      trustScore: 'বিশ্বাস স্কোর',
      profile: 'প্রোফাইল',
      logout: 'লগ আউট',
      
      // Common
      loading: 'লোড হচ্ছে...',
      error: 'ত্রুটি',
      success: 'সফলতা',
      cancel: 'বাতিল',
      confirm: 'নিশ্চিত করুন',
      submit: 'জমা দিন',
      edit: 'সম্পাদনা',
      save: 'সংরক্ষণ',
      delete: 'মুছুন',
      view: 'দেখুন',
      search: 'অনুসন্ধান',
    },
  },
  mr: {
    translation: {
      // Site Name
      siteName: 'ग्रामवाणी',
      
      // Navigation
      home: 'होम',
      about: 'आमच्याबद्दल',
      loans: 'कर्ज',
      savings: 'बचत',
      trustScore: 'विश्वास स्कोअर',
      profile: 'प्रोफाइल',
      logout: 'लॉग आउट',
      
      // Common
      loading: 'लोड होत आहे...',
      error: 'त्रुटी',
      success: 'यश',
      cancel: 'रद्द करा',
      confirm: 'पुष्टी करा',
      submit: 'सबमिट करा',
      edit: 'संपादित करा',
      save: 'जतन करा',
      delete: 'हटवा',
      view: 'पहा',
      search: 'शोधा',
    },
  },
  te: {
    translation: {
      // Site Name
      siteName: 'గ్రామవాణి',
      
      // Navigation
      home: 'హోమ్',
      about: 'మా గురించి',
      loans: 'రుణాలు',
      savings: 'పొదుపు',
      trustScore: 'విశ్వాస స్కోర్',
      profile: 'ప్రొఫైల్',
      logout: 'లాగ్ అవుట్',
      
      // Common
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం',
      success: 'విజయం',
      cancel: 'రద్దు చేయండి',
      confirm: 'నిర్ధారించండి',
      submit: 'సమర్పించండి',
      edit: 'సవరించండి',
      save: 'సేవ్ చేయండి',
      delete: 'తొలగించండి',
      view: 'చూడండి',
      search: 'శోధించండి',
    },
  },
  ta: {
    translation: {
      // Site Name
      siteName: 'கிராமவாணி',
      
      // Navigation
      home: 'முகப்பு',
      about: 'எங்களை பற்றி',
      loans: 'கடன்கள்',
      savings: 'சேமிப்பு',
      trustScore: 'நம்பிக்கை மதிப்பெண்',
      profile: 'சுயவிவரம்',
      logout: 'வெளியேறு',
      
      // Common
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      cancel: 'ரத்து செய்',
      confirm: 'உறுதிப்படுத்து',
      submit: 'சமர்ப்பிக்கவும்',
      edit: 'திருத்து',
      save: 'சேமி',
      delete: 'நீக்கு',
      view: 'பார்',
      search: 'தேடு',
    },
  },
  gu: {
    translation: {
      // Site Name
      siteName: 'ગ્રામવાણી',
      
      // Navigation
      home: 'હોમ',
      about: 'અમારા વિશે',
      loans: 'લોન',
      savings: 'બચત',
      trustScore: 'વિશ્વાસ સ્કોર',
      profile: 'પ્રોફાઇલ',
      logout: 'લોગ આઉટ',
      
      // Common
      loading: 'લોડ થઈ રહ્યું છે...',
      error: 'ભૂલ',
      success: 'સફળતા',
      cancel: 'રદ કરો',
      confirm: 'પુષ્ટિ કરો',
      submit: 'સબમિટ કરો',
      edit: 'સંપાદિત કરો',
      save: 'સાચવો',
      delete: 'કાઢી નાખો',
      view: 'જુઓ',
      search: 'શોધો',
    },
  },
  ur: {
    translation: {
      // Site Name
      siteName: 'گرام وانی',
      
      // Navigation
      home: 'ہوم',
      about: 'ہمارے بارے میں',
      loans: 'قرض',
      savings: 'بچت',
      trustScore: 'اعتماد سکور',
      profile: 'پروفائل',
      logout: 'لاگ آؤٹ',
      
      // Common
      loading: 'لوڈ ہو رہا ہے...',
      error: 'خرابی',
      success: 'کامیابی',
      cancel: 'منسوخ کریں',
      confirm: 'تصدیق کریں',
      submit: 'جمع کریں',
      edit: 'ترمیم کریں',
      save: 'محفوظ کریں',
      delete: 'حذف کریں',
      view: 'دیکھیں',
      search: 'تلاش کریں',
    },
  },
  kn: {
    translation: {
      // Site Name
      siteName: 'ಗ್ರಾಮವಾಣಿ',
      
      // Navigation
      home: 'ಹೋಮ್',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      loans: 'ಸಾಲಗಳು',
      savings: 'ಉಳಿತಾಯ',
      trustScore: 'ವಿಶ್ವಾಸ ಸ್ಕೋರ್',
      profile: 'ಪ್ರೊಫೈಲ್',
      logout: 'ಲಾಗ್ ಔಟ್',
      
      // Common
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
      error: 'ದೋಷ',
      success: 'ಯಶಸ್ಸು',
      cancel: 'ರದ್ದುಗೊಳಿಸಿ',
      confirm: 'ದೃಢೀಕರಿಸಿ',
      submit: 'ಸಲ್ಲಿಸಿ',
      edit: 'ಸಂಪಾದಿಸಿ',
      save: 'ಉಳಿಸಿ',
      delete: 'ಅಳಿಸಿ',
      view: 'ನೋಡಿ',
      search: 'ಹುಡುಕಿ',
    },
  },
  or: {
    translation: {
      // Site Name
      siteName: 'ଗ୍ରାମବାଣୀ',
      
      // Navigation
      home: 'ହୋମ',
      about: 'ଆମ ବିଷୟରେ',
      loans: 'ଋଣ',
      savings: 'ସଞ୍ଚୟ',
      trustScore: 'ବିଶ୍ୱାସ ସ୍କୋର',
      profile: 'ପ୍ରୋଫାଇଲ',
      logout: 'ଲଗ ଆଉଟ',
      
      // Common
      loading: 'ଲୋଡ ହେଉଛି...',
      error: 'ତ୍ରୁଟି',
      success: 'ସଫଳତା',
      cancel: 'ବାତିଲ କରନ୍ତୁ',
      confirm: 'ନିଶ୍ଚିତ କରନ୍ତୁ',
      submit: 'ଦାଖଲ କରନ୍ତୁ',
      edit: 'ସମ୍ପାଦନା',
      save: 'ସଞ୍ଚୟ କରନ୍ତୁ',
      delete: 'ବିଲୋପ କରନ୍ତୁ',
      view: 'ଦେଖନ୍ତୁ',
      search: 'ଖୋଜନ୍ତୁ',
    },
  },
  ml: {
    translation: {
      // Site Name
      siteName: 'ഗ്രാമവാണി',
      
      // Navigation
      home: 'ഹോം',
      about: 'ഞങ്ങളെക്കുറിച്ച്',
      loans: 'വായ്പകൾ',
      savings: 'സമ്പാദ്യം',
      trustScore: 'വിശ്വാസ സ്കോർ',
      profile: 'പ്രൊഫൈൽ',
      logout: 'ലോഗ് ഔട്ട്',
      
      // Common
      loading: 'ലോഡ് ചെയ്യുന്നു...',
      error: 'പിശക്',
      success: 'വിജയം',
      cancel: 'റദ്ദാക്കുക',
      confirm: 'സ്ഥിരീകരിക്കുക',
      submit: 'സമർപ്പിക്കുക',
      edit: 'എഡിറ്റ് ചെയ്യുക',
      save: 'സേവ് ചെയ്യുക',
      delete: 'ഇല്ലാതാക്കുക',
      view: 'കാണുക',
      search: 'തിരയുക',
    },
  },
  pa: {
    translation: {
      // Site Name
      siteName: 'ਗ੍ਰਾਮਵਾਣੀ',
      
      // Navigation
      home: 'ਹੋਮ',
      about: 'ਸਾਡੇ ਬਾਰੇ',
      loans: 'ਕਰਜ਼ੇ',
      savings: 'ਬਚਤ',
      trustScore: 'ਭਰੋਸਾ ਸਕੋਰ',
      profile: 'ਪ੍ਰੋਫਾਈਲ',
      logout: 'ਲੌਗ ਆਉਟ',
      
      // Common
      loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      error: 'ਗਲਤੀ',
      success: 'ਸਫਲਤਾ',
      cancel: 'ਰੱਦ ਕਰੋ',
      confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ',
      submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
      edit: 'ਸੰਪਾਦਿਤ ਕਰੋ',
      save: 'ਸੇਵ ਕਰੋ',
      delete: 'ਮਿਟਾਓ',
      view: 'ਦੇਖੋ',
      search: 'ਖੋਜੋ',
    },
  },
  as: {
    translation: {
      // Site Name
      siteName: 'গ্ৰামবাণী',
      
      // Navigation
      home: 'হোম',
      about: 'আমাৰ বিষয়ে',
      loans: 'ঋণ',
      savings: 'সঞ্চয়',
      trustScore: 'বিশ্বাস স্কৰ',
      profile: 'প্ৰফাইল',
      logout: 'লগ আউট',
      
      // Common
      loading: 'লড হৈ আছে...',
      error: 'ত্ৰুটি',
      success: 'সফলতা',
      cancel: 'বাতিল কৰক',
      confirm: 'নিশ্চিত কৰক',
      submit: 'দাখিল কৰক',
      edit: 'সম্পাদনা',
      save: 'সংৰক্ষণ কৰক',
      delete: 'মচক',
      view: 'চাওক',
      search: 'সন্ধান কৰক',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
