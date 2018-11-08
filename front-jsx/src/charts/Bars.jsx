import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { interpolateLab } from 'd3-interpolate'

export default class Bars extends Component {
    constructor(props) {
        super(props)

        this.colorScale = scaleLinear()
            .domain([0, this.props.maxValue])
            .range(['#F3E5F5', '#7B1FA2'])
            .interpolate(interpolateLab)
    }

    render() {
        const { scales, margins, data, svgDimensions } = this.props
        const { xScale, yScale } = scales
        const { height } = svgDimensions
        const bars = (
            data.map(datum =>
                <rect
                    key={datum[0]}
                    x={xScale(datum[0])}
                    y={yScale(datum[1])}
                    height={height - margins.bottom - scales.yScale(datum[1])}
                    width={xScale.bandwidth()}
                    fill={this.colorScale(datum[1])}
                />,
            )
        )

        return (
            <g>{bars}</g>
        )
    }
}
