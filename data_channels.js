/* global connection, Strophe, updateLargeVideo, focusedVideoSrc*/
/**
 * Callback triggered by PeerConnection when new data channel is opened
 * on the bridge.
 * @param event the event info object.
 */
function onDataChannel(event)
{
    var dataChannel = event.channel;

    dataChannel.onopen = function ()
    {
        console.info("Data channel opened by the Videobridge!", dataChannel);

        // Code sample for sending string and/or binary data
        // Sends String message to the bridge
        //dataChannel.send("Hello bridge!");
        // Sends 12 bytes binary message to the bridge
        //dataChannel.send(new ArrayBuffer(12));
    };

    dataChannel.onerror = function (error)
    {
        console.error("Data Channel Error:", error, dataChannel);
    };

    dataChannel.onmessage = function (event)
    {
        var data = event.data;

        console.info("Got Data Channel Message:", data, dataChannel);

        // Active speaker event
        if (data.indexOf('activeSpeaker') === 0)
        {
            // Endpoint ID from the Videobridge.
            var resourceJid = data.split(":")[1];

            console.info(
                "Data channel new active speaker event: " + resourceJid);
            $(document).trigger('activespeakerchanged', [resourceJid]);
        }
        else
        {
            // JSON
            var obj;

            try
            {
                obj = JSON.parse(data);
            }
            catch (e)
            {
                console.error(
                    "Failed to parse data channel message as JSON: ",
                    data,
                    dataChannel);
            }
            if (('undefined' !== typeof(obj)) && (null !== obj))
            {
                // TODO Consume the JSON-formatted data channel message.
                console.debug("Data channel JSON-formatted message: ", obj);
            }
        }
    };

    dataChannel.onclose = function ()
    {
        console.info("The Data Channel closed", dataChannel);
    };
}

/**
 * Binds "ondatachannel" event listener to given PeerConnection instance.
 * @param peerConnection WebRTC peer connection instance.
 */
function bindDataChannelListener(peerConnection)
{
    peerConnection.ondatachannel = onDataChannel;

    // Sample code for opening new data channel from Jitsi Meet to the bridge.
    // Although it's not a requirement to open separate channels from both bridge
    // and peer as single channel can be used for sending and receiving data.
    // So either channel opened by the bridge or the one opened here is enough
    // for communication with the bridge.
    /*var dataChannelOptions =
    {
        reliable: true
    };
    var dataChannel
       = peerConnection.createDataChannel("myChannel", dataChannelOptions);

    // Can be used only when is in open state
    dataChannel.onopen = function ()
    {
        dataChannel.send("My channel !!!");
    };
    dataChannel.onmessage = function (event)
    {
        var msgData = event.data;
        console.info("Got My Data Channel Message:", msgData, dataChannel);
    };*/
}

