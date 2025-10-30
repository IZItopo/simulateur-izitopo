// ==================== SIMULATEUR IZItopo App ====================

class IZItopoApp {
    constructor() {
        this.pointCount = 0;
        this.currentMatricule = '';
        this.canneHeight = '';
        
        // Données GPS reçues
        this.gpsData = {
            hrms: 0.009,
            vrrms: 0.015,
            satellites: 29,
            status: 'Fixe'
        };
        
        this.init();
    }
    
    init() {
        // Bouton démarrer (écran d'accueil)
        document.getElementById('startBtn').addEventListener('click', () => this.startApp());
        
        // Boutons du menu principal
        const modeCanneBtn = document.getElementById('modeCanneBtn');
        if (modeCanneBtn) {
            modeCanneBtn.addEventListener('click', () => this.openModeCanne());
        }
        
        const prisePhotoBtn = document.getElementById('prisePhotoBtn');
        if (prisePhotoBtn) {
            prisePhotoBtn.addEventListener('click', () => {
                alert('Prise Photo : fonctionnalité à venir');
            });
        }
        
        const implantationBtn = document.getElementById('implantationBtn');
        if (implantationBtn) {
            implantationBtn.addEventListener('click', () => {
                alert('Implantation : fonctionnalité à venir');
            });
        }
        
        // Bouton retour au menu
        const backToMenuBtn = document.getElementById('backToMenuBtn');
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => this.backToMenu());
        }
        
        // Bouton enregistrer point
        document.getElementById('savePointBtn').addEventListener('click', () => this.savePoint());
        
        // Bouton ouvrir popup codes
        document.getElementById('openCodeBtn').addEventListener('click', () => this.openCodePopup());
        
        // Bouton fermer popup
        document.getElementById('closePopupBtn').addEventListener('click', () => this.closeCodePopup());
        
        // Boutons de codes
        document.querySelectorAll('.code-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCode(e.target.textContent));
        });
        
        // Input hauteur canne
        document.getElementById('hauteurInput').addEventListener('change', (e) => {
            this.canneHeight = e.target.value;
        });
        
        // Input matricule
        document.getElementById('matriculeInput').addEventListener('change', (e) => {
            this.currentMatricule = e.target.value;
        });
        
        // Écouter les mises à jour GPS
        window.addEventListener('gpsUpdate', (e) => {
            this.updateGPSData(e.detail);
            this.updateMenuGPSData(e.detail);
        });
    }
    
    startApp() {
        // Masquer écran d'accueil
        document.getElementById('welcomeScreen').style.display = 'none';
        
        // Afficher splash screen
        document.getElementById('splashScreen').style.display = 'block';
        
        // Splash screen → Menu principal après 2 secondes
        setTimeout(() => {
            document.getElementById('splashScreen').style.display = 'none';
            document.getElementById('menuScreen').style.display = 'block';
        }, 2000);
    }
    
    openModeCanne() {
        // Masquer le menu
        document.getElementById('menuScreen').style.display = 'none';
        
        // Afficher le mode canne
        document.getElementById('modeCanne').style.display = 'block';
    }
    
    backToMenu() {
        // Masquer le mode canne
        document.getElementById('modeCanne').style.display = 'none';
        
        // Afficher le menu
        document.getElementById('menuScreen').style.display = 'block';
    }
    
    updateMenuGPSData(data) {
        // Mettre à jour les données GPS dans le menu principal
        const menuHrms = document.getElementById('menuHrms');
        const menuVrrms = document.getElementById('menuVrrms');
        const menuSats = document.getElementById('menuSats');
        const menuStatus = document.getElementById('menuStatus');
        
        if (menuHrms) menuHrms.textContent = data.hrms.toFixed(3).replace('.', ',') + ' m';
        if (menuVrrms) menuVrrms.textContent = data.vrrms.toFixed(3).replace('.', ',') + ' m';
        if (menuSats) menuSats.textContent = data.satellites;
        if (menuStatus) menuStatus.textContent = data.status;
        
        // Changer la couleur du badge selon le statut
        const menuBadge = document.querySelector('.menu-status-badge');
        if (menuBadge) {
            menuBadge.style.background = this.getStatusColor(data.status);
        }
    }
    
    updateGPSData(data) {
        this.gpsData = data;
        
        // Mettre à jour l'affichage
        document.getElementById('appHrms').textContent = data.hrms.toFixed(3) + ' m';
        document.getElementById('appVrrms').textContent = data.vrrms.toFixed(3) + ' m';
        document.getElementById('appSats').textContent = data.satellites;
        document.getElementById('appStatus').textContent = data.status;
        
        // Changer la couleur du badge selon le statut
        const badge = document.querySelector('.status-badge');
        badge.style.background = this.getStatusColor(data.status);
        badge.style.color = 'white';
    }
    
    getStatusColor(status) {
        switch(status) {
            case 'Fixe': return '#4caf50';
            case 'Flottant': return '#ff9800';
            case 'Autonome': return '#f44336';
            default: return '#4caf50';
        }
    }
    
    savePoint() {
        // Vérifier que hauteur et matricule sont renseignés
        const hauteur = document.getElementById('hauteurInput').value;
        const matricule = document.getElementById('matriculeInput').value;
        
        if (!hauteur || !matricule) {
            alert('Veuillez renseigner la hauteur canne et la matricule du point');
            return;
        }
        
        const code = document.getElementById('codeInput').value;
        const controle = document.getElementById('controleCheck').checked;
        
        // Calculer Z avec la hauteur de canne
        const zWithCanne = this.gpsData.z ? (this.gpsData.z + parseFloat(hauteur)).toFixed(3) : '0.000';
        
        // Créer l'objet point
        const point = {
            matricule: matricule,
            x: this.gpsData.x ? this.gpsData.x.toFixed(3) : '0.000',
            y: this.gpsData.y ? this.gpsData.y.toFixed(3) : '0.000',
            z: zWithCanne,
            code: code || '',
            hrms: this.gpsData.hrms.toFixed(3),
            vrms: this.gpsData.vrrms.toFixed(3),
            satellites: this.gpsData.satellites,
            status: this.gpsData.status,
            horodatage: new Date().toLocaleTimeString('fr-FR')
        };
        
        // Incrémenter le compteur
        this.pointCount++;
        document.getElementById('pointCount').textContent = this.pointCount;
        
        // Mettre à jour le compteur dans la liste
        const pointsListCount = document.getElementById('pointsListCount');
        if (pointsListCount) {
            pointsListCount.textContent = this.pointCount;
        }
        
        // Ajouter le point à la liste
        this.addPointToList(point);
        
        // Afficher message de confirmation
        const confirmMsg = document.getElementById('confirmMsg');
        confirmMsg.style.display = 'block';
        
        setTimeout(() => {
            confirmMsg.style.display = 'none';
        }, 2000);
        
        // Incrémenter automatiquement la matricule
        const currentMatricule = parseInt(matricule);
        if (!isNaN(currentMatricule)) {
            document.getElementById('matriculeInput').value = currentMatricule + 1;
        }
        
        // Réinitialiser le code
        document.getElementById('codeInput').value = '';
        
        // Animation du bouton
        const btn = document.getElementById('savePointBtn');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
        
        // Log pour debug
        console.log('Point enregistré:', point);
    }
    
    addPointToList(point) {
        const pointsList = document.getElementById('pointsList');
        
        // Retirer le message "Aucun point" s'il existe
        const emptyMsg = pointsList.querySelector('.points-list-empty');
        if (emptyMsg) {
            emptyMsg.remove();
        }
        
        // Convertir le statut en Diffstatus (4 = Fixe, 5 = Flottant, 1 = Autonome)
        let diffstatus;
        switch(point.status) {
            case 'Fixe': diffstatus = 4; break;
            case 'Flottant': diffstatus = 5; break;
            case 'Autonome': diffstatus = 1; break;
            default: diffstatus = 4;
        }
        
        // Créer la ligne CSV avec colonnes séparées
        const csvRow = document.createElement('div');
        csvRow.className = 'csv-row';
        
        csvRow.innerHTML = `
            <span>${point.matricule}</span>
            <span>${point.x}</span>
            <span>${point.y}</span>
            <span>${point.z}</span>
            <span>${point.code}</span>
            <span>${point.hrms}</span>
            <span>${point.vrms}</span>
            <span>${point.satellites}</span>
            <span>${diffstatus}</span>
            <span>${point.horodatage}</span>
        `;
        
        // Ajouter À LA FIN de la liste (après tous les autres points)
        pointsList.appendChild(csvRow);
    }
    
    openCodePopup() {
        document.getElementById('codePopup').style.display = 'block';
    }
    
    closeCodePopup() {
        document.getElementById('codePopup').style.display = 'none';
    }
    
    selectCode(code) {
        if (code === 'Del') {
            document.getElementById('codeInput').value = '';
        } else if (code === 'Libre') {
            // Focus pour saisie manuelle
            const input = document.getElementById('codeInput');
            input.focus();
            this.closeCodePopup();
        } else {
            document.getElementById('codeInput').value = code;
            this.closeCodePopup();
        }
    }
}

// Initialiser au chargement
let izitopoApp;
document.addEventListener('DOMContentLoaded', () => {
    izitopoApp = new IZItopoApp();
});