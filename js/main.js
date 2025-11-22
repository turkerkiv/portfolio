// ============================
// GSAP VE SCROLLTRIGGER AYARLARI
// ============================

gsap.registerPlugin(ScrollTrigger);

// ============================
// NAVBAR SCROLL ANİMASYONU
// ============================

const navbar = document.querySelector('#navbar');
const hero = document.querySelector('#hero');

// Hero section geçildiğinde navbar'ı göster
ScrollTrigger.create({
    trigger: hero,
    start: 'bottom top',
    onEnter: () => {
        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
    },
    onLeaveBack: () => {
        navbar.classList.add('hidden');
        navbar.classList.remove('visible');
    }
});

// CV indirme butonları için event listener
document.querySelectorAll('#download-cv, #nav-download-cv, #finale-download-cv').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('CV indirme özelliği yakında eklenecek!');
        // Buraya gerçek CV indirme linki eklenebilir:
        // window.open('path/to/cv.pdf', '_blank');
    });
});

// Smooth scroll için anchor linkleri
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================
// KARAKTER VE SCROLL SENKRONİZASYONU
// ============================

const character = document.querySelector('#character');
const characterContainer = document.querySelector('#character-container');
const scenes = document.querySelectorAll('.scene:not(.final)');
const finalSceneEl = document.querySelector('.scene.final');
const storyContainer = document.querySelector('#story-container');

// Scroll boyutunu hesapla
const totalScroll = storyContainer.scrollHeight - window.innerHeight;

// ============================
// KARAKTER PROGRESS BARDA KALSIN
// ============================

gsap.to(character, {
    scale: 2.5,
    scrollTrigger: {
        trigger: storyContainer,
        start: 'top top',
        end: () => `+=${storyContainer.scrollHeight - window.innerHeight - window.innerHeight}`, // Final sahneden önce bitir
        scrub: 0.3,
        onUpdate: (self) => {
            const progress = self.progress;

            // Karakteri progress bar üzerinde tut (yatayda hareket ettir)
            const moveDistance = window.innerWidth * 0.7;
            const currentX = moveDistance * progress;

            // Karakter her zaman progress bar üzerinde
            characterContainer.style.left = `calc(5% + ${currentX}px)`;
            characterContainer.style.top = '65%'; // Road-line ile aynı hizada
        }
    }
});

// ============================
// FİNAL SAHNESİ - KARAKTER AŞAĞI DÜŞSÜN
// ============================

ScrollTrigger.create({
    trigger: finalSceneEl,
    start: 'top 80%',
    onEnter: () => {
        // Karakteri aşağıya düşür ve gizle
        gsap.to(characterContainer, {
            y: window.innerHeight,
            opacity: 0,
            duration: 1,
            ease: 'power2.in'
        });

        // Navbar'ı gizle
        navbar.classList.add('hidden');
        navbar.classList.remove('visible');
    },
    onLeaveBack: () => {
        // Geri dönüldüğünde karakteri tekrar göster
        gsap.to(characterContainer, {
            y: 0,
            opacity: 1,
            duration: 0.5
        });

        // Navbar'ı tekrar göster
        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
    }
});

// ============================
// FİNALE KARAKTER ANİMASYONU
// ============================

const finaleCharacter = document.getElementById('finale-character');

if (finaleCharacter) {
    console.log('Finale character found:', finaleCharacter);
    const finaleCharacterBody = finaleCharacter.querySelector('.character-body');
    console.log('Finale character body found:', finaleCharacterBody);

    if (finaleCharacterBody) {
        // Başlangıç durumunu ayarla
        gsap.set(finaleCharacterBody, {
            y: 200,
            opacity: 0
        });

        gsap.to(finaleCharacterBody, {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
                trigger: finalSceneEl,
                start: 'top 60%',
                toggleActions: 'play none none reverse',
                onEnter: () => console.log('Finale character animation triggered')
            }
        });

        // Hafif sallanma animasyonu
        gsap.to(finaleCharacterBody, {
            rotation: 3,
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            scrollTrigger: {
                trigger: finalSceneEl,
                start: 'top 60%',
            }
        });
    } else {
        console.error('Finale character body not found!');
    }
} else {
    console.error('Finale character element not found!');
}

// ============================
// SAHNE FADE-IN ANİMASYONLARI
// ============================

scenes.forEach((scene, index) => {
    gsap.fromTo(scene,
        { opacity: 0 },
        {
            opacity: 1,
            scrollTrigger: {
                trigger: scene,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 0.2,
                onEnter: () => scene.classList.add('active'),
                onLeave: () => scene.classList.remove('active'),
                onEnterBack: () => scene.classList.add('active'),
                onLeaveBack: () => scene.classList.remove('active'),
            }
        }
    );
});

// ============================
// YOL ÇİZGİSİ PROGRESS ANİMASYONU
// ============================

const roadLine = document.querySelector('#road-line');

gsap.to(roadLine, {
    scrollTrigger: {
        trigger: storyContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2, // Daha hızlı tepki
        onUpdate: (self) => {
            const progress = self.progress * 100;
            roadLine.style.background = `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${progress}%, #535353 ${progress}%, #535353 100%)`;
        }
    }
});

// ============================
// KARAKTER YÜRÜME ANİMASYONU (SADECE SCROLL'DA)
// ============================

let lastScrollY = window.scrollY;
let isWalking = false;
let walkTimeout;

// Bacakları başlangıçta durdur
const leftLeg = document.querySelector('.character-leg.left');
const rightLeg = document.querySelector('.character-leg.right');

function stopWalking() {
    if (leftLeg && rightLeg) {
        leftLeg.style.animationPlayState = 'paused';
        rightLeg.style.animationPlayState = 'paused';
    }
    isWalking = false;
}

function startWalking() {
    if (leftLeg && rightLeg) {
        leftLeg.style.animationPlayState = 'running';
        rightLeg.style.animationPlayState = 'running';
    }
    isWalking = true;
}

// Başlangıçta durdur
stopWalking();

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Scroll hareket ediyorsa yürüme animasyonunu aktif et
    if (Math.abs(currentScrollY - lastScrollY) > 3) {
        if (!isWalking) {
            startWalking();
        }

        // Scroll durduğunda animasyonu durdur
        clearTimeout(walkTimeout);
        walkTimeout = setTimeout(() => {
            stopWalking();
        }, 150);
    }

    lastScrollY = currentScrollY;
});

// ============================
// FİNAL SAHNESI ÖZEL ANİMASYON
// ============================

const finaleName = document.querySelector('.finale-name');
const finaleSubtitle = document.querySelector('.finale-subtitle');

if (finalSceneEl && finaleName) {
    // Final sahneyi her zaman görünür yap
    gsap.set(finalSceneEl, { opacity: 1 });

    gsap.fromTo(finaleName,
        {
            scale: 0.9,
            opacity: 0,
            y: 20
        },
        {
            scale: 1,
            opacity: 1,
            y: 0,
            scrollTrigger: {
                trigger: finalSceneEl,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 0.3
            }
        }
    );

    if (finaleSubtitle) {
        gsap.fromTo(finaleSubtitle,
            {
                opacity: 0,
                y: 15
            },
            {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                    trigger: finalSceneEl,
                    start: 'top 75%',
                    end: 'top 50%',
                    scrub: 0.3
                }
            }
        );
    }

    // Story itemları sırayla animasyon
    const storyItems = document.querySelectorAll('.story-item');
    storyItems.forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                x: index % 2 === 0 ? -30 : 30
            },
            {
                opacity: 1,
                x: 0,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    end: 'top 65%',
                    scrub: 0.2
                }
            }
        );
    });
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
