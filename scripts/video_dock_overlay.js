/**
 * @typedef {Object} VideoOverlay
 * @property {string} id - A unique ID to identify the overlay.
 * @property {string} label - The text of the overlay.
 * @property {string} userId - The user's id which owns this overlay.
 * @property {string} overlayPath - File path to the overlay image
 */

//Relevant HOOK: renderCameraViews

console.log('video_dock_overlay | Hello World!');

class VideoOverlay {
    //This must match the name in module.json
    static ID = 'video_dock_overlay';

    static FLAGS = {
        OVERLAYS: 'overlays'
    }

    static TEMPLATES = {
        OVERLAYS: 'modules/${this.ID}/templates/video_dock_overlays.hbs'
    }
}

class videoOverlayData{
    
    static get allOverlays() {

        const allOverlays = game.users.reduce((accumulator, user) => {
            const userOverlays = this.getOverlayForUser(user.id);

            return {
                ...accumulator,
                ...userOverlays
            }
        }, {});

        return allOverlays;
    }

    static getOverlayForUser(userId){
        return game.users.get(userId)?.getFlag(VideoOverlay.ID, VideoOverlay.FLAGS.OVERLAYS)
    }

    static createOverlay(userId, overlayData) {

        const newOverlay = {
            isDone: false,
            ...overlayData,
            id: foundry.utils.randomID(16),
            userId,
        }

        const newOverlays = {
            [newOverlay.id]: newOverlay
        }

        return game.users.get(userId)?.setFlag(VideoOverlay.ID, VideoOverlay.FLAGS.OVERLAYS, newOverlays)
    }
    
    static updateOverlay(overlayID, updateData) {

        const relevantOverlay = this.allOverlays[overlayID];
        console.log(relevantOverlay)

        //construct update to send
        const update = {
            [overlayID]: updateData
        }

        return game.users.get(relevantOverlay.userId)?.setFlag(VideoOverlay.ID, VideoOverlay.FLAGS.OVERLAYS, update);
    }
    
    //Will update multiple overlays as long as they are on the same user
    static updateOverlays(userId, updateData) {
        return game.users.get(userId)?.setFlag(VideoOverlay.ID, VideoOverlay.FLAGS, updateData)
    }

    static deleteOverlay(overlayID) {

        const relevantOverlay = this.allOverlays[overlayID]

        const keyDeletion = {
            [`-=${overlayID}`]: null
        }

        return game.users.get(relevantOverlay.userId)?.setFlag(VideoOverlay.ID, VideoOverlay.FLAGS.OVERLAYS, keyDeletion)

    }

    static removeShit(){
        document.getElementsByClassName("player-name noborder noanimate")[0].remove();
        document.getElementsByClassName("camera-view camera-box-dock no-audio")[0].style.padding = "0" 
        document.getElementsByClassName("notification-bar right flexcol")[0].remove();
        document.getElementsByClassName("shadow")[0].remove();
    }
}

Hooks.on('renderCameraViews', (playerList, html) => {
    // find the element which has our logged in user's id
    const loggedInUserListItem = html.find(`[data-user="${game.userId}"]`)
    
    videoOverlayData.removeShit();

    console.log("DATA HERE")
    console.log(loggedInUserListItem)
    console.log(cameraNameBanner)
  
    // insert a button at the end of this element
    //loggedInUserListItem.append(
    //  "<button type='button' class='todo-list-icon-button'><i class='fas fa-tasks'></i></button>"
    //);
  });