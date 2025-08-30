"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { ELanguage } from "@/lib/types"

interface LanguageContextType {
  currentLanguage: ELanguage
  setLanguage: (language: ELanguage) => Promise<void>
  translations: Record<string, string>
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Mock translations - in a real app, these would come from the API
const mockTranslations = {
  [ELanguage.English]: {
    "hero.title": "Luxe Rose Dubai",
    "hero.subtitle": "Premium Flower Arrangements",
    "filter.title": "Find Your Perfect Flowers",
    "filter.subtitle": "Filter and search through our collection",
    "filter.search_placeholder": "Search flower name...",
    "filter.bouquet_type": "Bouquet Type",
    "filter.size": "Size",
    "filter.min_price": "Min Price",
    "filter.max_price": "Max Price",
    "filter.colors": "Colors",
    "filter.flower_types": "Flower Types",
    "filter.search": "Search",
    "filter.clear": "Clear",
    "groups.title": "Flower Collections",
    "groups.subtitle": "Explore our curated flower groups",
    "about.title": "About Us",
    "about.description":
      `Luxe Rose Dubai is the art of floral storytelling — refined over three years of passion, precision, and creativity in the world of luxury blooms.

We proudly collaborate with beloved brands, top companies, and lifestyle influencers to create more than just bouquets —
we craft unforgettable floral moments.

Each arrangement is a blend of style, attention to detail, and the genuine desire to surprise and delight.

 Our personal touch makes every order truly unique — we tailor each detail to exceed expectations.

Here, you're not just buying flowers. You're gifting emotion — and doing it beautifully.`,
    "delivery.title": "Delivery",
    "delivery.description":
      `At Luxe Rose Dubai, we understand how important it is for your flowers to arrive on time — every time.
Our standard delivery across Dubai takes 1–2 hours, depending on traffic, and we always strive to make it as fast and seamless as possible.

Planning ahead? Simply choose your preferred time slot when placing your order, and we’ll ensure your bouquet arrives right on schedule — beautifully fresh and exactly when you want it.

We’re here around the clock to offer flexible delivery options that bring joy with every order.

Standard Dubai Delivery: 1–2 hours, starting from AED 50–80 depending on the area.
Scheduled Delivery: Choose a time in advance — we guarantee on-time arrival.

Other Emirates (Abu Dhabi, Sharjah, Deira, etc.): Rates vary and are calculated individually.

Need help? Our team is always available on WhatsApp to answer questions and assist with your order — quickly and personally`,
"payment.title":"Payment",
"payment.description":"At Luxe Rose Dubai, your comfort comes first — that’s why we offer a full range of payment options to suit your lifestyle. Whether you prefer digital, mobile, or traditional methods, we make it simple and seamless:",    
"payment.ApplePay":"Apple Pay — quick and effortless",
"payment.Paymentlink":"Payment link — perfect when you’re on the go",
"payment.Banktransfers":"Bank transfers — available for clients in Russia, the UAE, and Armenia",
"payment.USDT":"USDT (crypto) — ideal for those who prefer digital finance",
"footer.contact": "Contact Us",
    "footer.follow": "Follow Us",
    "footer.visit": "Visit Our Store",
    "basket.title": "Your Basket",
    "basket.empty": "Your basket is empty",
    "basket.empty_description": "Add some beautiful flowers to get started",
    "basket.whatsapp": "Contact via WhatsApp",
    "basket.clear_all": "Clear All",
    "basket.total": "Total:",
    "flower.back": "Back to Catalog",
    "flower.description": "Description",
    "flower.bouquet_type": "Bouquet Type",
    "flower.available_colors": "Available Colors",
    "flower.flower_types": "Flower Types",
    "flower.add_to_basket": "Add to Basket",
    "flower.size": "Size",
    "catalog.back": "Back",
    "catalog.search_results": "Search Results",
    "catalog.flower_collection": "Flower Collection",
    "catalog.flowers_found": "flowers found",
    "catalog.no_flowers": "No flowers found matching your criteria.",
    "catalog.go_back": "Go Back",
    "catalog.load_more": "Load More",
  },
  [ELanguage.Russian]: {
    "hero.title": "Люкс Роуз Дубай",
    "hero.subtitle": "Премиальные цветочные композиции",
    "filter.title": "Найдите свои идеальные цветы",
    "filter.subtitle": "Фильтруйте и ищите в нашей коллекции",
    "filter.search_placeholder": "Поиск по названию цветка...",
    "filter.bouquet_type": "Тип букета",
    "filter.size": "Размер",
    "filter.min_price": "Мин. цена",
    "filter.max_price": "Макс. цена",
    "filter.colors": "Цвета",
    "filter.flower_types": "Типы цветов",
    "filter.search": "Поиск",
    "filter.clear": "Очистить",
    "groups.title": "Коллекции цветов",
    "groups.subtitle": "Изучите наши тщательно подобранные группы цветов",
    "about.title": "О нас",
    "about.description":
      `Luxe Rose Dubai — это три года мастерства и вдохновения в мире люксовых цветов.
Мы сотрудничаем с любимыми брендами, компаниями и блогерами, создавая не просто букеты — а запоминающиеся впечатления. Каждая наша композиция — это стиль, внимание к деталям и желание удивить.

Персональный подход делает каждый заказ по-настоящему особенным — мы подбираем всё так, чтобы превзойти ожидания.

Здесь Вы не просто покупаете цветы.
Вы дарите эмоции. И делаете это красиво.`,
    "delivery.title": "Доставка",
    "delivery.description":
      `В Luxe Rose Dubai мы знаем, как важно, чтобы ваши заказы приходили точно в срок. Мы доставляем  цветы в течение 1-2 часов, учитывая трафик, и при этом всегда стремимся максимально ускорить процесс.

Если вы сделаете заказ заранее и укажете удобное для вас время,
мы гарантируем, что ваши цветы будут доставлены точно к назначенному часу. В любое время дня мы подберём для вас оптимальное решение,
чтобы каждый заказ приносил радость и удовольствие.

Стандартная доставка по Дубаю занимает от одного до двух часов и стоит от 50 до 80 дирхамов в зависимости от района.
Если вы оформите заказ заранее и укажете удобное время, мы доставим ваш букет точно к назначенному часу.

Для доставки в другие города, такие как Абу-Даби, Шарджа или Дейра, стоимость уточняется индивидуально, и наш администратор всегда на связи в WhatsApp,
чтобы ответить на все вопросы и помочь с оформлением.`,
"payment.title":"Оплата",
"payment.description":"В Luxe Rose Dubai мы уделяем особое внимание вашему комфорту, поэтому предлагаем целую палитру способов оплаты — чтобы каждый мог выбрать то, что действительно удобно: Apple Pay, платёжная ссылка, переводы через российские, дубайские и армянские банки, а также криптовалюта USDT.Выбирайте то, что вам ближе:",
"payment.ApplePay":"Apple Pay — легко и быстро",
"payment.Paymentlink":"Платёжная ссылка — удобно, особенно на ходу",
"payment.Banktransfers":"Банковские переводы — для клиентов из России, ОАЭ и Армении",
"payment.USDT":"USDT — для тех, кто предпочитает цифровые решения.",    
"footer.contact": "Связаться с нами",
    "footer.follow": "Подписывайтесь на нас",
    "footer.visit": "Посетите наш магазин",
    "basket.title": "Ваша корзина",
    "basket.empty": "Ваша корзина пуста",
    "basket.empty_description": "Добавьте красивые цветы, чтобы начать",
    "basket.whatsapp": "Связаться через WhatsApp",
    "basket.clear_all": "Очистить все",
    "basket.total": "Итого:",
    "flower.back": "Назад к каталогу",
    "flower.description": "Описание",
    "flower.bouquet_type": "Тип букета",
    "flower.available_colors": "Доступные цвета",
    "flower.flower_types": "Типы цветов",
    "flower.add_to_basket": "Добавить в корзину",
    "flower.size": "Размер",
    "catalog.back": "Назад",
    "catalog.search_results": "Результаты поиска",
    "catalog.flower_collection": "Коллекция цветов",
    "catalog.flowers_found": "цветов найдено",
    "catalog.no_flowers": "Цветы, соответствующие вашим критериям, не найдены.",
    "catalog.go_back": "Вернуться",
    "catalog.load_more": "Загрузить еще",
  },
  [ELanguage.Arabic]: {
    "hero.title": "لوكس روز دبي",
    "hero.subtitle": "تنسيقات زهور فاخرة",
    "filter.title": "اعثر على الزهور المثالية",
    "filter.subtitle": "قم بالتصفية والبحث في مجموعتنا",
    "filter.search_placeholder": "البحث عن اسم الزهرة...",
    "filter.bouquet_type": "نوع الباقة",
    "filter.size": "الحجم",
    "filter.min_price": "أقل سعر",
    "filter.max_price": "أعلى سعر",
    "filter.colors": "الألوان",
    "filter.flower_types": "أنواع الزهور",
    "filter.search": "بحث",
    "filter.clear": "مسح",
    "groups.title": "مجموعات الزهور",
    "groups.subtitle": "استكشف مجموعات الزهور المنتقاة بعناية",
    "about.title": "من ن��ن",
    "about.description":
      `لوكس روز دبي هو فن سرد القصص الزهرية، وقد صقلته ثلاث سنوات من الشغف والدقة والإبداع في عالم الزهور الفاخرة. نفخر بالتعاون مع علامات تجارية مرموقة وشركات رائدة ومؤثرين في عالم أسلوب الحياة، لنقدم لكم أكثر من مجرد باقات زهور، بل نصنع لحظات زهور لا تُنسى. كل تنسيقة هي مزيج من الأناقة والاهتمام بالتفاصيل والرغبة الصادقة في إبهاركم وإسعادكم. لمستنا الشخصية تجعل كل طلبية فريدة من نوعها، فنحن نصمم كل تفصيلة لتتجاوز التوقعات. هنا، أنت لا تشتري الزهور فحسب، بل تُهديها مشاعرك، وتُبدعها بجمال.`,
    "delivery.title": "التوصيل",
    "delivery.description":
      "نقدم التوصيل في نفس اليوم في جميع أنحاء دبي للطلبات المقدمة قبل الساعة 2 مساءً. يضمن فريق التوصيل المحترف لدينا وصول الزهور في حالة مثالية.",
   "payment.title":"قسط",
"payment.description":"في لوكس روز دبي، راحتكم هي الأولوية، ولذلك نقدم لكم مجموعة شاملة من خيارات الدفع التي تناسب نمط حياتكم. سواءً كنتم تفضلون الطرق الرقمية، أو عبر الهاتف المحمول، أو التقليدية، نجعلها سهلة وسلسة:",
"payment.ApplePay":"Apple Pay — سريع وسهل",
"payment.Paymentlink":"رابط الدفع - مثالي أثناء تنقلك",
"payment.Banktransfers":"التحويلات المصرفية - متاحة للعملاء في روسيا والإمارات العربية المتحدة وأرمينيا",
"payment.USDT":"USDT (العملة المشفرة) - مثالية لأولئك الذين يفضلون التمويل الرقمي",      
"footer.contact": "اتصل بنا",
    "footer.follow": "تابعنا",
    "footer.visit": "زر متجرنا",
    "basket.title": "سلتك",
    "basket.empty": "سلتك فارغة",
    "basket.empty_description": "أضف بعض الزهور الجميلة للبدء",
    "basket.whatsapp": "تواصل عبر واتساب",
    "basket.clear_all": "مسح الكل",
    "basket.total": "المجموع:",
    "flower.back": "العودة إلى الكتالوج",
    "flower.description": "الوصف",
    "flower.bouquet_type": "نوع الباقة",
    "flower.available_colors": "الألوان المتاحة",
    "flower.flower_types": "أنواع الزهور",
    "flower.add_to_basket": "أضف إلى السلة",
    "flower.size": "الحجم",
    "catalog.back": "رجوع",
    "catalog.search_results": "نتائج البحث",
    "catalog.flower_collection": "مجموعة الزهور",
    "catalog.flowers_found": "زهرة موجودة",
    "catalog.no_flowers": "لم يتم العثور على زهور تطابق معاييرك.",
    "catalog.go_back": "العودة",
    "catalog.load_more": "تحميل المزيد",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<ELanguage>(ELanguage.English)
  const [translations, setTranslations] = useState<Record<string, string>>(mockTranslations[ELanguage.English])

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("flower-language") as ELanguage
    if (savedLanguage && Object.values(ELanguage).includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
      setTranslations(mockTranslations[savedLanguage])
    }
  }, [])

  const setLanguage = async (language: ELanguage) => {
    try {
      // TODO: Replace with actual API call to server for translated content
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/translations/${language}`)
      // const translatedContent = await response.json()

      // For now, use mock translations
      setCurrentLanguage(language)
      setTranslations(mockTranslations[language])
      localStorage.setItem("flower-language", language)

      console.log(`Language switched to: ${language}`)
    } catch (error) {
      console.error("Error switching language:", error)
    }
  }

  const t = (key: string, fallback?: string) => {
    return translations[key] || fallback || key
  }

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    translations,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
