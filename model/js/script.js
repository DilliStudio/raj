// ==================== GLOBAL STATE ====================
let currentPage = 'home';
let pageHistory = ['home'];
let soundEnabled = true;
let currentLightboxSrc = '';

// ==================== AUDIO CONTEXT ====================
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
}

function playSound(type) {
    if (!soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    switch(type) {
        case 'click':
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;
        case 'navigate':
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
        case 'back':
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
            break;
        case 'success':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523, now);
            osc.frequency.setValueAtTime(659, now + 0.1);
            osc.frequency.setValueAtTime(784, now + 0.2);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
            break;
        case 'hover':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
        case 'loading':
            osc.type = 'square';
            osc.frequency.setValueAtTime(200 + Math.random() * 400, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
        case 'pop':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
            break;
        case 'theme':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;
    }
}

// ==================== LOADING SCREEN ====================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Loading sounds at intervals
    const loadSoundInterval = setInterval(() => playSound('loading'), 200);
    
    setTimeout(() => {
        clearInterval(loadSoundInterval);
        loadingScreen.classList.add('hidden');
        playSound('success');
        initParticles();
        startTypedText();
        initCounters();
        initScrollAnimations();
    }, 3000);
});

// ==================== THEME TOGGLE ====================
const savedTheme = localStorage.getItem('dilliraja-theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    const themeIcon = document.getElementById('theme-toggle')?.querySelector('i');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
}

// ==================== COLOR PICKER ====================
const colorThemes = {
    teal:     { primary: '#00f5d4', accent: '#f15bb5', secondary: '#fee440', name: 'Teal Blue' },
    neon:     { primary: '#00ff88', accent: '#f15bb5', secondary: '#fee440', name: 'Neon Green' },
    purple:   { primary: '#a855f7', accent: '#f15bb5', secondary: '#fbbf24', name: 'Purple' },
    pink:     { primary: '#f15bb5', accent: '#00f5d4', secondary: '#fee440', name: 'Pink' },
    orange:   { primary: '#ff8800', accent: '#ff5500', secondary: '#fee440', name: 'Orange' },
    red:      { primary: '#ff4444', accent: '#ff0066', secondary: '#ffaa00', name: 'Red' },
    gold:     { primary: '#ffd700', accent: '#ff8800', secondary: '#00f5d4', name: 'Gold' },
    ocean:    { primary: '#0ea5e9', accent: '#f15bb5', secondary: '#00f5d4', name: 'Ocean' },
    mint:     { primary: '#34d399', accent: '#a855f7', secondary: '#fbbf24', name: 'Mint' },
    coral:    { primary: '#fb7185', accent: '#a855f7', secondary: '#fbbf24', name: 'Coral' },
    lavender: { primary: '#c084fc', accent: '#f15bb5', secondary: '#00f5d4', name: 'Lavender' },
    sunset:   { primary: '#f97316', accent: '#ec4899', secondary: '#fbbf24', name: 'Sunset' }
};

const colorBtn = document.getElementById('color-picker-btn');
const colorPanel = document.getElementById('color-panel');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const savedColor = localStorage.getItem('dilliraja-color') || 'teal';

// Settings panel toggle
settingsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('click');
    settingsPanel.classList.toggle('active');
    colorPanel.classList.remove('active');
});

// Color picker inside settings
colorBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('click');
    settingsPanel.classList.remove('active');
    colorPanel.classList.toggle('active');
});

// Close panels on outside click
document.addEventListener('click', (e) => {
    if (!settingsPanel?.contains(e.target) && !settingsBtn?.contains(e.target)) {
        settingsPanel?.classList.remove('active');
    }
    if (!colorPanel?.contains(e.target) && !colorBtn?.contains(e.target)) {
        colorPanel?.classList.remove('active');
    }
});

function applyColorTheme(colorName) {
    const theme = colorThemes[colorName];
    if (!theme) return;
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    localStorage.setItem('dilliraja-color', colorName);
    document.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.color === colorName);
    });
}

applyColorTheme(savedColor);

document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        playSound('pop');
        applyColorTheme(swatch.dataset.color);
        setTimeout(() => { colorPanel.classList.remove('active'); }, 300);
    });
});

function closeColorPanel() {
    colorPanel.classList.remove('active');
    settingsPanel?.classList.remove('active');
}

// Sound toggle
document.getElementById('sound-toggle')?.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('click');
    soundEnabled = !soundEnabled;
    const icon = e.currentTarget.querySelector('i');
    icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    e.currentTarget.classList.toggle('muted', !soundEnabled);
    settingsPanel?.classList.remove('active');
});

// Theme toggle
document.getElementById('theme-toggle')?.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('theme');
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    const icon = e.currentTarget.querySelector('i');
    icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('dilliraja-theme', isLight ? 'light' : 'dark');
    settingsPanel?.classList.remove('active');
});

// ==================== PARTICLES ====================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = ['#00f5d4', '#f15bb5', '#fee440', '#9b5de5'][Math.floor(Math.random() * 4)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#00f5d4';
                    ctx.globalAlpha = 0.05 * (1 - dist / 120);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== TYPED TEXT EFFECT ====================
function startTypedText() {
    const texts = [
        'Web Developer',
        'UI/UX Designer',
        'WordPress Expert',
        'Frontend Developer',
        'Problem Solver'
    ];
    const el = document.getElementById('typed-text');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = texts[textIndex];
        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }

    type();
}

// ==================== NAVIGATION ====================
function navigateTo(page) {
    playSound('navigate');

    const allPages = document.querySelectorAll('.page');
    allPages.forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById('page-' + page);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.scrollTop = 0;
        window.scrollTo(0, 0);
    }

    pageHistory.push(page);
    currentPage = page;

    // Show/hide back button
    const backBtn = document.getElementById('btn-back');
    if (backBtn) {
        backBtn.style.display = page === 'home' ? 'none' : 'flex';
    }

    // Re-init counters if about page
    if (page === 'about' || page === 'home') {
        setTimeout(() => initCounters(), 300);
    }
}

function goBack() {
    playSound('back');
    pageHistory.pop();
    const prevPage = pageHistory[pageHistory.length - 1] || 'home';
    navigateTo(prevPage);
    pageHistory.pop(); // Remove duplicate from navigateTo push
}

// ==================== SERVICE TOGGLE ====================
function toggleService(header) {
    playSound('click');
    const content = header.nextElementSibling;
    const isOpen = content.classList.contains('open');

    // Close all other services
    document.querySelectorAll('.service-content.open').forEach(c => {
        c.classList.remove('open');
        c.previousElementSibling.classList.remove('active');
    });

    if (!isOpen) {
        content.classList.add('open');
        header.classList.add('active');
    }
}

// ==================== COUNTER ANIMATION ====================
function initCounters() {
    const counters = document.querySelectorAll('.stat-card[data-count]');
    counters.forEach(card => {
        const target = parseInt(card.getAttribute('data-count'));
        const numberEl = card.querySelector('.stat-number');
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);

        function updateCounter() {
            current += step;
            if (current >= target) {
                numberEl.textContent = target;
            } else {
                numberEl.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            }
        }

        // Use Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    current = 0;
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(card);
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const animElements = document.querySelectorAll('.glass-card, .category-card, .portfolio-card, .social-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ==================== LIGHTBOX ====================
function openLightbox(src) {
    playSound('click');
    currentLightboxSrc = src;
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function downloadLightboxImage() {
    playSound('success');
    const a = document.createElement('a');
    a.href = currentLightboxSrc;
    a.download = currentLightboxSrc.split('/').pop().split('?')[0];
    a.click();
    showToast('Image downloaded!');
}

function shareLightboxImage() {
    playSound('click');
    if (navigator.share) {
        fetch(currentLightboxSrc).then(r => r.blob()).then(blob => {
            const file = new File([blob], 'DilliRaja-Design.png', { type: blob.type });
            navigator.share({ files: [file], title: 'DilliRaja S - Design' }).catch(() => {});
        });
    } else {
        navigator.clipboard.writeText(window.location.origin + '/' + currentLightboxSrc).then(() => {
            showToast('Image link copied!');
        });
    }
}

// ==================== SHARE VIA DEVICES ====================
function shareVia(method) {
    playSound('click');
    const shareUrl = 'https://dillistudio.github.io/raj/';
    const shareText = 'Check out DilliRaja S - Web Developer & UI/UX Designer\nPhone: +91 9500388259\nPortfolio: ' + shareUrl;

    switch(method) {
        case 'bluetooth':
            if (navigator.share) {
                navigator.share({ title: 'DilliRaja S', text: shareText, url: shareUrl }).catch(() => {});
            } else {
                showToast('Use native share on your device');
            }
            break;
        case 'email':
            window.open('mailto:?subject=Contact DilliRaja S - Web Developer&body=' + encodeURIComponent(shareText), '_blank');
            showToast('Opening email...');
            break;
        case 'whatsapp':
            window.open('https://wa.me/?text=' + encodeURIComponent(shareText), '_blank');
            showToast('Opening WhatsApp...');
            break;
        case 'telegram':
            window.open('https://t.me/share/url?url=' + encodeURIComponent(shareUrl) + '&text=' + encodeURIComponent(shareText), '_blank');
            showToast('Opening Telegram...');
            break;
        case 'sms':
            window.open('sms:?body=' + encodeURIComponent(shareText), '_blank');
            showToast('Opening SMS...');
            break;
        case 'clipboard':
            navigator.clipboard.writeText(shareText).then(() => {
                showToast('Copied to clipboard!');
            }).catch(() => {
                var ta = document.createElement('textarea');
                ta.value = shareText;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                showToast('Copied to clipboard!');
            });
            break;
    }
}

// ==================== SAVE CONTACT ====================
document.getElementById('btn-save-contact')?.addEventListener('click', () => {
    playSound('success');

    const vCard = 'BEGIN:VCARD\nVERSION:3.0\nN:S;DilliRaja;;;\nFN:DilliRaja S\nORG:DilliRaja Web Development\nTEL;TYPE=CELL:+919500388259\nEMAIL:dilliraja20et03@gmail.com\nURL:https://dillistudio.github.io/raj/\nADR;TYPE=WORK:;;Arani;;Tamil Nadu;;India\nNOTE:Web Developer & UI/UX Designer\nEND:VCARD';

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DilliRaja_S.vcf';
    a.click();
    URL.revokeObjectURL(url);

    showToast('Contact card downloaded!');
});

// ==================== SHARE CONTACT ====================
document.getElementById('btn-share-contact')?.addEventListener('click', async () => {
    playSound('click');

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'DilliRaja S - Web Developer',
                text: 'Contact DilliRaja S - Web Developer & UI/UX Designer\nPhone: +91 9500388259\nEmail: dilliraja20et03@gmail.com\nPortfolio: https://dillistudio.github.io/raj/',
                url: 'https://dillistudio.github.io/raj/'
            });
            showToast('Shared successfully!');
        } catch (e) {
            if (e.name !== 'AbortError') {
                fallbackShare();
            }
        }
    } else {
        fallbackShare();
    }
});

function fallbackShare() {
    const text = 'Contact DilliRaja S - Web Developer\nPhone: +91 9500388259\nEmail: dilliraja20et03@gmail.com\nPortfolio: https://dillistudio.github.io/raj/';
    const url = 'https://wa.me/?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
    showToast('Opening WhatsApp to share...');
}

// ==================== ENQUIRY FORM ====================
document.getElementById('enquiry-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    playSound('success');

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const phone = document.getElementById('form-phone').value;
    const service = document.getElementById('form-service').value;
    const message = document.getElementById('form-message').value;

    const serviceText = document.getElementById('form-service').options[document.getElementById('form-service').selectedIndex].text;

    const waMessage = `Hi DilliRaja! ðŸ‘‹

New Enquiry from ${name}

ðŸ“§ Email: ${email}
ðŸ“± Phone: ${phone}
ðŸ’¼ Service: ${serviceText}
ðŸ’¬ Message: ${message || 'N/A'}

Sent from your portfolio website.`;

    window.open(`https://wa.me/919500388259?text=${encodeURIComponent(waMessage)}`, '_blank');

    showToast('Enquiry sent via WhatsApp!');
    e.target.reset();
});

// ==================== HEADER BUTTONS ====================
document.getElementById('btn-categories')?.addEventListener('click', () => {
    playSound('click');
    navigateTo('categories');
});

document.getElementById('btn-next')?.addEventListener('click', () => {
    playSound('click');
    const storySection = document.getElementById('story-section');
    if (storySection) {
        storySection.scrollIntoView({ behavior: 'smooth' });
    }
});

document.getElementById('close-curved-box')?.addEventListener('click', () => {
    playSound('click');
    const box = document.getElementById('curved-box');
    box.style.maxHeight = '0';
    box.style.opacity = '0';
    box.style.padding = '0';
    box.style.margin = '0';
    setTimeout(() => {
        box.style.maxHeight = '';
        box.style.opacity = '';
        box.style.padding = '';
        box.style.margin = '';
    }, 3000);
});

// ==================== GAME HOVER SOUND ====================
document.querySelectorAll('.game-hover').forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', () => playSound('pop'));
});

// ==================== TOAST ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==================== DEVELOPER LINK HIDDEN ====================
document.getElementById('developer-link')?.addEventListener('click', () => {
    playSound('click');
    // Hidden link - only accessible by clicking developer name
    window.open('https://dilliraja.lovable.app', '_blank');
});

// ==================== TILT EFFECT ON CARDS ====================
document.querySelectorAll('.stat-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(500px) rotateX(0) rotateY(0)';
    });
});

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentPage !== 'home') {
        goBack();
    }
});

// ==================== TOUCH RIPPLE EFFECT ====================
document.addEventListener('touchstart', (e) => {
    const target = e.target.closest('.game-hover, .btn-icon, button');
    if (!target) return;

    const ripple = document.createElement('div');
    const rect = target.getBoundingClientRect();
    const touch = e.touches[0];
    
    ripple.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(0, 245, 212, 0.3);
        left: ${touch.clientX - rect.left - 5}px;
        top: ${touch.clientY - rect.top - 5}px;
        transform: scale(0);
        animation: ripple-effect 0.6s ease-out;
        pointer-events: none;
        z-index: 100;
    `;

    if (!target.style.position || target.style.position === 'static') {
        target.style.position = 'relative';
    }
    target.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}, { passive: true });

// Add ripple keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to { transform: scale(20); opacity: 0; }
    }
`;
document.head.appendChild(style);
