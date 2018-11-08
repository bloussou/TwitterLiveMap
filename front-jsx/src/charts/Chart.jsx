import React, { Component } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';

import './css/Chart.css';

// Component imports
import Axes from './Axes';
import Bars from './Bars';
import ResponsiveWrapper from './ResponsiveWrapper';


class Chart extends Component {
    constructor() {
        super()
        this.xScale = scaleBand()
        this.yScale = scaleLinear()
        this.state = {
            data: []
        }
    }

    render() {
        const margins = { top: 50, right: 20, bottom: 100, left: 60 },
            svgDimensions = {
                width: Math.max(this.props.parentWidth, 300),
                height: 500
            };

        //const maxValue = Math.max(...datafrom.map(d => d.value))
        const maxValue = Math.max(...this.state.data.map(d => d[1]))

        // scaleBand type
        const xScale = this.xScale
            .padding(0.5)
            // scaleBand domain should be an array of specific values
            // in our case, we want to use movie titles
            .domain(this.state.data.map(d => d[0]))
            .range([margins.left, svgDimensions.width - margins.right])

        // scaleLinear type
        const yScale = this.yScale
            // scaleLinear domain required at least two values, min and max       
            .domain([0, maxValue])
            .range([svgDimensions.height - margins.bottom, margins.top])

        return (
            <div id="chart">

                <h4>Languages Used for : {this.props.tag}</h4>
                <svg width={svgDimensions.width} height={svgDimensions.height}>
                    <Axes
                        scales={{ xScale, yScale }}
                        margins={margins}
                        svgDimensions={svgDimensions}
                    />
                    <Bars
                        scales={{ xScale, yScale }}
                        margins={margins}
                        data={this.state.data}
                        maxValue={maxValue}
                        svgDimensions={svgDimensions}
                    />
                </svg>
            </div>
        )
    }

    componentDidMount() {
        this.props.socket.on('tweetLanguage', (lgList) => {
            this.setState({ data: lgList })
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.reset !== this.props.reset) {
            this.reInitGraphs();
        }

    }

    reInitGraphs() {
        this.setState({ data: [] })
        this.props.socket.emit('resetGraph')
    }


}

export default ResponsiveWrapper(Chart)