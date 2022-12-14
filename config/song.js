export default class Song {
    /**
     * 
     * @param {Object} songData 
     * @param {Number} progressTime 
     * @param {Number} timing 
     * @param {Manager} manager 
     */
    constructor(songData, progressTime, timing, manager) {
        if(songData === undefined) {
            this.id = null;
            this.name = 'Paused';
            this.artists = ['Paused'];
            this.fullLength = 3*60*1000
            this.originalProgressTime = 0
            this.progressTime = 0;
            this.imgurl = 'https://cdn.discordapp.com/attachments/389781926661062658/622744129176076288/c3c2e6fb-1e67-4636-ad71-e2c62f785188.png' // some sample pic dw
            this.manager = manager;
        } else {
            this.id = songData.id;
            this.name = songData.name;
            this.artists = songData.artists.map(a => a.name);
            this.fullLength = songData.duration_ms
            this.manager = manager;
            this.originalProgressTime = progressTime
            this.progressTime = progressTime;
            this.imgurl = songData.album.images[0].url
            this.timing = {
                requestSend: timing.requestSend,
                requestReceived: timing.requestReceived
            };
            this.isPlaying = true
            this.getAudioAnalysis()
        }
    }
    getAudioAnalysis() {
        this.manager.spotify.request(`audio-analysis/${this.id}`, 'GET')
            .then(audioAnalysis => {
                this.audioAnalysis = audioAnalysis
                this.startInterval()
            })
    }
    startInterval() {
        this.progressTime = this.getProgressTime()
        this.currentBeat = this.audioAnalysis.beats[0]
        this.currentBar = this.audioAnalysis.bars[0]
        this.timingInterval = setInterval(() => {
            if(!this.isPlaying) return
            this.progressTime = this.getProgressTime()
            let currentBeat = this.audioAnalysis.beats.find(b => (b.start)*1000 > this.progressTime)
            let currentBar = this.audioAnalysis.bars.find(b => (b.start)*1000 > this.progressTime-0.01)
            if(currentBeat === undefined || currentBar === undefined) return
            if(currentBar.start !== this.currentBar.start) {
                this.currentBar = currentBar
                this.newBar()
            } else if(currentBeat.start !== this.currentBeat.start) {
                this.currentBeat = currentBeat
                this.newBeat()
            }
            
        }, 10)
    }
    newBar() {
        // this.manager.hue.setLampState({
        //     hue: this.barHue,
        //     bri: 254,
        //     sat: 254,
        //     transitiontime: 0
        // })
        this.barHue = Math.floor(Math.random()*65535-25500)+25500
        this.beatNumber = 0
    }
    newBeat() {
        let brightness = Math.round((this.manager.brightness-(this.manager.brightness/4*this.beatNumber)))
        //console.log('new beat ' + this.name + ' - ' + brightness)
        this.beatNumber++
        if(!this.manager.isPaused) {
            this.manager.hue.setLampState({
                hue: this.barHue,
                bri: brightness,
                sat: 254,
                transitiontime: 0
            })
        }
        
    }
    getProgressTime() {
        return (this.originalProgressTime+(new Date()-(this.timing.requestSend)))+50
    }
}
