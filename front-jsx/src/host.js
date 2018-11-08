import './css/host.css';
import React from 'react';
import * as io from 'socket.io-client';
import Chart from './charts/Chart';
import Tweet from 'react-twitter-widgets';



// Initialize tag search
let ChooseTagComponent = require('./chooseTag');

// Import dependencies for socket io !
const url = 'http://localhost:3001';
let socket = io(url);


// Initialize the map
let mapboxgl = require('mapbox-gl');
mapboxgl.accessToken = 'pk.eyJ1IjoiYmxvdXNzb3UiLCJhIjoiY2pqb2Q2anFzMDBjMjNybnk2enN2Y3BoaCJ9.v3omfZADZsl8zbc5rL3C9w';



export default class HostComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            tweetList: {},
            map: '',
            marker: [],
            reset: false,
        }
        this.socket = socket;
        this.onUnload = this.onUnload.bind(this);

    }

    render() {
        return (
            <div id="page">
                <div id="title">
                    <h1>Votre Tag : {this.state.tag}</h1>
                    <ChooseTagComponent onChoose={(newTag) => this.onChoose(newTag)} />
                    <button id="reset" onClick={() => this.reset()}>Reset</button>
                </div>
                <div id="flex-carte">
                    <div id='carte'></div>
                </div>
                <div id="chart">
                    <Chart tag={this.state.tag} socket={socket} reset={this.state.reset} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        // Init the method wich stop the stream when sb is living the page
        window.addEventListener("beforeunload", this.onUnload);
        // geojson containing the tag 
        let geojson = {
            type: 'FeatureCollection',
            features: []
        };


        let map = new mapboxgl.Map({
            container: 'carte',
            style: 'mapbox://styles/mapbox/streets-v10',
            center: [2.349014, 48.864716],
            zoom: 3
        });

        this.setState({ map: map });

        socket.on('tweet', (tweet) => {
            var newFeatures = geojson.features;
            newFeatures.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: tweet.coordinates
                },
                properties: {
                    id: tweet.id,
                    title: tweet.location,
                    description: tweet.text
                }
            });
            geojson.features = newFeatures;
            this.setState({ tweetList: geojson });
            this.state.tweetList.features.forEach((marker) => {

                // create a HTML element for each feature
                var el = document.createElement('div');
                el.className = 'marker';

                // make a marker for each feature and add to the map
                var mark = new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'));
                mark.addTo(this.state.map);
                // Add marker to the marker list
                var marker = this.state.marker;
                marker.push(mark);
                this.setState({ marker: marker });
            });
        })
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload);
    }

    onUnload(event) { // the method that will be used for both add and remove event
        event.returnValue = "Hellooww"
        this.reset()
    }

    onChoose(newTag) {
        if (this.state.tag !== '') {
            socket.emit('unsubscribe', this.state.tag);
            var marker = this.state.marker;
            marker.forEach((mark) => {
                mark.remove();
            })
            this.setState({
                tag: newTag,
                reset: true,
                tweetList: {},
                marker: []
            });
            socket.emit('subscribe', newTag);
            socket.emit('newTag', newTag);

        }
        else {
            this.set(newTag)
        }
    }

    set(newTag) {
        this.setState({
            tag: newTag,
            reset: false
        });
        socket.emit('subscribe', newTag);
        socket.emit('newTag', newTag);
    }

    reset() {
        if (this.state.tag !== '') {
            socket.emit('unsubscribe', this.state.tag);
            var marker = this.state.marker;
            marker.forEach((mark) => {
                mark.remove();
            })
            this.setState({
                tag: '',
                reset: true,
                tweetList: {},
                marker: []
            });
            return true;
        }
        return false
    }
}