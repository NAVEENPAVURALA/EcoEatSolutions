import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, Users, Leaf, ArrowRight, Mail, Phone, AlertTriangle, Siren, Apple, Globe, Languages } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import heroBanner from "@/assets/hero-banner.jpg";
import restaurantIcon from "@/assets/restaurant-icon.png";
import organizationIcon from "@/assets/organization-icon.png";
import individualIcon from "@/assets/individual-icon.png";
import Chatbot from "@/components/Chatbot";
import LocationService from "@/components/LocationService";
import NutritionCalculator from "@/components/NutritionCalculator";
import CommunityChat from "@/components/CommunityChat";
import LiveMap from "@/components/LiveMap";
import DarkModeToggle from "@/components/DarkModeToggle";

const Index = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [emergencyMode, setEmergencyMode] = useState(false);

  const handleEmergencyMode = () => {
    setEmergencyMode(true);
    toast.success(
      language === "hi" ? "आपातकालीन मोड सक्रिय! आपको जल्द ही पास के दानदाताओं के साथ जोड़ा जाएगा।" : 
      language === "ta" ? "அவசர பயன்முறை செயல்படுத்தப்பட்டது! அருகிலுள்ள நன்கொடையாளர்களுடன் உங்களை விரைவில் இணைப்போம்." :
      language === "te" ? "అత్యవసర మోడ్ ప్రారంభించబడింది! మీరు సమీపంలోని దాతలతో త్వరలో కనెక్ట్ అవుతారు." :
      language === "bn" ? "জরুরি মোড সক্রিয়! আপনি শীঘ্রই কাছাকাছি দাতাদের সাথে সংযুক্ত হবেন।" :
      language === "mr" ? "आपत्कालीन मोड सक्रिय! आपण लवकरच जवळच्या देणगीदारांशी जोडले जाल।" :
      "Emergency Mode Activated! You'll be connected with nearby donors shortly."
    );
    setTimeout(() => navigate("/signup"), 2000);
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी (Hindi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "mr", name: "मराठी (Marathi)" }
  ];

  const translations: Record<string, any> = {
    en: {
      badge: "Fighting Food Waste Together",
      heroTitle1: "Transform Surplus into",
      heroTitle2: "Sustenance",
      heroDesc: "Join India's largest food redistribution network. Connect donors with communities in need, eliminate waste, and create meaningful impact—one meal at a time.",
      getStarted: "Get Started",
      signIn: "Sign In",
      stats: {
        meals: "Meals Donated",
        partners: "Active Partners",
        waste: "Waste Prevented"
      },
      whoWeServe: "Who We Serve",
      whoWeServeDesc: "EcoEatSolutions brings together everyone in the food ecosystem to create sustainable impact",
      userTypes: {
        restaurant: {
          title: "Restaurants & Hotels",
          desc: "Turn surplus food into community impact. Donate excess meals and track your positive influence."
        },
        organization: {
          title: "NGOs & Organizations",
          desc: "Access fresh, quality food donations for your community. Feed more people with less effort."
        },
        individual: {
          title: "Individual Donors",
          desc: "Share home-cooked meals with neighbors in need. Every contribution creates lasting change."
        }
      },
      learnMore: "Learn More",
      emergencyTitle: "Emergency Response Mode",
      emergencyDesc: "Activate priority alerts during natural disasters and emergencies. Get immediate support from nearby donors and volunteers with real-time coordination for rapid crisis response.",
      activateEmergency: "Activate Emergency Mode",
      nutritionBadge: "Nutrition Tracking",
      nutritionTitle: "Complete Nutrition Information for Every Meal",
      nutritionDesc: "Track calories, nutrients, and dietary restrictions for all donated food. Our platform ensures recipients receive balanced meals while donors can showcase the nutritional value of their contributions.",
      nutritionFeatures: {
        dietary: {
          title: "Dietary Restriction Filters",
          desc: "Vegetarian, vegan, gluten-free, and more dietary preferences"
        },
        planning: {
          title: "Meal Planning Assistance",
          desc: "Help organizations plan balanced meals for their communities"
        },
        safety: {
          title: "Food Safety Guidelines",
          desc: "Expiry tracking and safety alerts to ensure quality"
        }
      },
      nutritionStats: {
        calories: "Calories Tracked Daily",
        preferences: "Dietary Preferences",
        safety: "Safety Compliance",
        support: "Nutrition Support"
      },
      howItWorks: "How It Works",
      howItWorksDesc: "Simple steps to make a big difference",
      steps: {
        signup: { title: "Sign Up", desc: "Create your account in minutes" },
        post: { title: "Post or Request", desc: "Share surplus or request food" },
        match: { title: "Get Matched", desc: "Connect with nearby partners" },
        impact: { title: "Make Impact", desc: "Complete donation & track results" }
      },
      ctaTitle: "Ready to Make a Difference?",
      ctaDesc: "Join thousands of donors and organizations working together to end food waste and hunger",
      startDonating: "Start Donating Today",
      registerOrg: "Register Your Organization",
      footer: {
        tagline: "Transforming food waste into community sustenance across India",
        platform: "Platform",
        forRestaurants: "For Restaurants",
        forNGOs: "For NGOs",
        forIndividuals: "For Individuals",
        support: "Support",
        helpCenter: "Help Center",
        safetyGuidelines: "Safety Guidelines",
        terms: "Terms of Service",
        contact: "Contact",
        copyright: "© 2025 EcoEatSolutions. All rights reserved. Fighting food waste, one meal at a time."
      }
    },
    hi: {
      badge: "खाद्य अपशिष्ट के खिलाफ एक साथ लड़ाई",
      heroTitle1: "अधिशेष को",
      heroTitle2: "पोषण में बदलें",
      heroDesc: "भारत के सबसे बड़े खाद्य पुनर्वितरण नेटवर्क में शामिल हों। दानदाताओं को जरूरतमंद समुदायों से जोड़ें, अपशिष्ट को समाप्त करें, और एक बार में एक भोजन के साथ सार्थक प्रभाव बनाएं।",
      getStarted: "शुरू करें",
      signIn: "साइन इन करें",
      stats: {
        meals: "दान किए गए भोजन",
        partners: "सक्रिय साझेदार",
        waste: "अपशिष्ट रोका गया"
      },
      whoWeServe: "हम किसकी सेवा करते हैं",
      whoWeServeDesc: "EcoEatSolutions सभी को एक साथ लाता है स्थायी प्रभाव बनाने के लिए",
      userTypes: {
        restaurant: {
          title: "रेस्तरां और होटल",
          desc: "अधिशेष भोजन को सामुदायिक प्रभाव में बदलें। अतिरिक्त भोजन दान करें और अपने सकारात्मक प्रभाव को ट्रैक करें।"
        },
        organization: {
          title: "एनजीओ और संगठन",
          desc: "अपने समुदाय के लिए ताजा, गुणवत्ता वाले खाद्य दान तक पहुंचें। कम प्रयास से अधिक लोगों को खिलाएं।"
        },
        individual: {
          title: "व्यक्तिगत दानदाता",
          desc: "जरूरतमंद पड़ोसियों के साथ घर का बना भोजन साझा करें। हर योगदान स्थायी परिवर्तन बनाता है।"
        }
      },
      learnMore: "और जानें",
      emergencyTitle: "आपातकालीन प्रतिक्रिया मोड",
      emergencyDesc: "प्राकृतिक आपदाओं और आपात स्थितियों के दौरान प्राथमिकता अलर्ट सक्रिय करें। तेजी से संकट प्रतिक्रिया के लिए वास्तविक समय समन्वय के साथ आस-पास के दानदाताओं और स्वयंसेवकों से तत्काल सहायता प्राप्त करें।",
      activateEmergency: "आपातकालीन मोड सक्रिय करें",
      nutritionBadge: "पोषण ट्रैकिंग",
      nutritionTitle: "प्रत्येक भोजन के लिए पूर्ण पोषण जानकारी",
      nutritionDesc: "दान किए गए सभी भोजन के लिए कैलोरी, पोषक तत्व और आहार प्रतिबंधों को ट्रैक करें। हमारा प्लेटफ़ॉर्म सुनिश्चित करता है कि प्राप्तकर्ताओं को संतुलित भोजन मिले जबकि दानदाता अपने योगदान के पोषण मूल्य को प्रदर्शित कर सकते हैं।",
      nutritionFeatures: {
        dietary: {
          title: "आहार प्रतिबंध फ़िल्टर",
          desc: "शाकाहारी, शाकाहारी, लस मुक्त, और अधिक आहार प्राथमिकताएं"
        },
        planning: {
          title: "भोजन योजना सहायता",
          desc: "संगठनों को उनके समुदायों के लिए संतुलित भोजन की योजना बनाने में मदद करें"
        },
        safety: {
          title: "खाद्य सुरक्षा दिशानिर्देश",
          desc: "गुणवत्ता सुनिश्चित करने के लिए समाप्ति ट्रैकिंग और सुरक्षा अलर्ट"
        }
      },
      nutritionStats: {
        calories: "दैनिक कैलोरी ट्रैक की गई",
        preferences: "आहार प्राथमिकताएं",
        safety: "सुरक्षा अनुपालन",
        support: "पोषण समर्थन"
      },
      howItWorks: "यह कैसे काम करता है",
      howItWorksDesc: "बड़ा बदलाव लाने के लिए सरल कदम",
      steps: {
        signup: { title: "साइन अप करें", desc: "मिनटों में अपना खाता बनाएं" },
        post: { title: "पोस्ट या अनुरोध", desc: "अधिशेष साझा करें या भोजन का अनुरोध करें" },
        match: { title: "मैच प्राप्त करें", desc: "आस-पास के साझेदारों से कनेक्ट करें" },
        impact: { title: "प्रभाव बनाएं", desc: "दान पूरा करें और परिणाम ट्रैक करें" }
      },
      ctaTitle: "बदलाव लाने के लिए तैयार हैं?",
      ctaDesc: "हजारों दानदाताओं और संगठनों के साथ जुड़ें जो खाद्य अपशिष्ट और भूख को समाप्त करने के लिए एक साथ काम कर रहे हैं",
      startDonating: "आज दान करना शुरू करें",
      registerOrg: "अपने संगठन को पंजीकृत करें",
      footer: {
        tagline: "पूरे भारत में खाद्य अपशिष्ट को सामुदायिक भरण-पोषण में बदलना",
        platform: "प्लेटफ़ॉर्म",
        forRestaurants: "रेस्तरां के लिए",
        forNGOs: "एनजीओ के लिए",
        forIndividuals: "व्यक्तियों के लिए",
        support: "समर्थन",
        helpCenter: "सहायता केंद्र",
        safetyGuidelines: "सुरक्षा दिशानिर्देश",
        terms: "सेवा की शर्तें",
        contact: "संपर्क",
        copyright: "© 2025 EcoEatSolutions. सर्वाधिकार सुरक्षित। खाद्य अपशिष्ट के खिलाफ लड़ाई, एक बार में एक भोजन।"
      }
    },
    ta: {
      badge: "உணவு விரயத்திற்கு எதிராக ஒன்றாகப் போராடுவோம்",
      heroTitle1: "உபரியை",
      heroTitle2: "உணவாக மாற்றுங்கள்",
      heroDesc: "இந்தியாவின் மிகப்பெரிய உணவு மறுபகிர்வு நெட்வொர்க்கில் சேரவும். நன்கொடையாளர்களை தேவைப்படும் சமூகங்களுடன் இணைக்கவும், கழிவுகளை அகற்றவும், ஒரு நேரத்தில் ஒரு உணவுடன் அர்த்தமுள்ள தாக்கத்தை உருவாக்கவும்.",
      getStarted: "தொடங்குங்கள்",
      signIn: "உள்நுழையவும்",
      stats: {
        meals: "நன்கொடை செய்யப்பட்ட உணவுகள்",
        partners: "செயலில் உள்ள பங்காளர்கள்",
        waste: "தடுக்கப்பட்ட கழிவுகள்"
      },
      whoWeServe: "நாங்கள் யாருக்கு சேவை செய்கிறோம்",
      whoWeServeDesc: "EcoEatSolutions அனைவரையும் ஒன்றிணைத்து நிலையான தாக்கத்தை உருவாக்குகிறது",
      userTypes: {
        restaurant: {
          title: "உணவகங்கள் & ஹோட்டல்கள்",
          desc: "உபரி உணவை சமூக தாக்கமாக மாற்றுங்கள். அதிகப்படியான உணவுகளை நன்கொடை செய்து உங்கள் நேர்மறை செல்வாக்கை கண்காணிக்கவும்."
        },
        organization: {
          title: "தொண்டு நிறுவனங்கள் & அமைப்புகள்",
          desc: "உங்கள் சமூகத்திற்கு புதிய, தரமான உணவு நன்கொடைகளை அணுகவும். குறைந்த முயற்சியுடன் அதிகமான மக்களுக்கு உணவளிக்கவும்."
        },
        individual: {
          title: "தனிநபர் நன்கொடையாளர்கள்",
          desc: "தேவைப்படும் அண்டை வீட்டாருடன் வீட்டில் சமைத்த உணவை பகிர்ந்து கொள்ளுங்கள். ஒவ்வொரு பங்களிப்பும் நீடித்த மாற்றத்தை உருவாக்குகிறது."
        }
      },
      learnMore: "மேலும் அறிக",
      emergencyTitle: "அவசர பதிலளிப்பு பயன்முறை",
      emergencyDesc: "இயற்கை பேரழிவுகள் மற்றும் அவசர நிலைகளின் போது முன்னுரிமை எச்சரிக்கைகளை செயல்படுத்தவும். விரைவான நெருக்கடி பதிலுக்கான நிகழ்நேர ஒருங்கிணைப்புடன் அருகிலுள்ள நன்கொடையாளர்கள் மற்றும் தொண்டர்களிடமிருந்து உடனடி ஆதரவைப் பெறுங்கள்.",
      activateEmergency: "அவசர பயன்முறையை செயல்படுத்து",
      nutritionBadge: "ஊட்டச்சத்து கண்காணிப்பு",
      nutritionTitle: "ஒவ்வொரு உணவுக்கும் முழுமையான ஊட்டச்சத்து தகவல்",
      nutritionDesc: "நன்கொடை செய்யப்பட்ட அனைத்து உணவுகளுக்கும் கலோரிகள், ஊட்டச்சத்துக்கள் மற்றும் உணவு கட்டுப்பாடுகளை கண்காணிக்கவும். பெறுநர்கள் சமச்சீரான உணவுகளைப் பெறுவதை எங்கள் தளம் உறுதி செய்கிறது.",
      nutritionFeatures: {
        dietary: {
          title: "உணவு கட்டுப்பாடு வடிகட்டிகள்",
          desc: "சைவம், சைவ உணவு, பசையம் இல்லாத மற்றும் பல உணவு விருப்பத்தேர்வுகள்"
        },
        planning: {
          title: "உணவு திட்டமிடல் உதவி",
          desc: "அமைப்புகளுக்கு அவர்களின் சமூகங்களுக்கு சமச்சீரான உணவுகளை திட்டமிட உதவுங்கள்"
        },
        safety: {
          title: "உணவு பாதுகாப்பு வழிகாட்டுதல்கள்",
          desc: "தரத்தை உறுதி செய்ய காலாவதி கண்காணிப்பு மற்றும் பாதுகாப்பு எச்சரிக்கைகள்"
        }
      },
      nutritionStats: {
        calories: "தினசரி கலோரிகள் கண்காணிக்கப்பட்டது",
        preferences: "உணவு விருப்பத்தேர்வுகள்",
        safety: "பாதுகாப்பு இணக்கம்",
        support: "ஊட்டச்சத்து ஆதரவு"
      },
      howItWorks: "இது எவ்வாறு செயல்படுகிறது",
      howItWorksDesc: "பெரிய மாற்றத்தை ஏற்படுத்த எளிய படிகள்",
      steps: {
        signup: { title: "பதிவு செய்க", desc: "நிமிடங்களில் உங்கள் கணக்கை உருவாக்குங்கள்" },
        post: { title: "இடுகை அல்லது கோரிக்கை", desc: "உபரியை பகிரவும் அல்லது உணவு கோரவும்" },
        match: { title: "பொருத்தம் பெறுங்கள்", desc: "அருகிலுள்ள பங்காளர்களுடன் இணைக்கவும்" },
        impact: { title: "தாக்கத்தை உருவாக்குங்கள்", desc: "நன்கொடையை முடித்து முடிவுகளை கண்காணிக்கவும்" }
      },
      ctaTitle: "மாற்றத்தை ஏற்படுத்த தயாரா?",
      ctaDesc: "உணவு கழிவுகள் மற்றும் பசியை முடிவுக்கு கொண்டு வர ஒன்றாக பணியாற்றும் ஆயிரக்கணக்கான நன்கொடையாளர்கள் மற்றும் அமைப்புகளுடன் சேரவும்",
      startDonating: "இன்றே நன்கொடை செய்யத் தொடங்குங்கள்",
      registerOrg: "உங்கள் அமைப்பை பதிவு செய்யுங்கள்",
      footer: {
        tagline: "இந்தியா முழுவதும் உணவு கழிவுகளை சமூக உணவாக மாற்றுதல்",
        platform: "தளம்",
        forRestaurants: "உணவகங்களுக்கு",
        forNGOs: "தொண்டு நிறுவனங்களுக்கு",
        forIndividuals: "தனிநபர்களுக்கு",
        support: "ஆதரவு",
        helpCenter: "உதவி மையம்",
        safetyGuidelines: "பாதுகாப்பு வழிகாட்டுதல்கள்",
        terms: "சேவை விதிமுறைகள்",
        contact: "தொடர்பு",
        copyright: "© 2025 EcoEatSolutions. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. உணவு கழிவுகளுக்கு எதிராக போராடுதல், ஒரு நேரத்தில் ஒரு உணவு."
      }
    },
    te: {
      badge: "ఆహార వ్యర్థాలకు వ్యతిరేకంగా కలిసి పోరాడుదాం",
      heroTitle1: "మిగులును",
      heroTitle2: "ఆహారంగా మార్చండి",
      heroDesc: "భారతదేశపు అతిపెద్ద ఆహార పునఃపంపిణీ నెట్‌వర్క్‌లో చేరండి. దాతలను అవసరమైన సమాజాలతో కనెక్ట్ చేయండి, వ్యర్థాలను తొలగించండి మరియు ఒకేసారి ఒక భోజనంతో అర్థవంతమైన ప్రభావాన్ని సృష్టించండి.",
      getStarted: "ప్రారంభించండి",
      signIn: "సైన్ ఇన్ చేయండి",
      stats: {
        meals: "దానం చేసిన భోజనాలు",
        partners: "క్రియాశీల భాగస్వాములు",
        waste: "నిరోధించిన వ్యర్థాలు"
      },
      whoWeServe: "మేము ఎవరికి సేవ చేస్తాము",
      whoWeServeDesc: "EcoEatSolutions అందరినీ ఒకచోట చేర్చి స్థిరమైన ప్రభావాన్ని సృష్టిస్తుంది",
      userTypes: {
        restaurant: {
          title: "రెస్టారెంట్లు & హోటల్స్",
          desc: "మిగులు ఆహారాన్ని సమాజ ప్రభావంగా మార్చండి. అదనపు భోజనాలను దానం చేసి మీ సానుకూల ప్రభావాన్ని ట్రాక్ చేయండి."
        },
        organization: {
          title: "NGOలు & సంస్థలు",
          desc: "మీ సమాజం కోసం తాజా, నాణ్యమైన ఆహార విరాళాలను యాక్సెస్ చేయండి. తక్కువ కృషితో ఎక్కువ మందికి ఆహారం అందించండి."
        },
        individual: {
          title: "వ్యక్తిగత దాతలు",
          desc: "అవసరమైన పొరుగువారితో ఇంట్లో వండిన భోజనాన్ని పంచుకోండి. ప్రతి సహకారం శాశ్వత మార్పును సృష్టిస్తుంది."
        }
      },
      learnMore: "మరింత తెలుసుకోండి",
      emergencyTitle: "అత్యవసర ప్రతిస్పందన మోడ్",
      emergencyDesc: "ప్రకృతి విపత్తులు మరియు అత్యవసర పరిస్థితుల సమయంలో ప్రాధాన్యత హెచ్చరికలను సక్రియం చేయండి. వేగవంతమైన సంక్షోభ ప్రతిస్పందన కోసం నిజ-సమయ సమన్వయంతో సమీప దాతలు మరియు స్వచ్ఛంద సేవకుల నుండి తక్షణ మద్దతు పొందండి.",
      activateEmergency: "అత్యవసర మోడ్‌ను సక్రియం చేయండి",
      nutritionBadge: "పోషకాహార ట్రాకింగ్",
      nutritionTitle: "ప్రతి భోజనానికి పూర్తి పోషకాహార సమాచారం",
      nutritionDesc: "దానం చేసిన అన్ని ఆహారం కోసం కేలరీలు, పోషకాలు మరియు ఆహార పరిమితులను ట్రాక్ చేయండి. గ్రహీతలు సమతుల్య భోజనం పొందడాన్ని మా ప్లాట్‌ఫారమ్ నిర్ధారిస్తుంది.",
      nutritionFeatures: {
        dietary: {
          title: "ఆహార పరిమితి ఫిల్టర్లు",
          desc: "శాకాహారం, శుద్ధ శాకాహారం, గ్లూటెన్-రహిత మరియు మరిన్ని ఆహార ప్రాధాన్యతలు"
        },
        planning: {
          title: "భోజన ప్రణాళిక సహాయం",
          desc: "సంస్థలు వారి సమాజాల కోసం సమతుల్య భోజనాన్ని ప్రణాళిక చేయడంలో సహాయపడండి"
        },
        safety: {
          title: "ఆహార భద్రత మార్గదర్శకాలు",
          desc: "నాణ్యతను నిర్ధారించడానికి గడువు ట్రాకింగ్ మరియు భద్రతా హెచ్చరికలు"
        }
      },
      nutritionStats: {
        calories: "రోజువారీ కేలరీలు ట్రాక్ చేయబడ్డాయి",
        preferences: "ఆహార ప్రాధాన్యతలు",
        safety: "భద్రతా అనుకూలత",
        support: "పోషకాహార మద్దతు"
      },
      howItWorks: "ఇది ఎలా పనిచేస్తుంది",
      howItWorksDesc: "పెద్ద మార్పు చేయడానికి సులభమైన దశలు",
      steps: {
        signup: { title: "సైన్ అప్ చేయండి", desc: "నిమిషాల్లో మీ ఖాతాను సృష్టించండి" },
        post: { title: "పోస్ట్ లేదా అభ్యర్థన", desc: "మిగులును పంచుకోండి లేదా ఆహారం అభ్యర్థించండి" },
        match: { title: "మ్యాచ్ పొందండి", desc: "సమీప భాగస్వాములతో కనెక్ట్ అవ్వండి" },
        impact: { title: "ప్రభావం సృష్టించండి", desc: "విరాళాన్ని పూర్తి చేసి ఫలితాలను ట్రాక్ చేయండి" }
      },
      ctaTitle: "మార్పు తీసుకురావడానికి సిద్ధంగా ఉన్నారా?",
      ctaDesc: "ఆహార వ్యర్థాలు మరియు ఆకలిని అంతం చేయడానికి కలిసి పనిచేస్తున్న వేలాది దాతలు మరియు సంస్థలతో చేరండి",
      startDonating: "ఈరోజు దానం చేయడం ప్రారంభించండి",
      registerOrg: "మీ సంస్థను నమోదు చేయండి",
      footer: {
        tagline: "భారతదేశం అంతటా ఆహార వ్యర్థాలను సమాజ ఆహారంగా మార్చడం",
        platform: "ప్లాట్‌ఫారమ్",
        forRestaurants: "రెస్టారెంట్ల కోసం",
        forNGOs: "NGOల కోసం",
        forIndividuals: "వ్యక్తుల కోసం",
        support: "మద్దతు",
        helpCenter: "సహాయ కేంద్రం",
        safetyGuidelines: "భద్రతా మార్గదర్శకాలు",
        terms: "సేవా నిబంధనలు",
        contact: "సంప్రదించండి",
        copyright: "© 2025 EcoEatSolutions. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి. ఆహార వ్యర్థాలకు వ్యతిరేకంగా పోరాటం, ఒకేసారి ఒక భోజనం."
      }
    },
    bn: {
      badge: "খাদ্য বর্জ্যের বিরুদ্ধে একসাথে লড়াই",
      heroTitle1: "উদ্বৃত্তকে",
      heroTitle2: "খাদ্যে রূপান্তরিত করুন",
      heroDesc: "ভারতের বৃহত্তম খাদ্য পুনর্বণ্টন নেটওয়ার্কে যোগ দিন। দাতাদের প্রয়োজনীয় সম্প্রদায়ের সাথে সংযুক্ত করুন, বর্জ্য দূর করুন এবং একবারে একটি খাবারের সাথে অর্থবহ প্রভাব তৈরি করুন।",
      getStarted: "শুরু করুন",
      signIn: "সাইন ইন করুন",
      stats: {
        meals: "দান করা খাবার",
        partners: "সক্রিয় অংশীদার",
        waste: "প্রতিরোধ করা বর্জ্য"
      },
      whoWeServe: "আমরা কাকে সেবা করি",
      whoWeServeDesc: "EcoEatSolutions সকলকে একত্রিত করে টেকসই প্রভাব তৈরি করে",
      userTypes: {
        restaurant: {
          title: "রেস্তোরাঁ ও হোটেল",
          desc: "উদ্বৃত্ত খাবারকে সম্প্রদায় প্রভাবে রূপান্তরিত করুন। অতিরিক্ত খাবার দান করুন এবং আপনার ইতিবাচক প্রভাব ট্র্যাক করুন।"
        },
        organization: {
          title: "এনজিও ও সংস্থা",
          desc: "আপনার সম্প্রদায়ের জন্য তাজা, মানসম্পন্ন খাদ্য দান অ্যাক্সেস করুন। কম প্রচেষ্টায় আরও মানুষকে খাওয়ান।"
        },
        individual: {
          title: "ব্যক্তিগত দাতা",
          desc: "প্রয়োজনীয় প্রতিবেশীদের সাথে ঘরে রান্না করা খাবার ভাগ করুন। প্রতিটি অবদান স্থায়ী পরিবর্তন তৈরি করে।"
        }
      },
      learnMore: "আরও জানুন",
      emergencyTitle: "জরুরি প্রতিক্রিয়া মোড",
      emergencyDesc: "প্রাকৃতিক দুর্যোগ এবং জরুরী অবস্থার সময় অগ্রাধিকার সতর্কতা সক্রিয় করুন। দ্রুত সংকট প্রতিক্রিয়ার জন্য রিয়েল-টাইম সমন্বয়ের সাথে কাছাকাছি দাতা এবং স্বেচ্ছাসেবকদের কাছ থেকে তাৎক্ষণিক সহায়তা পান।",
      activateEmergency: "জরুরি মোড সক্রিয় করুন",
      nutritionBadge: "পুষ্টি ট্র্যাকিং",
      nutritionTitle: "প্রতিটি খাবারের জন্য সম্পূর্ণ পুষ্টি তথ্য",
      nutritionDesc: "দান করা সমস্ত খাবারের জন্য ক্যালোরি, পুষ্টি এবং খাদ্যতালিকাগত সীমাবদ্ধতা ট্র্যাক করুন। আমাদের প্ল্যাটফর্ম নিশ্চিত করে যে প্রাপকরা সুষম খাবার পায়।",
      nutritionFeatures: {
        dietary: {
          title: "খাদ্যতালিকাগত সীমাবদ্ধতা ফিল্টার",
          desc: "নিরামিষ, ভেগান, গ্লুটেন-মুক্ত এবং আরও অনেক খাদ্য পছন্দ"
        },
        planning: {
          title: "খাবার পরিকল্পনা সহায়তা",
          desc: "সংগঠনগুলিকে তাদের সম্প্রদায়ের জন্য সুষম খাবারের পরিকল্পনা করতে সাহায্য করুন"
        },
        safety: {
          title: "খাদ্য নিরাপত্তা নির্দেশিকা",
          desc: "মান নিশ্চিত করতে মেয়াদ ট্র্যাকিং এবং নিরাপত্তা সতর্কতা"
        }
      },
      nutritionStats: {
        calories: "দৈনিক ক্যালোরি ট্র্যাক করা হয়েছে",
        preferences: "খাদ্য পছন্দ",
        safety: "নিরাপত্তা সম্মতি",
        support: "পুষ্টি সহায়তা"
      },
      howItWorks: "এটি কিভাবে কাজ করে",
      howItWorksDesc: "বড় পার্থক্য তৈরি করতে সহজ পদক্ষেপ",
      steps: {
        signup: { title: "সাইন আপ করুন", desc: "মিনিটের মধ্যে আপনার অ্যাকাউন্ট তৈরি করুন" },
        post: { title: "পোস্ট বা অনুরোধ", desc: "উদ্বৃত্ত শেয়ার করুন বা খাবার অনুরোধ করুন" },
        match: { title: "ম্যাচ পান", desc: "কাছাকাছি অংশীদারদের সাথে সংযুক্ত হন" },
        impact: { title: "প্রভাব তৈরি করুন", desc: "দান সম্পূর্ণ করুন এবং ফলাফল ট্র্যাক করুন" }
      },
      ctaTitle: "পরিবর্তন আনতে প্রস্তুত?",
      ctaDesc: "খাদ্য বর্জ্য এবং ক্ষুধা শেষ করতে একসাথে কাজ করা হাজার হাজার দাতা এবং সংস্থার সাথে যোগ দিন",
      startDonating: "আজই দান শুরু করুন",
      registerOrg: "আপনার সংস্থা নিবন্ধন করুন",
      footer: {
        tagline: "সারা ভারতে খাদ্য বর্জ্যকে সম্প্রদায় খাদ্যে রূপান্তরিত করা",
        platform: "প্ল্যাটফর্ম",
        forRestaurants: "রেস্তোরাঁর জন্য",
        forNGOs: "এনজিওর জন্য",
        forIndividuals: "ব্যক্তিদের জন্য",
        support: "সহায়তা",
        helpCenter: "সহায়তা কেন্দ্র",
        safetyGuidelines: "নিরাপত্তা নির্দেশিকা",
        terms: "সেবার শর্তাবলী",
        contact: "যোগাযোগ",
        copyright: "© 2025 EcoEatSolutions. সর্বস্বত্ব সংরক্ষিত। খাদ্য বর্জ্যের বিরুদ্ধে লড়াই, একবারে একটি খাবার।"
      }
    },
    mr: {
      badge: "अन्न कचऱ्याविरुद्ध एकत्र लढा",
      heroTitle1: "अतिरिक्तला",
      heroTitle2: "अन्नात रूपांतरित करा",
      heroDesc: "भारताच्या सर्वात मोठ्या अन्न पुनर्वितरण नेटवर्कमध्ये सामील व्हा. देणगीदारांना गरजू समुदायांशी जोडा, कचरा दूर करा आणि एका वेळी एका जेवणाने अर्थपूर्ण प्रभाव निर्माण करा.",
      getStarted: "सुरू करा",
      signIn: "साइन इन करा",
      stats: {
        meals: "देणगी केलेले जेवण",
        partners: "सक्रिय भागीदार",
        waste: "प्रतिबंधित कचरा"
      },
      whoWeServe: "आम्ही कोणाची सेवा करतो",
      whoWeServeDesc: "EcoEatSolutions सर्वांना एकत्र आणून शाश्वत प्रभाव निर्माण करते",
      userTypes: {
        restaurant: {
          title: "रेस्टॉरंट्स आणि हॉटेल्स",
          desc: "अतिरिक्त अन्नाचे सामुदायिक प्रभावात रूपांतर करा. अतिरिक्त जेवण दान करा आणि आपला सकारात्मक प्रभाव ट्रॅक करा."
        },
        organization: {
          title: "स्वयंसेवी संस्था आणि संघटना",
          desc: "आपल्या समुदायासाठी ताजे, दर्जेदार अन्न देणग्या मिळवा. कमी प्रयत्नात अधिक लोकांना खायला द्या."
        },
        individual: {
          title: "वैयक्तिक देणगीदार",
          desc: "गरजू शेजाऱ्यांसोबत घरी शिजवलेले जेवण सामायिक करा. प्रत्येक योगदान शाश्वत बदल घडवून आणते."
        }
      },
      learnMore: "अधिक जाणून घ्या",
      emergencyTitle: "आपत्कालीन प्रतिसाद मोड",
      emergencyDesc: "नैसर्गिक आपत्ती आणि आपत्कालीन परिस्थितींमध्ये प्राधान्य सूचना सक्रिय करा. जलद संकट प्रतिसादासाठी रिअल-टाइम समन्वयासह जवळच्या देणगीदार आणि स्वयंसेवकांकडून त्वरित मदत मिळवा.",
      activateEmergency: "आपत्कालीन मोड सक्रिय करा",
      nutritionBadge: "पोषण ट्रॅकिंग",
      nutritionTitle: "प्रत्येक जेवणासाठी संपूर्ण पोषण माहिती",
      nutritionDesc: "देणगी केलेल्या सर्व अन्नासाठी कॅलरीज, पोषक घटक आणि आहारातील निर्बंध ट्रॅक करा. आमचे प्लॅटफॉर्म याची खात्री करते की प्राप्तकर्त्यांना संतुलित जेवण मिळते.",
      nutritionFeatures: {
        dietary: {
          title: "आहार निर्बंध फिल्टर",
          desc: "शाकाहारी, व्हीगन, ग्लूटेन-मुक्त आणि अधिक आहार प्राधान्ये"
        },
        planning: {
          title: "जेवण नियोजन सहाय्य",
          desc: "संस्थांना त्यांच्या समुदायांसाठी संतुलित जेवण योजना तयार करण्यात मदत करा"
        },
        safety: {
          title: "अन्न सुरक्षा मार्गदर्शक तत्त्वे",
          desc: "गुणवत्ता सुनिश्चित करण्यासाठी कालबाह्यता ट्रॅकिंग आणि सुरक्षा सूचना"
        }
      },
      nutritionStats: {
        calories: "दररोज ट्रॅक केलेल्या कॅलरीज",
        preferences: "आहार प्राधान्ये",
        safety: "सुरक्षा अनुपालन",
        support: "पोषण समर्थन"
      },
      howItWorks: "हे कसे कार्य करते",
      howItWorksDesc: "मोठा फरक निर्माण करण्यासाठी सोपी पायऱ्या",
      steps: {
        signup: { title: "साइन अप करा", desc: "काही मिनिटांत आपले खाते तयार करा" },
        post: { title: "पोस्ट किंवा विनंती", desc: "अतिरिक्त सामायिक करा किंवा अन्नाची विनंती करा" },
        match: { title: "जुळणी मिळवा", desc: "जवळच्या भागीदारांशी कनेक्ट करा" },
        impact: { title: "प्रभाव निर्माण करा", desc: "देणगी पूर्ण करा आणि परिणाम ट्रॅक करा" }
      },
      ctaTitle: "बदल घडवण्यासाठी तयार आहात?",
      ctaDesc: "अन्न कचरा आणि भूक संपवण्यासाठी एकत्र काम करणाऱ्या हजारो देणगीदार आणि संस्थांसह सामील व्हा",
      startDonating: "आज देणगी द्यायला सुरुवात करा",
      registerOrg: "आपली संस्था नोंदणी करा",
      footer: {
        tagline: "संपूर्ण भारतात अन्न कचऱ्याचे समुदाय अन्नात रूपांतर",
        platform: "प्लॅटफॉर्म",
        forRestaurants: "रेस्टॉरंट्ससाठी",
        forNGOs: "स्वयंसेवी संस्थांसाठी",
        forIndividuals: "व्यक्तींसाठी",
        support: "समर्थन",
        helpCenter: "मदत केंद्र",
        safetyGuidelines: "सुरक्षा मार्गदर्शक तत्त्वे",
        terms: "सेवा अटी",
        contact: "संपर्क",
        copyright: "© 2025 EcoEatSolutions. सर्व हक्क राखीव. अन्न कचऱ्याविरुद्ध लढा, एका वेळी एक जेवण."
      }
    }
  };

  const t = translations[language] || translations.en;

  const userTypes = [
    {
      icon: restaurantIcon,
      title: "Restaurants & Hotels",
      description: "Turn surplus food into community impact. Donate excess meals and track your positive influence.",
      color: "from-primary to-primary-glow"
    },
    {
      icon: organizationIcon,
      title: "NGOs & Organizations",
      description: "Access fresh, quality food donations for your community. Feed more people with less effort.",
      color: "from-secondary to-blue-400"
    },
    {
      icon: individualIcon,
      title: "Individual Donors",
      description: "Share home-cooked meals with neighbors in need. Every contribution creates lasting change.",
      color: "from-accent to-orange-400"
    }
  ];

  const stats = [
    { number: "50K+", label: "Meals Donated", icon: Heart },
    { number: "500+", label: "Active Partners", icon: Users },
    { number: "10K Kg", label: "Waste Prevented", icon: Leaf }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <DarkModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-background/95 backdrop-blur shadow-lg">
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">{languages.find(l => l.code === language)?.name.split(" ")[0]}</span>
              <Globe className="w-4 h-4 sm:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background z-50">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className="cursor-pointer"
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        <div className="container relative mx-auto px-4 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{t.badge}</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                {t.heroTitle1}{" "}
                <span className="gradient-hero text-gradient">{t.heroTitle2}</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t.heroDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-primary hover:shadow-glow"
                  onClick={() => navigate("/signup")}
                >
                  {t.getStarted} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  {t.signIn}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 gradient-hero opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroBanner} 
                alt="Community sharing food" 
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Mode Section */}
      <section className="relative -mt-16 pb-8 z-10">
        <div className="container mx-auto px-4">
          <Alert className="bg-gradient-to-r from-accent via-accent/90 to-orange-600 border-accent/50 shadow-2xl shadow-accent/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur animate-pulse">
                <Siren className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
            <AlertTitle className="text-white text-2xl font-bold mb-2 flex items-center gap-2">
                  {t.emergencyTitle}
                  <AlertTriangle className="w-5 h-5" />
                </AlertTitle>
                <AlertDescription className="text-white/90 text-base mb-4">
                  {t.emergencyDesc}
                </AlertDescription>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    size="lg"
                    className="bg-white text-accent hover:bg-white/90 font-semibold shadow-lg"
                    onClick={handleEmergencyMode}
                  >
                    {t.activateEmergency}
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur"
                  >
                    {t.learnMore}
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-8 bg-card/80 backdrop-blur border-primary/10 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">
                      {index === 0 ? t.stats.meals : index === 1 ? t.stats.partners : t.stats.waste}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Response & Location Section */}
      <section className="py-20 bg-destructive/5">
        <div className="container mx-auto px-4">
          {/* Nutrition Calculator */}
          <div className="mb-16">
            <NutritionCalculator />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Alert className="border-destructive/50 bg-destructive/10">
              <Siren className="h-5 w-5 text-destructive" />
              <AlertTitle className="text-2xl font-bold mb-2">{t.emergencyTitle}</AlertTitle>
              <AlertDescription className="text-lg mb-4">
                {t.emergencyDesc}
              </AlertDescription>
              <Button 
                variant="destructive" 
                size="lg"
                onClick={handleEmergencyMode}
              >
                <Siren className="mr-2 h-5 w-5" />
                {t.activateEmergency}
              </Button>
            </Alert>
            <LocationService />
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.whoWeServe}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.whoWeServeDesc}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden p-8 border-2 hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-4 group-hover:scale-110 transition-transform">
                    <img src={type.icon} alt={index === 0 ? t.userTypes.restaurant.title : index === 1 ? t.userTypes.organization.title : t.userTypes.individual.title} className="w-full h-full object-contain" />
                  </div>
                  
                  <h3 className="text-2xl font-bold">
                    {index === 0 ? t.userTypes.restaurant.title : index === 1 ? t.userTypes.organization.title : t.userTypes.individual.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {index === 0 ? t.userTypes.restaurant.desc : index === 1 ? t.userTypes.organization.desc : t.userTypes.individual.desc}
                  </p>
                  
                  <div className="flex items-center text-primary font-semibold pt-4">
                    {t.learnMore} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition Information Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <Apple className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">{t.nutritionBadge}</span>
              </div>
              
              <h2 className="text-4xl font-bold">
                {t.nutritionTitle}
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.nutritionDesc}
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t.nutritionFeatures.dietary.title}</h4>
                    <p className="text-sm text-muted-foreground">{t.nutritionFeatures.dietary.desc}</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-secondary/10 mt-1">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t.nutritionFeatures.planning.title}</h4>
                    <p className="text-sm text-muted-foreground">{t.nutritionFeatures.planning.desc}</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-accent/10 mt-1">
                    <AlertTriangle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t.nutritionFeatures.safety.title}</h4>
                    <p className="text-sm text-muted-foreground">{t.nutritionFeatures.safety.desc}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">{t.nutritionStats.calories}</div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <div className="text-3xl font-bold text-secondary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">{t.nutritionStats.preferences}</div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <div className="text-3xl font-bold text-accent mb-2">100%</div>
                <div className="text-sm text-muted-foreground">{t.nutritionStats.safety}</div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">{t.nutritionStats.support}</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.howItWorks}</h2>
            <p className="text-xl text-muted-foreground">{t.howItWorksDesc}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: t.steps.signup.title, desc: t.steps.signup.desc },
              { step: "02", title: t.steps.post.title, desc: t.steps.post.desc },
              { step: "03", title: t.steps.match.title, desc: t.steps.match.desc },
              { step: "04", title: t.steps.impact.title, desc: t.steps.impact.desc }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary text-primary-foreground text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden p-12 md:p-16 gradient-hero">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                {t.ctaTitle}
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                {t.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate("/signup")}
                >
                  {t.startDonating}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => navigate("/signup")}
                >
                  {t.registerOrg}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Community Chat Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <CommunityChat />
        </div>
      </section>

      {/* Live Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <LiveMap />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold gradient-primary text-gradient">EcoEatSolutions</h3>
              <p className="text-muted-foreground text-sm">
                {t.footer.tagline}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t.footer.platform}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">{t.footer.forRestaurants}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.footer.forNGOs}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.footer.forIndividuals}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t.footer.support}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">{t.footer.helpCenter}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.footer.safetyGuidelines}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.footer.terms}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t.footer.contact}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@ecoeatsolutions.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 1800-XXX-XXXX</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
};

export default Index;
