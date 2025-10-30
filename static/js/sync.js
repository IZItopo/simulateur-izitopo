// ==================== SYNCHRONISATION GPS ↔ APP ====================

/**
 * Ce fichier gère la communication temps réel entre le simulateur GPS
 * et le simulateur IZItopo App
 */

class GPSAppSync {
    constructor() {
        console.log('🔄 Synchronisation GPS ↔ App initialisée');
        
        // Écouter les événements GPS
        window.addEventListener('gpsUpdate', (e) => {
            this.handleGPSUpdate(e.detail);
        });
    }
    
    handleGPSUpdate(gpsData) {
        // Log pour debug
        console.log('📡 GPS Update:', {
            position: `X: ${gpsData.x.toFixed(3)}, Y: ${gpsData.y.toFixed(3)}, Z: ${gpsData.z.toFixed(3)}`,
            hrms: gpsData.hrms.toFixed(3),
            vrrms: gpsData.vrrms.toFixed(3),
            satellites: gpsData.satellites,
            status: gpsData.status
        });
        
        // Les données sont automatiquement transmises via l'événement
        // L'app les reçoit via son listener dans app.js
    }
}

// Initialiser au chargement
let gpsAppSync;
document.addEventListener('DOMContentLoaded', () => {
    gpsAppSync = new GPSAppSync();
});
