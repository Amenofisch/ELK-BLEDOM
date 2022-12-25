module.exports = class config {
    static server = {
        name: "ELK-BLEDOM",
        version: "v3.0.1",
        port: 5000
    };
    static bluetooth = {
        device: "hci0",
        bid: "BE:FF:20:00:06:FF",
        handle: "0x0008",
    };
    static spotify = {
        SPOTIFYTOKEN_URL: 'https://accounts.spotify.com/api/token',
        AUTHSPOTIFY_URL: 'https://accounts.spotify.com/authorize'
    }
}
