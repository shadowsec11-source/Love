// Initialize AOS (Animate on Scroll) simulation
function initAOS() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Scale cursor on hover
    const hoverElements = document.querySelectorAll('a, button, .gallery-item, .reason-card, .stat-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            follower.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
        });
    });
}

// Three.js 3D Background
function init3DBackground() {
    const canvas = document.getElementById('bg3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 30;

    // Create floating hearts
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
    heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
    heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

    const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    const hearts = [];
    const heartCount = 30;

    for (let i = 0; i < heartCount; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() > 0.5 ? 0xD4AF37 : 0xE75480,
            emissive: Math.random() > 0.5 ? 0xD4AF37 : 0xE75480,
            emissiveIntensity: 0.2,
            shininess: 100,
            transparent: true,
            opacity: 0.6
        });

        const heart = new THREE.Mesh(heartGeometry, material);
        heart.position.x = (Math.random() - 0.5) * 50;
        heart.position.y = (Math.random() - 0.5) * 50;
        heart.position.z = (Math.random() - 0.5) * 50;
        heart.rotation.x = Math.random() * Math.PI;
        heart.rotation.y = Math.random() * Math.PI;
        heart.scale.set(0.5, 0.5, 0.5);

        heart.userData = {
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            rotation: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        };

        hearts.push(heart);
        scene.add(heart);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xD4AF37, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xE75480, 1, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Mouse interaction
    let mouseXNorm = 0, mouseYNorm = 0;
    document.addEventListener('mousemove', (e) => {
        mouseXNorm = (e.clientX / window.innerWidth) * 2 - 1;
        mouseYNorm = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Animate hearts
        hearts.forEach(heart => {
            heart.position.x += heart.userData.velocity.x;
            heart.position.y += heart.userData.velocity.y;
            heart.position.z += heart.userData.velocity.z;

            // Boundary check
            if (Math.abs(heart.position.x) > 25) heart.userData.velocity.x *= -1;
            if (Math.abs(heart.position.y) > 25) heart.userData.velocity.y *= -1;
            if (Math.abs(heart.position.z) > 25) heart.userData.velocity.z *= -1;

            heart.rotation.x += heart.userData.rotation.x;
            heart.rotation.y += heart.userData.rotation.y;
            heart.rotation.z += heart.userData.rotation.z;
        });

        // Camera follows mouse
        camera.position.x += (mouseXNorm * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseYNorm * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Stats Counter Animation
function animateStats() {
    fetch('/api/stats')
        .then(res => res.json())
        .then(data => {
            animateValue('daysTogether', 0, data.days_together, 2000);
            animateValue('messagesSent', 0, data.messages_sent, 2000);
            animateValue('photosShared', 0, data.photos_shared, 2000);
            animateValue('loveLevel', 0, data.love_level, 2000);
        })
        .catch(err => {
            console.log('Stats API not available, using demo values');
            animateValue('daysTogether', 0, 365, 2000);
            animateValue('messagesSent', 0, 42, 2000);
            animateValue('photosShared', 0, 15, 2000);
            animateValue('loveLevel', 0, 100, 2000);
        });
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            obj.textContent = Math.round(end);
            clearInterval(timer);
        } else {
            obj.textContent = Math.round(current);
        }
    }, 16);
}

// Load Photos
function loadPhotos() {
    fetch('/api/photos')
        .then(res => res.json())
        .then(photos => {
            if (photos.length > 0) {
                const gallery = document.getElementById('photoGallery');
                gallery.innerHTML = '';

                photos.forEach((photo, index) => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.setAttribute('data-aos', 'zoom-in');
                    item.setAttribute('data-aos-delay', index * 50);

                    item.innerHTML = `<img src="${photo.url}" alt="Memory ${index + 1}">`;
                    item.onclick = () => openImageModal(photo.url);

                    gallery.appendChild(item);
                });

                // Reinitialize AOS for new elements
                initAOS();
            }
        })
        .catch(err => {
            console.log('Photos API not available');
        });
}

// Upload Photo
async function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    showToast('Uploading photo... ✨');

    try {
        const response = await fetch('/api/upload-photo', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showToast('Photo uploaded successfully! 💕');
            loadPhotos();
        } else {
            showToast('Upload failed. Please try again.');
        }
    } catch (err) {
        // Demo mode - show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const gallery = document.getElementById('photoGallery');
            if (gallery.querySelector('.gallery-placeholder')) {
                gallery.innerHTML = '';
            }

            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${e.target.result}" alt="New Memory">`;
            item.onclick = () => openImageModal(e.target.result);
            gallery.appendChild(item);

            showToast('Photo added! (Demo mode - upload to save permanently) 📸');
        };
        reader.readAsDataURL(file);
    }
}

// Open Image Modal
function openImageModal(url) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="this.parentElement.remove()">
            <img src="${url}" alt="Full size image" style="max-width: 90vw; max-height: 90vh; border-radius: 10px;">
        </div>
    `;
    document.body.appendChild(modal);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        .modal-backdrop {
            background: rgba(0, 0, 0, 0.9);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Load Messages
function loadMessages() {
    fetch('/api/messages')
        .then(res => res.json())
        .then(messages => {
            const wall = document.getElementById('messagesWall');
            wall.innerHTML = '';

            messages.reverse().forEach((msg, index) => {
                const card = document.createElement('div');
                card.className = 'message-card';
                card.setAttribute('data-aos', 'fade-up');
                card.setAttribute('data-aos-delay', index * 50);

                const date = new Date(msg.timestamp);
                const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                card.innerHTML = `
                    <div class="message-text">${msg.text}</div>
                    <div class="message-time">${timeStr}</div>
                `;

                wall.appendChild(card);
            });

            initAOS();
        })
        .catch(err => {
            console.log('Messages API not available');
        });
}

// Submit Message
async function submitMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();

    if (!text) {
        showToast('Please write a message first! 💭');
        return;
    }

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, type: 'love' })
        });

        if (response.ok) {
            showToast('Message sent with love! 💕');
            input.value = '';
            loadMessages();
        }
    } catch (err) {
        // Demo mode
        const wall = document.getElementById('messagesWall');
        const card = document.createElement('div');
        card.className = 'message-card';
        card.innerHTML = `
            <div class="message-text">${text}</div>
            <div class="message-time">Just now (Demo mode)</div>
        `;
        wall.insertBefore(card, wall.firstChild);

        input.value = '';
        showToast('Message added! (Demo mode - start server to save) 💌');
    }
}

// Show Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Smooth Scroll for Nav Links
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Nav Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Particle Effect on Click
document.addEventListener('click', (e) => {
    createParticles(e.clientX, e.clientY);
});

function createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = Math.random() > 0.5 ? '#D4AF37' : '#E75480';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.opacity = '1';

        const angle = (Math.PI * 2 * i) / 5;
        const velocity = 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        document.body.appendChild(particle);

        let opacity = 1;
        let posX = x;
        let posY = y;

        const animate = () => {
            opacity -= 0.02;
            posX += vx;
            posY += vy;

            particle.style.opacity = opacity;
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        animate();
    }
}

// Initialize everything on page load
window.addEventListener('load', () => {
    // Hide loading screen
    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('hidden');
    }, 1500);

    // Initialize features
    initAOS();
    initCustomCursor();
    init3DBackground();
    animateStats();
    loadPhotos();
    loadMessages();

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Press 'U' to upload photo
        if (e.key.toLowerCase() === 'u' && !e.target.matches('input, textarea')) {
            document.getElementById('photoUpload').click();
        }
        // Press 'M' to focus message input
        if (e.key.toLowerCase() === 'm' && !e.target.matches('input, textarea')) {
            document.getElementById('messageInput').focus();
        }
    });
});

// Easter egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }

    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Secret animation!
        showToast('💖 You found the secret! Extra love unlocked! 💖');

        // Create heart explosion
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createHeartExplosion();
            }, i * 100);
        }
    }
});

function createHeartExplosion() {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = '-50px';
    heart.style.fontSize = '2rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';

    document.body.appendChild(heart);

    let pos = -50;
    const speed = Math.random() * 3 + 2;

    const fall = () => {
        pos += speed;
        heart.style.top = pos + 'px';
        heart.style.transform = `rotate(${pos}deg)`;

        if (pos < window.innerHeight) {
            requestAnimationFrame(fall);
        } else {
            heart.remove();
        }
    };

    fall();
}