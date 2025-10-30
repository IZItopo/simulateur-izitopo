// ==================== SIMULATEUR GPS RTK ====================

class GPSSimulator {
    constructor() {
        this.canvas = document.getElementById('targetCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Centre de la cible (coordonnées réelles)
        this.centerX = parseFloat(document.getElementById('centerX').value);
        this.centerY = parseFloat(document.getElementById('centerY').value);
        this.centerZ = parseFloat(document.getElementById('centerZ').value);
        
        // Position actuelle GPS
        this.currentX = this.centerX;
        this.currentY = this.centerY;
        this.currentZ = this.centerZ;
        
        // Position sur la cible (pixels)
        this.targetPosX = this.canvas.width / 2;
        this.targetPosY = this.canvas.height / 2;
        
        // Échelle : 1m de rayon
        this.scale = 150; // 150 pixels = 1 mètre
        
        // État RTK
        this.status = 'Fixe';
        this.hrmsMax = 0.030;
        this.vrrmsMax = 0.050;
        this.currentHrms = 0.009;
        this.currentVrrms = 0.015;
        this.currentSats = 29;
        
        // Animation
        this.animationFrame = null;
        this.noiseOffset = 0;
        
        this.init();
    }
    
    init() {
        // Dessiner la cible initiale
        this.drawTarget();
        
        // Event listeners
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        document.getElementById('setCenterBtn').addEventListener('click', () => this.setCenter());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        // Slider Z
        const zSlider = document.getElementById('zSlider');
        zSlider.addEventListener('input', (e) => {
            const deltaZ = parseFloat(e.target.value);
            document.getElementById('zSliderValue').textContent = deltaZ.toFixed(2);
            this.updateZPosition(deltaZ);
        });
        
        // Radio buttons pour le statut
        document.querySelectorAll('input[name="status"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.status = e.target.value;
                this.updateDisplay();
                window.dispatchEvent(new CustomEvent('gpsUpdate', { 
                    detail: this.getGPSData() 
                }));
            });
        });
        
        // Inputs précisions
        document.getElementById('hrmsMax').addEventListener('change', (e) => {
            this.hrmsMax = parseFloat(e.target.value);
        });
        
        document.getElementById('vrrmsMax').addEventListener('change', (e) => {
            this.vrrmsMax = parseFloat(e.target.value);
        });
        
        // Démarrer l'animation des variations
        this.startAnimation();
    }
    
    updateZPosition(deltaZ) {
        // Mettre à jour Z en fonction du slider
        this.currentZ = this.centerZ + deltaZ + this.randomNoise(this.vrrmsMax);
        this.updateDisplay();
        
        // Envoyer les données vers l'app
        window.dispatchEvent(new CustomEvent('gpsUpdate', { 
            detail: this.getGPSData() 
        }));
    }
    
    drawTarget() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Effacer
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Cercles concentriques (tous les 0.25m)
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, this.scale * i * 0.25, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Axes principaux
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - this.scale);
        this.ctx.lineTo(centerX, centerY + this.scale);
        this.ctx.moveTo(centerX - this.scale, centerY);
        this.ctx.lineTo(centerX + this.scale, centerY);
        this.ctx.stroke();
        
        // Flèche Nord
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('N', centerX, centerY - this.scale - 10);
        
        // Labels de distance
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#666';
        this.ctx.fillText('0.25m', centerX + this.scale * 0.25 + 5, centerY - 5);
        this.ctx.fillText('0.5m', centerX + this.scale * 0.5 + 5, centerY - 5);
        this.ctx.fillText('0.75m', centerX + this.scale * 0.75 + 5, centerY - 5);
        this.ctx.fillText('1m', centerX + this.scale + 5, centerY - 5);
        
        // Point GPS actuel avec bruit
        const noiseX = Math.sin(this.noiseOffset) * 2;
        const noiseY = Math.cos(this.noiseOffset * 1.3) * 2;
        
        let color = '#4caf50'; // Fixe
        if (this.status === 'Flottant') color = '#ff9800';
        if (this.status === 'Autonome') color = '#f44336';
        
        // Point GPS
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(this.targetPosX + noiseX, this.targetPosY + noiseY, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Halo de précision
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.targetPosX, this.targetPosY, this.currentHrms * this.scale * 100, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
        
        // Croix centrale si au centre
        if (Math.abs(this.targetPosX - centerX) < 5 && Math.abs(this.targetPosY - centerY) < 5) {
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 10, centerY);
            this.ctx.lineTo(centerX + 10, centerY);
            this.ctx.moveTo(centerX, centerY - 10);
            this.ctx.lineTo(centerX, centerY + 10);
            this.ctx.stroke();
        }
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Calculer le déplacement en pixels
        const deltaPixelX = x - centerX;
        const deltaPixelY = y - centerY;
        
        // Convertir en mètres (Y inversé car canvas a Y vers le bas)
        const deltaMetersX = deltaPixelX / this.scale;
        const deltaMetersY = -deltaPixelY / this.scale;
        
        // Calculer nouvelles coordonnées avec bruit (X et Y seulement)
        this.currentX = this.centerX + deltaMetersX + this.randomNoise(this.hrmsMax);
        this.currentY = this.centerY + deltaMetersY + this.randomNoise(this.hrmsMax);
        
        // Z est contrôlé par le slider, on le met à jour avec le bruit
        const deltaZ = parseFloat(document.getElementById('zSlider').value);
        this.currentZ = this.centerZ + deltaZ + this.randomNoise(this.vrrmsMax);
        
        // Mettre à jour position sur cible
        this.targetPosX = x;
        this.targetPosY = y;
        
        // Mettre à jour affichage
        this.updateDisplay();
        
        // Envoyer les données vers l'app
        window.dispatchEvent(new CustomEvent('gpsUpdate', { 
            detail: this.getGPSData() 
        }));
        
        // Redessiner
        this.drawTarget();
    }
    
    randomNoise(max) {
        return (Math.random() - 0.5) * 2 * max;
    }
    
    updateDisplay() {
        // Position actuelle
        document.getElementById('currentX').textContent = this.currentX.toFixed(3);
        document.getElementById('currentY').textContent = this.currentY.toFixed(3);
        document.getElementById('currentZ').textContent = this.currentZ.toFixed(3);
        
        // Deltas
        const deltaX = this.currentX - this.centerX;
        const deltaY = this.currentY - this.centerY;
        const deltaZ = this.currentZ - this.centerZ;
        
        document.getElementById('deltaX').textContent = (deltaX >= 0 ? '+' : '') + deltaX.toFixed(3);
        document.getElementById('deltaY').textContent = (deltaY >= 0 ? '+' : '') + deltaY.toFixed(3);
        document.getElementById('deltaZ').textContent = (deltaZ >= 0 ? '+' : '') + deltaZ.toFixed(3);
        
        // Précisions actuelles
        document.getElementById('currentHrms').textContent = this.currentHrms.toFixed(3);
        document.getElementById('currentVrrms').textContent = this.currentVrrms.toFixed(3);
        document.getElementById('currentSats').textContent = this.currentSats;
    }
    
    setCenter() {
        this.centerX = parseFloat(document.getElementById('centerX').value);
        this.centerY = parseFloat(document.getElementById('centerY').value);
        this.centerZ = parseFloat(document.getElementById('centerZ').value);
        
        this.currentX = this.centerX;
        this.currentY = this.centerY;
        this.currentZ = this.centerZ;
        
        this.updateDisplay();
        this.drawTarget();
        
        window.dispatchEvent(new CustomEvent('gpsUpdate', { 
            detail: this.getGPSData() 
        }));
    }
    
    reset() {
        this.targetPosX = this.canvas.width / 2;
        this.targetPosY = this.canvas.height / 2;
        
        this.currentX = this.centerX;
        this.currentY = this.centerY;
        this.currentZ = this.centerZ;
        
        // Reset slider Z
        document.getElementById('zSlider').value = 0;
        document.getElementById('zSliderValue').textContent = '0.00';
        
        this.updateDisplay();
        this.drawTarget();
        
        window.dispatchEvent(new CustomEvent('gpsUpdate', { 
            detail: this.getGPSData() 
        }));
    }
    
    startAnimation() {
        const animate = () => {
            // Faire varier les précisions
            this.currentHrms = Math.random() * this.hrmsMax;
            if (this.currentHrms < 0.005) this.currentHrms = 0.005;
            
            this.currentVrrms = Math.random() * this.vrrmsMax;
            if (this.currentVrrms < 0.010) this.currentVrrms = 0.010;
            
            // Faire varier les satellites
            this.currentSats = Math.floor(Math.random() * 5) + 27; // 27-31
            
            // Mettre à jour le bruit pour l'animation du point
            this.noiseOffset += 0.1;
            
            // Redessiner
            this.drawTarget();
            this.updateDisplay();
            
            // Envoyer mise à jour vers l'app
            window.dispatchEvent(new CustomEvent('gpsUpdate', { 
                detail: this.getGPSData() 
            }));
            
            // Continuer l'animation
            this.animationFrame = setTimeout(animate, 1000); // Toutes les secondes
        };
        
        animate();
    }
    
    getGPSData() {
        return {
            x: this.currentX,
            y: this.currentY,
            z: this.currentZ,
            hrms: this.currentHrms,
            vrrms: this.currentVrrms,
            satellites: this.currentSats,
            status: this.status
        };
    }
}

// Initialiser au chargement
let gpsSimulator;
document.addEventListener('DOMContentLoaded', () => {
    gpsSimulator = new GPSSimulator();
});