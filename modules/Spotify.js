const Song = require('./song');

class Spotify {
    constructor(ledstrip) {
        this.manager = ledstrip
        this.refreshToken = null
        this.accessToken = {
            token: null,
            expireDate: null
        }
        this.isReady = false;
        this.pollingTime = 1000
    }

    startPolling() {
        this.pollingInterval = setInterval(() => {
            this.pollCurrentlyPlaying()
            this.manager.emit('update')
        }, this.pollingTime)
    }
    
    stopPolling() {
        this.clearInterval(this.pollingInterval)
        this.songPause()
    }

    pollCurrentlyPlaying() {
        let requestSend = Date.now()
        if(requestSend+1000 > this.accessToken.expireDate) this.getAccessToken()
        this.request('me/player/currently-playing')
            .then(newCurrentlyPlaying => {
                if(newCurrentlyPlaying.item === null) return


                if(this.manager.song.name !== newCurrentlyPlaying.item.name) this.updateSong(newCurrentlyPlaying, requestSend)
                else this.updateTiming(newCurrentlyPlaying, requestSend)

                if(!newCurrentlyPlaying.is_playing && this.manager.song.isPlaying) this.songPause()            
                if(!this.manager.song.isPlaying && newCurrentlyPlaying.is_playing) this.songStart()
            })
    }

    songPause() {
        if(this.manager.song.timingInterval != undefined) clearInterval(this.manager.song.timingInterval)
        if(!this.manager.isPaused) this.manager.duoc.turnOff()
        this.manager.song.isPlaying = false
    }

    songStart() {
        this.manager.song.startInterval()
        if(!this.manager.isPaused) this.manager.duoc.turnOn()
        this.manager.song.isPlaying = true
    }

    updateSong(newCurrentlyPlaying, requestSend) {
        clearInterval(this.manager.song.timingInterval)

        this.manager.song = new Song(
            newCurrentlyPlaying.item,
            newCurrentlyPlaying.progress_ms, 
            {
                requestReceived: Date.now(),
                requestSend: requestSend
            },
            this.manager
        )
    }

    updateTiming(newCurrentlyPlaying, requestSend) {
        this.manager.song.progressTime = newCurrentlyPlaying.progress_ms
        this.manager.song.originalProgressTime = newCurrentlyPlaying.progress_ms
        this.manager.song.timing = {
            requestSend: requestSend,
            requestReceived: Date.now()
        }
    }

    getAccessToken() {
        console.log('GETTING ACCESS TOKEN')
        fetch(`${WORKER_URL}/accesstoken`, {
            headers: {
                'Authorization': this.refreshToken
            }
        }).then(res => {
            if(res.ok) {
                res.json().then(data => {
                    this.accessToken = {
                        token: data.access_token,
                        expireDate: Date.now()+(data.expires_in*1000)
                    }
                })
            }
        })
    }

    async request(endpoint, method, body) {
        let res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            method: method,
            headers: {
                Authorization: `Bearer ${this.accessToken.token}`
            },
            body: body
        })
        if(res.status == 204) return {item: null}
        return res.json()
    }
}

module.exports = { Spotify };
