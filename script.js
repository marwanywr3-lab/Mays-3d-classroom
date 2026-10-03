/**
 * ============================================================================
 * Saudi National Day 96 - Virtual Classroom (مدرسة 15 الابتدائية - صف خامس)
 * Level 2: Advanced Interactive Systems, Audio-Visual Exhibits & UI Handlers
 * ============================================================================
 */

class ClassroomExperience {
    constructor() {
        this.selectedExhibit = null;
        this.isAudioPlaying = false;
        this.audioContext = null;
        this.interactiveHotspots = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.initExhibitData();
    }

    /**
     * Initialize rich metadata and project exhibits created by grade 5 students
     */
    initExhibitData() {
        this.exhibits = {
            art: {
                title: "معرض الفنون الوطنية — صف خامس",
                author: "طالبات صف خامس / ابتدائي ١٥",
                description: "لوحات فنية وتصاميم تعبيرية تجسد حب الوطن والاعتزاز بالهوية السعودية بمناسبة اليوم الوطني 96 'عزنا بطبعنا'."
            },
            history: {
                title: "ركن التأسيس والمجد",
                author: "إشراف المعلمة أروى البهلال",
                description: "توثيق مسيرة التأسيس والتوحيد وإنجازات الرؤية الطموحة التي تقودها مملكتنا الحبيبة نحو المستقبل."
            },
            celebration: {
                title: "جدارية الفخر والاعتزاز",
                author: "مدرسة 15 الابتدائية",
                description: "مشاركات الطالبات والقصائد الوطنية وعبارات الولاء والانتماء للقيادة الرشيدة."
            }
        };
    }

    /**
     * Setup Raycasting for interactive student desks and exhibition boards in the 3D scene
     */
    setupInteractions(camera, scene, domElement) {
        domElement.addEventListener('click', (event) => {
            // Only trigger if pointer lock is not active or user clicked an UI element
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, camera);
            // Additional interaction hooks can be registered here for 3D elements
        });
    }

    /**
     * Trigger festive audio chime effect using Web Audio API (Synthesized National Tune Chime)
     */
    playCelebrationChime() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

                    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);

                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);

                    osc.start();
                    osc.stop(this.audioContext.currentTime + 0.8);
                }, index * 150);
            });
        } catch (e) {
            console.log("Audio context requires user interaction first.");
        }
    }

    /**
     * Display interactive modal popup for exhibits when selected
     */
    showExhibitModal(exhibitKey) {
        const data = this.exhibits[exhibitKey];
        if (!data) return;

        // Remove any existing modal
        const existingModal = document.getElementById('exhibit-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'exhibit-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(11, 61, 32, 0.95);
            border: 2px solid #d4af37;
            padding: 30px;
            border-radius: 16px;
            z-index: 1000;
            width: 400px;
            max-width: 90%;
            text-align: right;
            box-shadow: 0 15px 40px rgba(0,0,0,0.6);
            backdrop-filter: blur(10px);
            color: #ffffff;
            direction: rtl;
        `;

        modal.innerHTML = `
            <div style="font-size: 1.3rem; font-weight: bold; color: #d4af37; margin-bottom: 10px;">${data.title}</div>
            <div style="font-size: 0.9rem; color: #a3c9b8; margin-bottom: 15px;">${data.author}</div>
            <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 25px; color: #f0f2f5;">${data.description}</p>
            <button id="close-modal" style="
                background: #d4af37;
                color: #0b3d20;
                border: none;
                padding: 10px 25px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                font-size: 1rem;
            ">إغلاق العرض</button>
        `;

        document.body.appendChild(modal);
        this.playCelebrationChime();

        document.getElementById('close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }
}

// Instantiate global experience manager for Level 2 integration
window.classroomExperience = new ClassroomExperience();
