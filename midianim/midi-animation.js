console.log('=== MIDI ANIMATION SCRIPT LOADED ===');

class MIDIEclipseAnimation {
    constructor() {
        console.log('MIDIEclipseAnimation initializing...');
        this.canvas = document.getElementById('eclipseCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.midiData = null;
        this.clusters = [];
        this.explosions = [];
        this.isPlaying = false;
        this.isPaused = false;
        this.startTime = 0;
        this.currentTime = 0;
        this.pausedTime = 0;
        this.animationFrame = null;
        
        // Eclipse properties
        this.eclipseX = 0;
        this.eclipseY = 0;
        this.eclipseRadius = 80;
        
        // Track active clusters for visual feedback
        this.activeClusterColors = new Set();
        
        // Control canvas legend visibility
        this.showCanvasLegend = true;
        
        // Control timeline visibility
        this.showTimelines = true;
        
        // Audio player
        this.audioPlayer = document.getElementById('audioPlayer');
        console.log('Audio player element:', this.audioPlayer);
        this.hasAudio = false;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.drawFrame(); // Draw initial eclipse
        console.log('MIDIEclipseAnimation initialized');
    }
    
    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.eclipseX = this.canvas.width / 2;
        this.eclipseY = this.canvas.height / 2;
    }
    
    setupEventListeners() {
        document.getElementById('audioFile').addEventListener('change', (e) => this.loadAudio(e));
        document.getElementById('midiFile').addEventListener('change', (e) => this.loadMIDI(e));
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('rewindBtn').addEventListener('click', () => this.rewind());
        document.getElementById('fastForwardBtn').addEventListener('click', () => this.fastForward());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        const toggle = document.getElementById('showTracksToggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => this.toggleTrackInfo(e));
        }
        
        const timelinesToggle = document.getElementById('showTimelinesToggle');
        if (timelinesToggle) {
            timelinesToggle.addEventListener('change', (e) => this.toggleTimelines(e));
        }
    }
    
    toggleTrackInfo(event) {
        this.showCanvasLegend = event.target.checked;
        console.log('Canvas legend visibility:', this.showCanvasLegend);
        this.saveSettings();
    }
    
    toggleTimelines(event) {
        this.showTimelines = event.target.checked;
        console.log('Timeline visibility:', this.showTimelines);
        this.displayTrackInfo(); // Redraw the track info with/without timelines
        this.saveSettings();
    }
    
    saveSettings() {
        const settings = {
            showCanvasLegend: this.showCanvasLegend,
            showTimelines: this.showTimelines
        };
        localStorage.setItem('eclipseSettings', JSON.stringify(settings));
        console.log('Settings saved:', settings);
    }
    
    async loadFromLocalStorage() {
        // Load settings
        const settingsJson = localStorage.getItem('eclipseSettings');
        if (settingsJson) {
            try {
                const settings = JSON.parse(settingsJson);
                this.showCanvasLegend = settings.showCanvasLegend ?? true;
                this.showTimelines = settings.showTimelines ?? true;
                
                // Update UI
                const toggle = document.getElementById('showTracksToggle');
                if (toggle) {
                    toggle.checked = this.showCanvasLegend;
                }
                
                const timelinesToggle = document.getElementById('showTimelinesToggle');
                if (timelinesToggle) {
                    timelinesToggle.checked = this.showTimelines;
                }
                
                console.log('Settings loaded:', settings);
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
        
        // Load MIDI file
        const midiBase64 = localStorage.getItem('midiFile');
        const midiFileName = localStorage.getItem('midiFileName');
        if (midiBase64) {
            try {
                console.log('Loading MIDI from localStorage:', midiFileName);
                const binaryString = atob(midiBase64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: 'audio/midi' });
                const url = URL.createObjectURL(blob);
                
                this.midiData = await Midi.fromUrl(url);
                console.log('MIDI restored from localStorage');
                this.processMIDI();
                this.enableControls();
            } catch (error) {
                console.error('Error loading MIDI from localStorage:', error);
                // Clear invalid data
                localStorage.removeItem('midiFile');
                localStorage.removeItem('midiFileName');
            }
        }
        
        // Load audio file
        const audioBase64 = localStorage.getItem('audioFile');
        const audioFileName = localStorage.getItem('audioFileName');
        const audioFileType = localStorage.getItem('audioFileType');
        if (audioBase64) {
            try {
                console.log('Loading audio from localStorage:', audioFileName);
                const binaryString = atob(audioBase64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: audioFileType || 'audio/mpeg' });
                const url = URL.createObjectURL(blob);
                
                this.audioPlayer.src = url;
                this.hasAudio = true;
                console.log('Audio restored from localStorage');
            } catch (error) {
                console.error('Error loading audio from localStorage:', error);
                // Clear invalid data
                localStorage.removeItem('audioFile');
                localStorage.removeItem('audioFileName');
                localStorage.removeItem('audioFileType');
            }
        }
    }
    
    async loadMIDI(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            this.midiData = await Midi.fromUrl(URL.createObjectURL(file));
            console.log('Raw MIDI data:', this.midiData);
            
            // Save to localStorage
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            localStorage.setItem('midiFile', base64);
            localStorage.setItem('midiFileName', file.name);
            
            this.processMIDI();
            this.enableControls();
        } catch (error) {
            console.error('Error loading MIDI file:', error);
            alert('Error loading MIDI file. Please try another file.');
        }
    }
    
    async loadAudio(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const url = URL.createObjectURL(file);
        this.audioPlayer.src = url;
        this.hasAudio = true;
        
        // Save to localStorage
        try {
            const arrayBuffer = await file.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            localStorage.setItem('audioFile', base64);
            localStorage.setItem('audioFileName', file.name);
            localStorage.setItem('audioFileType', file.type);
        } catch (error) {
            console.error('Error saving audio to localStorage:', error);
        }
        
        // Add audio event listeners
        this.audioPlayer.addEventListener('play', () => {
            if (!this.isPlaying) {
                this.play();
            }
        });
        
        this.audioPlayer.addEventListener('pause', () => {
            if (this.isPlaying && !this.isPaused) {
                this.pause();
            }
        });
        
        this.audioPlayer.addEventListener('seeked', () => {
            // Reset note triggers when seeking
            this.clusters.forEach(cluster => {
                cluster.notes.forEach(note => {
                    note.triggered = false;
                });
            });
            this.explosions = [];
            if (this.isPlaying) {
                this.startTime = performance.now() - (this.audioPlayer.currentTime * 1000);
            }
        });
        
        this.audioPlayer.addEventListener('ended', () => {
            this.reset();
        });
        
        console.log('Audio file loaded:', file.name);
    }
    
    processMIDI() {
        // Initialize debug info
        this.debugInfo = {
            totalTracks: this.midiData.tracks.length,
            tracks: [],
            clusteringResults: new Map()
        };
        
        // Group tracks by name and assign colors
        const trackGroups = new Map();
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B739', '#52B788', '#FF9FF3', '#54A0FF'
        ];
        
        let colorIndex = 0;
        
        this.midiData.tracks.forEach((track, trackIndex) => {
            // Get track name and instrument from Tone.js MIDI structure
            let trackName = track.name || `Track ${trackIndex}`;
            let instrumentName = track.instrument?.name || track.instrument?.family || 'Unknown';
            let channel = track.channel !== undefined ? track.channel : 'N/A';
            
            // Cluster tracks by name prefix or exact name
            const clusterKey = trackName.split(/[_\- ]/)[0] || trackName;
            
            // Track debug info for this track
            const trackDebugInfo = {
                index: trackIndex,
                name: trackName,
                instrument: instrumentName,
                channel: channel,
                clusterKey: clusterKey,
                noteCount: track.notes.length,
                isDrum: track.instrument?.percussion || false
            };
            
            if (!trackGroups.has(clusterKey)) {
                trackGroups.set(clusterKey, {
                    name: clusterKey,
                    color: colors[colorIndex % colors.length],
                    notes: [],
                    trackIndices: [],
                    totalNoteCount: 0
                });
                colorIndex++;
                
                this.debugInfo.clusteringResults.set(clusterKey, {
                    clusterName: clusterKey,
                    color: colors[(colorIndex - 1) % colors.length],
                    trackCount: 0,
                    totalNotes: 0,
                    trackNames: []
                });
            }
            
            trackGroups.get(clusterKey).trackIndices.push(trackIndex);
            
            // Extract note events from Tone.js structure
            track.notes.forEach(note => {
                trackGroups.get(clusterKey).notes.push({
                    time: note.time,
                    note: note.midi,
                    velocity: Math.floor(note.velocity * 127)
                });
            });
            
            // Update total note count for this cluster
            trackGroups.get(clusterKey).totalNoteCount += track.notes.length;
            
            this.debugInfo.tracks.push(trackDebugInfo);
            
            // Update cluster stats
            const clusterStats = this.debugInfo.clusteringResults.get(clusterKey);
            clusterStats.trackCount++;
            clusterStats.totalNotes += track.notes.length;
            clusterStats.trackNames.push(trackName);
        });
        
        this.clusters = Array.from(trackGroups.values());
        
        // Apply saved color overrides
        this.applyColorOverrides();
        
        // Calculate max note count for normalization
        this.maxClusterNotes = Math.max(...this.clusters.map(c => c.totalNoteCount), 1);
        console.log('Max cluster note count:', this.maxClusterNotes);
        
        // Console log JSON version of tracks
        console.log('=== MIDI Track Analysis ===');
        console.log('Total Tracks:', this.debugInfo.totalTracks);
        console.log('Total Clusters:', this.debugInfo.clusteringResults.size);
        console.log('\n--- Individual Tracks ---');
        this.debugInfo.tracks.forEach(track => {
            console.log(`Track ${track.index}:`, JSON.stringify(track, null, 2));
        });
        console.log('\n--- Cluster Information ---');
        Array.from(this.debugInfo.clusteringResults.entries()).forEach(([key, cluster]) => {
            console.log(`Cluster "${key}":`, JSON.stringify(cluster, null, 2));
        });
        console.log('\n--- Full Debug Object ---');
        console.log(JSON.stringify({
            totalTracks: this.debugInfo.totalTracks,
            tracks: this.debugInfo.tracks,
            clusters: Array.from(this.debugInfo.clusteringResults.values())
        }, null, 2));
        
        this.displayTrackInfo();
        this.displayDebugInfo();
    }
    
    ticksToSeconds(ticks, ticksPerBeat) {
        // Not needed with Tone.js - it provides time directly in seconds
        return ticks;
    }
    
    toggleAllClusters(checked) {
        const checkboxes = document.querySelectorAll('.cluster-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = checked;
        });
    }
    
    applyBulkColor() {
        const bulkColorPicker = document.getElementById('bulkColorPicker');
        if (!bulkColorPicker) return;
        
        const newColor = bulkColorPicker.value;
        const checkboxes = document.querySelectorAll('.cluster-checkbox:checked');
        
        if (checkboxes.length === 0) {
            alert('Please select at least one track cluster');
            return;
        }
        
        checkboxes.forEach(checkbox => {
            const clusterName = checkbox.getAttribute('data-cluster-name');
            this.changeClusterColor(clusterName, newColor);
        });
        
        // Refresh the track info display to show new colors
        this.displayTrackInfo();
        
        console.log(`Applied color ${newColor} to ${checkboxes.length} cluster(s)`);
    }
    
    changeClusterColor(clusterName, newColor) {
        // Update cluster color
        const cluster = this.clusters.find(c => c.name === clusterName);
        if (cluster) {
            cluster.color = newColor;
            
            // Update debug info
            const clusterInfo = this.debugInfo.clusteringResults.get(clusterName);
            if (clusterInfo) {
                clusterInfo.color = newColor;
            }
            
            // Save to localStorage
            this.saveColorOverrides();
            
            // Refresh debug display to show new color
            this.displayDebugInfo();
            
            console.log(`Changed color of cluster "${clusterName}" to ${newColor}`);
        }
    }
    
    saveColorOverrides() {
        const overrides = {};
        this.clusters.forEach(cluster => {
            overrides[cluster.name] = cluster.color;
        });
        localStorage.setItem('clusterColorOverrides', JSON.stringify(overrides));
        console.log('Color overrides saved:', overrides);
    }
    
    applyColorOverrides() {
        const overridesJson = localStorage.getItem('clusterColorOverrides');
        if (!overridesJson) return;
        
        try {
            const overrides = JSON.parse(overridesJson);
            this.clusters.forEach(cluster => {
                if (overrides[cluster.name]) {
                    cluster.color = overrides[cluster.name];
                    
                    // Also update debug info
                    const clusterInfo = this.debugInfo.clusteringResults.get(cluster.name);
                    if (clusterInfo) {
                        clusterInfo.color = overrides[cluster.name];
                    }
                }
            });
            console.log('Color overrides applied:', overrides);
        } catch (error) {
            console.error('Error applying color overrides:', error);
        }
    }
    
    displayTrackInfo() {
        const trackInfo = document.getElementById('trackInfo');
        trackInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="selectAllCheckbox" 
                           style="cursor: pointer; width: 16px; height: 16px;"
                           title="Select/Deselect All">
                    <strong>Track Clusters</strong>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="color" id="bulkColorPicker" 
                           style="width: 24px; height: 24px; border: none; cursor: pointer;"
                           title="Pick color for selected tracks">
                    <button id="applyBulkColor" style="padding: 4px 8px; font-size: 11px;">Apply to Selected</button>
                </div>
            </div>
        `;
        
        const duration = this.midiData ? this.midiData.duration : 0;
        const timelineWidth = 300; // pixels;
        
        this.clusters.forEach((cluster, index) => {
            const clusterId = `cluster-${index}`;
            const checkboxId = `checkbox-${index}`;
            const timelineId = `timeline-${index}`;
            
            const timelineHtml = this.showTimelines ? `
                <canvas id="${timelineId}" width="${timelineWidth}" height="30" 
                        style="background: rgba(0,0,0,0.3); border-radius: 3px; cursor: crosshair;"
                        data-cluster-index="${index}"></canvas>
            ` : '';
            
            trackInfo.innerHTML += `
                <div style="margin: 10px 0; display: flex; flex-direction: column; gap: 5px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="${checkboxId}" class="cluster-checkbox"
                               data-cluster-name="${cluster.name}"
                               style="cursor: pointer;">
                        <input type="color" id="${clusterId}" value="${cluster.color}" 
                               style="width: 20px; height: 20px; border: none; cursor: pointer;"
                               data-cluster-name="${cluster.name}">
                        <span style="font-weight: bold;">${cluster.name}</span>
                        <span style="font-size: 11px; opacity: 0.7;">(${cluster.notes.length} notes)</span>
                    </div>
                    ${timelineHtml}
                </div>
            `;
        });
        
        // Add event listeners for color pickers
        this.clusters.forEach((cluster, index) => {
            const colorPicker = document.getElementById(`cluster-${index}`);
            if (colorPicker) {
                colorPicker.addEventListener('change', (e) => {
                    this.changeClusterColor(cluster.name, e.target.value);
                });
            }
        });
        
        // Add bulk color change event listeners
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => this.toggleAllClusters(e.target.checked));
        }
        
        const applyBulkBtn = document.getElementById('applyBulkColor');
        if (applyBulkBtn) {
            applyBulkBtn.addEventListener('click', () => this.applyBulkColor());
        }
        
        // Draw timelines after DOM elements are added (if enabled)
        if (this.showTimelines) {
            setTimeout(() => this.drawTimelines(), 0);
        }
    }
    
    drawTimelines() {
        if (!this.midiData) return;
        
        const duration = this.midiData.duration;
        
        this.clusters.forEach((cluster, index) => {
            const canvas = document.getElementById(`timeline-${index}`);
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Draw background grid lines (every second)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            for (let t = 0; t < duration; t += 1) {
                const x = (t / duration) * width;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            
            // Find min and max MIDI note values for this cluster
            const midiNotes = cluster.notes.map(n => n.note);
            const minNote = Math.min(...midiNotes);
            const maxNote = Math.max(...midiNotes);
            const noteRange = maxNote - minNote || 1;
            
            // Draw notes as colored rectangles
            cluster.notes.forEach(note => {
                const x = (note.time / duration) * width;
                // Normalize note pitch to height (higher notes = higher on canvas)
                const noteHeight = ((note.note - minNote) / noteRange) * (height - 4) + 2;
                const opacity = note.velocity / 127;
                
                // Convert hex color to rgba
                const r = parseInt(cluster.color.slice(1, 3), 16);
                const g = parseInt(cluster.color.slice(3, 5), 16);
                const b = parseInt(cluster.color.slice(5, 7), 16);
                
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`;
                // Draw note as vertical line or small rectangle
                const noteWidth = Math.max(1, (0.1 / duration) * width); // 100ms minimum width
                ctx.fillRect(x, height - noteHeight, noteWidth, 2);
            });
            
            // Add timeline click handler for seeking
            canvas.onclick = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickTime = (clickX / width) * duration;
                
                if (this.hasAudio && this.audioPlayer) {
                    this.audioPlayer.currentTime = clickTime;
                } else {
                    this.currentTime = clickTime;
                    this.startTime = performance.now() - (clickTime * 1000);
                    // Reset note triggers
                    this.clusters.forEach(c => {
                        c.notes.forEach(n => {
                            n.triggered = n.time < clickTime;
                        });
                    });
                    this.explosions = [];
                }
            };
        });
    }
    
    displayDebugInfo() {
        const debugInfo = document.getElementById('debugInfo');
        let html = '';
        
        // Summary section
        html += '<div class="debug-section">';
        html += '<h4>📊 MIDI File Summary</h4>';
        html += `<div>Total Tracks: <strong>${this.debugInfo.totalTracks}</strong></div>`;
        html += `<div>Total Clusters: <strong>${this.debugInfo.clusteringResults.size}</strong></div>`;
        html += `<div>Duration: <strong>${this.midiData.duration.toFixed(2)}s</strong></div>`;
        html += `<div>PPQ: <strong>${this.midiData.header.ppq}</strong></div>`;
        html += '</div>';
        
        // Clustering results
        html += '<div class="debug-section">';
        html += '<h4>🎨 Cluster Statistics</h4>';
        Array.from(this.debugInfo.clusteringResults.values()).forEach(cluster => {
            html += `<div class="cluster-stats">`;
            html += `<span style="display: inline-block; width: 12px; height: 12px; background: ${cluster.color}; margin-right: 8px;"></span>`;
            html += `<strong>${cluster.clusterName}</strong>: `;
            html += `${cluster.trackCount} track(s), ${cluster.totalNotes} notes<br>`;
            html += `<div style="margin-left: 20px; margin-top: 5px; font-size: 11px; opacity: 0.8;">`;
            html += `Tracks: ${(cluster.trackNames || []).join(', ')}`;
            html += `</div>`;
            html += `</div>`;
        });
        html += '</div>';
        
        // Individual tracks
        html += '<div class="debug-section">';
        html += '<h4>🎵 Individual Tracks</h4>';
        this.debugInfo.tracks.forEach(track => {
            const clusterInfo = this.debugInfo.clusteringResults.get(track.clusterKey);
            html += `<div class="track-item" style="border-left-color: ${clusterInfo.color};">`;
            html += `<div><strong>Track ${track.index}:</strong> ${track.name}</div>`;
            html += `<div style="margin-left: 15px; margin-top: 5px;">`;
            html += `<div>→ Instrument: ${track.instrument}</div>`;
            html += `<div>→ Channel: ${track.channel}</div>`;
            html += `<div>→ Cluster: <strong>${track.clusterKey}</strong></div>`;
            html += `<div>→ Notes: ${track.noteCount}</div>`;
            html += `<div>→ Is Drum: ${track.isDrum ? 'Yes' : 'No'}</div>`;
            html += `</div>`;
            html += `</div>`;
        });
        html += '</div>';
        
        // Clustering logic explanation
        html += '<div class="debug-section">';
        html += '<h4>🔧 Clustering Logic</h4>';
        html += '<div>Tracks are grouped by splitting their names on delimiters (_, -, space).</div>';
        html += '<div>Example: "Piano_1" and "Piano_2" → "Piano" cluster</div>';
        html += '<div>Example: "Bass-Line-A" → "Bass" cluster</div>';
        html += '</div>';
        
        debugInfo.innerHTML = html;
    }
    
    enableControls() {
        document.getElementById('playPauseBtn').disabled = false;
        document.getElementById('rewindBtn').disabled = false;
        document.getElementById('fastForwardBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.isPaused) {
            this.isPaused = false;
            this.startTime = performance.now() - this.pausedTime;
            if (this.hasAudio) {
                this.audioPlayer.play().catch(err => {
                    console.error('Error playing audio:', err);
                    alert('Could not play audio. Please interact with the page first.');
                });
            }
        } else {
            this.startTime = performance.now();
            this.explosions = [];
            if (this.hasAudio) {
                this.audioPlayer.currentTime = 0;
                this.audioPlayer.play().catch(err => {
                    console.error('Error playing audio:', err);
                    alert('Could not play audio. Please interact with the page first.');
                });
            }
        }
        
        this.isPlaying = true;
        this.updatePlayPauseButton();
        this.animate();
    }
    
    pause() {
        this.isPaused = true;
        this.isPlaying = false;
        this.pausedTime = performance.now() - this.startTime;
        if (this.hasAudio) {
            this.audioPlayer.pause();
        }
        this.updatePlayPauseButton();
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    updatePlayPauseButton() {
        const btn = document.getElementById('playPauseBtn');
        const icon = btn.querySelector('i');
        
        if (this.isPlaying) {
            icon.className = 'bi bi-pause-fill';
            btn.setAttribute('data-state', 'pause');
            btn.setAttribute('title', 'Pause');
        } else {
            icon.className = 'bi bi-play-fill';
            btn.setAttribute('data-state', 'play');
            btn.setAttribute('title', 'Play');
        }
    }
    
    rewind() {
        this.seekRelative(-5);
    }
    
    fastForward() {
        this.seekRelative(5);
    }
    
    seekRelative(seconds) {
        if (this.hasAudio && this.audioPlayer) {
            const newTime = Math.max(0, Math.min(this.audioPlayer.duration || 0, this.audioPlayer.currentTime + seconds));
            this.audioPlayer.currentTime = newTime;
        } else {
            const newTime = Math.max(0, Math.min(this.midiData?.duration || 0, this.currentTime + seconds));
            this.currentTime = newTime;
            this.startTime = performance.now() - (newTime * 1000);
            this.pausedTime = performance.now() - this.startTime;
        }
        
        // Reset note triggers for the new time position
        if (this.clusters && this.clusters.length > 0) {
            this.clusters.forEach(cluster => {
                cluster.notes.forEach(note => {
                    note.triggered = note.time < (this.hasAudio ? this.audioPlayer.currentTime : this.currentTime);
                });
            });
        }
        this.explosions = [];
        if (!this.isPlaying) {
            this.drawFrame();
            document.getElementById('timeInfo').textContent = `Time: ${(this.hasAudio ? this.audioPlayer.currentTime : this.currentTime).toFixed(2)}s`;
        }
    }
    
    reset() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.pausedTime = 0;
        this.explosions = [];
        if (this.hasAudio) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }
        // Reset all note triggers
        if (this.clusters && this.clusters.length > 0) {
            this.clusters.forEach(cluster => {
                cluster.notes.forEach(note => {
                    note.triggered = false;
                });
            });
        }
        this.updatePlayPauseButton();
        document.getElementById('timeInfo').textContent = 'Time: 0.00s';
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.midiData) {
            this.drawFrame();
        }
    }
    
    animate() {
        if (!this.isPlaying) return;
        
        // Use audio time if available, otherwise use performance timer
        if (this.hasAudio && !this.audioPlayer.paused) {
            this.currentTime = this.audioPlayer.currentTime;
        } else {
            this.currentTime = (performance.now() - this.startTime) / 1000;
        }
        document.getElementById('timeInfo').textContent = `Time: ${this.currentTime.toFixed(2)}s`;
        
        if (Math.random() < 0.02) {
            console.log('Animate running, time:', this.currentTime, 'explosions:', this.explosions.length);
        }
        
        // Check for new notes to trigger explosions
        this.activeClusterColors.clear();
        
        this.clusters.forEach(cluster => {
            cluster.notes.forEach(note => {
                if (Math.abs(note.time - this.currentTime) < 0.05 && !note.triggered) {
                    note.triggered = true;
                    this.createExplosion(cluster.color, note.note, note.velocity, cluster.totalNoteCount);
                    this.activeClusterColors.add(cluster.color);
                }
            });
        });
        
        // Update and remove old explosions
        this.explosions = this.explosions.filter(exp => {
            exp.age += 0.016; // Approximate frame time
            // For halos, also check radius
            if (exp.type === 'halo') {
                return exp.age < exp.lifetime && exp.radius < exp.maxRadius;
            }
            return exp.age < exp.lifetime;
        });
        
        this.drawFrame();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    createExplosion(color, note, velocity, clusterNoteCount) {
        // Create expanding colored halo rings
        const intensity = velocity / 127;
        const numLayers = Math.floor(3 + intensity * 4);
        
        // Calculate size multiplier: more notes = smaller radius
        // Normalize note count and invert it (0 to 1, where 1 = fewer notes)
        const noteCountRatio = clusterNoteCount / this.maxClusterNotes; // 0 to 1
        const sizeMultiplier = 1 - (noteCountRatio * 0.4); // Range from 0.6 to 1.0
        
        for (let i = 0; i < numLayers; i++) {
            this.explosions.push({
                type: 'halo',
                radius: this.eclipseRadius + 5,
                maxRadius: (120 + intensity * 180) * sizeMultiplier,
                expansionSpeed: (1.5 + intensity * 2.5) * sizeMultiplier,
                color: color,
                age: 0,
                lifetime: 1.2 + Math.random() * 0.8,
                intensity: intensity * (0.6 + Math.random() * 0.4),
                thickness: (15 + intensity * 25) * sizeMultiplier,
                delay: i * 0.08 // Stagger the layers
            });
        }
    }
    
    drawFrame() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw explosions (colored halos behind eclipse)
        this.explosions.forEach(exp => {
            if (exp.type === 'halo') {
                // Skip if still in delay period
                if (exp.age < exp.delay) return;
                
                // Expand the halo
                exp.radius += exp.expansionSpeed;
                
                // Fade out over lifetime and as it expands
                const lifetimeFade = 1 - (exp.age / exp.lifetime);
                const expansionFade = 1 - ((exp.radius - this.eclipseRadius) / (exp.maxRadius - this.eclipseRadius));
                const opacity = Math.min(lifetimeFade, expansionFade) * exp.intensity;
                
                // Convert hex to rgb
                const r = parseInt(exp.color.slice(1, 3), 16);
                const g = parseInt(exp.color.slice(3, 5), 16);
                const b = parseInt(exp.color.slice(5, 7), 16);
                
                // Create gradient halo
                const gradient = this.ctx.createRadialGradient(
                    this.eclipseX, this.eclipseY, exp.radius - exp.thickness / 2,
                    this.eclipseX, this.eclipseY, exp.radius + exp.thickness / 2
                );
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
                gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`);
                gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity})`);
                gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(this.eclipseX, this.eclipseY, exp.radius + exp.thickness / 2, 0, Math.PI * 2);
                this.ctx.arc(this.eclipseX, this.eclipseY, exp.radius - exp.thickness / 2, 0, Math.PI * 2, true);
                this.ctx.fill();
            }
        });
        
        // Draw moon (creating eclipse effect)
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.beginPath();
        this.ctx.arc(this.eclipseX, this.eclipseY, this.eclipseRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw corona effect around eclipse
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.eclipseX, this.eclipseY, this.eclipseRadius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw cluster legend if enabled
        if (this.showCanvasLegend) {
            this.drawClusterLegend();
        }
    }
    
    drawClusterLegend() {
        if (this.clusters.length === 0) return;
        
        const legendX = 20;
        const legendY = 20;
        const itemHeight = 30;
        const boxSize = 20;
        
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillText('Track Clusters', legendX, legendY);
        
        this.clusters.forEach((cluster, index) => {
            const y = legendY + 25 + (index * itemHeight);
            
            // Check if this cluster is currently active
            const isActive = this.activeClusterColors.has(cluster.color);
            
            // Draw color box with glow effect if active
            if (isActive) {
                // Glow effect
                this.ctx.shadowColor = cluster.color;
                this.ctx.shadowBlur = 15;
                this.ctx.fillStyle = cluster.color;
                this.ctx.fillRect(legendX, y - boxSize / 2, boxSize, boxSize);
                this.ctx.shadowBlur = 0;
            } else {
                this.ctx.fillStyle = cluster.color;
                this.ctx.fillRect(legendX, y - boxSize / 2, boxSize, boxSize);
            }
            
            // Draw border around box
            this.ctx.strokeStyle = isActive ? '#fff' : 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = isActive ? 2 : 1;
            this.ctx.strokeRect(legendX, y - boxSize / 2, boxSize, boxSize);
            
            // Draw cluster name
            this.ctx.font = isActive ? 'bold 14px Arial' : '14px Arial';
            this.ctx.fillStyle = isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)';
            this.ctx.fillText(cluster.name, legendX + boxSize + 10, y + 5);
            
            // Draw note count
            this.ctx.font = '11px Arial';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fillText(`${cluster.notes.length} notes`, legendX + boxSize + 10, y + 18);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MIDIEclipseAnimation();
});
