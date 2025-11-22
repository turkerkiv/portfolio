// ============================
// GSAP VE SCROLLTRIGGER AYARLARI
// ============================

gsap.registerPlugin(ScrollTrigger);

// ============================
// KARAKTER VE SCROLL SENKRONİZASYONU
// ============================

const character = document.querySelector('#character');
const characterContainer = document.querySelector('#character-container');
const scenes = document.querySelectorAll('.scene');
const storyContainer = document.querySelector('#story-container');

// Scroll boyutunu hesapla
const totalScroll = storyContainer.scrollHeight - window.innerHeight;

// ============================
// KARAKTER BÜYÜME VE HAREKET ANİMASYONU
// ============================

gsap.to(character, {
    scale: 3.5, // Karakterin büyüme oranı (başlangıç 1x -> son 3.5x)
    scrollTrigger: {
        trigger: storyContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
            // Scroll ilerlemesini hesapla (0-1 arası)
            const progress = self.progress;

            // Karakteri yatayda hareket ettir (soldan sağa)
            const moveDistance = window.innerWidth * 0.75; // Ekranın %75'i kadar
            const currentX = moveDistance * progress;

            characterContainer.style.left = `calc(5% + ${currentX}px)`;

            // Debug için (isteğe bağlı)
            // console.log(`Progress: ${(progress * 100).toFixed(1)}%`);
        }
    }
});

// ============================
// SAHNE FADE-IN ANİMASYONLARI
// ============================

scenes.forEach((scene, index) => {
    gsap.fromTo(scene,
        {
            opacity: 0,
            x: 100,
        },
        {
            opacity: 1,
            x: 0,
            scrollTrigger: {
                trigger: scene,
                start: 'top 80%', // Sahne ekranın %80'ine geldiğinde
                end: 'top 30%',   // %30'a geldiğinde
                scrub: 0.5,
                onEnter: () => scene.classList.add('active'),
                onLeave: () => scene.classList.remove('active'),
                onEnterBack: () => scene.classList.add('active'),
                onLeaveBack: () => scene.classList.remove('active'),
            }
        }
    );

    // Sahne içeriklerine paralaks efekti
    const sceneContent = scene.querySelector('.scene-content');
    if (sceneContent) {
        gsap.to(sceneContent, {
            y: -50,
            scrollTrigger: {
                trigger: scene,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
});

// ============================
// YOL ÇİZGİSİ PROGRESS ANİMASYONU
// ============================

const roadLine = document.querySelector('#road-line');

gsap.to(roadLine, {
    background: 'linear-gradient(to right, #10b981 0%, #10b981 var(--progress), #475569 var(--progress), #475569 100%)',
    scrollTrigger: {
        trigger: storyContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress * 100;
            document.documentElement.style.setProperty('--progress', `${progress}%`);
        }
    }
});

// ============================
// KARAKTER YÜRÜME ANİMASYONU (SCROLL BASED)
// ============================

let lastScrollY = window.scrollY;
let isWalking = false;
let walkTimeout;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Scroll hareket ediyorsa yürüme animasyonunu aktif et
    if (Math.abs(currentScrollY - lastScrollY) > 5) {
        if (!isWalking) {
            character.style.animation = 'walking 0.6s infinite';
            isWalking = true;
        }

        // Scroll durduğunda animasyonu durdur
        clearTimeout(walkTimeout);
        walkTimeout = setTimeout(() => {
            character.style.animation = 'none';
            isWalking = false;
        }, 150);
    }

    lastScrollY = currentScrollY;
});

// ============================
// FİNAL SAHNESI ÖZEL ANİMASYON
// ============================

const finalScene = document.querySelector('.scene.final');
const finaleTitle = document.querySelector('.finale-title');

if (finalScene && finaleTitle) {
    gsap.fromTo(finaleTitle,
        {
            scale: 0.5,
            opacity: 0,
            rotation: -10
        },
        {
            scale: 1,
            opacity: 1,
            rotation: 0,
            scrollTrigger: {
                trigger: finalScene,
                start: 'top 60%',
                end: 'center center',
                scrub: 1
            }
        }
    );
}

// ============================
// SAYFA YÜKLENME ANİMASYONU
// ============================

window.addEventListener('load', () => {
    // Karakter giriş animasyonu
    gsap.from(characterContainer, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Yol çizgisi giriş animasyonu
    gsap.from(roadLine, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
    });
});

// ============================
// RESPONSIVE SCROLL HINT (İSTEĞE BAĞLI)
// ============================

const scrollHintHTML = `
    <div class="scroll-hint">
        ⬇️ Kaydırarak hikayemi keşfedin
    </div>
`;

// İlk scroll'da ipucunu gizle
let scrollHintElement = null;

window.addEventListener('DOMContentLoaded', () => {
    if (window.scrollY === 0) {
        document.body.insertAdjacentHTML('beforeend', scrollHintHTML);
        scrollHintElement = document.querySelector('.scroll-hint');

        // İlk scroll'da kaldır
        const removeHint = () => {
            if (scrollHintElement && window.scrollY > 50) {
                gsap.to(scrollHintElement, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => scrollHintElement.remove()
                });
                window.removeEventListener('scroll', removeHint);
            }
        };

        window.addEventListener('scroll', removeHint);
    }
});

// ============================
// PERFORMANS OPTİMİZASYONU
// ============================

// ScrollTrigger'ı güncelle (resize durumunda)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ============================
// DEBUG MODE (GELİŞTİRME İÇİN)
// ============================

// Debug mode'u açmak için URL'e ?debug=true ekleyin
const urlParams = new URLSearchParams(window.location.search);
const debugMode = urlParams.get('debug') === 'true';

if (debugMode) {
    // ScrollTrigger markerlarını göster
    ScrollTrigger.getAll().forEach(trigger => {
        trigger.vars.markers = true;
    });

    console.log('🔍 Debug Mode Aktif');
    console.log('📊 Toplam Sahne Sayısı:', scenes.length);
    console.log('📏 Toplam Scroll Mesafesi:', totalScroll + 'px');
}

// ============================
// SMOOTH SCROLL (İSTEĞE BAĞLI)
// ============================

// Daha yumuşak scroll için (isteğe bağlı)
// Locomotive Scroll veya benzeri kütüphane kullanılabilir
// Şu an vanilla implementasyon yeterli

console.log('✅ Kariyer Hikayesi yüklendi!');
console.log('🎮 GSAP ScrollTrigger aktif');
console.log('🚀 ' + scenes.length + ' sahne hazır');
