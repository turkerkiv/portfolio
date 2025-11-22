# 🎮 İnteraktif Kariyer Hikayesi - Kullanım Kılavuzu

## 📋 Proje Açıklaması

Bu proje, scroll-based (kaydırma tabanlı) animasyon kullanarak kariyer hikayenizi görselleştiren interaktif bir web sayfasıdır. Kullanıcı sayfayı aşağı kaydırdıkça, 2D karakter sağa doğru hareket eder, büyür ve kariyer basamaklarınızı geçer.

## 🚀 Kurulum ve Çalıştırma

### 1. Basit Yöntem (Doğrudan Tarayıcıda Açma)

```bash
# Proje klasörüne gidin
cd /home/turkerkiv/Desktop/software-projects/portfolio

# index.html dosyasını tarayıcıda açın
# Sağ tık -> "Open With" -> Tarayıcınız
# veya dosyayı tarayıcıya sürükleyin
```

### 2. Local Server ile (Önerilen)

```bash
# Python 3 ile
python3 -m http.server 8000

# Tarayıcıda açın:
# http://localhost:8000
```

Veya VS Code'da "Live Server" uzantısını kullanabilirsiniz:
- `index.html` dosyasına sağ tık
- "Open with Live Server" seçin

## 📁 Proje Yapısı

```
portfolio/
│
├── index.html           # Ana HTML dosyası
├── css/
│   └── style.css       # Tüm stiller ve animasyonlar
├── js/
│   └── main.js         # GSAP ScrollTrigger mantığı
├── assets/             # Gelecekte resim/SVG için
└── KULLANIM_KILAVUZU.md
```

## 🎨 Özelleştirme

### Renk Temasını Değiştirme

`css/style.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
    --primary-color: #6366f1;      /* Ana renk */
    --secondary-color: #8b5cf6;    /* İkincil renk */
    --accent-color: #ec4899;       /* Vurgu rengi */
    --bg-dark: #0f172a;            /* Koyu arka plan */
    --bg-light: #1e293b;           /* Açık arka plan */
}
```

### Karakteri Özelleştirme

`css/style.css` dosyasında karakter stillerini değiştirin:

```css
.character-head {
    background: var(--primary-color); /* Kafa rengi */
}

.character-torso {
    background: var(--secondary-color); /* Gövde rengi */
}
```

### Büyüme Hızını Ayarlama

`js/main.js` dosyasında scale değerini değiştirin:

```javascript
gsap.to(character, {
    scale: 3.5, // Bu değeri artırın (daha büyük) veya azaltın (daha küçük)
    // ...
});
```

### Hareket Mesafesini Değiştirme

`js/main.js` dosyasında moveDistance değerini ayarlayın:

```javascript
const moveDistance = window.innerWidth * 0.75; // %75 yerine istediğiniz yüzdeyi yazın
```

## 🎯 Özellikler

### ✅ Mevcut Özellikler

- ✨ **Scroll-based animasyon**: Sayfa kaydırıldıkça karakter hareket eder
- 📈 **Büyüme efekti**: Karakter kariyer ilerledikçe büyür
- 🎬 **Fade-in animasyonları**: Her sahne yumuşak bir şekilde belirir
- 📱 **Responsive tasarım**: Mobil, tablet ve masaüstünde çalışır
- 🎨 **Modern gradient tasarım**: Göz alıcı renkler
- 🚶 **Yürüme animasyonu**: Karakter bacakları hareket eder
- 🛤️ **Progress çizgisi**: Yolda ne kadar ilerlediğinizi gösterir

### 🔮 Gelecek Geliştirmeler (İsteğe Bağlı)

1. **Özel Karakter Tasarımı**
   - SVG veya sprite sheet kullanarak daha detaylı karakter
   - Farklı kostümler/görünümler

2. **Ses Efektleri**
   - Adım sesleri
   - Arka plan müziği
   - Sahne geçişlerinde sesler

3. **Paralaks Arka Plan**
   - Derinlik hissi için katmanlı arka planlar
   - Bulutlar, dağlar, şehir siluetleri

4. **Etkileşimli Elementler**
   - Tıklanabilir ödül rozetleri
   - Proje önizlemeleri (hover efektleri)
   - Modal pencereler ile detaylı bilgi

5. **Veri Görselleştirme**
   - Skill progress barları
   - Teknoloji ikonları
   - Zaman çizelgesi grafikleri

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler

- **HTML5**: Semantik yapı
- **CSS3**: Modern animasyonlar, Flexbox, Grid
- **Vanilla JavaScript**: DOM manipülasyonu
- **GSAP 3.12**: Animasyon kütüphanesi
- **ScrollTrigger**: Scroll-based animasyon eklentisi

### Tarayıcı Desteği

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performans İpuçları

1. **Smooth Scrolling**: Bazı tarayıcılarda daha yumuşak scroll için:
   ```css
   html {
       scroll-behavior: smooth;
   }
   ```

2. **GPU Acceleration**: Animasyonları hızlandırmak için:
   ```css
   .character {
       will-change: transform;
   }
   ```

## 🐛 Sorun Giderme

### Karakter Hareket Etmiyor

1. Tarayıcı konsolunu açın (F12)
2. GSAP yüklendiğini kontrol edin
3. JavaScript hatalarını kontrol edin

### Animasyonlar Yavaş

1. `scrub` değerini azaltın (`js/main.js` dosyasında)
2. Daha güçlü bir cihaz kullanın
3. Tarayıcı donanım ivmesini açın

### Mobilde Çalışmıyor

1. Responsive CSS'in yüklendiğini kontrol edin
2. Touch event desteği ekleyin (gelişmiş)
3. Viewport meta tag'inin doğru olduğunu kontrol edin

## 📊 Debug Mode

URL'ye `?debug=true` ekleyerek debug modunu açın:

```
http://localhost:8000?debug=true
```

Bu mod:
- ScrollTrigger markerlarını gösterir
- Console'da detaylı bilgi verir
- Animasyon tetikleme noktalarını görselleştirir

## 🎓 Öğrenme Kaynakları

### GSAP ScrollTrigger
- [Resmi Dokümantasyon](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [ScrollTrigger Demos](https://codepen.io/collection/AEbkkJ)

### CSS Animations
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [CSS Tricks Guide](https://css-tricks.com/almanac/properties/a/animation/)

## 📝 Lisans

Bu proje kişisel kullanım içindir. İstediğiniz gibi özelleştirebilir ve kullanabilirsiniz.

## 🤝 Katkıda Bulunma

Projeyi geliştirmek için:
1. Kendi özelleştirmelerinizi yapın
2. Yeni özellikler ekleyin
3. Kodunuzu optimize edin

## 📞 İletişim

Sorularınız için GitHub üzerinden iletişime geçebilirsiniz.

---

**🎉 İyi eğlenceler ve başarılı bir portfolyo!**
