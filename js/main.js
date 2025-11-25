// ============================
// GSAP VE SCROLLTRIGGER AYARLARI
// ============================

gsap.registerPlugin(ScrollTrigger);

// ============================
// NAVBAR SCROLL ANİMASYONU
// ============================

const navbar = document.querySelector('#navbar');
const hero = document.querySelector('#hero');

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

// CV indirme butonları
document.querySelectorAll('#download-cv, #nav-download-cv, #finale-download-cv').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('CV indirme özelliği yakında eklenecek!');
    });
});

// Smooth scroll
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
// CHECKPOINT SİSTEMİ
// ============================

const roadLine = document.querySelector('#road-line');
const scenes = document.querySelectorAll('.scene:not(.final)');

// Her sahne için checkpoint oluştur
const checkpoints = [];
scenes.forEach((scene, index) => {
    const checkpoint = document.createElement('div');
    checkpoint.className = 'checkpoint';
    checkpoint.style.left = `${(index + 1) * (100 / (scenes.length + 1))}%`;

    // Checkpoint label (başlık ve emoji/yıl)
    const label = document.createElement('div');
    label.className = 'checkpoint-label';

    const title = scene.getAttribute('data-title');
    const icon = scene.getAttribute('data-icon');
    const year = scene.getAttribute('data-year');

    if (icon) {
        const iconEl = document.createElement('span');
        iconEl.className = 'checkpoint-icon';
        iconEl.textContent = icon;
        label.appendChild(iconEl);
    }

    if (year) {
        const yearEl = document.createElement('span');
        yearEl.className = 'checkpoint-year';
        yearEl.textContent = year;
        label.appendChild(yearEl);
    }

    if (title) {
        const titleEl = document.createElement('div');
        titleEl.className = 'checkpoint-title';
        titleEl.textContent = title;
        label.appendChild(titleEl);
    }

    checkpoint.appendChild(label);
    roadLine.appendChild(checkpoint);
    checkpoints.push(checkpoint);
});

// ============================
// KARAKTER HAREKETİ VE BÜYÜMESI
// ============================

const character = document.querySelector('#character');
const characterContainer = document.querySelector('#character-container');
const storyContainer = document.querySelector('#story-container');
const finalSceneEl = document.querySelector('.scene.final');

// Karakteri checkpoint'ler boyunca hareket ettir
gsap.to(character, {
    scale: 3,
    scrollTrigger: {
        trigger: storyContainer,
        start: 'top top',
        end: () => `+=${storyContainer.scrollHeight - window.innerHeight * 2}`,
        scrub: 0.5,
        onUpdate: (self) => {
            const progress = self.progress;
            const moveDistance = window.innerWidth * 0.8;
            const currentX = moveDistance * progress;

            characterContainer.style.left = `calc(5% + ${currentX}px)`;
            characterContainer.style.top = '65%';

            // Checkpoint'lere yaklaştıkça renk değiştir
            checkpoints.forEach((cp, index) => {
                const checkpointProgress = (index + 1) / (checkpoints.length + 1);
                if (Math.abs(progress - checkpointProgress) < 0.05) {
                    cp.style.background = 'var(--success-color)';
                    cp.style.transform = 'translate(-50%, -50%) scale(1.3)';
                } else {
                    cp.style.background = 'var(--accent-color)';
                    cp.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            });
        }
    }
});

// ============================
// FİNAL SAHNESİ - KARAKTER DÜŞÜŞÜ
// ============================

ScrollTrigger.create({
    trigger: finalSceneEl,
    start: 'top 80%',
    onEnter: () => {
        gsap.to(characterContainer, {
            y: window.innerHeight,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.in'
        });

        navbar.classList.add('hidden');
        navbar.classList.remove('visible');
    },
    onLeaveBack: () => {
        gsap.to(characterContainer, {
            y: 0,
            opacity: 1,
            duration: 0.5
        });

        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
    }
});

// ============================
// FİNALE KARAKTER ALTTAN ÇIKIŞ
// ============================

const finaleCharacter = document.getElementById('finale-character');

if (finaleCharacter) {
    const finaleCharacterBody = finaleCharacter.querySelector('.character-body');

    gsap.set(finaleCharacterBody, {
        y: 300,
        opacity: 0
    });

    gsap.to(finaleCharacterBody, {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: 'elastic.out(1, 0.4)',
        scrollTrigger: {
            trigger: finalSceneEl,
            start: 'top 50%',
            toggleActions: 'play none none reverse'
        }
    });

    // Hafif sallanma
    gsap.to(finaleCharacterBody, {
        rotation: 5,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        scrollTrigger: {
            trigger: finalSceneEl,
            start: 'top 50%',
        }
    });
}

// ============================
// SAHNE FADE-IN ANİMASYONLARI
// ============================

scenes.forEach((scene) => {
    gsap.fromTo(scene,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            scrollTrigger: {
                trigger: scene,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 0.3,
                onEnter: () => scene.classList.add('active'),
                onLeave: () => scene.classList.remove('active'),
                onEnterBack: () => scene.classList.add('active'),
                onLeaveBack: () => scene.classList.remove('active'),
            }
        }
    );
});

// ============================
// YOL ÇİZGİSİ PROGRESS
// ============================

gsap.to(roadLine, {
    scrollTrigger: {
        trigger: storyContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
            const progress = self.progress * 100;
            roadLine.style.background = `linear-gradient(to right, 
                var(--success-color) 0%, 
                var(--success-color) ${progress}%, 
                var(--road-color) ${progress}%, 
                var(--road-color) 100%)`;
        }
    }
});

// ============================
// YÜRÜME ANİMASYONU
// ============================

const leftLeg = document.querySelector('.character-leg.left');
const rightLeg = document.querySelector('.character-leg.right');
const leftArm = document.querySelector('.character-arm.left');
const rightArm = document.querySelector('.character-arm.right');

function stopWalking() {
    if (leftLeg && rightLeg) {
        leftLeg.style.animation = 'none';
        rightLeg.style.animation = 'none';
    }
    if (leftArm && rightArm) {
        leftArm.style.animation = 'none';
        rightArm.style.animation = 'none';
    }
}

function startWalking() {
    if (leftLeg && rightLeg) {
        leftLeg.style.animation = 'walk-left 0.6s infinite';
        rightLeg.style.animation = 'walk-right 0.6s infinite';
    }
    if (leftArm && rightArm) {
        leftArm.style.animation = 'arm-swing-left 0.6s infinite';
        rightArm.style.animation = 'arm-swing-right 0.6s infinite';
    }
}

stopWalking();

let lastScrollY = window.scrollY;
let walkTimeout;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (Math.abs(currentScrollY - lastScrollY) > 3) {
        startWalking();

        clearTimeout(walkTimeout);
        walkTimeout = setTimeout(() => {
            stopWalking();
        }, 150);
    }

    lastScrollY = currentScrollY;
});

// ============================
// FINALE STİL ANİMASYONLARI
// ============================

const finaleName = document.querySelector('.finale-name');
const finaleSubtitle = document.querySelector('.finale-subtitle');

if (finalSceneEl && finaleName) {
    gsap.set(finalSceneEl, { opacity: 1 });

    gsap.fromTo(finaleName,
        { scale: 0.8, opacity: 0, y: 30 },
        {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: finalSceneEl,
                start: 'top 70%',
                end: 'top 40%',
                scrub: 0.5
            }
        }
    );

    if (finaleSubtitle) {
        gsap.fromTo(finaleSubtitle,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: finalSceneEl,
                    start: 'top 65%',
                    end: 'top 40%',
                    scrub: 0.5
                }
            }
        );
    }

    const storyItems = document.querySelectorAll('.story-item');
    storyItems.forEach((item, index) => {
        gsap.fromTo(item,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            {
                opacity: 1,
                x: 0,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    end: 'top 60%',
                    scrub: 0.3
                }
            }
        );
    });
}

// ============================
// SAYFA YÜKLENME
// ============================

window.addEventListener('load', () => {
    gsap.from(characterContainer, {
        x: -150,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    gsap.from(roadLine, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.5
    });
});

// ============================
// SCROLL HINT
// ============================

const scrollHintHTML = `
    <div class="scroll-hint">
        ⬇️ Kaydırarak hikayemi keşfedin
    </div>
`;

let scrollHintElement = null;

window.addEventListener('DOMContentLoaded', () => {
    if (window.scrollY === 0) {
        document.body.insertAdjacentHTML('beforeend', scrollHintHTML);
        scrollHintElement = document.querySelector('.scroll-hint');

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

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

console.log('✅ İyileştirilmiş Kariyer Hikayesi yüklendi!');
console.log('🎮 GSAP ScrollTrigger + Checkpoint Sistemi aktif');
console.log('🚀 ' + scenes.length + ' sahne + ' + checkpoints.length + ' checkpoint hazır');
